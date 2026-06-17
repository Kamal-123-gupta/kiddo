import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ProductGrid2x2Props } from '../../types/components';
import { ProductCard } from '../ProductCard';
import { useTheme } from '../../context/ThemeContext';

export const ProductGrid2x2: React.FC<ProductGrid2x2Props> = memo(({ products }) => {
  const { theme } = useTheme();
  console.log(`[Render] ProductGrid2x2`);

  if (!products || products.length === 0) {
    return null;
  }

  // Slice first 4 products for safety in a 2x2 grid context
  const gridProducts = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {gridProducts.map((product) => (
          <View key={product.id} style={styles.gridColumn}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
});

ProductGrid2x2.displayName = 'ProductGrid2x2';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridColumn: {
    width: '50%',
  },
});
