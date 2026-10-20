import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
const source=fs.readFileSync(path.join(process.cwd(),'app/tprs/lib/eplc-operations.ts'),'utf8');
describe('real E-PLC operational read model',()=>{
 it('is server only and excludes synthetic learners',()=>{expect(source).toContain("import 'server-only'");expect(source).toContain('l.synthetic = false');expect(source).toContain('e.synthetic = false');});
 it('uses internal learner references',()=>{expect(source).toContain('learner_reference');expect(source).not.toContain('national_id');expect(source).not.toContain('phone');});
 it('locks the four stage and 24 hour invariants',()=>{expect(source).toContain("'3,5,5,11'");expect(source).toContain('!== 24');});
 it('locks three independent PLC cycles',()=>{expect(source).toContain("'1,2,3'");});
});
