import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { hybridDB } from '@/services/HybridDatabaseService';
import '../src/i18n'; // Import i18n configuration

export default function RootLayout() {
  useEffect(() => {
    // Initialize hybrid database on app start
    hybridDB.initialize().catch(error => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
        <NotificationProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <StatusBar style="auto" />
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  </LanguageProvider>
  );
}