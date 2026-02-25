import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RecordFormData } from '../types';
import { COLORS, SIZES } from '../constants/theme';
import { formatDate, formatTime, addDays, formatDisplayDate } from '../utils/dateUtils';
import BristolPicker from './BristolPicker';
import ColorPicker from './ColorPicker';
import AbnormalFlags from './AbnormalFlags';

interface Props {
  initialValues?: Partial<RecordFormData>;
  onSave: (data: RecordFormData) => Promise<void>;
  title: string;
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <View style={sf.stepperRow}>
      <Text style={sf.stepperLabel}>{label}</Text>
      <View style={sf.stepperControls}>
        <TouchableOpacity
          style={sf.stepBtn}
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Text style={sf.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={sf.stepValue}>{value}</Text>
        <TouchableOpacity
          style={sf.stepBtn}
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Text style={sf.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RecordForm({ initialValues, onSave, title }: Props) {
  const router = useRouter();
  const now = new Date();

  const [date, setDate] = useState(initialValues?.date ?? formatDate(now));
  const [hour, setHour] = useState(
    initialValues?.time
      ? parseInt(initialValues.time.split(':')[0])
      : now.getHours()
  );
  const [minute, setMinute] = useState(
    initialValues?.time
      ? parseInt(initialValues.time.split(':')[1])
      : Math.floor(now.getMinutes() / 5) * 5
  );
  const [bristol, setBristol] = useState<number | undefined>(
    initialValues?.bristol
  );
  const [color, setColor] = useState<string | undefined>(
    initialValues?.color
  );
  const [abnormal, setAbnormal] = useState<string[]>(
    initialValues?.abnormal ?? []
  );
  const [duration, setDuration] = useState(initialValues?.duration ?? 0);
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        date,
        time: timeStr,
        bristol,
        color,
        duration: duration || undefined,
        abnormal,
        notes,
      } as RecordFormData);
      router.back();
    } catch (e) {
      Alert.alert('保存失败', String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={sf.root}
      contentContainerStyle={sf.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Date picker */}
      <View style={sf.section}>
        <Text style={sf.sectionTitle}>日期</Text>
        <View style={sf.dateRow}>
          <TouchableOpacity
            style={sf.arrowBtn}
            onPress={() => setDate(addDays(date, -1))}
          >
            <Text style={sf.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={sf.dateText}>{formatDisplayDate(date)}</Text>
          <TouchableOpacity
            style={sf.arrowBtn}
            onPress={() => setDate(addDays(date, 1))}
          >
            <Text style={sf.arrowText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time picker */}
      <View style={sf.section}>
        <Text style={sf.sectionTitle}>时间</Text>
        <View style={sf.timeRow}>
          <Stepper
            label="时"
            value={hour}
            onChange={setHour}
            min={0}
            max={23}
          />
          <Text style={sf.timeSep}>:</Text>
          <Stepper
            label="分"
            value={minute}
            onChange={(v) => setMinute(Math.round(v / 5) * 5)}
            min={0}
            max={55}
          />
        </View>
      </View>

      {/* Bristol type */}
      <View style={sf.sectionNoPad}>
        <Text style={[sf.sectionTitle, { paddingHorizontal: SIZES.md }]}>
          Bristol 分型{' '}
          <Text style={sf.optional}>（可选）</Text>
        </Text>
        <BristolPicker value={bristol} onChange={setBristol} />
        {bristol && (
          <TouchableOpacity
            style={sf.clearBtn}
            onPress={() => setBristol(undefined)}
          >
            <Text style={sf.clearText}>清除选择</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Color */}
      <View style={sf.sectionNoPad}>
        <Text style={[sf.sectionTitle, { paddingHorizontal: SIZES.md }]}>
          颜色 <Text style={sf.optional}>（可选）</Text>
        </Text>
        <ColorPicker value={color} onChange={setColor} />
      </View>

      {/* Abnormal flags */}
      <View style={sf.sectionNoPad}>
        <Text style={[sf.sectionTitle, { paddingHorizontal: SIZES.md }]}>
          异常标记
        </Text>
        <AbnormalFlags value={abnormal} onChange={setAbnormal} />
      </View>

      {/* Duration */}
      <View style={sf.section}>
        <Stepper
          label="如厕时长（分钟）"
          value={duration}
          onChange={setDuration}
          min={0}
          max={120}
        />
      </View>

      {/* Notes */}
      <View style={sf.section}>
        <Text style={sf.sectionTitle}>备注</Text>
        <TextInput
          style={sf.textarea}
          value={notes}
          onChangeText={setNotes}
          placeholder="添加备注..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={[sf.saveBtn, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={sf.saveBtnText}>保存记录</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const sf = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: SIZES.md },

  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
  },
  sectionNoPad: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optional: { fontWeight: '400', textTransform: 'none', letterSpacing: 0 },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.background,
  },
  arrowText: { fontSize: 22, color: COLORS.primary, fontWeight: '600' },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  timeSep: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },

  stepperRow: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepBtnText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: 22,
  },
  stepValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 36,
    textAlign: 'center',
  },

  clearBtn: { alignSelf: 'center', marginTop: 4 },
  clearText: { fontSize: 12, color: COLORS.textSecondary },

  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    padding: SIZES.sm,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 72,
    textAlignVertical: 'top',
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
