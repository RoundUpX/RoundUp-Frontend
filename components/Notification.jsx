import { useEffect, useCallback, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Custom hook for budget notifications
export const useNotifications = () => {
  const [notificationData, setNotificationData] = useState({}); // Track last notification time and count for each category

  const requestNotificationPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const channelResult = await Notifications.setNotificationChannelAsync('budget-alerts', {
          name: ' Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log('Notification channel created:', channelResult);
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Existing notification status:', existingStatus);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions');
        return false;
      }
      console.log('Notification permissions granted');
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    requestNotificationPermissions();
  }, [requestNotificationPermissions]);

  const sendNotification = async (goal, saving) => { // Default to empty object
    try {
      const savedAmount = saving || 0; // Ensure saving is defined
      const percentage = goal.goalAmount > 0 ? (savedAmount / goal.goalAmount) * 100 : 0;

      console.log(`Sending notification for goal: ${goal.title}, current savings: ${savedAmount}, percentage: ${percentage}`); // Log notification details

      // Check if enough time has passed since the last notification
      const now = Date.now();
      const { lastSentTime = 0, count = 0 } = notificationData[goal.title] || {};  // Use goal title instead of category
      const notificationInterval = 2 * 60 * 1000; // in minutes

      if (percentage >= 75 && (now - lastSentTime) > notificationInterval && count < 2) { // Adjust the threshold as needed
        const notificationContent = {
          title: percentage >= 100 ? '🚨  Goal Achieved!' : '⚠️  Alert',
          body: `You have reached ${percentage.toFixed(0)}% of your goal: ${goal.title}`,
          priority: 'high', // pressure
          sound: 'default',
          badge: 1,
          channelId: 'goal-alerts', // Ensure your channelId is correct
        };

        await Notifications.scheduleNotificationAsync({
          content: {
            ...notificationContent,
            data: {
              title: goal.title,
              percentage: percentage,
            },
          },
          trigger: null, // Send immediately
        });

        console.log('Notification scheduled successfully');

        // Update the last notification time and count for this goal
        setNotificationData((prev) => ({
          ...prev,
          [goal.title]: {
            lastSentTime: now,
            count: (prev[goal.title]?.count || 0) + 1,
          },
        }));
      } else {
        console.log(`No notification to send: ${goal.title}, percentage completed: ${percentage}`); // Log if no notification
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };


  const checkThresholds = useCallback((goal, savings = {}) => { // Default to empty object

    if (goal <= savings) {
      sendNotification(goal, savings);
    }
  })

  if (!goal || typeof goal !== 'object' || !goal.title || !goal.goalAmount) {
    console.error('Invalid goal object:', goal);
    return;
  }
  return {
    checkThresholds,
    sendNotification,
    requestNotificationPermissions,
  };
};

// Notification listener component
export const NotificationListener = ({ onNotificationReceived }) => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification interaction:', response);
    });
    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [onNotificationReceived]);
  return null;
};
