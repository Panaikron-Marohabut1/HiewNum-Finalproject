import React from 'react';
import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import { useApp } from '../utils/AppContext';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WaterProgress = () => {
  const { waterGoal, todayWater, unit, getProgressPercentage } = useApp();
  const progressPercentage = getProgressPercentage();
  const progress = progressPercentage / 100;
  
  // Calculate remaining water or excess
  const remaining = waterGoal - todayWater.total;
  const isGoalReached = progressPercentage >= 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressOuterContainer}>
        <LinearGradient
          colors={['rgba(79, 182, 255, 0.1)', 'rgba(28, 207, 201, 0.05)']}
          style={styles.gradientBackground}
        />
        
        <View style={styles.progressContainer}>
          <Progress.Circle
            size={200}
            thickness={12}
            progress={progress}
            color={COLORS.primary}
            unfilledColor={'rgba(79, 182, 255, 0.15)'}
            borderWidth={0}
            strokeCap="round"
            formatText={() => ''}
          />
          
          <View style={styles.innerCircle}>
            <Text style={styles.progressText}>{progressPercentage}%</Text>
            <Text style={styles.progressLabel}>of daily goal</Text>
          </View>
          
          {isGoalReached && (
            <View style={styles.achievementBadge}>
              <Ionicons name="trophy" size={18} color={COLORS.white} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoOuterContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="water" size={22} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>{todayWater.total}</Text>
              <Text>{` ${unit} / ${waterGoal} ${unit}`}</Text>
            </Text>
          </View>

          <View style={styles.statusContainer}>
            {isGoalReached ? (
              <View style={[styles.statusBadge, styles.successBadge]}>
                <Text style={styles.statusText}>Goal Reached! 🎉</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.progressBadge]}>
                <Text style={styles.statusText}>{`${remaining} ${unit} to go`}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SIZES.margin,
    marginBottom: SIZES.marginLarge,
  },
  progressOuterContainer: {
    position: 'relative',
    width: width * 0.85,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: SIZES.marginLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginTop: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    width: '80%',
    marginVertical: SIZES.margin,
    alignSelf: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    ...FONTS.bold,
    fontSize: 40,
    color: COLORS.primaryDark,
  },
  progressLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  achievementBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: COLORS.success,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  infoOuterContainer: {
    width: width * 0.85,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.margin,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.margin,
  },
  infoIcon: {
    marginRight: SIZES.margin,
  },
  infoText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  infoHighlight: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primaryDark,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding *2,
    paddingVertical: SIZES.padding ,
    alignSelf: 'stretch',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadge: {
    backgroundColor: 'rgba(79, 182, 255, 0.15)',
  },
  successBadge: {
    backgroundColor: 'rgba(82, 196, 26, 0.15)',
  },
  statusText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primaryDark,
  },
});

export default WaterProgress; 