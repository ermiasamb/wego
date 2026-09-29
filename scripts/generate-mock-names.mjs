import { faker } from '@faker-js/faker/locale/en';
import { writeFileSync } from 'node:fs';
faker.seed(20260929);
const names = Array.from({ length: 132 }, () => faker.person.fullName());
writeFileSync(new URL('../mock-data/generated-name-data.ts', import.meta.url), `// Deterministic demo names generated with @faker-js/faker.\nexport const generatedNames = ${JSON.stringify(names, null, 2)} as const;\n`);
