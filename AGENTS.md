# Devsync Template - Agent Guidelines

## Project Overview

Astro 6 static site generator for multilingual portfolio/profile pages. Tailwind CSS 4 (via `@tailwindcss/vite`), Zod validation, Bun package manager. Node.js >= 22.12.0 required.

## Commands

```bash
pnpm run dev        # Dev server
pnpm run build      # Production build (only verification step — no lint/test)
pnpm run preview    # Preview build output
pnpm run astro      # Direct Astro CLI access
```

CI auto-generates CV/README/LinkedIn artifacts on every `DEVSYNC.json` push via `bunx @jannael/devsync build`.

## Architecture

```
src/
├── components/       # badge, info-card, navbar, project-card, timeline-item
├── layouts/          # layout.astro (SEO, structured data, theme toggle)
├── pages/            # index.astro (root redirect), [lang]/index.astro, [lang]/cv.astro
├── sections/         # hero, experience, projects, education, certifications, footer, lang-switcher, theme-switcher
├── styles/           # global.css (Tailwind @theme vars + custom classes)
└── devsync/          # devsync.ts (entry), devsync-validator.ts (Zod), fields-translations.ts (i18n)
```

**Path aliases** (`tsconfig.json`):
- `@/*` → `src/*`
- `@core` → `src/devsync/devsync`

## Data Flow

1. `DEVSYNC.json` is the single source of truth — root-level fields are global (`name`, `img`, `socialMedia`, `site`, `githubUserName`, `defaultLang`), locale keys (`en`, `es`) hold translated content.
2. `src/devsync/devsync.ts` loads + validates via `parseDevsync()` (Zod `deepPartial()`), exports `languages` array derived from non-global keys.
3. Every page/section imports from `@core`, resolves `lang` from `Astro.params.lang ?? defaultLang`, falls back: `devsync[lang] ?? devsync[defaultLang]`.

## i18n

Routing: prefix on all locales including default (`prefixDefaultLocale: true`, `redirectToDefaultLocale: true`).
Translation keys live in `fields-translations.ts` — add new keys to both `en` and `es` objects.
`localeMap` maps lang codes to OG locale strings (`en_US`, `es_ES`).

## CSS / Theming

Tailwind 4 custom theme vars in `global.css`:
- `--color-main`, `--color-text`, `--color-text-secondary`, `--color-accent`, `--color-accent-light`, `--color-border`

Dark mode: `.dark` class on `<html>`, persisted in `localStorage`, respects `prefers-color-scheme`.
Custom classes: `.highlight`, `.text-gradient`, `.card`, `.timeline-line`, `.timeline-dot`, `.section-divider`.
Icons in `/icons/` are auto-themed via CSS `filter: brightness(0)` / `invert(1)` in dark mode.

## Component Patterns

**Frontmatter boilerplate**:
```astro
---
import devsync from '@core'
import { defaultLang } from '@core'
import type { availableLangsType } from '@/devsync/fields-translations'

const lang = (Astro.params.lang || defaultLang).toLowerCase() as availableLangsType
const profile = devsync[lang] ?? devsync[defaultLang]
---
```

**Props**: always `interface Props` with optional fields (`?`). Use `Astro.props` destructuring.
**Conditional rendering**: `{items?.length ? (...) : null}`
**Lists**: `{array.map((item) => (<Component {...item} />))}`
**InfoCard** (`info-card.astro`): shared by experience + projects sections. Supports `expand` prop for single-item layouts.
**Badge** (`badge.astro`): icon + text pill for social links. Icons need `shrink-0` to prevent flex misalignment.

## Zod Validation

All schemas in `devsync-validator.ts`. `devsyncSchema` uses `.catchall(devsyncObjectSchema.deepPartial())` so locale sections are optional. Never mutate schema — add fields there if DEVSYNC.json structure changes.

## SEO

Layout auto-generates: canonical URL, OG tags, Twitter cards, JSON-LD (Person + WebSite graph). Requires `site` in `DEVSYNC.json` or `astro.config.mjs` for correct canonicals. OG image: `/logo-og.png` (1254x1254).

## Conventions

- Components/sections: PascalCase filenames, lowercase in imports (`import Layout from '@/layouts/layout.astro'`)
- No comments unless explicitly requested
- Always guard array access: `profile.experience ?? []`, `items?.length`
- Responsive: mobile-first, `lg:` breakpoint for desktop
- External links: `target="_blank" rel="noopener noreferrer"`
- Images: always include `alt`
