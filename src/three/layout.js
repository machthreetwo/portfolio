// A 60% keyboard generated from data. Units: 1 = one key width.
import { content } from '../content'
import { seeded } from '../lib/timeline'
import { pressTime } from './story'

export const GAP = 0.1
export const CAP_H = 0.42
export const HOME_Y = 0.8

const ALPHA = 'alpha'
const MOD = 'mod'
const ACCENT = 'accent'

const key = (label, w = 1, kind = ALPHA, ch) => ({
  label,
  w,
  kind,
  ch: ch ?? (label.length === 1 ? label.toLowerCase() : null),
})
const run = (s) => [...s].map((c) => key(c.toUpperCase()))

const ROWS = [
  [key('esc', 1, ACCENT), ...run('1234567890-='), key('delete', 2, MOD)],
  [key('tab', 1.5, MOD), ...run('qwertyuiop[]'), key('\\', 1.5)],
  [key('caps', 1.75, MOD), ...run("asdfghjkl;'"), key('return', 2.25, ACCENT, '\n')],
  [key('shift', 2.25, MOD), ...run('zxcvbnm,./'), key('shift', 2.75, MOD)],
  [
    key('ctrl', 1.25, MOD),
    key('opt', 1.25, MOD),
    key('cmd', 1.25, MOD),
    key('', 6.25, ALPHA, ' '),
    key('cmd', 1.25, MOD),
    key('opt', 1.25, MOD),
    key('fn', 1.25, MOD),
    key('ctrl', 1.25, MOD),
  ],
]

export const KEYS = []
ROWS.forEach((row, r) => {
  let x = -7.5
  for (const def of row) {
    KEYS.push({
      ...def,
      i: KEYS.length,
      x: x + def.w / 2,
      z: r - 2,
      words: content.skills.map(() => null),
      presses: [],
    })
    x += def.w
  }
})

// Skill words: each letter is claimed by its own key. Repeated letters borrow a
// spare number/symbol key and swap its legend mid-flip.
const SLOT = 1.2
const WORD_Y = 3
const isSpare = (k) => k.w === 1 && k.kind === ALPHA && !/[a-z]/.test(k.ch)

content.skills.forEach(({ word }, wi) => {
  const chars = [...word.toUpperCase()]
  const used = new Set()
  chars.forEach((ch, ci) => {
    if (ch === ' ') return
    let k = KEYS.find((k) => !used.has(k.i) && k.ch === ch.toLowerCase())
    let alt = null
    if (!k) {
      k = KEYS.find((k) => !used.has(k.i) && isSpare(k))
      alt = ch
    }
    if (!k) return
    used.add(k.i)
    const offset = (chars.length - 1) / 2 - ci
    // Landscape spells left→right; portrait stacks the letters top→bottom.
    k.words[wi] = { pos: [-offset * SLOT, WORD_Y, 0], posPortrait: [0, WORD_Y + offset * SLOT, 0], alt }
  })
})

// Keys not in the current word drift in a cloud behind it.
for (const k of KEYS) {
  const r = seeded(k.i + 1)
  const x = (r() * 2 - 1) * 16
  const y = -3 + r() * 13
  const nearWord = Math.abs(x) < 7 && y > 0.8 && y < 5.2
  const z = nearWord ? -14 - r() * 6 : -7 - r() * 10
  k.cloud = [x, y, z, r() * Math.PI * 2, r() * Math.PI * 2, r() * Math.PI * 2]
  k.jitter = [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5]
}

// Typing sequence during the top-down shot.
;[...content.typing].forEach((ch, i) => {
  const k = KEYS.find((k) => k.ch === ch.toLowerCase())
  if (k) k.presses.push(pressTime(i))
})

// Physical keyboard → 3D key, by KeyboardEvent.code (layout-independent).
const letters = (s) => [...s].map((c) => `Key${c.toUpperCase()}`)
const CODES = [
  'Escape', ...[...'1234567890'].map((d) => `Digit${d}`), 'Minus', 'Equal', 'Backspace',
  'Tab', ...letters('qwertyuiop'), 'BracketLeft', 'BracketRight', 'Backslash',
  'CapsLock', ...letters('asdfghjkl'), 'Semicolon', 'Quote', 'Enter',
  'ShiftLeft', ...letters('zxcvbnm'), 'Comma', 'Period', 'Slash', 'ShiftRight',
  'ControlLeft', 'AltLeft', 'MetaLeft', 'Space', 'MetaRight', 'AltRight', 'Fn', 'ControlRight',
]
// Live input per key index: `held` is 1 while a physical key or pointer holds it
// down; `pressed` is its smoothed value used for animation.
export const held = new Float32Array(KEYS.length)
export const pressed = new Float32Array(KEYS.length)

export const KEY_BY_CODE = Object.fromEntries(CODES.map((code, i) => [code, KEYS[i]]))
