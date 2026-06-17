import React, { memo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductType } from '../../types/components';
import { handleAction } from '../../actions/ActionDispatcher';
import { useCartStore, selectProductQuantity } from '../../store/cartStore';
import { useTheme } from '../../context/ThemeContext';

export interface ProductCardProps {
  product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { theme } = useTheme();
  
  // Custom selector: only trigger re-render if this item's quantity changes
  const quantity = useCartStore(selectProductQuantity(product.id));

  const onAdd = useCallback(() => {
    handleAction({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    });
  }, [product]);

  const onRemove = useCallback(() => {
    handleAction({
      type: 'REMOVE_FROM_CART',
      payload: { id: product.id },
    });
  }, [product.id]);

  console.log(`[Render] ProductCard - ID: ${product.id}`);

  const formattedPrice = `₹${product.price}`;
  const formattedOriginalPrice = product.originalPrice ? `₹${product.originalPrice}` : null;
  
  // Calculate percentage difference for saving indicator
  const savingAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <View style={[styles.card, { borderColor: theme.primary + '18' }]}>
      {product.discount ? (
        <View style={[styles.discountBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.discountText}>🏷️ {product.discount} OFF</Text>
        </View>
      ) : null}

      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formattedPrice}</Text>
            {formattedOriginalPrice ? (
              <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
            ) : null}
          </View>
          {savingAmount > 0 ? (
            <Text style={[styles.savingsText, { color: theme.primary }]}>
              Save ₹{savingAmount}
            </Text>
          ) : null}
        </View>

        {/* Stepper / Add to Cart Section */}
        <View style={styles.actionSection}>
          {quantity === 0 ? (
            <TouchableOpacity
              onPress={onAdd}
              style={[styles.addButton, { borderColor: theme.primary, backgroundColor: theme.primary + '0a' }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.addButtonText, { color: theme.primary }]}>ADD</Text>
              <Text style={[styles.addButtonPlus, { color: theme.primary }]}>+</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.stepperContainer, { backgroundColor: theme.primary }]}>
              <TouchableOpacity onPress={onRemove} style={styles.stepperButton} activeOpacity={0.6}>
                <Text style={styles.stepperButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperQuantity}>{quantity}</Text>
              <TouchableOpacity onPress={onAdd} style={styles.stepperButton} activeOpacity={0.6}>
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    justifyContent: 'space-between',
    minHeight: 235,
  },
  discountBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
    elevation: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  imageContainer: {
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 17,
    height: 34,
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    color: '#A0AAB2',
    marginLeft: 6,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  actionSection: {
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 10,
    height: 34,
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  addButtonPlus: {
    fontSize: 14,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: 34,
    overflow: 'hidden',
    elevation: 2,
  },
  stepperButton: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stepperQuantity: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
