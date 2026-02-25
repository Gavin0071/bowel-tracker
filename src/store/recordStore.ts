import { create } from 'zustand';
import { BowelRecord, RecordFormData } from '../types';
import {
  getAllRecords,
  insertRecord,
  updateRecord as dbUpdate,
  deleteRecord as dbDelete,
} from '../db/queries';
import { formatDate } from '../utils/dateUtils';

interface RecordStore {
  records: BowelRecord[];
  loading: boolean;
  initialized: boolean;

  loadAll: () => Promise<void>;
  add: (data: RecordFormData) => Promise<BowelRecord>;
  update: (id: string, data: Partial<RecordFormData>) => Promise<void>;
  remove: (id: string) => Promise<void>;

  // Selectors
  todayRecords: () => BowelRecord[];
  recordsByDate: (date: string) => BowelRecord[];
  markedDates: () => Record<string, any>;
}

export const useRecordStore = create<RecordStore>((set, get) => ({
  records: [],
  loading: false,
  initialized: false,

  loadAll: async () => {
    set({ loading: true });
    try {
      const records = await getAllRecords();
      set({ records, loading: false, initialized: true });
    } catch (e) {
      console.error('loadAll error:', e);
      set({ loading: false, initialized: true });
    }
  },

  add: async (data: RecordFormData) => {
    const record = await insertRecord(data);
    set((s) => ({
      records: [record, ...s.records].sort((a, b) => {
        const da = `${a.date} ${a.time}`;
        const db2 = `${b.date} ${b.time}`;
        return db2.localeCompare(da);
      }),
    }));
    return record;
  },

  update: async (id: string, data: Partial<RecordFormData>) => {
    await dbUpdate(id, data);
    set((s) => ({
      records: s.records.map((r) =>
        r.id === id
          ? {
              ...r,
              ...data,
              abnormal: data.abnormal ?? r.abnormal,
              updated_at: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  remove: async (id: string) => {
    await dbDelete(id);
    set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
  },

  todayRecords: () => {
    const today = formatDate();
    return get().records.filter((r) => r.date === today);
  },

  recordsByDate: (date: string) => {
    return get().records.filter((r) => r.date === date);
  },

  markedDates: () => {
    const counts: Record<string, number> = {};
    get().records.forEach((r) => {
      counts[r.date] = (counts[r.date] || 0) + 1;
    });
    const result: Record<string, any> = {};
    Object.entries(counts).forEach(([date, count]) => {
      result[date] = {
        marked: true,
        dotColor: count >= 3 ? '#CC4B4B' : count >= 2 ? '#E8973B' : '#4A9B7F',
      };
    });
    return result;
  },
}));
