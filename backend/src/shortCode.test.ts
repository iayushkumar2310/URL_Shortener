import assert from 'node:assert/strict'
import test from 'node:test'
import { generateShortCode } from './shortCode.js'

test('generates a seven-character Base62 code by default', () => {
  const code = generateShortCode()
  assert.equal(code.length, 7)
  assert.match(code, /^[0-9a-zA-Z]+$/)
})

test('supports a requested code length', () => {
  assert.equal(generateShortCode(12).length, 12)
})
