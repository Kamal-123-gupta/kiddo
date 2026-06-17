export type ActionType =
  | {
      type: 'ADD_TO_CART';
      payload: {
        id: string;
        name: string;
        price: number;
        image: string;
      };
    }
  | {
      type: 'REMOVE_FROM_CART';
      payload: {
        id: string;
      };
    }
  | {
      type: 'DEEP_LINK';
      payload: {
        url: string;
      };
    }
  | {
      type: 'APPLY_MYSTERY_GIFT_COUPON';
      payload: {
        coupon: string;
      };
    }
  | {
      type: 'ANALYTICS_EVENT';
      payload: {
        eventName: string;
        [key: string]: string | number | boolean | undefined | null;
      };
    };
