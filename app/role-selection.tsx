import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { ShoppingBag, Hammer } from 'lucide-react-native';

export default function RoleSelection() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setUserRole } = useUser();
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    setSelectedRole(role);
    setUserRole(role);
    setTimeout(() => {
      router.replace('/auth');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('role_selection.choose_role')}</Text>
        <Text style={styles.subtitle}>{t('role_selection.role_subtitle')}</Text>
        
        <View style={styles.roleGrid}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'buyer' && styles.selectedCard
            ]}
            onPress={() => handleRoleSelect('buyer')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <ShoppingBag size={48} color="#b73c2f" />
            </View>
            <Text style={styles.roleTitle}>{t('role_selection.buyer')}</Text>
            <Text style={styles.roleDescription}>{t('role_selection.buyer_description')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'seller' && styles.selectedCard
            ]}
            onPress={() => handleRoleSelect('seller')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Hammer size={48} color="#b73c2f" />
            </View>
            <Text style={styles.roleTitle}>{t('role_selection.seller')}</Text>
            <Text style={styles.roleDescription}>{t('role_selection.seller_description')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    marginBottom: 48,
  },
  roleGrid: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#b73c2f',
    backgroundColor: '#fef7f0',
  },
  iconContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#956a41',
    textAlign: 'center',
    lineHeight: 20,
  },
});