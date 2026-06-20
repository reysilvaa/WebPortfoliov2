<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# src

## Purpose

The main application source code directory. It contains all frontend routes, backend APIs, shared components, server code, and storybook stories for the SvelteKit portfolio project.

## Key Files

| File              | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `app.d.ts`        | Global type declarations for SvelteKit                        |
| `app.html`        | The main HTML shell for the application                       |
| `hooks.server.ts` | Server-side hooks (e.g., authentication, i18n initialization) |
| `ambient.d.ts`    | Ambient TypeScript declarations                               |

## Subdirectories

| Directory  | Purpose                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `lib/`     | Shared libraries, components, services, and server code (see `lib/AGENTS.md`) |
| `routes/`  | SvelteKit file-based routing and API endpoints (see `routes/AGENTS.md`)       |
| `stories/` | Storybook UI component stories (see `stories/AGENTS.md`)                      |

## For AI Agents

### Working In This Directory

- Keep global setup logic in `hooks.server.ts` or `app.html`.
- Business logic should generally reside in `lib/`, and routes in `routes/`.
- Respect SvelteKit's module boundaries (e.g., `$lib` alias).

### Testing Requirements

- Storybook stories should be placed or mirrored in `stories/`.

### Common Patterns

- Svelte 5 and SvelteKit best practices.
- Types are primarily managed via `app.d.ts`.

## Dependencies

### Internal

- `lib/` for shared dependencies across routes.
- `routes/` for page definitions.

### External

- SvelteKit framework core libraries.
- BetterAuth (configured in hooks).

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
