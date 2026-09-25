import { useEffect, useRef } from 'react'
import { content } from '../content'

const pad = (n) => String(n).padStart(2, '0')

const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

// Adds `.in` to each `.reveal` child as it scrolls into view.
function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -10% 0px' },
    )
    ref.current.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

// Mouse-follow tilt + spotlight, desktop pointers only (CSS gates the effect).
function tilt(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
  el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`)
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
}
function untilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export function Work() {
  const ref = useReveal()
  return (
    <section id="work" className="page" ref={ref}>
      <p className="eyebrow reveal">Selected work</p>
      <h2 className="reveal">Things I've built</h2>
      <div className="grid">
        {content.projects.map((p, i) => (
          <a
            key={p.title}
            className="card reveal"
            style={{ '--d': `${(i % 3) * 90}ms` }}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <div className="card-top">
              <span className="card-num">{pad(i + 1)}</span>
              <span className="card-kind">{p.kind}</span>
              <Arrow />
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.badge && <p className="badge">{p.badge}</p>}
            <ul className="tags">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </a>
        ))}
      </div>
    </section>
  )
}

export function Stack() {
  // Rendered twice so the -50% loop is seamless.
  const items = [...content.stack, ...content.stack]
  return (
    <div className="ticker" aria-label={content.stack.join(', ')}>
      <div className="ticker-track" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className={i % 2 ? 'ticker-item alt' : 'ticker-item'}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Awards() {
  const ref = useReveal()
  return (
    <section id="awards" className="page page-tight" ref={ref}>
      <p className="eyebrow reveal">Hackathons</p>
      <ul className="awards">
        {content.awards.map((a, i) => (
          <li key={a.title + a.where} className="reveal" style={{ '--d': `${i * 90}ms` }}>
            <span className="award-place">{a.place}</span>
            <span className="award-title">{a.title}</span>
            <span className="award-where">{a.where}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Contact() {
  const { email, links } = content.contact
  const ref = useReveal()
  return (
    <section id="contact" className="page contact" ref={ref}>
      <p className="eyebrow reveal">Contact</p>
      <h2 className="reveal">
        Have an idea?
        <br />
        <span className="outline">Let's talk.</span>
      </h2>
      {email ? (
        <a className="email" href={`mailto:${email}`}>
          {email}
        </a>
      ) : (
        <a className="email" href={links[0].href} target="_blank" rel="noreferrer">
          @{content.handle}
        </a>
      )}
      <ul className="links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label} <Arrow />
            </a>
          </li>
        ))}
      </ul>
      <footer>
        <span>
          © {new Date().getFullYear()} {content.name}
        </span>
        <span>Mach 3.2 or nothing.</span>
      </footer>
    </section>
  )
}
