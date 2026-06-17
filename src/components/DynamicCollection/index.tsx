import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { DynamicCollectionProps, ProductType } from '../../types/components';
import { ProductCard } from '../ProductCard';
import { useTheme } from '../../context/ThemeContext';

const SafeFlashList = Platform.OS === 'web' ? FlatList : (FlashList as any);

export const DynamicCollection: React.FC<DynamicCollectionProps> = memo(({ title, items }) => {
  const { theme } = useTheme();

  // Stable render item helper to prevent recreate overhead on each render
  const renderItem = useCallback(({ item }: { item: ProductType }) => {
    return (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: ProductType) => item.id, []);

  console.log(`[Render] DynamicCollection: ${title}`);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
      
      <SafeFlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        estimatedItemSize={140}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
});

DynamicCollection.displayName = 'DynamicCollection';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginBottom: 8,
    fontFamily: 'System',
  },
  listContainer: {
    paddingHorizontal: 6,
  },
  cardWrapper: {
    width: 145,
  },
});
