import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function labelTexture(f) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 1024, 512)
  gr.addColorStop(0, f.dark); gr.addColorStop(0.5, f.main); gr.addColorStop(1, f.dark)
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 512)
  g.strokeStyle = f.glow; g.lineWidth = 6
  for (let i = 0; i < 6; i++) { g.globalAlpha = 0.35; g.beginPath(); g.moveTo(0, 60 + i * 80); g.lineTo(1024, 20 + i * 80); g.stroke() }
  g.globalAlpha = 1; g.textAlign = 'center'; g.fillStyle = '#fff'
  g.shadowColor = f.glow; g.shadowBlur = 30
  g.font = '900 120px Arial Black, Arial, sans-serif'; g.fillText('NJR RABBY', 256, 250)
  g.font = '700 46px Arial, sans-serif'; g.fillText(f.name, 256, 330)
  g.font = '600 28px Arial, sans-serif'; g.fillText('ENERGY DRINK', 256, 385)
  g.fillText('NJR RABBY', 768, 260)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t
}

function Can({ flavor, still, mouse }) {
  const ref = useRef(); const tex = useMemo(() => labelTexture(flavor), [flavor])
  const lathe = useMemo(() => {
    const p = [[0.001, 1.25], [0.78, 1.25], [0.8, 1.2], [0.86, 1.1], [0.95, 1.0], [1, 0.95]].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(p, 64)
  }, [])
  useFrame((s, d) => {
    if (!ref.current) return
    if (!still) ref.current.rotation.y += d * 0.5
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.current.y * 0.15, 0.05)
  })
  const metal = { metalness: 1, roughness: 0.22, color: '#c9c9d6' }
  return (
    <Float speed={still ? 0 : 1.5} floatIntensity={0.4}>
      <group ref={ref}>
        <mesh><cylinderGeometry args={[1, 1, 1.9, 64, 1, true]} /><meshStandardMaterial {...metal} color={flavor.main} roughness={0.3} side={THREE.DoubleSide} /></mesh>
        <mesh><cylinderGeometry args={[1.003, 1.003, 1.7, 64, 1, true]} /><meshStandardMaterial map={tex} metalness={0.6} roughness={0.35} /></mesh>
        <mesh geometry={lathe}><meshStandardMaterial {...metal} /></mesh>
        <mesh geometry={lathe} scale={[1, -1, 1]}><meshStandardMaterial {...metal} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 1.27, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.5, 0.03, 12, 40]} /><meshStandardMaterial {...metal} /></mesh>
      </group>
    </Float>
  )
}

export default function CanScene({ flavor, still, mobile, mouse }) {
  return (
    <Canvas dpr={mobile ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.3, 5.2], fov: 40 }} gl={{ antialias: !mobile, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 2, 3]} color={flavor.glow} intensity={30} />
      <pointLight position={[-3, -1, 2]} color="#3b82f6" intensity={14} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4} position={[0, 3, 3]} scale={[8, 1.5, 1]} color={flavor.glow} />
        <Lightformer form="rect" intensity={3} position={[-4, 0, 2]} scale={[1.5, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[4, 0, -2]} scale={[1.5, 6, 1]} color="#60a5fa" />
      </Environment>
      <Can flavor={flavor} still={still} mouse={mouse} />
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.4, 1.55, 64]} /><meshBasicMaterial color={flavor.glow} /></mesh>
      <mesh position={[0, -1.61, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.4, 64]} /><meshBasicMaterial color={flavor.dark} transparent opacity={0.7} /></mesh>
      {!still && <Sparkles count={mobile ? 25 : 60} scale={[5, 5, 3]} size={3} speed={0.4} color={flavor.glow} />}
    </Canvas>
  )
}
