import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TipsScreen from '../screens/TipsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.grey,
          tabBarLabelStyle: {
            ...FONTS.regular,
            fontSize: 12,
            marginBottom: 5,
          },
          tabBarStyle: {
            height: 60,
            paddingTop: 5,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Tips"
          component={TipsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lightbulb-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 