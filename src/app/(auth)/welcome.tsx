import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { useCinelog } from '../../context/CinelogContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: colors.primary }]}>CINELOG</ThemedText>
        <ThemedText style={styles.subtitle}>Your personal movie and TV series tracker.</ThemedText>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(auth)/login')}
        >
          <ThemedText style={styles.buttonText}>Log In</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.buttonOutline, { borderColor: colors.primary }]}
          onPress={() => router.push('/(auth)/register')}
        >
          <ThemedText style={[styles.buttonOutlineText, { color: colors.primary }]}>Create Account</ThemedText>
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
    gap: 16,
    paddingBottom: 48,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
