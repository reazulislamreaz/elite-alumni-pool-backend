import type { IncomingMessage, ServerResponse } from "http";
import app from "./app";
import { connectDb } from "./db";
import { seedDemoUsers } from "./services/seedDemoUsers";

// Vercel serverless entrypoint. Express apps are themselves (req, res) handlers,
// so we ensure the DB is connected (and demo users seeded) once per cold start,
// then delegate the request to the Express app.
let ready: Promise<unknown> | null = null;

const init = async () => {
  await connectDb();
  await seedDemoUsers();
};

const expressHandler = app as unknown as (req: IncomingMessage, res: ServerResponse) => void;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!ready) ready = init();
  await ready;
  return expressHandler(req, res);
}
