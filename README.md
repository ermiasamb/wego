# WeGo.org

A polished, frontend-only, multi-tenant training and capacity-building workspace. It combines a public learning catalog with a shared organization workspace for program delivery, cohorts, people, finance, content, credentials, and reports.

> **Demo only:** authentication, permissions, and persistence are simulated in the browser. Do not use real personal, financial, or confidential data. This is not a production security boundary.

## Run locally

```sh
npm install
npm run dev
```

The Vite server binds to `0.0.0.0`. For a production check, run `npm run build`; `npm run preview` serves the generated build. `npm run generate:seed` regenerates deterministic mock learner and organization data.

## Demo accounts

All seeded accounts use `wego-demo` as their password. The login screen also offers the demo identities.

| Account | Email | Scope |
| --- | --- | --- |
| Platform administrator | `superadmin@wego.demo` | Platform |
| Organization administrator | `admin@bridgeworks.demo` | BridgeWorks Ethiopia |
| Program manager | `manager@bridgeworks.demo` | BridgeWorks Ethiopia |
| Facilitator | `trainer@bridgeworks.demo` | Assigned delivery |
| Learner | `learner@bridgeworks.demo` | Personal learning |
| Finance | `finance@bridgeworks.demo` | BridgeWorks Ethiopia |
| M&E auditor | `audit@bridgeworks.demo` | National Institute for Public Service |
| Partner viewer | `partner@bridgeworks.demo` | Co-funded oversight |
| Content editor | `editor@vertex-learning.demo` | Vertex Learning & Advisory |

## Architecture

- One React SPA, router, shared shell, and reusable component system. Roles change capabilities through the shared permission-grant data and `can()` checks, not separate app trees.
- `services/mock-api.ts` is the mock API boundary. It provides simulated latency, structured errors, validation, tenant checks, and browser-local persistence.
- Tenant-owned records carry `organizationId`. Public routes expose only intended published/public projections; certificate verification is read-only.
- Shared style tokens and interaction components are documented in [`UI-SYSTEM.md`](UI-SYSTEM.md); project conventions are in [`SKILL.md`](SKILL.md); route details are in [`ROUTES.md`](ROUTES.md).

## Main capabilities

Public landing, course catalog and enrollment, events and stories, shared link/QR tools, and certificate verification. Authenticated features include dashboards and reporting, program/curriculum management, cohorts and session planning, attendance/QR check-in, participant CSV import, learner materials and assessments, six-category finance with budget-versus-actual reporting, certificates, tenant settings, invitations, a shared role/permission matrix, multi-role account administration, self-service password changes, admin password resets, suspended/deactivated status controls, consolidated user activity profiles, and notifications.
