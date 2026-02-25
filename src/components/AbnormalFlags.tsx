import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ABNORMAL_FLAGS } from '../constants/options';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  value: string[];
  onChange: (flags: string[]) => void;
}

export default function AbnormalFlags({ value, onChange }: Props) {
  const toggle = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <View style={s.wrap}>
      {ABNORMAL_FLAGS.map((f) => {
        const selected = value.includes(f.key);
        const borderColor =
          f.severity === 'high'
            ? COLORS.danger
            : f.severity === 'medium'
            ? COLORS.warning
            : COLORS.primary;
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => toggle(f.key)}
            style={[
              s.tag,
              selected && { backgroundColor: borderColor, borderColor },
            ]}
            activeOpacity={0.7}
          >
            <Text style={s.emoji}>{f.emoji}</Text>
            <Text style={[s.label, selected && { color: '#FFF' }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: 4,
  },
  emoji: { fontSize: 14 },
  label: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
});
