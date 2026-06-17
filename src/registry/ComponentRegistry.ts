import React from 'react';
import { BannerHero } from '../components/BannerHero';
import { ProductGrid2x2 } from '../components/ProductGrid2x2';
import { DynamicCollection } from '../components/DynamicCollection';
import { OverlayRenderer } from '../components/OverlayRenderer';

// Type mapping object connecting server-driven strings to static UI blocks
export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
  BANNER_HERO: BannerHero,
  PRODUCT_GRID_2X2: ProductGrid2x2,
  DYNAMIC_COLLECTION: DynamicCollection,
  FULL_SCREEN_OVERLAY: OverlayRenderer,
};

/**
 * Resilient Block Resolver
 * If the server payload returns a type that is not configured in ComponentRegistry (e.g. NEW_COMPONENT_V2),
 * the layout parser logs a warning entry and skips rendering the item instead of crashing the view hierarchy.
 */
export const renderBlock = (item: { id: string; type: string; [key: string]: any }) => {
  const Component = ComponentRegistry[item.type];
  if (!Component) {
    console.warn(`[SDUI Resiliency] Unsupported component type: "${item.type}". Skipping rendering for item node with ID: "${item.id}"`);
    return null;
  }
  return React.createElement(Component, { ...item });
};
export default ComponentRegistry;
