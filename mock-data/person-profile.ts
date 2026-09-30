import {attendance,organizations,programs,sessions,users} from './seed';
import {enrollments,evaluations} from './content';
import type {User} from './types';

export interface DerivedPersonMetrics {trainingHistory:Array<{programId:string;programTitle:string;status:string;enrolledAt:string}>;cpdCreditsTotal:number;engagementScore:number;performanceRatingAvg?:number;profileCompletenessPct:number;}
const profileFields: Array<keyof User> = ['dateOfBirth','gender','primaryPhone','address','emergencyContact','sector','employmentStatus','highestEducationLevel','fieldOfStudy','languagesSpoken','interestTags','preferredDeliveryMode','dataPrivacyConsent'];
export function derivedPersonMetrics(person:User):DerivedPersonMetrics {
 const history=enrollments.filter(e=>e.participantId===person.id).map(e=>({programId:e.programId,programTitle:programs.find(p=>p.id===e.programId)?.title||'Training program',status:e.status,enrolledAt:e.enrolledAt}));
 const cpd=enrollments.filter(e=>e.participantId===person.id&&e.status==='completed').reduce((sum,e)=>sum+(programs.find(p=>p.id===e.programId)?.cpdCredits||0),0);
 const relevantSessions=sessions.filter(s=>s.organizationId===person.organizationId&&(s.facilitatorIds.includes(person.id)||attendance.some(a=>a.participantId===person.id&&a.sessionId===s.id)));
 const attendCount=attendance.filter(a=>a.participantId===person.id).length, present=attendance.filter(a=>a.participantId===person.id&&(a.state==='present'||a.state==='late')).length;
 const engagementScore=Math.min(100,Math.round((history.length?Math.min(history.length*12,36):0)+(relevantSessions.length?present/Math.max(attendCount,1)*35:0)+(evaluations.some(e=>e.participantId===person.id)?14:0)+(person.lastLoginAt?15:0)));
 const facilPrograms=programs.filter(p=>p.facilitatorIds.includes(person.id));const ratings=evaluations.filter(e=>facilPrograms.some(p=>p.id===e.programId)).map(e=>e.rating);const performanceRatingAvg=ratings.length?Math.round(ratings.reduce((a,b)=>a+b,0)/ratings.length*10)/10:undefined;
 const collection=organizations.find(o=>o.id===person.organizationId)?.demographicCollection||{};const enabledFields=profileFields.filter(f=>{if(f==='gender')return collection.collectGender;if(f==='dateOfBirth')return collection.collectDateOfBirth;if(f==='nationality')return collection.collectNationality;if(f==='ethnicityOrRegionGroup')return collection.collectEthnicityOrRegionGroup;if(f==='disabilityStatus'||f==='accessibilityNeeds')return collection.collectDisabilityStatus||collection.collectAccessibilityNeeds;if(f==='maritalStatus')return collection.collectMaritalStatus;if(f==='householdSize')return collection.collectHouseholdSize;return true;});const profileCompletenessPct=enabledFields.length?Math.round(enabledFields.filter(f=>{const v=person[f];return Array.isArray(v)?v.length>0:typeof v==='object'?!!v:v!==undefined&&v!=='';}).length/enabledFields.length*100):100;
 return {trainingHistory:history,cpdCreditsTotal:cpd,engagementScore,performanceRatingAvg,profileCompletenessPct};
}
export function personPhotoAllowed(person:User){return person.photoMediaConsent?.agreed===true;}
export function personDemographicSettings(organizationId:string|null){return organizations.find(o=>o.id===organizationId)?.demographicCollection||{};}
