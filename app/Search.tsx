import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Search as SearchIcon, MapPin, Filter, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/services/ApiClient';

interface SearchResult {
  id: string;
  name: string;
  skill: string;
  location: string;
  rating: number;
  distance?: number;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Try to get location on component mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
      }
    } catch (error) {
      console.log('Location permission denied or error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert(t('search.enter_search_term'), t('search.please_enter_search_term'));
      return;
    }

    setLoading(true);
    try {
      const searchData = {
        query: searchQuery.trim(),
        location: useLocation && location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : null,
      };

      const response = await apiClient.post('/api/search-by-location', searchData);
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert(t('search.error'), t('search.search_failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleLocationFilter = () => {
    if (!location && useLocation) {
      Alert.alert(
        t('search.location_unavailable'),
        t('search.enable_location_services'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('search.enable_location'), onPress: getCurrentLocation },
        ]
      );
      return;
    }
    setUseLocation(!useLocation);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const renderSearchResult = (result: SearchResult) => (
    <TouchableOpacity key={result.id} style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultName}>{result.name}</Text>
        <Text style={styles.resultRating}>⭐ {result.rating}</Text>
      </View>
      <Text style={styles.resultSkill}>{result.skill}</Text>
      <View style={styles.resultFooter}>
        <Text style={styles.resultLocation}>📍 {result.location}</Text>
        {result.distance && (
          <Text style={styles.resultDistance}>{result.distance}km away</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('search.search_workers')}</Text>
          <Text style={styles.subtitle}>{t('search.find_nearby_workers')}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon color="#956a41" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('search.search_by_skill_or_name')}
              placeholderTextColor="#b68a5d"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X color="#956a41" size={20} />
              </TouchableOpacity>
            )}
          </View>

          {/* Location Filter */}
          <TouchableOpacity
            style={[styles.locationButton, useLocation && styles.locationButtonActive]}
            onPress={toggleLocationFilter}
          >
            <MapPin color={useLocation ? "#fff" : "#e19b3c"} size={18} />
            <Text style={[styles.locationButtonText, useLocation && styles.locationButtonTextActive]}>
              {useLocation ? t('search.location_enabled') : t('search.use_location')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchButton, (!searchQuery.trim() || loading) && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? t('search.searching') : t('search.search')}
          </Text>
        </TouchableOpacity>

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {t('search.results_found', { count: results.length })}
              </Text>
              <TouchableOpacity style={styles.filterButton}>
                <Filter color="#956a41" size={18} />
                <Text style={styles.filterButtonText}>{t('search.filter')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultsList}>
              {results.map(renderSearchResult)}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && searchQuery.trim() && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('search.no_results_found')}</Text>
            <Text style={styles.emptyStateSubtext}>{t('search.try_different_search')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#b73c2f',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#956a41',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e19b3c',
    backgroundColor: '#fff',
  },
  locationButtonActive: {
    backgroundColor: '#e19b3c',
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#e19b3c',
  },
  locationButtonTextActive: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#b73c2f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b73c2f',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e19b3c',
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#956a41',
  },
  resultsList: {
    gap: 12,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
  },
  resultRating: {
    fontSize: 14,
    color: '#956a41',
  },
  resultSkill: {
    fontSize: 14,
    color: '#956a41',
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLocation: {
    fontSize: 12,
    color: '#956a41',
  },
  resultDistance: {
    fontSize: 12,
    color: '#e19b3c',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#956a41',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#b68a5d',
    textAlign: 'center',
  },
}); 