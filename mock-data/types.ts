export type OrgType = 'ngo' | 'government' | 'private';
export type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'publish' | 'manage';
export type Resource = 'organizations' | 'users' | 'roles' | 'facilitators' | 'programs' | 'cohorts' | 'participants' | 'attendance' | 'expenses' | 'reports' | 'blog' | 'events' | 'certificates' | 'notifications' | 'person_financial' | 'person_identity' | 'person_demographics' | 'person_emergency' | 'assessments' | 'evaluations' | 'venues' | 'curriculum';
export type Scope = 'platform' | 'organization' | 'assigned' | 'self' | 'co-funded' | 'public';
export interface DemographicCollectionSettings { collectNationality?:boolean; collectEthnicityOrRegionGroup?:boolean; collectDisabilityStatus?:boolean; collectAccessibilityNeeds?:boolean; collectMaritalStatus?:boolean; collectHouseholdSize?:boolean; collectGender?:boolean; collectDateOfBirth?:boolean; }
export interface Organization { id: string; name: string; slug: string; type: OrgType; description: string; logoUrl: string; brand: { primaryColor: string; accentColor: string }; country: string; timezone: string; currency: string; status: 'active' | 'onboarding'; demographicCollection?:DemographicCollectionSettings; }
export type Proficiency = 'basic'|'conversational'|'professional'|'native';
export interface User {
 id:string; name:string; email:string; passwordHash:string; organizationId:string|null; roleIds:string[]; avatarUrl:string; status:'active'|'invited'|'suspended'|'deactivated'; learningStatus?:'active'|'completed'; workspaceAccess?:boolean;
 firstName?:string; middleName?:string; lastName?:string; preferredName?:string; dateOfBirth?:string; gender?:string; nationalId?:string; passportNumber?:string; photoUrl?:string; primaryEmail?:string; secondaryEmail?:string; primaryPhone?:string; secondaryPhone?:string; whatsappEnabled?:boolean;
 address?:{country?:string;region?:string;zoneOrCity?:string;woredaOrSubcity?:string;street?:string;postalCode?:string}; emergencyContact?:{name?:string;relationship?:string;phone?:string};
 employerName?:string; jobTitle?:string; sector?:string; department?:string; yearsOfExperience?:number; employmentStatus?:string; supervisorName?:string; supervisorContact?:string; linkedInUrl?:string;
 highestEducationLevel?:string; fieldOfStudy?:string; institutionAttended?:string; priorCertifications?:string[]; languagesSpoken?:Array<{language:string;proficiency:Proficiency}>;
 nationality?:string; ethnicityOrRegionGroup?:string; disabilityStatus?:string; accessibilityNeeds?:string; maritalStatus?:string; householdSize?:number;
 interestTags?:string[]; skillSelfAssessments?:Array<{topic:string;level:string}>; preferredDeliveryMode?:'in_person'|'online'|'hybrid'; dietaryRestrictions?:string; accommodationNeeds?:string;
 bankAccountOrMobileMoney?:string; tin?:string; paymentPreference?:string; perDiemEligible?:boolean;
 expertiseAreas?:string[]; trainTheTrainerCertifications?:string[]; facilitationYearsExperience?:number; facilitationRate?:number; availabilityCalendarRef?:string; bio?:string;
 roleWithinOrganization?:string; accessLevelRequested?:string; accessLevelApproved?:string; dateJoinedPlatform?:string; departmentsManaged?:string[];
 dataPrivacyConsent?:{agreed:boolean;version:string;timestamp?:string}; photoMediaConsent?:{agreed:boolean;timestamp?:string}; marketingOptIn?:boolean; dataDeletionRequested?:boolean;
 accountCreatedAt?:string; lastLoginAt?:string; referralSource?:string;
}
export interface Role { id: string; name: string; description: string; scope: Scope; organizationId: string | null; builtIn: boolean; }
export interface PermissionGrant { roleId: string; resource: Resource; action: Action; scope: Scope; }
export interface Program { id: string; organizationId: string; title: string; description: string; category: string; sectorTags: string[]; cpdCredits: number; durationHours: number; deliveryMode: 'in_person' | 'online' | 'hybrid'; status: 'planning' | 'active' | 'completed'; public: boolean; budgetAmountMinor: number; currency: string; facilitatorIds: string[]; sponsorOrganizationIds?:string[]; }
export interface Cohort { id: string; organizationId: string; programId: string; name: string; startDate: string; endDate: string; capacity: number; status: 'upcoming' | 'ongoing' | 'completed'; venueId?: string; }
export type Participant = User;
export interface Expense { id: string; organizationId: string; programId: string; cohortId?: string; sessionId?: string; participantId?: string; facilitatorId?: string; venueId?: string; category: 'per_diem' | 'trainer_fee' | 'venue' | 'logistics' | 'catering' | 'stationery_equipment'; description: string; amountMinor: number; currency: string; status: 'planned' | 'approved' | 'paid'; incurredAt?: string; dueAt?: string; paymentMethod?: string; quantity?: number; unitRateMinor?: number; daysAttended?: number; createdBy?:string; approvedBy?:string; paidBy?:string; }
export interface Session { id: string; organizationId: string; cohortId: string; title: string; startsAt: string; endsAt: string; facilitatorIds: string[]; venueId?:string; objectives?:string[]; materials?:string[]; }
export interface Attendance { id: string; organizationId: string; sessionId: string; participantId: string; state: 'present' | 'late' | 'absent' | 'excused'; }
export interface Certificate { id: string; organizationId: string; programId: string; participantId: string; issuedAt: string; verificationCode: string; publicSlug: string; status: 'valid' | 'revoked'; }
export interface CurriculumAttachment { id:string; name:string; type:string; size:number; dataUrl:string; }
export interface CurriculumModule { id:string; organizationId:string; programId:string; title:string; description:string; sequence:number; objectives:string[]; materials:string[]; attachments?:CurriculumAttachment[]; durationMinutes?:number; deliveryMode?:'self_paced'|'facilitated'|'live'; tags?:string[]; resourceUrl?:string; }
export interface Assessment { id:string; organizationId:string; programId:string; cohortId:string; participantId:string; title:string; score:number; maxScore:number; passed:boolean; assessedAt:string; }
export interface EvaluationResponse { id:string; organizationId:string; programId:string; cohortId:string; participantId:string; rating:number; responses:Record<string,string>; submittedAt:string; }
export interface AppNotification { id:string; organizationId:string; userId:string; type:string; title:string; body:string; createdAt:string; readAt?:string; relatedEntityType?:string; relatedEntityId?:string; }
export interface AccountActivity { id:string; userId:string; actorId:string; event:'login'|'role_changed'|'status_changed'|'password_changed'|'password_reset'|'profile_updated'|'account_deleted'; details:string; createdAt:string; }
