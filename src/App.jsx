import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ExperienceSection from './components/ExperienceSection'
import aboutMeImage from './assets/aboutme.png'
import beforeAboutImage from './assets/beforeabout.png'

const PROJECTS = [
  {
    cartTitle: "FALCON\nSPHERE",
    year: "'25",
    genre: 'WEB / EDUCATION',
    fullTitle: 'FalconSphere',
    desc: 'Website platform for students to easily access study material. In collaboration with San Dieguito Union High School District to publish on the district website.',
    tech: ['React', 'Web Platform', 'Education Tech', 'District Partnership'],
    link: '#',
    videoLink: 'https://www.youtube.com/watch?v=pOV8w6Uu-eY',
  },
  {
    cartTitle: "WEATHER\nAPP",
    year: "'25",
    genre: 'MOBILE / SAFETY',
    fullTitle: 'Weather App',
    desc: 'Disguised safety mobile app that enables users to discreetly seek help in dangerous situations behind a functional weather interface. Won 2nd place at UC San Diego TritonHacks Hackathon 2025.',
    tech: ['Mobile App', 'Safety UX', 'Hackathon', 'Rapid Prototyping'],
    link: 'https://youtu.be/yIYulqT0IMM?si=SG4xnkb7xV5k9JaQ',
    videoLink: 'https://youtu.be/yIYulqT0IMM?si=SG4xnkb7xV5k9JaQ',
  },
  {
    cartTitle: "FREDDY\nFLIGHT",
    year: "'24",
    genre: 'GAME / CAMPUS',
    fullTitle: 'Freddy Takes Flight',
    desc: 'Two-dimensional style video game based on Torrey Pines High School campus and mascot. Presented to San Dieguito Union High School District leadership.',
    tech: ['2D Game Dev', 'Campus Design', 'Presentation', 'Game Mechanics'],
    link: '#',
    videoLink: 'https://www.youtube.com/watch?v=KO6E3_m0J1I',
  },
  {
    cartTitle: "DODO\nVISION",
    year: "'24",
    genre: 'ANDROID / CV',
    fullTitle: 'DODO',
    desc: 'Android mobile app using computer vision to identify endangered species from photos, logging verified data for conservation research. Submitted for UC San Diego TritonHacks Hackathon 2024.',
    tech: ['Android', 'Computer Vision', 'Conservation', 'Hackathon'],
    link: '#',
    videoLink: 'https://www.youtube.com/watch?v=8mkn2xwIZjM',
  },
  {
    cartTitle: "SURF\nDEL MAR",
    year: "'25",
    genre: 'WEB / EVENTS',
    fullTitle: 'Surf Del Mar Festival',
    desc: 'Website for the Surf Del Mar Festival—event details, schedule, sponsors, and ways to get involved with the local surf community.',
    tech: ['Web Design', 'Events', 'Community', 'Responsive Layout'],
    link: 'https://surfdelmarfestival.com',
  },
  {
    cartTitle: "TUTOR\nSYNC",
    year: "'25",
    genre: 'WEB / EDUCATION',
    fullTitle: 'TutorSync - TPHS Peer Tutoring Club',
    desc: 'A web application that empowers students to connect with peer tutors, schedule personalized or group study sessions, and receive real-time academic support. The platform features an intuitive scheduling system, collaborative learning environments, and a modern interface for seamless tutor-student interactions.',
    tech: ['Web App', 'Scheduling', 'Peer Tutoring', 'Collaboration'],
    link: 'https://fir-92709.web.app',
  },
]

const BOOT_LINES = (title) => [
  '> CARTRIDGE DETECTED...',
  `> LOADING ${title.toUpperCase()}...`,
  '> INITIALIZING...',
  '> READY.',
]

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }

  return null
}

