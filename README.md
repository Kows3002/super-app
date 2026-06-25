# Super App

A polished Next.js dashboard that combines account onboarding, personalized entertainment categories, live weather, rotating news, notes, a countdown timer, and movie recommendations in one responsive experience.

## Features

- Account registration with robust form validation for name, username, email, and mobile number.
- Category selection flow with a minimum of 3 entertainment preferences.
- Personalized dashboard with profile summary, selected categories, weather, news, notes, and timer.
- Latest news carousel that changes every 2 seconds and avoids duplicate articles.
- Entertainment page powered by selected categories and OMDb movie data.
- Movie detail modal with rating, runtime, cast, director, genre, and plot.
- Redux Toolkit state management with localStorage persistence.
- Tailwind CSS design system with reusable app button components.
- Skeleton loading states using `react-loading-skeleton`.
- Page-level SEO metadata, Open Graph tags, Twitter cards, sitemap, and robots config.
- Next.js API routes for cached server-side third-party API requests.
- Optimized images through `next/image`.

## Tech Stack

- Next.js 13 App Router
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Redux
- React Loading Skeleton
- Lucide React
- OpenWeatherMap API
- NewsAPI
- OMDb API

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
OPENWEATHER_KEY=your_openweathermap_api_key
NEWS_KEY=your_newsapi_key
OMDB_KEY=your_omdb_api_key
```

The app reads these keys only on the server through Next.js API routes.

### 3. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs Next.js ESLint checks.

```bash
npm run typecheck
```

Runs TypeScript without emitting files.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to registration |
| `/register` | User registration and validation |
| `/categories` | Entertainment category selection |
| `/dashboard` | Weather, news, notes, timer, and profile dashboard |
| `/entertainment` | Personalized movie recommendations |
| `/api/weather` | Cached server-side weather API proxy |
| `/api/news` | Cached server-side news API proxy |
| `/api/movies` | Cached server-side OMDb API proxy |

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

## State Management

Global app state lives in `lib/store.ts` and is managed with Redux Toolkit.

Stored state includes:

- Registered user
- Selected entertainment categories
- Dashboard notes

The Redux store persists data to `localStorage` under:

```text
superapp-storage
```

## API and Caching

Third-party API calls are handled by Next.js route handlers instead of the browser:

- Weather data revalidates every 5 minutes.
- News data revalidates every 2 minutes.
- Movie data revalidates every 1 hour.

This keeps API keys server-side and reduces repeated client-side network work.

## SEO

The app includes:

- Root metadata defaults
- Page-specific metadata layouts
- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- Sitemap generation
- Robots configuration

SEO helper logic lives in:

```text
lib/seo.ts
```

## Reusable Buttons

App-specific button patterns live in:

```text
components/buttons/index.tsx
```

Available button components include:

- `BrandButton`
- `SubmitButton`
- `TextNavButton`
- `IconControlButton`
- `SecondaryButton`
- `DarkButton`
- `DotButton`
- `TagRemoveButton`
- `CategoryCardButton`
- `MovieCardButton`
- `ModalCloseButton`

## Validation Rules

Registration validates:

- Name is required, must be more than 3 letters, and may contain only letters/spaces.
- Username is required, must include more than 3 letters, must start with a letter, and may contain letters, numbers, and underscores.
- Email is required and must match a valid email format.
- Mobile number is required and must contain 10 to 15 digits.

## Performance Notes

- Uses `next/image` for optimized local and remote images.
- Uses server-side API routes with revalidation.
- Uses skeleton loading for route and data loading states.
- Uses reusable components to reduce repeated UI code.
- Uses Tailwind utility classes with centralized theme tokens.

## Quality Checks

Before committing, run:

```bash
npm run typecheck
npm run lint
```

## Deployment

The project is ready for deployment on platforms that support Next.js, including Vercel and Netlify. Add the required environment variables in your deployment provider before publishing.
