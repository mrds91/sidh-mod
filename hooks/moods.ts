import type { Member, MoodId, Phase, RoleId, Team } from '../types'
import { BOSS_PASS_LINES, BOSS_WORK_LINES, DONE_LINES, MOOD_LINES, PASS_LINES, RECEIVE_LINES, RECEIVE_MOODS, ROLE_LINES } from './lines'
import type { EndReason, ReceiveMood } from './lines'

type Mood = {
  id: MoodId
  // Words in the prompt that set this mood off; the mood with the most hits wins.
  triggers: RegExp[]
  frames: string[]
}

export const MOODS: Mood[] = [
  {
    id: 'panic',
    triggers: [/\burgent\b/, /\basap\b/, /\bprod(uction)?\b/, /\bdown\b/, /\bhotfix\b/, /\bcritical\b/, /\bright now\b/, /\bdeadline\b/, /\btoday\b/, /\bbroken\b/, /!!+/],
    frames: ['😱', '🙀', '😰', '🔥'],
  },
  {
    id: 'dread',
    triggers: [/\brewrite\b/, /\bmigrat/, /\blegacy\b/, /\bentire\b/, /\beverything\b/, /\bwhole\b/, /\bfrom scratch\b/, /\bmonolith\b/, /\bregex\b/, /\btimezone/, /\bcobol\b/],
    frames: ['😨', '😧', '💀', '😵‍💫'],
  },
  {
    id: 'annoyed',
    triggers: [/\bfix\b/, /\bbug/, /\berror\b/, /\bagain\b/, /\bstill\b/, /\bdoesn'?t work\b/, /\bnot working\b/, /\bwhy\b/, /\bcrash/, /\bfail/, /\bflaky\b/],
    frames: ['😒', '🙄', '😤', '😮‍💨'],
  },
  {
    id: 'confused',
    triggers: [/\?{2,}/, /\bsomehow\b/, /\bsomething\b/, /\bmaybe\b/, /\bkind of\b/, /\bsort of\b/, /\bmagic\b/, /\bjust make it\b/, /\bwhatever\b/, /\byou know\b/],
    frames: ['🤨', '🤔', '😕', '🧐'],
  },
  {
    id: 'bored',
    triggers: [/\brename\b/, /\btypo\b/, /\bformat/, /\blint/, /\bcomment/, /\bdocs?\b/, /\breadme\b/, /\bbump\b/, /\bupdate (the )?version\b/, /\bindent/],
    frames: ['😐', '😑', '🥱', '😴'],
  },
  {
    id: 'excited',
    triggers: [/\bnew\b/, /\bbuild\b/, /\bcreate\b/, /\bfeature\b/, /\bgame\b/, /\bai\b/, /\banimat/, /\bprototype\b/, /\bexperiment/, /\bcool\b/, /\bfun\b/, /\bmod\b/],
    frames: ['🤩', '😃', '🚀', '✨'],
  },
  {
    id: 'flattered',
    triggers: [/\bplease\b/, /\bthanks?\b/, /\bthank you\b/, /\bappreciate\b/, /\bawesome\b/, /\bgreat job\b/, /\bkindly\b/],
    frames: ['😊', '🥰', '😌', '🫶'],
  },
  {
    id: 'neutral',
    triggers: [],
    frames: ['🙂', '😶', '🙂', '☕'],
  },
]

type Role = {
  id: Exclude<RoleId, 'manager'>
  label: string
  // Words that make the job this person's job.
  triggers: RegExp[]
  workFrames: string[]
}

export const ROLES: Role[] = [
  {
    id: 'designer',
    label: 'designer',
    triggers: [/\bdesign/, /\bui\b/, /\bux\b/, /\bcolou?r/, /\bfont/, /\blayout\b/, /\bicon/, /\blogo\b/, /\bfigma\b/, /\bmockup/, /\banimat/, /\bemoji/, /\btheme\b/, /\bpretty\b/, /\blook/, /\bdashboard/],
    workFrames: ['🎨', '🖌️', '🧑‍🎨', '📐'],
  },
  {
    id: 'frontend',
    label: 'front-end',
    triggers: [/\bfront-?end\b/, /\breact\b/, /\bvue\b/, /\bangular\b/, /\bcss\b/, /\bhtml\b/, /\bbutton/, /\bpage\b/, /\bcomponent/, /\bform\b/, /\bbrowser\b/, /\bui\b/, /\bscreen\b/, /\bmodal\b/, /\bresponsive\b/, /\bdashboard/, /\bchart/],
    workFrames: ['👩‍💻', '⌨️', '🧩', '🖥️'],
  },
  {
    id: 'backend',
    label: 'back-end',
    triggers: [/\bback-?end\b/, /\bapi\b/, /\bdatabase\b/, /\bdb\b/, /\bsql\b/, /\bserver\b/, /\bendpoint/, /\bauth/, /\bquery\b/, /\bschema\b/, /\bmigrat/, /\bcache\b/, /\bqueue\b/, /\bpython\b/, /\bjava\b/],
    workFrames: ['🧑‍💻', '🗄️', '⚙️', '🐛'],
  },
  {
    id: 'devops',
    label: 'dev-ops',
    triggers: [/\bdev-?ops\b/, /\bdeploy/, /\bdocker/, /\bkubernetes\b/, /\bk8s\b/, /\bci\b/, /\bpipeline/, /\bprod(uction)?\b/, /\bserver\b/, /\bcloud\b/, /\baws\b/, /\bazure\b/, /\binfra/, /\bnginx\b/, /\bdown\b/, /\bmonitor/],
    workFrames: ['👷', '🚢', '🛠️', '📈'],
  },
]

const BOSS_FRAMES = ['🧑‍💼', '📢', '🧑‍💼', '👉']
const BOSS_WORK_FRAMES = ['🧑‍💼', '👀', '☕', '📊']
const BOSS_DONE_FRAMES = ['🧑‍💼', '👏', '🧑‍💼', '👏']
const IDLE_FRAMES = ['😌', '☕', '😌', '📱']
const IDLE_WORK_FRAMES = ['☕', '😌', '📱', '☕']
const PASSED_FRAMES = ['🏀', '😌', '🙌', '😌']

export const DONE_FRAMES: Record<EndReason, string[]> = {
  answer: ['😮‍💨', '😎', '🎉', '😎'],
  aborted: ['😤', '🫠', '😑', '🫠'],
  error: ['😵', '💥', '😭', '😵'],
  refusal: ['🙅', '😬', '🙅', '😬'],
}

// One shuffled deck per pool: every line in a pool is said once before any is said again.
const decks = new Map<string, string[]>()
const lastDrawn = new Map<string, string>()

function shuffled(key: string, pool: string[]): string[] {
  const deck = [...pool]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j] as string, deck[i] as string]
  }
  // A fresh deck never opens with the line the last one closed on.
  if (deck.length > 1 && deck[deck.length - 1] === lastDrawn.get(key)) {
    deck.unshift(deck.pop() as string)
  }
  return deck
}

