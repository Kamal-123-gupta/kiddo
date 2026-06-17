import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { FullScreenOverlayProps } from '../../types/components';

export const OverlayRenderer: React.FC<FullScreenOverlayProps> = memo(({ animation_url }) => {
  console.log(`[Render] OverlayRenderer: ${animation_url}`);

  if (!animation_url || Platform.OS === 'web') return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LottieView
        source={{ uri: animation_url }}
        autoPlay
        loop
        style={styles.lottie}
        resizeMode="cover"
        // Graceful error recovery: log error but do not crash the app
        onAnimationFailure={(error) => {
          console.warn('[OverlayRenderer] Lottie animation failed to load/play:', error);
        }}
      />
    </View>
  );
});

OverlayRenderer.displayName = 'OverlayRenderer';

const styles = StyleSheet.create({
  lottie: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
});
