import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { BRISTOL_TYPES, BristolType } from '../constants/bristol';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  value?: number;
  onChange: (type: number) => void;
}

function BristolShape({ type }: { type: number }) {
  if (type === 1) {
    return (
      <View style={s.shapeRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[s.ball, { backgroundColor: '#8B4513' }]} />
        ))}
      </View>
    );
  }
  if (type === 2) {
    return (
      <View style={s.shapeRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              s.bigBall,
              { backgroundColor: '#A0522D', marginHorizontal: 1 },
            ]}
          />
        ))}
      </View>
    );
  }
  if (type === 3) {
    return (
      <View
        style={[
          s.sausage,
          {
            backgroundColor: '#B8860B',
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: '#8B6914',
          },
        ]}
      />
    );
  }
  if (type === 4) {
    return (
      <View
        style={[
          s.sausage,
          { backgroundColor: '#2E7D32', borderRadius: 10 },
        ]}
      />
    );
  }
  if (type === 5) {
    return (
      <View style={s.shapeRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              s.blob,
              {
                backgroundColor: '#DAA520',
                width: i === 2 ? 22 : 18,
                height: i === 2 ? 18 : 14,
              },
            ]}
          />
        ))}
      </View>
    );
  }
  if (type === 6) {
    return (
      <View
        style={[
          s.mushy,
          { backgroundColor: '#E65100', opacity: 0.8 },
        ]}
      />
    );
  }
  // type === 7
  return (
    <View style={s.shapeRow}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 24,
            height: 3,
            backgroundColor: '#C62828',
            borderRadius: 2,
            marginVertical: 3,
          }}
        />
      ))}
    </View>
  );
}

export default function BristolPicker({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scroll}
    >
      {BRISTOL_TYPES.map((bt) => {
        const selected = value === bt.type;
        return (
          <TouchableOpacity
            key={bt.type}
            onPress={() => onChange(bt.type)}
            style={[
              s.card,
              { borderColor: selected ? bt.categoryColor : COLORS.border },
              selected && { backgroundColor: bt.bgColor },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[s.colorStrip, { backgroundColor: bt.categoryColor }]}
            />
            <View style={s.shapeArea}>
              <BristolShape type={bt.type} />
            </View>
            <Text style={[s.typeName, selected && { color: bt.categoryColor }]}>
              {bt.name}
            </Text>
            <Text style={s.typeDesc}>{bt.description}</Text>
            <Text style={[s.typeCat, { color: bt.categoryColor }]}>
              {bt.categoryLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm },
  card: {
    width: 112,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: SIZES.sm,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: SIZES.sm,
  },
  colorStrip: { width: '100%', height: 6, marginBottom: 8 },
  shapeArea: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  typeDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  typeCat: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  shapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 3,
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bigBall: {
    width: 18,
    height: 20,
    borderRadius: 9,
  },
  sausage: {
    width: 72,
    height: 22,
    borderRadius: 11,
  },
  blob: {
    borderRadius: 8,
  },
  mushy: {
    width: 72,
    height: 28,
    borderRadius: 6,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
});
