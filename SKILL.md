# WeGo.org Frontend Engineering Standards

## Architecture
- **DRY / no role or tenant forks:** one application shell, router, page set, and component system. Never add role-, sector-, or organization-specific routes/page trees. Gate capabilities in shared screens using `can()`.
- Treat the mock service as the API boundary. Components consume service functions, never seed arrays or local-storage internals directly.
- Keep every tenant-owned business record scoped with `organizationId`. Tenant filtering belongs in the service layer; only a platform-level permission can request cross-tenant data.

## Mock-data-driven RBAC
Roles and permissions are records in the mock data layer, not role-name conditionals in components. Role administrators use the same `roles` and `permissionGrants` arrays as `can()`. The shared `PermissionMatrix` component edits those grant records; built-in roles remain locked and account-role mutations must be tenant-authorized. Use `visibleFields()` for person-profile fields and `can()` for every profile tab. Example:

```ts
export function can(user: User, action: Action, resource: Resource, context?: Scope) {
  return user.roleIds.some((roleId) =>
    permissionGrants.some((grant) =>
      grant.roleId === roleId && grant.resource === resource &&
      grant.action === action && scopeAllows(grant.scope, user, context)
    )
  );
}
```

To add a capability, add the appropriate permission grant to the mock roles/permissions data and test the scope. Do not add `if (user.role === ...)` branches to UI code. Custom organization roles use the same permission-grant shape and may only grant capabilities allowed by the organization's policy.

## Mock service / future API boundary
Add a typed service function (for example `programs.list(query)`) that returns a structured result, applies tenant scope, waits through the shared latency/error simulator, and supports loading/error states. Components call that function through the shared data-fetching layer. Keep simulated latency and error injection centralized. Replacing the service implementation with HTTP calls must not require component changes.

## Design tokens
All color, spacing, radius, shadow, typography, and motion values must come from the design token module. No component may hardcode colors, spacing, shadows, or animation timing. Follow the orange/black/neutral WeGo.org palette and use shared interaction states.

## Shared sharing contract
Events and certificates use one shared `Share` component/utility contract: accept a canonical public URL, title, and optional description; expose copy-link and native/social share affordances; provide accessible copy/share confirmation feedback; do not construct URLs separately in feature components. Public verification remains read-only and reveals only the intended public fields.

## Pre-done checklist
- Does this reuse existing components rather than duplicate them?
- Does it use `can()` instead of role checks?
- Is tenant data scoped by `organizationId` (with explicit platform-admin exception)?
- Does it use design tokens for all visual values?
- Does it have loading, empty, and error states from the mock service layer?
- Are public share links canonical and handled by the shared Share contract?

## Person profiles, derived metrics, and sensitive data
- Keep one composed `User`/Person entity for all roles. Role-specific sections are optional fields on that same record; never introduce parallel facilitator/staff/participant person models.
- Use `visibleFields(viewer, targetPerson)` from the permission layer everywhere person fields are presented or exported. Sensitive field groups must not be gated with local role-name conditionals.
- Organization `demographicCollection.collect*` records are the source of truth for whether demographic fields are collected. Forms and services both enforce the settings.
- Compute training history, CPD totals, engagement, facilitator performance, and completeness from related mock records via `mock-data/person-profile.ts`; do not store cached/static derived metrics on User.
- Store privacy and photo/media consent separately. A public gallery must filter or reject photos without explicit consent for everyone pictured.
