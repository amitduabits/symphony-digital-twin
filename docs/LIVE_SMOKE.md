# Live smoke log

Do not mark a city Live on the website until a row here has a dated 2xx.

| City | Adapter | Date | Result |
|---|---|---|---|
| Bengaluru | open_meteo | 2026-09-01 | HTTP 200 `api.open-meteo.com` precipitation |
| London | tfl | 2026-09-01 | `api.tfl.gov.uk/Road/all` HTTP 404 without app key; adapter falls back, health amber |
| New York | nyc511 | 2026-09-01 | HTTP 200 `data.cityofnewyork.us/resource/i4gi-tjb9.json` |
| Hong Kong | hkgov | 2026-09-01 | Pack ready; TD snapshot path until a key is granted |

Observe mode is honest: missing keys show amber/red on the health panel. The twin keeps running.
