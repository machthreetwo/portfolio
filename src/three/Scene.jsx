import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, story } from '../store'
import { easeInOutCubic, lerp, segment } from '../lib/timeline'
import Keyboard from './Keyboard'
import { CAMERA } from './story'

const BG = '#0b0b0d'
const FOG = [24, 48]

function CameraRig() {
  const parallax = useRef({ x: 0, y: 0 })

  useFrame(({ camera, size, scene }, dt) => {
    const { a, b, f } = segment(CAMERA, story.current)
    const e = easeInOutCubic(f)
    const par = parallax.current
    const k = 1 - Math.exp(-dt * 3)
    par.x += (pointer.x - par.x) * k
    par.y += (pointer.y - par.y) * k

    // Pull back on narrow screens so the 15-unit-wide board still fits.
    const zoom = THREE.MathUtils.clamp(1.5 / (size.width / size.height), 1, 3.2)
    scene.fog.near = FOG[0] * zoom
    scene.fog.far = FOG[1] * zoom
    const look = [0, 1, 2].map((i) => lerp(a.look[i], b.look[i], e))
    const pos = [0, 1, 2].map((i) => look[i] + (lerp(a.pos[i], b.pos[i], e) - look[i]) * zoom)

    camera.position.set(pos[0] + par.x * 0.8, pos[1] + par.y * 0.5, pos[2])
    camera.lookAt(look[0], look[1], look[2])
  })

  return null
}

export default function Scene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 35, position: [8.5, 6.5, 10.5], near: 0.1, far: 120 }}>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, ...FOG]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-6, 10, 6]} intensity={1.1} />
      <Suspense fallback={null}>
        <Keyboard />
      </Suspense>
      {/* Procedural studio lighting — no HDR download needed. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 9, 0]} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={5} position={[-11, 3, -5]} scale={[3, 9, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd9c7" position={[11, 4, 3]} scale={[3, 7, 1]} />
        <Lightformer form="ring" intensity={0.8} position={[0, 2, 14]} scale={6} />
      </Environment>
      <CameraRig />
    </Canvas>
  )
}
