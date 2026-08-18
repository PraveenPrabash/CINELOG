import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useCinelog } from '../../context/CinelogContext';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0, // Android shadow
          shadowOpacity: 0, // iOS shadow
          borderBottomWidth: 1,
          borderBottomColor: colors.backgroundElement,
          height: 110, // Increase height to fit custom two-line title
        },
        headerTitleAlign: 'left',
        headerTitle: (props) => (
          <View style={{ justifyContent: 'center', height: '100%', paddingBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 2, marginBottom: 4 }}>
              CINELOG
            </Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>
              {props.children}
            </Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/search')} style={{ marginRight: 16 }}>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerRight: () => null,
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
