# Devsync Template - Agent Guidelines

## Project Overview

This is an Astro-based portfolio/profile template with i18n support, Tailwind CSS styling, and Zod validation. The project uses **Bun** as package manager and requires **Node.js >= 22.12.0**.

---

## Build Commands

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run preview    # Preview production build
bun run astro      # Run Astro CLI (e.g., astro check)
```

> **Note**: There are no lint or test scripts configured. Run `bun run build` to verify changes compile correctly.

---

## Project Structure

```
src/
├── components/       # Reusable UI components (*.astro files)
├── layouts/         # Page layouts (layout.astro)
├── pages/           # Routes, including [lang]/ for i18n pages
├── sections/        # Page sections (hero, projects, experience, etc.)
├── styles/          # Global CSS (global.css with Tailwind)
└── devsync/         # Data layer and validation
    ├── devsync.ts           # Main export, loads DEVSYNC.json
    ├── devsync-validator.ts # Zod schemas and types
    └── fields-translations.ts # i18n field translations
DEVSYNC.json         # Profile data (the only file users should edit)
astro.config.mjs     # Astro configuration
tsconfig.json        # TypeScript config (extends astro/tsconfigs/strict)
```

---

## Code Style Guidelines

### TypeScript

- Use strict TypeScript (project extends `astro/tsconfigs/strict`)
- Define explicit types for all Props interfaces
- Prefer `interface` over `type` for object shapes
- Use Zod schemas for runtime validation (devsync-validator.ts)

### Astro Components

**Frontmatter (server-side)**:
```astro
---
import devsync from '@core'  // Use @ path alias
import { defaultLang } from '@core'
import type { availableLangsType } from '@/devsync/fields-translations'

const lang = (Astro.params.lang || defaultLang).toLowerCase() as availableLangsType
const profile = devsync[lang] ?? devsync[defaultLang]
---
```

**Template**:
- Use `{expression}` for dynamic values
- Use `{condition && (<component />)}` for conditional rendering
- Use `{array.map((item) => (<component {item} />))}` for lists
- Always provide `key` props when mapping (implicit in Astro)
- Access nested properties safely: `obj?.nested?.property ?? defaultValue`

### Props Interfaces

```typescript
interface Props {
  name?: string           // Optional props with ?
  url?: string
  icon?: string
  items?: {               // Nested objects also optional
    label: string
    value: string
  }[]
}
```

### Conditional Rendering Pattern

```astro
{
  items?.length ? (
    <ul>
      {items.map((item) => (
        <li>{item.label}</li>
      ))}
    </ul>
  ) : null
}
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ProjectCard.astro`, `InfoCard.astro` |
| Props | camelCase | `projectName`, `imageUrl` |
| Props interfaces | `Props` suffix | `interface Props { name?: string }` |
| Variables | camelCase | `const profile = devsync[lang]` |
| CSS classes | Tailwind kebab-case | `class="mb-6 text-lg"` |
| Zod schemas | PascalCase | `LinkSchema`, `ExperienceSchema` |
| Types | PascalCase | `Link`, `DevsyncPartial` |

---

## Import Conventions

```astro
---
// Use @ path alias (configured in tsconfig.json)
import Layout from '@/layouts/layout.astro'
import ProjectCard from '@/components/project-card.astro'
import { defaultLang } from '@core'

// External packages
import { z } from 'zod'
import '@fontsource-variable/jost'

// CSS
import '@/styles/global.css'
---
```

---

## Error Handling

- Use Zod for data validation (devsync-validator.ts)
- Provide fallback values: `profile.experience ?? []`
- Use optional chaining: `obj?.property?.nested`
- Never expose raw error messages to users

---

## CSS/Tailwind Guidelines

- Use Tailwind utility classes in `.astro` files
- Define custom colors in `src/styles/global.css` using CSS variables under `@theme`
- Dark mode uses `.dark` class on `<html>`, toggle via JavaScript
- Use `bg-main`, `text-text`, `border-third` etc. (custom theme colors)
- Avoid arbitrary values; prefer existing Tailwind scale
- Use `backdrop-blur-sm` and `shadow-*` for glassmorphism effects
- Use `transition-*` and `hover:*` for micro-interactions

---

## i18n Pattern

```typescript
// src/devsync/fields-translations.ts
export const translations = {
  en: { 'Projects': 'Projects', 'Experience': 'Experience' },
  es: { 'Projects': 'Proyectos', 'Experience': 'Experiencia' },
} as const

export type availableLangsType = keyof typeof translations
```

Access via: `const translation = translations[lang]` then `translation['Projects']`

---

## Data Model (DEVSYNC.json)

The `DEVSYNC.json` file is the single source of truth for profile data. Structure:

```json
{
  "defaultLang": "en",
  "name": "Full Name",
  "img": "https://...",
  "site": "https://...",
  "githubUserName": "username",
  "socialMedia": [{ "name", "url", "icon", "mdBadge" }],
  "en": {
    "jobTitle": "Title",
    "description": "Bio text",
    "experience": [{ "company", "position", "img", "web", "date", "links", "description", "list", "skills" }],
    "projects": [{ "name", "img", "web", "links", "description", "list", "skills" }],
    "education": [{ "name", "degree", "img", "date", "links", "list" }],
    "certifications": [{ "name", "url", "list", "skills" }]
  }
}
```

---

## Accessibility

- Always include `alt` text for images
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`)
- Include `aria-label` on icon-only buttons
- Use `rel="noopener noreferrer"` on external links

---

## File Creation Guidelines

- Create new components in `src/components/`
- Create new sections in `src/sections/`
- Use existing patterns (InfoCard, ProjectCard, Badge) as templates
- Follow the Props interface pattern with optional fields
- Don't add comments unless explicitly requested
- Ensure responsive design (mobile-first, test `lg:` breakpoints)