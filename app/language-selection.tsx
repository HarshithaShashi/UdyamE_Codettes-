import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { AVAILABLE_LANGUAGES } from '@/src/i18n';

export default function LanguageSelection() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setLanguage } = useLanguage();
  const { setHasSelectedLanguage } = useUser();

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await setLanguage(languageCode);
      setHasSelectedLanguage(true);
      router.replace('/role-selection');
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('language_selection.title')}</Text>
        <Text style={styles.subtitle}>{t('language_selection.subtitle')}</Text>
        
        <View style={styles.languageGrid}>
          {AVAILABLE_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageCard}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.nativeName}>{language.nativeName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b73c2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#956a41',
    textAlign: 'center',
    marginBottom: 48,
  },
  languageGrid: {
    gap: 16,
  },
  languageCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b73c2f',
    textAlign: 'center',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 16,
    color: '#956a41',
    textAlign: 'center',
  },
});