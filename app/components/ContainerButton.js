import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const ContainerButton = ({ container, onPress, unit }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(container.amount)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={container.icon || 'cup-water'}
          size={28}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.amountText}>{container.amount} {unit}</Text>
      <Text style={styles.nameText}>{container.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.margin,
    alignItems: 'center',
    marginHorizontal: SIZES.margin / 2,
    width: 100,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  amountText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  nameText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
});

export default ContainerButton; 