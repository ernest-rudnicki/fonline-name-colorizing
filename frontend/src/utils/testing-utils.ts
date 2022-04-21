export function isTestingEnv(): boolean {
  return (
    process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test"
  );
}
