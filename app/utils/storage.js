import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Storage keys
const KEYS = {
  WATER_RECORDS: 'watertracker_records',
  SETTINGS: 'watertracker_settings',
  CONTAINERS: 'watertracker_containers',
  REMINDERS: 'watertracker_reminders',
};

// Save water intake record
export const saveWaterIntake = async (amount) => {
  try {
    // Get existing records
    const existingRecordsJson = await AsyncStorage.getItem(KEYS.WATER_RECORDS);
    let records = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];
    
    // Current time
    const timestamp = moment().format();
    const dateKey = moment().format('YYYY-MM-DD');
    
    // Check if there's already a record for today
    const todayIndex = records.findIndex(record => record.date === dateKey);
    
    if (todayIndex >= 0) {
      // Update today's record
      records[todayIndex].entries.push({
        amount,
        timestamp,
      });
      records[todayIndex].total += amount;
    } else {
      // Create new record for today
      records.push({
        date: dateKey,
        entries: [{ amount, timestamp }],
        total: amount,
      });
    }
    
    // Sort records by date (newest first)
    records.sort((a, b) => moment(b.date).diff(moment(a.date)));
    
    // Limit to last 90 days to prevent excessive storage use
    if (records.length > 90) {
      records = records.slice(0, 90);
    }
    
    // Save updated records
    await AsyncStorage.setItem(KEYS.WATER_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error saving water intake:', error);
    return false;
  }
};

// Get water records for a specific date
export const getWaterIntakeForDate = async (date = moment().format('YYYY-MM-DD')) => {
  try {
    const recordsJson = await AsyncStorage.getItem(KEYS.WATER_RECORDS);
    if (!recordsJson) return { total: 0, entries: [] };
    
    const records = JSON.parse(recordsJson);
    const dayRecord = records.find(record => record.date === date);
    
    return dayRecord || { date, total: 0, entries: [] };
  } catch (error) {
    console.error('Error getting water intake for date:', error);
    return { date, total: 0, entries: [] };
  }
};

// Get water records for the past days
export const getWaterHistoryDays = async (days = 7) => {
  try {
    const recordsJson = await AsyncStorage.getItem(KEYS.WATER_RECORDS);
    if (!recordsJson) return [];
    
    const records = JSON.parse(recordsJson);
    
    // Create an array of the last 'days' dates
    const dateRange = Array.from({ length: days }, (_, i) => {
      return moment().subtract(i, 'days').format('YYYY-MM-DD');
    });
    
    // Map each date to its corresponding record or create empty record
    return dateRange.map(date => {
      const existingRecord = records.find(record => record.date === date);
      return existingRecord || { date, total: 0, entries: [] };
    });
  } catch (error) {
    console.error('Error getting water history:', error);
    return [];
  }
};

// Delete water entry
export const deleteWaterEntry = async (entryToDelete) => {
  try {
    // Get existing records
    const existingRecordsJson = await AsyncStorage.getItem(KEYS.WATER_RECORDS);
    if (!existingRecordsJson) return false;
    
    const records = JSON.parse(existingRecordsJson);
    const dateKey = moment().format('YYYY-MM-DD');
    
    // Find today's record
    const todayIndex = records.findIndex(record => record.date === dateKey);
    if (todayIndex < 0) return false;
    
    // Find the entry to delete by timestamp
    const entryIndex = records[todayIndex].entries.findIndex(
      entry => entry.timestamp === entryToDelete.timestamp
    );
    
    if (entryIndex < 0) return false;
    
    // Remove the entry
    const amountToRemove = records[todayIndex].entries[entryIndex].amount;
    records[todayIndex].entries.splice(entryIndex, 1);
    
    // Update total
    records[todayIndex].total -= amountToRemove;
    
    // If no entries left, remove the day record
    if (records[todayIndex].entries.length === 0) {
      records.splice(todayIndex, 1);
    }
    
    // Save updated records
    await AsyncStorage.setItem(KEYS.WATER_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error deleting water entry:', error);
    return false;
  }
};

// Save user settings
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Get user settings
export const getSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

// Save container presets
export const saveContainers = async (containers) => {
  try {
    await AsyncStorage.setItem(KEYS.CONTAINERS, JSON.stringify(containers));
    return true;
  } catch (error) {
    console.error('Error saving containers:', error);
    return false;
  }
};

// Get container presets
export const getContainers = async () => {
  try {
    const containersJson = await AsyncStorage.getItem(KEYS.CONTAINERS);
    return containersJson ? JSON.parse(containersJson) : null;
  } catch (error) {
    console.error('Error getting containers:', error);
    return null;
  }
};

// Save reminder settings
export const saveReminders = async (reminders) => {
  try {
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error('Error saving reminders:', error);
    return false;
  }
};

// Get reminder settings
export const getReminders = async () => {
  try {
    const remindersJson = await AsyncStorage.getItem(KEYS.REMINDERS);
    return remindersJson ? JSON.parse(remindersJson) : null;
  } catch (error) {
    console.error('Error getting reminders:', error);
    return null;
  }
}; 