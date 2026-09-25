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

// Layout mode shared with the 3D scene (portrait stacks words vertically, etc).
export const view = { portrait: false }

// Fires once the 3D scene has its assets and has rendered.
const readyListeners = new Set()
export const sceneState = { ready: false }
export function onSceneReady(fn) {
  if (sceneState.ready) fn()
  else readyListeners.add(fn)
  return () => readyListeners.delete(fn)
}
export function markSceneReady() {
  if (sceneState.ready) return
  sceneState.ready = true
  readyListeners.forEach((fn) => fn())
}

// Characters typed on the physical keyboard, for the hero echo.
const typeListeners = new Set()
export const onType = (fn) => (typeListeners.add(fn), () => typeListeners.delete(fn))
export const emitType = (ch) => typeListeners.forEach((fn) => fn(ch))
