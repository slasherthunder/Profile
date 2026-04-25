import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const EXPERIENCES = [
  {
    initials: 'AC',
    avatarBg: '#1a3a5c',
    avatarColor: '#7eb8f0',
    accent: '#2b7fd4',
    company: 'App Coders / Designers Club',
    role: 'Founder and President',
    period: '2023–Present',
    type: 'Torrey Pines High',
    badgeText: 'Leadership',
    badgeBg: '#ddeeff',
    badgeColor: '#1a5fa5',
  },
  {
    initials: 'PT',
    avatarBg: '#1a2e1a',
    avatarColor: '#88c855',
    accent: '#4a8a18',
    company: 'Peer Tutoring Club',
    role: 'President and Active Tutor',
    period: '2024–Present',
    type: 'Torrey Pines High',
    badgeText: 'Service',
    badgeBg: '#e0f2cc',
    badgeColor: '#2d6010',
  },
  {
    initials: 'ES',
    avatarBg: '#2a2a1a',
    avatarColor: '#e8c96a',
    accent: '#b8860b',
    company: 'ESL Integrated Math 1',
    role: 'Teaching Assistant',
    period: '2024–2025',
    type: 'Torrey Pines High',
    badgeText: 'Education',
    badgeBg: '#f5efd6',
    badgeColor: '#6b5a12',
  },
  {
    initials: 'UC',
    avatarBg: '#1a1a28',
    avatarColor: '#93c5fd',
    accent: '#2563eb',
    company: 'University of Chicago Medical School',
    role: 'Research Assistant, Department of Radiology',
    period: '2024',
    type: 'Radiology',
    badgeText: 'Research',
    badgeBg: '#e0e7ff',
    badgeColor: '#1e3a8a',
  },
]

// Constants for layout
const CW = 200 // Card Width
const SEGS = 12 // Number of rope segments
const SEG_LEN = 15 // Length of each segment
const GRAVITY = 0.6
const DAMPING = 0.98
const STIFFNESS = 0.5

const STAGE_H = 600

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.pin = false
  }
  step() {
    if (this.pin) return
    const vx = (this.x - this.px) * DAMPING
    const vy = (this.y - this.py) * DAMPING
    this.px = this.x
    this.py = this.y
    this.x += vx
    this.y += vy + GRAVITY
  }
}

class Rod {
  constructor(a, b, l) {
    this.a = a
    this.b = b
    this.l = l
  }
  solve() {
    const dx = this.b.x - this.a.x,
      dy = this.b.y - this.a.y
    const d = Math.sqrt(dx * dx + dy * dy) || 0.001
    const f = ((d - this.l) / d) * STIFFNESS
    const ox = dx * f,
      oy = dy * f
    if (!this.a.pin) {
      this.a.x += ox
      this.a.y += oy
    }
    if (!this.b.pin) {
      this.b.x -= ox
      this.b.y -= oy
    }
  }
}

