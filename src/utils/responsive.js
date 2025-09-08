import { Dimensions, Platform } from 'react-native';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection
export const isTablet = () => {
  const aspectRatio = screenHeight / screenWidth;
  const minDimension = Math.min(screenWidth, screenHeight);
  
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && minDimension >= 600)
  );
};

export const isLargeTablet = () => {
  const minDimension = Math.min(screenWidth, screenHeight);
  return minDimension >= 768;
};

export const isSmallPhone = () => {
  const minDimension = Math.min(screenWidth, screenHeight);
  return minDimension < 375;
};

// Responsive dimensions
export const getResponsiveDimensions = () => {
  const isTab = isTablet();
  const isLargeTab = isLargeTablet();
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
    
    // Screen dimensions
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
    // Apply responsive dimensions to common properties
    container: {
      ...baseStyles.container,
      paddingHorizontal: dimensions.containerPadding,
    },
  };
};

// Hook for responsive dimensions (if using functional components)
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
  if (screenWidth < BREAKPOINTS.SMALL_PHONE) return 'SMALL_PHONE';
  if (screenWidth < BREAKPOINTS.PHONE) return 'PHONE';
  if (screenWidth < BREAKPOINTS.TABLET) return 'PHONE';
  if (screenWidth < BREAKPOINTS.LARGE_TABLET) return 'TABLET';
  if (screenWidth < BREAKPOINTS.DESKTOP) return 'LARGE_TABLET';
  return 'DESKTOP';
};
