import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import { HABITS, DAYS, MONTHS, getDateKey } from '../data/schedule';

export default function WeekScreen() {
  const { state } = useApp();
  const [, forceUpdate] = React.useState(0);
  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  const today = new Date();
  const todayKey = getDateKey(0);

  // Build this week (Mon–Sun)
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    const diff = i - today.getDay();
    d.setDate(d.getDate() + diff);
    const key = d.toISOString().slice(0, 10);
    const habitDots = HABITS.map(h => ({
      color: h.color,
      done: !!(state.habits[h.id] && state.habits[h.id][key]),
    }));
    weekDays.push({ d, key, isToday: key === todayKey, dayName: DAYS[d.getDay()], date: d.getDate(), habitDots });
  }

  // Weekly stats
  let totalDone = 0, totalPossible = 0, activeDays = 0;
  weekDays.forEach(({ key, habitDots }) => {
    const dayDone = habitDots.filter(h => h.done).length;
    totalDone += dayDone;
    totalPossible += HABITS.length;
    if (dayDone >= 3) activeDays++;
  });
  const pct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  // Overall streak
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const k = getDateKey(-i);
    let cnt = 0;
    HABITS.forEach(h => { if (state.habits[h.id]?.[k]) cnt++; });
    if (cnt >= 3) streak++;
    else break;
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>This week</Text>

        <View style={s.weekRow}>
          {weekDays.map(({ key, isToday, dayName, date, habitDots }) => (
            <View key={key} style={[s.dayCell, isToday && s.dayCellToday]}>
              <Text style={[s.dayName, isToday && s.dayNameToday]}>{dayName}</Text>
              <Text style={[s.dayNum, isToday && s.dayNumToday]}>{date}</Text>
              <View style={s.dotGrid}>
                {habitDots.map((h, i) => (
                  <View key={i} style={[s.dot, { backgroundColor: h.done ? h.color : COLORS.bg4 }]} />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={s.legend}>
          {HABITS.map(h => (
            <View key={h.id} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: h.color }]} />
              <Text style={s.legendText}>{h.name}</Text>
            </View>
          ))}
        </View>

        <Text style={[s.sectionTitle, { marginTop: 20 }]}>Weekly stats</Text>
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statVal}>{pct}%</Text>
            <Text style={s.statLabel}>Habit rate</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>{totalDone}</Text>
            <Text style={s.statLabel}>Completed</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>{streak}d</Text>
            <Text style={s.statLabel}>Active streak</Text>
          </View>
        </View>

        <Text style={[s.sectionTitle, { marginTop: 20 }]}>Your goals</Text>
        {[
          { icon: '🌅', text: 'Wake up at 8:00am every day' },
          { icon: '💻', text: 'Code daily — build the future' },
          { icon: '🇯🇵', text: 'Japanese every day — consistency wins' },
          { icon: '✍️', text: 'Novel on weekends — chapter by chapter' },
          { icon: '🥚', text: 'Protein breakfast — fuel for muscle' },
          { icon: '🎮', text: '2–3 hrs play — rest is productive' },
          { icon: '😴', text: 'In bed by midnight — fix the root cause' },
        ].map((g, i) => (
          <View key={i} style={s.goalRow}>
            <Text style={s.goalIcon}>{g.icon}</Text>
            <Text style={s.goalText}>{g.text}</Text>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },
  sectionTitle: { color: COLORS.text2, fontSize: 11, fontFamily: 'Courier New', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  weekRow: { flexDirection: 'row', gap: 5 },
  dayCell: { flex: 1, backgroundColor: COLORS.bg2, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 8, alignItems: 'center' },
  dayCellToday: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,106,247,0.12)' },
  dayName: { color: COLORS.text3, fontSize: 9, fontFamily: 'Courier New', textTransform: 'uppercase', marginBottom: 4 },
  dayNameToday: { color: COLORS.accent },
  dayNum: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  dayNumToday: { color: COLORS.accent2 },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 2 },
  legendText: { color: COLORS.text2, fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.bg2, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 14, alignItems: 'center' },
  statVal: { color: COLORS.accent2, fontSize: 26, fontWeight: '700', fontFamily: 'Courier New' },
  statLabel: { color: COLORS.text3, fontSize: 11, marginTop: 4, textAlign: 'center' },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  goalIcon: { fontSize: 18 },
  goalText: { color: COLORS.text2, fontSize: 13, flex: 1 },
});
