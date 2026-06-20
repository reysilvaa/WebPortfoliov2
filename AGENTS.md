<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# portofolio

## Purpose

A web application portfolio built with SvelteKit, integrating various services and a dashboard for content management.

## Key Files

| File                | Description                      |
| ------------------- | -------------------------------- |
| `package.json`      | Project dependencies and scripts |
| `svelte.config.js`  | SvelteKit configuration          |
| `vite.config.ts`    | Vite bundler configuration       |
| `drizzle.config.ts` | Drizzle ORM configuration        |
| `eslint.config.js`  | ESLint configuration             |

## Subdirectories

| Directory         | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `src/`            | Application source code (see `src/AGENTS.md`) |
| `static/`         | Static assets (see `static/AGENTS.md`)        |
| `project.inlang/` | Inlang translation configuration              |
| `drizzle/`        | Database migrations and schemas               |

## For AI Agents

### Working In This Directory

- Check `package.json` for available scripts (`pnpm dev`, `pnpm build`, etc.)
- This is the root of the workspace. Always respect `.prettierrc` and ESLint configurations.
- Use `pnpm` for package management.

### Testing Requirements

- Check `vitest` configuration if applicable.

### Common Patterns

- This directory contains primarily configuration files. Keep configuration changes minimal and test them across the stack.

## Dependencies

### Internal

- `src/` components and routes

### External

- SvelteKit
- Drizzle ORM
- TailwindCSS
- Paraglide (i18n)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, drizzle, better-auth, storybook, mcp, paraglide, mdsvex

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
