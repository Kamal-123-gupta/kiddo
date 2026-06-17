import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../context/ThemeContext';
import { renderBlock } from '../registry/ComponentRegistry';
import { CartCounter } from '../components/CartCounter';
import { OverlayRenderer } from '../components/OverlayRenderer';

// Mock feeds
import defaultFeed from '../mock/homepage.json';
import campaign1Feed from '../mock/campaign1.json';
import campaign2Feed from '../mock/campaign2.json';
import campaign3Feed from '../mock/campaign3.json';

// Type declarations
import { SDUIResponse, SDUIComponentProps } from '../types/components';

const SafeFlashList = Platform.OS === 'web' ? FlatList : (FlashList as any);

export const HomeScreen: React.FC = () => {
  const { theme, updateTheme } = useTheme();
  
  // State for components, loading, and active campaign
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCampaign, setActiveCampaign] = useState<string>('DEFAULT');
  const [isDevMenuVisible, setIsDevMenuVisible] = useState<boolean>(false);

  // Method to load payload and update theme configurations on the fly
  const loadPayload = useCallback((payload: any) => {
    setIsLoading(true);
    // Simulate minor network latency for realistic quick-commerce skeleton loader display
    const timer = setTimeout(() => {
      if (payload && payload.theme) {
        updateTheme(payload.theme);
      }
      if (payload && payload.components) {
        setComponents(payload.components);
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [updateTheme]);

  // Load default feed on mount
  useEffect(() => {
    loadPayload(defaultFeed);
  }, [loadPayload]);

  // Pull to refresh simulation
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    let feedSource: any = defaultFeed;
    if (activeCampaign === 'BACK_TO_SCHOOL') feedSource = campaign1Feed;
    else if (activeCampaign === 'SUMMER_PLAYHOUSE') feedSource = campaign2Feed;
    else if (activeCampaign === 'MYSTERY_GIFT_CARNIVAL') feedSource = campaign3Feed;

    loadPayload(feedSource);
  }, [activeCampaign, loadPayload]);

  // Switch active campaign feed
  const handleCampaignSwitch = useCallback((campaignKey: string) => {
    setActiveCampaign(campaignKey);
    setIsDevMenuVisible(false);

    let targetFeed: any = defaultFeed;
    if (campaignKey === 'BACK_TO_SCHOOL') targetFeed = campaign1Feed;
    else if (campaignKey === 'SUMMER_PLAYHOUSE') targetFeed = campaign2Feed;
    else if (campaignKey === 'MYSTERY_GIFT_CARNIVAL') targetFeed = campaign3Feed;

    loadPayload(targetFeed);
  }, [loadPayload]);

  // Senior Design Decision: 
  // Overlays should cover the entire device viewport and stay active during scroll.
  // By filtering them out from the vertical FlashList and rendering them floating at the root level, 
  // we guarantee full-screen coverage while leaving the scrolling content completely interactive.
  const overlays = useMemo(() => {
    return components.filter((comp) => comp.type === 'FULL_SCREEN_OVERLAY');
  }, [components]);

  // Scrolling feed content excluding full screen overlays
  const scrollFeedComponents = useMemo(() => {
    return components.filter((comp) => comp.type !== 'FULL_SCREEN_OVERLAY');
  }, [components]);

  // Resilient component renderer with fallback boundary catching
  const renderListItem = useCallback(({ item }: { item: any }) => {
    try {
      return renderBlock(item);
    } catch (error) {
      console.error(`[HomeScreen ErrorBoundary] Crash detected during block render for ID: ${item.id}`, error);
      // Fallback UI rendering in case a child component throws an exception
      return (
        <View style={styles.errorBlockContainer}>
          <Text style={styles.errorText}>Oops! Failed to load this section.</Text>
        </View>
      );
    }
  }, []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  // Performance optimized estimated item size
  const getEstimatedItemSize = useCallback((item: any) => {
    if (item.type === 'BANNER_HERO') return 160;
    if (item.type === 'PRODUCT_GRID_2X2') return 440;
    if (item.type === 'DYNAMIC_COLLECTION') return 250;
    return 100;
  }, []);

  // Shimmer / Skeleton Loader Layout
  const renderSkeleton = () => (
    <ScrollView style={styles.skeletonContainer} showsVerticalScrollIndicator={false}>
      {/* Banner Skeleton */}
      <View style={styles.skeletonBanner} />
      
      {/* Horizontal List Title Skeleton */}
      <View style={styles.skeletonTitle} />
      
      {/* Horizontal Carousel Skeleton */}
      <View style={styles.skeletonHorizontalList}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.skeletonCard} />
        ))}
      </View>

      {/* Grid Title Skeleton */}
      <View style={styles.skeletonTitle} />
      
      {/* Grid 2x2 Skeleton */}
      <View style={styles.skeletonGrid}>
        <View style={styles.skeletonGridRow}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
        <View style={styles.skeletonGridRow}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Kiddo</Text>
          <Text style={styles.subtitle}>Quick Baby & Kids Essentials</Text>
        </View>
        
        {/* Switcher Action Button */}
        <TouchableOpacity
          onPress={() => setIsDevMenuVisible(!isDevMenuVisible)}
          style={[styles.devButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.devButtonText}>⚙️ Switch Campaign</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        renderSkeleton()
      ) : scrollFeedComponents.length === 0 ? (
        // Empty State Handler
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sections configured from backend.</Text>
        </View>
      ) : (
        <SafeFlashList
          data={scrollFeedComponents}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={280}
          overrideItemLayout={(layout: any, item: any) => {
            layout.size = getEstimatedItemSize(item);
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        />
      )}

      {/* Floating Cart Panel */}
      <CartCounter />

      {/* Full screen floating overlays (pointerEvents="none" makes items click/scroll through) */}
      {overlays.map((overlay) => (
        <OverlayRenderer
          key={overlay.id}
          id={overlay.id}
          type="FULL_SCREEN_OVERLAY"
          animation_url={overlay.animation_url}
        />
      ))}

      {/* Developer Menu Sheet */}
      {isDevMenuVisible && (
        <View style={styles.devSheet}>
          <View style={styles.devSheetHeader}>
            <Text style={styles.devSheetTitle}>Developer Campaign Switcher</Text>
            <TouchableOpacity onPress={() => setIsDevMenuVisible(false)}>
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.devMenuScroll}>
            <TouchableOpacity
              style={[
                styles.campaignOption,
                activeCampaign === 'DEFAULT' && { borderColor: theme.primary, borderWidth: 2 },
              ]}
              onPress={() => handleCampaignSwitch('DEFAULT')}
            >
              <Text style={styles.campaignOptionTitle}>Kiddo Default Store</Text>
              <Text style={styles.campaignOptionDesc}>Orange theme • 40 items • Wipes, formulas, snacks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.campaignOption,
                activeCampaign === 'BACK_TO_SCHOOL' && { borderColor: '#0057FF', borderWidth: 2 },
              ]}
              onPress={() => handleCampaignSwitch('BACK_TO_SCHOOL')}
            >
              <Text style={[styles.campaignOptionTitle, { color: '#0057FF' }]}>Back To School Mega Sale 🎒</Text>
              <Text style={styles.campaignOptionDesc}>Yellow bg & blue accents • Paper airplane Lottie • Lunchboxes, backpacks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.campaignOption,
                activeCampaign === 'SUMMER_PLAYHOUSE' && { borderColor: '#00AEEF', borderWidth: 2 },
              ]}
              onPress={() => handleCampaignSwitch('SUMMER_PLAYHOUSE')}
            >
              <Text style={[styles.campaignOptionTitle, { color: '#00AEEF' }]}>Summer Playhouse Festival ☀️</Text>
              <Text style={styles.campaignOptionDesc}>Cyan bg • Water splash Lottie • Petting zoo feeding tickets, floats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.campaignOption,
                activeCampaign === 'MYSTERY_GIFT_CARNIVAL' && { borderColor: '#FF0000', borderWidth: 2 },
              ]}
              onPress={() => handleCampaignSwitch('MYSTERY_GIFT_CARNIVAL')}
            >
              <Text style={[styles.campaignOptionTitle, { color: '#FF0000' }]}>Mystery Gift Carnival 🎊</Text>
              <Text style={styles.campaignOptionDesc}>Red bg • Confetti Lottie • Mystery toy boxes • Coupon code triggers</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    zIndex: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 2,
  },
  devButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  listContent: {
    paddingBottom: 100, // ensure lists scroll above CartCounter
  },
  errorBlockContainer: {
    margin: 12,
    padding: 16,
    backgroundColor: '#FFEEEE',
    borderWidth: 1,
    borderColor: '#FFAAAA',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#CC0000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
  },
  // Skeleton Loader styling
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skeletonBanner: {
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonTitle: {
    height: 18,
    width: '45%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    marginBottom: 10,
    marginLeft: 4,
  },
  skeletonHorizontalList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  skeletonCard: {
    flex: 1,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  skeletonGrid: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  skeletonGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  // Developer Sheet
  devSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    maxHeight: '65%',
    padding: 20,
    zIndex: 200,
  },
  devSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F3F5',
    paddingBottom: 14,
    marginBottom: 14,
  },
  devSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C3E50',
  },
  closeBtn: {
    color: '#95A5A6',
    fontSize: 14,
    fontWeight: '700',
  },
  devMenuScroll: {
    paddingBottom: 30,
  },
  campaignOption: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  campaignOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C3E50',
  },
  campaignOptionDesc: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 6,
    lineHeight: 15,
  },
});
export default HomeScreen;
