import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, LocateFixed, Car, Footprints, Bike } from 'lucide-react'
import { useLocationData } from '../context/LocationContext'
import HospitalCard from '../components/HospitalCard'
import SearchOverlay from '../components/SearchOverlay'

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#E8563B;border:3px solid #fff;box-shadow:0 0 0 5px rgba(232,86,59,0.25);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})
const hospitalIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#1C1B29;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

function RecenterOnLoad({ center }) {
  const map = useMap()
  React.useEffect(() => {
    if (center) map.setView(center, 13)
  }, [center]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export default function Hospitals() {
  const { location, hospitals, mode, setMode, loading, error, locateMe } = useLocationData()
  const [showSearch, setShowSearch] = useState(false)

  const modes = [
    { key: 'driving', label: 'Drive', icon: Car },
    { key: 'walking', label: 'Walk', icon: Footprints },
    { key: 'cycling', label: 'Cycle', icon: Bike },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Hospitals</h1>
        <div className="actions">
          <button className="icon-btn-light" onClick={() => setShowSearch(true)} aria-label="Search a place">
            <Search size={17} />
          </button>
          <button className="icon-btn-light" onClick={locateMe} aria-label="Use my current location">
            <LocateFixed size={17} />
          </button>
        </div>
      </div>

      {location ? (
        <div className="map-box">
          <MapContainer center={[location.lat, location.lon]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterOnLoad center={[location.lat, location.lon]} />
            <Marker position={[location.lat, location.lon]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.name}</strong>
                  <br />
                  {h.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="empty-state">
          <div className="big">📍</div>
          Share your location to see hospitals on the map.
          <div style={{ marginTop: 14 }}>
            <button className="pill-btn orange" onClick={locateMe}>Use my location</button>
          </div>
        </div>
      )}

      {location && (
        <div className="mode-toggle">
          {modes.map(({ key, label, icon: Icon }) => (
            <button key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="status-row"><div className="spinner" /> Searching for nearby hospitals…</div>
      )}
      {error && !loading && <div className="status-row">{error}</div>}

      {!loading && location && hospitals.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          {hospitals.map((h) => (
            <HospitalCard key={h.id} hospital={h} mode={mode} />
          ))}
        </div>
      )}

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  )
}
