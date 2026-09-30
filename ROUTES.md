# WeGo.org unified route map

One router and one shared shell; role and tenant visibility derive from mock permission grants, not route trees.

## Public
- `/` — marketing landing page
- `/catalog` and `/catalog/:programId` — course catalog and program detail/registration
- `/events` and `/events/:slug` — event discovery and shareable detail
- `/blog` and `/blog/:slug` — published stories and shareable detail
- `/verify/:slug` — read-only certificate verification
- `/login` — mock authentication
- `/checkin/:sessionId` — learner session check-in

## Authenticated workspace
- `/app` — permission-aware overview
- `/app/learning` — learner programs, schedule, materials, assessments and reflections
- `/app/programs` — program portfolio and creation
- `/app/programs/:programId/curriculum` — learning-module management
- `/app/cohorts` — cohort rosters, attendance and CSV import
- `/app/calendar` — session calendar with facilitator/venue filters and conflict checks
- `/app/people` — participants, facilitators and tenant users
- `/app/finance` — expense ledger, six categories and budget rollups
- `/app/blog` and `/app/events` — shared content-management workflows
- `/app/certificates` — eligibility, issuing, revocation, QR and sharing
- `/app/reports` — shared analytics and exports
- `/app/notifications` — notification center
- `/app/settings` — tenant branding and workspace settings (permission-gated)
- `/app/roles` — role directory, reusable permission matrix, role duplication, and safe reassignment on deletion (Platform Super Admin / Organization Admin)

Unknown paths render a shared not-found state. Public and authenticated routes share cards, tables, status badges, share controls, and loading/error primitives; no role-specific directory or app tree is introduced.
