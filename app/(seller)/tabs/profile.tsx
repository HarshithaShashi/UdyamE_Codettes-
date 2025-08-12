import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Edit,
  Star,
  Users,
  Award,
  Image as ImageIcon,
  LogOut,
  Plus,
  Bell,
  Download,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationBadge from '@/components/NotificationBadge';
import * as ImagePicker from 'expo-image-picker';
import { generateSellerCV, SellerCVData } from '@/utils/cvGenerator';

export default function SellerProfile() {
  const router = useRouter();
  const { t } = useLanguage();
  const PLACEHOLDER_URL = 'https://placehold.co/160x100';
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]);

  const handleLogout = () => {
    router.replace('/auth');
  };

  const handleAddMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.permission_required'),
          t('seller.gallery_permission_message')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPortfolioImages(prev => [...prev, { uri: asset.uri }]);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('seller.upload_error'));
    }
  };

  const handleDownloadCV = async () => {
    try {
      const sellerData: SellerCVData = {
        name: t('seller.sample_name'),
        location: 'Bangalore, Karnataka',
        phoneNumber: '+91 98765 43210',
        email: 'sample@udyami.com',
        bio: 'Experienced tailor with 8+ years of expertise in women\'s wear, specializing in traditional and modern designs. Committed to delivering high-quality craftsmanship and customer satisfaction.',
        skills: ['Tailoring', 'Women\'s Wear', 'Traditional Designs', 'Alterations', 'Bridal Wear'],
        rating: 4.9,
        totalRatings: 24,
        services: [
          {
            title: 'Bridal Lehenga Stitching',
            price: '₹3,000 - ₹8,000',
            category: 'Bridal Wear',
            description: 'Custom bridal lehenga with intricate embroidery and fitting'
          },
          {
            title: 'Saree Blouse Stitching',
            price: '₹500 - ₹1,200',
            category: 'Women\'s Wear',
            description: 'Perfectly fitted saree blouse with various neck designs'
          },
          {
            title: 'Kurti Alterations',
            price: '₹200 - ₹500',
            category: 'Alterations',
            description: 'Professional alterations for perfect fit'
          }
        ],
        completedJobs: [
          {
            title: 'Bridal Lehenga for Priya\'s Wedding',
            completedAt: 'December 2023',
            rating: 5,
            review: 'Excellent work! The lehenga was perfect and the fitting was spot on.'
          },
          {
            title: 'Saree Blouse Collection',
            completedAt: 'November 2023',
            rating: 4.8,
            review: 'Beautiful designs and great quality stitching.'
          },
          {
            title: 'Festival Wear Alterations',
            completedAt: 'October 2023',
            rating: 4.9,
            review: 'Quick turnaround and perfect alterations.'
          }
        ],
        followers: 156,
        totalJobs: 12
      };

      await generateSellerCV(sellerData);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('common.cv_generation_failed')
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header with Notifications */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.bell}>
          <Bell size={26} color="#b73c2f" />
          <NotificationBadge />
        </TouchableOpacity>
      </View>

      {/* Top Profile Card */}
      <View style={styles.headerCard}>
        <Image
          source={require('@/assets/images/yess2.png')}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{t('seller.sample_name')}</Text>
          <Text style={styles.skill}>{t('seller.tailoring_experience')}</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{t('skills.tailoring')}</Text>
            <Text style={styles.badge}>{t('seller.womens_wear')}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cvButton} onPress={handleDownloadCV}>
            <Download color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/personal-details')}>
            <Edit color="#b73c2f" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Star color="#b73c2f" size={20} />
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>{t('seller.rating')}</Text>
        </View>
        <View style={styles.statCard}>
          <Users color="#b73c2f" size={20} />
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>{t('seller.clients')}</Text>
        </View>
        <View style={styles.statCard}>
          <Award color="#b73c2f" size={20} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>{t('seller.jobs')}</Text>
        </View>
      </View>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>{t('seller.badges')}</Text>
      <View style={styles.achievementRow}>
        <View style={[styles.achievementCard, { backgroundColor: '#e6fbe6' }]}>
          <Award color="#4caf50" size={20} />
          <Text style={styles.achievementText}>{t('seller.five_jobs_completed')}</Text>
        </View>
        <View style={[styles.achievementCard, { backgroundColor: '#e6f0ff' }]}>
          <Award color="#2196f3" size={20} />
          <Text style={styles.achievementText}>{t('seller.ten_jobs_completed')}</Text>
        </View>
      </View>

      {/* Portfolio */}
      <Text style={styles.sectionTitle}>{t('seller.your_portfolio')}</Text>
      {portfolioImages.filter(img => img.uri && img.uri !== PLACEHOLDER_URL).length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryRow}>
          {portfolioImages.filter(img => img.uri && img.uri !== PLACEHOLDER_URL).map((image, index) => (
            <View key={index} style={styles.galleryCard}>
              <Image source={{ uri: image.uri }} style={styles.galleryImage} />
            </View>
          ))}
          <TouchableOpacity style={styles.addMediaCard} onPress={handleAddMedia}>
            <Plus color="#956a41" size={28} />
            <Text style={styles.addMediaText}>{t('seller.add_media')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {portfolioImages.filter(img => img.uri && img.uri !== PLACEHOLDER_URL).length === 0 && (
        <TouchableOpacity style={[styles.addMediaCard, { alignSelf: 'flex-start', marginLeft: 0 }]} onPress={handleAddMedia}>
          <Plus color="#956a41" size={28} />
          <Text style={styles.addMediaText}>{t('seller.add_media')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  bell: {
    position: 'relative',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#e19b3c',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b73c2f',
    fontFamily: 'BalooBhai2-Regular',
  },
  skill: {
    fontSize: 14,
    color: '#956a41',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#fff2e1',
    borderColor: '#956a41',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: '#956a41',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#956a41',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#b73c2f',
    fontFamily: 'BalooBhai2-Regular',
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  achievementCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#956a41',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  galleryRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  galleryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  galleryImage: {
    width: 160,
    height: 100,
    resizeMode: 'cover',
  },
  addMediaCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e19b3c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff2e1',
  },
  addMediaText: {
    fontSize: 12,
    marginTop: 6,
    color: '#b73c2f',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cvButton: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b73c2f',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
