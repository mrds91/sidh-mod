import { expect, test } from 'claude-code/testing'

import { DONE_LINES } from './lines'
import { assign, classify, draw, passBall, refreshLines, settle, teamAt, teamFor } from './moods'

test('prompts map to the team moods', async () => {
  expect(classify('URGENT: prod is down, hotfix asap!!').id).toBe('panic')
  expect(classify('rewrite the entire legacy billing system from scratch').id).toBe('dread')
  expect(classify('fix this bug again, it still crashes').id).toBe('annoyed')
  expect(classify('rename the variables and fix the typo in the readme').id).toBe('bored')
  expect(classify('build a cool new game prototype').id).toBe('excited')
  expect(classify('could you please help, thank you').id).toBe('flattered')
  expect(classify('list the files').id).toBe('neutral')
})

test('the job lands on the roles it names', async () => {
  expect(assign('change the button color on the login page')).toEqual(['designer', 'frontend'])
  expect(assign('add an index to the sql query')).toEqual(['backend'])
  expect(assign('the docker deploy pipeline is failing')).toEqual(['devops'])
  expect(assign('list the files')).toEqual(['designer', 'frontend', 'backend', 'devops'])
})

test('the manager leads, the rest are busy or idle, and all share the ending', async () => {
  const team = teamFor('add an index to the sql query')
  expect(team.members.map(m => m.role)).toEqual(['manager', 'designer', 'frontend', 'backend', 'devops'])
  expect(team.members.map(m => m.stance)).toEqual(['boss', 'idle', 'idle', 'busy', 'idle'])

  const working = teamAt(team, 'work')
  expect(working.members[3]?.frames).toContain('🗄️')

  const done = teamAt(working, 'done', 'answer')
  expect(DONE_LINES.answer.boss).toContain(done.members[0]?.line)
  expect(done.phase).toBe('done')
})

test('a pool says every line once before repeating any', async () => {
  const pool = ['a', 'b', 'c', 'd', 'e']
  const first = Array.from(pool, () => draw('test:pool', pool))
  expect([...first].sort()).toEqual(pool)
  // The next round never opens on the line the last one closed on.
  expect(draw('test:pool', pool)).not.toBe(first[first.length - 1])
})

test('each role reacts to the part of the prompt about its own area', async () => {
  const team = teamFor('migrate the database and add a new dashboard')
  const mood = (role: string) => team.members.find(m => m.role === role)?.mood
  expect(mood('backend')).toBe('dread')
  expect(mood('designer')).toBe('excited')
  expect(mood('frontend')).toBe('excited')
  expect(team.members.find(m => m.role === 'devops')?.stance).toBe('idle')
})

test('the ball goes down the line, and the catcher settles into work', async () => {
  let team = teamAt(teamFor('add an index to the sql query'), 'work')
  team = passBall(team)
  const by = (role: string) => team.members.find(m => m.role === role)
  expect(by('backend')?.stance).toBe('idle')
  expect(by('backend')?.line).toContain('dev-ops')
  expect(by('devops')?.stance).toBe('busy')
  expect(by('devops')?.fresh).toBe(true)
  expect(['annoyed', 'dread', 'confused', 'excited']).toContain(by('devops')?.mood)

  team = settle(team)
  expect(team.members.find(m => m.role === 'devops')?.fresh).toBe(false)

  // dev-ops is the end of the line: round again to the designer.
  team = passBall(team)
  expect(team.members.find(m => m.role === 'designer')?.stance).toBe('busy')
  expect(team.members.filter(m => m.stance === 'busy').length).toBe(1)
})

test('a full team thins out as each one hands off', async () => {
  let team = teamAt(teamFor('list the files'), 'work')
  expect(team.members.filter(m => m.stance === 'busy').length).toBe(4)
  team = passBall(team)
  expect(team.members.find(m => m.role === 'designer')?.stance).toBe('idle')
  expect(team.members.filter(m => m.stance === 'busy').length).toBe(3)
})

test('everyone on the job says something different', async () => {
  for (let i = 0; i < 20; i++) {
    const lines = teamFor('list the files').members.map(m => m.line)
    expect(new Set(lines).size).toBe(lines.length)
  }
})

test('every 30 seconds the team says new lines from the same decks', async () => {
  const done = teamAt(teamAt(teamFor('add an index to the sql query'), 'work'), 'done', 'error')
  const next = refreshLines(done)
  expect(next.members.map(m => m.stance)).toEqual(done.members.map(m => m.stance))
  expect(next.members.some((m, i) => m.line !== done.members[i]?.line)).toBe(true)
  expect(DONE_LINES.error.boss).toContain(next.members[0]?.line)
  for (const m of next.members.slice(1)) expect(DONE_LINES.error.team).toContain(m.line)
  expect(new Set(next.members.map(m => m.line)).size).toBe(next.members.length)

  const kept = refreshLines(done, new Set(['manager']))
  expect(kept.members[0]?.line).toBe(done.members[0]?.line)
})
