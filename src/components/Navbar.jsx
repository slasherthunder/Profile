import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/50 bg-[#f5f5f5]/80 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-md shadow-slate-900/5' : 'shadow-none'
      }`}
    >
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#home" className="text-lg font-semibold tracking-tight text-slate-900">
          Aaron
        </a>

        <ul className="flex items-center gap-3 sm:gap-5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
