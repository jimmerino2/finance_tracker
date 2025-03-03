import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function useDatabase() {
  if (!db) {
    db = await Database.load("sqlite:finance.db"); // Create or open `finance.db`
    await setupDatabase(); // Ensure tables exist
  }
  return db;
}

async function setupDatabase() {
  if (!db) return;

  console.log("Hello World");
  // Create a transactions table if it doesn’t exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
