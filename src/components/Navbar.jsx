import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plane, Menu, X } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}><Plane size={18} /></span>
            Sky<span className={styles.logoAccent}>Deals</span>
          </Link>

          <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/deals" className={styles.link}>Hot Deals</Link>
            <Link to="/about" className={styles.link}>About</Link>
            <Link to="/search" className="btn btn-primary" style={{padding:'10px 20px', fontSize:'14px'}}>
              Search Flights
            </Link>
          </div>

          <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
