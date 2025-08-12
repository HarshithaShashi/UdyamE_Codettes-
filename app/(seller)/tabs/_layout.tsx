import { Tabs } from 'expo-router';
import { Chrome as Home, Briefcase, CirclePlus, User } from 'lucide-react-native';

export default function SellerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B85C38', // your warm earthy tone
        tabBarStyle: {
          backgroundColor: '#FFEFE8', // adjust to match your theme
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, size }) => <CirclePlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
