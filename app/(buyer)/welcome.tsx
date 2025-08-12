import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';

const INTERESTS = [
  { key: 'painting', label: 'Painting', emoji: '🎨' },
  { key: 'carpentry', label: 'Carpentry', emoji: '🪚' },
  { key: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { key: 'bamboo_work', label: 'Bamboo Work', emoji: '🎋' },
  { key: 'tailoring', label: 'Tailoring', emoji: '🧵' },
  { key: 'landscaping', label: 'Landscaping', emoji: '🌳' },
  { key: 'electrical', label: 'Electrical', emoji: '💡' },
  { key: 'masonry', label: 'Masonry', emoji: '🧱' },
];

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { interests } = useUser();
  const router = useRouter();

  const interestDetails = INTERESTS.filter(i => interests.includes(i.key));

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('buyer.welcome_to_udyami', 'Welcome to Udyami!')}</Text>
      <Text style={styles.subtitle}>{t('buyer.profile_summary', 'Here is your profile summary:')}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{t('common.name', 'Name')}:</Text>
        <Text style={styles.value}>{user?.name || t('common.not_available', 'N/A')}</Text>
        <Text style={styles.label}>{t('common.language', 'Language')}:</Text>
        <Text style={styles.value}>{currentLanguage?.toUpperCase() || 'EN'}</Text>
        <Text style={styles.label}>{t('common.phone_number', 'Phone Number')}:</Text>
        <Text style={styles.value}>{user?.phoneNumber || t('common.not_available', 'N/A')}</Text>
        <Text style={styles.label}>{t('buyer.interests', 'Interests')}:</Text>
        <View style={styles.interestsRow}>
          {interestDetails.length === 0 ? (
            <Text style={styles.value}>{t('buyer.none_selected', 'None selected')}</Text>
          ) : (
            interestDetails.map((interest) => (
              <View key={interest.key} style={styles.interestChip}>
                <Text style={styles.emoji}>{interest.emoji}</Text>
                <Text style={styles.interestLabel}>{t(interest.key) || interest.label}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/(buyer)/tabs')}>
          <Text style={styles.startButtonText}>{t('buyer.start_exploring', 'Start Exploring')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 32,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fff2e1',
    marginTop: 8,
  },
  label: {
    color: '#b73c2f',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 10,
  },
  value: {
    color: '#956a41',
    fontSize: 17,
    fontWeight: '500',
    marginTop: 2,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef7f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e19b3c',
  },
  emoji: {
    fontSize: 20,
    marginRight: 6,
  },
  interestLabel: {
    color: '#b73c2f',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 32,
  },
  startButton: {
    backgroundColor: '#b73c2f',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 