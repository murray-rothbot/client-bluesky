import { Start } from "./start";
import http from "node:http";

const startHealthServer = (): void => {
  const port = Number(process.env.PORT || 4005);
  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, service: "client-bluesky" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("client-bluesky");
  });

  server.listen(port, () => {
    console.log(`Health server listening on :${port}`);
  });
};

const init = async () => {
  try {
    console.log("Starting Murray Rothbot on Bluesky");

    const client = await Start.Bluesky();

    await Start.Schedules({ client });
  } catch (error) {
    console.log(error);
  }
};

startHealthServer();
init();
