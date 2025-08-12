import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Bell, X, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'seller_job' | 'buyer_reminder' | 'buyer_followup';
  title: string;
  message: string;
  primaryAction?: {
    text: string;
    onPress: () => void;
  };
  secondaryAction?: {
    text: string;
    onPress: () => void;
  };
  tertiaryAction?: {
    text: string;
    onPress: () => void;
  };
  jobData?: any;
}

export default function NotificationModal({
  visible,
  onClose,
  type,
  title,
  message,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  jobData,
}: NotificationModalProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case 'seller_job':
        return <Bell color="#4CAF50" size={32} />;
      case 'buyer_reminder':
        return <Clock color="#FF9800" size={32} />;
      case 'buyer_followup':
        return <CheckCircle color="#2196F3" size={32} />;
      default:
        return <AlertCircle color="#F44336" size={32} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'seller_job':
        return '#E8F5E8';
      case 'buyer_reminder':
        return '#FFF3E0';
      case 'buyer_followup':
        return '#E3F2FD';
      default:
        return '#FFEBEE';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'seller_job':
        return '#4CAF50';
      case 'buyer_reminder':
        return '#FF9800';
      case 'buyer_followup':
        return '#2196F3';
      default:
        return '#F44336';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: getBorderColor() }]}>
              {getIcon()}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#666" size={20} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {/* Job Details for Seller Notifications */}
            {type === 'seller_job' && jobData && (
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{jobData.title}</Text>
                <Text style={styles.jobLocation}>{jobData.location}</Text>
                <Text style={styles.jobBudget}>₹{jobData.budget_min} - ₹{jobData.budget_max}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {primaryAction && (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: getBorderColor() }]}
                onPress={primaryAction.onPress}
              >
                <Text style={styles.primaryButtonText}>{primaryAction.text}</Text>
              </TouchableOpacity>
            )}

            {secondaryAction && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={secondaryAction.onPress}
              >
                <Text style={styles.secondaryButtonText}>{secondaryAction.text}</Text>
              </TouchableOpacity>
            )}

            {tertiaryAction && (
              <TouchableOpacity
                style={styles.tertiaryButton}
                onPress={tertiaryAction.onPress}
              >
                <Text style={styles.tertiaryButtonText}>{tertiaryAction.text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width - 40,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  jobDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobBudget: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
}); 