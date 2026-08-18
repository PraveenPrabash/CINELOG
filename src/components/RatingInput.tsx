import React, { useRef } from 'react';
import { StyleSheet, View, PanResponder, Dimensions, Animated } from 'react-native';
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
  
  const SLIDER_WIDTH = Dimensions.get('window').width - 64; // 32 padding on each side

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleScrub(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt, gestureState) => {
        // gestureState.moveX is absolute screen position. Better to use local coordinates 
        // if possible, but moveX works if we approximate container pos, or just track diffs.
        // For a simple custom slider, tracking dx from initial grant is easier:
        // Actually, just calculating percentage based on the touch position within the view bounds:
        handleScrub(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleScrub(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleScrub = (xPos: number) => {
    let percentage = xPos / SLIDER_WIDTH;
    if (percentage < 0) percentage = 0;
    if (percentage > 1) percentage = 1;

    let newValue = percentage * 10;
    // Round to nearest 0.1
    newValue = Math.round(newValue * 10) / 10;
    
    onChange(newValue);
  };

  const fillWidth = (value / 10) * 100;

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: colors.textSecondary }]}>MY RATING</ThemedText>
      
      <View style={styles.valueContainer}>
        <ThemedText style={[styles.valueText, { color: colors.primary }]}>
          {value.toFixed(1)}
        </ThemedText>
      </View>

      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <View style={[styles.track, { backgroundColor: colors.backgroundElement }]}>
          <View style={[styles.fill, { width: `${fillWidth}%`, backgroundColor: colors.primary }]} />
        </View>
        <View style={[
          styles.thumb, 
          { 
            left: `${fillWidth}%`, 
            backgroundColor: colors.card,
            borderColor: colors.primary
          }
        ]} />
      </View>
      <View style={styles.scaleLabels}>
        <ThemedText style={[styles.scaleText, { color: colors.textSecondary }]}>0.0</ThemedText>
        <ThemedText style={[styles.scaleText, { color: colors.textSecondary }]}>10.0</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  valueContainer: {
    marginBottom: 24,
  },
  valueText: {
    fontSize: 56,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    marginLeft: -12, // center thumb over value
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  scaleText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
