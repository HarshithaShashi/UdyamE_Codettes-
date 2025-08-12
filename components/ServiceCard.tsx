import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DollarSign, CreditCard as Edit } from 'lucide-react-native';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{service.title}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit size={16} color="#956a41" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{service.category}</Text>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>
      
      <View style={styles.priceContainer}>
        <DollarSign size={16} color="#e19b3c" />
        <Text style={styles.price}>{service.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
  },
  editButton: {
    padding: 4,
  },
  categoryBadge: {
    backgroundColor: '#fef7f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e19b3c',
  },
});