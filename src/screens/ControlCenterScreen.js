import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import BrandLogo from '../components/BrandLogo';
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  scheduleAllReminders,
  cancelAllReminders,
  sendTestNotification,
} from '../utils/notifications';

export default function ControlCenterScreen() {
  const { state, updateSettings } = useApp();
  const [busy, setBusy] = useState(false);
  const [permission, setPermission] = useState('unknown');
  const [lastAction, setLastAction] = useState('No actions yet.');

  const refreshPermission = async () => {
    const next = await getNotificationPermissionStatus();
    setPermission(next);
    return next;
  };

  React.useEffect(() => {
    refreshPermission();
  }, []);

  const onRequestPermission = async () => {
    setBusy(true);
    const status = await requestNotificationPermissions();
    setPermission(status);
    setLastAction(`Permission status: ${status}`);
    setBusy(false);
  };

  const onApplyNotifications = async (enabled) => {
    updateSettings({ notificationsEnabled: enabled, notificationPermission: permission });
    if (Platform.OS === 'web') {
      setLastAction('Desktop web mode: local reminders are disabled.');
      return;
    }

    setBusy(true);
    if (enabled) {
      const status = await refreshPermission();
      if (status !== 'granted') {
        const requested = await requestNotificationPermissions();
        setPermission(requested);
        if (requested !== 'granted') {
          updateSettings({ notificationsEnabled: false, notificationPermission: requested });
          setLastAction('Permission not granted. Notifications remain off.');
          setBusy(false);
          return;
        }
      }
      const result = await scheduleAllReminders();
      updateSettings({
        notificationsEnabled: true,
        notificationPermission: 'granted',
        lastNotificationSync: new Date().toISOString(),
      });
      setLastAction(`Scheduled ${result.count} reminders.`);
      setBusy(false);
      return;
    }

    await cancelAllReminders();
    setLastAction('All scheduled reminders cancelled.');
    setBusy(false);
  };

  const onSendTest = async () => {
    setBusy(true);
    const result = await sendTestNotification();
    setLastAction(result.ok ? 'Test notification sent.' : result.message);
    setBusy(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.brandCard}>
          <BrandLogo />
          <Text style={s.brandDesc}>A focused personal operations system with persistent habits, daily execution, and intelligent reminders.</Text>
        </View>

        <Text style={s.sectionTitle}>Notification Center</Text>
        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Enable Smart Reminders</Text>
              <Text style={s.helper}>Schedules your daily routine reminders automatically.</Text>
            </View>
            <Switch
              value={!!state.settings?.notificationsEnabled}
              onValueChange={onApplyNotifications}
              trackColor={{ false: COLORS.bg4, true: COLORS.accDim }}
              thumbColor={state.settings?.notificationsEnabled ? COLORS.accent : COLORS.text3}
            />
          </View>

          <View style={s.metaRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.accent2} />
            <Text style={s.metaText}>Permission: {permission}</Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={onRequestPermission} disabled={busy}>
              <Text style={s.btnSecondaryText}>{busy ? 'Working...' : 'Request Permission'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btn} onPress={onSendTest} disabled={busy}>
              <Text style={s.btnText}>{busy ? 'Working...' : 'Send Test'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.sectionTitle}>Operations</Text>
        <View style={s.card}>
          <View style={s.metaRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.accent2} />
            <Text style={s.metaText}>Last Sync: {state.settings?.lastNotificationSync || 'Never'}</Text>
          </View>
          <View style={s.metaRow}>
            <Ionicons name="desktop-outline" size={16} color={COLORS.accent2} />
            <Text style={s.metaText}>Platform: {Platform.OS}</Text>
          </View>
          <Text style={s.lastAction}>Last Action: {lastAction}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 28 },
  brandCard: { backgroundColor: COLORS.bg2, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 18 },
  brandDesc: { color: COLORS.text2, fontSize: 12, lineHeight: 18, marginTop: 10 },
  sectionTitle: { color: COLORS.text2, fontSize: 11, fontFamily: 'Courier New', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  card: { backgroundColor: COLORS.bg2, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 18 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  helper: { color: COLORS.text3, fontSize: 12, marginTop: 4, maxWidth: 230 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  metaText: { color: COLORS.text2, fontSize: 12, flex: 1 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, borderRadius: 9, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  btnSecondary: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border2 },
  btnSecondaryText: { color: COLORS.text, fontWeight: '600', fontSize: 12 },
  lastAction: { color: COLORS.accent2, marginTop: 12, fontSize: 12 },
});
