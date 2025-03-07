import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function useDatabase() {
  if (!db) {
    db = await Database.load("sqlite:finance.db"); // Create or open `finance.db`
    // await wipeDatabase();
    await setupDatabase(); // Ensure tables exist
  }
  return db;
}

async function setupDatabase() {
  if (!db) return;

  // User
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      income REAL NOT NULL,
      saving REAL NOT NULL
    )
  `);

  // Category
  await db.execute(`
    CREATE TABLE IF NOT EXISTS category ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      budget REAL NOT NULL,
      userID INTEGER NOT NULL,
      FOREIGN KEY (userID) REFERENCES users(id)  
    )
  `);

  // Session
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );    
  `);

  // Transactions
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      description TEXT,
      isFixed BOOL NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      category REAL NOT NULL,
      FOREIGN KEY (category) REFERENCES category(name)
    )
  `);
}

async function wipeDatabase() {
  if (!db) return;
  console.log("⚠️ Wiping database...");

  // Drop tables if they exist
  await db.execute(`DROP TABLE IF EXISTS transactions`);
  await db.execute(`DROP TABLE IF EXISTS sessions`);
  await db.execute(`DROP TABLE IF EXISTS category`);
  await db.execute(`DROP TABLE IF EXISTS users`);
  await db.execute(`DROP TABLE IF EXISTS user`);

  console.log("✅ Database wiped successfully!");
}
