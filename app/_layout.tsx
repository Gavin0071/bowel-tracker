import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { getDB } from '../src/db/schema';
import { useRecordStore } from '../src/store/recordStore';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  const loadAll = useRecordStore((s) => s.loadAll);

  useEffect(() => {
    // Initialize DB then load records
    getDB().then(() => loadAll()).catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="record/index"
          options={{
            presentation: 'modal',
            title: '新增记录',
            headerStyle: { backgroundColor: COLORS.card },
            headerTintColor: COLORS.primary,
          }}
        />
        <Stack.Screen
          name="record/[id]"
          options={{
            presentation: 'modal',
            title: '编辑记录',
            headerStyle: { backgroundColor: COLORS.card },
            headerTintColor: COLORS.primary,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
