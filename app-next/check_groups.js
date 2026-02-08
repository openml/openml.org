import { getDb } from "./src/lib/db.js";

async function checkGroupsSchema() {
  const db = await getDb();
  if (process.env.MYSQL_HOST) {
    console.log("MySQL Schema check not implemented yet via this script.");
  } else {
    try {
      const info = db.prepare("PRAGMA table_info(users_groups)").all();
      console.log("users_groups table info:", info);
    } catch (e) {
      console.error("Error accessing users_groups:", e.message);
    }
  }
}

checkGroupsSchema().catch(console.error);
