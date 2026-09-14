# runny

**The weather-aware running planner.** Runny reads the forecast *along your whole route* — not just over your postcode — and tells you the coolest, freshest windows to head out.

Live: **https://mramundo.github.io/runny/**

The name is the joke: you use it so you *don't* end up runny.

---

## What it does

1. **You give it a route.** Type a start and a finish, or tap *Use my location*. Leave *Finish where I started* on and Runny builds a loop instead.
2. **Or you give it a distance.** Pick 5K, 10K, 15K, Half, 30K or Marathon and Runny generates three real running routes of roughly that length, fanned out in different directions from your start.
3. **It samples the forecast along the line.** Up to eight points on the polyline, averaged hour by hour — a 15 km run can leave town, climb 200 m and cross a river, and the weather at the end is not the weather at the start.
4. **It scores every hour** and shows you the windows that are long enough to fit the run at your pace, ranked by how kind the air will be.
5. **It draws the route on a map** so you know where you are actually going.

## The Runny Score

A 0–100 number per hour. Heat stress sets the ceiling; everything else chips away at it.

| Input | Why it is in there |
| --- | --- |
| **Apparent temperature** | How hot it *feels*, wind and sun included. The plateau is 6–14 °C, where road racing times are fastest. |
| **Dew point** | The honest humidity number. It is absolute, so it means the same at 8 °C and at 28 °C. Above ~16 °C sweat stops evaporating properly. |
| **Rain** | Probability, scaled down further by how many millimetres are actually coming. |
| **Wind** | A breeze cools you; a gale ruins the second half. Gusts carry an extra penalty. |
| **UV** | Daytime only — a night run gets a free pass. |

Temperature and dew point are blended with **the worse of the pair carrying most of the weight**, so a cool-but-soupy morning and a hot-but-dry afternoon are both correctly called hard. Rain, wind and UV act as multipliers rather than points, because they can spoil a run but never make one pleasant. Thunderstorms, heavy rain, extreme apparent heat, gales and UV ≥ 10 cap the score outright.

Bands: **Perfect** ≥ 82 · **Great** ≥ 66 · **Doable** ≥ 48 · **Tough** ≥ 30 · **Skip it** below.

## Suggested loops

Pick a distance and Runny drops four waypoints on a circle around your start, routes a pedestrian path through them, measures the real distance, then resizes the circle and tries again — up to three attempts — until the loop lands within 10% of the target. Three loops are built in different directions so you get a real choice. Every metre is a genuine walkable/runnable way from OpenStreetMap.

The preset distances are the staples of half and full marathon blocks: 5 and 10 km for tempo and intervals, 15 and 21.1 km for the long runs of a half build, 30 km as the classic marathon rehearsal, 42.2 km because someone always asks.

## Languages

Italian inside Italy, English everywhere else. The app guesses instantly from the timezone and browser language, then refines it from the request's country. An explicit choice — the IT/EN switch, or `?lang=it` / `?lang=en` — always wins and is remembered.

## Data sources

| | |
| --- | --- |
| Forecast + elevation | [Open-Meteo](https://open-meteo.com/) |
| Pedestrian routing | [Valhalla](https://valhalla.github.io/valhalla/) on the public OpenStreetMap instance |
| Place search | [Photon](https://photon.komoot.io/) |
| Reverse geocoding / country | [BigDataCloud](https://www.bigdatacloud.com/), [ipwho.is](https://ipwho.is/) |
| Basemap | [CARTO](https://carto.com/) tiles over [OpenStreetMap](https://www.openstreetmap.org/copyright) data |

No API keys, no accounts, no analytics, no tracking. Coordinates go to those services so they can answer; nothing is stored server-side. Your last route lives in your own browser.

## Stack

Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Leaflet · `vite-plugin-pwa` (Workbox). Installable, offline-capable, and rendered in one bundle with no server of its own.

## Development

```bash
npm install
npm run dev        # http://localhost:5173/runny/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck, then production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc -b`, no emit |
| `npm run lint` | ESLint over the whole project |
| `npm test` | Vitest — scoring model and route geometry |
| `npm run icons` | Regenerate the PNG icons from the runner mark |

The scoring model and the geometry helpers are pure functions with no DOM or network in them, which is exactly why they are the parts under test.

## Deployment

Every push to `main` runs lint, typecheck, tests and build, then publishes `dist/` to the `gh-pages` branch via GitHub Actions. The site is served from `/runny/`, which is set once as `BASE` in `vite.config.ts`.

## Licence

MIT — see [LICENSE](LICENSE).
