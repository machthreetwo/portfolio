import { useEffect, useRef } from 'react'
import { content } from '../content'
import { onStory, onType, scrollToId } from '../store'
import { fade } from '../lib/timeline'
import { PANELS, typedCount, wordIndexAt } from '../three/story'

// Stage names for the HUD, keyed by where each one starts.
const STAGES = [
  [0, 'Standby'],
  [0.14, 'Input'],
  [0.3125, 'Supersonic'], // Mach 1.00
  [0.4, 'Teardown'],
  [0.57, 'Toolkit'],
  [0.93, 'Cruise'],
]
const pad = (n) => String(n).padStart(2, '0')

// Fixed text panels over the canvas. Opacity is driven imperatively from the
// same damped progress the 3D scene uses, so text and motion stay locked.
export default function Overlay() {
  const panels = useRef({})
  const typed = useRef()
  const wordNum = useRef()
  const wordNote = useRef()
  const bar = useRef()
  const mach = useRef()
  const stage = useRef()
  const hud = useRef()
  const shock = useRef()
  const echo = useRef()
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  // Echo whatever is typed on the physical keyboard under the hero.
  useEffect(() => {
    let text = ''
    return onType((ch) => {
      text = ch === '\b' ? text.slice(0, -1) : (text + ch).slice(-24)
      echo.current.textContent = text
      echo.current.parentElement.classList.toggle('has-text', text.length > 0)
    })
  }, [])

  useEffect(() => {
    let last = -1
    let lastMach = 0
    return onStory((p) => {
      if (p === last) return
      last = p
      for (const [id, range] of Object.entries(PANELS)) {
        const el = panels.current[id]
        const o = fade(p, range)
        el.style.opacity = o
        el.style.transform = `translateY(${(1 - o) * 24}px)`
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      }
      typed.current.textContent = content.typing.slice(0, typedCount(p))
      const wi = wordIndexAt(p)
      wordNum.current.textContent = `${pad(wi + 1)} / ${pad(content.skills.length)}`
      wordNote.current.textContent = content.skills[wi].note
      bar.current.style.transform = `scaleX(${Math.min(1, p)})`
      const m = Math.min(1, p) * 3.2
      mach.current.textContent = m.toFixed(2)
      hud.current.classList.toggle('supersonic', m >= 1)
      // Breaking the sound barrier: fire the shock ring on the way up.
      if (lastMach < 1 && m >= 1) {
        shock.current.classList.remove('boom')
        void shock.current.offsetWidth
        shock.current.classList.add('boom')
      }
      lastMach = m
      stage.current.textContent = STAGES.findLast(([t]) => p >= t)[1]
    })
  }, [])

  const panel = (id) => ({ ref: (el) => (panels.current[id] = el), className: `panel panel-${id}` })
  const [first, ...rest] = content.name.split(' ')

  return (
    <div className="overlay">
      <div className="progress" ref={bar} />

      <div className="shock" ref={shock} aria-hidden="true" />

      <div className="hud" ref={hud} aria-hidden="true">
        <span className="hud-label">Mach</span>
        <span className="hud-value" ref={mach}>
          0.00
        </span>
        <span className="hud-stage" ref={stage}>
          Standby
        </span>
      </div>

      <section {...panel('hero')}>
        <p className="status">
          <span className="dot" />
          {content.status}
        </p>
        <h1>
          {first}
          <br />
          <span className="outline">{rest.join(' ')}</span>
        </h1>
        <p className="lede">{content.tagline}</p>
        <p className="eyebrow muted">{content.role}</p>
        <p className="try">
          <span className="try-hint">{canHover ? 'Try typing on your keyboard' : 'Tap the keys'}</span>
          <span className="try-echo" ref={echo} />
        </p>
      </section>

      <section {...panel('typing')}>
        <div className="terminal">
          <span className="prompt">{content.handle} ~ $</span>
          <span ref={typed} />
          <span className="caret" />
        </div>
      </section>

      <section {...panel('explode')}>
        <p className="eyebrow">Anatomy of the stack</p>
        <ol className="layers">
          {content.layers.map((l, i) => (
            <li key={l.title}>
              <span className="layer-num">{pad(i + 1)}</span>
              <div>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section {...panel('words')}>
        <p className="eyebrow">
          Toolkit <span className="counter" ref={wordNum} />
        </p>
        <p className="note" ref={wordNote} />
      </section>

      <section {...panel('final')}>
        <h2>
          Built for speed.
          <br />
          <span className="outline">Shipped for real.</span>
        </h2>
        <div className="actions">
          <button className="btn primary" onClick={() => scrollToId('work')}>
            See my work
          </button>
          <button className="btn" onClick={() => scrollToId('contact')}>
            Get in touch
          </button>
        </div>
      </section>
    </div>
  )
}
