import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Play } from 'lucide-react-native';

const portfolioItems = [
  { id: '1', type: 'image', title: 'Living Room Paint', category: 'Painting', file: 'living room paint' },
  { id: '2', type: 'video', title: 'Kitchen Cabinet Work', category: 'Carpentry', file: 'kitchen cabinet work' },
  { id: '3', type: 'image', title: 'Bathroom Plumbing', category: 'Plumbing', file: 'bathroom plumbing' },
  { id: '4', type: 'image', title: 'Wall Design', category: 'Painting', file: 'wall design' },
  { id: '5', type: 'video', title: 'Bamboo Structure', category: 'Bamboo Work', file: 'bamboo structure' },
  { id: '6', type: 'image', title: 'Electrical Work', category: 'Electrical', file: 'electrical work' },
];

// Import all image assets manually
const imageSources: Record<string, any> = {
  'living room paint': require('@/assets/images/living room paint.png'),
  'kitchen cabinet work': require('@/assets/images/kitchen cabinet work.png'),
  'bathroom plumbing': require('@/assets/images/bathroom plumbing.png'),
  'wall design': require('@/assets/images/wall design.png'),
  'bamboo structure': require('@/assets/images/bamboo structure.png'),
  'electrical work': require('@/assets/images/electrical work.png'),
};

export function PortfolioGallery() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {portfolioItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.8}>
            <View style={styles.media}>
              {item.type === 'image' ? (
                <Image
                  source={imageSources[item.file]}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={imageSources[item.file]}
                  style={styles.image}
                  resizeMode="cover"
                >
                </Image>
              )}
              {item.type === 'video' && (
                <View style={styles.playButton}>
                  <Play size={24} color="#fff" fill="#fff" />
                </View>
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  media: {
    height: 120,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b73c2f',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#956a41',
  },
});
