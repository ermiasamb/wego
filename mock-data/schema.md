# Mock data schema proposal — checkpoint 1

All IDs are stable strings. Dates are ISO-8601. Money is stored as integer minor units plus ISO currency code (never floating-point). Every tenant-owned entity includes `organizationId`; cross-entity references are IDs. Services enforce tenant scoping.

## Identity, access, tenancy
- **Organization**: `id, name, slug, type (ngo|government|private), description, logoUrl, brand (primaryColor, accentColor), country, timezone, currency, status, createdAt`.
- **User**: `id, name, email, passwordHash (demo-only), organizationId|null, roleIds[], avatarUrl, status (active|invited|suspended), lastLoginAt?`. Null organization is reserved for platform-level accounts.
- **Role**: `id, name, description, scope (platform|organization|program|self), organizationId|null, builtIn, permissions[]`.
- **Permission grant**: `roleId, resource, action (view|create|edit|delete|approve|export|publish|manage), scope (own|organization|assigned|co-funded|platform)`.
- **Session**: `token, userId, issuedAt, expiresAt`; local persistence only, never a real credential.

## Learning & delivery
- **Program/Course**: `id, organizationId, title, description, category, sectorTags[], cpdCredits, durationHours, deliveryMode, status, public, budgetAmount, currency, facilitatorIds[], createdAt`.
- **Curriculum module**: `id, organizationId, programId, title, description, sequence, objectives[], materials[]`.
- **Cohort**: `id, organizationId, programId, name, startDate, endDate, capacity, venueId?, virtualUrl?, status`.
- **Session**: `id, organizationId, cohortId, title, startsAt, endsAt, facilitatorIds[], venueId?, objectives[], materials[]`.
- **Venue**: `id, organizationId, name, address, capacity, virtual, notes`.
- **Participant/enrollment**: participant is a User record; `Enrollment: id, organizationId, programId, cohortId, participantId, status (enrolled|waitlisted|completed|withdrawn), enrolledAt`.
- **Facilitator profile**: `id, organizationId, userId, bio, expertiseTags[], qualifications[], availability`.
- **Attendance**: `id, organizationId, sessionId, participantId, state (present|late|absent|excused), recordedAt, recordedBy`.
- **Assessment**: `id, organizationId, programId, cohortId, participantId, title, score, maxScore, passed, assessedAt`.
- **Evaluation response**: `id, organizationId, programId, cohortId, participantId, rating, responses, submittedAt`.
- **Certificate**: `id, organizationId, programId, cohortId, participantId, issuedAt, verificationCode, publicSlug, status (valid|revoked), assetUrl?`.

## Finance
- **Expense** (shared shape for all categories): `id, organizationId, programId, cohortId?, sessionId?, participantId?, facilitatorId?, venueId?, category (per_diem|trainer_fee|venue|logistics|catering|stationery_equipment), description, amountMinor, currency, status (planned|approved|paid), incurredAt?, dueAt?, paymentMethod?, quantity?, unitRateMinor?, daysAttended?, createdBy`.
- Per diem records are participant/session-day based; trainer fees link facilitator and program/session; venue costs link venue/cohort/session; logistics and catering retain itemization in description/quantity/unit rate; stationery/equipment records retain item-level descriptions. Program budgets are on Program and actuals aggregate paid/approved expenses.

## Public content & engagement
- **Blog post/outcome**: `id, organizationId, programId?, cohortId?, title, body, coverImageUrl?, galleryUrls[], authorId, status (draft|published), publishedAt?, tags[], publicSlug`.
- **Event**: `id, organizationId, programId?, cohortId?, title, description, imageUrl?, startsAt, endsAt, venueId?, registrationUrl?, capacity?, status, public, publicSlug`.
- **Notification**: `id, organizationId, userId, type, title, body, createdAt, readAt?, relatedEntityType?, relatedEntityId?`.
- **Activity/audit record**: `id, organizationId, actorId, action, entityType, entityId, occurredAt, metadata`.

## Relationships and integrity
Program owns cohorts/modules; cohort owns sessions and enrollments; attendance and assessment reference session/cohort and participant; certificates reference participant + program (+ cohort); all finance records link to a program and optionally finer-grained delivery records. Public slugs are globally unique. Public endpoints return an explicit safe projection, never internal user, finance, or permission fields.

## Seed profile planned
Three tenants: NGO running a donor/PPP skills program, government CPD institute, private corporate training provider. Seed 15–20 programs, multiple past/current/future cohorts and sessions, 100+ participants, 10–15 facilitators, attendance/assessment/evaluation, all six expense categories, published/draft outcome posts, public events, and verifiable certificates. Seed accounts cover Platform Super Admin, Organization Admin, Program Manager, Facilitator, Participant, Finance, M&E, Partner/Sponsor Viewer, and Content Editor.
