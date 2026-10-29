// Each line's own emoji, so a face stays put as long as its line does.

// The first match wins: specific things before general feelings.
const KEYWORD_FACES: [RegExp, string][] = [
  [/border-radius|rounder/, '⭕'],
  [/whitespace/, '⬜'],
  [/shade of blue/, '🔵'],
  [/grey|palette|gradient|colou?r|dark mode/, '🎨'],
  [/pixel|kerning|contrast/, '🔍'],
  [/figma|dribbble|portfolio|design system/, '🖼️'],
  [/font|comic sans/, '🔤'],
  [/napkin|drawing|boxes and arrows|whiteboard/, '✏️'],
  [/icon|button/, '🔘'],
  [/safari|browser|tabs/, '🧭'],
  [/css|z-index|\bdiv\b|responsive/, '📦'],
  [/react|useeffect|framework/, '⚛️'],
  [/typescript/, '🟦'],
  [/\bnpm\b|\bdeps\b/, '📦'],
  [/console\.log|\blogs?\b/, '📜'],
  [/yaml|terraform/, '📜'],
  [/docker|container|\bpod\b/, '🐳'],
  [/cloud/, '☁️'],
  [/pipeline|\bci\b|green/, '🚦'],
  [/dashboard|gantt|chart|roadmap|slides|percentage/, '📊'],
  [/\bssl\b|secrets/, '🔐'],
  [/pager|on-call|\bpaged?\b|incident/, '📟'],
  [/uptime|health check|replicas|scaling/, '📈'],
  [/\bdns\b|server|\bprod\b|\bapi\b|endpoint|\b200\b/, '🌐'],
  [/\bsql\b|query|\bindex\b|migration|\borm\b|explain|\bnull\b|cache|database/, '🗄️'],
  [/race condition|\bbugs?\b/, '🐛'],
  [/\btests?\b|tested/, '🧪'],
  [/\bgo\b|microservices|hacker news/, '💭'],
  [/merge|branch|\bmain\b|commit|\bgit\b|ctrl\+z|stash|\bpr\b/, '🌿'],
  [/deploy|\bship\b|rolling back|roll back|hotfix|pushed|pushing/, '🚀'],
  [/\bfire\b|burn/, '🔥'],
  [/coffee|\btea\b|snack|sandwich|lunch|pizza/, '☕'],
  [/meeting|\bsync\b|standup|sprint|backlog|ticket/, '📅'],
  [/\bceo\b|client|\bsales\b|\beod\b|\beta\b/, '📞'],
  [/legal|lawyer|\bhr\b|jail|ethics/, '⚖️'],
  [/resume|resign|new job|vacation|exit plan|goat farmer/, '🏃'],
  [/pray|priest|\bluck\b|\bhopes?\b/, '🙏'],
  [/slack|reply-all|muting/, '💬'],
  [/sleep|asleep|\bbed\b|weekend/, '😴'],
  [/high five|victory|nailed|rockstar|great work|fantastic|competence|shine|showtime/, '🙌'],
  [/\bno\b|\bnope\b|hard pass|absolutely not|not doing/, '🙅'],
  [/not my|not it|\bbye\b|fled|fleeing|leave me/, '🫥'],
  [/\bwhy\b|\bwhat\b|\bwhich\b|\bwhere\b|\bwho\b|\?/, '🤔'],
]

// An emoji the line already carries (🔥, 🏀, ✨...) is its face.
const EMOJI = /\p{Extended_Pictographic}(?:‍\p{Extended_Pictographic}|️)*/u

// The same line always lands on the same face of its set.
function hashOf(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

export function faceFor(line: string, frames: string[]): string {
  const own = line.match(EMOJI)?.[0]
  if (own) return own
  const lower = line.toLowerCase()
  const hit = KEYWORD_FACES.find(([pattern]) => pattern.test(lower))
  if (hit) return hit[1]
  return frames[hashOf(line) % frames.length] ?? '🙂'
}
