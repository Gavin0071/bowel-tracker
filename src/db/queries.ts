import { getDB } from './schema';
import { BowelRecord, RecordFormData } from '../types';
import { formatDate, formatTime, generateId } from '../utils/dateUtils';

function now(): string {
  return new Date().toISOString();
}

function parseRecord(row: any): BowelRecord {
  return {
    ...row,
    abnormal: JSON.parse(row.abnormal || '[]'),
  };
}

export async function insertRecord(data: RecordFormData): Promise<BowelRecord> {
  const db = await getDB();
  const record: BowelRecord = {
    id: generateId(),
    date: data.date,
    time: data.time,
    bristol: data.bristol,
    color: data.color,
    duration: data.duration || undefined,
    abnormal: data.abnormal,
    notes: data.notes || undefined,
    photo_uri: data.photo_uri,
    synced: 0,
    created_at: now(),
    updated_at: now(),
  };

  await db.runAsync(
    `INSERT INTO records
      (id, date, time, bristol, color, duration, abnormal, notes, photo_uri, synced, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id,
      record.date,
      record.time,
      record.bristol ?? null,
      record.color ?? null,
      record.duration ?? null,
      JSON.stringify(record.abnormal),
      record.notes ?? null,
      record.photo_uri ?? null,
      record.synced,
      record.created_at,
      record.updated_at,
    ]
  );
  return record;
}

export async function updateRecord(
  id: string,
  data: Partial<RecordFormData>
): Promise<void> {
  const db = await getDB();
  const sets: string[] = [];
  const vals: any[] = [];

  if (data.date !== undefined) { sets.push('date = ?'); vals.push(data.date); }
  if (data.time !== undefined) { sets.push('time = ?'); vals.push(data.time); }
  if (data.bristol !== undefined) { sets.push('bristol = ?'); vals.push(data.bristol); }
  if (data.color !== undefined) { sets.push('color = ?'); vals.push(data.color); }
  if (data.duration !== undefined) { sets.push('duration = ?'); vals.push(data.duration || null); }
  if (data.abnormal !== undefined) { sets.push('abnormal = ?'); vals.push(JSON.stringify(data.abnormal)); }
  if (data.notes !== undefined) { sets.push('notes = ?'); vals.push(data.notes || null); }
  if (data.photo_uri !== undefined) { sets.push('photo_uri = ?'); vals.push(data.photo_uri); }

  sets.push('updated_at = ?');
  vals.push(now());
  vals.push(id);

  await db.runAsync(`UPDATE records SET ${sets.join(', ')} WHERE id = ?`, vals);
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM records WHERE id = ?', [id]);
}

export async function getAllRecords(): Promise<BowelRecord[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM records ORDER BY date DESC, time DESC'
  );
  return rows.map(parseRecord);
}

export async function getRecordsByDate(date: string): Promise<BowelRecord[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM records WHERE date = ? ORDER BY time DESC',
    [date]
  );
  return rows.map(parseRecord);
}

export async function getRecordsInRange(
  from: string,
  to: string
): Promise<BowelRecord[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM records WHERE date >= ? AND date <= ? ORDER BY date DESC, time DESC',
    [from, to]
  );
  return rows.map(parseRecord);
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDB();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}
