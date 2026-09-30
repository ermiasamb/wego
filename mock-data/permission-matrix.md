# Permission matrix proposal — checkpoint 1

Actions: V=view, C=create, E=edit, D=delete, A=approve, X=export, P=publish, M=manage. A dash means no grant. Scope is part of each grant: platform, organization, assigned programs/sessions, self, or co-funded programs. These are data grants consumed by `can(user, action, resource, context)`; UI and routes do not inspect role names.

| Resource/module | Platform Super Admin | Organization Admin | Program Manager | Facilitator | Participant | Finance | M&E/Auditor | Partner/Sponsor | Content Editor |
|---|---|---|---|---|---|---|---|---|---|
| organizations / tenant settings | V C E D M (platform) | V E M (own org) | — | — | — | — | V (own org) | V (co-funded) | — |
| users / custom roles | V C E D M (platform) | V C E D M (own org) | V (program) | V (assigned) | V E (self profile) | V (own org) | V (own org) | V (co-funded) | — |
| programs / curriculum | V C E D M (platform) | V C E D M (own org) | V C E (own org) | V (assigned) | V (enrolled/public) | V (own org) | V (own org) X | V (co-funded) | V (public) |
| cohorts / sessions / calendar | V C E D M (platform) | V C E D M (own org) | V C E D (own org) | V E (assigned sessions) | V (enrolled) | V (own org) | V (own org) X | V (co-funded) | V (public events) |
| participants / enrollment | V C E D M (platform) | V C E D M (own org) | V C E D (own org) | V E (assigned cohorts) | V C E (self enrollment/profile) | V (own org, payment fields) | V X (own org) | V (co-funded aggregates) | — |
| attendance / assessments | V C E D M (platform) | V C E D M (own org) | V C E D (own org) | V C E (assigned sessions) | V (self) | V (own org) | V X (own org) | V (co-funded aggregate) | — |
| expenses / budgets / payments | V C E D A X M (platform) | V C E A X M (own org) | V C E (own programs) | — | V (own per diem) | V C E A X (own org) | V X (own org) | V X (co-funded) | — |
| reports / analytics | V X (platform) | V X (own org) | V X (own org) | V (assigned) | V (self progress) | V X (own org) | V X (own org) | V X (co-funded) | — |
| blog / outcomes | V C E D P (platform) | V C E D P (own org) | V C E (own programs) | V C (assigned) | V (public) | V (public) | V (own org) | V (public/co-funded) | V C E D P (own org) |
| events / public listing | V C E D P (platform) | V C E D P (own org) | V C E (own org) | V (assigned) | V C (register) | V (public) | V (own org) | V (public/co-funded) | V C E D P (own org) |
| certificates / verification | V C E D M (platform) | V C E D M (own org) | V C E (own programs) | V (assigned) | V (self) | — | V X (own org) | V (co-funded aggregate) | — |
| notifications | V M (platform) | V M (own org) | V (own org) | V (self) | V E (self read state) | V (self) | V (self) | V (self) | V (self) |

## Scope/guard notes
- All organization-scoped grants are constrained to the active user's tenant; records from another tenant are not returned by services.
- Platform Super Admin grants are platform-scoped and may span tenants. A global view does not imply cross-tenant mutation unless explicitly granted.
- `assigned` requires a matching facilitator assignment; `self` requires matching user/participant ID; `co-funded` requires the program's sponsor relationship.
- Role labels above are descriptive seed roles, not authorization logic. Custom roles are stored as grant data and pass through the same scope checks.
- User-facing self-service edits are limited to safe profile fields; credentials, role assignments, organization, and status are not self-editable.
