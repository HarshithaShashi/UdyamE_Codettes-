import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PortfolioScreen() {
  const { t } = useLanguage();
  const router = useRouter();

  const features = [
    {
      title: 'Multi-language Support',
      description: 'English, Hindi, and Kannada localization',
      icon: '🌐'
    },
    {
      title: 'Role-based Interface',
      description: 'Separate buyer and seller experiences',
      icon: '👥'
    },
    {
      title: 'Service Categories',
      description: '16+ different service categories',
      icon: '🔧'
    },
    {
      title: 'Modern UI/UX',
      description: 'Clean, responsive design',
      icon: '🎨'
    },
    {
      title: 'Real-time Features',
      description: 'Notifications, search, and messaging',
      icon: '⚡'
    },
    {
      title: 'Cross-platform',
      description: 'Web, iOS, and Android support',
      icon: '📱'
    }
  ];

  const technologies = [
    'React Native', 'Expo', 'TypeScript', 'React Navigation',
    'i18next', 'AsyncStorage', 'Axios', 'React Native Web'
  ];

  const handleBackToApp = () => {
    router.back();
  };

  const handleViewSource = () => {
    // Replace with your actual GitHub repository URL
    Linking.openURL('https://github.com/yourusername/udyami-app');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToApp} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to App</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Udyami - Project Portfolio</Text>
        <Text style={styles.subtitle}>Empowering India's Workers</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Project</Text>
        <Text style={styles.description}>
          Udyami is a comprehensive marketplace application that connects skilled workers 
          with customers seeking various services. The app features a modern, responsive 
          design with multi-language support and role-based user interfaces.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technologies Used</Text>
        <View style={styles.techContainer}>
          {technologies.map((tech, index) => (
            <View key={index} style={styles.techChip}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Development Highlights</Text>
        <View style={styles.highlightsList}>
          <Text style={styles.highlightItem}>• Implemented responsive design for web and mobile</Text>
          <Text style={styles.highlightItem}>• Built multi-language support with i18next</Text>
          <Text style={styles.highlightItem}>• Created role-based navigation and user flows</Text>
          <Text style={styles.highlightItem}>• Integrated real-time notifications and messaging</Text>
          <Text style={styles.highlightItem}>• Developed custom UI components and animations</Text>
          <Text style={styles.highlightItem}>• Implemented state management with React Context</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Links</Text>
        <View style={styles.linkContainer}>
          <TouchableOpacity style={styles.linkButton} onPress={handleViewSource}>
            <Text style={styles.linkButtonText}>View Source Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={handleBackToApp}>
            <Text style={styles.linkButtonText}>Try the App</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with ❤️ using React Native & Expo
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#b73c2f',
    fontSize: 16,
    fontWeight: '600',
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
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#956a41',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#956a41',
    textAlign: 'center',
    lineHeight: 20,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techChip: {
    backgroundColor: '#e19b3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  techText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsList: {
    gap: 8,
  },
  highlightItem: {
    fontSize: 16,
    color: '#956a41',
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  linkButton: {
    backgroundColor: '#b73c2f',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#956a41',
    fontSize: 14,
  },
});
