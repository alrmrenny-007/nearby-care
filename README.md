# Nearby Care

A React app that finds hospitals near you and shows a real routed travel time
by car, on foot, or by bike.

- Vite + React 18 + React Router
- Live hospital data from OpenStreetMap (Overpass API)
- Real routing/time estimates from OSRM
- Address search via Nominatim
- Leaflet map, no API keys required

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

Outputs a static `dist/` folder — deployable to Vercel, Netlify, GitHub Pages,
or any static host.
