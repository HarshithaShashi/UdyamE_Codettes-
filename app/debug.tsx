import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { hybridDB } from '@/services/HybridDatabaseService';

export default function DebugScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>('');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const allData = await hybridDB.getAllData();
      setData(allData);
      setDbStatus(hybridDB.getDatabaseStatus());
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    try {
      await hybridDB.clearAllData();
      Alert.alert('Success', 'All data cleared');
      loadAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const initializeSampleData = async () => {
    try {
      await hybridDB.initialize();
      Alert.alert('Success', 'Sample data initialized');
      loadAllData();
    } catch (error) {
      console.error('Error initializing data:', error);
      Alert.alert('Error', 'Failed to initialize data');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Database Debug Screen</Text>
      <Text style={styles.status}>Database: {dbStatus}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={loadAllData}>
          <Text style={styles.buttonText}>🔄 Refresh Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllData}>
          <Text style={styles.buttonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.initButton]} onPress={initializeSampleData}>
          <Text style={styles.buttonText}>📝 Initialize Sample Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.initButton]} onPress={async () => {
          try {
            await hybridDB.forceInitializeLocal();
            Alert.alert('Success', 'Local database initialized');
            loadAllData();
          } catch (error) {
            Alert.alert('Error', 'Failed to initialize local database');
          }
        }}>
          <Text style={styles.buttonText}>🔧 Force Local Init</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <Text style={styles.loading}>Loading data...</Text>
      )}

      {data && (
        <ScrollView style={styles.dataContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Users ({data.users?.length || 0})</Text>
            {data.users?.map((user: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>ID: {user.id}</Text>
                <Text style={styles.itemText}>Name: {user.name}</Text>
                <Text style={styles.itemText}>Phone: {user.phoneNumber}</Text>
                <Text style={styles.itemText}>Role: {user.role}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💼 Jobs ({data.jobs?.length || 0})</Text>
            {data.jobs?.map((job: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>ID: {job.id}</Text>
                <Text style={styles.itemText}>Title: {job.title}</Text>
                <Text style={styles.itemText}>Skill: {job.skill}</Text>
                <Text style={styles.itemText}>Budget: {job.budget}</Text>
                <Text style={styles.itemText}>Status: {job.status}</Text>
                <Text style={styles.itemText}>Location: {job.location}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛠️ Sellers ({data.sellers?.length || 0})</Text>
            {data.sellers?.map((seller: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>ID: {seller.id}</Text>
                <Text style={styles.itemText}>Name: {seller.name}</Text>
                <Text style={styles.itemText}>Skills: {seller.skills?.join(', ')}</Text>
                <Text style={styles.itemText}>Rating: {seller.rating}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 Services ({data.services?.length || 0})</Text>
            {data.services?.map((service: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>ID: {service.id}</Text>
                <Text style={styles.itemText}>Title: {service.title}</Text>
                <Text style={styles.itemText}>Price: {service.price}</Text>
                <Text style={styles.itemText}>Category: {service.category}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Follows ({data.follows?.length || 0})</Text>
            {data.follows?.map((follow: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>Follower: {follow.followerId}</Text>
                <Text style={styles.itemText}>Following: {follow.followingId}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Notifications ({data.notifications?.length || 0})</Text>
            {data.notifications?.map((notification: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>ID: {notification.id}</Text>
                <Text style={styles.itemText}>Title: {notification.title}</Text>
                <Text style={styles.itemText}>Message: {notification.message}</Text>
                <Text style={styles.itemText}>Read: {notification.read ? 'Yes' : 'No'}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2e1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b73c2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#956a41',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#b73c2f',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
  },
  initButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#956a41',
    marginVertical: 20,
  },
  dataContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b73c2f',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e19b3c',
  },
  itemText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
}); 