<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# routes

## Purpose

SvelteKit file-based routing. This directory defines the pages, layouts, and API endpoints for the entire application.

## Key Files

| File              | Description                                    |
| ----------------- | ---------------------------------------------- |
| `+layout.svelte`  | Root layout wrapper for the application        |
| `+page.svelte`    | The landing/home page UI                       |
| `+page.server.ts` | Server-side data fetching for the landing page |
| `layout.css`      | Global styling for the root layout             |

## Subdirectories

| Directory    | Purpose                                                           |
| ------------ | ----------------------------------------------------------------- |
| `api/`       | Backend REST/API endpoints (see `api/AGENTS.md`)                  |
| `dashboard/` | Admin and management dashboard routes (see `dashboard/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- This directory strictly follows SvelteKit routing conventions (`+page.svelte`, `+page.server.ts`, `+layout.svelte`, etc.).
- The `+page.svelte` in this directory is heavily customized (currently ~30k bytes) and contains the main portfolio experience. Edit carefully.
- Move large logical chunks out of `+page.svelte` into `src/lib/components` if necessary, but respect the current structure if the user hasn't asked for a refactor.

### Testing Requirements

- Verify rendering on the client and server.

### Common Patterns

- Data fetching via `+page.server.ts` -> injected into `+page.svelte` via `data` prop.

## Dependencies

### Internal

- Imports components from `$lib/components`.
- Uses server services from `$lib/server/services`.

### External

- SvelteKit router and context.

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
