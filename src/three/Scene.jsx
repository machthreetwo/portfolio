import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, story, view } from '../store'
import { easeInOutCubic, lerp, segment } from '../lib/timeline'
import Keyboard from './Keyboard'
import { CAMERA } from './story'

const BG = '#0b0b0d'
const FOG = [24, 48]

const pick = (shot) => (view.portrait && shot.portrait ? shot.portrait : shot)
const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(35 / 2))

function CameraRig() {
  const parallax = useRef({ x: 0, y: 0 })

  useFrame(({ camera, size, scene }, dt) => {
    const aspect = size.width / size.height
    view.portrait = aspect < 0.95

    const { a, b, f } = segment(CAMERA, story.current)
    const e = easeInOutCubic(f)
    const A = pick(a)
    const B = pick(b)
    const par = parallax.current
    const k = 1 - Math.exp(-dt * 3)
    par.x += (pointer.x - par.x) * k
    par.y += (pointer.y - par.y) * k

    const look = [0, 1, 2].map((i) => lerp(A.look[i], B.look[i], e))
    const offset = [0, 1, 2].map((i) => lerp(A.pos[i], B.pos[i], e) - look[i])
    const dist = Math.hypot(...offset)

    // Pull back until the shot's required width/height is visible.
    const visH = 2 * dist * HALF_FOV
    const fitW = lerp(A.fitW, B.fitW, e)
    const fitH = lerp(A.fitH, B.fitH, e)
    const zoom = Math.max(1, fitW / (visH * aspect), fitH / visH)
    scene.fog.near = FOG[0] * zoom
    scene.fog.far = FOG[1] * zoom

    camera.position.set(
      look[0] + offset[0] * zoom + par.x * 0.8,
      look[1] + offset[1] * zoom + par.y * 0.5,
      look[2] + offset[2] * zoom,
    )
    camera.lookAt(look[0], look[1], look[2])
  })

  return null
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [8.5, 6.5, 10.5], near: 0.1, far: 200 }}
      // Events come from #root so keys stay hoverable under the HTML overlay.
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
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
