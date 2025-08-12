import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotificationDemo() {
  const { simulatePostJob } = useNotifications();
  const { t } = useLanguage();

  const triggerSellerNotification = () => {
    const jobData = {
      title: 'Test Job for Plumbing',
      description: 'Need a plumber to fix a leak',
      skill: 'Plumbing',
      budget_min: 1000,
      budget_max: 3000,
      timeline: '2 days',
      location: 'Delhi',
      buyer_id: 103,
    };

    simulatePostJob(jobData);
    Alert.alert('Demo', 'Seller notification triggered! Check for sellers in Delhi with Plumbing skill.');
  };

  const triggerBuyerReminder = () => {
    // This will be handled by the polling system
    Alert.alert('Demo', 'Buyer reminder notifications are triggered automatically after 24 hours. Check the notification service for existing jobs.');
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // This would clear notifications
            Alert.alert('Cleared', 'All notifications cleared!');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Demo</Text>
      <Text style={styles.subtitle}>Test the notification system</Text>

      <TouchableOpacity style={styles.button} onPress={triggerSellerNotification}>
        <Text style={styles.buttonText}>Trigger Seller Notification</Text>
        <Text style={styles.buttonSubtext}>Simulates a new job posting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={triggerBuyerReminder}>
        <Text style={styles.buttonText}>Check Buyer Reminders</Text>
        <Text style={styles.buttonSubtext}>Shows existing reminder logic</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllNotifications}>
        <Text style={styles.buttonText}>Clear All Notifications</Text>
        <Text style={styles.buttonSubtext}>Removes all notifications</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>• Seller notifications are triggered when a job is posted</Text>
        <Text style={styles.infoText}>• Buyer reminders are triggered after 24 hours</Text>
        <Text style={styles.infoText}>• Notifications appear as modal popups</Text>
        <Text style={styles.infoText}>• Mock data includes sellers in different locations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e19b3c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: '#b73c2f',
  },
  info: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 