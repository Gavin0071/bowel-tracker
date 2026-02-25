export function formatDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTime(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDateStr(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDateStr(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = parseDateStr(dateStr);
  const today = formatDate();
  const yesterday = addDays(today, -1);
  if (dateStr === today) return '今天';
  if (dateStr === yesterday) return '昨天';
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

export function getDayLabel(dateStr: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[parseDateStr(dateStr).getDay()];
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
