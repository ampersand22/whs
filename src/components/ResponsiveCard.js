import React from 'react';
import { Card } from 'react-native-paper';
import { getResponsiveDimensions, isTablet } from '../utils/responsive';

const ResponsiveCard = ({ 
  children, 
  style = {}, 
  contentStyle = {},
  elevation = 4,
  ...props 
}) => {
  const dimensions = getResponsiveDimensions();

  return (
    <Card
      style={[
        {
          margin: dimensions.containerPadding / 2,
          borderRadius: isTablet() ? 12 : 8,
          maxWidth: isTablet() ? 600 : '100%',
          alignSelf: 'center',
        },
        style
      ]}
      elevation={elevation}
      {...props}
    >
      <Card.Content style={[
        {
          padding: dimensions.containerPadding,
        },
        contentStyle
      ]}>
        {children}
      </Card.Content>
    </Card>
  );
};

export default ResponsiveCard;
