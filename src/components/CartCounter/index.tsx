import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCartStore, selectCartCount } from '../../store/cartStore';
import { useTheme } from '../../context/ThemeContext';
import { handleAction } from '../../actions/ActionDispatcher';

export const CartCounter: React.FC = memo(() => {
  const { theme } = useTheme();
  
  // Custom selector: only re-render if total items changes
  const cartCount = useCartStore(selectCartCount);

  console.log(`[Render] CartCounter - Count: ${cartCount}`);

  if (cartCount === 0) {
    return null;
  }

  const handleCheckout = () => {
    handleAction({
      type: 'DEEP_LINK',
      payload: { url: '/cart/checkout' },
    });
  };

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <View style={[styles.bar, { backgroundColor: theme.primary, borderColor: 'rgba(255, 255, 255, 0.25)' }]}>
        <View style={styles.textContainer}>
          <View style={styles.badgeRow}>
            <Text style={styles.cartIcon}>🛒</Text>
            <Text style={styles.countText}>
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'} Added
            </Text>
          </View>
          <Text style={styles.subText}>Premium Delivery active 🚀</Text>
        </View>

        <TouchableOpacity style={styles.cta} onPress={handleCheckout} activeOpacity={0.85}>
          <Text style={styles.ctaText}>View Cart</Text>
          <Text style={styles.ctaArrow}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

CartCounter.displayName = 'CartCounter';

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    marginLeft: 22,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ctaText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '800',
    marginRight: 4,
  },
  ctaArrow: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
