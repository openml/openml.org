import { getDb } from "./src/lib/db.js";

async function checkPasskeySchema() {
  const db = await getDb();
  if (process.env.MYSQL_HOST) {
    console.log("MySQL Schema check not implemented yet via this script.");
  } else {
    try {
      const info = db.prepare("PRAGMA table_info(user_passkeys)").all();
      console.log("user_passkeys table info:", info);
      
      const count = db.prepare("SELECT COUNT(*) as count FROM user_passkeys").get();
      console.log("Passkey count:", count);
      
      const sample = db.prepare("SELECT id, user_id, device_name FROM user_passkeys LIMIT 1").get();
      console.log("Sample passkey (text fields):", sample);
    } catch (e) {
      console.error("Error accessing user_passkeys:", e.message);
    }
  }
}

checkPasskeySchema().catch(console.error);
