import React from 'react';
import { View, ScrollView } from 'react-native';
import { getResponsiveDimensions, isTablet, isLargeTablet } from '../utils/responsive';

const ResponsiveLayout = ({ 
  children, 
  sidebar = null, 
  enableScroll = true,
  style = {},
  contentStyle = {},
  sidebarStyle = {}
}) => {
  const dimensions = getResponsiveDimensions();
  const showHorizontalLayout = dimensions.useHorizontalLayout && sidebar;

  const Container = enableScroll ? ScrollView : View;

  if (showHorizontalLayout) {
    // Tablet horizontal layout with sidebar
    return (
      <View style={[{ flex: 1, flexDirection: 'row' }, style]}>
        {/* Sidebar */}
        <View style={[
          { 
            width: dimensions.sidebarWidth,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRightWidth: 1,
            borderRightColor: '#e0e0e0',
          },
          sidebarStyle
        ]}>
          {sidebar}
        </View>
        
        {/* Main content */}
        <Container 
          style={[{ flex: 1 }, contentStyle]}
          contentContainerStyle={enableScroll ? { flexGrow: 1 } : undefined}
        >
          {children}
        </Container>
      </View>
    );
  }

  // Standard vertical layout (phone or tablet portrait)
  return (
    <Container 
      style={[{ flex: 1 }, style, contentStyle]}
      contentContainerStyle={enableScroll ? { flexGrow: 1 } : undefined}
    >
      {children}
      {sidebar && (
        <View style={[
          { 
            marginTop: dimensions.sectionSpacing,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: isTablet() ? 12 : 8,
            padding: dimensions.containerPadding,
          },
          sidebarStyle
        ]}>
          {sidebar}
        </View>
      )}
    </Container>
  );
};

export default ResponsiveLayout;
