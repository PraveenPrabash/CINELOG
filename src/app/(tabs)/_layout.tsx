import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useCinelog } from '../../context/CinelogContext';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
            elevation: 0,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          },
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.backgroundElement,
          },
          headerTitleAlign: 'left',
          headerTitle: (props) => (
            <View style={{ justifyContent: 'center', paddingVertical: 8, paddingRight: 40 }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 2, marginBottom: 4 }}>
                CINELOG
              </Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>
                {props.children}
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={{ padding: 8, marginRight: 8 }}>
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
            tabBarItemStyle: { marginRight: 30 },
          }}
        />
        
        <Tabs.Screen
          name="watchlist"
          options={{
            title: 'Watchlist',
            tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
            tabBarItemStyle: { marginLeft: 30 },
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
      
      {/* FLOATING CENTRAL ACTION BUTTON */}
      <View style={styles.absoluteCenterButtonContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/search')}
          style={[styles.centerButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={32} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteCenterButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 20, // Slightly squarish rounded
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});
