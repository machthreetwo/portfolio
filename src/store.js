// Shared, non-React state read every frame by both the 3D scene and the HTML overlay.

// Scroll progress through the story: `target` comes from ScrollTrigger,
// `current` is damped toward it so everything moves smoothly and in sync.
export const story = { target: 0, current: 0 }

export const pointer = { x: 0, y: 0 }

export const scroller = { lenis: null }

const listeners = new Set()

export function onStory(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function tickStory(dt) {
  story.current += (story.target - story.current) * (1 - Math.exp(-dt * 9))
  if (Math.abs(story.target - story.current) < 1e-5) story.current = story.target
  listeners.forEach((fn) => fn(story.current))
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (scroller.lenis) scroller.lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'smooth' })
}
