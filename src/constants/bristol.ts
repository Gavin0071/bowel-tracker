export interface BristolType {
  type: number;
  name: string;
  description: string;
  categoryLabel: string;
  categoryColor: string;
  bgColor: string;
}

export const BRISTOL_TYPES: BristolType[] = [
  {
    type: 1,
    name: '1 型',
    description: '分散坚硬\n的小块',
    categoryLabel: '严重便秘',
    categoryColor: '#8B4513',
    bgColor: '#FFF5EF',
  },
  {
    type: 2,
    name: '2 型',
    description: '香肠状\n表面凹凸',
    categoryLabel: '轻度便秘',
    categoryColor: '#A0522D',
    bgColor: '#FFF8F5',
  },
  {
    type: 3,
    name: '3 型',
    description: '香肠状\n表面有裂缝',
    categoryLabel: '正常偏干',
    categoryColor: '#B8860B',
    bgColor: '#FFFDF0',
  },
  {
    type: 4,
    name: '4 型 ✓',
    description: '光滑柔软\n香肠状',
    categoryLabel: '理想正常',
    categoryColor: '#2E7D32',
    bgColor: '#F1F8F2',
  },
  {
    type: 5,
    name: '5 型',
    description: '软块\n边缘清晰',
    categoryLabel: '偏软',
    categoryColor: '#DAA520',
    bgColor: '#FFFDF0',
  },
  {
    type: 6,
    name: '6 型',
    description: '糊状\n边缘不清',
    categoryLabel: '轻度腹泻',
    categoryColor: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    type: 7,
    name: '7 型',
    description: '水状\n无固体',
    categoryLabel: '严重腹泻',
    categoryColor: '#C62828',
    bgColor: '#FFEBEE',
  },
];

export function getBristolByType(type: number): BristolType | undefined {
  return BRISTOL_TYPES.find((b) => b.type === type);
}
