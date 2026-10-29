import type { EngineInterface } from 'claude-code'

import type { NewsItem } from '../types'

export type Story = { source: string; title: string; summary: string; url: string; at: number; points?: number }

const DAY_MS = 24 * 60 * 60 * 1000
// Only news from the past week counts as recent.
const WINDOW_MS = 7 * DAY_MS
const MAX_PART_CHARS = 160

const FEEDS = [
  { source: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { source: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
  { source: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { source: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
  { source: 'NVIDIA', url: 'https://blogs.nvidia.com/feed/' },
  { source: 'NVIDIA Developer', url: 'https://developer.nvidia.com/blog/feed' },
]

// Hacker News is where a skill, plugin or tool going viral shows up first, and where the
// labs with no working feed of their own (Qwen, Kimi, Kaggle) are found.
const HN_QUERIES = ['claude', 'anthropic', 'openai', 'gemini', 'agent', 'mcp', 'llm', 'hugging face', 'nvidia', 'qwen', 'kimi', 'moonshot', 'kaggle']
// Each source's share of the stories the model reads, so a blog post with no points
// is not crowded out by Hacker News.
const PER_FEED = 6
const HN_SHARE = 36
const HN_MIN_POINTS = 60

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    // Feeds that escape their HTML only show their tags once unescaped.
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tag = (item: string, name: string) => decode(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(item)?.[1] ?? '')

// An RSS item's <link>url</link>, or an Atom entry's <link href="url"/>.
const linkOf = (item: string) => tag(item, 'link') || (/<link[^>]*href="([^"]+)"/.exec(item)?.[1] ?? '')

export function parseFeed(source: string, xml: string, now: number): Story[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/g) ?? []
  return items
    .map(item => ({
      source,
      title: tag(item, 'title'),
      summary: (tag(item, 'description') || tag(item, 'summary')).slice(0, 220),
      url: linkOf(item).replace(/&amp;/g, '&'),
      at: Date.parse(tag(item, 'pubDate') || tag(item, 'published') || tag(item, 'updated')),
    }))
    .filter(s => s.title && /^https?:\/\//.test(s.url) && !Number.isNaN(s.at) && now - s.at < WINDOW_MS)
}

async function fetchFeed($: EngineInterface, feed: (typeof FEEDS)[number], now: number): Promise<Story[]> {
  const r = await $.http.fetch(feed.url)
  return r.ok ? parseFeed(feed.source, r.text, now) : []
}

type HnHit = { objectID: string; title?: string; points?: number; created_at_i?: number; url?: string }

async function fetchHackerNews($: EngineInterface, query: string, now: number): Promise<Story[]> {
  const since = Math.floor((now - WINDOW_MS) / 1000)
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=6&numericFilters=created_at_i>${since},points>${HN_MIN_POINTS}`
  const r = await $.http.fetch(url)
  if (!r.ok) return []
  const hits = (JSON.parse(r.text) as { hits: HnHit[] }).hits
  return hits
    .filter(h => h.title)
    .map(h => ({
      source: 'Hacker News',
      title: h.title as string,
      summary: '',
      // The story itself; an Ask or Show HN post with no link of its own is its discussion.
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      at: (h.created_at_i ?? 0) * 1000,
      points: h.points,
    }))
}

// This week's stories, best first, leaving out any already shown.
export async function gatherStories($: EngineInterface, shown: string[]): Promise<Story[]> {
  const now = await $.clock.now()
  const results = await Promise.allSettled([
    ...FEEDS.map(f => fetchFeed($, f, now)),
    ...HN_QUERIES.map(q => fetchHackerNews($, q, now)),
  ])
  const seen = new Set(shown.map(t => t.toLowerCase()))
  const fresh = results
    .flatMap(r => (r.status === 'fulfilled' ? r.value : []))
    .filter(s => {
      const key = s.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  return pickShares(fresh)
}

// The best of each source: Hacker News by points, each blog by date, newest first.
export function pickShares(stories: Story[]): Story[] {
  const bySource = new Map<string, Story[]>()
  for (const s of stories) bySource.set(s.source, [...(bySource.get(s.source) ?? []), s])
  return [...bySource.entries()].flatMap(([source, list]) =>
    source === 'Hacker News'
      ? list.sort((a, b) => (b.points ?? 0) - (a.points ?? 0) || b.at - a.at).slice(0, HN_SHARE)
      : list.sort((a, b) => b.at - a.at).slice(0, PER_FEED),
  )
}

// The most stories a day's digest holds; each prompt shows the next one.
export const MAX_ITEMS = 25

const SYSTEM = `You write a developer's daily AI-news digest for their terminal: up to ${MAX_ITEMS} stories, the most useful to their use case first.
Pick from the numbered stories given, and only those: never invent a launch, a name or a number. Leave out any story not about AI or developer tools.
Prefer, in this order: a newly released model worth evaluating for their use case; a new architecture or
approach for building agentic applications; a skill, plugin, MCP server or developer tool going viral.
Answer with one line per story and nothing else, in this form:
#<story number> | <emoji> <Kind>: <headline, plain words> | <what it is, one sentence> | <what it means for their use case, one concrete sentence>
Kind is one of Model, Agents, Viral, Tool or News. Keep each part under ${MAX_PART_CHARS - 50} characters.`

export function briefPrompt(stories: Story[], useCase: string, today: string): string {
  const list = stories
    .map((s, i) => `${i + 1}. [${s.source}${s.points ? ` ${s.points} points` : ''}, ${new Date(s.at).toISOString().slice(0, 10)}] ${s.title}${s.summary ? ` | ${s.summary}` : ''}`)
    .join('\n')
  return `Today is ${today}.\nTheir use case: ${useCase}\n\nStories from the past week:\n${list}`
}

const clip = (s: string) => (s.length > MAX_PART_CHARS ? `${s.slice(0, MAX_PART_CHARS - 1)}…` : s)

// The model's lines, held to the digest's shape: each link is the picked story's own, never the model's.
export function toDigest(reply: string, stories: Story[]): NewsItem[] {
  const items: NewsItem[] = []
  const used = new Set<number>()
  for (const line of reply.split('\n')) {
    const m = /^#?(\d+)\s*\|(.+?)\|(.+?)\|(.+)$/.exec(line.trim())
    const n = Number(m?.[1])
    const story = m ? stories[n - 1] : undefined
    if (!m || !story || used.has(n)) continue
    used.add(n)
    const [headline, what, forYou] = [m[2], m[3], m[4]].map(s => clip((s as string).trim())) as [string, string, string]
    items.push({ headline, summary: [what, forYou], url: story.url, source: story.source, title: story.title })
    if (items.length === MAX_ITEMS) break
  }
  return items
}

// The day a digest belongs to, 'YYYY-MM-DD' (UTC).
export const dayOf = (now: number) => new Date(now).toISOString().slice(0, 10)

// One fetch and one model call: the whole day's stories, summed up.
export async function writeDigest($: EngineInterface, useCase: string, shown: string[]): Promise<{ at: string; items: NewsItem[]; error?: string }> {
  const now = await $.clock.now()
  const at = new Date(now).toISOString().slice(0, 16).replace('T', ' ')
  const stories = await gatherStories($, shown)
  if (stories.length === 0) {
    return { at, items: [], error: 'Could not reach the news sources (offline?)' }
  }
  const r = await $.model.complete({
    model: 'haiku',
    system: SYSTEM,
    prompt: briefPrompt(stories, useCase, at.slice(0, 10)),
    maxTokens: 5000,
    timeoutMs: 120000,
  })
  const items = r.isAnswered ? toDigest(r.text, stories) : []
  return items.length > 0 ? { at, items } : { at, items: [], error: 'The news model did not answer this time' }
}
