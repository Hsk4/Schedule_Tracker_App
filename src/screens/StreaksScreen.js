import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import { HABITS, getDateKey } from '../data/schedule';

function getStreak(habitMap) {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const k = getDateKey(-i);
    if (habitMap[k]) streak++;
    else break;
  }
  return streak;
}

function getLast7(habitMap) {
  return Array.from({ length: 7 }, (_, i) => {
    const k = getDateKey(-(6 - i));
    return { key: k, done: !!habitMap[k], isToday: i === 6 };
  });
}

export default function StreaksScreen() {
  const { state } = useApp();
  const [, forceUpdate] = React.useState(0);
  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  let bestStreak = 0, bestName = '';
  HABITS.forEach(h => {
    const s = getStreak(state.habits[h.id] || {});
    if (s > bestStreak) { bestStreak = s; bestName = h.name; }
  });

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Habit streaks</Text>
        <View style={s.grid}>
          {HABITS.map(h => {
            const map = state.habits[h.id] || {};
            const streak = getStreak(map);
            const last7 = getLast7(map);
            return (
              <View key={h.id} style={s.card}>
                <View style={s.cardTop}>
                  <View>
                    <Text style={s.habitName}>{h.name}</Text>
                    <Text style={s.streakLabel}>day streak</Text>
                  </View>
                  <Text style={s.emoji}>{h.emoji}</Text>
                </View>
                <Text style={[s.streakNum, { color: h.color }]}>{streak}</Text>
                <View style={s.dots}>
                  {last7.map((day, i) => (
                    <View
                      key={i}
                      style={[
                        s.dot,
                        day.done ? { backgroundColor: h.color } : day.isToday ? { backgroundColor: COLORS.bg4, borderWidth: 1.5, borderColor: h.color } : { backgroundColor: COLORS.bg4 }
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
        <View style={s.bestCard}>
          <Text style={s.bestLabel}>🏆 Best current streak</Text>
          <Text style={s.bestVal}>{bestStreak > 0 ? `${bestName} · ${bestStreak} days` : 'Start your first streak!'}</Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },
  sectionTitle: { color: COLORS.text2, fontSize: 11, fontFamily: 'Courier New', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47.5%', backgroundColor: COLORS.bg2, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  habitName: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  streakLabel: { color: COLORS.text3, fontSize: 10, marginTop: 2 },
  emoji: { fontSize: 22 },
  streakNum: { fontSize: 32, fontWeight: '700', fontFamily: 'Courier New', marginBottom: 10 },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 13, height: 13, borderRadius: 3 },
  bestCard: { marginTop: 20, backgroundColor: COLORS.bg2, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  bestLabel: { color: COLORS.text3, fontSize: 12, marginBottom: 6 },
  bestVal: { color: COLORS.accent2, fontSize: 15, fontWeight: '600' },
});
