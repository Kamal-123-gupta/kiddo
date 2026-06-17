import React, { memo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BannerHeroProps } from '../../types/components';
import { handleAction } from '../../actions/ActionDispatcher';
import { useTheme } from '../../context/ThemeContext';

export const BannerHero: React.FC<BannerHeroProps> = memo(({ image, title, subtitle, action }) => {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    if (action) {
      handleAction(action);
    }
  }, [action]);

  console.log(`[Render] BannerHero`);

  const Container = action ? TouchableOpacity : View;

  return (
    <Container
      // @ts-ignore - dynamic container mapping
      onPress={action ? handlePress : undefined}
      activeOpacity={0.9}
      style={styles.container}
    >
      <View style={[styles.innerContainer, { borderColor: theme.primary + '20' }]}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        
        {(title || subtitle) && (
          <View style={styles.overlayTextContainer}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        )}
      </View>
    </Container>
  );
});

BannerHero.displayName = 'BannerHero';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
  },
  innerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    height: 160,
    backgroundColor: '#EEEEEE',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  subtitle: {
    color: '#E0E0E0',
    fontSize: 11,
    marginTop: 2,
  },
});
