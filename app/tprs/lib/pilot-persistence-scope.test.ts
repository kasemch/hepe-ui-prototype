import { describe, expect, it } from 'vitest';
import { pilotDatabaseUrl, pilotPersistenceAllowed } from './pilot-persistence-scope';

describe('TPRS pilot persistence runtime isolation', () => {
  it('blocks controlled-pilot persistence in production even when the real cohort DB URL exists', () => {
    expect(pilotPersistenceAllowed('production')).toBe(false);
    expect(pilotDatabaseUrl('production', 'postgresql://example.invalid/neondb')).toBeNull();
  });

  it('preserves controlled-pilot persistence in preview', () => {
    expect(pilotPersistenceAllowed('preview')).toBe(true);
    expect(pilotDatabaseUrl('preview', 'postgresql://example.invalid/neondb')).toBe('postgresql://example.invalid/neondb');
  });

  it('does not fabricate a database URL', () => {
    expect(pilotDatabaseUrl('preview', undefined)).toBeNull();
  });
});
