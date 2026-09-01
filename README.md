# SYMPHONY — Bengaluru traffic digital twin

**Industry site:** https://amitduabits.github.io/symphony-digital-twin/  
**Command centre:** https://amitduabits.github.io/symphony-digital-twin/#/app

BITS Pilani demonstration of Indian Patent Application **202611024014**  
*Hierarchical Multi-Agent AI System for Adaptive Traffic Signal Control with Temporal Prediction*

Applicant: Yushu Excellence Technologies Private Limited  
Inventor: Amit Dua

This is a **working browser demo** for industry briefings. It is not connected to Bengaluru Traffic Police signals. The research/SUMO tree lives at [bangalore-traffic-digital-twin](https://github.com/amitduabits/bangalore-traffic-digital-twin).

## Open locally

```bash
npm install
npm test
npm run dev
```

- Website: http://localhost:5188/
- Command centre: http://localhost:5188/#/app

## What to send a partner

1. The live URL above
2. The 8-minute script in [docs/PARTNER-WALKTHROUGH.md](docs/PARTNER-WALKTHROUGH.md)
3. How the product is finished and tested: [PROMPTBOOK.md](PROMPTBOOK.md)

## Tests

```bash
npm test          # engine, all 7 scenarios, all website routes, all app panes
npm run build     # typecheck + production bundle
```

CI on `main` runs the same commands and publishes GitHub Pages.

## Licence

MIT for this demonstration code. The patent is separate. Do not treat a clone of this repo as a licence to deploy the invention.
