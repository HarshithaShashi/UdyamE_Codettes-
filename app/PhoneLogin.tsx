import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, ArrowRight } from 'lucide-react-native';



export default function PhoneLogin() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; error?: string } => {
    // Remove any spaces, dashes, or special characters
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Check if empty
    if (!cleanNumber) {
      return { isValid: false, error: t('auth.phone_required', 'Phone number is required') };
    }
    
    // Check if exactly 10 digits
    if (cleanNumber.length !== 10) {
      return { isValid: false, error: t('auth.phone_10_digits', 'Phone number must be exactly 10 digits') };
    }
    
    // Check if contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
      return { isValid: false, error: t('auth.phone_digits_only', 'Phone number must contain only digits') };
    }
    
    // Check if starts with 6-9
    if (!/^[6-9]/.test(cleanNumber)) {
      return { isValid: false, error: t('auth.phone_start_6_9', 'Phone number must start with digits 6–9') };
    }
    
    return { isValid: true };
  };

  const handlePhoneNumberChange = (text: string) => {
    // Only allow digits and limit to 10 characters
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    setError(''); // Clear error when user types
  };

  const validateAndProceed = () => {
    const validation = validatePhoneNumber(phoneNumber);
    
    if (!validation.isValid) {
      setError(validation.error || t('auth.invalid_phone', 'Invalid phone number'));
      return;
    }

    // For now, we'll simulate the OTP flow
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to OTP verification with phone number
      router.push({
        pathname: '/OtpVerification',
        params: { phoneNumber }
      });
    }, 1000);
  };

  const isPhoneNumberValid = () => {
    const validation = validatePhoneNumber(phoneNumber);
    return validation.isValid;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Phone size={48} color="#b73c2f" />
            <Text style={styles.title}>{t('auth.phone_login_title', 'Enter Your Phone Number')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.phone_login_subtitle', 'We\'ll send you a verification code')}
            </Text>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={[
                  styles.phoneInput,
                  error ? styles.inputError : null,
                  isPhoneNumberValid() ? styles.inputValid : null
                ]}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {isPhoneNumberValid() ? (
              <Text style={styles.validText}>✓ Valid phone number</Text>
            ) : null}
          </View>

          {/* Validation Rules */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Phone number must:</Text>
            <Text style={styles.rule}>• Be exactly 10 digits</Text>
            <Text style={styles.rule}>• Contain only digits (0-9)</Text>
            <Text style={styles.rule}>• Start with digits 6, 7, 8, or 9</Text>
            <Text style={styles.rule}>• Not include country code (+91)</Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isPhoneNumberValid() || loading) ? styles.buttonDisabled : null
            ]}
            onPress={validateAndProceed}
            disabled={!isPhoneNumberValid() || loading}
          >
            <Text style={styles.buttonText}>
              {loading 
                ? t('common.loading', 'Loading...') 
                : t('auth.send_otp', 'Send OTP')
              }
            </Text>
            {!loading && isPhoneNumberValid() && (
              <ArrowRight size={20} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Back to regular auth */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              {t('common.back', 'Back to Login')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 32,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  countryCode: {
    backgroundColor: '#b73c2f',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryCodeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  inputValid: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9ff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  validText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  rulesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  rule: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#b73c2f',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
}); 