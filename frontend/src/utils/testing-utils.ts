export function isTestingEnv(): boolean {
  return (
    !!process &&
    (process.env.JEST_WORKER_ID !== undefined ||
      process.env.NODE_ENV === "test")
  );
}

export function addMatchMedia(): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