export default function ExperienceSection() {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const dataRef = useRef([])
  const [stageWidth, setStageWidth] = useState(800)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const handleResize = () => setStageWidth(el.offsetWidth || 800)
    handleResize()

    const ro = new ResizeObserver(handleResize)
    ro.observe(el)
    window.addEventListener('resize', handleResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useLayoutEffect(() => {
    let waitRaf = 0
    let tickRaf = 0
    let cancelled = false
    let attempts = 0
    let teardown = () => {}

    const bootstrap = () => {
      if (cancelled) return

      const canvas = canvasRef.current
      const stage = stageRef.current
      if (!canvas || !stage) {
        if (attempts++ < 90) waitRaf = requestAnimationFrame(bootstrap)
        return
      }

      if (EXPERIENCES.some((_, i) => !dataRef.current[i]?.el)) {
        if (attempts++ < 90) waitRaf = requestAnimationFrame(bootstrap)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        if (attempts++ < 90) waitRaf = requestAnimationFrame(bootstrap)
        return
      }

      const cleanups = []

      const getStageCoords = (t) => {
        const rect = stage.getBoundingClientRect()
        return { x: t.clientX - rect.left, y: t.clientY - rect.top }
      }

      EXPERIENCES.forEach((exp, i) => {
        const existing = dataRef.current[i]
        const el = existing?.el
        if (!el) return

        const gap = stageWidth / (EXPERIENCES.length + 1)
        const pinX = gap * (i + 1)
        const pinY = 20

        const pts = []
        const rods = []

        for (let j = 0; j <= SEGS; j++) {
          const p = new Particle(pinX, pinY + j * SEG_LEN)
          if (j === 0) p.pin = true
          pts.push(p)
          if (j > 0) rods.push(new Rod(pts[j - 1], pts[j], SEG_LEN))
        }

        const card = {
          x: pinX - CW / 2,
          y: pinY + SEGS * SEG_LEN,
          dragging: false,
          grabDx: 0,
          grabDy: 0,
        }

        el.style.transform = `translate3d(${card.x}px, ${card.y}px, 0)`
        el.style.zIndex = String(10 + i)

        const onDown = (e) => {
          card.dragging = true
          const t = e.touches ? e.touches[0] : e
          const { x, y } = getStageCoords(t)
          card.grabDx = x - card.x
          card.grabDy = y - card.y
          el.style.zIndex = '100'
          e.preventDefault()
        }

        const onMove = (e) => {
          if (!card.dragging) return
          const t = e.touches ? e.touches[0] : e
          const { x, y } = getStageCoords(t)
          card.x = x - card.grabDx
          card.y = y - card.grabDy
          pts[SEGS].x = card.x + CW / 2
          pts[SEGS].y = card.y
          e.preventDefault()
        }

        const onUp = () => {
          if (!card.dragging) return
          card.dragging = false
          el.style.zIndex = String(10 + i)
        }

        el.addEventListener('mousedown', onDown)
        el.addEventListener('touchstart', onDown, { passive: false })
        window.addEventListener('mousemove', onMove)
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('mouseup', onUp)
        window.addEventListener('touchend', onUp)

        cleanups.push(() => {
          el.removeEventListener('mousedown', onDown)
          el.removeEventListener('touchstart', onDown)
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('touchmove', onMove)
          window.removeEventListener('mouseup', onUp)
          window.removeEventListener('touchend', onUp)
        })

        dataRef.current[i] = { el, pts, rods, card, accent: exp.accent }
      })

      const tick = () => {
        if (cancelled || !canvasRef.current) return
        const c = canvasRef.current
        ctx.clearRect(0, 0, c.width, c.height)

        dataRef.current.forEach((data) => {
          if (!data) return
          const { pts, rods, card, el, accent } = data

          for (let it = 0; it < 5; it++) rods.forEach((r) => r.solve())
          pts.forEach((p) => p.step())

          if (!card.dragging) {
            card.x = pts[SEGS].x - CW / 2
            card.y = pts[SEGS].y
          } else {
            pts[SEGS].x = card.x + CW / 2
            pts[SEGS].y = card.y
          }

          el.style.transform = `translate3d(${card.x}px, ${card.y}px, 0)`

          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          for (let j = 1; j < pts.length; j++) {
            ctx.lineTo(pts[j].x, pts[j].y)
          }
          ctx.strokeStyle = accent
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.stroke()

          ctx.fillStyle = '#94a3b8'
          ctx.beginPath()
          ctx.arc(pts[SEGS].x, pts[SEGS].y, 5, 0, Math.PI * 2)
          ctx.fill()
        })

        tickRaf = requestAnimationFrame(tick)
      }

      tickRaf = requestAnimationFrame(tick)
      teardown = () => cleanups.forEach((fn) => fn())
    }

    waitRaf = requestAnimationFrame(bootstrap)

    return () => {
      cancelled = true
      cancelAnimationFrame(waitRaf)
      cancelAnimationFrame(tickRaf)
      teardown()
    }
  }, [stageWidth])

  return (
    <section id="experience" className="mx-auto w-full max-w-7xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 md:p-12">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Curriculum Vitae</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Experience</h2>
        </div>

        <div
          ref={stageRef}
          className="relative h-[600px] w-full rounded-3xl border border-dashed border-slate-300 bg-white/40"
        >
          <canvas
            ref={canvasRef}
            width={stageWidth}
            height={STAGE_H}
            className="pointer-events-none absolute inset-0"
          />

          {EXPERIENCES.map((exp, i) => (
            <div
              key={`${exp.company}-${exp.role}`}
              ref={(node) => {
                if (node) {
                  dataRef.current[i] = { ...dataRef.current[i], el: node }
                }
              }}
              className="absolute left-0 top-0 select-none overflow-hidden bg-white shadow-2xl"
              style={{
                width: CW,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                touchAction: 'none',
                willChange: 'transform',
              }}
            >
              {/* Card Header */}
              <div
                className="relative flex h-24 items-center justify-center"
                style={{ backgroundColor: exp.avatarBg }}
              >
                <div
                  className="absolute top-0 h-full w-full opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${exp.accent} 1px, transparent 0)`,
                    backgroundSize: '12px 12px',
                  }}
                />
                <div
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/50 text-xl font-bold text-white shadow-inner"
                  style={{ backgroundColor: exp.accent }}
                >
                  {exp.initials}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 pt-6 text-center">
                <h3 className="mb-1 text-lg font-black leading-tight text-slate-800">{exp.company}</h3>
                <p className="mb-4 text-xs font-medium text-blue-600">{exp.role}</p>

                <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3 text-left text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ISSUED</span>{' '}
                    <span className="font-bold text-slate-700">{exp.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DEPT</span>{' '}
                    <span className="font-bold text-slate-700">{exp.type}</span>
                  </div>
                </div>

                <div
                  className="mt-4 rounded-md border-2 py-1.5 text-[9px] font-black uppercase tracking-widest"
                  style={{
                    borderColor: exp.badgeBg,
                    color: exp.badgeColor,
                    backgroundColor: `${exp.badgeBg}33`,
                  }}
                >
                  {exp.badgeText}
                </div>
              </div>

              {/* The "Lanyard Hole" */}
              <div className="absolute left-1/2 top-2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/20" />
            </div>
          ))}
        </div>

        <p className="mt-8 animate-pulse text-center text-sm font-medium text-slate-400">
          ↑ Grab a badge to inspect details
        </p>
      </div>
    </section>
  )
}
