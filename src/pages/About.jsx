import React from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Users, Globe, ArrowRight } from 'lucide-react'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>About SkyDeals</h1>
          <p className={styles.sub}>
            SkyDeals is a flight comparison engine that helps travelers find the lowest airfares
            by searching hundreds of airlines and booking partners simultaneously.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <DollarSign size={28} className={styles.icon} />
            <h3>How We Make Money</h3>
            <p>
              SkyDeals earns a small affiliate commission (typically 1–7%) when you book through one
              of our partner links. This never increases the price you pay — in fact, we often have
              access to exclusive partner rates that are lower than booking directly.
            </p>
          </div>
          <div className={styles.card}>
            <Users size={28} className={styles.icon} />
            <h3>Our Mission</h3>
            <p>
              We believe everyone deserves affordable travel. Our search technology compares live
              prices across 200+ airlines and OTAs so you always see the real cheapest option,
              not just the ones that pay to appear first.
            </p>
          </div>
          <div className={styles.card}>
            <Globe size={28} className={styles.icon} />
            <h3>Partner Network</h3>
            <p>
              We partner with Travelpayouts, Skyscanner, Kiwi.com, and direct airline programs
              to ensure comprehensive coverage. Clicking "Book Now" takes you securely to the
              airline or OTA to complete your booking.
            </p>
          </div>
        </div>

        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          {[
            { q: 'Do you charge any fees?', a: 'No. SkyDeals is completely free to use. We earn a commission from our booking partners at no cost to you.' },
            { q: 'Are the prices accurate?', a: 'Yes. We pull live prices directly from airline and OTA inventory. Prices are updated in real time and the final price is confirmed at checkout on the booking partner\'s site.' },
            { q: 'Is my payment information safe?', a: 'All payments are processed directly by the airline or booking partner (Skyscanner, Kiwi.com, etc.). SkyDeals never handles your payment or personal financial data.' },
            { q: 'Can I cancel or change my booking?', a: 'Cancellation and change policies depend on the airline and fare type. Look for the "Refundable" tag on search results, or check the specific fare rules on the booking page.' },
            { q: 'How do I get the best deal?', a: 'Book 6–8 weeks ahead for domestic flights and 2–4 months ahead for international. Be flexible with dates and consider nearby airports. Sign up for our price alerts to catch flash sales.' },
          ].map(({ q, a }) => (
            <div key={q} className={styles.faqItem}>
              <h4>{q}</h4>
              <p>{a}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <h2>Ready to find your next deal?</h2>
          <Link to="/search" className="btn btn-primary">Search Flights <ArrowRight size={16}/></Link>
        </div>
      </div>
    </div>
  )
}
