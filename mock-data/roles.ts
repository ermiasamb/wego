import type { Role } from './types';

// Role definitions are records: adding a role never requires a role-specific UI branch.
export const roles: Role[] = [
  { id: 'platform-admin', name: 'Platform Super Admin', description: 'Cross-tenant platform operations', scope: 'platform', organizationId: null, builtIn: true },
  { id: 'org-admin', name: 'Organization Admin', description: 'Full administration within one organization', scope: 'organization', organizationId: null, builtIn: true },
  { id: 'program-manager', name: 'Program / Training Manager', description: 'Program delivery and operational management', scope: 'organization', organizationId: null, builtIn: true },
  { id: 'facilitator', name: 'Facilitator / Trainer', description: 'Assigned learning delivery', scope: 'assigned', organizationId: null, builtIn: true },
  { id: 'participant', name: 'Participant / Trainee', description: 'Personal learning and certificate access', scope: 'self', organizationId: null, builtIn: true },
  { id: 'finance', name: 'Finance / Accountant', description: 'Expense and budget operations', scope: 'organization', organizationId: null, builtIn: true },
  { id: 'me-auditor', name: 'M&E / Auditor', description: 'Read-only monitoring and compliance', scope: 'organization', organizationId: null, builtIn: true },
  { id: 'partner-viewer', name: 'Partner / Sponsor Viewer', description: 'Read-only co-funded program oversight', scope: 'co-funded', organizationId: null, builtIn: true },
  { id: 'content-editor', name: 'Content Editor', description: 'Public content and event publishing', scope: 'organization', organizationId: null, builtIn: true },
];
