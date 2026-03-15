import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import { PREP_ITEMS } from '../data/schedule';

export default function ChecklistScreen() {
  const { state, saveState } = useApp();
  const [taskInput, setTaskInput] = useState('');
  const [, forceUpdate] = useState(0);
  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  const togglePrep = (i) => {
    const newPrep = { ...state.prepItems };
    newPrep['prep_' + i] = !newPrep['prep_' + i];
    saveState({ ...state, prepItems: newPrep });
  };

  const toggleCustom = (i) => {
    const tasks = [...state.customTasks];
    tasks[i] = { ...tasks[i], done: !tasks[i].done };
    saveState({ ...state, customTasks: tasks });
  };

  const deleteCustom = (i) => {
    const tasks = state.customTasks.filter((_, idx) => idx !== i);
    saveState({ ...state, customTasks: tasks });
  };

  const addTask = () => {
    const val = taskInput.trim();
    if (!val) return;
    const tasks = [...state.customTasks, { text: val, done: false }];
    saveState({ ...state, customTasks: tasks });
    setTaskInput('');
  };

  const prepDone = PREP_ITEMS.filter((_, i) => state.prepItems['prep_' + i]).length;
  const customDone = state.customTasks.filter(t => t.done).length;

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Tonight's prep (11pm–midnight)</Text>
              <Text style={s.sectionCount}>{prepDone}/{PREP_ITEMS.length}</Text>
            </View>
            {PREP_ITEMS.map((item, i) => {
              const done = !!state.prepItems['prep_' + i];
              return (
                <TouchableOpacity key={i} style={s.clItem} onPress={() => togglePrep(i)} activeOpacity={0.7}>
                  <View style={[s.cb, done && s.cbDone]}>
                    {done && <Text style={s.cbCheck}>✓</Text>}
                  </View>
                  <Text style={[s.clText, done && s.clDone]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Custom tasks</Text>
              <Text style={s.sectionCount}>{customDone}/{state.customTasks.length}</Text>
            </View>
            {state.customTasks.length === 0 && (
              <Text style={s.emptyText}>No custom tasks yet. Add one below.</Text>
            )}
            {state.customTasks.map((task, i) => (
              <TouchableOpacity key={i} style={s.clItem} onPress={() => toggleCustom(i)} activeOpacity={0.7}>
                <View style={[s.cb, task.done && s.cbDone]}>
                  {task.done && <Text style={s.cbCheck}>✓</Text>}
                </View>
                <Text style={[s.clText, task.done && s.clDone]}>{task.text}</Text>
                <TouchableOpacity onPress={() => deleteCustom(i)} style={s.deleteBtn}>
                  <Text style={s.deleteX}>×</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <View style={s.addRow}>
              <TextInput
                style={s.input}
                value={taskInput}
                onChangeText={setTaskInput}
                placeholder="Add a task..."
                placeholderTextColor={COLORS.text3}
                onSubmitEditing={addTask}
                returnKeyType="done"
              />
              <TouchableOpacity style={s.addBtn} onPress={addTask}>
                <Text style={s.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: COLORS.text2, fontSize: 11, fontFamily: 'Courier New', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionCount: { color: COLORS.accent, fontSize: 12, fontFamily: 'Courier New' },
  clItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  cb: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: COLORS.border2, alignItems: 'center', justifyContent: 'center' },
  cbDone: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  cbCheck: { color: '#fff', fontSize: 12, fontWeight: '700' },
  clText: { flex: 1, color: COLORS.text, fontSize: 14 },
  clDone: { textDecorationLine: 'line-through', color: COLORS.text3 },
  deleteBtn: { padding: 4 },
  deleteX: { color: COLORS.text3, fontSize: 18, lineHeight: 18 },
  emptyText: { color: COLORS.text3, fontSize: 13, fontStyle: 'italic', paddingVertical: 12 },
  addRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  input: { flex: 1, backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.text, fontSize: 14 },
  addBtn: { backgroundColor: COLORS.accent, borderRadius: 8, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
