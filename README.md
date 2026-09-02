# isaacwillson.dev

Personal site for Isaac Willson. Next.js 16 (App Router), React 19, TypeScript,
Tailwind CSS v4, GSAP and Lenis.

The design is warm humanist minimal: a paper ground, warm ink, one rust accent,
and a hero built from a real dataset rather than decoration.

Link: 

## Page structure

`Hero` → `Approach` → `Work` → `Toolkit` → `About`

Everything to do with the Pondview forecaster — the live model, the dataset, the season
grid — is nested inside that one entry in `Work`, so a reader reaches "here is my
work" on the second screen rather than the fourth.

The three content sections divide cleanly, and should stay that way:

- **Approach** — how I work. Prose, three habits, each naming checkable evidence.
- **Work** — the proof.
- **Toolkit** — a bare inventory, no evidence.

Putting evidence in the toolkit made the page say the same thing three times.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | **All the copy.** Projects, pillars, toolkit, education, experience, contact. Edit here, never in components. |
| `lib/model.ts` | Coefficients and `predict()` for the in-browser model. |
| `lib/season.ts` | The real 250-hour training season: 29 days, Jul–Aug 2026. |
| `lib/thermal.ts` | Arrivals → ink density. One hue, light to dark. |
| `components/HeroPlot.tsx` | The hero figure. Real data, traceable, SVG. |
| `components/WhatIf.tsx` | The interactive model, inside the forecaster entry. |
| `components/SeasonGrid.tsx` | The 29 × 10 grid of observed hours, behind the disclosure. |
| `components/Stagger.tsx` | ScrollTrigger wrapper that resolves a section's parts in order. |
| `components/SmoothScroll.tsx` | Lenis, the reveal arming, and smooth anchor navigation. |
| `components/SectionHeading.tsx` | One heading treatment shared by every section. |
| `public/Isaac-Willson-Resume.pdf` | Served by both download links. Replace the file to update it. |
| `public/portrait.jpg` | The About photo (399×397), referenced by `PORTRAIT_SRC`. |

## Design system

Defined once in `app/globals.css` under `@theme static`.

### Colour

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#FAF6F0` | Ground. Warm off-white, faintly rose rather than yellow. |
| `paper-deep` | `#F2ECE4` | Inset blocks. One step down, same temperature. |
| `ink` | `#1F1B17` | Primary text. Brown-black, never `#000`. |
| `ink-muted` | `#6B6055` | Body and metadata. |
| `rule` | `#DDD5C9` | Hairlines only. Never carries text. |
| `rust` | `#A54A24` | The one accent. |

### Type

**Fraunces** display · **Alegreya Sans** body · **IBM Plex Mono** labels and data.

Fraunces runs at `SOFT 40, WONK 0` everywhere — the warmth without the novelty.
`WONK 1` is unlocked in exactly one place, the name in the hero, where the swashed
leg reads as a signature. Using it twice would make it a tic.

Alegreya Sans is humanist with calligraphic roots and open apertures, chosen
against the geometric neutrality of Inter and friends. Plex Mono is drawn on a
humanist skeleton too, so it sits beside Alegreya Sans instead of sounding like a
third voice.

### Motion

Lenis at `lerp 0.09`, GSAP + ScrollTrigger for staged reveals. Both are
dynamically imported so neither lands in the initial bundle, and ScrollTrigger
runs off Lenis' tick rather than a second RAF loop.

Everything is gated on `prefers-reduced-motion`. Reduced motion gets native
scrolling, instant anchor jumps, and every section already at rest — not slower
versions of the same animation.

## The hero figure

`components/HeroPlot.tsx` plots the real training set: 29 day-lines as context,
split by weekday and weekend tone, with the two hourly mean curves on top and
direct labels at their peaks. **Weekends peak at 11am (13.3 arrivals/hr),
weekdays at 5pm (8.2)** — a late-morning crowd against an after-work one.

An earlier version drew all 29 days as a single tangle. It read as a chart and
communicated nothing, which is decoration wearing a chart's clothes. If you
change this, keep a finding in it.

Trace across it and a rule follows the nearest hour, with both means resolving in
the margin. Arrow keys do the same, Escape clears, and the readout is an
`aria-live` region. The trace has no transition on purpose: it is direct
manipulation, and easing it would only lag the cursor.

It is **SVG, not canvas**. The static plot is the finished artwork, so there is no
fallback to build — no JS gives you the whole figure, reduced motion gives you the
whole figure, and GSAP only draws it on. Nothing loops, so there is no frame
budget and no battery cost.

## The in-browser model

The deployed forecaster is a gradient-boosting regressor on AWS Lambda. Shipping
that to the browser is not practical, so `lib/model.ts` holds a ridge regression
fit on the same 250 observed hours: separate hour profiles for weekdays and
weekends, plus temperature, a squared temperature term, and a rain indicator.

It scores **MAE 3.00** arrivals/hour in-sample against the deployed model's
**2.97** under leave-one-day-out cross-validation. Close, but not the same thing,
which is why the page says so in the margin instead of implying the real model
runs here.

If the model is retrained, refit these coefficients rather than hand-editing
them, and update `mae` and `deployedMae` to match.
