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

  // User
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user ( 
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
      FOREIGN KEY (userID) REFERENCES user(id)  
    )
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

async function dropTables() {
  if (!db) return;
  await db.execute(`DROP TABLE category`);
  await db.execute(`DROP TABLE transactions`);
  await db.execute(`DROP TABLE user`);
}
