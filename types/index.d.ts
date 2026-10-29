export type MoodId =
  | 'panic'
  | 'dread'
  | 'annoyed'
  | 'confused'
  | 'bored'
  | 'excited'
  | 'flattered'
  | 'neutral'

export type RoleId = 'manager' | 'designer' | 'frontend' | 'backend' | 'devops'

export type Phase = 'react' | 'work' | 'done'

// How a row is drawn: the manager, someone on the job, or someone watching.
export type Stance = 'boss' | 'busy' | 'idle'

export type Member = {
  role: RoleId
  stance: Stance
  // Each person's own mood: from the part of the prompt about their area, or from the handoff.
  mood: MoodId
  frames: string[]
  line: string
  // The pass on which a busy member got the ball (0: from the prompt itself).
  since: number
  // Just handed the ball: still reacting, not yet working.
  fresh: boolean
}

export type Team = {
  phase: Phase
  // The manager's mood, read from the whole prompt.
  mood: MoodId
  involved: RoleId[]
  members: Member[]
  passes: number
  // How the turn ended, once it has: the done lines are drawn from it.
  reason?: 'answer' | 'aborted' | 'error' | 'refusal'
}

// One story of the day's digest.
export type NewsItem = {
  headline: string
  // Two lines: what it is, and what it means for the use case.
  summary: string[]
  // The story's own link, from its feed.
  url: string
  source: string
  // The story's title as its feed gave it, so it is not picked again another day.
  title: string
}

// The AI-news side on the left: one story of the day's digest, the next one at each prompt.
export type News = {
  // Absent while no digest is written yet.
  item?: NewsItem
  // Its place in the digest, from 1, and the digest's size.
  index?: number
  count?: number
  // When the digest was written, 'YYYY-MM-DD HH:MM' (UTC).
  at: string
  isLoading: boolean
  error?: string
}

declare module 'claude-code' {
  interface PluginState {
    'sidh-mod': { team: Team | null; news: News | null }
  }
}
