import { haversineKm } from '../utils/geo'

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.openstreetmap.ru/api/interpreter',
      ]

      async function queryOverpass(query) {
        let lastError
          for (const url of OVERPASS_MIRRORS) {
              try {
                    const controller = new AbortController()
                          const timeout = setTimeout(() => controller.abort(), 12000)
                                const res = await fetch(url, {
                                        method: 'POST',
                                                body: 'data=' + encodeURIComponent(query),
                                                        signal: controller.signal,
                                                              })
                                                                    clearTimeout(timeout)
                                                                          if (!res.ok) throw new Error('Bad response from ' + url)
                                                                                return await res.json()
                                                                                    } catch (e) {
                                                                                          lastError = e
                                                                                                continue
                                                                                                    }
                                                                                                      }
                                                                                                        throw lastError || new Error('All Overpass mirrors failed')
                                                                                                        }

                                                                                                        // Queries OpenStreetMap's Overpass API for hospitals within `radius` meters
                                                                                                        // of the given coordinates. Free, no API key required. Tries multiple
                                                                                                        // mirrors in sequence since the main public server can be flaky.
                                                                                                        export async function fetchNearbyHospitals(lat, lon, radius = 8000) {
                                                                                                          const query = `[out:json][timeout:20];
                                                                                                              (
                                                                                                                    node["amenity"="hospital"](around:${radius},${lat},${lon});
                                                                                                                          way["amenity"="hospital"](around:${radius},${lat},${lon});
                                                                                                                                relation["amenity"="hospital"](around:${radius},${lat},${lon});
                                                                                                                                    );
                                                                                                                                        out center 30;`

                                                                                                                                          const data = await queryOverpass(query)

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
