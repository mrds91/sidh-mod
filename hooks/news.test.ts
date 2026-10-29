import { expect, test } from 'claude-code/testing'

import { briefPrompt, dayOf, MAX_ITEMS, parseFeed, pickShares, toDigest } from './news'
import type { Story } from './news'

const NOW = Date.parse('2026-10-29T12:00:00Z')

test('a feed yields its stories from the past week only, each with its link', async () => {
  const xml = `<rss><channel>
    <item><title><![CDATA[A new model ships]]></title><link>https://example.com/a?x=1&amp;y=2</link><description>&lt;p&gt;Faster &amp; cheaper&lt;/p&gt;</description><pubDate>Tue, 27 Oct 2026 10:00:00 GMT</pubDate></item>
    <item><title>Old news</title><link>https://example.com/old</link><pubDate>Mon, 01 Sep 2026 10:00:00 GMT</pubDate></item>
    <item><title>No link</title><pubDate>Tue, 27 Oct 2026 10:00:00 GMT</pubDate></item>
  </channel></rss>`
  const stories = parseFeed('OpenAI', xml, NOW)
  expect(stories.map(s => s.title)).toEqual(['A new model ships'])
  expect(stories[0]?.summary).toBe('Faster & cheaper')
  expect(stories[0]?.url).toBe('https://example.com/a?x=1&y=2')
})

test('an Atom feed reads too, its link from href', async () => {
  const xml = `<feed><entry><title>Agents, rethought</title><link rel="alternate" href="https://example.com/agents"/><summary>Plan, act, check</summary><published>2026-10-28T09:00:00Z</published></entry></feed>`
  expect(parseFeed('DeepMind', xml, NOW).map(s => s.url)).toEqual(['https://example.com/agents'])
})

const STORIES: Story[] = [
  { source: 'DeepMind', title: 'Gemini 4 Carbon', summary: '', url: 'https://deepmind.google/g4', at: NOW },
  { source: 'Hacker News', title: 'A skill goes viral', summary: '', url: 'https://github.com/x/skill', at: NOW, points: 900 },
]

test('the digest keeps one item per story, each with its two summary lines and its own link', async () => {
  const reply = [
    'Here is the digest:',
    '#2 | 🔥 Viral: A skill goes viral | A Claude Code skill that writes tests. | Drop it into your agents to cover new tools.',
    '#1 | 🧠 Model: Gemini 4 Carbon ships | A faster, cheaper model from DeepMind. | Worth a side-by-side on your agent evals.',
    '#2 | duplicate | of story two | dropped',
    '#7 | 🧠 Model: invented | not given | dropped',
  ].join('\n')
  const items = toDigest(reply, STORIES)
  expect(items.map(i => i.title)).toEqual(['A skill goes viral', 'Gemini 4 Carbon'])
  expect(items[0]?.headline).toBe('🔥 Viral: A skill goes viral')
  expect(items[0]?.summary).toEqual(['A Claude Code skill that writes tests.', 'Drop it into your agents to cover new tools.'])
  expect(items[0]?.url).toBe('https://github.com/x/skill')
  expect(toDigest('no format at all', STORIES)).toEqual([])
})

test('a digest holds 25 stories at most', async () => {
  const many: Story[] = Array.from({ length: 30 }, (_, i) => ({ source: 'HN', title: `s${i}`, summary: '', url: `https://x.dev/${i}`, at: NOW }))
  const reply = many.map((_, i) => `#${i + 1} | h | what | why`).join('\n')
  expect(toDigest(reply, many).length).toBe(MAX_ITEMS)
  expect(MAX_ITEMS).toBe(25)
})

test('a digest belongs to its UTC day', async () => {
  expect(dayOf(NOW)).toBe('2026-10-29')
})

test('the prompt names the use case and numbers the stories', async () => {
  const p = briefPrompt(STORIES, 'voice bots', '2026-10-29')
  expect(p).toContain('Their use case: voice bots')
  expect(p).toContain('2. [Hacker News 900 points')
})

test('a blog post with no points still reaches the model, beside Hacker News', async () => {
  const hn: Story[] = Array.from({ length: 50 }, (_, i) => ({ source: 'Hacker News', title: `hn${i}`, summary: '', url: `https://x.dev/${i}`, at: NOW, points: 100 + i }))
  const blog: Story[] = Array.from({ length: 9 }, (_, i) => ({ source: 'NVIDIA', title: `nv${i}`, summary: '', url: `https://nv.dev/${i}`, at: NOW - i * 1000 }))
  const picked = pickShares([...hn, ...blog])
  expect(picked.filter(s => s.source === 'NVIDIA').map(s => s.title)).toEqual(['nv0', 'nv1', 'nv2', 'nv3', 'nv4', 'nv5'])
  expect(picked.filter(s => s.source === 'Hacker News').length).toBe(36)
  expect(picked[0]?.title).toBe('hn49')
})
