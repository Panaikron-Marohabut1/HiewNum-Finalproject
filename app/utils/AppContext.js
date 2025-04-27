import React, { createContext, useState, useEffect, useContext } from 'react';
import { CONTAINER_SIZES, DEFAULT_GOAL, UNITS } from '../constants/water';
import * as Storage from './storage';
import moment from 'moment';

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // User settings state
  const [waterGoal, setWaterGoal] = useState(DEFAULT_GOAL.DEFAULT);
  const [unit, setUnit] = useState(UNITS.ML);
  const [containers, setContainers] = useState(CONTAINER_SIZES);
  const [reminders, setReminders] = useState({
    enabled: true,
    startTime: '08:00',
    endTime: '22:00',
    frequency: 60, // minutes
  });

  // Water tracking state
  const [todayWater, setTodayWater] = useState({ total: 0, entries: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Load all user data from storage
  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load settings
      const settings = await Storage.getSettings();
      if (settings) {
        setWaterGoal(settings.waterGoal || DEFAULT_GOAL.DEFAULT);
        setUnit(settings.unit || UNITS.ML);
      }

      // Load containers
      const savedContainers = await Storage.getContainers();
      if (savedContainers) {
        setContainers(savedContainers);
      }

      // Load reminders
      const savedReminders = await Storage.getReminders();
      if (savedReminders) {
        setReminders(savedReminders);
      }

      // Load today's water intake
      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      // Load weekly data
      const weekly = await Storage.getWaterHistoryDays(7);
      setWeeklyData(weekly);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update water goal and save
  const updateWaterGoal = async (newGoal) => {
    setWaterGoal(newGoal);
    await Storage.saveSettings({ waterGoal: newGoal, unit: UNITS.ML });
  };

  // Update measurement unit and save - Not used anymore, always ML
  const updateUnit = async (newUnit) => {
    // Do nothing, we only use ML now
    console.log('Units can only be ML');
  };

  // Update container presets and save
  const updateContainers = async (newContainers) => {
    setContainers(newContainers);
    await Storage.saveContainers(newContainers);
  };

  // Update reminder settings and save
  const updateReminders = async (newReminders) => {
    setReminders(newReminders);
    await Storage.saveReminders(newReminders);
  };

  // Add water intake
  const addWaterIntake = async (amount) => {
    const success = await Storage.saveWaterIntake(amount);
    if (success) {
      // Reload today's data
      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      // Reload weekly data if needed
      if (weeklyData.length === 0 || weeklyData[0].date === moment().format('YYYY-MM-DD')) {
        const weekly = await Storage.getWaterHistoryDays(7);
        setWeeklyData(weekly);
      } else {
        // Just update today's entry in the weekly data
        const updatedWeekly = [...weeklyData];
        const todayIndex = updatedWeekly.findIndex(
          item => item.date === moment().format('YYYY-MM-DD')
        );
        if (todayIndex >= 0) {
          updatedWeekly[todayIndex] = today;
          setWeeklyData(updatedWeekly);
        }
      }
    }
    return success;
  };

  // Delete water entry
  const deleteWaterEntry = async (entry) => {
    const success = await Storage.deleteWaterEntry(entry);
    if (success) {
      // Reload today's data
      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      // Update weekly data if needed
      if (weeklyData.length > 0) {
        const updatedWeekly = [...weeklyData];
        const todayIndex = updatedWeekly.findIndex(
          item => item.date === moment().format('YYYY-MM-DD')
        );
        if (todayIndex >= 0) {
          updatedWeekly[todayIndex] = today;
          setWeeklyData(updatedWeekly);
        }
      }
    }
    return success;
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return Math.min(100, Math.round((todayWater.total / waterGoal) * 100));
  };

  // Context value
  const contextValue = {
    // Settings
    waterGoal,
    unit,
    containers,
    reminders,
    updateWaterGoal,
    updateUnit,
    updateContainers,
    updateReminders,

    // Water tracking
    todayWater,
    weeklyData,
    addWaterIntake,
    deleteWaterEntry,
    getProgressPercentage,
    
    // App state
    loading,
    refreshData: loadAllData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 