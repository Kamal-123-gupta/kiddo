import { Alert } from 'react-native';
import { ActionType } from '../types/actions';
import { useCartStore } from '../store/cartStore';

// Mock Analytics Event Logger
export const trackAnalyticsEvent = (eventName: string, params: Record<string, any>): void => {
  console.log(`[Analytics Event Tracked] "${eventName}":`, JSON.stringify(params));
};

/**
 * Universal Action Dispatcher
 * Decouples UI components from domain logic, routing all interactions
 * (navigation, cart, analytics, coupons) through a central dispatcher.
 */
export const handleAction = (action: ActionType): void => {
  console.log(`[ActionDispatcher] Dispatching action:`, JSON.stringify(action));

  // Automatically track every action for analytics
  trackAnalyticsEvent('sdui_click', {
    actionType: action.type,
    payload: action.payload,
    timestamp: new Date().toISOString(),
  });

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { id, name, price, image } = action.payload;
      // Interact directly with Zustand store slice
      useCartStore.getState().addToCart({ id, name, price, image });
      break;
    }
    case 'REMOVE_FROM_CART': {
      const { id } = action.payload;
      useCartStore.getState().removeFromCart(id);
      break;
    }
    case 'DEEP_LINK': {
      const { url } = action.payload;
      Alert.alert('Quick Link Redirect', `Navigating to Kiddo category: ${url}`);
      break;
    }
    case 'APPLY_MYSTERY_GIFT_COUPON': {
      const { coupon } = action.payload;
      Alert.alert('Coupon Applied 🎉', `Coupon "${coupon}" successfully active! Your checkout total will reflect this deduction.`);
      break;
    }
    case 'ANALYTICS_EVENT': {
      const { eventName, ...rest } = action.payload;
      trackAnalyticsEvent(eventName, rest);
      break;
    }
    default: {
      // TypeScript strict mode ensures switch exhaustion, but dynamic payload could pass raw values.
      const exhaustiveCheck: never = action;
      console.warn('Unhandled action type dispatched:', exhaustiveCheck);
    }
  }
};
