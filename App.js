import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import TodayScreen from './src/screens/TodayScreen';
import StreaksScreen from './src/screens/StreaksScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import WeekScreen from './src/screens/WeekScreen';
import ControlCenterScreen from './src/screens/ControlCenterScreen';
import { AppContext } from './src/context/AppContext';
import BrandLogo from './src/components/BrandLogo';
import {
  scheduleAllReminders,
  getNotificationPermissionStatus,
  requestNotificationPermissions,
} from './src/utils/notifications';
import { COLORS } from './src/theme';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const Tab = createBottomTabNavigator();

const DEFAULT_STATE = {
  dayBlocks: {},
  habits: {},
  prepItems: {},
  customTasks: [],
  settings: {
    notificationsEnabled: true,
    notificationPermission: 'unknown',
    lastNotificationSync: null,
  },
};

function migrateState(savedState) {
  if (!savedState) return DEFAULT_STATE;
  return {
    ...DEFAULT_STATE,
    ...savedState,
    settings: {
      ...DEFAULT_STATE.settings,
      ...(savedState.settings || {}),
    },
  };
}

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.bg,
    card: COLORS.bg2,
    border: COLORS.border,
    text: COLORS.text,
  },
};

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    requestNotifPermission();
  }, [loaded, state.settings.notificationsEnabled]);

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem('strkos_state');
      if (saved) {
        setState(migrateState(JSON.parse(saved)));
      }
    } catch (e) {}
    setLoaded(true);
  };

  const saveState = async (newState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem('strkos_state', JSON.stringify(newState));
    } catch (e) {}
  };

  const requestNotifPermission = async () => {
    if (Platform.OS === 'web') return;

    let status = await getNotificationPermissionStatus();
    if (status !== 'granted' && state.settings.notificationsEnabled) {
      status = await requestNotificationPermissions();
    }

    if (status === 'granted' && state.settings.notificationsEnabled) {
      await scheduleAllReminders();
      const newState = {
        ...state,
        settings: {
          ...state.settings,
          notificationPermission: status,
          lastNotificationSync: new Date().toISOString(),
        },
      };
      saveState(newState);
      return;
    }

    const newState = {
      ...state,
      settings: {
        ...state.settings,
        notificationPermission: status,
      },
    };
    saveState(newState);
  };

  const updateSettings = (patch) => {
    const next = {
      ...state,
      settings: {
        ...state.settings,
        ...patch,
      },
    };
    saveState(next);
  };

  if (!loaded) {
    return (
      <View style={s.loaderWrap}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ state, saveState, updateSettings }}>
      <NavigationContainer theme={NavTheme}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: COLORS.bg2, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
            headerTintColor: COLORS.text,
            headerTitleStyle: { fontWeight: '700', fontSize: 16, letterSpacing: 1 },
            tabBarStyle: { backgroundColor: COLORS.bg2, borderTopColor: COLORS.border, borderTopWidth: 1, height: 60, paddingBottom: 8 },
            tabBarActiveTintColor: COLORS.accent,
            tabBarInactiveTintColor: COLORS.text3,
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            headerTitle: route.name === 'Today'
              ? () => <BrandLogo compact />
              : undefined,
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Today: focused ? 'today' : 'today-outline',
                Streaks: focused ? 'flame' : 'flame-outline',
                Checklist: focused ? 'checkbox' : 'checkbox-outline',
                Week: focused ? 'calendar' : 'calendar-outline',
                Control: focused ? 'settings' : 'settings-outline',
              };
              return <Ionicons name={icons[route.name]} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Today" component={TodayScreen} options={{ title: 'STRK_OS' }} />
          <Tab.Screen name="Streaks" component={StreaksScreen} />
          <Tab.Screen name="Checklist" component={ChecklistScreen} />
          <Tab.Screen name="Week" component={WeekScreen} />
          <Tab.Screen name="Control" component={ControlCenterScreen} options={{ title: 'Control Center' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const s = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
