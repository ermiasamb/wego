# UI system & component inventory

## Tokens
`design-tokens.ts` is the design reference (orange/black brand, semantic status colors, spacing, radii, shadows, and motion). `src/styles.css` exposes the same palette as CSS custom properties so CSS components and state treatments consume a shared layer. Keep feature CSS semantic and use shared tokens.

## Shared primitives currently in the app
- `Button`: primary, secondary, quiet, and dark variants; lift/shadow hover, pressed compression, disabled/loading affordance.
- `Link`: SPA deep-link navigation with shared animated text-link affordance.
- `Card` / `Panel`: reusable card and dashboard surfaces with elevation and consistent radius.
- `Badge` / `StatusBadge`: one shared status treatment for account and business-record states.
- `PermissionMatrix`: reusable module-by-action checkbox grid used by role administration.
- `visibleFields()`: field-level authorization helper for person-account projections.
- `Share`: canonical URL copy action, clipboard fallback, confirmation micro-interaction; used by public events, stories, and certificates.
- `PageHeading`, `Metric`, `Empty`, `SkeletonDashboard`, `Notice`: shared page framing, KPI, empty, loading, and feedback states.
- `table-scroll` table pattern: responsive scroll wrapper, consistent headers, rows, participant identity, status badges.
- `Feature`, chart primitives (`bar-chart`, `budget-bar`), and responsive content cards compose the public and authenticated surfaces.

## Interaction conventions
Use visible loading state for service-backed operations, structured service errors with retry, skeletons rather than blank regions, a useful empty state for no records, toast confirmation for completion, and disabled controls while requests are in flight. Motion stays short and purposeful, with reduced-motion preferences respected as the styles mature. Event/story/certificate links use `/events/:slug`, `/blog/:slug`, `/verify/:slug` and the same Share component.

## Data boundary
`services/mock-api.ts` is the API facade. Components should be migrated to typed facade calls as feature data becomes interactive; seed modules remain fixtures, never the eventual component-facing API. Auth is isolated in `services/auth.ts`. Tenant-filtered endpoints must not expose records outside the active tenant; public endpoints must explicitly project safe fields.
