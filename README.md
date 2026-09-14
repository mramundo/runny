# runny

**Every run has a right hour.** Runny checks the forecast along the whole route you have in mind, hour by hour, and tells you which slots are actually worth going out for.

Live: **https://mramundo.github.io/runny/**

The name is the joke: you use it so you *don't* end up runny.

---

## What it does

1. **You set a starting point**, by typing it or by sharing your location. Everything else is built from it.
2. **You pick how the run is shaped.** Either come back to the start — choose one of twelve training distances and Runny proposes three routes of that length heading different ways — or finish somewhere else, and Runny works out the route between the two points.
3. **It samples the forecast along the route.** Up to eight points on the polyline, averaged hour by hour — a 15 km run can leave town, climb 200 m and cross a river, and the weather at the end is not the weather at the start.
4. **It scores every hour** and shows the windows long enough to hold the whole run at your pace, ranked by how little the air will cost you.
5. **It draws the route on a map** so you know exactly where you are going.

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

Bands: **Ideal** ≥ 82 · **Good** ≥ 66 · **Workable** ≥ 48 · **Hard** ≥ 30 · **Better not** below.

## Suggested loops

Pick a distance and Runny drops four waypoints on a circle around your start, routes a pedestrian path through them, measures the real distance, then resizes the circle and tries again — up to three attempts — until the loop lands within 10% of the target. Three loops are built in different directions so you get a real choice. Every metre follows ways you can genuinely run.

The twelve presets are the sessions a half or full marathon block is really made of — 5, 8, 10, 12, 16, 18, 21.1, 24, 28, 32, 35 and 42.2 km — from intervals through the everyday runs and the long work of a half, up to a marathon build and the two race distances themselves.

## Languages

Italian inside Italy, English everywhere else. The app guesses instantly from the timezone and browser language, then refines it from the request's country. An explicit choice — the IT/EN switch, or `?lang=it` / `?lang=en` — always wins and is remembered.

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
