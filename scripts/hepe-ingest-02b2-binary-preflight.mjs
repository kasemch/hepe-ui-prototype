import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('USAGE: node scripts/hepe-ingest-02b2-binary-preflight.mjs <controlled.pdf>');
  process.exit(2);
}

const bytes = await fs.readFile(input);
const header = bytes.subarray(0, 5).toString('ascii');
const isPdf = header === '%PDF-';
const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');

const result = {
  gate: 'HEPE-INGEST-02B.2',
  scope: 'NON-PRODUCTION / CONTROLLED REAL PDF / READ-ONLY',
  fileName: path.basename(input),
  byteLength: bytes.length,
  pdfSignature: isPdf ? 'PASS' : 'FAIL',
  sha256,
  canonicalWriteAttempted: false,
  databaseMutationAttempted: false,
  productionActionAttempted: false,
};

console.log(JSON.stringify(result, null, 2));
if (!isPdf) process.exit(1);
