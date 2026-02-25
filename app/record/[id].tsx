import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRecordStore } from '../../src/store/recordStore';
import RecordForm from '../../src/components/RecordForm';
import { RecordFormData } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function EditRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const records = useRecordStore((s) => s.records);
  const update = useRecordStore((s) => s.update);

  const record = useMemo(() => records.find((r) => r.id === id), [records, id]);

  if (!record) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={s.text}>加载中...</Text>
      </View>
    );
  }

  const initialValues: Partial<RecordFormData> = {
    date: record.date,
    time: record.time,
    bristol: record.bristol,
    color: record.color,
    duration: record.duration ?? 0,
    abnormal: record.abnormal,
    notes: record.notes ?? '',
  };

  const handleSave = async (data: RecordFormData) => {
    await update(id, data);
  };

  return (
    <RecordForm title="编辑记录" initialValues={initialValues} onSave={handleSave} />
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  text: { fontSize: 14, color: COLORS.textSecondary },
});
