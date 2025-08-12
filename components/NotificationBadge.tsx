import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBadgeProps {
  size?: number;
  fontSize?: number;
}

export default function NotificationBadge({ size = 18, fontSize = 10 }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Text style={[styles.text, { fontSize }]}>
        {unreadCount > 99 ? '99+' : unreadCount.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF4444',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    minHeight: 18,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 