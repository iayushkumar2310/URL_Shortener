import { randomInt } from 'node:crypto'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateShortCode(length = 7): string {
  return Array.from({ length }, () => alphabet[randomInt(alphabet.length)]).join('')
}
