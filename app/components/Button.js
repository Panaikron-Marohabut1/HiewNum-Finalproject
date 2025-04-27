import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  disabled = false,
  style
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`${type}Button`],
        styles[`${size}Button`],
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text, 
          styles[`${type}Text`],
          styles[`${size}Text`]
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  // Types
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: 'transparent',
  },
  textButton: {
    backgroundColor: 'transparent',
    ...SHADOWS.small,
  },
  // Sizes
  largeButton: {
    paddingVertical: SIZES.margin + 2,
    paddingHorizontal: SIZES.marginLarge,
  },
  mediumButton: {
    paddingVertical: SIZES.margin,
    paddingHorizontal: SIZES.marginLarge,
  },
  smallButton: {
    paddingVertical: SIZES.margin - 2,
    paddingHorizontal: SIZES.margin,
  },
  // Text
  text: {
    ...FONTS.medium,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textText: {
    color: COLORS.primary,
  },
  // Text sizes
  largeText: {
    fontSize: SIZES.large,
  },
  mediumText: {
    fontSize: SIZES.medium,
  },
  smallText: {
    fontSize: SIZES.font,
  },
  // Disabled state
  disabledButton: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.grey,
  },
});

export default Button; 