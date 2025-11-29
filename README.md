# Tech Blog

A modern, performant tech blog built with Astro, Svelte, and shadcn-svelte.

## Features

- ⚡ **Lightning Fast**: Built with Astro for optimal performance
- 🎨 **Beautiful UI**: shadcn-svelte components with Tailwind CSS
- 🌙 **Dark Mode**: Automatic theme switching with no flash
- 📝 **MDX Support**: Write blog posts with enhanced Markdown
- 🎯 **TypeScript**: Type-safe code with esbuild compilation
- 📱 **Responsive**: Works great on mobile, tablet, and desktop
- 🔍 **SEO Optimized**: Sitemap, RSS feed, and meta tags
- 🎨 **Code Highlighting**: Syntax highlighting for 11+ languages

## Tech Stack

- **Framework**: Astro 4.x
- **UI Library**: Svelte 5.x + shadcn-svelte
- **Styling**: Tailwind CSS
- **TypeScript**: Strict mode with esbuild
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages via GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20.11.0 or higher
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yish0/yish0.github.io.git
cd yish0.github.io

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:4321`

## Development Commands

```bash
pnpm dev              # Start dev server (port 4321)
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm astro check      # Type check without building
```

## Project Structure

```
yish0.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── astro/             # Static Astro components
│   │   └── svelte/            # Interactive Svelte components
│   ├── content/
│   │   └── blog/              # Blog posts (.mdx files)
│   ├── layouts/               # Page layouts
│   ├── lib/
│   │   └── components/        # shadcn-svelte components
│   ├── pages/                 # Routes
│   └── styles/                # Global styles
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Writing Blog Posts

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Brief description"
pubDate: 2025-01-20
author: "Your Name"
tags: ["tag1", "tag2"]
---

## Your Content Here

Write your post in Markdown/MDX...
```

## Adding shadcn-svelte Components

```bash
pnpm dlx shadcn-svelte@latest add [component]
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Deployment

```bash
git add .
git commit -m "Update content"
git push origin main
```

GitHub Actions will handle the build and deployment.

## Performance

- **Lighthouse Score**: 95-100
- **Build Time**: <5s for 50 posts
- **Hot Reload**: <100ms per change
- **TypeScript Compilation**: ~50-200ms (esbuild)

## License

MIT

## Links

- **Live Site**: https://yish0.github.io
- **Astro**: https://astro.build
- **shadcn-svelte**: https://www.shadcn-svelte.com
- **Tailwind CSS**: https://tailwindcss.com
