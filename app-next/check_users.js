import { getDb } from "./src/lib/db.js";

async function checkUser() {
  const db = await getDb();
  if (process.env.MYSQL_HOST) {
    console.log("MySQL Schema check not implemented yet via this script.");
  } else {
    try {
      const users = db.prepare("SELECT id, username, email, created_on FROM users ORDER BY id DESC LIMIT 5").all();
      console.log("Latest users:", users);
    } catch (e) {
      console.error("Error accessing users:", e.message);
    }
  }
}

checkUser().catch(console.error);
