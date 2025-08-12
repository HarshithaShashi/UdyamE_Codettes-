import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { JobCard } from '@/components/JobCard';
import { FilterChips } from '@/components/FilterChips';
import { MapPin, ChevronDown, ChevronUp, CheckCircle, XCircle, Bell } from 'lucide-react-native';
import NotificationBadge from '@/components/NotificationBadge';
import { hybridDB } from '@/services/HybridDatabaseService';

// Updated filters to be based on time/timeline
const timelineFilters = ['Urgent work', 'This week', 'Next month'];

export default function JobBoardScreen() {
  const { t } = useLanguage();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [declinedJobs, setDeclinedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await hybridDB.getJobs();
      setJobs(allJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on timelineTag instead of skill
  const filteredJobs = jobs.filter(job =>
    (selectedFilters.length === 0 || selectedFilters.includes(job.timeline)) &&
    !declinedJobs.includes(job.id)
  );

  const handleDecline = (jobId: string) => {
    setDeclinedJobs(prev => [...prev, jobId]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{t('seller.available_jobs')}</Text>
          <TouchableOpacity style={styles.bell}>
            <Bell size={26} color="#b73c2f" />
            <NotificationBadge />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>{t('seller.find_work_opportunities')}</Text>
        <FilterChips
          filters={timelineFilters}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>{t('seller.today_stats')}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>{t('seller.new_jobs')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>{t('seller.applications')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>{t('seller.accepted')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.jobsSection}>
          <Text style={styles.sectionTitle}>
            {filteredJobs.length} {t('seller.jobs_available')}
          </Text>
          {filteredJobs.map((job) => {
            const isOpen = expanded === job.id;
            return (
              <View key={job.id} style={styles.jobCard}>
                <TouchableOpacity style={styles.jobHeader} onPress={() => setExpanded(isOpen ? null : job.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.row}>
                      <Text style={styles.skillTag}>{t(`skills.${job.skill.toLowerCase()}`, job.skill)}</Text>
                      <MapPin color="#e19b3c" size={16} style={{ marginLeft: 8, marginRight: 2 }} />
                      <Text style={styles.location}>{job.location}</Text>
                    </View>
                    <Text style={styles.timeline}>{job.timeline}</Text>
                    <Text style={styles.price}>{job.budget}</Text>
                  </View>
                  {isOpen ? <ChevronUp color="#b73c2f" /> : <ChevronDown color="#b73c2f" />}
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.jobDetails}>
                    <Text style={styles.jobDesc}>{job.description}</Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.acceptBtn}>
                        <CheckCircle color="#4CAF50" size={22} />
                        <Text style={styles.acceptText}>{t('common.accept', 'Accept')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(job.id)}>
                        <XCircle color="#aaa" size={22} />
                        <Text style={styles.declineText}>{t('common.decline', 'Decline')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#fcefe8' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#b73c2f' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  bell: { position: 'relative' },
  content: { padding: 16 },
  statsCard: {
    backgroundColor: '#fef3ec',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#b73c2f' },
  statLabel: { fontSize: 12, color: '#888' },
  jobsSection: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  jobCard: {
    backgroundColor: '#fff3f1',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
  },
  jobHeader: { flexDirection: 'row', alignItems: 'center' },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  skillTag: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#ffd8d1',
    borderRadius: 6,
    color: '#b73c2f',
  },
  location: { fontSize: 12, color: '#555' },
  timeline: { fontSize: 12, color: '#666', marginTop: 4 },
  price: { fontSize: 14, fontWeight: 'bold', marginTop: 4, color: '#b73c2f' },
  jobDetails: { marginTop: 12 },
  jobDesc: { fontSize: 14, color: '#444', marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  declineBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  acceptText: { color: '#4CAF50', fontWeight: '600' },
  declineText: { color: '#888', fontWeight: '600' },
});
