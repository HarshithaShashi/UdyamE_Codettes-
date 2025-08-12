'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react-native';
import { hybridDB } from '@/services/HybridDatabaseService';
import { mockJobs } from '@/data/mockData';

interface JobPost {
  id: string;
  title: string;
  category: string;
  location: string;
  salary: string;
  applicants: number;
  postedAgo: string;
  status: 'active' | 'completed';
}

export default function JobPostingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobPosts();
  }, []);

  const loadJobPosts = async () => {
    try {
      setLoading(true);
      const jobs = await hybridDB.getJobs();
      let formattedJobs: JobPost[] = [];
      if (!jobs || jobs.length === 0) {
        formattedJobs = mockJobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          category: job.skill,
          location: job.location,
          salary: job.budget,
          applicants: 0,
          postedAgo: job.postedAt || 'Just now',
          status: 'active',
        }));
      } else {
        formattedJobs = jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          category: job.skill,
          location: job.location,
          salary: job.budget,
          applicants: job.applicants?.length || 0,
          postedAgo: getTimeAgo(job.createdAt),
          status: job.status as 'active' | 'completed',
        }));
      }
      setJobPosts(formattedJobs);
    } catch (error) {
      console.error('Error loading job posts:', error);
      setJobPosts(mockJobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        category: job.skill,
        location: job.location,
        salary: job.budget,
        applicants: 0,
        postedAgo: job.postedAt || 'Just now',
        status: 'active',
      })));
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const statusColors: Record<'active' | 'completed', string> = {
    active: '#43b06d',
    completed: '#597ee3',
  };

  const categoryColors: Record<string, string> = {
    Carpentry: '#956a41',
    Plumbing: '#956a41',
    Painting: '#956a41',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('buyer.my_job_posts', 'My Job Posts')}</Text>
      <Text style={styles.subheading}>{jobPosts.length} {t('buyer.posts', 'posts')}</Text>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('common.loading', 'Loading jobs...')}</Text>
          </View>
        ) : jobPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('buyer.no_jobs', 'No job posts yet')}</Text>
            <Text style={styles.emptySubtext}>{t('buyer.post_first_job', 'Post your first job to get started')}</Text>
          </View>
        ) : (
          jobPosts.map((job, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text
                  style={[styles.status, { backgroundColor: statusColors[job.status] }]}
                >
                  {t(`job_status.${job.status}`, job.status)}
                </Text>
              </View>

              <View style={styles.rowAlign}>
                <Text
                  style={[
                    styles.category,
                    { backgroundColor: categoryColors[job.category] || '#956a41' },
                  ]}
                >
                  {t(`skills.${job.category.toLowerCase()}`, job.category)}
                </Text>
                <MapPin size={14} color="#956a41" />
                <Text style={styles.location}>{job.location}</Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.salary}>{job.salary}</Text>
                <Text style={styles.meta}>{job.applicants} {t('buyer.applicants', 'applicants')}</Text>
              </View>

              <Text style={styles.postedAgo}>{job.postedAgo}</Text>
            </View>
          ))
        )}
        
        <View style={styles.buttonSpacer} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.fullButton}
          onPress={() => router.push('/(buyer)/post-job')}
        >
          <Text style={styles.fullButtonText}>{t('buyer.post_a_job', 'Post a Job')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  heading: {
    textAlign: 'center',
    color: '#b73c2f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheading: {
    textAlign: 'center',
    color: '#956a41',
    fontSize: 14,
    marginBottom: 16,
  },
  scrollContainer: {
    paddingBottom: 150,
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    color: '#3b2f2f',
    fontSize: 16,
    fontWeight: '600',
    width: '75%',
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    color: 'white',
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    color: 'white',
    marginRight: 8,
  },
  location: {
    color: '#956a41',
    marginLeft: 4,
    fontSize: 14,
  },
  salary: {
    color: '#3b2f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  meta: {
    color: '#b67c51',
    fontSize: 14,
  },
  postedAgo: {
    color: '#b67c51',
    fontSize: 12,
    marginTop: 8,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 40,
    backgroundColor: '#e19b3c',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullButton: {
    backgroundColor: '#e19b3c',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#d18a2a',
  },
  fullButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  buttonSpacer: {
    height: 100,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff2e1',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#956a41',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#b73c2f',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#956a41',
    fontSize: 14,
    textAlign: 'center',
  },
});
