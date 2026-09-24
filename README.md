# Portfolio

A scroll-driven 3D portfolio: a mechanical keyboard that types an intro, explodes into its layers, and rearranges its keycaps to spell out skills.

Built with Vite, React, React Three Fiber, drei, GSAP ScrollTrigger and Lenis.

## Develop

```bash
npm install
npm run dev
```

## Make it yours

Edit **`src/content.js`**: name, tagline, typing text, layer descriptions, skill words, projects and contact links. Everything else reads from it.

- Skill words are spelled by keycaps. Repeated letters borrow spare number/symbol keys automatically. Keep words to 9 characters or fewer.
- The typing text can use letters, digits, spaces and `- = [ ] \ ; ' , . /`.

## How it works

| File | Purpose |
|---|---|
| `src/three/story.js` | Scroll storyboard: keyframe timings, camera shots, overlay panel ranges |
| `src/three/layout.js` | Generates the 60% keyboard, word slots, cloud positions and typing schedule |
| `src/three/Keyboard.jsx` | Keycaps, switches, plate and case, animated every frame from scroll progress |
| `src/three/Scene.jsx` | Canvas, procedural studio lighting, camera rig |
| `src/components/Overlay.jsx` | Fixed HTML text synced to the same progress value |
| `src/store.js` | Damped scroll progress shared by the 3D scene and the overlay |

Tip: append `?p=0.5` to the URL to freeze the story at that point, which is useful when tweaking a shot.
