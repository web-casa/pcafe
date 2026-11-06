// Conformance fixture for the virtual clock. One marker for every kind of animation the kit uses;
// scripts/video-selftest.mjs checks each one against its expected value on exact frames.
// If a Motion or Chromium upgrade breaks capture, this is what catches it.
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { LineChart } from '../../kit'
import { useCount } from '../../kit/chart-util'
import type { VideoDef } from '../../video'

const CSS = `
@keyframes vprobe { from { left: 0; } to { left: 1000px; } }
@keyframes vprobe-loop { from { left: 0; } to { left: 1000px; } }
.vp-row { position: absolute; left: 120px; height: 40px; width: 40px; background: var(--accent); }
.vp-css { top: 120px; animation: vprobe 1s linear 0.5s both; }
.vp-loop { top: 220px; animation: vprobe-loop 1s linear infinite; }
.vp-transition { top: 320px; left: 0; transition: left 1s linear; }
`
const box = (top: number): React.CSSProperties => ({ position: 'absolute', top, width: 40, height: 40, left: 120, background: 'var(--accent)' })

function Probes() {
  const [flip, setFlip] = useState(false)
  const [late, setLate] = useState(false)
  const raf = useRef<HTMLDivElement>(null)
  const waapi = useRef<HTMLDivElement>(null)
  const clockText = useRef<HTMLDivElement>(null)
  const count = useCount(1000, { delay: 0, duration: 1000 })
  useEffect(() => {
    const t = setTimeout(() => setFlip(true), 500)
    waapi.current!.animate([{ left: '0px' }, { left: '1000px' }], { duration: 1000, delay: 250, fill: 'both', easing: 'linear' })
    const t0 = performance.now()
    let id = 0
    const tick = (now: number) => {
      raf.current!.style.left = `${now - t0}px`
      clockText.current!.textContent = String(Date.now() - new Date(0).getTime())
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(id)
    }
  }, [])
  return (
    <div className="slide" style={{ position: 'absolute', inset: 0 }}>
      <style>{CSS}</style>
      <div id="p-css" className="vp-row vp-css" />
      <div id="p-loop" className="vp-row vp-loop" />
      <div id="p-transition" className="vp-row vp-transition" style={{ left: flip ? 1000 : 0 }} />
      <div id="p-waapi" ref={waapi} style={box(420)} />
      <div id="p-raf" ref={raf} style={box(520)} />
      {/* Opacity runs on Motion's WAAPI path, x on its JS path. */}
      <motion.div id="p-mo-waapi" style={box(620)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: 'linear', delay: 0.5 }} />
      <motion.div id="p-mo-js" style={box(720)} initial={{ x: 0 }} animate={{ x: 1000 }} transition={{ duration: 1, ease: 'linear', delay: 0.5 }} />
      {/* A second animation that only starts once the first reports completion (the finish event path). */}
      <motion.div
        id="p-mo-chain"
        style={box(820)}
        initial={{ opacity: 0 }}
        animate={{ opacity: late ? 0.25 : 1 }}
        transition={{ duration: 0.5, ease: 'linear' }}
        onAnimationComplete={() => setLate(true)}
      />
      <div id="p-count" style={{ position: 'absolute', left: 1400, top: 120, fontSize: 60 }}>{count}</div>
      <div id="p-date" ref={clockText} style={{ position: 'absolute', left: 1400, top: 220, fontSize: 30 }} />
    </div>
  )
}

export const video: VideoDef = {
  title: 'clock selftest',
  size: '16:9',
  fps: 30,
  theme: 'amber',
  scenes: [
    { id: 'probes', duration: 3, noFacts: true, render: () => <Probes />, transition: 'cut' },
    {
      id: 'kit',
      duration: 3,
      noFacts: true,
      transition: 'fade',
      caption: '自检用：一个真实模板叠一条字幕',
      render: () => <LineChart kicker="自检" title="真实模板的动画" lead="这一屏只用来测确定性，数字没有意义。" x={['1', '2', '3', '4', '5']} series={[{ name: 'x', values: [1, 2, 4, 8, 16], focus: true }]} source="自检，示意数据" />,
    },
  ],
}
