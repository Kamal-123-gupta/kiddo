import { ActionType } from './actions';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  action?: ActionType;
}

export interface BannerHeroProps {
  id: string;
  type: 'BANNER_HERO';
  image: string;
  title?: string;
  subtitle?: string;
  action?: ActionType;
}

export interface ProductGrid2x2Props {
  id: string;
  type: 'PRODUCT_GRID_2X2';
  products: ProductType[];
}

export interface DynamicCollectionProps {
  id: string;
  type: 'DYNAMIC_COLLECTION';
  title: string;
  items: ProductType[];
}

export interface FullScreenOverlayProps {
  id: string;
  type: 'FULL_SCREEN_OVERLAY';
  animation_url: string;
}

export interface UnknownComponentProps {
  id: string;
  type: string;
  [key: string]: any;
}

// Union representing any supported SDUI node
export type SDUIComponentProps =
  | BannerHeroProps
  | ProductGrid2x2Props
  | DynamicCollectionProps
  | FullScreenOverlayProps;

export interface SDUIResponse {
  theme: {
    primary: string;
    background: string;
  };
  components: (SDUIComponentProps | UnknownComponentProps)[];
}
