import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Member, NewsItem, Phase, Team } from '../types'
import { faceFor } from './faces'
import { labelOf, passBall, refreshLines, settle, teamAt, teamFor } from './moods'
import { dayOf, writeDigest } from './news'

const team = atom({ plugin: 'sidh-mod', key: 'team' } as const, null)
const news = atom({ plugin: 'sidh-mod', key: 'news' } as const, null)

const REACT_MS = 5000
const DONE_MS = 8000
// How long a line stays up before the team says something new (and, at work, the ball moves on).
const LINES_MS = 30000
// Wide enough for the longest role name, so every line starts in the same column.
const LABEL_WIDTH = 11
// The team's column on the right; the news takes the rest of the width.
const TEAM_WIDTH = 64
// The day's digest, where the cycle through it stands, and the titles of stories already
// in a digest (so another day does not bring them back), all kept across sessions.
const DIGEST_KEY = 'news.digest'
const CURSOR_KEY = 'news.cursor'
const SHOWN_KEY = 'news.shown'
const SHOWN_KEEP = 300
// A day whose fetch failed tries again after this long, never at every prompt.
const RETRY_MS = 30 * 60 * 1000

// `day` is the UTC day the digest was fetched for; `tried`, when it last was.
type Digest = { day: string; at: string; items: NewsItem[]; tried: number; error?: string }
type Cursor = { at: string; index: number }

let phaseTimer: Timer | null = null
let linesTimer: Timer | null = null
let settleTimer: Timer | null = null
// The fetch under way, which a second prompt waits on instead of starting its own.
let fetching: Promise<Digest> | null = null

async function show($: EngineInterface, next: Team, holdMs: number | null) {
  await update($, team, () => next)
  phaseTimer?.cancel()
  phaseTimer = holdMs === null ? null : $.clock.after(holdMs, () => void afterHold($))
  // Each new phase gets its lines' full 30 seconds before the next ones.
  linesTimer?.cancel()
  linesTimer = $.clock.every(LINES_MS, () => void newLines($))
  if (next.phase !== 'work') {
    settleTimer?.cancel()
    settleTimer = null
  }
}

async function afterHold($: EngineInterface) {
  phaseTimer = null
  const current = await read($, team)
  if (current?.phase === 'react') {
    // The first shock wears off and the team gets to work, passing the ball as it goes.
    await show($, teamAt(current, 'work'), null)
  }
  // Once done, the team stays up between prompts, its lines still changing.
}

async function newLines($: EngineInterface) {
  const current = await read($, team)
  if (!current) return
  if (current.phase !== 'work') {
    await update($, team, () => refreshLines(current))
    return
  }
  // At work the ball moves on; whoever the handoff did not touch says something new.
  const passed = passBall(current)
  const touched = new Set(passed.members.filter((m, i) => m.line !== current.members[i]?.line).map(m => m.role))
  await update($, team, () => refreshLines(passed, touched))
  settleTimer?.cancel()
  settleTimer = $.clock.after(REACT_MS, () => void settleCatch($))
}

async function settleCatch($: EngineInterface) {
  settleTimer = null
  await update($, team, t => (t?.phase === 'work' ? settle(t) : t))
}

// Today's digest: the one kept, or, once a day (or after a failed day's wait), a fresh fetch.
async function todaysDigest($: EngineInterface, useCase: string): Promise<Digest> {
  const now = await $.clock.now()
  const last = (await $.store.get(DIGEST_KEY)) as Digest | undefined
  if (last && last.day === dayOf(now) && (!last.error || now - last.tried < RETRY_MS)) return last
  fetching ??= fetchDigest($, useCase, last, now).finally(() => {
    fetching = null
  })
  return fetching
}

async function fetchDigest($: EngineInterface, useCase: string, last: Digest | undefined, now: number): Promise<Digest> {
  // The story on screen stays up, marked as refreshing, until the new digest is written.
  await update($, news, n => (n ? { ...n, isLoading: true, error: undefined } : { at: '', isLoading: true }))
  const shown = ((await $.store.get(SHOWN_KEY)) as string[] | undefined) ?? []
  const fresh = await writeDigest($, useCase, shown).catch(() => ({ at: '', items: [], error: 'Could not fetch AI news this time' }))
  // A failed fetch keeps the last digest's stories cycling, and waits before trying again.
  const digest: Digest =
    fresh.items.length > 0
      ? { day: dayOf(now), at: fresh.at, items: fresh.items, tried: now }
      : { day: dayOf(now), at: last?.at ?? '', items: last?.items ?? [], tried: now, error: fresh.error }
  await $.store.set(DIGEST_KEY, digest)
  if (!digest.error) {
    await $.store.set(SHOWN_KEY, [...digest.items.map(i => i.title), ...shown].slice(0, SHOWN_KEEP))
  }
  return digest
}

