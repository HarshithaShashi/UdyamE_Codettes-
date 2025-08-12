import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface SkillSelectorProps {
  selectedSkill?: string;
  selectedSkills?: string[];
  onSkillSelect: (skillOrSkills: string | string[]) => void;
  multiSelect?: boolean;
}

const skills = ['painting', 'plumbing', 'carpentry', 'bamboo_work', 'electrical', 'masonry'];

export function SkillSelector({ selectedSkill, selectedSkills = [], onSkillSelect, multiSelect = false }: SkillSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSkillSelect = (skill: string) => {
    if (multiSelect) {
      let newSkills = selectedSkills.includes(skill)
        ? selectedSkills.filter(s => s !== skill)
        : [...selectedSkills, skill];
      onSkillSelect(newSkills);
    } else {
    onSkillSelect(skill);
    setIsOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.selectedText}>
          {multiSelect
            ? (selectedSkills.length > 0
                ? selectedSkills.map(s => t(s)).join(', ')
                : t('select_skill'))
            : (selectedSkill ? t(selectedSkill) : t('select_skill'))}
        </Text>
        <ChevronDown size={20} color="#956a41" />
      </TouchableOpacity>
      {multiSelect && selectedSkills.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {selectedSkills.map(skill => (
            <View key={skill} style={{ backgroundColor: '#e19b3c', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 4 }}>
              <Text style={{ color: '#fff', fontSize: 12 }}>{t(skill)}</Text>
            </View>
          ))}
        </View>
      )}
      {isOpen && (
        <View style={styles.dropdown}>
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[styles.option, multiSelect && selectedSkills.includes(skill) && { backgroundColor: '#fef7f0' }]}
              onPress={() => handleSkillSelect(skill)}
            >
              <Text style={styles.optionText}>{t(skill)}</Text>
              {multiSelect && selectedSkills.includes(skill) && (
                <Text style={{ color: '#b73c2f', marginLeft: 8 }}>&#10003;</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  selector: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    color: '#374151',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
});