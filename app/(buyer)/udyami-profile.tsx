import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, MapPin, BadgeCheck, ShieldCheck, Phone, MessageCircle, Heart } from 'lucide-react-native';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { mockSellers } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function UdyamiProfile() {
  const { sellerId } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const seller = mockSellers.find(s => s.id === sellerId) || mockSellers[0];
  const [isFollowing, setIsFollowing] = useState(seller.isFollowing);

  // WhatsApp redirection function
  const openWhatsApp = (phoneNumber: string) => {
    // Remove any non-digit characters and ensure it starts with country code
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (!cleanNumber) {
      Alert.alert(t('common.error'), t('common.phone_not_available'));
      return;
    }

    // Validate phone number format (should be at least 10 digits)
    if (cleanNumber.length < 10) {
      Alert.alert(t('common.error'), t('common.phone_not_available'));
      return;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    
    Linking.openURL(whatsappUrl).catch(err => {
      console.error("WhatsApp redirect failed", err);
      Alert.alert(t('common.error'), t('common.whatsapp_error'));
    });
  };

  // Add placeholder reviews and experience if not present
  type Review = { id: string; name: string; rating: number; comment: string };
  const reviews: Review[] = (seller as any).reviews || [
    { id: 'r1', name: 'Amit', rating: 5, comment: 'Great work!' },
    { id: 'r2', name: 'Priya', rating: 4, comment: 'Very professional.' },
  ];
  const experience = (seller as any).experience || '3 yrs';
  const bio = (seller as any).bio || 'No bio available.';
  const isTopRated = (seller as any).isTopRated || false;
  const isTrusted = (seller as any).isTrusted || false;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{seller.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{seller.name}</Text>
          <View style={styles.row}>
            <View style={styles.skillChip}><Text style={styles.skillText}>{seller.skills[0]}</Text></View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.location}><MapPin size={14} color="#956a41" /> {seller.location}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.experience}>{experience}</Text>
          </View>
          <Text style={styles.bio}>{bio}</Text>
          <View style={styles.badgesRow}>
            {isTopRated && <View style={styles.badge}><Star size={14} color="#fff" /><Text style={styles.badgeText}>Top Rated</Text></View>}
            {isTrusted && <View style={styles.badge}><ShieldCheck size={14} color="#fff" /><Text style={styles.badgeText}>Trusted</Text></View>}
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, isFollowing && styles.actionButtonActive]} onPress={() => setIsFollowing(f => !f)}>
              <Heart size={18} color={isFollowing ? '#fff' : '#b73c2f'} fill={isFollowing ? '#b73c2f' : 'none'} />
              <Text style={[styles.actionButtonText, isFollowing && { color: '#fff' }]}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openWhatsApp(seller.phoneNumber || '')}
            >
              <Phone size={18} color="#b73c2f" />
              <Text style={styles.actionButtonText}>{t('common.get_in_touch')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Work</Text>
          <PortfolioGallery />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.map((r: Review) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <View style={styles.reviewStars}>
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} color="#e19b3c" fill="#e19b3c" />)}
                </View>
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff2e1' },
  profileHeader: { alignItems: 'center', padding: 24, backgroundColor: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  avatarLarge: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#b73c2f', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarTextLarge: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#b73c2f', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  skillChip: { backgroundColor: '#fef7f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  skillText: { color: '#e19b3c', fontSize: 12, fontWeight: '600' },
  dot: { color: '#b73c2f', marginHorizontal: 4 },
  location: { color: '#956a41', fontSize: 12, marginRight: 8 },
  experience: { color: '#956a41', fontSize: 12 },
  bio: { color: '#956a41', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e19b3c', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#b73c2f', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4 },
  actionButtonActive: { backgroundColor: '#b73c2f', borderColor: '#b73c2f' },
  actionButtonText: { color: '#b73c2f', fontSize: 14, fontWeight: '600', marginLeft: 6 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#b73c2f', marginBottom: 12 },
  reviewCard: { backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  reviewName: { fontWeight: 'bold', color: '#b73c2f', fontSize: 14 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewComment: { color: '#956a41', fontSize: 13 },
}); 