function AboutSection() {
  const [openProgress, setOpenProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dragStartY = useRef(null)
  const dragStartProgress = useRef(0)

  const updateFromY = (clientY) => {
    if (dragStartY.current === null) return
    const delta = clientY - dragStartY.current
    const newProgress = Math.min(1, Math.max(0, dragStartProgress.current + delta / 300))
    setOpenProgress(newProgress)
    if (newProgress >= 0.95) setIsOpen(true)
  }

  const handlePointerDown = (e) => {
    if (isOpen) return
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartProgress.current = openProgress
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    updateFromY(e.clientY)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    dragStartY.current = null
    if (openProgress > 0.45) {
      setOpenProgress(1)
      setIsOpen(true)
    } else {
      setOpenProgress(0)
    }
  }

  const topFlapAngle = openProgress * -110
  const bottomFlapAngle = openProgress * 110

  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-14">
      <div
        className={`relative mx-auto w-full max-w-7xl select-none ${
          isOpen ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ perspective: '1200px' }}
      >
        <div className="overflow-hidden rounded-2xl shadow-lg shadow-slate-900/10 ring-1 ring-white/50">
          <img
            src={aboutMeImage}
            alt="About me collage"
            className="block h-auto w-full object-cover"
            draggable={false}
          />
        </div>

        {!isOpen && (
          <>
          <div className="absolute inset-0 overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
            <div
              className="absolute inset-x-0 top-0 origin-top overflow-hidden rounded-t-2xl"
              style={{
                height: '50%',
                transform: `rotateX(${topFlapAngle}deg)`,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)',
                zIndex: 10,
              }}
            >
              <div className="h-full w-full overflow-hidden">
                <img
                  src={beforeAboutImage}
                  alt=""
                  className="block w-full object-cover object-top"
                  style={{ height: '200%' }}
                  draggable={false}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,${0.18 * openProgress}))`,
                }}
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-4"
                style={{
                  background: 'rgba(210,185,120,0.55)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              />
              <div className="pointer-events-none absolute bottom-30 left-0 right-0 z-20 flex justify-center px-80 text-center">
                <span
                  className="text-3xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.45)' }}
                >
                  ABOUT ME
                </span>
              </div>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 origin-bottom overflow-hidden rounded-b-2xl"
              style={{
                height: '50%',
                transform: `rotateX(${bottomFlapAngle}deg)`,
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)',
                zIndex: 10,
              }}
            >
              <div className="h-full w-full overflow-hidden">
                <img
                  src={beforeAboutImage}
                  alt=""
                  className="block w-full object-cover object-bottom"
                  style={{ height: '200%', objectPosition: 'bottom' }}
                  draggable={false}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.0), rgba(0,0,0,${0.18 * openProgress}))`,
                }}
              />
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-4"
                style={{
                  background: 'rgba(210,185,120,0.55)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              />
              <div className="pointer-events-none absolute left-0 right-0 top-40 z-20 flex justify-center px-4 text-center">
                <span
                  className="max-w-[28rem] text-lg font-semibold leading-snug text-white sm:text-xl md:text-2xl lg:text-3xl"
                  style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.4)' }}
                >
                  pull down to learn more about me!
                </span>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      <p className="mt-6 min-h-[1.25rem] text-center text-sm font-medium text-slate-500 transition-opacity duration-500">
        {isOpen ? '📦 Unboxed!' : openProgress > 0 ? 'Keep pulling...' : ''}
      </p>
    </section>
  )
}

function ProjectsSection() {
  const [activeIdx, setActiveIdx] = useState(null)
  const [bootStage, setBootStage] = useState('off')
  const [visibleLines, setVisibleLines] = useState([])
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const bootTimers = useRef([])

  const clearBootTimers = () => {
    bootTimers.current.forEach((id) => window.clearTimeout(id))
    bootTimers.current = []
  }

  const selectProject = (i) => {
    clearBootTimers()
    setIsVideoOpen(false)
    setActiveIdx(i)
    setBootStage('booting')
    setVisibleLines([])

    const lines = BOOT_LINES(PROJECTS[i].fullTitle)
    lines.forEach((line, idx) => {
      const timerId = window.setTimeout(() => {
        setVisibleLines((prev) => [...prev, line])
        if (idx === lines.length - 1) {
          const readyTimerId = window.setTimeout(() => setBootStage('ready'), 300)
          bootTimers.current.push(readyTimerId)
        }
      }, idx * 180)
      bootTimers.current.push(timerId)
    })
  }

  useEffect(() => {
    return () => {
      clearBootTimers()
    }
  }, [])

  const active = activeIdx !== null ? PROJECTS[activeIdx] : null
  const activeVideoEmbedUrl = getYouTubeEmbedUrl(active?.videoLink)

  useEffect(() => {
    if (!isVideoOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsVideoOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isVideoOpen])

  return (
    <section id="projects" className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <div
        className="rounded-3xl bg-white/45 p-8 shadow-sm shadow-slate-900/[0.06] ring-1 ring-white/70 backdrop-blur-md md:p-10"
      >
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{ background: '#0a0a0f', fontFamily: "'Share Tech Mono', monospace" }}
        >
          <p
            className="mb-8 text-center text-xs tracking-widest"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: '#f0c040',
              animation: 'blink 1.4s step-end infinite',
            }}
          >
            — SELECT PROJECT —
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PROJECTS.map((p, i) => (
              <button
                key={p.fullTitle}
                onClick={() => selectProject(i)}
                className="relative rounded-lg border-2 p-4 text-left transition-transform duration-150 hover:-translate-y-1"
                style={{
                  background: activeIdx === i ? '#1e1e38' : '#1a1a2e',
                  borderColor: activeIdx === i ? '#f0c040' : '#2a2a4a',
                }}
              >
                <span className="absolute right-2 top-2 text-xs" style={{ color: '#f0c040' }}>
                  {p.year}
                </span>
                <div className="mb-2 rounded p-2" style={{ background: '#f0c040' }}>
                  <p
                    className="whitespace-pre-line text-xs leading-relaxed"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      color: '#1a1a00',
                      fontSize: '7px',
                    }}
                  >
                    {p.cartTitle}
                  </p>
                </div>
                <p className="text-xs" style={{ color: '#888', fontSize: '10px' }}>
                  {p.genre}
                </p>
              </button>
            ))}
          </div>

          <div className="relative min-h-[280px] rounded-lg border-2 p-8" style={{ background: '#050510', borderColor: '#2a2a4a' }}>
            <div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />

            {bootStage === 'off' && (
              <div
                className="flex h-32 items-center justify-center text-xs tracking-widest"
                style={{ color: '#2a2a4a' }}
              >
                INSERT CARTRIDGE TO PLAY
              </div>
            )}

            {bootStage === 'booting' && (
              <div className="space-y-1">
                {visibleLines.map((line, i) => (
                  <p key={`${line}-${i}`} className="text-xs" style={{ color: '#00ff88', lineHeight: 2 }}>
                    {line}
                  </p>
                ))}
              </div>
            )}

            {bootStage === 'ready' && active && (
              <div>
                <p
                  className="mb-3 text-xs"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    color: '#f0c040',
                    fontSize: '11px',
                  }}
                >
                  {active.fullTitle.toUpperCase()}
                </p>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: '#aaa' }}>
                  {active.desc}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded px-2 py-1 text-xs"
                      style={{
                        background: '#1a2a1a',
                        border: '1px solid #3b6d11',
                        color: '#97C459',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={active.link}
                    className="inline-block rounded px-5 py-3 text-xs transition-opacity hover:opacity-85"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '9px',
                      background: '#f0c040',
                      color: '#1a1a00',
                    }}
                  >
                    ▶ VIEW PROJECT
                  </a>
                  {active.videoLink && (
                    <button
                      type="button"
                      onClick={() => setIsVideoOpen(true)}
                      className="inline-block rounded px-5 py-3 text-xs transition-opacity hover:opacity-85"
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '9px',
                        background: '#97C459',
                        color: '#1a1a00',
                      }}
                    >
                      ▶ PLAY VIDEO
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {bootStage === 'off' && (
            <p className="mt-3 text-center text-xs" style={{ color: '#555', letterSpacing: '1px' }}>
              ▲ click a cartridge above ▲
            </p>
          )}
        </div>
      </div>

      {isVideoOpen && activeVideoEmbedUrl && active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="w-full max-w-4xl rounded-xl border border-slate-600 bg-[#050510] p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p
                className="text-xs"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#f0c040',
                }}
              >
                {active.fullTitle.toUpperCase()} VIDEO
              </p>
              <button
                type="button"
                className="rounded px-3 py-1 text-xs"
                style={{ background: '#1e1e38', color: '#f0c040' }}
                onClick={() => setIsVideoOpen(false)}
              >
                CLOSE
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
              <iframe
                src={activeVideoEmbedUrl}
                title={`${active.fullTitle} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');
        @keyframes blink { 50% { opacity: 0.3; } }
      `}</style>
    </section>
  )
}

function PlaceholderSection({ id, title, description }) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <div className="rounded-3xl bg-white/45 p-8 shadow-sm shadow-slate-900/[0.06] ring-1 ring-white/70 backdrop-blur-md md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Placeholder Section
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">{description}</p>
      </div>
    </section>
  )
}

function SlideInSection({ direction = 'left', children }) {
  const offsetX = direction === 'left' ? -72 : 72

  return (
    <motion.div
      initial={{ opacity: 0, x: offsetX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <main className="relative z-[1] min-h-screen text-slate-900">
      <Navbar />
      <Hero />

      <SlideInSection direction="left">
        <AboutSection />
      </SlideInSection>
      <SlideInSection direction="right">
        <ProjectsSection />
      </SlideInSection>
      <SlideInSection direction="left">
        <ExperienceSection />
      </SlideInSection>
      <SlideInSection direction="right">
        <PlaceholderSection
          id="skills"
          title="Skills"
          description="Show core technical skills, tools, and domains where you have strong hands-on experience."
        />
      </SlideInSection>
      <SlideInSection direction="left">
        <PlaceholderSection
          id="resume"
          title="Resume"
          description="Embed a downloadable resume preview or a concise timeline summary of your achievements."
        />
      </SlideInSection>
      <SlideInSection direction="right">
        <PlaceholderSection
          id="contact"
          title="Contact"
          description="Add your email, LinkedIn, GitHub, and a simple message form for easy outreach."
        />
      </SlideInSection>
    </main>
  )
}

export default App
