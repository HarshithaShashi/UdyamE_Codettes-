import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Shield, ArrowLeft, RotateCcw } from 'lucide-react-native';

export default function OtpVerification() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { userRole } = useUser();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError(t('auth.invalid_otp', 'Please enter a valid 6-digit OTP'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      const userPayload = {
        name: 'User', // You might want to get this from a previous screen
        phoneNumber: `+91${phoneNumber}`,
        role: userRole || 'buyer',
        language: 'en',
        email: '',
        location: '',
      };

      // Call backend to create/update user
      // const response = await apiClient.post('/users', userPayload);
      
      // Login user
      await login(phoneNumber);
      
      // Navigate based on role
      if (userRole === 'buyer') {
        router.replace('/(buyer)/interests');
      } else {
        router.replace('/(seller)/personal-details');
      }
      
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError('');

    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset timer
      setTimeLeft(30);
      setCanResend(false);
      
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error: any) {
      console.error('❌ Resend OTP error:', error);
      setError('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.join('').length === 6;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Shield size={48} color="#b73c2f" />
              <Text style={styles.title}>{t('auth.otp_verification_title', 'Verify OTP')}</Text>
              <Text style={styles.subtitle}>
                {t('auth.otp_verification_subtitle', 'Enter the 6-digit code sent to')}
              </Text>
              <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
            </View>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>
              {t('auth.enter_otp', 'Enter OTP')}
            </Text>
            
            <View style={styles.otpInputs}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    error ? styles.otpInputError : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {t('auth.didnt_receive', 'Didn\'t receive the code?')}
            </Text>
            
            {canResend ? (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOtp}
                disabled={resendLoading}
              >
                <RotateCcw size={16} color="#b73c2f" />
                <Text style={styles.resendButtonText}>
                  {resendLoading 
                    ? t('common.loading', 'Loading...') 
                    : t('auth.resend_otp', 'Resend OTP')
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                {t('auth.resend_in', 'Resend in')} {timeLeft}s
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isOtpComplete || loading) ? styles.buttonDisabled : null
            ]}
            onPress={handleVerifyOtp}
            disabled={!isOtpComplete || loading}
          >
            <Text style={styles.buttonText}>
              {loading 
                ? t('common.verifying', 'Verifying...') 
                : t('auth.verify_otp', 'Verify OTP')
              }
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
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 40,
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
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b73c2f',
    marginTop: 4,
  },
  otpContainer: {
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9ff',
  },
  otpInputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendButtonText: {
    color: '#b73c2f',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
  },
  verifyButton: {
    backgroundColor: '#b73c2f',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 