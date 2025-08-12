import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ribbon } from 'lucide-react-native'; // you can replace with any badge icon

const { width } = Dimensions.get('window');

const allSkills = [
  'Carpentry', 'Plumbing', 'Painting',
  'Bamboo Work', 'Pottery', 'Weaving',
  'Tailoring', 'Metal Work', 'Masonry',
  'Electrical', 'Landscaping', 'Roofing',
];

const experienceLevels = [
  {
    label: 'Beginner',
    desc: 'Just starting out or learning (0–2 years)',
  },
  {
    label: 'Intermediate',
    desc: 'Good experience with quality work (2–5 years)',
  },
  {
    label: 'Expert',
    desc: 'Highly skilled with proven track record (5+ years)',
  },
];

const yearOptions = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '5–10 years',
  '10+ years',
];

export default function SelectSkillsScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();

  const [primarySkill, setPrimarySkill] = useState('');
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');

  // Function to format skill display with both Kannada and English
  const formatSkillDisplay = (skill: string) => {
    const skillKey = skill.toLowerCase().replace(' ', '_');
    const kannadaTranslation = t(`skills.${skillKey}`, skill);
    
    // For Kannada language, show both Kannada and English
    if (currentLanguage === 'kn') {
      return `${kannadaTranslation} (${skill})`;
    }
    
    // For other languages, show the translation
    return kannadaTranslation;
  };

  // Function to check if a skill is disabled in secondary section
  const isSkillDisabled = (skill: string, section: 'primary' | 'secondary') => {
    if (section === 'primary') {
      // In primary section, disable if already selected in secondary
      return additionalSkills.includes(skill);
    } else {
      // In secondary section, disable if already selected as primary
      return primarySkill === skill;
    }
  };

  const togglePrimarySkill = (skill: string) => {
    if (additionalSkills.includes(skill)) {
      Alert.alert(
        t('common.skill_already_selected', 'Skill Already Selected'),
        t('seller.skill_in_secondary', 'This skill is already selected in additional skills. Please remove it from there first.'),
        [{ text: t('common.ok', 'OK') }]
      );
      return;
    }
    setPrimarySkill(skill);
  };

  const toggleAdditionalSkill = (skill: string) => {
    if (primarySkill === skill) {
      Alert.alert(
        t('common.skill_already_selected', 'Skill Already Selected'),
        t('seller.skill_in_primary', 'This skill is already selected as your primary skill. Please choose a different skill.'),
        [{ text: t('common.ok', 'OK') }]
      );
      return;
    }

    if (additionalSkills.includes(skill)) {
      setAdditionalSkills(additionalSkills.filter(s => s !== skill));
    } else if (additionalSkills.length < 3) {
      setAdditionalSkills([...additionalSkills, skill]);
    }
  };

  const handleContinue = () => {
    if (primarySkill && experienceLevel && yearsOfExp) {
      router.push('/upload-work');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Top Section */}
      <View style={styles.topIconWrap}>
        <View style={styles.ribbonCircle}>
          <Ribbon color="#fff" size={28} />
        </View>
      </View>
      <Text style={styles.heading}>{t('seller.whats_your_expertise', 'What\'s your expertise?')}</Text>
      <Text style={styles.subheading}>
        {t('seller.expertise_subtitle', 'Tell us about your skills and experience to help customers find you')}
      </Text>

      {/* Primary Skill */}
      <SectionHeader title={t('seller.primary_skill', 'Primary Skill')} required />
      <Text style={styles.sectionSubtext}>{t('seller.what_are_you_best_at', 'What are you best at?')}</Text>
      <View style={styles.skillGrid}>
        {allSkills.map(skill => (
          <TouchableOpacity
            key={`primary-${skill}`}
            onPress={() => togglePrimarySkill(skill)}
            style={[
              styles.skillCard,
              primarySkill === skill && styles.selectedCard,
              isSkillDisabled(skill, 'primary') && styles.disabledCard,
            ]}
            disabled={isSkillDisabled(skill, 'primary')}
          >
            <Text
              style={[
                styles.skillText,
                primarySkill === skill && styles.selectedText,
                isSkillDisabled(skill, 'primary') && styles.disabledText,
              ]}
            >
              {formatSkillDisplay(skill)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Additional Skills */}
      <SectionHeader title={t('seller.additional_skills', 'Additional Skills')} optional />
      <Text style={styles.sectionSubtext}>{t('seller.select_up_to_3', 'Select up to 3 additional skills')}</Text>
      <View style={styles.skillGrid}>
        {allSkills.map(skill => (
          <TouchableOpacity
            key={`additional-${skill}`}
            onPress={() => toggleAdditionalSkill(skill)}
            style={[
              styles.skillCard,
              additionalSkills.includes(skill) && styles.selectedCard,
              isSkillDisabled(skill, 'secondary') && styles.disabledCard,
            ]}
            disabled={isSkillDisabled(skill, 'secondary')}
          >
            <Text
              style={[
                styles.skillText,
                additionalSkills.includes(skill) && styles.selectedText,
                isSkillDisabled(skill, 'secondary') && styles.disabledText,
              ]}
            >
              {formatSkillDisplay(skill)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Experience Level */}
      <SectionHeader title={t('seller.experience_level', 'Experience Level')} required />
      <Text style={styles.sectionSubtext}>{t('seller.select_your_level', 'Select your experience level')}</Text>
      {experienceLevels.map(level => (
        <TouchableOpacity
          key={level.label}
          onPress={() => setExperienceLevel(level.label)}
          style={[
            styles.expCard,
            experienceLevel === level.label && styles.selectedCard,
          ]}
        >
          <Text style={[styles.expTitle, experienceLevel === level.label && styles.selectedText]}>
            {t(`seller.${level.label.toLowerCase()}`, level.label)}
          </Text>
          <Text style={styles.expDesc}>
            {t(`seller.${level.label.toLowerCase()}_desc`, level.desc)}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Years of Experience */}
      <SectionHeader title={t('seller.years_of_experience', 'Years of Experience')} required />
      <Text style={styles.sectionSubtext}>{t('seller.how_long_have_you_worked', 'How long have you been working?')}</Text>
      <View style={styles.yearsWrap}>
        {yearOptions.map(year => (
          <TouchableOpacity
            key={year}
            onPress={() => setYearsOfExp(year)}
            style={[
              styles.yearBtn,
              yearsOfExp === year && styles.selectedCard,
            ]}
          >
            <Text style={[styles.yearText, yearsOfExp === year && styles.selectedText]}>
              {t(`seller.${year.toLowerCase().replace(/[^a-z0-9]/g, '_')}`, year)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueBtn,
          (!primarySkill || !experienceLevel || !yearsOfExp) && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!primarySkill || !experienceLevel || !yearsOfExp}
      >
        <Text style={styles.continueText}>{t('common.continue', 'Continue')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const SectionHeader = ({ title, required, optional }: { title: string; required?: boolean; optional?: boolean }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {required && <Text style={styles.pillRequired}>{t('common.required', 'Required')}</Text>}
      {optional && <Text style={styles.pillOptional}>{t('common.optional', 'Optional')}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
  },
  topIconWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  ribbonCircle: {
    backgroundColor: '#e19b3c',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 6,
    fontFamily: 'BalooBhai2-Regular',
  },
  subheading: {
    textAlign: 'center',
    fontSize: 14,
    color: '#956a41',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginRight: 8,
  },
  pillRequired: {
    backgroundColor: '#fff',
    color: '#b73c2f',
    borderColor: '#b73c2f',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  pillOptional: {
    backgroundColor: '#fff',
    color: '#956a41',
    borderColor: '#956a41',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  sectionSubtext: {
    color: '#956a41',
    fontSize: 13,
    marginBottom: 10,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillCard: {
    width: width * 0.28,
    marginBottom: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#fff2e1',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#956a41',
    backgroundColor: '#fffaf2',
  },
  disabledCard: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  skillText: {
    color: '#b73c2f',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedText: {
    color: '#e19b3c',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
  expCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderColor: '#fff2e1',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  expTitle: {
    fontSize: 15,
    color: '#b73c2f',
    fontWeight: '600',
    marginBottom: 4,
  },
  expDesc: {
    fontSize: 13,
    color: '#956a41',
  },
  yearsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  yearBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 10,
    borderColor: '#fff2e1',
    borderWidth: 1.5,
  },
  yearText: {
    color: '#b73c2f',
    fontSize: 13,
    fontWeight: '500',
  },
  continueBtn: {
    marginBottom: 32,
    backgroundColor: '#b73c2f',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#e19b3c',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  continueText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
