# NewsHub (news-app)

> A React news aggregation app that surfaces curated headlines, search, and category browsing via the GNews API.

NewsHub helps readers scan the latest stories without hopping between sites. Browse by topic, filter by date, search keywords, open article details with related reads, and skim a “Today’s Pick” section on the home page. Built as a Vite + React + TypeScript SPA and deployable to GitHub Pages behind an optional serverless proxy (keeps the API key off the client and avoids CORS issues).

## Features

- Home feed with **Today’s Pick** and paginated **Latest News**
- Category routes (Technology, Entertainment, Business, Health, Science)
- Date-range filters (Today, This Week, This Month)
- Keyword search with result highlighting
- Article detail pages with related articles
- Client-side caching (memory + `localStorage`, 24h) to reduce API usage
- Request throttling (~1.1s between GNews calls) and retries on failure
- Responsive layout (Tailwind CSS v4 + Lucide icons)
- GitHub Pages deploy workflow with required proxy secret for production builds

## Prerequisites

- **Node.js 20+** (CI uses Node 20; local Node 22 works)
- **npm** (lockfile is npm-based)
- A **[GNews](https://gnews.io/)** API key for direct local calls *or* a working news **proxy URL** for browser/CORS-safe access

## Installation

```bash
git clone https://github.com/saramar23/news-app.git
cd news-app
npm install
```

## Configuration

Create a `.env` file in the project root (this file is gitignored):

```env
# Direct GNews calls from the browser (local/dev without a proxy)
VITE_NEWS_API_KEY=your_gnews_api_key

# Preferred for production / GitHub Pages (CORS + key safety)
# Base URL of your proxy; `/top-headlines` suffix is stripped if present
VITE_NEWS_PROXY_URL=https://your-proxy.example.com
```

How the client chooses a mode (`src/services/newsApi.ts`):

| Setup | Behavior |
|--------|----------|
| `VITE_NEWS_PROXY_URL` set | Requests go through the proxy; API key is **not** sent from the browser |
| Proxy unset + `VITE_NEWS_API_KEY` set | Browser calls `https://gnews.io/api/v4/...` directly (may hit CORS in production) |
| Neither set | Fetches return empty results (no crash) |

For GitHub Pages, the deploy workflow **requires** repository secret `VITE_NEWS_PROXY_URL` (and can also use `VITE_NEWS_API_KEY`). Without the proxy secret, the production build fails on purpose to avoid a CORS-broken deploy.

## Quick Start

```bash
# Development (Vite HMR)
npm run dev

# Production build (also copies index.html → 404.html for SPA routing on Pages)
npm run build

# Preview the production build locally
npm run preview
```

Dev server: follow the URL Vite prints (typically `http://localhost:5173`).

App `base` is `/news-app/` (`vite.config.ts`), matching GitHub Pages project hosting:

`https://saramar23.github.io/news-app/`

## Usage

### Routes

| Path | Screen |
|------|--------|
| `/` | Home — Today’s Pick + latest articles |
| `/:category` | Home filtered by category (e.g. `/technology`) |
| `/article/*` | Article detail (URL-encoded article identity in the path) |

### Typical flow

1. Open the home page and skim **Today’s Pick**.
2. Use category / date filters or the header search.
3. Open an article for full detail and related stories.
4. Paginate the latest grid when more results are available.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-aware Vite build + `404.html` copy for SPA fallback |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
├── .github/workflows/deploy.yml   # GitHub Pages deploy (Node 20)
├── news/                          # Product & tech requirement notes
├── public/                        # Static assets
├── src/
│   ├── components/                # UI (Header, HomePage, ArticleCard, filters, …)
│   ├── contexts/                  # Search & filter providers
│   ├── hooks/                     # Data & UI hooks (articles, search, featured, …)
│   ├── services/                  # GNews client, mapping, throttle
│   ├── types/                     # Shared TypeScript types
│   ├── utils/                     # Display helpers, relative time, highlight
│   ├── App.tsx                    # Router + providers
│   └── main.tsx                   # Entry
├── index.html
├── package.json
└── vite.config.ts                 # base: /news-app/, React + Tailwind plugins
```

## Deployment

Deploys automatically on push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

1. Enable **GitHub Pages** with the **GitHub Actions** source.
2. Add Actions secrets:
   - `VITE_NEWS_PROXY_URL` (required)
   - `VITE_NEWS_API_KEY` (optional if the proxy injects the key server-side)
3. Push to `main`; the workflow builds and publishes the `dist/` artifact.

The build copies `dist/index.html` to `dist/404.html` so client-side routes work on GitHub Pages.

## Troubleshooting

**Empty article lists locally**  
Ensure `.env` has `VITE_NEWS_API_KEY` and/or `VITE_NEWS_PROXY_URL`, then restart `npm run dev` (Vite only reads env at startup).

**`Failed to fetch` / CORS on the live site**  
Browser calls to gnews.io are blocked without a proxy. Set `VITE_NEWS_PROXY_URL` in GitHub Actions secrets and redeploy.

**CI fails: “VITE_NEWS_PROXY_URL is missing or empty”**  
Add the secret under **Settings → Secrets and variables → Actions** for this repo.

**Rate limit (429)**  
GNews free tiers are limited. Wait, upgrade the plan, or rely more on the 24h cache / throttle.

**404 on refresh of deep links**  
Confirm the build produced `404.html` and that Pages is serving the Actions artifact from this workflow.

## Contributing

1. Fork and create a feature branch.
2. Keep changes focused; match existing component/hook patterns.
3. Run `npm run lint` (and `npm run format` if you touch formatting).
4. Open a pull request against `main`.

Product/tech notes live under [`news/`](news/) for context while implementing.

## Acknowledgments

- [GNews](https://gnews.io/) for headlines and search
- [Vite](https://vite.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [React Router](https://reactrouter.com/)

## Contact

- Author: [saramar23](https://github.com/saramar23)
- Repository: [https://github.com/saramar23/news-app](https://github.com/saramar23/news-app)
