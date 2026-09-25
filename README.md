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

## Features

- Scroll story: typing → exploded layers → keycaps spelling skills → reassembly, with a Mach 0 → 3.2 HUD
- Type on your physical keyboard (or hover/tap the 3D keys) and the matching keys press down
- Responsive camera: every shot declares what must stay in frame; portrait screens get their own framing and a vertical word layout
- Boot loader, scroll reveals, tilt cards and a stack ticker

## How it works

| File | Purpose |
|---|---|
| `src/three/story.js` | Scroll storyboard: keyframe timings, camera shots, overlay panel ranges |
| `src/three/layout.js` | Generates the 60% keyboard, word slots, cloud positions and typing schedule |
| `src/three/Keyboard.jsx` | Keycaps, switches, plate and case, animated every frame from scroll progress |
| `src/three/Scene.jsx` | Canvas, procedural studio lighting, camera rig |
| `src/components/Overlay.jsx` | Fixed HTML text synced to the same progress value |
| `src/store.js` | Damped scroll progress, layout mode, loader and typing events shared by the scene and the HTML |
| `src/components/Loader.jsx` | Boot sequence shown while the 3D scene loads |

Tip: append `?p=0.5` to the URL to freeze the story at that point, which is useful when tweaking a shot.
