import { useEffect, useRef } from 'react'
import { content } from '../content'
import { onStory, scrollToId } from '../store'
import { fade } from '../lib/timeline'
import { PANELS, typedCount, wordIndexAt } from '../three/story'

// Fixed text panels over the canvas. Opacity is driven imperatively from the
// same damped progress the 3D scene uses, so text and motion stay locked.
export default function Overlay() {
  const panels = useRef({})
  const typed = useRef()
  const wordNum = useRef()
  const wordNote = useRef()
  const bar = useRef()

  useEffect(() => {
    let last = -1
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
      wordNum.current.textContent = `${String(wi + 1).padStart(2, '0')} / ${String(content.skills.length).padStart(2, '0')}`
      wordNote.current.textContent = content.skills[wi].note
      bar.current.style.transform = `scaleX(${Math.min(1, p)})`
    })
  }, [])

  const panel = (id) => ({ ref: (el) => (panels.current[id] = el), className: `panel panel-${id}` })

  return (
    <div className="overlay">
      <div className="progress" ref={bar} />

      <section {...panel('hero')}>
        <p className="eyebrow">{content.role}</p>
        <h1>{content.name}</h1>
        <p className="lede">{content.tagline}</p>
        <p className="hint">Scroll to explore</p>
      </section>

      <section {...panel('typing')}>
        <div className="terminal">
          <span className="prompt">~ $</span>
          <span ref={typed} />
          <span className="caret" />
        </div>
      </section>

      <section {...panel('explode')}>
        <p className="eyebrow">What I'm made of</p>
        <ol className="layers">
          {content.layers.map((l) => (
            <li key={l.title}>
              <h3>{l.title}</h3>
              <p>{l.text}</p>
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
        <h2>Let's build something great.</h2>
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
