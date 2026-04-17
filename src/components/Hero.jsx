import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import headerImage from '../assets/header.png'

function Hero() {
  const introText = "Hi, I'm..."
  const nameText = 'Aaron\nNayki'
  const scrollText = 'Scroll for more info...'
  const majorText = 'Majoring in...'
  const eceText = 'E&CE'
  const atText = 'At'

  const [typedIntro, setTypedIntro] = useState('')
  const [typedName, setTypedName] = useState('')
  const [typedScroll, setTypedScroll] = useState('')
  const [typedMajor, setTypedMajor] = useState('')
  const [typedEce, setTypedEce] = useState('')
  const [typedAt, setTypedAt] = useState('')

  useEffect(() => {
    const timeouts = []
    const intervals = []

    const runTypewriter = (text, setter, delay, speed) => {
      const timeoutId = window.setTimeout(() => {
        let index = 0
        const intervalId = window.setInterval(() => {
          index += 1
          setter(text.slice(0, index))
          if (index >= text.length) {
            window.clearInterval(intervalId)
          }
        }, speed)
        intervals.push(intervalId)
      }, delay)
      timeouts.push(timeoutId)
    }

    runTypewriter(introText, setTypedIntro, 0, 75)
    runTypewriter(nameText, setTypedName, 600, 85)
    runTypewriter(scrollText, setTypedScroll, 1700, 45)
    runTypewriter(majorText, setTypedMajor, 800, 70)
    runTypewriter(eceText, setTypedEce, 1400, 120)
    runTypewriter(atText, setTypedAt, 2000, 140)

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      intervals.forEach((id) => window.clearInterval(id))
    }
  }, [])

  return (
    <section id="home" className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative"
      >
        <div className="pointer-events-none absolute left-6 top-1/2 z-20 -translate-y-1/2 text-left md:left-12 lg:left-20">
          <p className="text-base font-semibold text-slate-700 md:text-2xl">{typedIntro}</p>
          <h1 className="mt-2 whitespace-pre-line text-4xl font-black leading-[0.9] tracking-tight text-slate-900 md:text-7xl lg:text-8xl">
            {typedName}
          </h1>
          <p className="mt-4 text-xs font-semibold text-slate-600 md:mt-8 md:text-xl">
            {typedScroll}
          </p>
        </div>

        <div className="pointer-events-none absolute right-6 top-[40%] z-20 -translate-y-1/2 text-center md:right-20 lg:right-33.5">
          <p className="text-base font-semibold text-slate-700 md:text-2xl">{typedMajor}</p>
          <h2 className="mt-2 text-4xl font-black leading-[0.9] tracking-tight text-slate-900 md:text-7xl lg:text-8xl">
            {typedEce}
          </h2>
          <p className="mt-3 text-sm font-semibold text-slate-700 md:mt-5 md:text-3xl">{typedAt}</p>
        </div>

        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.04, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-10 bottom-2 -z-10 h-20 rounded-full bg-sky-200/35 blur-3xl md:inset-x-20"
        />

        <motion.img
          src={headerImage}
          alt="Aaron Nayki 3D Character"
          className="h-auto w-full rounded-3xl object-contain shadow-2xl shadow-slate-400/20"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

export default Hero
