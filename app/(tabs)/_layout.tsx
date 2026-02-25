import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '../../src/constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '主页',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
