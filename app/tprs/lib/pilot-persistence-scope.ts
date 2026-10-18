export type TprsRuntimeEnvironment = 'production' | 'preview' | 'development' | string | undefined;

/**
 * Synthetic controlled-pilot persistence must never activate against the
 * production runtime merely because the real-cohort database URL is present.
 */
export function pilotPersistenceAllowed(environment: TprsRuntimeEnvironment): boolean {
  return environment !== 'production';
}

export function pilotDatabaseUrl(
  environment: TprsRuntimeEnvironment,
  databaseUrl: string | undefined,
): string | null {
  if (!pilotPersistenceAllowed(environment)) return null;
  return databaseUrl || null;
}