// `avoid` holds lines already on screen, so two people never say the same thing at once.
export function draw(key: string, pool: string[], avoid: Set<string> = new Set()): string {
  let deck = decks.get(key) ?? []
  let at = deck.findLastIndex(line => !avoid.has(line))
  if (at < 0) {
    // The leftovers stay on top, to be said first once they are off screen.
    deck = [...shuffled(key, pool), ...deck]
    at = deck.findLastIndex(line => !avoid.has(line))
  }
  // A pool smaller than the team: someone has to repeat.
  const [line] = deck.splice(at < 0 ? deck.length - 1 : at, 1) as [string]
  decks.set(key, deck)
  lastDrawn.set(key, line)
  avoid.add(line)
  return line
}

// Starts each member at a different face so the team does not move in lockstep.
function rotate(frames: string[], by: number): string[] {
  const k = by % frames.length
  return [...frames.slice(k), ...frames.slice(0, k)]
}

export function classify(text: string): Mood {
  const lower = text.toLowerCase()
  let best = MOODS[MOODS.length - 1] as Mood
  let bestHits = 0
  for (const mood of MOODS) {
    const hits = mood.triggers.filter(t => t.test(lower)).length
    if (hits > bestHits) {
      best = mood
      bestHits = hits
    }
  }
  return best
}

