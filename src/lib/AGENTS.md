<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# lib

## Purpose

Shared application code containing reusable Svelte components, server-side services and database schemas, authentication configuration, and i18n logic.

## Key Files

| File             | Description                                   |
| ---------------- | --------------------------------------------- |
| `auth-client.ts` | BetterAuth client initialization              |
| `index.ts`       | Main export/barrel file for library utilities |

## Subdirectories

| Directory     | Purpose                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `components/` | Reusable UI components (see `components/AGENTS.md`)                       |
| `paraglide/`  | Auto-generated i18n logic and dictionaries                                |
| `server/`     | Server-only code, database schemas, and services (see `server/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Code here should be generic and reusable across multiple routes.
- Anything in `server/` is restricted to the server environment (e.g., Node.js backend). Never import `lib/server/` code into client-side Svelte components.

### Testing Requirements

- Unit tests for services and components should reside alongside the code or in a dedicated tests folder.

### Common Patterns

- Svelte components should leverage `components/ui` if they rely on the underlying design system (shadcn/ui or similar).

## Dependencies

### Internal

- N/A (this is the base shared folder)

### External

- BetterAuth (auth-client.ts)
- Paraglide (i18n)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
