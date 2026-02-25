import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordStore } from '../../src/store/recordStore';
import { COLORS, SIZES } from '../../src/constants/theme';
import { getLast7Days, getLast30Days, getDayLabel } from '../../src/utils/dateUtils';
import { BRISTOL_TYPES } from '../../src/constants/bristol';

function BarChart({
  data,
  maxValue,
  maxBarHeight = 100,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
  maxBarHeight?: number;
}) {
  return (
    <View style={bc.container}>
      {data.map((item, i) => {
        const height = maxValue > 0 ? (item.value / maxValue) * maxBarHeight : 4;
        return (
          <View key={i} style={bc.col}>
            {item.value > 0 && (
              <Text style={bc.valueLabel}>{item.value}</Text>
            )}
            <View style={[bc.bar, { height: Math.max(height, 4) }]} />
            <Text style={bc.dayLabel}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function HealthAdvice({ records }: { records: any[] }) {
  const advices: { icon: string; text: string; type: 'ok' | 'warn' | 'danger' }[] = [];

  const today = new Date();
  const last3Days = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const last3HasRecord = last3Days.some((d) => records.some((r) => r.date === d));
  if (!last3HasRecord && records.length === 0)
    advices.push({ icon: '⚠️', text: '最近3天无记录，注意是否有便秘情况', type: 'warn' });

  const recent10 = records.slice(0, 10);
  const highTypes = recent10.filter((r) => r.bristol >= 6).length;
  if (highTypes >= 3)
    advices.push({ icon: '💧', text: '近期多次出现稀便，注意补水', type: 'warn' });

  const bloodCount = records.filter((r) => r.abnormal?.includes('blood')).length;
  if (bloodCount >= 2)
    advices.push({ icon: '🩸', text: '多次出现带血，建议就医检查', type: 'danger' });

  if (advices.length === 0)
    advices.push({ icon: '✅', text: '排便记录正常，继续保持', type: 'ok' });

  return (
    <View>
      {advices.map((a, i) => (
        <View
          key={i}
          style={[
            adv.item,
            a.type === 'danger' && { backgroundColor: '#FFF5F5', borderColor: '#FFCDD2' },
            a.type === 'warn' && { backgroundColor: '#FFFDE7', borderColor: '#FFF9C4' },
            a.type === 'ok' && { backgroundColor: '#F1F8F2', borderColor: '#C8E6C9' },
          ]}
        >
          <Text style={adv.icon}>{a.icon}</Text>
          <Text style={adv.text}>{a.text}</Text>
        </View>
      ))}
    </View>
  );
}

export default function StatsScreen() {
  const records = useRecordStore((s) => s.records);

  const last7 = getLast7Days();
  const last30 = getLast30Days();

  const weekData = useMemo(
    () =>
      last7.map((d) => ({
        label: getDayLabel(d),
        value: records.filter((r) => r.date === d).length,
      })),
    [records]
  );
  const weekMax = Math.max(...weekData.map((d) => d.value), 1);

  const bristolDist = useMemo(() => {
    const month30 = records.filter((r) => last30.includes(r.date) && r.bristol);
    const counts: Record<number, number> = {};
    month30.forEach((r) => {
      if (r.bristol) counts[r.bristol] = (counts[r.bristol] || 0) + 1;
    });
    return BRISTOL_TYPES.map((bt) => ({ bt, count: counts[bt.type] || 0 })).filter(
      (x) => x.count > 0
    );
  }, [records]);
  const bristolMax = Math.max(...bristolDist.map((d) => d.count), 1);

  const totalMonth = records.filter((r) => last30.includes(r.date)).length;
  const avgPerDay = totalMonth > 0 ? (totalMonth / 30).toFixed(1) : '0';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Summary row */}
        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summaryNum}>{totalMonth}</Text>
            <Text style={s.summaryLabel}>近30天次数</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryNum}>{avgPerDay}</Text>
            <Text style={s.summaryLabel}>日均次数</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryNum}>{records.length}</Text>
            <Text style={s.summaryLabel}>总记录数</Text>
          </View>
        </View>

        {/* Week frequency chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>近 7 天排便频率</Text>
          <BarChart data={weekData} maxValue={weekMax} maxBarHeight={100} />
        </View>

        {/* Bristol distribution */}
        {bristolDist.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Bristol 分型分布（近30天）</Text>
            {bristolDist.map(({ bt, count }) => (
              <View key={bt.type} style={dist.row}>
                <Text style={dist.label}>{bt.name}</Text>
                <View style={dist.barBg}>
                  <View
                    style={[
                      dist.bar,
                      {
                        width: `${(count / bristolMax) * 100}%`,
                        backgroundColor: bt.categoryColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[dist.count, { color: bt.categoryColor }]}>
                  {count}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Health advice */}
        <View style={s.card}>
          <Text style={s.cardTitle}>健康建议</Text>
          <HealthAdvice records={records} />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.md },
  summaryRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
});

const bc = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 130,
    paddingTop: 20,
  },
  col: { alignItems: 'center', flex: 1 },
  bar: {
    width: 28,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginBottom: 6,
  },
  valueLabel: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  dayLabel: { fontSize: 11, color: COLORS.textSecondary },
});

const dist = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  label: { width: 48, fontSize: 12, color: COLORS.text, fontWeight: '600' },
  barBg: {
    flex: 1,
    height: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: { height: '100%', borderRadius: 8 },
  count: { width: 28, fontSize: 12, fontWeight: '700', textAlign: 'right' },
});

const adv = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SIZES.md,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  icon: { fontSize: 18 },
  text: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },
});
