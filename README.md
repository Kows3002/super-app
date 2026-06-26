# Super App

Super App is a responsive Next.js dashboard built for the Frontend Challenge. It combines registration, category onboarding, live weather, rotating news, persistent notes, a working timer, and personalized entertainment discovery in a single user flow.

The project follows the provided Figma direction and focuses on clean UI composition, typed state management, server-side API protection, reusable components, SEO, and production-oriented performance.

## Live Experience

The application flow is:

1. Register with name, username, email, and mobile number.
2. Select at least three entertainment categories.
3. View the personalized dashboard with profile data, weather, news, notes, and timer.
4. Browse movie recommendations generated from the selected categories.
5. Open a movie detail modal for rating, runtime, genre, director, cast, and plot.

## Features

### Authentication and Registration

- Captures name, username, email, and mobile number.
- Validates every field before allowing the user to continue.
- Shows clear error states for invalid or missing input.
- Stores registered user data in global app state.

### Category Onboarding

- Lets users select entertainment categories from the onboarding screen.
- Requires a minimum of three categories before proceeding.
- Persists selected categories and displays them on the dashboard profile card.

### Super Dashboard

- Displays registration data in a personalized profile section.
- Shows a live weather widget powered by OpenWeatherMap.
- Includes a working timer with hour, minute, and second controls.
- Displays latest news in an automatically rotating feed.
- Saves notes in browser storage through Redux-backed persistence.
- Uses polished loading states while API data is being fetched.

### Entertainment Discovery

- Fetches movies dynamically based on selected categories.
- Uses OMDb search results for personalized listing sections.
- Includes hover animations on movie cards.
- Opens a movie detail modal with expanded metadata.
- Provides local fallback content when an external API is unavailable.

## Technical Highlights

- Built with Next.js 13 App Router, React 18, and TypeScript.
- Styled with Tailwind CSS and reusable app-specific UI components.
- Uses Redux Toolkit for global user, category, and notes state.
- Uses TanStack React Query for client-side API fetching, caching, loading states, retry behavior, and request cancellation.
- Uses Next.js route handlers as server-side API proxies so third-party API keys stay out of the browser.
- Uses `next/image` for optimized image rendering.
- Includes SEO metadata, Open Graph tags, Twitter cards, sitemap, and robots configuration.
- Includes a Lighthouse report focused on performance, accessibility, best practices, and SEO.

## Lighthouse Score

Latest recorded Lighthouse dashboard score:

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

The report is available in `.lighthouse-dashboard.json`.

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Redux
- TanStack React Query
- React Hook Form
- Zod
- Lucide React
- React Loading Skeleton
- OpenWeatherMap API
- NewsAPI, World News API, or Google News RSS fallback
- OMDb API

## API Strategy

The browser does not call third-party services directly. Client components use React Query to call internal Next.js API routes:

| Internal Route | Purpose |
| --- | --- |
| `/api/weather` | Fetches and normalizes OpenWeatherMap data |
| `/api/news` | Fetches and normalizes latest news |
| `/api/movies` | Fetches OMDb search and movie detail data |

This approach keeps API keys server-side, centralizes response formatting, and allows route-level caching and fallback handling.

## React Query Usage

React Query is used for API-driven UI state:

- Weather query with a five-minute stale time.
- News query with a short stale time for fresh headlines.
- Movie category query keyed by selected categories.
- Movie detail query keyed by IMDb ID.
- Built-in request cancellation through `AbortSignal`.
- Consistent loading state handling without manual `useEffect` fetch logic.

## State Management

Global state lives in `lib/store.ts` and is managed with Redux Toolkit.

The store contains:

- Registered user data
- Selected entertainment categories
- Dashboard notes

State is persisted to `localStorage` using the key:

```text
superapp-storage
```

## SEO

SEO support is implemented through `lib/seo.ts`, route metadata, sitemap, and robots configuration.

The app includes:

- Page-level titles and descriptions
- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- SEO-friendly robots settings
- Dynamic sitemap generation

## Project Structure

```text
app/
  api/
    movies/route.ts
    news/route.ts
    weather/route.ts
  categories/
  dashboard/
  entertainment/
  register/
  layout.tsx
  loading.tsx
  providers.tsx
  robots.ts
  sitemap.ts
components/
  buttons/
  ui/
hooks/
lib/
  seo.ts
  store.ts
  utils.ts
public/
  images/
```

## Environment Variables

Create a `.env` file in the project root:

```env
OPENWEATHER_KEY=your_openweathermap_api_key
OMDB_KEY=your_omdb_api_key

# Use either NewsAPI or World News API.
NEWS_API_KEY=your_newsapi_key
WORLD_NEWS_API_KEY=your_world_news_api_key
```

The news route can also fall back to Google News RSS when a news API key is not available.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

If this repository is inside an extra parent folder, run commands from the actual app directory that contains `package.json`.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run typecheck
```

Runs TypeScript validation.

```bash
npm run lint
```

Runs Next.js lint checks.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building.

## Validation Rules

Registration validates:

- Name is required and must contain only letters and spaces.
- Username is required, must start with a letter, and may contain letters, numbers, and underscores.
- Email is required and must follow a valid email format.
- Mobile number is required and must contain 10 to 15 digits.

Category onboarding validates:

- At least three entertainment categories must be selected before continuing.

## Deployment

The app can be deployed on Vercel or Netlify. Add the required environment variables in the deployment dashboard before publishing.

For Netlify, the project includes `netlify.toml` and the Next.js Netlify plugin dependency.
