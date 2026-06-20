<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-20 | Updated: 2026-06-20 -->

# static

## Purpose
Container for static assets that are served directly at the root of the web application. These files are not processed by Vite.

## Key Files
| File | Description |
|------|-------------|
| `favicon.png` | Fallback raster favicon |
| `favicon.svg` | Scalable vector favicon |

## Subdirectories
(None)

## For AI Agents

### Working In This Directory
- Files placed here will be available at the public root URL (e.g., `/favicon.png`).
- Do not place source code, build scripts, or unoptimized images here if they should be processed by Vite. Those belong in `src/`.
- Use this strictly for public-facing raw assets like icons, manifests, or public fonts.

### Testing Requirements
- N/A

### Common Patterns
- Keep file sizes minimal.
- Use SVGs where applicable for scalability.

## Dependencies

### Internal
- N/A

### External
- N/A

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
