import { useEffect, useRef, useState } from 'react'
import { onSceneReady, scroller } from '../store'

const LINES = ['Initialising flight systems', 'Loading keymap · 61 keys', 'Spooling engines', 'Ready for Mach 3.2']
const MIN_MS = 1400 // long enough to read, short enough not to annoy
const MAX_MS = 8000 // never trap the page if WebGL is unavailable

// Boot sequence shown while the 3D scene streams in.
export default function Loader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const count = useRef()
  const bar = useRef()
  const lines = useRef()

  useEffect(() => {
    const start = performance.now()
    let ready = false
    let raf
    const unsub = onSceneReady(() => (ready = true))
    document.documentElement.classList.add('is-loading')

    const frame = (now) => {
      const t = now - start
      // Crawl toward 90% until the scene is ready, then finish.
      const target = ready && t > MIN_MS ? 1 : Math.min(0.9, t / MIN_MS)
      const cur = parseFloat(bar.current.dataset.v || 0)
      const next = cur + (target - cur) * 0.12
      bar.current.dataset.v = next
      bar.current.style.transform = `scaleX(${next})`
      count.current.textContent = String(Math.round(next * 100)).padStart(3, '0')
      const shown = Math.min(LINES.length, Math.floor(next * LINES.length + 0.4))
      ;[...lines.current.children].forEach((li, i) => li.classList.toggle('on', i < shown))
      if ((next > 0.995 && ready) || t > MAX_MS) {
        setDone(true)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      unsub()
    }
  }, [])

  useEffect(() => {
    if (!done) return
    document.documentElement.classList.remove('is-loading')
    scroller.lenis?.start()
    const id = setTimeout(() => setGone(true), 1000)
    return () => clearTimeout(id)
  }, [done])

  if (gone) return null
  return (
    <div className={`loader${done ? ' done' : ''}`} aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-mono">AK</span>
        <ul className="loader-lines" ref={lines}>
          {LINES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <div className="loader-foot">
          <div className="loader-track">
            <div className="loader-bar" ref={bar} />
          </div>
          <span className="loader-count" ref={count}>
            000
          </span>
        </div>
      </div>
    </div>
  )
}
