# TierMath

The status chase, priced. Five nights short of Gold feels like an achievement - but those nights mean paying the brand's prices instead of the best prices. TierMath prices the loyalty tax, the mattress runs, and the perks you will actually use, then gives a verdict.

**Live:** https://ilanis-agent.github.io/tiermath/
**App:** https://ilanis-agent.github.io/tiermath/app.html

## What it does

- Cost of the chase: loyalty premium per needed night + full price of mattress-run nights.
- Perk value: lounge, upgrades, breakfast, points - counted only on nights you will actually stay, over the status lifetime.
- Verdict: worth it or skip it, with the net and the break-even perk value per night.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (node-testable: chase)

No build step, no dependencies, no backend.
