import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'app/tprs/lib/staff-workspace.ts'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/tprs/staff/page.tsx'), 'utf8');

describe('protected staff workspace contract', () => {
  it('is server-only and assignment scoped', () => {
    expect(source).toMatch(/import 'server-only'/);
    expect(source).toMatch(/staff_user_id/);
    expect(source).toMatch(/FACILITATOR/);
    expect(source).toMatch(/ASSESSOR/);
    expect(source).toMatch(/sa\.synthetic = false/);
    expect(source).toMatch(/l\.synthetic = false/);
    expect(source).toMatch(/e\.synthetic = false/);
    expect(source).toMatch(/programme_code = 'HEPE-TPRS'/);
  });

  it('keeps the staff page dynamic and read-only', () => {
    expect(page).toMatch(/dynamic = 'force-dynamic'/);
    expect(page).toMatch(/revalidate = 0/);
    expect(page).toMatch(/Read-only/);
    expect(page).toMatch(/cannot verify, reject, certify, or grant Human Academic Clearance/);
  });
});
