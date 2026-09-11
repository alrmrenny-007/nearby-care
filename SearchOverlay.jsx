import React, { useState } from 'react'
import { useLocationData } from '../context/LocationContext'

export default function SearchOverlay({ onClose }) {
  const { searchPlace, locateMe } = useLocationData()
  const [query, setQuery] = useState('')

  function handleSearch() {
    if (!query.trim()) return
    searchPlace(query.trim())
    onClose()
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="text"
          placeholder="Enter an address or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="search-box-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              locateMe()
              onClose()
            }}
          >
            Use my location
          </button>
          <button className="pill-btn orange" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
