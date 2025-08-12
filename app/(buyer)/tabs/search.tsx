import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBar } from '@/components/SearchBar';
import { SellerCard } from '@/components/SellerCard';
import { FilterChips } from '@/components/FilterChips';
import { mockSellers } from '@/data/mockData';
import { Bell } from 'lucide-react-native';

const skillFilters = ['painting', 'plumbing', 'carpentry', 'bamboo_work', 'electrical'];
const mockNotifications = [
  { id: 1, text: 'New seller in your area.' },
  { id: 2, text: 'You have 2 new messages.' },
];

export default function BuyerSearch() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredSellers = mockSellers.filter(seller => {
    const matchesSearch = !searchQuery || 
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilters.length === 0 ||
      selectedFilters.some(filter => seller.skills.includes(filter));

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 100}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>{t('buyer.search_workers')}</Text>
          <TouchableOpacity style={styles.bell} onPress={() => setShowNotifications(true)}>
            <Bell size={26} color="#b73c2f" />
          </TouchableOpacity>
          <SearchBar placeholder={t('buyer.search_by_skill')} value={searchQuery} onChangeText={setSearchQuery} />
        <FilterChips 
          filters={skillFilters}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
      </View>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSellers.length} {t('buyer.workers_found')}
          </Text>
        </View>
        <View style={styles.grid}>
          {filteredSellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} style={styles.gridCard} />
          ))}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 32,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: '#956a41',
    fontWeight: '500',
  },
  grid: {
    gap: 16,
  },
  gridCard: {
    width: '100%',
  },
  bell: { position: 'absolute', right: 20, top: 20, zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, minWidth: 250, alignItems: 'center' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, color: '#b73c2f', marginBottom: 12 },
  notificationText: { color: '#956a41', fontSize: 15, marginBottom: 8 },
});