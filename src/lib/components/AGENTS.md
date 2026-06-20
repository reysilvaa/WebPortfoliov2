<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# components

## Purpose

Reusable UI components for the portfolio and dashboard. Includes both custom components and integrated design system primitives (e.g., shadcn-svelte).

## Key Files

(No top-level files; components are generally organized into directories or grouped directly here).

## Subdirectories

| Directory | Purpose                                                               |
| --------- | --------------------------------------------------------------------- |
| `ui/`     | shadcn-svelte primitives and generic UI elements (see `ui/AGENTS.md`) |
| (others)  | Feature-specific reusable components                                  |

## For AI Agents

### Working In This Directory

- Build generic, reusable Svelte 5 components.
- Rely on `components/ui` for basic elements like Buttons, Inputs, Cards.
- Follow mobile-first and responsive design practices.

### Testing Requirements

- Unit tests or Storybook stories in `src/stories`.

### Common Patterns

- Use Svelte 5 snippets, props, and standard styling (Tailwind).
- `ui/` components are generally unmodified from their shadcn-svelte generated source.

## Dependencies

### Internal

- N/A

### External

- TailwindCSS
- Lucide-svelte (for icons)
- Bits-ui (underlying headless components for shadcn)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
