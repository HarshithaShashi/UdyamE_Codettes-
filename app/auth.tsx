import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.welcome_back', 'Welcome to Udyami')}</Text>
        <Text style={styles.subtitle}>{t('auth.login_subtitle', 'Enter your mobile number to continue')}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('common.name', 'Name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('auth.enter_name_placeholder', 'Enter your name')}
            />
          </View>

          <TouchableOpacity
            style={styles.phoneLoginButton}
            onPress={() => router.push('/PhoneLogin')}
          >
            <Text style={styles.phoneLoginButtonText}>
              🔐 {t('auth.login_with_phone', 'Login with Phone Number')}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b73c2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
    textAlign: 'center',
    marginBottom: 48,
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
  phoneLoginButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  phoneLoginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
