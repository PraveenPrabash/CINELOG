import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const handleDecrease = () => {
    if (value > 0) onChange(Number(Math.max(0, value - 0.1).toFixed(1)));
  };

  const handleIncrease = () => {
    if (value < 10) onChange(Number(Math.min(10, value + 0.1).toFixed(1)));
  };

  const handleLargeDecrease = () => {
    if (value > 0) onChange(Number(Math.max(0, value - 1.0).toFixed(1)));
  };

  const handleLargeIncrease = () => {
    if (value < 10) onChange(Number(Math.min(10, value + 1.0).toFixed(1)));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.backgroundElement }]} 
        onPress={handleLargeDecrease}
      >
        <Ionicons name="play-back" size={20} color={colors.text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.backgroundElement }]} 
        onPress={handleDecrease}
      >
        <Ionicons name="remove" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.primary }]}>
        <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
          {value.toFixed(1)}
        </ThemedText>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.backgroundElement }]} 
        onPress={handleIncrease}
      >
        <Ionicons name="add" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.backgroundElement }]} 
        onPress={handleLargeIncrease}
      >
        <Ionicons name="play-forward" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 24,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  display: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
