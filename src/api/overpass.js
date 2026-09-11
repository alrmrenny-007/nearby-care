import { haversineKm } from '../utils/geo'

// Queries OpenStreetMap's Overpass API for hospitals within `radius` meters
// of the given coordinates. Free, no API key required.
export async function fetchNearbyHospitals(lat, lon, radius = 8000) {
  const query = `[out:json][timeout:20];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      relation["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out center 30;`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
  })
  if (!res.ok) throw new Error('Overpass request failed')
  const data = await res.json()

  const hospitals = (data.elements || [])
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat
      const elLon = el.lon ?? el.center?.lon
      if (elLat == null || elLon == null) return null
      const tags = el.tags || {}
      const addrParts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean)
      return {
        id: `${el.type}-${el.id}`,
        name: tags.name || 'Unnamed Hospital',
        address: addrParts.length ? addrParts.join(' ') : 'Address unavailable',
        emergency: tags.emergency === 'yes',
        phone: tags.phone || tags['contact:phone'] || null,
        lat: elLat,
        lon: elLon,
        distKm: haversineKm(lat, lon, elLat, elLon),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 15)

  return hospitals
}
