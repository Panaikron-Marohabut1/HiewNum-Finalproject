import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { WATER_TIPS } from '../constants/water';

const TipsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
              <Text style={styles.title}>Hydration Tips</Text>
              <Text style={styles.subtitle}>
              Learn about proper hydration and its benefits
              </Text>
            <View style={styles.divider} />
          </View>
        </View>

        {/* Tips Cards */}
        {WATER_TIPS.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIcon}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </View>
            <Text style={styles.tipContent}>{tip.content}</Text>
          </View>
        ))}

        {/* Additional Sections */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Why Track Water Intake?</Text>
          <View style={styles.reasonsContainer}>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="brain"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Improved cognition and focus</Text>
            </View>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="run"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Better physical performance</Text>
            </View>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="stomach"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Improved digestion</Text>
            </View>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Supports heart health</Text>
            </View>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="emoticon-happy-outline"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Better mood and energy levels</Text>
            </View>
            <View style={styles.reasonItem}>
              <MaterialCommunityIcons
                name="temperature-celsius"
                size={30}
                color={COLORS.primary}
              />
              <Text style={styles.reasonText}>Regulates body temperature</Text>
            </View>
          </View>
        </View>

        {/* Calculate Needs */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>How Much Water Do You Need?</Text>
          <Text style={styles.infoText}>
            Your water needs depend on many factors, including your health, activity level, and where you live. The National Academies of Sciences, Engineering, and Medicine determined that an adequate daily fluid intake is:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                About 15.5 cups (3.7 liters) of fluids a day for men
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                About 11.5 cups (2.7 liters) of fluids a day for women
              </Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            These recommendations include fluids from water, beverages, and food. About 20% of daily fluid intake typically comes from food and the rest from drinks.
          </Text>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsText}>
            Information provided for educational purposes only. Consult with a healthcare professional for personalized advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingVertical: SIZES.margin,
    marginBottom: SIZES.margin,
    backgroundColor: COLORS.neutral,
    borderRadius: 20, // ขอบมุมมน
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    paddingHorizontal: SIZES.marginLarge,
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: '100%',
    marginVertical: SIZES.margin,
    alignSelf: 'stretch',
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
    marginVertical: SIZES.margin,
    ...SHADOWS.small,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  tipTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    flex: 1,
  },
  tipContent: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    lineHeight: 22,
    color: COLORS.text,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
    marginTop: SIZES.marginLarge,
    ...SHADOWS.small,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
  },
  reasonItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  reasonText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text,
    flex: 1,
    marginLeft: SIZES.margin / 2,
  },
  infoText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    lineHeight: 22,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  bulletList: {
    marginVertical: SIZES.margin,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.margin,
  },
  bulletText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    lineHeight: 22,
    color: COLORS.text,
  },
  creditsSection: {
    marginTop: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
    marginBottom: SIZES.margin,
  },
  creditsText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TipsScreen;