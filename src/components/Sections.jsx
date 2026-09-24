import { content } from '../content'

export function Work() {
  return (
    <section id="work" className="page">
      <p className="eyebrow">Selected work</p>
      <h2>Things I've built</h2>
      <div className="grid">
        {content.projects.map((p) => (
          <a key={p.title} className="card" href={p.link}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
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

export function Contact() {
  return (
    <section id="contact" className="page contact">
      <p className="eyebrow">Contact</p>
      <h2>Have an idea? Let's talk.</h2>
      <a className="email" href={`mailto:${content.contact.email}`}>
        {content.contact.email}
      </a>
      <ul className="links">
        {content.contact.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <footer>
        © {new Date().getFullYear()} {content.name}
      </footer>
    </section>
  )
}
