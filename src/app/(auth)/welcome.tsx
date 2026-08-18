import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { useCinelog } from '../../context/CinelogContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const { theme } = useCinelog();
  const { loginWithGoogle } = useAuth();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
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
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: colors.primary }]}>CINELOG</ThemedText>
        <ThemedText style={styles.subtitle}>Your personal movie and TV series tracker.</ThemedText>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={handleGoogleLogin}
          disabled={loading}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  actions: {
    paddingBottom: 48,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
