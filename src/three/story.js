// The scroll storyboard. Every value is a fraction of the #story scroll (0 → 1).
import { content } from '../content'

export const TYPE_SPAN = [0.17, 0.34]
export const WORD_SPAN = [0.6, 0.87]

const nWords = content.skills.length
const wordLen = (WORD_SPAN[1] - WORD_SPAN[0]) / nWords

// Keycap / body states. 'w0', 'w1'… are the skill-word formations.
export const FRAMES = [
  { t: 0, s: 'home' },
  { t: 0.36, s: 'home' },
  { t: 0.44, s: 'exploded' },
  { t: 0.53, s: 'exploded' },
  ...content.skills.flatMap((_, i) => [
    { t: WORD_SPAN[0] + i * wordLen, s: `w${i}` },
    { t: WORD_SPAN[0] + (i + 1) * wordLen - 0.03, s: `w${i}` },
  ]),
  { t: 0.94, s: 'home' },
  { t: 1, s: 'home' },
]

const cam = (pos, look) => ({ pos, look })
const HERO = cam([8.5, 6.5, 10.5], [0, 0, 0])
const TOP = cam([0, 16, 4], [0, 0, 0.3])
const SIDE = cam([12, 7.5, 12], [0, 1.6, 0])
const FRONT = cam([0, 3, 17], [0, 3, 0])
const END = cam([0, 8.5, 12.5], [0, 0, 0])

export const CAMERA = [
  { t: 0, s: HERO },
  { t: 0.1, s: HERO },
  { t: 0.17, s: TOP },
  { t: 0.35, s: TOP },
  { t: 0.43, s: SIDE },
  { t: 0.54, s: SIDE },
  { t: 0.61, s: FRONT },
  { t: 0.87, s: FRONT },
  { t: 0.94, s: END },
  { t: 1, s: END },
]

// Overlay panel envelopes: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd].
export const PANELS = {
  hero: [-1, -1, 0.06, 0.11],
  typing: [0.14, 0.17, 0.34, 0.37],
  explode: [0.41, 0.44, 0.53, 0.56],
  words: [0.57, 0.6, 0.85, 0.88],
  final: [0.92, 0.96, 2, 2],
}

export const wordIndexAt = (p) =>
  Math.min(nWords - 1, Math.max(0, Math.floor((p - WORD_SPAN[0]) / wordLen)))

const nTyped = content.typing.length
const typeLen = TYPE_SPAN[1] - TYPE_SPAN[0]

// Time at which character `i` of the typing text is pressed.
export const pressTime = (i) => TYPE_SPAN[0] + ((i + 0.5) / nTyped) * typeLen
export const PRESS_WIDTH = (typeLen / nTyped) * 0.9

export const typedCount = (p) =>
  Math.min(nTyped, Math.max(0, Math.floor(((p - TYPE_SPAN[0]) / typeLen) * nTyped + 0.5)))
