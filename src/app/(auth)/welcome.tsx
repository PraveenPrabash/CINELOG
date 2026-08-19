import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Dimensions, StatusBar, Image } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Navigation is automatically handled by RootLayoutNav upon auth state change
    } catch (error: any) {
      if (error?.message) {
        Alert.alert('Sign-In Failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#020D19" />
      
      {/* Subtle Cinematic Background Decorations */}
      <View style={styles.backgroundWrapper}>
        <View style={styles.filmStripDecorationLeft} />
        <View style={styles.filmStripDecorationRight} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Image 
            source={require('../../../trlogo.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
          <ThemedText style={styles.subtitle}>Your personal movie and TV series tracker.</ThemedText>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#000" style={styles.googleIcon} />
                <ThemedText style={styles.buttonText}>Continue with Google</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020D19', // Dark navy cinematic background
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.1, // Subtle
    pointerEvents: 'none',
  },
  filmStripDecorationLeft: {
    width: 32,
    height: '100%',
    borderRightWidth: 10,
    borderRightColor: '#fff',
    borderStyle: 'dashed', // Film strip style
  },
  filmStripDecorationRight: {
    width: 32,
    height: '100%',
    borderLeftWidth: 10,
    borderLeftColor: '#fff',
    borderStyle: 'dashed', // Film strip style
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40, // Space directly between subtitle and button
  },
  logoImage: {
    width: width * 0.8,
    height: 120, // Enough height so it is not clipped
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AAB2',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  actionsSection: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100, // Fully rounded
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});
