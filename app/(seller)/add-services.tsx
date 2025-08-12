'use client';

import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Camera, Eye, ImagePlus, Plus, ScrollText, Wallet, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { hybridDB } from '@/services/HybridDatabaseService';
import { useAuth } from '@/contexts/AuthContext';

export default function AddService() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();

  const handleUploadPhotos = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.permission_required'),
          t('seller.gallery_permission_message')
        );
        return;
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing to allow multiple selection
        allowsMultipleSelection: true, // Enable multiple selection
        selectionLimit: 10, // Limit to 10 photos
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Add all selected images to the photos array
        const newPhotos = result.assets.map(asset => asset.uri);
        setPhotos(prev => {
          // Filter out duplicates
          const existingUris = new Set(prev);
          const uniqueNewPhotos = newPhotos.filter(uri => !existingUris.has(uri));
          return [...prev, ...uniqueNewPhotos];
        });
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      Alert.alert(t('common.error'), t('seller.upload_error'));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddService = async () => {
    if (!title || !description) {
      Alert.alert(t('common.error'), t('seller.fill_required_fields'));
      return;
    }
    try {
      const price = minPrice && maxPrice ? `₹${minPrice} - ₹${maxPrice}` : '';
      await hybridDB.createService({
        title,
        description,
        price,
        category: '',
        sellerId: user?.id || 'demo-seller',
        images: photos,
      });
      Alert.alert(t('common.success'), t('seller.service_added_successfully'));
      router.push('/(seller)/tabs/services');
    } catch (error) {
      Alert.alert(t('common.error'), t('seller.failed_to_add_service'));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('seller.add_new_service')}</Text>

      {/* Intro Card */}
      <View style={styles.introCard}>
        <View style={styles.introHeader}>
          <View style={styles.plusIcon}>
            <Plus size={20} color="#fff2e1" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>{t('seller.create_your_service_listing')}</Text>
            <Text style={styles.introText}>
              {t('seller.add_detailed_information_description')}
            </Text>
          </View>
        </View>
      </View>

      {/* Service Title */}
      <View style={styles.card}>
        <Text style={styles.label}>{t('seller.service_title')} *</Text>
        <TextInput
          placeholder={t('seller.service_title_placeholder')}
          placeholderTextColor="#956a41aa"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.hint}>{t('seller.use_clear_specific_titles')}</Text>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={styles.label}>{t('seller.service_description')} *</Text>
        <TextInput
          placeholder={t('seller.describe_your_service_placeholder')}
          placeholderTextColor="#956a41aa"
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.hint}>
          {t('seller.include_details_about_materials')}
        </Text>
      </View>

      {/* Price Range */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Wallet size={18} color="#956a41" style={{ marginRight: 6 }} />
          <Text style={styles.cardHeaderText}>{t('seller.price_range_optional')}</Text>
        </View>
        <View style={styles.priceRow}>
          <View style={styles.priceInputBox}>
            <Text style={styles.priceLabel}>{t('seller.minimum_price')}</Text>
            <TextInput
              placeholder="₹ 1000"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
              style={styles.priceInput}
              placeholderTextColor="#956a41aa"
            />
          </View>
          <View style={styles.priceInputBox}>
            <Text style={styles.priceLabel}>{t('seller.maximum_price')}</Text>
            <TextInput
              placeholder="₹ 5000"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
              style={styles.priceInput}
              placeholderTextColor="#956a41aa"
            />
          </View>
        </View>
        <Text style={styles.hint}>
          💡 {t('seller.customers_prefer_transparent_pricing')}
        </Text>
      </View>

      {/* Upload Photos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ImagePlus size={18} color="#956a41" style={{ marginRight: 6 }} />
          <Text style={styles.cardHeaderText}>{t('seller.service_photos')} ({photos.length})</Text>
        </View>
        <TouchableOpacity style={styles.uploadBox} onPress={handleUploadPhotos}>
          <Camera size={30} color="#e19b3c" />
          <Text style={styles.uploadText}>{t('seller.add_photos_of_your_work')}</Text>
          <Text style={styles.uploadSubtext}>{t('seller.click_to_upload_images_or_videos')}</Text>
        </TouchableOpacity>
        {photos.length > 0 && (
          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoThumbnailContainer}>
                <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <X size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.hint}>
          📷 {t('seller.services_with_photos_get_10x_more_inquiries')}
        </Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleAddService}>
        <Plus size={18} color="white" />
        <Text style={styles.primaryButtonText}>{t('seller.add_service')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Eye size={18} color="#b73c2f" />
        <Text style={styles.secondaryButtonText}>{t('seller.show_preview')}</Text>
      </TouchableOpacity>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <View style={styles.cardHeader}>
          <ScrollText size={18} color="#956a41" style={{ marginRight: 6 }} />
          <Text style={styles.tipsTitle}>{t('seller.tips_for_great_service_listings')}:</Text>
        </View>
        <View>
          <Text style={styles.bullet}>• {t('seller.use_specific_titles_that_customers_search_for')}</Text>
          <Text style={styles.bullet}>• {t('seller.include_materials_timeline_and_whats_included')}</Text>
          <Text style={styles.bullet}>• {t('seller.add_high_quality_photos_of_completed_work')}</Text>
          <Text style={styles.bullet}>• {t('seller.set_competitive_but_fair_pricing_ranges')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff2e1',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#b73c2f',
    marginBottom: 16,
  },
  introCard: {
    backgroundColor: '#fff2e1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  plusIcon: {
    backgroundColor: '#b73c2f',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
    marginTop: 4,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 4,
  },
  introText: {
    fontSize: 13,
    color: '#956a41',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    backgroundColor: '#fff2e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#956a41',
  },
  hint: {
    fontSize: 12,
    color: '#956a41aa',
    marginTop: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    fontWeight: 'bold',
    color: '#956a41',
    fontSize: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priceInputBox: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#956a41',
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: '#fff2e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#956a41',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#e19b3c',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  uploadText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#956a41',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#956a41aa',
    marginTop: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  photoThumbnailContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#b73c2f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e19b3c',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#b73c2f',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsCard: {
    backgroundColor: '#fff2e1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tipsTitle: {
    fontWeight: 'bold',
    color: '#956a41',
    fontSize: 14,
  },
  bullet: {
    color: '#956a41',
    fontSize: 13,
    marginTop: 6,
  },
});
