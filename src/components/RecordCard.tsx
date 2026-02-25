import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BowelRecord } from '../types';
import { getBristolByType } from '../constants/bristol';
import { getColorByKey } from '../constants/options';
import { COLORS, SIZES } from '../constants/theme';
import { useRecordStore } from '../store/recordStore';
import { formatShortDate } from '../utils/dateUtils';

interface Props {
  record: BowelRecord;
  showDate?: boolean;
}

export default function RecordCard({ record, showDate = false }: Props) {
  const router = useRouter();
  const remove = useRecordStore((s) => s.remove);
  const bristol = record.bristol ? getBristolByType(record.bristol) : null;
  const color = record.color ? getColorByKey(record.color) : null;

  const handleDelete = () => {
    Alert.alert('删除记录', '确认删除这条记录？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => remove(record.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/record/${record.id}`)}
      onLongPress={handleDelete}
      activeOpacity={0.7}
    >
      {/* Left accent bar colored by Bristol type */}
      <View
        style={[
          s.accent,
          { backgroundColor: bristol?.categoryColor ?? COLORS.border },
        ]}
      />

      <View style={s.body}>
        <View style={s.row}>
          <Text style={s.time}>
            {showDate ? `${formatShortDate(record.date)} ` : ''}
            {record.time}
          </Text>
          {record.duration ? (
            <Text style={s.chip}>{record.duration} 分钟</Text>
          ) : null}
        </View>

        <View style={s.row}>
          {bristol && (
            <View style={[s.badge, { backgroundColor: bristol.bgColor }]}>
              <Text style={[s.badgeText, { color: bristol.categoryColor }]}>
                Bristol {bristol.type} 型
              </Text>
            </View>
          )}
          {color && (
            <View style={s.row}>
              <View style={[s.colorDot, { backgroundColor: color.hex }]} />
              <Text style={s.colorLabel}>{color.label}</Text>
            </View>
          )}
        </View>

        {record.abnormal.length > 0 && (
          <Text style={s.abnormal}>
            ⚠ {record.abnormal.join(' · ')}
          </Text>
        )}
        {record.notes ? (
          <Text style={s.notes} numberOfLines={1}>
            {record.notes}
          </Text>
        ) : null}
      </View>

      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accent: { width: 4 },
  body: { flex: 1, padding: SIZES.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  time: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  chip: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  abnormal: {
    fontSize: 12,
    color: COLORS.warning,
    marginTop: 2,
  },
  notes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textMuted,
    alignSelf: 'center',
    paddingRight: SIZES.md,
  },
});
