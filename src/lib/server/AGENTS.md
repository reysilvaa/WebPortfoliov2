<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# server

## Purpose

Server-side only library code. This code will only execute in a Node.js/server context and should never be imported into client-side Svelte components.

## Key Files

| File      | Description                                        |
| --------- | -------------------------------------------------- |
| `auth.ts` | BetterAuth server configuration and initialization |

## Subdirectories

| Directory   | Purpose                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| `db/`       | Database connection logic and Drizzle ORM schemas (see `db/AGENTS.md`)          |
| `services/` | Business logic services (e.g., Portfolio management) (see `services/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **CRITICAL**: SvelteKit will throw an error if anything from `$lib/server` is imported in client-side code (`.svelte` files or non-server `.ts` files).
- To use this code, call it from a `+page.server.ts` or `+server.ts` endpoint, and pass the required data via `data` prop or JSON response.

### Testing Requirements

- Mock the database or use a test database when testing services here.

### Common Patterns

- Centralize complex business logic in `services/`.
- Keep schema definitions in `db/schema.ts`.

## Dependencies

### Internal

- N/A

### External

- BetterAuth (server side)
- Drizzle ORM
- Postgres/database driver

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
