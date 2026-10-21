import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'app/tprs/lib/staff-workspace.ts'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/tprs/staff/page.tsx'), 'utf8');

describe('protected staff workspace contract', () => {
  it('is server-only and assignment scoped', () => {
    expect(source).toContain("import 'server-only'");
    expect(source).toContain('staff_user_id');
    expect(source).toContain('FACILITATOR');
    expect(source).toContain('ASSESSOR');
    expect(source).toContain('sa.synthetic = false');
    expect(source).toContain('l.synthetic = false');
    expect(source).toContain('e.synthetic = false');
    expect(source).toContain("programme_code = 'HEPE-TPRS'");
  });

  it('keeps the staff page dynamic and read-only', () => {
    expect(page).toContain("dynamic = 'force-dynamic'");
    expect(page).toContain('revalidate = 0');
    expect(page).toContain('Read-only');
    expect(page).toContain('cannot verify, reject, certify, or grant Human Academic Clearance');
  });
});
