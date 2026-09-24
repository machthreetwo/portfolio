import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { content } from './content'
import { pointer, scroller, scrollToId, story, tickStory } from './store'
import Scene from './three/Scene'
import Overlay from './components/Overlay'
import { Contact, Work } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduceMotion ? null : new Lenis({ lerp: 0.1 })
    scroller.lenis = lenis
    lenis?.on('scroll', ScrollTrigger.update)

    const tick = (time, deltaMs) => {
      lenis?.raf(time * 1000)
      tickStory(deltaMs / 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: '#story',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => (story.target = self.progress),
    })

    // Debug: ?p=0.5 jumps the story to that point (handy for screenshots).
    const debugP = parseFloat(new URLSearchParams(window.location.search).get('p'))
    if (!Number.isNaN(debugP)) {
      trigger.disable()
      story.target = story.current = debugP
    }

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove)

    return () => {
      window.removeEventListener('pointermove', onMove)
      trigger.kill()
      gsap.ticker.remove(tick)
      lenis?.destroy()
      scroller.lenis = null
    }
  }, [])

  return (
    <>
      <div className="canvas-wrap">
        <Scene />
      </div>
      <Overlay />
      <nav className="nav">
        <button className="brand" onClick={() => (scroller.lenis ? scroller.lenis.scrollTo(0) : window.scrollTo(0, 0))}>
          {content.name}
        </button>
        <div>
          <button onClick={() => scrollToId('work')}>Work</button>
          <button onClick={() => scrollToId('contact')}>Contact</button>
        </div>
      </nav>
      <main>
        <div id="story" aria-hidden="true" />
        <Work />
        <Contact />
      </main>
    </>
  )
}
