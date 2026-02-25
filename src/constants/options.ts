export interface ColorOption {
  key: string;
  label: string;
  hex: string;
  meaning: string;
}

export const STOOL_COLORS: ColorOption[] = [
  { key: 'brown', label: '棕色', hex: '#8B4513', meaning: '正常' },
  { key: 'yellow', label: '黄色', hex: '#DAA520', meaning: '可能正常' },
  { key: 'green', label: '绿色', hex: '#3A7D44', meaning: '食物/药物' },
  { key: 'black', label: '黑色', hex: '#1C1C1C', meaning: '注意就医' },
  { key: 'red', label: '红色', hex: '#C0392B', meaning: '注意就医' },
  { key: 'white', label: '白/灰色', hex: '#9E9E9E', meaning: '注意就医' },
];

export interface AbnormalFlag {
  key: string;
  label: string;
  emoji: string;
  severity: 'low' | 'medium' | 'high';
}

export const ABNORMAL_FLAGS: AbnormalFlag[] = [
  { key: 'blood', label: '带血', emoji: '🩸', severity: 'high' },
  { key: 'mucus', label: '黏液', emoji: '💧', severity: 'medium' },
  { key: 'pain', label: '腹痛', emoji: '😣', severity: 'medium' },
  { key: 'incomplete', label: '排便不尽', emoji: '😕', severity: 'low' },
  { key: 'strain', label: '用力排便', emoji: '😤', severity: 'low' },
];

export function getColorByKey(key: string): ColorOption | undefined {
  return STOOL_COLORS.find((c) => c.key === key);
}