// Shows the digest's story where the cycle stands; `advance` moves it on one first.
async function showNews($: EngineInterface, useCase: string, advance: boolean) {
  const digest = await todaysDigest($, useCase)
  if (digest.items.length === 0) {
    await update($, news, n => ({ ...(n ?? { at: '' }), isLoading: false, error: digest.error }))
    return
  }
  const cursor = (await $.store.get(CURSOR_KEY)) as Cursor | undefined
  // A new digest starts from its first story.
  const index = cursor?.at === digest.at ? (cursor.index + (advance ? 1 : 0)) % digest.items.length : 0
  await $.store.set(CURSOR_KEY, { at: digest.at, index })
  await update($, news, () => ({ item: digest.items[index], index: index + 1, count: digest.items.length, at: digest.at, isLoading: false, error: digest.error }))
}

function colorOf(member: Member, phase: Phase) {
  if (member.stance === 'boss') return 'magenta'
  if (member.fresh) return 'yellow'
  return phase === 'done' ? 'green' : phase === 'work' ? 'cyan' : 'yellow'
}

export const register: Register = (on, options) => {
  const useCase = typeof options.useCase === 'string' && options.useCase.trim() ? options.useCase : 'building AI agents and agentic applications on any platform, and the developer tools around them'
  const isNewsOn = options.news !== false

  on('session.start', async ($, e, next) => {
    // A reload starts the module's timers over: drop a team they can no longer move on.
    await update($, team, () => null).catch(() => {})
    if (isNewsOn) {
      // Open on the story the cycle stopped at; a new day's first session fetches that day's digest.
      $.clock.after(0, () => void showNews($, useCase, false).catch(() => {}))
    }
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (!e.command && e.text.trim()) {
      // The animation is decoration: never hold up the prompt over it.
      await show($, teamFor(e.text), REACT_MS).catch(() => {})
      if (isNewsOn) {
        $.clock.after(0, () => void showNews($, useCase, true).catch(() => {}))
      }
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const current = await read($, team)
    if (current) {
      await show($, teamAt(current, 'done', e.reason), DONE_MS)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, team)
    const radar = isNewsOn ? await read($, news) : null
    if ((!current && !radar) || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Link, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row">
        <Box key="news" flexDirection="column" flexGrow={1} flexShrink={1} paddingRight={2}>
          {radar && (
            <>
              <Text key="news-head">
                <Text bold color="cyan">
                  📰 rAIdar
                </Text>
                <Text dimColor>
                  {radar.count ? `  ${radar.index}/${radar.count}` : ''}
                  {radar.isLoading ? '  fetching today’s digest…' : radar.at ? `  · ${radar.at} UTC` : ''}
                  {radar.error ? `  · ${radar.error}` : ''}
                </Text>
              </Text>
              {radar.item ? (
                <>
                  <Text key="news-what" bold>
                    {radar.item.headline}
                  </Text>
                  <Text key="news-sum-1">{radar.item.summary[0]}</Text>
                  {radar.item.summary[1] && (
                    <Text key="news-sum-2" color="green">
                      → {radar.item.summary[1]}
                    </Text>
                  )}
                  {/* A terminal with clickable links draws the label alone; any other adds the URL after it. */}
                  <Link key="news-url" href={radar.item.url} label={`Read on ${radar.item.source} ↗`} />
                </>
              ) : (
                radar.isLoading && <Text dimColor>Reading this week's AI launches…</Text>
              )}
            </>
          )}
        </Box>
        {current && (
          <Box key="team" flexDirection="column" width={TEAM_WIDTH} flexShrink={0}>
            <Text key="team-head" bold color="magenta">
              🎭 Dev-Team Mood
            </Text>
            {current.members.map(m => (
              <Box key={m.role}>
                {/* Fixed slots for the ball, name and face, so the line beside them never moves. */}
                <Box width={3} flexShrink={0}>
                  <Text>{m.stance === 'busy' && current.phase === 'work' ? '🏀' : ' '}</Text>
                </Box>
                <Box width={LABEL_WIDTH} flexShrink={0}>
                  <Text bold={m.stance === 'boss'} dimColor={m.stance === 'idle'}>
                    {labelOf(m.role)}
                  </Text>
                </Box>
                <Box width={4} flexShrink={0}>
                  <Text>{faceFor(m.line, m.frames)}</Text>
                </Box>
                <Text color={m.stance === 'idle' ? undefined : colorOf(m, current.phase)} dimColor={m.stance === 'idle'} italic wrap="truncate-end">
                  "{m.line}"
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    )
  })
}
