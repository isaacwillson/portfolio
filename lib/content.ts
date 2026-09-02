/**
 * All the words on the site live here, so copy edits never mean touching layout.
 */

export const SITE = {
  name: "Isaac Willson",
  role: "Software engineer",
  location: "New Jersey",
  city: "Dover, NJ",
  url: "https://isaacwillson.vercel.app/",
  email: "isaacwillson.work@gmail.com",
  github: "https://github.com/isaacwillson",
  linkedin: "https://www.linkedin.com/in/isaacwillson/",
  resume: "/Isaac-Willson-Resume.pdf",
  availability: "Open to internships",
} as const;

export const EDUCATION = {
  school: "Rutgers University, New Brunswick",
  degree: "B.S. Computer Science and B.S. Data Science",
  detail: "Double major",
  dates: "Expected May 2029",
  coursework: [
    "Data Structures",
    "Computer Architecture",
    "Linear Algebra",
    "Discrete Structures I & II",
    "Inference for Data Science",
  ],
} as const;

export const EXPERIENCE: {
  role: string;
  org: string;
  place: string;
  dates: string;
  note: string;
}[] = [
  {
    role: "Pool Attendant, seasonal",
    org: "Garden Homes",
    place: "Wharton, NJ",
    dates: "May 2025 - Present",
    note: "Safety and access for the only pool serving 1,000+ units. The job is where both Pondview projects came from.",
  },
  {
    role: "Sales Associate",
    org: "Journeys",
    place: "Dover, NJ",
    dates: "Aug 2024 - Present",
    note: "Beat daily and weekly sales targets by about 20% on average.",
  },
];

/**
 * The three habits the work actually demonstrates. Each one has to name evidence
 * a reader can go and check, or it does not belong here.
 */
export const PILLARS: { title: string; body: string; evidence: string }[] = [
  {
    title: "I get the data",
    body: "When the numbers I needed did not exist anywhere, I transcribed a summer of paper sign-in sheets by hand.",
    evidence: "250 observed hours, 29 days, collected from scratch",
  },
  {
    title: "I ship the whole thing",
    body: "My model trains offline, deploys to Lambda as a container image, and answers a live site my neighbors actually open.",
    evidence: "300+ visitors on the dashboard it feeds",
  },
  {
    title: "I report honestly",
    body: "Every result is tested against a real baseline; even when my margin narrowed as I added more data.",
    evidence: "Leave-one-day-out CV, feature ablation, 24 graded evals",
  },
];

