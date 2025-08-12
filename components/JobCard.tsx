import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, MapPin, DollarSign, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface Job {
  id: string;
  title: string;
  description: string;
  skill: string;
  budget: string;
  timeline: string;
  location: string;
  postedBy: string;
  postedAt: string;
}

interface JobCardProps {
  job: Job;
  showActions?: boolean;
}

export function JobCard({ job, showActions = false }: JobCardProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.skillBadge}>
          <Text style={styles.skillText}>{job.skill}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color="#e19b3c" />
          <Text style={styles.detailText}>{job.budget}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#956a41" />
          <Text style={styles.detailText}>{job.timeline}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color="#956a41" />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.postedBy}>{t('common.posted_by', 'Posted by')} {job.postedBy}</Text>
        <Text style={styles.postedAt}>{job.postedAt}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton}>
            <X size={16} color="#dc2626" />
            <Text style={styles.rejectText}>{t('common.skip', 'Skip')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <CheckCircle size={16} color="#fff" />
            <Text style={styles.acceptText}>{t('common.accept', 'Accept')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b73c2f',
    flex: 1,
    marginRight: 8,
  },
  skillBadge: {
    backgroundColor: '#fef7f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e19b3c',
  },
  skillText: {
    color: '#e19b3c',
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#956a41',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#956a41',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postedBy: {
    fontSize: 12,
    color: '#956a41',
  },
  postedAt: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  rejectText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b73c2f',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  acceptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});