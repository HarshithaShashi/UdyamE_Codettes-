import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { MapPin, Navigation, AlertCircle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LocationHandler() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const { userType } = params;

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('location_permission_denied');
        setLoading(false);
        return;
      }

      await getCurrentLocation();
    } catch (err) {
      setError('location_permission_error');
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      setLocation(currentLocation);
      setLoading(false);
    } catch (err) {
      setError('location_fetch_error');
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (location) {
      // Navigate based on user type
      if (userType === 'buyer') {
        router.replace('/(buyer)/welcome');
      } else {
        router.replace('/(seller)/tabs/profile');
      }
    } else {
      getCurrentLocation();
    }
  };

  const handleManualLocation = () => {
    // For now, we'll just proceed without location
    // In a real app, you'd open a location picker
    if (userType === 'buyer') {
      router.replace('/(buyer)/welcome');
    } else {
      router.replace('/(seller)/tabs/profile');
    }
  };

  const handleSkip = () => {
    if (userType === 'buyer') {
      router.replace('/(buyer)/welcome');
    } else {
      router.replace('/(seller)/tabs/profile');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#e19b3c" />
          <Text style={styles.loadingText}>{t('location.getting_location')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MapPin color="#fff" size={28} />
          </View>
          <Text style={styles.title}>{t('location.enable_location')}</Text>
          <Text style={styles.subtitle}>{t('location.location_subtitle')}</Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>{t('location.why_location')}</Text>
          <View style={styles.benefitList}>
            <Text style={styles.benefitItem}>• {t('location.find_nearby_workers')}</Text>
            <Text style={styles.benefitItem}>• {t('location.get_local_jobs')}</Text>
            <Text style={styles.benefitItem}>• {t('location.better_matching')}</Text>
            <Text style={styles.benefitItem}>• {t('location.faster_service')}</Text>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorCard}>
            <AlertCircle color="#b73c2f" size={24} />
            <Text style={styles.errorText}>{t(`location.${error}`)}</Text>
          </View>
        )}

        {/* Location Status */}
        {location && (
          <View style={styles.locationCard}>
            <Navigation color="#4CAF50" size={20} />
            <Text style={styles.locationText}>{t('location.location_detected')}</Text>
            <Text style={styles.coordinatesText}>
              {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, location && styles.buttonSuccess]}
            onPress={handleUseMyLocation}
          >
            <Text style={styles.primaryButtonText}>
              {location ? t('location.use_my_location') : t('location.get_my_location')}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>{t('location.skip_for_now')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    backgroundColor: '#e19b3c',
    padding: 16,
    borderRadius: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#b73c2f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsCard: {
    backgroundColor: '#ffe9d6',
    borderRadius: 16,
    borderColor: '#e19b3c',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 12,
  },
  benefitList: {
    gap: 8,
  },
  benefitItem: {
    color: '#956a41',
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    borderColor: '#b73c2f',
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#b73c2f',
    fontSize: 14,
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    borderColor: '#4CAF50',
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: '600',
  },
  coordinatesText: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#b73c2f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e19b3c',
  },
  secondaryButtonText: {
    color: '#b73c2f',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#956a41',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#956a41',
    textAlign: 'center',
  },
}); 