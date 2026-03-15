import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import TodayScreen from './src/screens/TodayScreen';
import StreaksScreen from './src/screens/StreaksScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import WeekScreen from './src/screens/WeekScreen';
import { AppContext } from './src/context/AppContext';
import { scheduleAllReminders } from './src/utils/notifications';
import { COLORS } from './src/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

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
  const [state, setState] = useState({
    dayBlocks: {},
    habits: {},
    prepItems: {},
    customTasks: [],
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState();
    requestNotifPermission();
  }, []);

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem('strkos_state');
      if (saved) setState(JSON.parse(saved));
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
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') scheduleAllReminders();
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{ state, saveState }}>
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
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Today: focused ? 'today' : 'today-outline',
                Streaks: focused ? 'flame' : 'flame-outline',
                Checklist: focused ? 'checkbox' : 'checkbox-outline',
                Week: focused ? 'calendar' : 'calendar-outline',
              };
              return <Ionicons name={icons[route.name]} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Today" component={TodayScreen} options={{ title: 'STRK_OS' }} />
          <Tab.Screen name="Streaks" component={StreaksScreen} />
          <Tab.Screen name="Checklist" component={ChecklistScreen} />
          <Tab.Screen name="Week" component={WeekScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
