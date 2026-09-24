export const clamp01 = (v) => Math.min(1, Math.max(0, v))

export const lerp = (a, b, t) => a + (b - a) * t

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Given keyframes [{ t, s }] sorted by t, find the pair surrounding `p`.
// Returns the two states and the 0–1 fraction between them.
export function segment(frames, p) {
  if (p <= frames[0].t) return { a: frames[0].s, b: frames[0].s, f: 0 }
  for (let i = 0; i < frames.length - 1; i++) {
    const A = frames[i]
    const B = frames[i + 1]
    if (p <= B.t) return { a: A.s, b: B.s, f: (p - A.t) / (B.t - A.t || 1) }
  }
  const last = frames[frames.length - 1].s
  return { a: last, b: last, f: 1 }
}

// Opacity envelope: fades in over [a, b], holds, fades out over [c, d].
export function fade(p, [a, b, c, d]) {
  if (p < a || p > d) return 0
  if (p < b) return (p - a) / (b - a)
  if (p > c) return 1 - (p - c) / (d - c)
  return 1
}

// Deterministic PRNG so the "random" layout is identical on every load.
export function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