// Who the job lands on; a job that names nobody's area lands on every engineer.
export function assign(text: string): RoleId[] {
  const lower = text.toLowerCase()
  const hit = ROLES.filter(r => r.triggers.some(t => t.test(lower))).map(r => r.id)
  return hit.length > 0 ? hit : ROLES.map(r => r.id)
}

export function labelOf(role: RoleId): string {
  return role === 'manager' ? 'manager' : (ROLES.find(r => r.id === role)?.label ?? role)
}

// A prompt's clauses, so each role can react to the part about its own area.
function clausesOf(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\band\b|\bthen\b|\balso\b|\bplus\b|[,.;:\n]/)
    .map(c => c.trim())
    .filter(Boolean)
}

// A role's own mood: from the clauses naming its area, else from the whole prompt.
export function moodFor(role: Role, text: string): Mood {
  const own = clausesOf(text).filter(c => role.triggers.some(t => t.test(c)))
  const mood = own.length > 0 ? classify(own.join(' ')) : undefined
  return mood && mood.id !== 'neutral' ? mood : classify(text)
}

const fill = (line: string, from: RoleId, to: RoleId) =>
  line.replaceAll('{from}', labelOf(from)).replaceAll('{to}', labelOf(to))

export function teamFor(text: string): Team {
  const boss = classify(text)
  const involved = assign(text)
  const said = new Set<string>()
  const member = (m: Pick<Member, 'role' | 'stance' | 'mood' | 'frames' | 'line'>): Member => ({ ...m, since: 0, fresh: false })
  return {
    phase: 'react',
    mood: boss.id,
    involved,
    passes: 0,
    members: [
      member({ role: 'manager', stance: 'boss', mood: boss.id, frames: BOSS_FRAMES, line: draw(`boss:${boss.id}`, MOOD_LINES[boss.id].boss, said) }),
      ...ROLES.map((r, i): Member => {
        if (!involved.includes(r.id)) {
          return member({ role: r.id, stance: 'idle', mood: 'neutral', frames: rotate(IDLE_FRAMES, i), line: draw(`idle:${r.id}`, ROLE_LINES[r.id].idle, said) })
        }
        const mood = moodFor(r, text)
        return member({ role: r.id, stance: 'busy', mood: mood.id, frames: rotate(mood.frames, i), line: draw(`team:${mood.id}`, MOOD_LINES[mood.id].team, said) })
      }),
    ],
  }
}

// A busy member past the first shock: their role's work faces and lines.
function working(m: Member, i: number, said: Set<string>): Member {
  const role = ROLES.find(r => r.id === m.role)
  if (!role) return { ...m, frames: BOSS_WORK_FRAMES, line: draw('boss:work', BOSS_WORK_LINES, said) }
  if (m.stance === 'idle') return { ...m, frames: rotate(IDLE_WORK_FRAMES, i) }
  return { ...m, fresh: false, frames: rotate(role.workFrames, i), line: draw(`work:${role.id}`, ROLE_LINES[role.id].work, said) }
}

export function teamAt(team: Team, phase: Exclude<Phase, 'react'>, reason: EndReason = 'answer'): Team {
  const said = new Set(team.members.filter(m => m.stance === 'idle').map(m => m.line))
  if (phase === 'work') {
    return { ...team, phase, members: team.members.map((m, i) => working(m, i, said)) }
  }
  const done = DONE_LINES[reason]
  return {
    ...team,
    phase,
    reason,
    members: team.members.map((m, i): Member =>
      m.stance === 'boss'
        ? { ...m, frames: BOSS_DONE_FRAMES, line: draw(`boss:done:${reason}`, done.boss, said) }
        : { ...m, fresh: false, frames: rotate(DONE_FRAMES[reason], i), line: draw(`done:${reason}`, done.team, said) },
    ),
  }
}

