import React from 'react'
import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}><Plane size={14}/></span>
              Sky<span style={{color:'var(--sky-l)'}}>Deals</span>
            </Link>
            <p className={styles.tagline}>Finding the world's cheapest flights since 2024.</p>
            <p className={styles.affiliate}>
              SkyDeals earns affiliate commissions from booking partners.
              Prices are not affected. See our <Link to="/about" className={styles.aLink}>About</Link> page for details.
            </p>
          </div>
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Product</h4>
              <Link to="/">Home</Link>
              <Link to="/search">Search Flights</Link>
              <Link to="/deals">Hot Deals</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <a href="mailto:hello@skydeals.com">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className={styles.linkGroup}>
              <h4>Partners</h4>
              <a href="https://www.travelpayouts.com" target="_blank" rel="noopener noreferrer">Travelpayouts</a>
              <a href="https://partners.skyscanner.net" target="_blank" rel="noopener noreferrer">Skyscanner</a>
              <a href="https://www.kiwi.com" target="_blank" rel="noopener noreferrer">Kiwi.com</a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} SkyDeals. All rights reserved.</span>
          <span>Prices shown are indicative. Final price confirmed at booking.</span>
        </div>
      </div>
    </footer>
  )
}
