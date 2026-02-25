import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useRecordStore } from '../../src/store/recordStore';
import { getSetting, setSetting } from '../../src/db/queries';

function SettingRow({
  icon,
  label,
  right,
}: {
  icon: string;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <View style={s.row}>
      <Text style={s.rowIcon}>{icon}</Text>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={s.rowRight}>{right}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const records = useRecordStore((s) => s.records);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    getSetting('reminder_enabled').then((v) => {
      setReminderEnabled(v === '1');
    });
  }, []);

  const toggleReminder = async (val: boolean) => {
    setReminderEnabled(val);
    await setSetting('reminder_enabled', val ? '1' : '0');
    if (val) {
      Alert.alert('提醒已开启', '每天将在设定时间提醒您记录排便情况（完整功能在 V1.2 版本上线）');
    }
  };

  const handleExportData = () => {
    Alert.alert('导出数据', `共 ${records.length} 条记录\n\nPDF 导出功能将在 V1.2 版本上线`, [
      { text: '知道了' },
    ]);
  };

  const handleClearData = () => {
    Alert.alert('清除所有数据', '此操作不可恢复，确定要清除所有记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认清除',
        style: 'destructive',
        onPress: () => Alert.alert('提示', '清除功能开发中'),
      },
    ]);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView>
        {/* Stats summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>数据概览</Text>
          <SettingRow
            icon="📋"
            label="总记录数"
            right={<Text style={s.valueText}>{records.length} 条</Text>}
          />
        </View>

        {/* Notifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>提醒设置</Text>
          <SettingRow
            icon="🔔"
            label="每日提醒"
            right={
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ true: COLORS.primary, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            }
          />
          {reminderEnabled && (
            <SettingRow
              icon="⏰"
              label="提醒时间"
              right={<Text style={s.valueText}>08:00（V1.2 可设置）</Text>}
            />
          )}
        </View>

        {/* Cloud sync (placeholder) */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>云端同步</Text>
          <SettingRow
            icon="☁️"
            label="登录账号"
            right={<Text style={s.valueText}>V1.1 上线</Text>}
          />
          <SettingRow
            icon="🔄"
            label="自动同步"
            right={<Text style={s.valueText}>V1.1 上线</Text>}
          />
        </View>

        {/* Data management */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>数据管理</Text>
          <TouchableOpacity style={s.row} onPress={handleExportData}>
            <Text style={s.rowIcon}>📤</Text>
            <Text style={s.rowLabel}>导出就医报告（PDF）</Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={handleClearData}>
            <Text style={s.rowIcon}>🗑</Text>
            <Text style={[s.rowLabel, { color: COLORS.danger }]}>
              清除所有数据
            </Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>关于</Text>
          <SettingRow
            icon="📱"
            label="版本"
            right={<Text style={s.valueText}>MVP 1.0</Text>}
          />
          <SettingRow
            icon="👨‍⚕️"
            label="声明"
            right={
              <Text style={[s.valueText, { fontSize: 11 }]}>
                仅供参考，不代替医疗诊断
              </Text>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.md,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  rowIcon: { fontSize: 18, marginRight: SIZES.sm },
  rowLabel: { flex: 1, fontSize: 15, color: COLORS.text },
  rowRight: { alignItems: 'flex-end' },
  valueText: { fontSize: 13, color: COLORS.textSecondary },
  chevron: { fontSize: 18, color: COLORS.textMuted },
});
