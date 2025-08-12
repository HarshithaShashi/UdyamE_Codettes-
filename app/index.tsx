import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

// ✅ Import the logo
import Logo from '@/assets/images/1.png';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { userRole, hasSelectedLanguage } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSelectedLanguage) {
        router.replace('/language-selection');
      } else if (!isAuthenticated) {
        router.replace('/role-selection');
      } else if (userRole === 'buyer') {
        router.replace('/(buyer)');
      } else if (userRole === 'seller') {
        router.replace('/(seller)');
      } else {
        router.replace('/role-selection');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, userRole, hasSelectedLanguage]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* ✅ Udyami logo image */}
        <Image source={Logo} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.tagline}>
          {t('common.tagline', "Empowering India's Workers")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  tagline: {
    color: '#956a41',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
