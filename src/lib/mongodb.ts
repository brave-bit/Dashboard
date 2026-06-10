import { MongoClient, type Collection, type Db } from "mongodb";
import type { Employee } from "./types";

export type EmployeeDocument = Employee;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example)"
    );
  }
  return uri;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}

export async function getEmployeesCollection(): Promise<
  Collection<EmployeeDocument>
> {
  const db = await getDb();
  return db.collection<EmployeeDocument>("employees");
}

let indexesReady = false;

export async function ensureEmployeeIndexes(): Promise<void> {
  if (indexesReady) return;
  const collection = await getEmployeesCollection();
  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ fullName: 1 });
  indexesReady = true;
}
