import { Dimensions, Platform } from 'react-native';

// Device type detection - always uses fresh dimensions
export const isTablet = (width, height) => {
  const { width: screenWidth, height: screenHeight } = width != null 
    ? { width, height } 
    : Dimensions.get('window');
  const w = width || screenWidth;
  const h = height || screenHeight;
  const aspectRatio = Math.max(w, h) / Math.min(w, h);
  const minDimension = Math.min(w, h);
  
  if (Platform.OS === 'ios') {
    // Use Platform.isPad when available, fall back to aspect ratio check
    return Platform.isPad || (aspectRatio < 1.6 && minDimension >= 600);
  }
  return minDimension >= 600;
};

export const isLargeTablet = (width, height) => {
  const { width: w, height: h } = width != null 
    ? { width, height } 
    : Dimensions.get('window');
  const minDimension = Math.min(w || 0, h || 0);
  return minDimension >= 768;
};

export const isSmallPhone = (width, height) => {
  const { width: w, height: h } = width != null 
    ? { width, height } 
    : Dimensions.get('window');
  const minDimension = Math.min(w || 0, h || 0);
  return minDimension < 375;
};

// Responsive dimensions - always reads fresh screen size
export const getResponsiveDimensions = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTab = isTablet(screenWidth, screenHeight);
  const isLargeTab = isLargeTablet(screenWidth, screenHeight);
  const minDimension = Math.min(screenWidth, screenHeight);
  const maxDimension = Math.max(screenWidth, screenHeight);
  
  // Calculate grid size based on available space
  const availableWidth = minDimension * 0.9;
  const availableHeight = maxDimension * 0.6; // Leave space for header and controls
  const gridSize = Math.min(availableWidth, availableHeight);
  
  return {
    // Grid sizing - responsive to actual screen size
    gridMaxWidth: isLargeTab ? Math.min(500, gridSize) : 
                  isTab ? Math.min(400, gridSize) : 
                  Math.min(screenWidth * 0.9, gridSize),
    gridPadding: isTab ? 20 : 10,
    
    // Font sizes
    titleFontSize: isLargeTab ? 32 : isTab ? 28 : 24,
    subtitleFontSize: isLargeTab ? 20 : isTab ? 18 : 16,
    bodyFontSize: isLargeTab ? 18 : isTab ? 16 : 14,
    letterFontSize: isLargeTab ? 32 : isTab ? 28 : 24,
    
    // Spacing - responsive to screen size
    containerPadding: isTab ? 24 : Math.max(16, screenWidth * 0.04),
    sectionSpacing: isTab ? 20 : Math.max(12, screenHeight * 0.02),
    buttonHeight: isTab ? 56 : 48,
    
    // Layout
    useHorizontalLayout: isTab && screenWidth > screenHeight,
    sidebarWidth: isLargeTab ? 300 : 250,
    
    // Screen dimensions (fresh on every call)
    screenWidth,
    screenHeight,
    minDimension,
    maxDimension,
  };
};

// Responsive styles helper
export const createResponsiveStyles = (baseStyles) => {
  const dimensions = getResponsiveDimensions();
  
  return {
    ...baseStyles,
    container: {
      ...baseStyles.container,
      paddingHorizontal: dimensions.containerPadding,
    },
  };
};

// Hook for responsive dimensions (re-renders on dimension changes)
export const useResponsiveDimensions = () => {
  return getResponsiveDimensions();
};

// Screen size breakpoints
export const BREAKPOINTS = {
  SMALL_PHONE: 375,
  PHONE: 414,
  TABLET: 600,
  LARGE_TABLET: 768,
  DESKTOP: 1024,
};

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  const { width: screenWidth } = Dimensions.get('window');
  if (screenWidth < BREAKPOINTS.SMALL_PHONE) return 'SMALL_PHONE';
  if (screenWidth < BREAKPOINTS.PHONE) return 'PHONE';
  if (screenWidth < BREAKPOINTS.TABLET) return 'PHONE';
  if (screenWidth < BREAKPOINTS.LARGE_TABLET) return 'TABLET';
  if (screenWidth < BREAKPOINTS.DESKTOP) return 'LARGE_TABLET';
  return 'DESKTOP';
};
