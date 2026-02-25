import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { STOOL_COLORS } from '../constants/options';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  value?: string;
  onChange: (key: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={s.grid}>
      {STOOL_COLORS.map((c) => {
        const selected = value === c.key;
        return (
          <TouchableOpacity
            key={c.key}
            onPress={() => onChange(c.key)}
            style={[
              s.item,
              selected && { borderColor: COLORS.text, borderWidth: 2 },
            ]}
            activeOpacity={0.7}
          >
            <View style={[s.swatch, { backgroundColor: c.hex }]}>
              {selected && (
                <Text style={s.check}>✓</Text>
              )}
            </View>
            <Text style={s.label}>{c.label}</Text>
            <Text style={s.meaning}>{c.meaning}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  item: {
    width: '30%',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  meaning: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
