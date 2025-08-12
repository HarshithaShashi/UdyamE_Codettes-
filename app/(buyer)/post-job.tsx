import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform, KeyboardAvoidingView, Modal, SafeAreaView } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { SkillSelector } from '@/components/SkillSelector';
import NotificationBadge from '@/components/NotificationBadge';
import { Bell } from 'lucide-react-native';
import { hybridDB } from '@/services/HybridDatabaseService';

const mockNotifications = [
  { id: 1, text: 'Your job post was approved.' },
  { id: 2, text: 'New application for your job.' },
  { id: 3, text: 'Payment received.' },
];

export default function PostJob() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { simulatePostJob } = useNotifications();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    skills: [] as string[],
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    location: '',
    phone: user?.phoneNumber || '',
    email: '',
    category: '',
  });
  const [timelineOption, setTimelineOption] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSubmit = async () => {
    if (!jobData.title || jobData.skills.length === 0 || !jobData.budgetMin || !jobData.budgetMax) {
      Alert.alert(t('common.error'), t('buyer.fill_required_fields'));
      return;
    }

    try {
      // Create job data for database
      const jobDataForDB = {
        title: jobData.title,
        description: jobData.description,
        skill: jobData.skills[0], // Use first skill for matching
        budget: `₹${jobData.budgetMin} - ₹${jobData.budgetMax}`,
        timeline: jobData.timeline || timelineOption,
        location: jobData.location,
        buyerId: user?.id || 'test-buyer-id',
        postedBy: user?.name || 'Anonymous',
      };

      // Save job to database
      const jobId = await hybridDB.createJob(jobDataForDB);
      console.log('✅ Job saved to database:', jobId);

      // Create job data for notification
      const jobForNotification = {
        title: jobData.title,
        description: jobData.description,
        skill: jobData.skills[0], // Use first skill for matching
        budget_min: parseInt(jobData.budgetMin),
        budget_max: parseInt(jobData.budgetMax),
        timeline: jobData.timeline || timelineOption,
        location: jobData.location,
        buyer_id: user?.id || 103,
      };

      // Simulate posting job (this will trigger seller notifications)
      simulatePostJob(jobForNotification);

      Alert.alert(
        t('common.success'), 
        t('buyer.job_posted_successfully') + '\n\n' + t('notifications.sellers_notified', 'Sellers with matching skills in your area will be notified!')
      );

      setJobData({
        title: '',
        description: '',
        skills: [],
        budgetMin: '',
        budgetMax: '',
        timeline: '',
        location: '',
        phone: user?.phoneNumber || '',
        email: '',
        category: '',
      });
      setTimelineOption('');
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert(t('common.error'), 'Failed to post job. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('buyer.post_new_job')}</Text>
            <TouchableOpacity style={styles.bell} onPress={() => setShowNotifications(true)}>
              <Bell size={26} color="#b73c2f" />
              <NotificationBadge />
            </TouchableOpacity>
            <Text style={styles.subtitle}>{t('buyer.post_job_subtitle')}</Text>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled" 
            contentContainerStyle={{paddingBottom: 150, paddingTop: 20}}
          >
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('buyer.job_title')} *</Text>
                <TextInput
                  style={styles.input}
                  value={jobData.title}
                  onChangeText={(text) => setJobData({...jobData, title: text})}
                  placeholder={t('buyer.job_title_placeholder')}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('buyer.skill_required')} *</Text>
                <SkillSelector
                  selectedSkills={jobData.skills}
                  onSkillSelect={(skills) => setJobData({...jobData, skills: Array.isArray(skills) ? skills : [skills]})}
                  multiSelect
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('common.location', 'Location')}</Text>
                <TextInput
                  style={styles.input}
                  value={jobData.location}
                  onChangeText={(text) => setJobData({...jobData, location: text})}
                  placeholder={t('buyer.location_placeholder', 'Auto-detect or enter manually')}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('common.timeline', 'Timeline')}</Text>
                <View style={styles.timelineRow}>
                  {[t('buyer.today', 'Today'), t('buyer.this_week', 'This Week'), t('buyer.pick_date', 'Pick Date')].map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.timelineOption, timelineOption === opt && styles.timelineOptionSelected]}
                      onPress={() => {
                        setTimelineOption(opt);
                        setJobData({...jobData, timeline: opt});
                      }}
                    >
                      <Text style={[styles.timelineOptionText, timelineOption === opt && styles.timelineOptionTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('common.description', 'Description')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={jobData.description}
                  onChangeText={(text) => setJobData({...jobData, description: text})}
                  placeholder={t('buyer.job_description_placeholder', 'Describe the work in detail...')}
                  multiline
                  numberOfLines={4}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('buyer.category', 'Category')}</Text>
                <TextInput
                  style={styles.input}
                  value={jobData.category}
                  onChangeText={(text) => setJobData({...jobData, category: text})}
                  placeholder={t('buyer.category_placeholder', 'E.g. Agriculture, Handicraft')}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('buyer.price_range', 'Price Range (₹)')}</Text>
                <View style={styles.priceRow}>
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    value={jobData.budgetMin}
                    onChangeText={(text) => setJobData({...jobData, budgetMin: text})}
                    placeholder={t('buyer.min', 'Min')}
                    keyboardType="numeric"
                  />
                  <Text style={{marginHorizontal: 8}}>-</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    value={jobData.budgetMax}
                    onChangeText={(text) => setJobData({...jobData, budgetMax: text})}
                    placeholder={t('buyer.max', 'Max')}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('common.phone_number', 'Phone')}</Text>
                <TextInput
                  style={[styles.input, {marginBottom: 16}]}
                  value={jobData.phone}
                  editable={false}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('common.email', 'Email')}</Text>
                <TextInput
                  style={styles.input}
                  value={jobData.email}
                  onChangeText={(text) => setJobData({...jobData, email: text})}
                  placeholder={t('buyer.enter_email_placeholder', 'Enter your email')}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>{t('buyer.post_job', 'Post Job')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowNotifications(false)}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('common.notifications', 'Notifications')}</Text>
                {mockNotifications.map(n => (
                  <Text key={n.id} style={styles.notificationText}>{n.text}</Text>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#956a41',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#b73c2f',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  timelineOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  timelineOptionSelected: {
    backgroundColor: '#b73c2f',
    borderColor: '#b73c2f',
  },
  timelineOptionText: {
    color: '#b73c2f',
    fontWeight: '600',
  },
  timelineOptionTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
  },
  bell: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#b73c2f',
    marginBottom: 12,
  },
  notificationText: {
    color: '#956a41',
    fontSize: 15,
    marginBottom: 8,
  },
});