import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import seedData from "../src/data/employees.json";

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing. Add it to .env.local first.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db();
  const collection = db.collection("employees");

  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ email: 1 }, { unique: true });

  for (const emp of seedData) {
    const document = {
      ...emp,
      email: emp.email.trim().toLowerCase(),
    };

    await collection.updateOne(
      { id: emp.id },
      { $set: document },
      { upsert: true }
    );
  }

  const count = await collection.countDocuments();
  console.log(`Seed complete: ${count} employees in MongoDB`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
