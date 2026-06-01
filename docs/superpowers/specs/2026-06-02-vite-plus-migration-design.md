# Adopt Vite+ as the management layer

- **Date:** 2026-06-02
- **Status:** Approved (design)
- **Scope decision:** Full migration — local dev tooling, runtime/pnpm management (retire `mise.toml`), and CI/deploy.

## Context

This repo is an Astro 6 static blog (Tailwind CSS 4, pnpm). Source is **24 `.astro`
files, 1 `.ts`, 1 `.css`, 2 `.md`**. There is currently **no lint, format, or test**
setup. `mise.toml` pins Node 24.6.0 + pnpm 10.15.0. CI (`.github/workflows`) deploys to
GitHub Pages using `jdx/mise-action` + manual pnpm cache + `pnpm build` + `tar` +
`upload-artifact@v7` + `deploy-pages@v5`.

**Vite+ (`vp`)** is VoidZero's unified toolchain — MIT-licensed, free, currently **alpha**.
Relevant commands: `vp run` (cached task runner over `package.json` scripts; `vpr`
shorthand), `vp check` (Oxfmt format + Oxlint lint + optional tsgolint typecheck),
`vp install` / `vp env` (package-manager + runtime management), plus built-in
`vp dev` / `vp build` / `vp test`. Installed via shell script (`curl -fsSL https://vite.plus | bash`),
not npm. Official CI action: `voidzero-dev/setup-vp@v1`.

## Guiding principle — layering, not replacement

Vite+ **cannot replace Astro** for this repo, so it layers on top:

| Concern | Owner | Why |
|---|---|---|
| Site dev / build / preview | **Astro** (`astro dev/build/preview`) | `vp dev`/`vp build` run *plain* Vite; they can't drive an Astro meta-framework build |
| `.astro` typecheck | **Astro** (`astro check`) | Oxlint/tsgolint can't parse `.astro` templates |
| Single entry point for tasks | **Vite+** (`vp run` / `vpr`) | one CLI; cached, dependency-aware |
| Node + pnpm version mgmt | **Vite+** (`vp env`) → retires `mise.toml` | the chosen scope |
| Format + lint (`.ts`/`.js`/`.css`/`.json`/`.md` only) | **Vite+** (`vp check`) | new capability; `.astro` not supported by Oxlint/Oxfmt yet |
| CI setup + dependency caching | **Vite+** (`voidzero-dev/setup-vp@v1`) | collapses mise + pnpm-cache + install into one action |

**The rule baked into everything: use `vpr build`, never `vp build`.** `vpr build` runs
the `astro build` script; the built-in `vp build` would attempt a plain-Vite build and
break the site.

## Changes

### 1. Local install & runtime management
- Install `vp`: `curl -fsSL https://vite.plus | bash` (run by the user — system-level install).
- Enable runtime management: `vp env on`.
- Pin versions via standard fields so they survive `mise.toml` removal:
  - `package.json` → `"packageManager": "pnpm@10.15.0"`
  - Node pin via the source `vp env` actually reads (see Spike S1).
- **Delete `mise.toml`** — gated on Spike S1 confirming `vp` honors the Node pin.

### 2. `vite.config.ts` (new, repo root)
- `import { defineConfig } from 'vite-plus'` with `fmt` + `lint` blocks.
- **`typeCheck` OFF** so tsgolint does not choke on `.astro` imports; `astro check`
  remains the typecheck authority.
- Scope format/lint to supported files; exclude `dist/`, `.astro/`, `node_modules/`.
- **Verify** `astro build` still succeeds with this file present (Astro sets
  `configFile: false`, so it should be ignored by Astro's Vite — confirm, don't assume).

### 3. `package.json` scripts — uniform `vpr` surface
```jsonc
"scripts": {
  "dev":       "astro dev",
  "build":     "astro build",
  "preview":   "astro preview",
  "typecheck": "astro check",   // renamed from any "check" to avoid clashing with built-in `vp check`
  "astro":     "astro"          // passthrough, e.g. `vpr astro add sitemap`
}
```
Usage: `vpr dev`, `vpr build`, `vpr preview`, `vpr typecheck`, `vpr astro …`.

### 4. CI workflow (`.github/workflows/*.yml`)
Replace the tooling-setup block — `jdx/mise-action`, the manual pnpm-store cache,
`pnpm install --frozen-lockfile`, `pnpm build` — with:
1. `voidzero-dev/setup-vp@v1` (`cache: true`, Node version input per Spike S3)
2. `vp check`  ← **new CI gate** (format/lint on `.ts`/`.css`/config; fails build on issues)
3. `vp install`
4. `vpr build`

**Unchanged:** the `tar … artifact.tar`, `upload-artifact@v7`, and `deploy-pages@v5`
steps, job/permissions/concurrency structure, and triggers.

### 5. Documentation
- `CLAUDE.md`: update the Build & Dev Commands block to `vpr …`; replace the
  "Tool versions managed by `mise.toml`" line with the `vp env` mechanism; update the
  Deployment paragraph (mise-action → `setup-vp`).
- `README.md`: update the Commands table from `pnpm …` to `vpr …`.

## Non-goals (YAGNI)
- **No `vp test` / Vitest scaffolding** — zero tests exist; it's a static blog.
  `vp test` stays available for the future; no empty test infra added now.
- No changes to `src/`, styling, the artifact/deploy steps, or CI triggers.
- No attempt to lint/format/typecheck `.astro` files via Vite+ (unsupported upstream).

## Naming gotchas (documented for future readers)
- `vp build` ≠ `vpr build`. Site build is **always** `vpr build`.
- `vp check` (format/lint, built-in) ≠ `vpr typecheck` (Astro types). Different tools,
  kept behind different words on purpose.

## Verification
- `vp --version` succeeds; `vp env` reports managed Node/pnpm matching the old pins.
- `vpr build` output is byte-for-byte equivalent to the pre-migration `astro build`
  `dist/` (diff check) before merge.
- `vp check` runs clean on the supported files.
- CI: first `master` push is the live test (deploy gated on push). Old workflow remains
  in git history for instant revert.

## Rollback
Single-commit migration. To revert: `git revert` restores `mise.toml`, the old
`package.json` scripts, and the mise-based workflow. The only irreversible-by-edit step
is `mise.toml` deletion, which is gated on Spike S1 and recoverable via git.

## Risks
- **Alpha tooling in the deploy path.** `vp` is alpha and will gate/publish the site.
  Mitigated by: keeping the build owned by Astro, byte-diff verification before merge,
  and a one-command rollback.
- **Alpha CLI/config drift.** Command names or config keys may shift; pin
  `setup-vp@v1` and record exact versions used.

## Spikes to resolve during implementation
- **S1 — Node pin source:** Confirm where `vp env` reads the Node version (e.g.
  `package.json` engines, `.node-version`, or vp-specific config). Must reproduce
  Node 24.6.0 before `mise.toml` is deleted.
- **S2 — `vite-plus` import:** Determine whether `import { defineConfig } from 'vite-plus'`
  needs a dev dependency / types package, or is resolved by the `vp` binary.
- **S3 — `setup-vp` inputs:** Confirm the `node-version` / `cache` input names and the
  `@v1` tag behavior for `voidzero-dev/setup-vp`.
