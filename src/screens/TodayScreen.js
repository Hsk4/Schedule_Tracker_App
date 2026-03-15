import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import {
  getDateKey, getSchedule, isWeekend,
  getSectionForTime, DAYS, MONTHS, HABITS
} from '../data/schedule';

export default function TodayScreen() {
  const { state, saveState } = useApp();
  const [offset, setOffset] = useState(0);
  const [, forceUpdate] = useState(0);

  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  const dateKey = getDateKey(offset);
  const schedule = getSchedule(offset);
  const blocks = state.dayBlocks[dateKey] || {};
  const doneCount = Object.keys(blocks).length;
  const pct = schedule.length > 0 ? Math.round((doneCount / schedule.length) * 100) : 0;

  const d = new Date();
  d.setDate(d.getDate() + offset);
  const dayLabel = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : offset === -1 ? 'Yesterday' : DAYS[d.getDay()];
  const dateLabel = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;

  const toggleBlock = (blockId, blockIdx) => {
    const newDayBlocks = { ...state.dayBlocks };
    if (!newDayBlocks[dateKey]) newDayBlocks[dateKey] = {};
    const cur = { ...newDayBlocks[dateKey] };
    const done = !cur[blockId];
    if (done) cur[blockId] = 1;
    else delete cur[blockId];
    newDayBlocks[dateKey] = cur;

    // Update habit
    const block = schedule[blockIdx];
    const newHabits = { ...state.habits };
    if (block?.habit) {
      if (!newHabits[block.habit]) newHabits[block.habit] = {};
      const hMap = { ...newHabits[block.habit] };
      if (done) hMap[dateKey] = 1;
      else delete hMap[dateKey];
      newHabits[block.habit] = hMap;
    }

    saveState({ ...state, dayBlocks: newDayBlocks, habits: newHabits });
  };

  // Group by section
  let lastSection = '';
  const rows = [];
  schedule.forEach((block, i) => {
    const section = getSectionForTime(block.time);
    if (section !== lastSection) {
      rows.push({ type: 'section', label: section, key: 'sec_' + i });
      lastSection = section;
    }
    rows.push({ type: 'block', block, idx: i });
  });

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.dayNav}>
        <TouchableOpacity style={s.navBtn} onPress={() => setOffset(o => o - 1)}>
          <Text style={s.navArrow}>‹</Text>
        </TouchableOpacity>
        <View style={s.dayInfo}>
          <Text style={s.dayLabel}>{dayLabel}</Text>
          <Text style={s.dateLabel}>{dateLabel}</Text>
        </View>
        <TouchableOpacity style={s.navBtn} onPress={() => setOffset(o => o + 1)}>
          <Text style={s.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={s.progressRow}>
        <Text style={s.progressText}>{doneCount}/{schedule.length} · {pct}%</Text>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${pct}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {rows.map(row => {
          if (row.type === 'section') {
            return <Text key={row.key} style={s.sectionLabel}>{row.label}</Text>;
          }
          const { block, idx } = row;
          const done = !!blocks[block.id];
          return (
            <TouchableOpacity
              key={block.id}
              style={s.timeRow}
              onPress={() => toggleBlock(block.id, idx)}
              activeOpacity={0.75}
            >
              <Text style={s.timeLabel}>{block.time}</Text>
              <View style={s.timeLineWrap}>
                <View style={s.timeLine} />
                <View style={[s.timeDot, done && { backgroundColor: block.color, borderColor: block.color }]} />
              </View>
              <View style={[s.blockCard, { borderColor: block.color + '44' }, done && s.blockDone]}>
                <View style={[s.blockColorBar, { backgroundColor: block.color }]} />
                <View style={s.blockBody}>
                  <View style={s.blockTop}>
                    <Text style={s.blockIcon}>{block.icon}</Text>
                    <Text style={[s.blockTitle, done && s.strikethru]}>{block.label}</Text>
                    <View style={[s.checkbox, done && { backgroundColor: block.color, borderColor: block.color }]}>
                      {done && <Text style={s.checkmark}>✓</Text>}
                    </View>
                  </View>
                  {!!block.sub && <Text style={s.blockSub}>{block.sub}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  dayNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.bg2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  navBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border2 },
  navArrow: { color: COLORS.text2, fontSize: 22, fontWeight: '300' },
  dayInfo: { flex: 1, alignItems: 'center' },
  dayLabel: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  dateLabel: { color: COLORS.text3, fontSize: 11, fontFamily: 'Courier New', marginTop: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.bg2, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  progressText: { color: COLORS.text3, fontSize: 11, fontFamily: 'Courier New', minWidth: 70 },
  progressTrack: { flex: 1, height: 5, backgroundColor: COLORS.bg4, borderRadius: 99 },
  progressFill: { height: 5, borderRadius: 99, backgroundColor: COLORS.accent },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  sectionLabel: { color: COLORS.text3, fontSize: 10, fontFamily: 'Courier New', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 16, marginBottom: 6, marginLeft: 52 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, minHeight: 58 },
  timeLabel: { width: 42, color: COLORS.text3, fontSize: 11, fontFamily: 'Courier New', paddingTop: 10, textAlign: 'right' },
  timeLineWrap: { width: 20, alignItems: 'center', paddingTop: 6 },
  timeLine: { position: 'absolute', top: 0, bottom: -8, width: 1, backgroundColor: COLORS.border },
  timeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.bg4, borderWidth: 1.5, borderColor: COLORS.border2, marginTop: 6 },
  blockCard: { flex: 1, marginLeft: 10, borderRadius: 10, borderWidth: 1, flexDirection: 'row', overflow: 'hidden', backgroundColor: COLORS.bg2 },
  blockColorBar: { width: 3, borderRadius: 0 },
  blockBody: { flex: 1, padding: 10 },
  blockTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  blockIcon: { fontSize: 15 },
  blockTitle: { flex: 1, color: COLORS.text, fontSize: 14, fontWeight: '600' },
  blockSub: { color: COLORS.text3, fontSize: 11, marginTop: 3, marginLeft: 2 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: COLORS.border2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#000', fontSize: 11, fontWeight: '700' },
  blockDone: { opacity: 0.45 },
  strikethru: { textDecorationLine: 'line-through' },
});
