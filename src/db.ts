import mongoose from "mongoose";
import { env } from "./config/env";

// Cache the connection promise so warm serverless invocations reuse a single
// Mongo connection instead of opening a new one per request.
let connection: Promise<typeof mongoose> | null = null;

export const connectDb = () => {
  if (!connection) connection = mongoose.connect(env.mongoUri);
  return connection;
};
