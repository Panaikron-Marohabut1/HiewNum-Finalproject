import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ตั้งค่าการแสดงผล notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// เวลาสำหรับการแจ้งเตือน
const NOTIFICATION_TIMES = [
  { hour: 6, minute: 0 },
  { hour: 8, minute: 0 },
  { hour: 10, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 16, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 22, minute: 0 },
  { hour: 0, minute: 0 },
];

// ขอสิทธิ์การแจ้งเตือน
export const requestNotificationPermission = async () => {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted.');
    return false;
  }

  return true;
};

// ตั้งค่าการแจ้งเตือน
export const scheduleFixedReminders = async (isEnabled) => {
  console.log('Notification scheduling enabled:', isEnabled);

  try {
    // ยกเลิกการแจ้งเตือนเก่าทั้งหมด
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all existing notifications.');
    
    if (!isEnabled) return;

    // ขอสิทธิ์การแจ้งเตือน
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    // ตั้งเวลาแจ้งเตือน
    for (const time of NOTIFICATION_TIMES) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to drink water! 💧',
          body: 'Do not forget to drink water for your good health!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
      });

      console.log(`Scheduled notification at ${time.hour}:${time.minute} (ID: ${identifier})`);
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Total scheduled notifications: ${scheduled.length}`);
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};
