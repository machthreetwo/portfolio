import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Text } from '@react-three/drei'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import font from '@fontsource/martian-mono/files/martian-mono-latin-500-normal.woff?url'
import { story } from '../store'
import { clamp01, easeInOutCubic, lerp, segment } from '../lib/timeline'
import { CAP_H, GAP, HOME_Y, KEYS } from './layout'
import { FRAMES, PRESS_WIDTH } from './story'

const TAU = Math.PI * 2
const MAX_DELAY = 0.25 // left→right cascade when keys change formation

const PALETTE = {
  alpha: { cap: '#e9e6df', legend: '#26272b' },
  mod: { cap: '#3b3e45', legend: '#d6d6da' },
  accent: { cap: '#e8573a', legend: '#fff3ee' },
}
const GLOW = new THREE.Color('#ff6a3d')

// Tapered keycap: a rounded box whose top face is inset, cached per key width.
const capCache = new Map()
function capGeometry(w) {
  if (capCache.has(w)) return capCache.get(w)
  const g = new RoundedBoxGeometry(w - GAP, CAP_H, 1 - GAP, 3, 0.07)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const inset = 0.07 * ((pos.getY(i) + CAP_H / 2) / CAP_H)
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setX(i, x - Math.sign(x) * Math.min(inset, Math.abs(x)))
    pos.setZ(i, z - Math.sign(z) * Math.min(inset, Math.abs(z)))
  }
  capCache.set(w, g)
  return g
}

// Pose = [x, y, z, rx, ry, rz, float]; `float` scales the idle bob.
function buildPoses(k) {
  const [j0, j1, j2, j3] = k.jitter
  const poses = {
    home: [k.x, HOME_Y, k.z, 0, 0, 0, 0],
    exploded: [k.x * 1.06, HOME_Y + 3 + j0 * 0.3, k.z * 1.2, j1 * 0.25, j2 * 0.25, j3 * 0.25, 1],
  }
  k.words.forEach((slot, wi) => {
    poses[`w${wi}`] = slot ? [...slot.pos, Math.PI / 2, 0, 0, 0] : [...k.cloud, 1]
  })
  return poses
}

const isWord = (s) => s[0] === 'w'

// Scratch pose shared by all keycaps; each useFrame fully overwrites it.
const v = new Array(7).fill(0)

function Keycap({ k }) {
  const group = useRef()
  const material = useRef()
  const base = useRef()
  const alts = useRef({})
  const poses = useMemo(() => buildPoses(k), [k])
  const altLetters = useMemo(() => [...new Set(k.words.map((s) => s?.alt).filter(Boolean))], [k])
  const delay = ((k.x + 7.5) / 15) * MAX_DELAY
  const colors = PALETTE[k.kind]

  useFrame(({ clock }) => {
    const p = story.current
    const { a, b, f } = segment(FRAMES, p)
    const e = a === b ? 0 : easeInOutCubic(clamp01((f - delay) / (1 - MAX_DELAY)))
    const A = poses[a]
    const B = poses[b]
    for (let j = 0; j < 7; j++) v[j] = lerp(A[j], B[j], e)

    // Flip once while flying into / between words — this hides the legend swap.
    const travels = Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) > 0.3
    if (a !== b && (isWord(a) || isWord(b)) && travels) v[3] += TAU * e

    v[1] += Math.sin(clock.elapsedTime * 1.2 + k.i * 0.7) * 0.08 * v[6]

    let press = 0
    for (const t of k.presses) press = Math.max(press, 1 - Math.abs(p - t) / PRESS_WIDTH)
    v[1] -= 0.14 * press

    group.current.position.set(v[0], v[1], v[2])
    group.current.rotation.set(v[3], v[4], v[5])
    material.current.emissiveIntensity = press * 2.2

    const shown = e < 0.5 ? a : b
    const alt = isWord(shown) ? k.words[+shown.slice(1)]?.alt : null
    if (base.current) base.current.visible = !alt
    for (const ch of altLetters) if (alts.current[ch]) alts.current[ch].visible = ch === alt
  })

  const legend = {
    font,
    position: [0, CAP_H / 2 + 0.003, 0],
    rotation: [-Math.PI / 2, 0, 0],
    color: colors.legend,
    anchorX: 'center',
    anchorY: 'middle',
  }

  return (
    <group ref={group}>
      <mesh geometry={capGeometry(k.w)}>
        <meshPhysicalMaterial
          ref={material}
          color={colors.cap}
          roughness={0.5}
          clearcoat={0.25}
          clearcoatRoughness={0.5}
          emissive={GLOW}
          emissiveIntensity={0}
        />
      </mesh>
      {k.label && (
        <Text ref={base} {...legend} fontSize={k.label.length > 1 ? 0.12 : 0.27}>
          {k.label}
        </Text>
      )}
      {altLetters.map((ch) => (
        <Text key={ch} ref={(el) => (alts.current[ch] = el)} {...legend} fontSize={0.27} visible={false}>
          {ch}
        </Text>
      ))}
    </group>
  )
}

