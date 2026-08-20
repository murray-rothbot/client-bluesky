import { Start } from "./start";
import http from "node:http";
import { retryUntilSuccess } from "./retry";

let ready = false;

const startHealthServer = (): void => {
  const port = Number(process.env.PORT || 4005);
  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(ready ? 200 : 503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: ready, service: "client-bluesky" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("client-bluesky");
  });

  server.listen(port, () => {
    console.log(`Health server listening on :${port}`);
  });
};

const init = async (): Promise<void> => {
  await retryUntilSuccess(async () => {
    console.log("Starting Murray Rothbot on Bluesky");
    const client = await Start.Bluesky();
    await Start.Schedules({ client });
    ready = true;
  });
};

startHealthServer();
void init();
