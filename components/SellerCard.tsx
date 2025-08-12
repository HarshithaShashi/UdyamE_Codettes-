import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Star, MapPin, Heart } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';

interface Seller {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  location: string;
  followers: number;
  isFollowing?: boolean;
}

interface SellerCardProps {
  seller: Seller;
  style?: ViewStyle;
}

export function SellerCard({ seller, style }: SellerCardProps) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{seller.name.charAt(0)}</Text>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Heart size={16} color={seller.isFollowing ? "#b73c2f" : "#956a41"} 
                fill={seller.isFollowing ? "#b73c2f" : "transparent"} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.name}>{seller.name}</Text>
      
      <View style={styles.skillsContainer}>
        {seller.skills.slice(0, 2).map((skill, index) => (
          <View key={index} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Star size={14} color="#e19b3c" fill="#e19b3c" />
          <Text style={styles.statText}>{seller.rating}</Text>
        </View>
        <View style={styles.statItem}>
          <MapPin size={14} color="#956a41" />
          <Text style={styles.statText}>{seller.location}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.viewButton} onPress={() => router.push({ pathname: '/(buyer)/udyami-profile', params: { sellerId: seller.id } })}>
        <Text style={styles.viewButtonText}>{t('common.view_profile', 'View Profile')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#b73c2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  followButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#fef7f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    color: '#e19b3c',
    fontSize: 10,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#956a41',
  },
  viewButton: {
    backgroundColor: '#b73c2f',
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});