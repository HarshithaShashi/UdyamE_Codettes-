import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, Heart, FileText, Bell } from 'lucide-react-native';

const mockNotifications = [
  { id: 1, text: 'Profile updated successfully.' },
  { id: 2, text: 'You have a new follower.' },
];

export default function BuyerProfile() {
  const router = useRouter();
  const { t } = useLanguage();
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/role-selection');
  };

  const menuItems = [
    { icon: FileText, title: t('buyer.my_job_posts'), screen: 'my-posts' },
    { icon: Bell, title: t('common.notifications'), screen: 'notifications' },
    { icon: Heart, title: t('buyer.following'), screen: 'following' },
    { icon: FileText, title: t('buyer.history'), screen: 'history' },
    { icon: Settings, title: t('buyer.edit_profile'), screen: 'edit-profile' },
    { icon: Settings, title: t('buyer.switch_role'), screen: 'switch-role' },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('common.profile')}</Text>
          <TouchableOpacity style={styles.bell} onPress={() => setShowNotifications(true)}>
            <Bell size={26} color="#b73c2f" />
          </TouchableOpacity>
      </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Priya'}</Text>
          <Text style={styles.phone}>{user?.phoneNumber || '+91 98765 43210'}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <item.icon size={24} color="#b73c2f" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Recently viewed Udyamis section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.recently_viewed_udyamis')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Render mini-cards for recently viewed Udyamis here */}
            <View style={styles.miniCard}><Text>{t('buyer.udyami_1')}</Text></View>
            <View style={styles.miniCard}><Text>{t('buyer.udyami_2')}</Text></View>
            <View style={styles.miniCard}><Text>{t('buyer.udyami_3')}</Text></View>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>{t('common.logout')}</Text>
        </TouchableOpacity>
        <View style={{height: 80}} />
      </ScrollView>
        <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowNotifications(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('common.notifications')}</Text>
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
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative', // Added for bell positioning
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b73c2f',
  },
  bell: { position: 'absolute', right: 20, top: 20, zIndex: 10 },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#b73c2f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#956a41',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#956a41',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#b73c2f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 16,
  },
  miniCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, minWidth: 250, alignItems: 'center' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, color: '#b73c2f', marginBottom: 12 },
  notificationText: { color: '#956a41', fontSize: 15, marginBottom: 8 },
});