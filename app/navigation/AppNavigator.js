import React from 'react';
import { View, Platform, Dimensions } from 'react-native';
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
const { width } = Dimensions.get('window');

// Custom Tab Button Component
const CustomTabIcon = ({ focused, icon, label }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: width / 4,
      height: 50,
    }}>
      <View style={{
        backgroundColor: focused ? COLORS.primary + '15' : 'transparent',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MaterialCommunityIcons
          name={icon}
          size={28}  // เพิ่มขนาดไอคอนจาก 22 เป็น 26
          color={focused ? COLORS.primary : COLORS.grey}
        />
      </View>
    </View>
  );
};

const AppNavigator = () => {
  const isIOS = Platform.OS === 'ios';
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.grey,
          tabBarLabelStyle: {
            ...FONTS.medium,
            fontSize: 12,
            marginTop: 4,  // เพิ่มระยะห่างระหว่างไอคอนและข้อความ
            marginBottom: isIOS ? 2 : 4,
          },
          tabBarStyle: {
            height: isIOS ? 85 : 70,  // เพิ่มความสูงเพื่อรองรับไอคอนที่ใหญ่ขึ้น
            backgroundColor: COLORS.white,
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingHorizontal: 10,
            paddingBottom: isIOS ? 25 : 8,
            paddingTop: 10,  // เพิ่มระยะห่างด้านบน
          },
          headerShown: false,
          tabBarAllowFontScaling: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                icon="home"
                label="Home"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                icon="chart-line"
                label="Stats"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Tips"
          component={TipsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                icon="lightbulb-outline"
                label="Tips"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                icon="cog"
                label="Settings"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;