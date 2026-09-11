// Fetches a real route + duration from the public OSRM routing engine.
// profile: 'driving' | 'walking' | 'cycling'
export async function fetchRoute(from, to, profile = 'driving') {
  const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Routing request failed')
  const data = await res.json()
  if (!data.routes || data.routes.length === 0) throw new Error('No route found')
  const route = data.routes[0]
  return {
    minutes: route.duration / 60,
    km: route.distance / 1000,
    coords: route.geometry.coordinates.map((c) => [c[1], c[0]]),
  }
}
