import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import NotificationService, { NotificationData } from '@/services/NotificationService';
import { useLanguage } from './LanguageContext';

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  showNotificationModal: (notification: NotificationData) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  simulatePostJob: (jobData: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      
      // Show modal for new unread notifications
      const unreadNotifications = newNotifications.filter(n => !n.read && !n.dismissed);
      if (unreadNotifications.length > 0) {
        const latestNotification = unreadNotifications[0];
        showNotificationModal(latestNotification);
      }
    });

    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    return unsubscribe;
  }, []);

  const showNotificationModal = (notification: NotificationData) => {
    setCurrentNotification(notification);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentNotification(null);
  };

  const handlePrimaryAction = () => {
    if (!currentNotification) return;

    switch (currentNotification.type) {
      case 'seller_job':
        // Navigate to job detail page
        Alert.alert(
          t('notifications.view_job', 'View Job'),
          t('notifications.navigating_to_job', 'Navigating to job details...'),
          [{ text: t('common.ok', 'OK') }]
        );
        break;
      case 'buyer_reminder':
        // Show follow-up options
        showBuyerFollowUpModal();
        break;
      case 'buyer_followup':
        handleBuyerFollowUpAction();
        break;
    }

    notificationService.markAsRead(currentNotification.id);
    handleModalClose();
  };

  const handleSecondaryAction = () => {
    if (!currentNotification) return;

    switch (currentNotification.type) {
      case 'seller_job':
        // Dismiss notification
        notificationService.dismissNotification(currentNotification.id);
        break;
      case 'buyer_reminder':
        // Show follow-up options
        showBuyerFollowUpModal();
        break;
    }

    handleModalClose();
  };

  const showBuyerFollowUpModal = () => {
    if (!currentNotification) return;

    Alert.alert(
      t('notifications.job_status', 'Job Status'),
      t('notifications.select_job_status', 'Please select the status of your job:'),
      [
        {
          text: t('notifications.completed', 'My job was completed. Hurrah!'),
          onPress: () => {
            Alert.alert(
              t('notifications.rating', 'Rate Your Experience'),
              t('notifications.redirect_to_rating', 'Redirecting to rating page...'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('notifications.confirmed_not_completed', 'Deal confirmed, but job not completed'),
          onPress: () => {
            showTimelineOptions();
          },
        },
        {
          text: t('notifications.remind_later', 'Not yet, remind me later'),
          onPress: () => {
            showRemindLaterOptions();
          },
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const showTimelineOptions = () => {
    Alert.alert(
      t('notifications.estimated_timeline', 'Estimated Timeline'),
      t('notifications.select_timeline', 'When do you expect the job to be completed?'),
      [
        {
          text: t('notifications.one_day', '1 day'),
          onPress: () => {
            Alert.alert(
              t('notifications.timeline_set', 'Timeline Set'),
              t('notifications.reminder_set_one_day', 'We\'ll remind you in 1 day.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('notifications.one_week', '1 week'),
          onPress: () => {
            Alert.alert(
              t('notifications.timeline_set', 'Timeline Set'),
              t('notifications.reminder_set_one_week', 'We\'ll remind you in 1 week.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('notifications.one_month', '1 month'),
          onPress: () => {
            Alert.alert(
              t('notifications.timeline_set', 'Timeline Set'),
              t('notifications.reminder_set_one_month', 'We\'ll remind you in 1 month.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const showRemindLaterOptions = () => {
    Alert.alert(
      t('notifications.remind_later', 'Remind Me Later'),
      t('notifications.select_reminder_time', 'When should we remind you?'),
      [
        {
          text: t('notifications.one_hour', '1 hour'),
          onPress: () => {
            Alert.alert(
              t('notifications.reminder_set', 'Reminder Set'),
              t('notifications.reminder_set_one_hour', 'We\'ll remind you in 1 hour.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('notifications.three_hours', '3 hours'),
          onPress: () => {
            Alert.alert(
              t('notifications.reminder_set', 'Reminder Set'),
              t('notifications.reminder_set_three_hours', 'We\'ll remind you in 3 hours.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('notifications.tomorrow', 'Tomorrow'),
          onPress: () => {
            Alert.alert(
              t('notifications.reminder_set', 'Reminder Set'),
              t('notifications.reminder_set_tomorrow', 'We\'ll remind you tomorrow.'),
              [{ text: t('common.ok', 'OK') }]
            );
            notificationService.dismissNotification(currentNotification.id);
          },
        },
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const handleBuyerFollowUpAction = () => {
    // This would handle the follow-up action based on the selected option
    notificationService.dismissNotification(currentNotification.id);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const dismissNotification = (id: string) => {
    notificationService.dismissNotification(id);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const simulatePostJob = (jobData: any) => {
    notificationService.simulatePostJob(jobData);
  };

  const unreadCount = notificationService.getUnreadCount();

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showNotificationModal,
    markAsRead,
    dismissNotification,
    clearAll,
    simulatePostJob,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification Modal */}
      {currentNotification && showModal && (
        <NotificationModal
          visible={showModal}
          onClose={handleModalClose}
          type={currentNotification.type}
          title={currentNotification.title}
          message={currentNotification.message}
          jobData={currentNotification.jobData}
          primaryAction={
            currentNotification.type === 'seller_job'
              ? {
                  text: t('notifications.view_job', 'View Job'),
                  onPress: handlePrimaryAction,
                }
              : {
                  text: t('notifications.yes', 'Yes'),
                  onPress: handlePrimaryAction,
                }
          }
          secondaryAction={
            currentNotification.type === 'seller_job'
              ? {
                  text: t('notifications.dismiss', 'Dismiss'),
                  onPress: handleSecondaryAction,
                }
              : {
                  text: t('notifications.no', 'No'),
                  onPress: handleSecondaryAction,
                }
          }
        />
      )}
    </NotificationContext.Provider>
  );
};

// Import NotificationModal at the top
import NotificationModal from '@/components/NotificationModal'; 