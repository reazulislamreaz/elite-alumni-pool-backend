import app from "./app";
import { env } from "./config/env";
import { connectDb } from "./db";
import { seedDemoUsers } from "./services/seedDemoUsers";

// Local / traditional (non-serverless) entrypoint: connect, seed, then listen.
const bootstrap = async () => {
  await connectDb();
  await seedDemoUsers();
  app.listen(env.port, () => {
    console.log(`API running on ${env.port}`);
  });
};

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
