import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, PanResponder, LayoutChangeEvent } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface RatingInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const [trackWidth, setTrackWidth] = useState(0);

  const safeValue = value ?? 0.0;
  // Calculate width percentage (0-100)
  const fillWidth = (safeValue / 10) * 100;

  const handleScrub = (xPos: number) => {
    if (trackWidth === 0) return;
    
    let percentage = xPos / trackWidth;
    if (percentage < 0) percentage = 0;
    if (percentage > 1) percentage = 1;

    let newValue = percentage * 10;
    // Round to nearest 0.1
    newValue = Math.round(newValue * 10) / 10;
    
    onChange(newValue);
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      handleScrub(evt.nativeEvent.locationX);
    },
    onPanResponderMove: (evt) => {
      handleScrub(evt.nativeEvent.locationX);
    },
  }), [trackWidth]); // Recreate if trackWidth changes

  return (
    <View style={styles.container}>
      
      <View style={styles.valueContainer}>
        {value !== undefined ? (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <ThemedText style={[styles.valueText, { color: colors.primary }]}>
              {value.toFixed(1)}
            </ThemedText>
            <ThemedText style={[styles.valueSuffix, { color: colors.textSecondary }]}>
              / 10
            </ThemedText>
          </View>
        ) : (
          <ThemedText style={[styles.valueText, { color: colors.textSecondary, fontSize: 32 }]}>
            Not rated
          </ThemedText>
        )}
      </View>

      <View style={styles.sliderWrapper}>
        <View 
          style={styles.sliderInteractiveArea} 
          {...panResponder.panHandlers}
          onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <View style={[styles.track, { backgroundColor: colors.backgroundElement }]}>
            <View style={[styles.fill, { width: `${fillWidth}%`, backgroundColor: colors.primary }]} />
          </View>
          
          <View 
            pointerEvents="none"
            style={[
              styles.thumb, 
              { 
                left: `${fillWidth}%`, 
                backgroundColor: colors.card,
                borderColor: colors.primary
              }
            ]} 
          />
        </View>
        <View style={styles.scaleLabels}>
          <ThemedText style={[styles.scaleText, { color: colors.textSecondary }]}>0</ThemedText>
          <ThemedText style={[styles.scaleText, { color: colors.textSecondary }]}>10</ThemedText>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueContainer: {
    minHeight: 90, // Replaced fixed height with minHeight
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  valueText: {
    fontSize: 64,
    lineHeight: 76, // Added lineHeight to prevent vertical clipping
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  valueSuffix: {
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  sliderWrapper: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  sliderInteractiveArea: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    marginLeft: -14, // Center thumb perfectly over percentage
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: -4,
  },
  scaleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
