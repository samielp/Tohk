import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingDown, Shield, Clock, Star, ArrowRight, Zap } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import styles from './Home.module.css'

const POPULAR_ROUTES = [
  { from: 'New York', to: 'London',        fromCode: 'JFK', toCode: 'LHR', price: 289, img: '🇬🇧' },
  { from: 'Los Angeles', to: 'Tokyo',      fromCode: 'LAX', toCode: 'NRT', price: 412, img: '🇯🇵' },
  { from: 'Chicago', to: 'Paris',          fromCode: 'ORD', toCode: 'CDG', price: 340, img: '🇫🇷' },
  { from: 'Miami', to: 'Cancún',           fromCode: 'MIA', toCode: 'CUN', price: 119, img: '🇲🇽' },
  { from: 'San Francisco', to: 'Singapore',fromCode: 'SFO', toCode: 'SIN', price: 598, img: '🇸🇬' },
  { from: 'New York', to: 'Dubai',         fromCode: 'JFK', toCode: 'DXB', price: 487, img: '🇦🇪' },
]

const FEATURES = [
  { icon: <TrendingDown size={22}/>, title: 'Lowest Price Guarantee', desc: 'We search 200+ airlines and OTAs to always show you the cheapest fares available.' },
  { icon: <Shield size={22}/>, title: 'Secure Booking', desc: 'All bookings go directly through verified airlines and licensed travel partners.' },
  { icon: <Clock size={22}/>, title: 'Real-Time Search', desc: 'Live pricing updated every second. No stale fares, no bait-and-switch.' },
  { icon: <Star size={22}/>, title: 'Price Alerts', desc: 'Set a target price and get notified the moment fares drop for your route.' },
]

const STATS = [
  { value: '200+', label: 'Airlines compared' },
  { value: '$847M', label: 'Saved by travelers' },
  { value: '2.4M', label: 'Happy customers' },
  { value: '98%', label: 'Search accuracy' },
]

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.grid} />
        </div>
        <div className="container" style={{position:'relative', zIndex:2}}>
          <div className={styles.heroContent}>
            <div className={styles.pill}>
              <Zap size={13} /> Live prices from 200+ airlines
            </div>
            <h1 className={styles.headline}>
              Find Flights That<br />
              <span className={styles.headlineAccent}>Don't Break</span> the Bank
            </h1>
            <p className={styles.subheadline}>
              Compare prices across hundreds of airlines instantly.<br />
              Book the cheapest flights in seconds.
            </p>
          </div>
          <SearchForm />
          <div className={styles.stats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Popular Routes</h2>
              <p className={styles.sectionSub}>Top destinations travelers are searching right now</p>
            </div>
            <Link to="/deals" className="btn btn-ghost">
              All deals <ArrowRight size={15} />
            </Link>
          </div>
          <div className={styles.routesGrid}>
            {POPULAR_ROUTES.map(route => (
              <Link
                key={route.fromCode + route.toCode}
                to={`/search?origin=${route.fromCode}&originCity=${encodeURIComponent(route.from)}&dest=${route.toCode}&destCity=${encodeURIComponent(route.to)}`}
                className={styles.routeCard}
              >
                <div className={styles.routeEmoji}>{route.img}</div>
                <div className={styles.routeInfo}>
                  <div className={styles.routeCities}>
                    {route.from} → {route.to}
                  </div>
                  <div className={styles.routeCodes}>{route.fromCode} – {route.toCode}</div>
                </div>
                <div className={styles.routePrice}>
                  <span className={styles.routeFrom}>from</span>
                  <span className={styles.routeAmt}>${route.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.section} style={{background:'rgba(20,25,41,.5)'}}>
        <div className="container">
          <div className={styles.sectionHeader} style={{justifyContent:'center', textAlign:'center', flexDirection:'column', alignItems:'center'}}>
            <h2 className={styles.sectionTitle}>Why SkyDeals?</h2>
            <p className={styles.sectionSub}>Built for travelers who hate overpaying</p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Ready to save on your next trip?</h2>
              <p className={styles.ctaSub}>Thousands of deals updated every minute.</p>
            </div>
            <Link to="/search" className="btn btn-amber">
              Search Flights Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
