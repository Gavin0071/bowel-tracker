import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('bowel.db');
    await migrate(_db);
  }
  return _db;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS records (
      id          TEXT PRIMARY KEY,
      date        TEXT NOT NULL,
      time        TEXT NOT NULL,
      bristol     INTEGER,
      color       TEXT,
      duration    INTEGER,
      abnormal    TEXT NOT NULL DEFAULT '[]',
      notes       TEXT,
      photo_uri   TEXT,
      synced      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);
}
