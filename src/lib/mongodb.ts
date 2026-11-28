import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Keep one connection across hot reloads in dev and across calls in a serverless instance.
const g = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = (g._mongoose ??= { conn: null, promise: null });

/**
 * Returns the connection, or null when MONGODB_URI is not set.
 * The site runs without a database; the form then works in demo mode.
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (cache.conn) return cache.conn;

  try {
    cache.promise ??= mongoose.connect(uri, { bufferCommands: false });
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null; // allow a retry on the next request
    throw err;
  }
}
