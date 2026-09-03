# Isaac Willson — personal site

My portfolio. **Live at [isaacwillson.vercel.app](https://isaacwillson.vercel.app).**

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP
and Lenis.

The direction is warm humanist minimal — a paper ground, warm ink, one rust
accent — and the hero is a real dataset rather than a stock illustration. I
wanted the first thing you see to be something I actually made, not decoration.

## The parts I'm proud of

**The hero is my own data.** It plots a summer I spent recording arrivals at the
community pool I work at — 29 days, 250 hours, transcribed by hand. Every faint
line is one day; the two bold curves are the weekday and weekend means. They say
something true: weekends peak late morning (about 13 arrivals an hour at 11am),
weekdays peak after work (about 8 at 5pm). Trace across it with a cursor or the
arrow keys and it reads out any hour. It's SVG, so it's sharp at any size and
degrades to a clean static figure with no JavaScript.

**You can run my model in the browser.** The real forecaster is a
gradient-boosting regressor I deployed on AWS Lambda; shipping that to a webpage
isn't practical, so the "what-if" panel runs a small ridge regression fit on the
same 250 hours. It scores an in-sample MAE of 3.00 arrivals/hour against the
deployed model's 2.97 under leave-one-day-out cross-validation — close, but not
the same thing, and the page says so rather than overclaiming.

**It's built to be honest about motion and access.** Everything respects
`prefers-reduced-motion`: reduced motion gets native scrolling, instant anchor
jumps, and every section already in place — not a slower version of the same
animation. The chart is keyboard-operable and announces its values.

## Design choices

**Colour.** A warm off-white ground (`#FAF6F0`), brown-black ink (`#1F1B17`,
never pure black), and a single rust accent (`#A54A24`). One accent, used only
where it means something. I checked every text pairing against WCAG AA on both
paper tones before settling on that rust — a lighter one failed on the darker
ground.

**Type.** Fraunces for display, Alegreya Sans for body, IBM Plex Mono for labels
and data. I picked Alegreya Sans over the usual geometric sans because it's
humanist and warm, and Plex Mono because it shares that skeleton — so the three
read as one voice. Fraunces' swash is unlocked in exactly one place, my name in
the hero, so it lands as a signature instead of a habit.

**Motion.** Lenis for smooth scrolling and GSAP for the staged section reveals,
both dynamically imported so neither weighs down the first load, sharing one
animation loop rather than two.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## How it's organised

Copy lives in `lib/content.ts`, the dataset and model in `lib/season.ts` and
`lib/model.ts`, and the design tokens in `app/globals.css`. Each section of the
page is its own component in `components/`. The share card is generated from the
same palette and data in `app/opengraph-image.tsx`.
