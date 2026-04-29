import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("mongodb://ureead2006_db_user:helloworld@ac-m3nfm9a-shard-00-00.zwea1p8.mongodb.net:27017,ac-m3nfm9a-shard-00-01.zwea1p8.mongodb.net:27017,ac-m3nfm9a-shard-00-02.zwea1p8.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gl7is-shard-0&authSource=admin&appName=Cluster0");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;