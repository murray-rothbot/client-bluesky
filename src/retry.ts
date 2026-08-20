type RetryOptions = {
  delayMs?: number;
  sleep?: (delayMs: number) => Promise<void>;
  onError?: (error: unknown) => void;
};

const defaultSleep = (delayMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export const retryUntilSuccess = async <T>(
  action: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const delayMs = options.delayMs ?? 5000;
  const sleep = options.sleep ?? defaultSleep;
  const onError = options.onError ?? ((error) => console.error("Startup failed; retrying:", error));

  for (;;) {
    try {
      return await action();
    } catch (error) {
      onError(error);
      await sleep(delayMs);
    }
  }
};
