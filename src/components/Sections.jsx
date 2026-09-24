import { content } from '../content'

const pad = (n) => String(n).padStart(2, '0')

const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export function Work() {
  return (
    <section id="work" className="page">
      <p className="eyebrow">Selected work</p>
      <h2>Things I've built</h2>
      <div className="grid">
        {content.projects.map((p, i) => (
          <a key={p.title} className="card" href={p.link} target="_blank" rel="noreferrer">
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

export function Awards() {
  return (
    <section id="awards" className="page page-tight">
      <p className="eyebrow">Hackathons</p>
      <ul className="awards">
        {content.awards.map((a) => (
          <li key={a.title + a.where}>
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
  return (
    <section id="contact" className="page contact">
      <p className="eyebrow">Contact</p>
      <h2>
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
