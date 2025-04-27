import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './app/utils/AppContext';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
      <StatusBar style="auto" />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