function Switches() {
  const housing = useRef()
  const stem = useRef()

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    KEYS.forEach((k, i) => {
      housing.current.setMatrixAt(i, m.makeTranslation(k.x, 0.46, k.z))
      stem.current.setMatrixAt(i, m.makeTranslation(k.x, 0.69, k.z))
    })
    housing.current.instanceMatrix.needsUpdate = true
    stem.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={housing} args={[undefined, undefined, KEYS.length]} frustumCulled={false}>
        <boxGeometry args={[0.58, 0.3, 0.58]} />
        <meshStandardMaterial color="#1b1c1f" roughness={0.45} />
      </instancedMesh>
      <instancedMesh ref={stem} args={[undefined, undefined, KEYS.length]} frustumCulled={false}>
        <boxGeometry args={[0.14, 0.16, 0.14]} />
        <meshStandardMaterial color="#e8573a" roughness={0.4} emissive="#e8573a" emissiveIntensity={0.3} />
      </instancedMesh>
    </>
  )
}

// Y offsets for [case, plate, switches] in each body state.
const BODY = { home: [0, 0, 0], exploded: [-1.8, 0.45, 1.6], sink: [-40, -40, -40] }
const bodyState = (s) => (isWord(s) ? 'sink' : s)

function Body() {
  const caseRef = useRef()
  const plateRef = useRef()
  const switchRef = useRef()
  const caseGeo = useMemo(() => new RoundedBoxGeometry(15.9, 0.7, 5.9, 6, 0.28), [])

  useFrame(() => {
    const { a, b, f } = segment(FRAMES, story.current)
    const e = easeInOutCubic(f)
    const A = BODY[bodyState(a)]
    const B = BODY[bodyState(b)]
    caseRef.current.position.y = -0.05 + lerp(A[0], B[0], e)
    plateRef.current.position.y = 0.28 + lerp(A[1], B[1], e)
    switchRef.current.position.y = lerp(A[2], B[2], e)
  })

  return (
    <>
      <group ref={caseRef}>
        <mesh geometry={caseGeo}>
          <meshPhysicalMaterial color="#2a2c31" metalness={0.9} roughness={0.32} clearcoat={0.4} />
        </mesh>
        <ContactShadows position={[0, -0.36, 0]} scale={26} blur={2.6} far={7} opacity={0.65} resolution={512} />
      </group>
      <mesh ref={plateRef}>
        <boxGeometry args={[15.2, 0.06, 5.2]} />
        <meshStandardMaterial color="#8b8e95" metalness={1} roughness={0.3} />
      </mesh>
      <group ref={switchRef}>
        <Switches />
      </group>
    </>
  )
}

export default function Keyboard() {
  const root = useRef()

  useFrame(({ clock }) => {
    const heroWeight = 1 - clamp01(story.current / 0.1)
    root.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.14 * heroWeight
  })

  return (
    <group ref={root}>
      <Body />
      {KEYS.map((k) => (
        <Keycap key={k.i} k={k} />
      ))}
    </group>
  )
}
