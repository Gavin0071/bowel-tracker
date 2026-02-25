import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordStore } from '../../src/store/recordStore';
import RecordCard from '../../src/components/RecordCard';
import { COLORS, SIZES } from '../../src/constants/theme';
import { formatDate, formatDisplayDate } from '../../src/utils/dateUtils';
import { getBristolByType } from '../../src/constants/bristol';

export default function HomeScreen() {
  const router = useRouter();
  const { records, loading, initialized } = useRecordStore();

  const today = formatDate();
  const todayRecords = useMemo(
    () => records.filter((r) => r.date === today),
    [records, today]
  );
  const recentRecords = useMemo(() => records.slice(0, 15), [records]);

  const lastRecord = todayRecords[0];
  const lastBristol = lastRecord?.bristol
    ? getBristolByType(lastRecord.bristol)
    : null;

  if (!initialized) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>排便记录</Text>
          <Text style={s.headerDate}>{formatDisplayDate(today)}</Text>
        </View>

        {/* Today summary card */}
        <View style={s.summaryCard}>
          <View style={s.summaryLeft}>
            <Text style={s.summaryNum}>{todayRecords.length}</Text>
            <Text style={s.summaryLabel}>今日次数</Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRight}>
            {lastRecord ? (
              <>
                <Text style={s.summaryTime}>{lastRecord.time}</Text>
                <Text style={s.summaryDetail}>
                  {lastBristol
                    ? `${lastBristol.name} · ${lastBristol.categoryLabel}`
                    : '最近一次'}
                </Text>
              </>
            ) : (
              <Text style={s.summaryDetail}>今天还没有记录</Text>
            )}
          </View>
        </View>

        {/* Quick add hint */}
        {todayRecords.length === 0 && (
          <View style={s.hintCard}>
            <Text style={s.hintText}>
              💡 点击右下角 + 按钮记录今天的第一次排便
            </Text>
          </View>
        )}

        {/* Recent records */}
        {recentRecords.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>最近记录</Text>
            {recentRecords.map((r) => (
              <RecordCard key={r.id} record={r} showDate />
            ))}
          </View>
        )}

        {recentRecords.length === 0 && (
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>📋</Text>
            <Text style={s.emptyTitle}>还没有记录</Text>
            <Text style={s.emptyDesc}>点击下方 + 按钮开始记录</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => router.push('/record')}
        activeOpacity={0.85}
      >
        <Text style={s.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: SIZES.md },

  header: { paddingTop: SIZES.md, marginBottom: SIZES.md },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  summaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  summaryLeft: { alignItems: 'center', width: 80 },
  summaryNum: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 52,
  },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: SIZES.lg,
  },
  summaryRight: { flex: 1 },
  summaryTime: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  summaryDetail: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  hintCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    opacity: 0.8,
  },
  hintText: { fontSize: 13, color: COLORS.primaryDark, textAlign: 'center' },

  section: { marginBottom: SIZES.md },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },

  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: SIZES.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },

  fab: {
    position: 'absolute',
    right: SIZES.lg,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabIcon: { fontSize: 30, color: '#FFF', fontWeight: '300', lineHeight: 34 },
});