export type Project = {
  slug: string;
  name: string;
  period: string;
  tagline: string;
  /** Each paragraph is rendered as its own block. Two or three is the right length. */
  body: string[];
  /** Numbers a reader can check. Keep these true. */
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "forecaster",
    name: "Pool Arrival Forecasting",
    period: "Jul 2026 - Present",
    tagline:
      "Predicts how many families arrive at the pool each hour, from the day's weather.",
    body: [
      "The pool logged arrivals on paper sign-in sheets. So I used the sign-in sheets from the first half of the summer and transcribed them into a training table of 250 observed hours across 29 days, joined each hour to Open-Meteo weather, and trained a gradient-boosting regressor on the result.",
      "The important decisions were which hours to keep. Days the pool was closed, and days whose sheet went missing, are excluded entirely, because we cannot say what happened during them. But days the pool was open and nobody came are kept as genuine zero-turnout hours, since dropping those would delete the bad-weather signal the model is meant to learn.",
      "It cut mean absolute error 23% below an hour-of-day by weekend baseline, 2.97 against 3.86 arrivals per hour, under leave-one-day-out cross-validation. I split by day rather than by row so a single afternoon's weather could not leak across the split, and a feature ablation confirmed the gain came from weather, not the calendar.",
      "The model ships as a containerized FastAPI service on AWS Lambda behind a three-view Next.js frontend, with GitHub Actions path filters so a web commit does not redeploy the API. On top sits an assistant on Claude Haiku 4.5 that answers turnout questions by calling the forecast endpoints as tools, with a 24-case eval suite asserting on the tool-call trace rather than the prose. It refuses what it cannot know: ask how many people are there right now and it redirects you, because this model predicts arrivals and has no departure data.",
    ],
    metrics: [
      { value: "23%", label: "Below baseline MAE" },
      { value: "250", label: "Hours transcribed by hand" },
      { value: "24", label: "Graded assistant evals" },
    ],
    stack: [
      "Python",
      "scikit-learn",
      "FastAPI",
      "Docker",
      "AWS Lambda",
      "AWS ECR",
      "GitHub Actions",
      "Next.js",
    ],
    links: [
      { label: "Live forecast", href: "https://pondviewforecast.vercel.app" },
      { label: "Source", href: "https://github.com/isaacwillson/pondview-forecaster" },
    ],
  },
  {
    slug: "pool-status",
    name: "Pondview Pool Status",
    period: "Jun 2026 - Present",
    tagline:
      "A live dashboard telling 1,000+ residents how busy the pool is before they walk over.",
    body: [
      "The sibling to the forecaster, and the one people actually use, with 300+ unique visitors. It answers what the pool looks like live.",
      "Behind it is a six-endpoint REST API that ingests occupancy readings into PostgreSQL and computes the hourly activity curves, weekly stats, and live trends server-side, so every view derives from one source of truth and the client stays light. Admin routes are secured with Bearer-token and HMAC-signed cookie auth so an untrusted client cannot spoof a reading, and a Redis-backed override lets staff force-close the pool and have it reach residents' screens in seconds.",
      "Crowd levels are only tracked on some days, so on an untracked day the dashboard says so plainly, names the next tracked day, and points at the typical pattern rather than showing a stale number or a fake zero. Residents check it on their phones on the way out the door, so every section was built for a narrow screen first.",
    ],
    metrics: [
      { value: "300+", label: "Unique visitors" },
      { value: "1,000+", label: "Units served" },
      { value: "6", label: "API endpoints" },
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Tailwind CSS", "Vercel"],
    links: [
      { label: "Live dashboard", href: "https://pondviewpool.vercel.app" },
      { label: "Source", href: "https://github.com/isaacwillson/Pondview-Pool-Status" },
    ],
  },
  {
    slug: "chess",
    name: "Chess AI",
    period: "Jun 2026",
    tagline: "A chess engine that plays you, with different levels of difficulty.",
    body: [
      "Full legal move generation, check and checkmate detection, and an opponent built on minimax with alpha-beta pruning over a positional evaluation function.",
      "The three difficulty tiers are search depth. Easy searches shallowly and misses tactics because it genuinely cannot see them, while hard searches deep enough to punish you for the same moves.",
    ],
    metrics: [
      { value: "3", label: "Difficulty tiers" },
      { value: "Minimax", label: "With alpha-beta pruning" },
    ],
    stack: ["Python", "Pygame"],
    links: [{ label: "Source", href: "https://github.com/isaacwillson/pygame-chess-ai" }],
  },
];

/**
 * A plain inventory, not a claim. The evidence for any of it is in the work
 * above, which is why there are no percentages or star ratings here.
 */
export const TOOLKIT: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C#", "HTML/CSS"],
  },
  {
    group: "ML and data",
    items: [
      "scikit-learn",
      "pandas",
      "NumPy",
      "matplotlib",
      "Jupyter",
      "PostgreSQL",
      "Redis",
      "LLM tool-use",
    ],
  },
  {
    group: "Web and backend",
    items: ["React", "Next.js", "Node.js", "FastAPI", "REST APIs", "Tailwind CSS"],
  },
  {
    group: "Tools and infrastructure",
    items: ["Git", "GitHub Actions", "Docker", "AWS Lambda", "AWS ECR", "Vercel"],
  },
];

export const ABOUT = [
  "I am a computer science and data science double major at Rutgers, and in the summers I work at the pool this site keeps refering too.",
  "That job is where the projects came from. I was the one logging resident visits against a list of a thousand units, which meant I was also the one who heard residents questions and complaints about how busy the pool gets. So I built the dashboard, then went back through those paper sheets to train something that could predict it.",
  "It taught me more about evaluation, deployment, and writing things down clearly than any tutorial would have, because there was nobody else to check the work.",
];
