# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern tech blog built with Astro 4.x, Svelte 5.x, and shadcn-svelte. The architecture follows Astro's Islands pattern where static content is rendered as HTML and interactive components (Svelte) are hydrated only where needed.

**Key Technologies:**

- **Astro 4.x**: Static site generator with Islands Architecture
- **Svelte 5.x**: Interactive components with runes ($state, $props)
- **shadcn-svelte**: Pre-built UI components (Button, Card, Separator)
- **TypeScript**: Strict mode with esbuild for ultra-fast compilation (10-100x faster than tsc)
- **Tailwind CSS**: Utility-first styling with custom theme variables
- **pnpm**: Package manager (required, not npm)

## Development Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Type check + build for production
pnpm preview          # Preview production build
pnpm astro check      # Type check only (no build)

# Adding shadcn-svelte components
pnpm dlx shadcn-svelte@latest add [component]
```

**Node Version:** 20.11.0 (specified in `.node-version` and `.mise.toml`)

## Architecture & Key Concepts

### Islands Architecture

- **Static components** (`.astro` files in `src/components/astro/`): Rendered as HTML at build time
- **Interactive components** (`.svelte` files in `src/components/svelte/`): Hydrated client-side using `client:load` or `client:idle` directives

Example:

```astro
<ThemeToggle client:load />
<!-- Svelte component, hydrated on page load -->
```

### Content Collections

Blog posts are managed through Astro's Content Collections with type-safe frontmatter validation:

**Location:** `src/content/blog/*.mdx`

**Schema:** Defined in `src/content/config.ts` with Zod validation:

- `title` (string, required)
- `description` (string, required)
- `pubDate` (Date, required)
- `author` (string, default: "Author Name")
- `tags` (string[], default: [])
- `draft` (boolean, default: false)
- `image` (string, optional)

**Usage:**

```typescript
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
```

### Import Aliases & Path Resolution

**Critical:** The project uses `$lib` alias for shadcn-svelte components, configured in:

1. `tsconfig.json` - TypeScript path mapping
2. `astro.config.mjs` - Vite alias resolution (`'$lib': '/src/lib'`)

**Import patterns:**

```typescript
import { cn } from '$lib/utils'; // Utility functions
import Button from '$lib/components/ui/button/button.svelte';
```

### Dark Mode Implementation

Dark mode uses a two-phase approach to prevent flash:

1. **Inline script in `BaseLayout.astro`**: Runs before render to apply theme from localStorage
2. **ThemeToggle.svelte**: Interactive toggle component that updates DOM class and localStorage

Theme is persisted in `localStorage.theme` and applied to `document.documentElement` as a `dark` class.

### Layouts Hierarchy

- **BaseLayout.astro**: Root layout with HTML structure, SEO tags, dark mode script
- **BlogLayout.astro**: Extends BaseLayout for blog posts, adds article structure with metadata

### shadcn-svelte Components

Components are installed in `src/lib/components/ui/` with the following structure:

```
src/lib/components/ui/
├── button/
│   ├── button.svelte
│   └── index.ts
├── card/
│   ├── card.svelte
│   ├── card-content.svelte
│   ├── card-header.svelte
│   └── ...
```

**Important:** shadcn-svelte CLI may create components in `$lib/` (root directory). Always move them to `src/lib/components/ui/` to match the Vite alias configuration.

## Styling System

### Tailwind CSS Configuration

Custom theme extends Tailwind with:

- **Dark mode**: Class-based (`darkMode: ['class']`)
- **CSS variables**: Uses HSL color variables for theme consistency
- **Container**: Centered with responsive padding
- **Typography plugin**: For prose content styling

### Global CSS Variables

Defined in `src/styles/global.css` using HSL values:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

Colors are accessed via Tailwind utilities: `bg-background`, `text-foreground`, `bg-primary`

## Code Syntax Highlighting

Configured in `astro.config.mjs` using Shiki:

- **Theme**: `github-dark`
- **Supported languages**: JavaScript, TypeScript, JSX, TSX, Python, Java, Go, Rust, SQL, Bash, YAML, JSON

## Routing & Pages

Astro uses file-based routing:

- `src/pages/index.astro` → `/`
- `src/pages/blog/index.astro` → `/blog`
- `src/pages/blog/[...slug].astro` → `/blog/{slug}` (dynamic routes for blog posts)
- `src/pages/rss.xml.ts` → `/rss.xml` (API route)

## Deployment

Automated via GitHub Actions (`.github/workflows/deploy.yml`):

- Triggered on push to `main` branch
- Uses pnpm for dependency installation
- Deploys to GitHub Pages
- Build artifacts go to `dist/` directory

**Site URL:** https://yish0.github.io

## Creating New Blog Posts

1. Create `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields (title, description, pubDate)
3. Write content using Markdown/MDX
4. Commit and push to trigger deployment

Example frontmatter:

```mdx
---
title: 'Post Title'
description: 'Brief description'
pubDate: 2025-01-20
author: 'Your Name'
tags: ['tag1', 'tag2']
---
```

## Performance Characteristics

- **TypeScript compilation**: ~50-200ms (esbuild, Go-based)
- **Hot reload**: <100ms per change
- **Full build**: <5s for 50 posts
- **Target Lighthouse score**: 95-100

## Important Notes

1. **Always use pnpm**, not npm or yarn
2. When adding shadcn-svelte components, verify they're in `src/lib/components/ui/`, not `$lib/` root directory
3. Svelte 5 uses runes (`$state`, `$props`) instead of stores for reactivity
4. Client directives (`client:load`, `client:idle`) are required for Svelte components to be interactive
5. Dark mode class must be added to `document.documentElement`, not `body`
