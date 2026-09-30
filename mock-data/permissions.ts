import type { Action, PermissionGrant, Resource, Scope, User } from './types';

const grants: PermissionGrant[] = [];
const add = (roleId: string, resources: Resource[], actions: Action[], scope: Scope) => {
  resources.forEach((resource) => actions.forEach((action) => grants.push({ roleId, resource, action, scope })));
};
const read = ['view'] as Action[];
const full: Action[] = ['view', 'create', 'edit', 'delete', 'manage'];
const manager: Action[] = ['view', 'create', 'edit', 'delete'];
const readExport: Action[] = ['view', 'export'];

add('platform-admin', ['person_financial','person_identity','person_demographics','person_emergency','organizations','users','roles','facilitators','programs','cohorts','participants','attendance','expenses','reports','blog','events','certificates','notifications','assessments','evaluations','venues','curriculum'], ['view','create','edit','delete','approve','export','publish','manage'], 'platform');
add('org-admin', ['organizations'], ['view','edit','manage'], 'organization');
add('org-admin', ['users','programs','cohorts','participants','attendance','expenses','certificates','blog','events','notifications','assessments','evaluations','venues','curriculum'], full, 'organization');
add('org-admin', ['reports'], ['view','export'], 'organization');
add('org-admin', ['roles'], ['view','create','edit','delete','manage'], 'organization');
add('program-manager', ['programs','cohorts','participants','attendance','certificates','assessments','evaluations','curriculum','venues'], manager, 'organization');
add('program-manager', ['expenses'], ['view','create','edit'], 'organization');
add('program-manager', ['reports'], readExport, 'organization');
add('program-manager', ['facilitators'], ['view'], 'organization');
add('org-admin', ['facilitators'], full, 'organization');
add('program-manager', ['blog','events'], ['view','create','edit'], 'organization');
add('facilitator', ['programs','cohorts','reports'], read, 'assigned');
add('facilitator', ['cohorts'], ['edit'], 'assigned');
add('facilitator', ['attendance','assessments','evaluations'], ['view','create','edit'], 'assigned');
add('facilitator', ['curriculum','venues'], ['view'], 'assigned');
add('facilitator', ['participants'], read, 'assigned');
add('facilitator', ['certificates'], read, 'assigned');
add('facilitator', ['blog'], ['view','create'], 'assigned');
add('participant', ['programs','cohorts','certificates'], read, 'self');
add('participant', ['participants'], ['view','edit'], 'self');
add('participant', ['expenses'], read, 'self');
add('participant', ['attendance','reports'], read, 'self');
add('participant', ['attendance'], ['create'], 'self');
add('participant', ['assessments','evaluations','curriculum'], ['view'], 'self');
add('participant', ['assessments','evaluations'], ['create'], 'self');
add('participant', ['events'], ['view','create'], 'public');
add('participant', ['blog'], read, 'public');
add('participant', ['notifications'], ['view','edit'], 'self');
add('finance', ['expenses'], ['view','create','edit','approve','export'], 'organization');
add('finance', ['programs','cohorts','participants','reports'], ['view','export'], 'organization');
add('me-auditor', ['programs','cohorts','participants','attendance','expenses','reports','blog','certificates','assessments','evaluations'], readExport, 'organization');
add('partner-viewer', ['programs','cohorts','participants','expenses','reports','blog','events','certificates','assessments','evaluations'], ['view','export'], 'co-funded');
add('content-editor', ['blog','events'], ['view','create','edit','delete','publish'], 'organization');
add('content-editor', ['programs','cohorts'], read, 'public');
add('content-editor', ['notifications'], read, 'self');
// Field-level person data grants; visibleFields() is the sole policy evaluator.
add('org-admin', ['person_identity','person_demographics','person_emergency'], read, 'organization');
add('finance', ['person_identity','person_financial'], read, 'organization');
add('me-auditor', ['person_demographics'], read, 'organization');
add('program-manager', ['person_emergency'], read, 'organization');
add('participant', ['person_identity','person_financial','person_demographics'], read, 'self');
add('facilitator', ['person_demographics'], read, 'assigned');

export const permissionGrants = grants;
export interface PermissionContext { organizationId?: string; resourceOrganizationId?: string; assigned?: boolean; self?: boolean; coFunded?: boolean; }

/** Permission decisions are data-driven. Scope context is supplied by the service/caller. */
export function can(user: Pick<User, 'roleIds' | 'status' | 'organizationId'> & Partial<Pick<User,'workspaceAccess'>> | null | undefined, action: Action, resource: Resource, context: PermissionContext = {}): boolean {
  if (!user || user.status !== 'active') return false;
  const activeOrg = context.organizationId ?? user.organizationId ?? undefined;
  return user.roleIds.some((roleId) => permissionGrants.some((grant) => {
    if (grant.roleId !== roleId || grant.action !== action || grant.resource !== resource) return false;
    switch (grant.scope) {
      case 'platform': return user.organizationId === null || ('workspaceAccess' in user && user.workspaceAccess === true);
      case 'organization': return !!activeOrg && activeOrg === user.organizationId && (!context.resourceOrganizationId || context.resourceOrganizationId === activeOrg);
      case 'assigned': return !!context.assigned && (!context.resourceOrganizationId || context.resourceOrganizationId === user.organizationId);
      case 'self': return !!context.self;
      case 'co-funded': return !!context.coFunded && (!context.resourceOrganizationId || context.resourceOrganizationId === user.organizationId);
      case 'public': return true;
      default: return false;
    }
  }));
}

/** Central field-level policy for person records. Public profile fields stay available; sensitive groups require explicit grants. */
export function visibleFields(viewer:Pick<User,'roleIds'|'status'|'organizationId'>|null|undefined,target:Pick<User,'id'|'organizationId'|'roleIds'>):string[]{
 const self=!!viewer&&'id' in viewer&&viewer.id===target.id;
 const ctx={organizationId:viewer?.organizationId||undefined,resourceOrganizationId:target.organizationId||undefined,self};
 const fields=['name','photoUrl','organization','roles','trainingHistory'];
 if(self||can(viewer,'view','users',ctx)){fields.push('email','phone','professional','education','training','consent','engagement','organization','roles','status');}
 if(self||can(viewer,'view','person_identity',ctx))fields.push('nationalId','passportNumber');
 if(self||can(viewer,'view','person_demographics',ctx))fields.push('demographics');
 if(self||can(viewer,'view','person_financial',ctx))fields.push('financial');
 if(can(viewer,'view','person_emergency',ctx))fields.push('emergencyContact');
 if(target.roleIds.includes('facilitator')&&can(viewer,'view','facilitators',ctx))fields.push('facilitatorExtension');
 if(target.roleIds.some(r=>['org-admin','program-manager','finance','me-auditor'].includes(r))&&can(viewer,'view','users',ctx))fields.push('staffExtension');
 return [...new Set(fields)];
}
