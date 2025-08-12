import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { SellerCard } from '@/components/SellerCard';
import { JobCard } from '@/components/JobCard';
import { mockSellers, mockJobs } from '@/data/mockData';
import { Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mockNotifications = [
  { id: 1, text: 'Welcome to Udyami!' },
  { id: 2, text: 'You have a new message.' },
];

export default function BuyerHome() {
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}> {/* Use safe area inset */}
          <Text style={styles.greeting}>{t('buyer.good_morning')}</Text>
          <Text style={styles.subtitle}>{t('buyer.find_skilled_workers')}</Text>
          <TouchableOpacity style={styles.bell} onPress={() => setShowNotifications(true)}>
            <Bell size={26} color="#b73c2f" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        {/* Top Udyamis Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.top_udyamis')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {mockSellers.slice(0, 5).map((seller) => (
              <SellerCard key={seller.id} seller={seller} style={styles.sellerCard} />
            ))}
          </ScrollView>
        </View>

        {/* Trending in Your Area Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.trending_nearby')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {mockSellers.slice(5, 10).map((seller) => (
              <SellerCard key={seller.id} seller={seller} style={styles.sellerCard} />
            ))}
          </ScrollView>
        </View>

        {/* Premium Sellers Carousel (with badge) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.premium_sellers', 'Premium Sellers')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {mockSellers.slice(0, 3).map((seller) => (
              <View key={seller.id} style={{position: 'relative'}}>
                <SellerCard seller={seller} style={styles.sellerCard} />
                <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>{t('buyer.premium', 'Premium')}</Text></View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Local Ads Section (optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.local_ads', 'Local Ads')}</Text>
          <View style={styles.localAdCard}><Text>{t('buyer.ad_space', 'Ad space')}</Text></View>
        </View>
      </ScrollView>
        <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowNotifications(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('common.notifications', 'Notifications')}</Text>
              {mockNotifications.map(n => (
                <Text key={n.id} style={styles.notificationText}>{n.text}</Text>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Add bottom padding to prevent content from being hidden behind tab bar
  },
  header: {
    padding: 20,
    paddingTop: 0, // Remove static paddingTop, now handled by insets
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingLeft: 0,
  },
  sellerCard: {
    marginRight: 16,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e19b3c',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  localAdCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    minHeight: 80,
  },
  bell: { position: 'absolute', right: 20, top: 20, zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, minWidth: 250, alignItems: 'center' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, color: '#b73c2f', marginBottom: 12 },
  notificationText: { color: '#956a41', fontSize: 15, marginBottom: 8 },
});