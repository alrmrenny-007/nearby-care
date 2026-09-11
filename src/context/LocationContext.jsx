import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchNearbyHospitals } from '../api/overpass'
import { fetchRoute } from '../api/osrm'
import { geocodePlace } from '../api/geocode'
import { MODE_SPEED_KMH } from '../utils/geo'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null) // { lat, lon }
  const [hospitals, setHospitals] = useState([])
  const [mode, setModeState] = useState('driving')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [routeCache, setRouteCache] = useState({}) // key: `${id}-${mode}` -> { minutes, km, coords }

  const loadHospitals = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchNearbyHospitals(lat, lon)
      setHospitals(results)
      if (results.length === 0) setError('No hospitals found within 8km of that location.')
    } catch (e) {
      setError('Couldn\u2019t reach the hospital directory right now. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }, [])

  const setUserLocation = useCallback(
    (lat, lon) => {
      setLocation({ lat, lon })
      loadHospitals(lat, lon)
    },
    [loadHospitals]
  )

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Your browser doesn\u2019t support geolocation. Try searching for a place instead.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setLoading(false)
        setError(`Couldn\u2019t access your location (${err.message}).`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [setUserLocation])

  const searchPlace = useCallback(
    async (query) => {
      setLoading(true)
      setError(null)
      try {
        const result = await geocodePlace(query)
        if (!result) {
          setError(`No match for "${query}". Try a different search.`)
          setLoading(false)
          return
        }
        setUserLocation(result.lat, result.lon)
      } catch (e) {
        setError('Search failed. Check your connection and try again.')
        setLoading(false)
      }
    },
    [setUserLocation]
  )

  const setMode = useCallback((m) => setModeState(m), [])

  // Quick straight-line ETA estimate for every hospital, recomputed on mode change.
  const hospitalsWithEta = useMemo(() => {
    return hospitals.map((h) => {
      const cached = routeCache[`${h.id}-${mode}`]
      const etaMin = cached ? cached.minutes : (h.distKm / MODE_SPEED_KMH[mode]) * 60
      return { ...h, etaMin, isEstimate: !cached }
    })
  }, [hospitals, mode, routeCache])

  const getRoute = useCallback(
    async (hospital) => {
      const key = `${hospital.id}-${mode}`
      if (routeCache[key]) return routeCache[key]
      if (!location) return null
      try {
        const route = await fetchRoute(location, hospital, mode)
        setRouteCache((prev) => ({ ...prev, [key]: route }))
        return route
      } catch (e) {
        // Fallback: straight-line estimate
        const km = hospital.distKm
        const minutes = (km / MODE_SPEED_KMH[mode]) * 60
        const fallback = { minutes, km, coords: [[location.lat, location.lon], [hospital.lat, hospital.lon]], isFallback: true }
        setRouteCache((prev) => ({ ...prev, [key]: fallback }))
        return fallback
      }
    },
    [location, mode, routeCache]
  )

  const value = {
    location,
    hospitals: hospitalsWithEta,
    mode,
    setMode,
    loading,
    error,
    locateMe,
    searchPlace,
    getRoute,
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocationData() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocationData must be used within LocationProvider')
  return ctx
}
