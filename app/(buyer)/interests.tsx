import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

const INTERESTS = [
  { key: 'painting', label: 'Painting', emoji: '🎨' },
  { key: 'carpentry', label: 'Carpentry', emoji: '🔨' },
  { key: 'plumbing', label: 'Plumbing', emoji: '🚿' },
  { key: 'bamboo_work', label: 'Bamboo Work', emoji: '🧺' },
  { key: 'electrical', label: 'Electrical', emoji: '💡' },
  { key: 'masonry', label: 'Masonry', emoji: '🧱' },
  { key: 'tailoring', label: 'Tailoring', emoji: '🧵' },
  { key: 'gardening', label: 'Gardening', emoji: '🌿' },
  { key: 'welding', label: 'Welding', emoji: '⚒️' },
  { key: 'roofing', label: 'Roofing', emoji: '🏠' },
  { key: 'flooring', label: 'Flooring', emoji: '🪵' },
  { key: 'glass_work', label: 'Glass Work', emoji: '🪟' },
  { key: 'appliance_repair', label: 'Appliance Repair', emoji: '🔧' },
  { key: 'handicrafts', label: 'Handicrafts', emoji: '🧶' },
  { key: 'landscaping', label: 'Landscaping', emoji: '🌳' },
  { key: 'interior_design', label: 'Interior Design', emoji: '🛋️' },
];

export default function InterestsScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const { setInterests } = useUser();

  const toggleInterest = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleContinue = () => {
    setInterests(selected);
    router.push('/LocationHandler?userType=buyer');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 100, paddingTop: 40}} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('buyer.choose_interests', 'Choose your interests')}</Text>
        <Text style={styles.subtitle}>
          {t('buyer.interests_subtitle', 'Select the types of work you are interested in. This will help us show you relevant posts. After continuing, you will see your profile summary.')}
        </Text>
        <View style={styles.grid}>
          {INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest.key);
            return (
              <TouchableOpacity
                key={interest.key}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleInterest(interest.key)}
                activeOpacity={0.8}
              >
                <Text style={styles.emoji}>{interest.emoji}</Text>
                <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                  {t(`skills.${interest.key}`, interest.label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={[styles.continueButton, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text style={styles.continueButtonText}>{t('common.continue', 'Continue')}</Text>
        </TouchableOpacity>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff2e1',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#956a41',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    margin: 8,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fff2e1',
  },
  cardSelected: {
    backgroundColor: '#e19b3c',
    borderColor: '#b73c2f',
    shadowColor: '#e19b3c',
  },
  cardText: {
    color: '#956a41',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  cardTextSelected: {
    color: '#fff',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#b73c2f',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff2e1',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#e19b3c',
    borderColor: '#b73c2f',
    shadowColor: '#e19b3c',
  },
  chipText: {
    color: '#956a41',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chipTextSelected: {
    color: '#fff',
  },
}); 