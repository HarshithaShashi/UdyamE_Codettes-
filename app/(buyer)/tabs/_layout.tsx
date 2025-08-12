// app/(buyer)/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import { Chrome as Home, Search, CirclePlus as PlusCircle, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF3EA',
          height: 90,
          borderTopWidth: 0,
          position: 'absolute',
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: '#B5460F',
        tabBarInactiveTintColor: '#A9855D',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="job-postings"
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
