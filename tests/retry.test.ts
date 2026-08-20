import assert from "assert";
import { retryUntilSuccess } from "../src/retry";

(async () => {
  let attempts = 0;
  let sleeps = 0;
  const result = await retryUntilSuccess(
    async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary DNS failure");
      return "connected";
    },
    {
      delayMs: 1,
      sleep: async () => {
        sleeps += 1;
      },
      onError: () => undefined,
    },
  );

  assert.equal(result, "connected");
  assert.equal(attempts, 2);
  assert.equal(sleeps, 1);
  console.log("retry tests passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
