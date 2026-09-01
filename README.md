# isaacwillson.dev

Personal site. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

The hero runs a small approximation of the [Pondview forecaster](https://github.com/isaacwillson/pondview-forecaster)
in the browser, so visitors can change the weather and watch the prediction move.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npx eslint .    # lint
```

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | **All the copy.** Projects, skills, about, contact links. Edit here, never in components. |
| `lib/model.ts` | Coefficients and the `predict()` used by the hero. |
| `lib/season.ts` | The real 250-hour training season behind the thermal grid. |
| `lib/thermal.ts` | The arrivals-to-color ramp. |
| `components/ThermalField.tsx` | Hero ambience: all 250 hours painted across the viewport. |
| `components/Work.tsx` | The work section. The first project is a full case study; the rest are short entries. |
| `components/WhatIf.tsx` | The interactive model, embedded inside the forecaster project. |
| `components/SeasonGrid.tsx` | The 29 x 10 grid of observed hours, also inside that project. |
| `components/SectionHeading.tsx` | One heading treatment shared by every section. |
| `public/Isaac-Willson-Resume.pdf` | Served by the two download links. Replace this file to update the resume. |

## Before this goes live

- [ ] **Add a portrait.** Drop a square photo at `public/portrait.jpg` (640x640 or
      larger, chest up, plain background), then change `PORTRAIT_SRC` in
      `components/About.tsx` to `"/portrait.jpg"`. It currently shows a placeholder.
- [ ] **Keep the resume in sync.** The site quotes numbers from it (300+ visitors,
      23% below baseline, 6 endpoints). When you update `public/Isaac-Willson-Resume.pdf`,
      check `PROJECTS` and `PILLARS` in `lib/content.ts` still match it.
- [ ] **Set the real domain.** `SITE.url` in `lib/content.ts` is a placeholder, and
      it feeds the Open Graph tags.
- [ ] **Add an OG image** at `app/opengraph-image.png` (1200x630) so shared links
      preview properly.

## About the hero model

The deployed forecaster is a gradient-boosting regressor served from AWS Lambda.
Shipping that to the browser is not practical, so `lib/model.ts` holds a ridge
regression fit on the same 250 observed hours: separate hour profiles for weekdays
and weekends, plus temperature, a squared temperature term, and a rain indicator.

It scores **MAE 3.00** arrivals/hour in-sample against the deployed model's **2.97**
under leave-one-day-out cross-validation. Close, but not the same thing, which is
why the page says so in the margin instead of implying the real model runs here.

It reproduces the finding that matters: **weekday arrivals peak at 5PM, weekend
arrivals at 11AM**, and rain costs about four arrivals an hour.

If the model is ever retrained, refit these coefficients rather than hand-editing
them, and update `mae` and `deployedMae` to match.

## Page structure

`Hero` (who I am) -> `Approach` (how I work) -> `Work` -> `Toolkit` -> `About`.

The site is about the person, not about one project. Everything to do with the
Pondview forecaster -- the live model, the season grid, the dataset story -- is
nested inside that one project's entry in `Work`, so a reader reaches "here is my
work" on the second screen rather than the fourth.

## Notes

- The site commits to a single dark theme on purpose. The inferno ramp encodes
  arrivals and only reads on a dark ground, so there is no light mode.
- Every color on the page comes from that ramp, including the accents, so the
  palette and the data can never disagree.
- The opening field is real: 29 columns, one per day of the season, scaled up
  from a 29x10 canvas with smoothing on. That is far cheaper than blurring a
  full-size canvas. The faint seams keep it reading as a measurement rather than
  as a decorative gradient.
- Complex gradients are inline styles, not Tailwind arbitrary values. Tailwind
  cannot parse nested parens in a class like `bg-[linear-gradient(...rgba(...)...)]`
  and silently drops it.
- The three content sections divide cleanly and must stay that way: `Approach`
  is how I work, `Work` is the proof, `Toolkit` is a bare inventory. Putting
  evidence in the toolkit made the page say the same thing three times.
- The phone number on the resume is deliberately not on the site. A public page
  with a phone number on it collects spam; the PDF is the place for it.
- Scroll reveals and the grid fill-in are driven by data attributes set from
  `IntersectionObserver`, not React state, so one observer never re-renders a
  section. All motion is disabled under `prefers-reduced-motion`.
