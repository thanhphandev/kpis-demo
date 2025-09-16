import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface GlobalMongoDB {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare global {
  var mongooseGlobal: GlobalMongoDB | undefined;
}

let cached = globalThis.mongooseGlobal;

if (!cached) {
  cached = globalThis.mongooseGlobal = { mongoose: { conn: null, promise: null } };
}

async function connectDB() {
  if (cached!.mongoose.conn) {
    return cached!.mongoose.conn;
  }

  if (!cached!.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.mongoose.conn = await cached!.mongoose.promise;
  } catch (e) {
    cached!.mongoose.promise = null;
    throw e;
  }

  return cached!.mongoose.conn;
}

export default connectDB;