// How a handed ball lands: annoyance most often, excitement least.
const RECEIVE_WEIGHTS: Record<ReceiveMood, number> = { annoyed: 3, dread: 2, confused: 2, excited: 1 }

function receiveMood(): ReceiveMood {
  let roll = Math.random() * RECEIVE_MOODS.reduce((sum, m) => sum + RECEIVE_WEIGHTS[m], 0)
  for (const m of RECEIVE_MOODS) {
    roll -= RECEIVE_WEIGHTS[m]
    if (roll < 0) return m
  }
  return 'annoyed'
}

// The member holding the ball longest finishes and passes it to the next role down the line
// (designer, front-end, back-end, dev-ops, and round again), preferring one not already on it.
export function passBall(team: Team): Team {
  const order = ROLES.map(r => r.id as RoleId)
  const busy = team.members.filter(m => m.stance === 'busy')
  const passer = [...busy].sort((a, b) => a.since - b.since || order.indexOf(a.role) - order.indexOf(b.role))[0]
  if (!passer || team.phase !== 'work') return team

  const at = order.indexOf(passer.role)
  const after = [...order.slice(at + 1), ...order.slice(0, at)]
  const to = after.find(r => !busy.some(m => m.role === r)) ?? (after[0] as RoleId)
  const mood = receiveMood()
  const frames = (MOODS.find(m => m.id === mood) as Mood).frames
  const passes = team.passes + 1
  const said = new Set(team.members.filter(m => m.role !== passer.role && m.role !== to && m.stance !== 'boss').map(m => m.line))

  return {
    ...team,
    passes,
    members: team.members.map((m, i): Member => {
      if (m.stance === 'boss') return { ...m, frames: BOSS_WORK_FRAMES, line: fill(draw('boss:pass', BOSS_PASS_LINES, said), passer.role, to) }
      if (m.role === passer.role) return { ...m, stance: 'idle', mood: 'neutral', fresh: false, frames: rotate(PASSED_FRAMES, i), line: fill(draw('pass', PASS_LINES, said), passer.role, to) }
      if (m.role === to) return { ...m, stance: 'busy', mood, since: passes, fresh: true, frames: rotate(frames, i), line: fill(draw(`recv:${mood}`, RECEIVE_LINES[mood], said), passer.role, to) }
      return m
    }),
  }
}

// The deck a row draws from, given the phase and the row's stance.
function poolOf(team: Team, m: Member): [string, string[]] {
  if (team.phase === 'done') {
    const done = DONE_LINES[team.reason ?? 'answer']
    return m.stance === 'boss' ? [`boss:done:${team.reason ?? 'answer'}`, done.boss] : [`done:${team.reason ?? 'answer'}`, done.team]
  }
  const role = m.role as Exclude<RoleId, 'manager'>
  if (m.stance === 'idle') return [`idle:${role}`, ROLE_LINES[role].idle]
  if (team.phase === 'react') return m.stance === 'boss' ? [`boss:${m.mood}`, MOOD_LINES[m.mood].boss] : [`team:${m.mood}`, MOOD_LINES[m.mood].team]
  return m.stance === 'boss' ? ['boss:work', BOSS_WORK_LINES] : [`work:${role}`, ROLE_LINES[role].work]
}

// Everyone says something new from the deck they already draw from; `keep` rows, and a catcher still reacting, stay as they are.
export function refreshLines(team: Team, keep: Set<RoleId> = new Set()): Team {
  const stays = (m: Member) => keep.has(m.role) || m.fresh
  const said = new Set(team.members.filter(stays).map(m => m.line))
  return { ...team, members: team.members.map(m => (stays(m) ? m : { ...m, line: draw(...poolOf(team, m), said) })) }
}

// Whoever just caught the ball gets over it and starts working.
export function settle(team: Team): Team {
  const said = new Set(team.members.filter(m => !m.fresh).map(m => m.line))
  return { ...team, members: team.members.map((m, i) => (m.fresh ? working(m, i, said) : m)) }
}
