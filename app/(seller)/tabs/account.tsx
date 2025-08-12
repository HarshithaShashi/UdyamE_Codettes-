import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Star,
  Phone,
  MapPin,
  Camera,
  LogOut,
  Repeat,
  ChevronDown,
  Bell,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import NotificationBadge from '@/components/NotificationBadge';

export default function SellerAccount() {
  const [followersVisible, setFollowersVisible] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const toggleFollowers = () => setFollowersVisible(!followersVisible);

  const handleLogout = () => {
    router.replace('/role-selection');
  };

  const dummyJobs = [
    { id: 1, title: t('seller.wall_painting'), status: t('seller.ongoing'), client: t('seller.anil_meena'), date: '12–15 Jul', price: '₹1,200' },
    { id: 2, title: t('seller.roof_repair'), status: t('seller.completed'), client: t('seller.ravi_sharma'), date: '1–5 Jul', price: '₹4,000', rating: 4.8, feedback: t('seller.excellent_work') },
    { id: 3, title: t('seller.door_fixing'), status: t('seller.upcoming'), client: t('seller.seema_jain'), date: '30 Jul – 1 Aug', price: '₹900' },
  ];

  const dummyFollowers = [t('seller.rakesh_s'), t('seller.poonam_y'), t('seller.dilip_v'), t('seller.suman_r')];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ArrowLeft color="#956a41" size={24} />
        <Text style={styles.headerTitle}>{t('seller.my_account')}</Text>
        <TouchableOpacity style={styles.bell}>
          <Bell size={26} color="#b73c2f" />
          <NotificationBadge />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Camera color="#fff" size={20} /></View>
          </View>
          <Text style={styles.profileName}>{t('seller.ram_kumar')}</Text>
          <View style={styles.ratingRow}>
            <Star size={16} color="#ffc107" fill="#ffc107" />
            <Text style={styles.ratingValue}>4.9</Text>
            <Text style={styles.ratingText}>(245 {t('seller.ratings')})</Text>
          </View>
          <View style={styles.infoRow}><Phone color="#956a41" size={16} /><Text style={styles.infoText}>+91 98765 43210</Text></View>
          <View style={styles.infoRow}><MapPin color="#956a41" size={16} /><Text style={styles.infoText}>{t('seller.village_main_road_jaipur')}</Text></View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statBlock}><Text style={styles.statValue}>15</Text><Text style={styles.statLabel}>{t('seller.total_jobs')}</Text></View>
          <View style={styles.statBlock}><Text style={styles.statValue}>₹95k</Text><Text style={styles.statLabel}>{t('seller.earned')}</Text></View>
          <View style={styles.statBlock}><Text style={styles.statValue}>4</Text><Text style={styles.statLabel}>{t('seller.badges')}</Text></View>
        </View>

        {/* Jobs Section */}
        <View style={styles.jobsCard}>
          <Text style={styles.jobsTitle}>{t('seller.jobs')}</Text>
          {dummyJobs.map(job => (
            <View key={job.id} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={[styles.jobStatus, styles[`status_${job.status.toLowerCase()}`]]}>{job.status}</Text>
              </View>
              <Text style={styles.jobText}>{t('seller.client')}: {job.client}</Text>
              <Text style={styles.jobText}>{t('seller.dates')}: {job.date}</Text>
              {job.status === t('seller.ongoing') && <TouchableOpacity style={styles.contactBtn}><Text style={styles.contactText}>{t('seller.contact')}</Text></TouchableOpacity>}
              {job.status === t('seller.completed') && (
                <View style={styles.feedbackBox}>
                  <Text style={styles.jobText}>{t('seller.price')}: {job.price}</Text>
                  <Text style={styles.jobText}>⭐ {job.rating} — {job.feedback}</Text>
                </View>
              )}
              {job.status !== t('seller.completed') && <Text style={styles.jobText}>{t('seller.price')}: {job.price}</Text>}
            </View>
          ))}
        </View>

        {/* Followers Section */}
        <View style={styles.followersCard}>
          <TouchableOpacity onPress={toggleFollowers} style={styles.followersHeader}>
            <View>
              <Text style={styles.followersTitle}>{t('seller.followers')}</Text>
              <Text style={styles.followersSubtitle}>{t('seller.people_who_trust_your_work')}</Text>
            </View>
            <ChevronDown color="#b73c2f" size={20} />
          </TouchableOpacity>

          <Text style={styles.followersCount}>{dummyFollowers.length} {t('seller.followers')}</Text>
          {followersVisible && (
            <View style={styles.followerList}>
              {dummyFollowers.map((name, i) => (
                <View key={i} style={styles.followerItem}><Text style={styles.followerName}>{name}</Text></View>
              ))}
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>{t('seller.account_actions')}</Text>
          <TouchableOpacity style={styles.switchBtn}><Repeat color="#956a41" size={16} /><Text style={styles.switchText}>{t('seller.switch_to_buyer_account')}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><LogOut color="#e53935" size={16} /><Text style={styles.logoutText}>{t('common.logout')}</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff2e1' },
  header: {
    backgroundColor: '#fce6c8', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0d8c2',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#956a41', alignItems: 'center', justifyContent: 'center'},
  bell: { position: 'relative' },
  scrollContent: { padding: 20 },
  profileCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, marginBottom: 20,
  },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0d3c2', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e19b3c', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 22, color: '#956a41', fontWeight: 'bold', marginTop: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  ratingValue: { marginLeft: 4, fontWeight: 'bold', color: '#956a41' },
  ratingText: { marginLeft: 6, color: '#999', fontSize: 13 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  infoText: { marginLeft: 6, color: '#956a41', fontSize: 14 },
  editBtn: { marginTop: 16, borderWidth: 1, borderColor: '#e19b3c', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  editBtnText: { color: '#e19b3c', fontWeight: '600' },
  statsCard: {
    backgroundColor: '#fbeede', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  statBlock: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#b73c2f' },
  statLabel: { fontSize: 14, color: '#956a41', marginTop: 4 },
  jobsCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  jobsTitle: { fontSize: 20, fontWeight: 'bold', color: '#b73c2f', marginBottom: 16 },
  jobItem: { marginBottom: 20, backgroundColor: '#fff8ed', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#956a41' },
  jobStatus: { fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, overflow: 'hidden', color: '#fff' },
  status_ongoing: { backgroundColor: '#e19b3c' },
  status_completed: { backgroundColor: '#4caf50' },
  status_upcoming: { backgroundColor: '#ff9800' },
  jobText: { fontSize: 14, color: '#956a41', marginVertical: 2 },
  contactBtn: { backgroundColor: '#b73c2f', padding: 8, borderRadius: 10, alignSelf: 'flex-start', marginTop: 8 },
  contactText: { color: '#fff', fontWeight: '600' },
  feedbackBox: { marginTop: 8 },
  followersCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  followersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  followersTitle: { fontSize: 18, fontWeight: 'bold', color: '#b73c2f' },
  followersSubtitle: { fontSize: 14, color: '#956a41' },
  followersCount: { fontSize: 14, fontWeight: '600', color: '#956a41', marginBottom: 12 },
  followerList: { gap: 12 },
  followerItem: { backgroundColor: '#fff8ed', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  followerName: { color: '#956a41', fontWeight: '600' },
  accountCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 40,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  accountTitle: { fontSize: 16, fontWeight: 'bold', color: '#956a41', marginBottom: 14 },
  switchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fbeede', padding: 12, borderRadius: 16, marginBottom: 14 },
  switchText: { color: '#956a41', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e53935', padding: 12, borderRadius: 16 },
  logoutText: { color: '#e53935', fontSize: 14, fontWeight: '600', marginLeft: 8 },
});
