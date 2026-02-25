export interface BowelRecord {
  id: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  bristol?: number;    // 1-7
  color?: string;      // 'brown'|'yellow'|'green'|'black'|'red'|'white'
  duration?: number;   // minutes
  abnormal: string[];  // ['blood','mucus','pain','incomplete']
  notes?: string;
  photo_uri?: string;
  synced: number;      // 0=local only, 1=synced
  created_at: string;
  updated_at: string;
}

export interface RecordFormData {
  date: string;
  time: string;
  bristol?: number;
  color?: string;
  duration: number;
  abnormal: string[];
  notes: string;
  photo_uri?: string;
}
