'use client';

import { useRouter } from 'expo-router';
import { Plus, Star, Bell } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationBadge from '@/components/NotificationBadge';
import { hybridDB } from '@/services/HybridDatabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { mockServices } from '@/data/mockData';

export default function SellerServices() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      let userServices = [];
      if (user?.id) {
        userServices = await hybridDB.getServicesBySeller(user.id);
      } else {
        userServices = await hybridDB.getServices();
      }
      if (!userServices || userServices.length === 0) {
        setServices(mockServices);
      } else {
        setServices(userServices);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Notifications */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.bell}>
          <Bell size={26} color="#b73c2f" />
          <NotificationBadge />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>{t('seller.my_services')}</Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(seller)/add-services')}
      >
        <Plus size={18} color="white" />
        <Text style={styles.addButtonText}>{t('seller.add_new_service')}</Text>
      </TouchableOpacity>

      {/* Service Cards */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading', 'Loading services...')}</Text>
        </View>
      ) : services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('seller.no_services', 'No services yet')}</Text>
          <Text style={styles.emptySubtext}>{t('seller.add_first_service', 'Add your first service to get started')}</Text>
        </View>
      ) : (
        services.map((service) => (
          <View key={service.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.title}>{service.title}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#e19b3c" />
                <Text style={styles.ratingText}>4.5</Text>
                <Text style={styles.jobText}>0 {t('seller.jobs_done')}</Text>
              </View>
            </View>

            <Text style={styles.price}>{service.price}</Text>
            <Text style={styles.description}>{service.description}</Text>

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>{t('seller.edit_service')}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff2e1',
    padding: 16,
    paddingTop: 32,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  bell: {
    position: 'relative',
  },
  pageTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#b73c2f',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#b73c2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b73c2f',
    flex: 1,
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
    color: '#b73c2f',
    marginLeft: 4,
  },
  jobText: {
    fontSize: 12,
    color: '#956a41',
    marginLeft: 6,
  },
  price: {
    fontSize: 14,
    color: '#956a41',
    marginTop: 2,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#fff5e8',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  editText: {
    fontWeight: '600',
    color: '#956a41',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#956a41',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#b73c2f',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#956a41',
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    color: '#956a41',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
});
