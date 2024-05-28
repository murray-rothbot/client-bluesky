import { Start } from "./start";

const init = async () => {
  try {
    console.log("Starting Murray Rothbot on Bluesky");

    const client = await Start.Bluesky();

    await Start.Schedules({ client });
  } catch (error) {
    console.log(error);
  }
};

init();
