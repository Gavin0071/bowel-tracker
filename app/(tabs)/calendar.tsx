import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordStore } from '../../src/store/recordStore';
import RecordCard from '../../src/components/RecordCard';
import { COLORS, SIZES } from '../../src/constants/theme';
import { formatDate, formatDisplayDate } from '../../src/utils/dateUtils';

// Chinese locale for calendar
LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月','二月','三月','四月','五月','六月',
    '七月','八月','九月','十月','十一月','十二月',
  ],
  monthNamesShort: [
    '1月','2月','3月','4月','5月','6月',
    '7月','8月','9月','10月','11月','12月',
  ],
  dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
  dayNamesShort: ['日','一','二','三','四','五','六'],
  today: '今天',
};
LocaleConfig.defaultLocale = 'zh';

export default function CalendarScreen() {
  const { records, markedDates } = useRecordStore();
  const [selectedDate, setSelectedDate] = useState(formatDate());

  const marks = useMemo(() => {
    const base = markedDates();
    const result: Record<string, any> = { ...base };
    // Highlight selected date
    result[selectedDate] = {
      ...(result[selectedDate] || {}),
      selected: true,
      selectedColor: COLORS.primary,
    };
    return result;
  }, [records, selectedDate]);

  const dayRecords = useMemo(
    () => records.filter((r) => r.date === selectedDate),
    [records, selectedDate]
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <Calendar
        markedDates={marks}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.card,
          todayTextColor: COLORS.primary,
          selectedDayBackgroundColor: COLORS.primary,
          arrowColor: COLORS.primary,
          dotColor: COLORS.primary,
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '600',
        }}
        style={s.calendar}
      />

      <View style={s.dayHeader}>
        <Text style={s.dayTitle}>{formatDisplayDate(selectedDate)}</Text>
        <Text style={s.dayCount}>
          {dayRecords.length > 0 ? `${dayRecords.length} 条记录` : '无记录'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.list}>
        {dayRecords.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>这天没有记录</Text>
          </View>
        ) : (
          dayRecords.map((r) => <RecordCard key={r.id} record={r} />)
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.background,
  },
  dayTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  dayCount: { fontSize: 13, color: COLORS.textSecondary },
  list: { paddingHorizontal: SIZES.md, paddingTop: SIZES.sm },
  empty: { paddingVertical: SIZES.xl, alignItems: 'center' },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
});
