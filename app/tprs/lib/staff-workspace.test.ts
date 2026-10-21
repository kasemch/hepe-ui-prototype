import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'app/tprs/lib/staff-workspace.ts'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/tprs/staff/page.tsx'), 'utf8');

test('staff workspace is server-only and assignment scoped', () => {
  assert.match(source, /import 'server-only'/);
  assert.match(source, /staff_user_id/);
  assert.match(source, /FACILITATOR/);
  assert.match(source, /ASSESSOR/);
  assert.match(source, /sa\.synthetic = false/);
  assert.match(source, /l\.synthetic = false/);
  assert.match(source, /e\.synthetic = false/);
  assert.match(source, /programme_code = 'HEPE-TPRS'/);
});

test('staff page is dynamic and read-only', () => {
  assert.match(page, /dynamic = 'force-dynamic'/);
  assert.match(page, /revalidate = 0/);
  assert.match(page, /Read-only/);
  assert.match(page, /cannot verify, reject, certify, or grant Human Academic Clearance/);
});
