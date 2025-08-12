import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { CheckCircle, IdCard, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 24,
    color: '#b73c2f',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'BalooBhai2-Regular'
  },
  microcopy: {
    color: '#956a41',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#b73c2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fff2e1'
  },
  label: {
    color: '#b73c2f',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e19b3c',
    padding: 12,
    fontSize: 16,
    fontFamily: 'BalooBhai2-Regular'
  },
  helper: {
    color: '#956a41',
    fontSize: 12,
    marginTop: 4
  },
  continueBtn: {
    backgroundColor: '#e19b3c',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#e19b3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooBhai2-Regular'
  },
  btnDisabled: {
    opacity: 0.5
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dateInput: {
    flex: 1
  }
});

type FieldKey = 'name' | 'dob' | 'address' | 'aadhaar' | 'whatsapp';

export default function SellerPersonalDetails() {
  const router = useRouter();
  const { t } = useLanguage();

  const [fields, setFields] = useState({
    name: '', dob: '', address: '', aadhaar: '', whatsapp: ''
  });
  const [valid, setValid] = useState({
    name: false, dob: false, address: false, aadhaar: false, whatsapp: false
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const validate = (key: FieldKey, value: string) => {
    let isValid = false;
    if (key === 'aadhaar') isValid = /^\d{12}$/.test(value);
    else if (key === 'whatsapp') isValid = /^\d{10}$/.test(value);
    else isValid = value.length > 2;
    setValid(v => ({ ...v, [key]: isValid }));
  };

  const handleChange = (key: FieldKey, value: string) => {
    setFields(f => ({ ...f, [key]: value }));
    validate(key, value);
  };

  const allValid = Object.values(valid).every(Boolean);

  const handleContinue = () => {
    if (allValid) {
      router.push('/(seller)/select-skills');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('en-GB');
      handleChange('dob', formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff2e1'}}>
      <ScrollView contentContainerStyle={{padding: 24, paddingBottom: 80}} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>{t('seller.lets_get_to_know_you')}</Text>
        <Text style={styles.microcopy}>{t('seller.your_details_help_us_build_trust')}</Text>

        {/* Name */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('seller.full_name')}</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={fields.name} onChangeText={v => handleChange('name', v)} placeholder={t('seller.enter_your_full_name')} />
            {valid.name && <CheckCircle color="#4CAF50" size={22} />}
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('seller.date_of_birth')}</Text>
          <TouchableOpacity style={styles.dateInputRow} onPress={showDatePickerModal}>
            <TextInput 
              style={[styles.input, styles.dateInput]} 
              value={fields.dob} 
              placeholder="DD/MM/YYYY"
              editable={false}
            />
            <Calendar color="#b73c2f" size={22} />
            {valid.dob && <CheckCircle color="#4CAF50" size={22} />}
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('seller.address')}</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={fields.address} onChangeText={v => handleChange('address', v)} placeholder={t('seller.village_district_state')} />
            {valid.address && <CheckCircle color="#4CAF50" size={22} />}
          </View>
        </View>

        {/* Aadhaar */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('seller.aadhaar_number')}</Text>
          <View style={styles.inputRow}>
            <IdCard color="#b73c2f" size={22} style={{marginRight: 6}} />
            <TextInput
              style={styles.input}
              value={fields.aadhaar}
              onChangeText={v => handleChange('aadhaar', v)}
              placeholder={t('seller.twelve_digit_aadhaar')}
              keyboardType="numeric"
              maxLength={12}
            />
            {valid.aadhaar && <CheckCircle color="#4CAF50" size={22} />}
          </View>
          <Text style={styles.helper}>{t('seller.aadhaar_verification_note')}</Text>
        </View>

        {/* WhatsApp */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('seller.whatsapp_number')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={fields.whatsapp}
              onChangeText={v => handleChange('whatsapp', v)}
              placeholder={t('seller.ten_digit_whatsapp_number')}
              keyboardType="numeric"
              maxLength={10}
            />
            {valid.whatsapp && <CheckCircle color="#4CAF50" size={22} />}
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={[styles.continueBtn, !allValid && styles.btnDisabled]}
          disabled={!allValid}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t('common.continue')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
