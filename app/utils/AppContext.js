import React, { createContext, useState, useEffect, useContext } from 'react';
import { CONTAINER_SIZES, DEFAULT_GOAL, UNITS } from '../constants/water';
import * as Storage from './storage';
import moment from 'moment';
import { scheduleFixedReminders } from './notification';

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // User settings state
  const [waterGoal, setWaterGoal] = useState(DEFAULT_GOAL.DEFAULT);
  const [unit, setUnit] = useState(UNITS.ML);
  const [containers, setContainers] = useState(CONTAINER_SIZES);
  const [reminders, setReminders] = useState({ enabled: true });

  // Water tracking state
  const [todayWater, setTodayWater] = useState({ total: 0, entries: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Update notifications when reminders change
  useEffect(() => {
    scheduleFixedReminders(reminders.enabled);
  }, [reminders.enabled]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const settings = await Storage.getSettings();
      if (settings) {
        setWaterGoal(settings.waterGoal || DEFAULT_GOAL.DEFAULT);
        setUnit(settings.unit || UNITS.ML);
      }

      const savedContainers = await Storage.getContainers();
      if (savedContainers) {
        setContainers(savedContainers);
      }

      const savedReminders = await Storage.getReminders();
      if (savedReminders) {
        setReminders(savedReminders);
      }

      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      const weekly = await Storage.getWaterHistoryDays(7);
      setWeeklyData(weekly);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWaterGoal = async (newGoal) => {
    setWaterGoal(newGoal);
    await Storage.saveSettings({ waterGoal: newGoal, unit: UNITS.ML });
  };

  const updateUnit = async () => {
    console.log('Units can only be ML');
  };

  const updateContainers = async (newContainers) => {
    setContainers(newContainers);
    await Storage.saveContainers(newContainers);
  };

  const updateReminders = async (newReminders) => {
    const updatedReminders = { ...reminders, ...newReminders };
    setReminders(updatedReminders);
    await Storage.saveReminders(updatedReminders);
  };

  const addWaterIntake = async (amount) => {
    const success = await Storage.saveWaterIntake(amount);
    if (success) {
      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      if (weeklyData.length === 0 || weeklyData[0].date === moment().format('YYYY-MM-DD')) {
        const weekly = await Storage.getWaterHistoryDays(7);
        setWeeklyData(weekly);
      } else {
        const updatedWeekly = [...weeklyData];
        const todayIndex = updatedWeekly.findIndex(
          (item) => item.date === moment().format('YYYY-MM-DD')
        );
        if (todayIndex >= 0) {
          updatedWeekly[todayIndex] = today;
          setWeeklyData(updatedWeekly);
        }
      }
    }
    return success;
  };

  const deleteWaterEntry = async (entry) => {
    const success = await Storage.deleteWaterEntry(entry);
    if (success) {
      const today = await Storage.getWaterIntakeForDate();
      setTodayWater(today);

      if (weeklyData.length > 0) {
        const updatedWeekly = [...weeklyData];
        const todayIndex = updatedWeekly.findIndex(
          (item) => item.date === moment().format('YYYY-MM-DD')
        );
        if (todayIndex >= 0) {
          updatedWeekly[todayIndex] = today;
          setWeeklyData(updatedWeekly);
        }
      }
    }
    return success;
  };

  const getProgressPercentage = () => {
    return Math.min(100, Math.round((todayWater.total / waterGoal) * 100));
  };

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
