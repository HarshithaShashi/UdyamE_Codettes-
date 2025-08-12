import React from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterChipsProps {
  filters: string[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function FilterChips({ filters, selectedFilters, onFilterChange }: FilterChipsProps) {
  const { t } = useLanguage();

  const toggleFilter = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    onFilterChange(newFilters);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilters.includes(filter);
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => toggleFilter(filter)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
              {t(filter)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  content: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedChip: {
    backgroundColor: '#b73c2f',
    borderColor: '#b73c2f',
  },
  chipText: {
    fontSize: 14,
    color: '#956a41',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fff',
  },
});