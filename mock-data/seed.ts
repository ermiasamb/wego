import { faker } from '@faker-js/faker';
import { generatedNames } from './generated-name-data';
import type { Cohort, Expense, Organization, Participant, Program, User, Session, Certificate, CurriculumModule } from './types';

const demoHash = 'mock-sha256:wego-demo'; // Deliberately non-security mock value; never use in production.
export const organizations: Organization[] = [
  { id: 'org-bridge', name: 'BridgeWorks Ethiopia', slug: 'bridgeworks', type: 'ngo', description: 'Donor-funded skills and public-private partnership programs.', logoUrl: '', brand: { primaryColor: '#ef6a24', accentColor: '#171717' }, country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', currency: 'ETB', status: 'active', demographicCollection:{collectNationality:true,collectGender:true,collectDateOfBirth:true,collectDisabilityStatus:true,collectAccessibilityNeeds:true,collectEthnicityOrRegionGroup:false,collectHouseholdSize:true} },
  { id: 'org-cpd', name: 'National Institute for Public Service', slug: 'nips', type: 'government', description: 'Continuing professional development and regulatory training.', logoUrl: '', brand: { primaryColor: '#ef6a24', accentColor: '#171717' }, country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', currency: 'ETB', status: 'active', demographicCollection:{collectNationality:true,collectGender:true,collectDisabilityStatus:false,collectEthnicityOrRegionGroup:false,collectHouseholdSize:false} },
  { id: 'org-vertex', name: 'Vertex Learning & Advisory', slug: 'vertex-learning', type: 'private', description: 'Corporate learning provider and consulting firm.', logoUrl: '', brand: { primaryColor: '#ef6a24', accentColor: '#171717' }, country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', currency: 'ETB', status: 'active', demographicCollection:{collectNationality:true,collectGender:true,collectDateOfBirth:true,collectDisabilityStatus:true,collectAccessibilityNeeds:true,collectEthnicityOrRegionGroup:true,collectHouseholdSize:false} },
];

const roleAccounts: Array<[string,string,string,string|null,string]> = [
  ['u-super','Samrawit Bekele','superadmin@wego.demo',null,'platform-admin'],
  ['u-ngo-admin','Mekdes Tadesse','admin@bridgeworks.demo','org-bridge','org-admin'],
  ['u-ngo-pm','Dawit Alemu','manager@bridgeworks.demo','org-bridge','program-manager'],
  ['u-trainer','Hana Girma','trainer@bridgeworks.demo','org-bridge','facilitator'],
  ['u-trainee','Abel Tesfaye','learner@bridgeworks.demo','org-bridge','participant'],
  ['u-finance','Liya Kebede','finance@bridgeworks.demo','org-bridge','finance'],
  ['u-auditor','Bereket Wolde','audit@bridgeworks.demo','org-cpd','me-auditor'],
  ['u-partner','Ruth Mulu','partner@bridgeworks.demo','org-bridge','partner-viewer'],
  ['u-editor','Eden Worku','editor@vertex-learning.demo','org-vertex','content-editor'],
  ['u-cpd-admin','Yonas Hailu','admin@nips.demo','org-cpd','org-admin'],
  ['u-vertex-admin','Mimi Abate','admin@vertex-learning.demo','org-vertex','org-admin'],
];
export const users: User[] = roleAccounts.map(([id,name,email,organizationId,roleId]) => ({ id, name, email, passwordHash: demoHash, organizationId, roleIds: [roleId], avatarUrl: '', status: 'active' }));
for(let i=0;i<12;i++){const org=organizations[i%3];users.push({id:`u-facilitator-${i+1}`,name:generatedNames[i],email:`trainer${i+1}@${org.slug}.demo`,passwordHash:demoHash,organizationId:org.id,roleIds:['facilitator'],avatarUrl:'',status:'active'});}

const titles: Record<string,string[]> = {
  'org-bridge': ['Solar Technician Foundations','Women in Enterprise Accelerator','Youth Digital Skills','Agri-business Value Chains','Public-Private Partnership Essentials','Community Health Supply Chain'],
  'org-cpd': ['Public Procurement Compliance','Ethics in Public Service','Regulatory Inspection Practice','Records Management CPD','Leadership for Department Heads','Digital Government Essentials'],
  'org-vertex': ['Executive Leadership Lab','Data Literacy for Teams','Customer Experience Design','Project Delivery Professional','Finance for Non-Finance Managers','Cybersecurity Awareness'],
};
export const programs: Program[] = organizations.flatMap((org, oi) => titles[org.id].map((title, i) => ({
  id: `program-${oi+1}-${i+1}`, organizationId: org.id, title,
  description: `Practical ${org.type === 'ngo' ? 'workforce development' : org.type === 'government' ? 'continuing professional development' : 'corporate learning'} course designed for measurable outcomes.`,
  category: ['Professional skills','Leadership','Digital transformation'][i % 3], sectorTags: [org.type, ['skills','compliance','leadership'][i % 3]], cpdCredits: i % 3 === 0 ? 2 : 1,
  durationHours: 12 + (i % 4) * 6, deliveryMode: (['hybrid','in_person','online'] as const)[i % 3], status: (['active','completed','planning'] as const)[i % 3], public: true,
  budgetAmountMinor: (18000000 + i * 1250000), currency: org.currency, facilitatorIds: [oi===0&&i===0?'u-trainer':`u-facilitator-${oi*4+(i%4)+1}`], sponsorOrganizationIds:org.id==='org-bridge'&&i%2===0?['org-bridge']:[],
})));
export const cohorts: Cohort[] = programs.map((p, i) => {
  const phase=i%3;
  const start=phase===0?new Date(Date.UTC(2025, (i%8), 5)):phase===1?new Date(Date.UTC(2026,8,25+(Math.floor(i/3)%4))):new Date(Date.UTC(2026,9+Math.floor(i/9),5+(i%5)));
  const end=new Date(start.getTime()+7*86400000);
  const iso=(d:Date)=>d.toISOString().slice(0,10);
  return {id:`cohort-${i+1}`,organizationId:p.organizationId,programId:p.id,name:`${start.toLocaleString('en',{month:'long',timeZone:'UTC'})} ${start.getUTCFullYear()} Cohort`,startDate:iso(start),endDate:iso(end),capacity:25+(i%3)*10,status:(['completed','ongoing','upcoming'][phase] as Cohort['status']),venueId:`venue-${i%3+1}`};
});

const participantSeeds = Array.from({ length: 120 }, (_, i) => {
  const org = organizations[i % organizations.length];
  const name = i === 0 ? 'Abel Tesfaye' : generatedNames[i+12];
  return { id: i === 0 ? 'u-trainee' : `participant-${String(i+1).padStart(3,'0')}`, organizationId: org.id, name, email: i === 0 ? 'learner@bridgeworks.demo' : `learner${i+1}@${org.slug}.demo`, learningStatus: i % 4 === 0 ? 'completed' as const : 'active' as const };
});

// One person/account record powers the Users directory and participant references alike.
export const participants:User[]=[];
for(const seed of participantSeeds){const account:User=users.find(u=>u.id===seed.id)||{id:seed.id,name:seed.name,email:seed.email,passwordHash:demoHash,organizationId:seed.organizationId,roleIds:['participant'],avatarUrl:'',status:'active',learningStatus:seed.learningStatus};account.learningStatus=seed.learningStatus;if(!users.some(u=>u.id===account.id))users.push(account);participants.push(account);}
// One composed user/person profile for all account roles. Generator intentionally varies completion.
const regions=['Addis Ababa','Oromia','Amhara','Sidama','Tigray','Somali'];
for(const [i,u] of users.entries()){
 const [firstName='',...rest]=u.name.split(' '), lastName=rest.pop()||'', middleName=rest.join(' '), org=organizations.find(o=>o.id===u.organizationId), settings=org?.demographicCollection||{};
 const complete=i%4!==0; const facilitator=u.roleIds.includes('facilitator'),staff=u.roleIds.some(r=>['org-admin','program-manager','finance','me-auditor','platform-admin'].includes(r));
 Object.assign(u,{firstName,middleName,lastName,preferredName:i%7===0?firstName:undefined,dateOfBirth:settings.collectDateOfBirth&&complete?faker.date.birthdate({min:20,max:58,mode:'age'}).toISOString().slice(0,10):undefined,gender:settings.collectGender?(i%2?'Female':'Male'):undefined,nationalId:complete?`ET-${String(1980+i%30).padStart(4,'0')}-${String(i+1).padStart(6,'0')}`:undefined,passportNumber:staff&&i%3===0?`EP${String(700000+i).slice(-6)}`:undefined,primaryEmail:u.email,secondaryEmail:complete?faker.internet.email({firstName,lastName}):undefined,primaryPhone:complete?`+251 9${faker.string.numeric(8)}`:undefined,secondaryPhone:i%5===0?`+251 9${faker.string.numeric(8)}`:undefined,whatsappEnabled:i%3!==0,photoUrl:u.avatarUrl||undefined,address:complete?{region:regions[i%regions.length],zoneOrCity:'Addis Ababa',woredaOrSubcity:`Subcity ${i%10+1}`,street:faker.location.streetAddress(),postalCode:undefined}:undefined,emergencyContact:complete?{name:faker.person.fullName(),relationship:i%2?'Sibling':'Spouse',phone:`+251 9${faker.string.numeric(8)}`}:undefined,employerName:staff||facilitator?org?.name:complete?faker.company.name():undefined,jobTitle:complete?faker.person.jobTitle():undefined,sector:complete?['Education','Agriculture','Technology','Public service','Health'][i%5]:undefined,department:staff?['Programs','Finance','Operations','Learning'][i%4]:undefined,yearsOfExperience:complete?i%19:undefined,employmentStatus:complete?['employed','self_employed','seeking_work'][i%3]:undefined,supervisorName:staff?faker.person.fullName():undefined,supervisorContact:staff?`+251 9${faker.string.numeric(8)}`:undefined,highestEducationLevel:complete?['Secondary','TVET','Bachelor','Master','Doctorate'][i%5]:undefined,fieldOfStudy:complete?['Education','Business','Engineering','Public administration'][i%4]:undefined,institutionAttended:complete?['Addis Ababa University','Hawassa University','Bahir Dar University'][i%3]:undefined,priorCertifications:complete?['Adult learning essentials']:[],languagesSpoken:complete?[{language:'Amharic',proficiency:'native'},{language:i%2?'English':'Oromo',proficiency:'professional'}]:[],nationality:settings.collectNationality?'Ethiopian':undefined,ethnicityOrRegionGroup:settings.collectEthnicityOrRegionGroup?regions[i%regions.length]:undefined,disabilityStatus:settings.collectDisabilityStatus?(i%8===0?'disability disclosed':'none disclosed'):undefined,accessibilityNeeds:settings.collectAccessibilityNeeds&&i%8===0?'Step-free access':undefined,maritalStatus:settings.collectMaritalStatus?['single','married'][i%2]:undefined,householdSize:settings.collectHouseholdSize?i%6+1:undefined,interestTags:complete?['leadership','digital skills']:[],skillSelfAssessments:complete?[{topic:'Communication',level:['Developing','Proficient','Advanced'][i%3]}]:[],preferredDeliveryMode:(['in_person','online','hybrid'] as const)[i%3],dietaryRestrictions:i%11===0?'Vegetarian':undefined,accommodationNeeds:i%13===0?'Accessible room':undefined,bankAccountOrMobileMoney:complete?`091${faker.string.numeric(7)}`:undefined,tin:staff&&i%2===0?faker.string.numeric(10):undefined,paymentPreference:i%2?'mobile_money':'bank_transfer',perDiemEligible:u.roleIds.includes('participant'),expertiseAreas:facilitator?['Facilitation',['Leadership','Digital skills','Compliance'][i%3]]:undefined,trainTheTrainerCertifications:facilitator?['Training of Trainers']:undefined,facilitationYearsExperience:facilitator?3+i%14:undefined,facilitationRate:facilitator?1500+i%5*250:undefined,availabilityCalendarRef:facilitator?`availability-${u.id}`:undefined,bio:facilitator?'Experienced practitioner committed to practical, inclusive learning.':undefined,roleWithinOrganization:staff?u.roleIds[0].replaceAll('-',' '):undefined,accessLevelRequested:staff?'organization':undefined,accessLevelApproved:staff?'organization':undefined,dateJoinedPlatform:'2025-01-15',departmentsManaged:staff?['Programs']:undefined,dataPrivacyConsent:{agreed:true,version:'2026-1',timestamp:'2026-01-15T09:00:00Z'},photoMediaConsent:{agreed:i%3!==0,timestamp:'2026-01-15T09:00:00Z'},marketingOptIn:i%4===0,accountCreatedAt:'2025-01-15T09:00:00Z',lastLoginAt:i%3?`2026-09-${String(i%28+1).padStart(2,'0')}T09:00:00Z`:undefined,referralSource:['partner','event','website'][i%3]});
}


const categories: Expense['category'][] = ['per_diem','trainer_fee','venue','logistics','catering','stationery_equipment'];
const descriptions: Record<Expense['category'], string> = { per_diem: 'Participant daily allowance', trainer_fee: 'Facilitator delivery fee', venue: 'Training venue rental', logistics: 'Local transport and accommodation', catering: 'Session meals and refreshments', stationery_equipment: 'Learning materials and equipment' };
export const expenses: Expense[] = programs.flatMap((p, pi) => categories.map((category, ci) => ({
  id: `expense-${pi+1}-${ci+1}`, organizationId: p.organizationId, programId: p.id, cohortId: cohorts[pi].id,
  participantId: category === 'per_diem' ? participants.find((x) => x.organizationId === p.organizationId)!.id : undefined,
  facilitatorId: category === 'trainer_fee' ? 'u-trainer' : undefined, venueId: category === 'venue' ? `venue-${pi%3+1}` : undefined,
  category, description: descriptions[category], amountMinor: [125000,450000,750000,260000,190000,85000][ci] + ((pi % 4) * 15000), currency: p.currency,
  status: (['paid','approved','planned'][((pi + ci) % 3)] as Expense['status']), incurredAt: `2026-0${pi%8+1}-15`, quantity: category === 'per_diem' ? 5 : undefined, unitRateMinor: category === 'per_diem' ? 25000 : undefined, daysAttended: category === 'per_diem' ? 5 : undefined,
})));

export const sessions:Session[] = cohorts.flatMap((cohort) => Array.from({length: 3}, (_, i) => ({ id: `${cohort.id}-session-${i+1}`, organizationId: cohort.organizationId, cohortId: cohort.id, title: ['Foundations','Applied practice','Action planning'][i], startsAt: `${cohort.startDate}T${String(9+i*2).padStart(2,'0')}:00:00+03:00`, endsAt: `${cohort.startDate}T${String(11+i*2).padStart(2,'0')}:00:00+03:00`, venueId:cohort.venueId, facilitatorIds: programs.find(p=>p.id===cohort.programId)?.facilitatorIds||[] })));
export const attendance = sessions.flatMap((session, si) => participants.filter((p) => p.organizationId === session.organizationId).slice(0, 12).map((p, pi) => ({ id: `att-${si}-${pi}`, organizationId: session.organizationId, sessionId: session.id, participantId: p.id, state: (['present','present','late','absent'][((pi+si)%4)] as 'present'|'late'|'absent'|'excused') })));
export const certificates:Certificate[] = participants.filter((_, i) => i % 3 === 0).map((p, i) => { const program = programs.find((x) => x.organizationId === p.organizationId)!; return { id: `cert-${i+1}`, organizationId: p.organizationId!, programId: program.id, participantId: p.id, issuedAt: '2026-02-10', verificationCode: `WG-${String(2026+i).slice(-2)}-${String(i+1).padStart(5,'0')}`, publicSlug: `verify-${i+1}`, status: 'valid' as const }; });
export const curriculumModules:CurriculumModule[]=programs.flatMap(p=>Array.from({length:3},(_,i)=>({id:`module-${p.id}-${i+1}`,organizationId:p.organizationId,programId:p.id,title:['Foundations and context','Applied practice','Action planning'][i],description:`Core learning module ${i+1} for ${p.title}.`,sequence:i+1,objectives:[`Understand key concepts for ${p.category.toLowerCase()}`,`Apply learning in a practical context`],materials:['Facilitator guide.pdf','Participant workbook.pdf']})));
