import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function BrandLogo({ compact = false }) {
  return (
    <View style={[s.wrap, compact && s.wrapCompact]}>
      <View style={s.iconWrap}>
        <Ionicons name="flash" size={14} color={COLORS.bg} />
      </View>
      <View>
        <Text style={s.title}>STRK_OS</Text>
        {!compact && <Text style={s.subtitle}>DISCIPLINE ENGINE</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wrapCompact: { gap: 6 },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: COLORS.text, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  subtitle: { color: COLORS.text3, fontSize: 9, letterSpacing: 1.2, marginTop: 1 },
});
