import React from 'react';
import { Text } from 'react-native-paper';
import { getResponsiveDimensions } from '../utils/responsive';

const ResponsiveText = ({ 
  variant = 'body', 
  children, 
  style = {}, 
  ...props 
}) => {
  const dimensions = getResponsiveDimensions();

  const getTextStyle = () => {
    switch (variant) {
      case 'title':
        return {
          fontSize: dimensions.titleFontSize,
          fontWeight: 'bold',
        };
      case 'subtitle':
        return {
          fontSize: dimensions.subtitleFontSize,
          fontWeight: '600',
        };
      case 'body':
        return {
          fontSize: dimensions.bodyFontSize,
        };
      case 'caption':
        return {
          fontSize: dimensions.bodyFontSize - 2,
          color: '#666',
        };
      default:
        return {
          fontSize: dimensions.bodyFontSize,
        };
    }
  };

  return (
    <Text 
      style={[getTextStyle(), style]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export default ResponsiveText;
