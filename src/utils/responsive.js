import { Dimensions, Platform } from 'react-native';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection
export const isTablet = () => {
  const aspectRatio = screenHeight / screenWidth;
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && screenWidth >= 600)
  );
};

export const isLargeTablet = () => {
  return screenWidth >= 768;
};

export const isSmallPhone = () => {
  return screenWidth < 375;
};

// Responsive dimensions
export const getResponsiveDimensions = () => {
  const isTab = isTablet();
  const isLargeTab = isLargeTablet();
  
  return {
    // Grid sizing
    gridMaxWidth: isLargeTab ? 500 : isTab ? 400 : screenWidth * 0.9,
    gridPadding: isTab ? 20 : 10,
    
    // Font sizes
    titleFontSize: isLargeTab ? 32 : isTab ? 28 : 24,
    subtitleFontSize: isLargeTab ? 20 : isTab ? 18 : 16,
    bodyFontSize: isLargeTab ? 18 : isTab ? 16 : 14,
    letterFontSize: isLargeTab ? 32 : isTab ? 28 : 24,
    
    // Spacing
    containerPadding: isTab ? 24 : 16,
    sectionSpacing: isTab ? 20 : 16,
    buttonHeight: isTab ? 56 : 48,
    
    // Layout
    useHorizontalLayout: isTab && screenWidth > screenHeight,
    sidebarWidth: isLargeTab ? 300 : 250,
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
