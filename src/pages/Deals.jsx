import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, TrendingDown } from 'lucide-react'
import styles from './Deals.module.css'

const DEALS = [
  { from:'New York', fromCode:'JFK', to:'London',     toCode:'LHR', price:198, original:520, airline:'British Airways', flag:'🇬🇧', expires:'2d 4h', hot:true  },
  { from:'Chicago',  fromCode:'ORD', to:'Tokyo',      toCode:'NRT', price:389, original:890, airline:'United Airlines', flag:'🇯🇵', expires:'5h',    hot:true  },
  { from:'Miami',    fromCode:'MIA', to:'Cancún',     toCode:'CUN', price:89,  original:220, airline:'Spirit',          flag:'🇲🇽', expires:'1d 2h', hot:false },
  { from:'LA',       fromCode:'LAX', to:'Paris',      toCode:'CDG', price:349, original:780, airline:'Air France',      flag:'🇫🇷', expires:'3d',    hot:false },
  { from:'Seattle',  fromCode:'SEA', to:'Amsterdam',  toCode:'AMS', price:412, original:970, airline:'KLM',             flag:'🇳🇱', expires:'6h',    hot:true  },
  { from:'Dallas',   fromCode:'DFW', to:'Dubai',      toCode:'DXB', price:490, original:1100,airline:'Emirates',        flag:'🇦🇪', expires:'2d',    hot:false },
  { from:'Boston',   fromCode:'BOS', to:'Reykjavík',  toCode:'KEF', price:220, original:540, airline:'Icelandair',      flag:'🇮🇸', expires:'4d',    hot:false },
  { from:'Denver',   fromCode:'DEN', to:'Honolulu',   toCode:'HNL', price:178, original:390, airline:'Hawaiian',        flag:'🇺🇸', expires:'1d',    hot:true  },
  { from:'NYC',      fromCode:'JFK', to:'Singapore',  toCode:'SIN', price:610, original:1350,airline:'Singapore Air',   flag:'🇸🇬', expires:'3d 8h', hot:false },
]

export default function Deals() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.pill}><Zap size={13}/> Limited-time flash deals</div>
          <h1 className={styles.title}>Hot Flight Deals</h1>
          <p className={styles.sub}>Prices won't last long. Book before they're gone.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {DEALS.map((deal, i) => {
            const savings = Math.round(((deal.original - deal.price) / deal.original) * 100)
            return (
              <Link
                key={i}
                to={`/search?origin=${deal.fromCode}&originCity=${encodeURIComponent(deal.from)}&dest=${deal.toCode}&destCity=${encodeURIComponent(deal.to)}`}
                className={`${styles.card} ${deal.hot ? styles.hot : ''}`}
              >
                {deal.hot && <div className={styles.hotBadge}><Zap size={11}/> HOT</div>}
                <div className={styles.flag}>{deal.flag}</div>
                <div className={styles.route}>
                  <span className={styles.from}>{deal.from}</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.toCity}>{deal.to}</span>
                </div>
                <div className={styles.codes}>{deal.fromCode} – {deal.toCode}</div>
                <div className={styles.airline}>{deal.airline}</div>
                <div className={styles.priceRow}>
                  <div>
                    <span className={styles.original}>${deal.original}</span>
                    <span className={styles.price}>${deal.price}</span>
                    <span className={styles.per}>/ person</span>
                  </div>
                  <span className={styles.savings}>
                    <TrendingDown size={12}/> -{savings}%
                  </span>
                </div>
                <div className={styles.expires}>Expires in {deal.expires}</div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
