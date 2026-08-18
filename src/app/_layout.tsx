import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { CinelogProvider, useCinelog } from '../context/CinelogContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoaded: isCinelogLoaded } = useCinelog();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || !isCinelogLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the welcome screen if not authenticated
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      // Redirect to the main app if authenticated
      router.replace('/(tabs)');
    }
  }, [user, isAuthLoading, isCinelogLoaded, segments]);
}

function RootLayoutNav() {
  const { theme, isLoaded: isCinelogLoaded, isLoadingCloudData } = useCinelog();
  const { isLoading: isAuthLoading } = useAuth();
  
  useProtectedRoute();

  useEffect(() => {
    if (isCinelogLoaded && !isAuthLoading && !isLoadingCloudData) {
      SplashScreen.hideAsync();
    }
  }, [isCinelogLoaded, isAuthLoading, isLoadingCloudData]);

  if (!isCinelogLoaded || isAuthLoading || isLoadingCloudData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#041C32' }}>
        <ActivityIndicator size="large" color="#ECB365" />
      </View>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="edit" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CinelogProvider>
        <RootLayoutNav />
      </CinelogProvider>
    </AuthProvider>
  );
}
