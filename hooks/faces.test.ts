import { expect, test } from 'claude-code/testing'

import { faceFor } from './faces'

test('a line keeps one face, the one its words or its own emoji call for', async () => {
  const frames = ['😒', '🙄', '😤', '😮‍💨']
  expect(faceFor('fighting about border-radius...', frames)).toBe('⭕')
  expect(faceFor('adding whitespace. More. MORE...', frames)).toBe('⬜')
  expect(faceFor('YAML. YAML everywhere. Help...', frames)).toBe('📜')
  expect(faceFor('Time to shine ✨ Try to keep up.', frames)).toBe('✨')
  expect(faceFor('Your problem now, dev-ops. 🏀', frames)).toBe('🏀')
  expect(faceFor('It worked 5 minutes ago. I swear.', frames)).not.toBe('💭')

  const plain = 'Cool. Cool cool cool. Not cool.'
  expect(frames).toContain(faceFor(plain, frames))
  expect(faceFor(plain, frames)).toBe(faceFor(plain, frames))
})
