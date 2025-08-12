import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Camera, Video, ImagePlus, Info } from 'lucide-react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';

export default function SellerUploadWork() {
  const [media, setMedia] = useState<Array<{ type: string; uri: string }>>([]);
  const [description, setDescription] = useState('');
  const { t } = useLanguage();

  const handleUpload = async () => {
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

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMedia([...media, { 
          type: asset.type === 'video' ? 'video' : 'image', 
          uri: asset.uri 
        }]);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('seller.upload_error'));
    }
  };

  const goToProfile = () => {
    router.replace('/(seller)/tabs/profile');
  };

  const goToLocationHandler = () => {
    // Navigate to LocationHandler for seller
    // @ts-ignore - expo-router type issue
    router.push('/LocationHandler?userType=seller');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff2e1' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* 1. Header */}
        <View style={styles.iconCircle}>
          <Camera color="#fff" size={28} />
        </View>
        <Text style={styles.title}>{t('seller.show_your_work')}</Text>
        <Text style={styles.subtext}>
          {t('seller.upload_photos_or_videos_description')}
        </Text>

        {/* 2. Why Upload Card */}
        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>{t('seller.why_upload_work_samples')}</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• {t('seller.get_3x_more_customer_inquiries')}</Text>
            <Text style={styles.bulletItem}>• {t('seller.build_trust_and_credibility')}</Text>
            <Text style={styles.bulletItem}>• {t('seller.showcase_your_skill_quality')}</Text>
            <Text style={styles.bulletItem}>• {t('seller.stand_out_from_other_udyamis')}</Text>
          </View>
        </View>

        {/* 3. Upload Card */}
        <TouchableOpacity style={styles.uploadCard} onPress={handleUpload}>
          <ImagePlus color="#e19b3c" size={36} />
          <Text style={styles.uploadText}>{t('seller.choose_files')}</Text>
          <Text style={styles.uploadNote}>{t('seller.file_formats_and_size')}</Text>
        </TouchableOpacity>

        {/* Uploaded Preview */}
        <View style={styles.previewRow}>
          {media.map((item, idx) => (
            <View key={idx} style={styles.previewCard}>
              {item.type === 'image' ? (
                <Image source={{ uri: item.uri }} style={styles.previewImg} />
              ) : (
                <Video color="#b73c2f" size={32} />
              )}
            </View>
          ))}
        </View>

        {/* 4. Description Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionLabel}>
            {t('seller.tell_us_about_your_work_optional')}
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={5}
            placeholder={t('seller.describe_the_projects_placeholder')}
            placeholderTextColor="#b68a5d"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* 5. Navigation Buttons */}
        <TouchableOpacity style={styles.continueBtn} onPress={goToLocationHandler}>
          <Text style={styles.continueText}>{t('seller.done')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={goToLocationHandler}>
          <Text style={styles.skipText}>{t('seller.skip_for_now_add_photos_later')}</Text>
        </TouchableOpacity>

        {/* 6. Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{t('seller.tips_for_great_work_photos')}</Text>
          <Text style={styles.tip}>• {t('seller.take_photos_in_good_lighting')}</Text>
          <Text style={styles.tip}>• {t('seller.show_before_and_after_results')}</Text>
          <Text style={styles.tip}>• {t('seller.include_close_up_details')}</Text>
          <Text style={styles.tip}>• {t('seller.add_photos_of_you_working')}</Text>
        </View>

        {/* 7. Progress Indicator */}
        <View style={styles.progressDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    backgroundColor: '#e19b3c',
    alignSelf: 'center',
    padding: 16,
    borderRadius: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#b73c2f',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BalooBhai2-Regular',
  },
  subtext: {
    color: '#956a41',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  whyCard: {
    backgroundColor: '#ffe9d6',
    borderRadius: 16,
    borderColor: '#e19b3c',
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 8,
  },
  bulletList: {
    gap: 4,
  },
  bulletItem: {
    color: '#956a41',
    fontSize: 14,
  },
  uploadCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e19b3c',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
  },
  uploadNote: {
    fontSize: 12,
    color: '#956a41',
    marginTop: 4,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  previewCard: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  descriptionBox: {
    backgroundColor: '#fff8ec',
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
  },
  descriptionLabel: {
    color: '#956a41',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    color: '#333',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e4cdb4',
  },
  continueBtn: {
    backgroundColor: '#b73c2f',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipBtn: {
    borderWidth: 1,
    borderColor: '#956a41',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  skipText: {
    color: '#956a41',
    fontSize: 15,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#fffaf2',
    borderWidth: 1,
    borderColor: '#e19b3c',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
  },
  tipsTitle: {
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 10,
    fontSize: 15,
  },
  tip: {
    color: '#956a41',
    fontSize: 14,
    marginBottom: 4,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#e19b3c',
    borderRadius: 5,
  },
});
