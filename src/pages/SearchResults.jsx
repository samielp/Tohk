import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import FlightCard from '../components/FlightCard'
import { searchFlights, AIRPORTS } from '../utils/flightApi'
import styles from './SearchResults.module.css'

const SORT_OPTIONS = [
  { value: 'price',    label: 'Cheapest first' },
  { value: 'duration', label: 'Fastest first' },
  { value: 'dep',      label: 'Earliest departure' },
]

export default function SearchResults() {
  const [params]         = useSearchParams()
  const [flights,  setFlights]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [sort,     setSort]     = useState('price')
  const [maxPrice, setMaxPrice] = useState(2000)
  const [stopsFilter, setStopsFilter] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)

  const origin    = params.get('origin') || ''
  const dest      = params.get('dest')   || ''
  const originCity = params.get('originCity') || origin
  const destCity   = params.get('destCity')   || dest
  const depDate   = params.get('depDate')
  const retDate   = params.get('retDate')
  const adults    = parseInt(params.get('adults')   || '1')
  const children  = parseInt(params.get('children') || '0')
  const infants   = parseInt(params.get('infants')  || '0')
  const tripType  = params.get('tripType') || 'round-trip'
  const cabin     = params.get('cabin')    || 'Economy'

  // Build initialValues to re-populate SearchForm
  const initialValues = {
    origin:    origin ? AIRPORTS.find(a => a.code === origin) || { code: origin, city: originCity } : null,
    dest:      dest   ? AIRPORTS.find(a => a.code === dest)   || { code: dest,   city: destCity   } : null,
    depDate, retDate, adults, children, infants, tripType, cabin,
  }

  useEffect(() => {
    if (!origin || !dest) return
    setFlights([])
    setLoading(true)
    setError('')
    searchFlights({ origin, destination: dest, departDate: depDate, returnDate: retDate,
      passengers: { adults, children, infants }, tripType, cabin })
      .then(r => { setFlights(r); setLoading(false) })
      .catch(() => { setError('Search failed. Please try again.'); setLoading(false) })
  }, [params.toString()])

  const filteredAndSorted = useMemo(() => {
    let f = flights.filter(fl => fl.price <= maxPrice)
    if (stopsFilter.length > 0) f = f.filter(fl => stopsFilter.includes(fl.stops))
    switch (sort) {
      case 'duration': f = [...f].sort((a,b) => a.durationMin - b.durationMin); break
      case 'dep':      f = [...f].sort((a,b) => a.departureTime.localeCompare(b.departureTime)); break
      default:         f = [...f].sort((a,b) => a.price - b.price)
    }
    return f
  }, [flights, sort, maxPrice, stopsFilter])

  function toggleStop(s) {
    setStopsFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const minPrice = flights.length ? Math.min(...flights.map(f => f.price)) : 0
  const maxAvail = flights.length ? Math.max(...flights.map(f => f.price)) : 2000

  return (
    <div className={styles.page}>
      {/* Search bar at top */}
      <div className={styles.searchBar}>
        <div className="container">
          <SearchForm compact initialValues={initialValues} />
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${filterOpen ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}><SlidersHorizontal size={16}/> Filters</h3>
              <button className={styles.closeFilters} onClick={() => setFilterOpen(false)}><X size={18}/></button>
            </div>

            <div className={styles.filterSection}>
              <h4 className={styles.filterTitle}>Max Price</h4>
              <div className={styles.priceDisplay}>
                <span>${maxPrice}</span>
                <span className={styles.priceMin}>Min ${minPrice}</span>
              </div>
              <input type="range"
                min={minPrice} max={Math.max(maxAvail, 500)}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.filterSection}>
              <h4 className={styles.filterTitle}>Stops</h4>
              {[0, 1, 2].map(s => (
                <label key={s} className={styles.checkLabel}>
                  <input type="checkbox"
                    checked={stopsFilter.includes(s)}
                    onChange={() => toggleStop(s)}
                  />
                  {s === 0 ? 'Nonstop' : `${s} stop${s > 1 ? 's' : ''}`}
                </label>
              ))}
            </div>

            {stopsFilter.length > 0 || maxPrice < maxAvail ? (
              <button className="btn btn-ghost" style={{width:'100%', justifyContent:'center'}}
                onClick={() => { setStopsFilter([]); setMaxPrice(2000) }}>
                Clear filters
              </button>
            ) : null}
          </aside>

          {/* Results */}
          <main className={styles.results}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                {loading ? (
                  <span className={styles.searching}>Searching live fares…</span>
                ) : (
                  <span>
                    <strong>{filteredAndSorted.length}</strong> flights ·{' '}
                    {originCity} → {destCity}
                    {filteredAndSorted.length > 0 && (
                      <span className={styles.priceRange}>
                        {' '}· ${Math.min(...filteredAndSorted.map(f=>f.price))} – ${Math.max(...filteredAndSorted.map(f=>f.price))}
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className={styles.controls}>
                <button className={`btn btn-ghost ${styles.filterToggle}`}
                  onClick={() => setFilterOpen(o => !o)}>
                  <SlidersHorizontal size={15}/> Filters
                </button>
                <div className={styles.sortWrap}>
                  <ArrowUpDown size={14} className={styles.sortIcon}/>
                  <select value={sort} onChange={e => setSort(e.target.value)} className={styles.sortSelect}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={14} className={styles.sortChevron} />
                </div>
              </div>
            </div>

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingPlane}>✈</div>
                <div className={styles.loadingBars}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.skeleton} style={{animationDelay:`${i*100}ms`}}/>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorState}>
                <p>⚠ {error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
              </div>
            )}

            {!loading && !error && filteredAndSorted.length === 0 && flights.length > 0 && (
              <div className={styles.emptyState}>
                <p>No flights match your filters.</p>
                <button className="btn btn-ghost" onClick={() => { setStopsFilter([]); setMaxPrice(2000) }}>
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && flights.length === 0 && origin && dest && (
              <div className={styles.emptyState}>
                <p>No flights found for this route and date.</p>
              </div>
            )}

            {filteredAndSorted.map((flight, i) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                index={i}
                isBest={i === 0}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}
