import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useApp } from '../utils/AppContext';
import Button from '../components/Button';
import moment from 'moment';
import * as Storage from '../utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const { waterGoal, unit, weeklyData } = useApp();
  const [chartType, setChartType] = useState('weekly'); // weekly, monthly
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);

  // Hydration tips
  const hydrationTips = [
    "Carry a water bottle with you throughout the day",
    "Set reminders to drink water every hour",
    "Drink a glass of water before each meal",
    "Add natural flavors like lemon or cucumber"
  ];

  // Fetch monthly data on mount
  useEffect(() => {
    fetchMonthlyData();
    
    // Auto-rotate tips every 5 seconds
    const interval = setInterval(() => {
      setSelectedTip(prev => (prev + 1) % hydrationTips.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const data = await Storage.getWaterHistoryDays(30);
      setMonthlyData(data);
    } catch (error) {
      console.error('Error fetching monthly data', error);
    } finally {
      setLoading(false);
    }
  };

  // Format data for weekly chart
  const getWeeklyChartData = () => {
    const labels = weeklyData.map(item => 
      moment(item.date).format('ddd')
    ).reverse();

    const data = weeklyData.map(item => item.total).reverse();

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => COLORS.primary,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Format data for monthly chart
  const getMonthlyChartData = () => {
    // Group data by week
    const weeks = [];
    const dataByWeek = [];
    
    for (let i = 0; i < monthlyData.length; i += 7) {
      const weekData = monthlyData.slice(i, i + 7);
      const weekTotal = weekData.reduce((sum, day) => sum + day.total, 0);
      const weekLabel = `Week ${Math.floor(i/7) + 1}`;
      
      weeks.push(weekLabel);
      dataByWeek.push(weekTotal);
    }

    return {
      labels: weeks.reverse(),
      datasets: [
        {
          data: dataByWeek.reverse(),
          color: (opacity = 1) => COLORS.secondary,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Calculate achievement stats
  const getAchievements = () => {
    const totalDays = weeklyData.length;
    const daysReachedGoal = weeklyData.filter(day => day.total >= waterGoal).length;
    const totalIntake = weeklyData.reduce((sum, day) => sum + day.total, 0);
    const avgIntake = totalDays > 0 ? Math.round(totalIntake / totalDays) : 0;
    const streak = calculateStreak();
    const goalPercentage = totalDays > 0 ? Math.round((daysReachedGoal / totalDays) * 100) : 0;
    
    // Calculate weekly improvement
    let weeklyImprovement = 0;
    if (weeklyData.length >= 2) {
      const today = weeklyData.find(day => day.date === moment().format('YYYY-MM-DD'));
      const yesterday = weeklyData.find(day => day.date === moment().subtract(1, 'days').format('YYYY-MM-DD'));
      
      if (today && yesterday) {
        weeklyImprovement = Math.round(((today.total - yesterday.total) / yesterday.total) * 100);
      }
    }
    
    return {
      daysReachedGoal,
      totalDays,
      avgIntake,
      streak,
      goalPercentage,
      totalIntake,
      weeklyImprovement
    };
  };

  // Calculate current streak of days reaching goal
  const calculateStreak = () => {
    if (weeklyData.length === 0) return 0;
    
    let currentStreak = 0;
    const sortedData = [...weeklyData].sort((a, b) => 
      moment(b.date).diff(moment(a.date))
    );
    
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].total >= waterGoal) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const achievements = getAchievements();

  // Determine achievement levels and messages
  const getAchievementLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: '#4CAF50' };
    if (percentage >= 70) return { level: 'Good', color: '#8BC34A' };
    if (percentage >= 50) return { level: 'Fair', color: '#FFC107' };
    return { level: 'Needs Improvement', color: '#FF9800' };
  };

  const achievementLevel = getAchievementLevel(achievements.goalPercentage);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => COLORS.primary,
    labelColor: (opacity = 1) => COLORS.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  // Get today's water intake
  const getTodayIntake = () => {
    const today = weeklyData.find(day => 
      day.date === moment().format('YYYY-MM-DD')
    );
    return today ? today.total : 0;
  };

  const todayIntake = getTodayIntake();
  const goalProgress = Math.min(100, Math.round((todayIntake / waterGoal) * 100)) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.subtitle}>Track your hydration progress</Text>
            <View style={styles.divider} />
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.todaySummaryCard}>
          <View style={styles.todaySummaryHeader}>
            <Text style={styles.todaySummaryTitle}>Today's Progress</Text>
            <Text style={styles.todayDate}>{moment().format('ddd, MMM D')}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressValue}>{goalProgress}%</Text>
              <Text style={styles.progressLabel}>of daily goal</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}/>
              <View style={[styles.progressBarFill, {width: `${goalProgress}%`}]}/>
            </View>
            
            <View style={styles.progressDetails}>
              <View style={styles.progressDetailItem}>
                <Text style={styles.progressDetailValue}>{todayIntake}</Text>
                <Text style={styles.progressDetailLabel}>{unit} consumed</Text>
              </View>
              <View style={styles.progressDetailItem}>
                <Text style={styles.progressDetailValue}>{waterGoal}</Text>
                <Text style={styles.progressDetailLabel}>{unit} target</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="water" size={24} color="white" />
          </View>
          <Text style={styles.tipText}>{hydrationTips[selectedTip]}</Text>
          <View style={styles.tipIndicators}>
            {hydrationTips.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.tipIndicator,
                  index === selectedTip && styles.tipIndicatorActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Chart Toggle */}
        <View style={styles.toggleContainer}>
          <Button
            title="Weekly"
            type={chartType === 'weekly' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setChartType('weekly')}
            style={styles.toggleButton}
          />
          <Button
            title="Monthly"
            type={chartType === 'monthly' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setChartType('monthly')}
            style={styles.toggleButton}
          />
        </View>

        {/* Chart Display */}
        <View style={styles.chartContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          ) : chartType === 'weekly' ? (
            <>
              <Text style={styles.chartTitle}>This Week's Intake</Text>
              {weeklyData.length > 0 ? (
                <LineChart
                  data={getWeeklyChartData()}
                  width={width - 48}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withDots={true}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                />
              ) : (
                <Text style={styles.noDataText}>No data available for this week</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.chartTitle}>Monthly Overview</Text>
              {monthlyData.length > 0 ? (
                <BarChart
                  data={getMonthlyChartData()}
                  width={width - 48}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => COLORS.secondary,
                  }}
                  style={styles.chart}
                  fromZero
                  showValuesOnTopOfBars
                />
              ) : (
                <Text style={styles.noDataText}>No data available for this month</Text>
              )}
            </>
          )}
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementStatusCard}>
            <View style={styles.achievementStatusHeader}>
              <Text style={styles.achievementStatusTitle}>Your Hydration Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: achievementLevel.color + '20' }]}>
                <Text style={[styles.statusBadgeText, { color: achievementLevel.color }]}>
                  {achievementLevel.level}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressCircleContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressCirclePercentage}>{achievements.goalPercentage}%</Text>
                <Text style={styles.progressCircleLabel}>Success Rate</Text>
              </View>
            </View>
            
            <View style={styles.statusMessage}>
              <Text style={styles.statusMessageText}>
                You've reached your daily goal {achievements.daysReachedGoal} out of {achievements.totalDays} days this week.
                {achievements.streak > 1 ? ` Current streak: ${achievements.streak} days!` : ''}
              </Text>
            </View>
          </View>
          
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="trophy" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.achievementValue}>{achievements.streak}</Text>
              <Text style={styles.achievementLabel}>Day Streak</Text>
              <Text style={styles.achievementDescription}>Consecutive days meeting goal</Text>
            </View>
            
            <View style={styles.achievementCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
                <Ionicons name="water" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.achievementValue}>{achievements.avgIntake}</Text>
              <Text style={styles.achievementLabel}>{unit}/day</Text>
              <Text style={styles.achievementDescription}>Daily average intake</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="fitness" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.achievementValue}>{achievements.totalIntake}</Text>
              <Text style={styles.achievementLabel}>Total {unit}</Text>
              <Text style={styles.achievementDescription}>This week's hydration</Text>
            </View>
          </View>
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
  divider: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: '100%',
    marginVertical: SIZES.margin,
    alignSelf: 'stretch',
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
  todaySummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    margin: SIZES.marginLarge,
    marginTop: SIZES.margin,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  todaySummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  todaySummaryTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  todayDate: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  progressContainer: {
    marginTop: SIZES.margin / 2,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  progressValue: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.primary,
  },
  progressLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.margin,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.lightGrey,
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.margin / 2,
  },
  progressDetailItem: {
    alignItems: 'center',
  },
  progressDetailValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
  },
  progressDetailLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  tipsCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
    marginBottom: SIZES.marginLarge,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
  tipText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    flex: 1,
  },
  tipIndicators: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    flexDirection: 'row',
  },
  tipIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 2,
  },
  tipIndicatorActive: {
    backgroundColor: COLORS.primary,
    width: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SIZES.margin,
    paddingHorizontal: SIZES.marginLarge,
  },
  toggleButton: {
    marginHorizontal: SIZES.margin / 2,
    flex: 1,
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
    marginVertical: SIZES.margin,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  chartTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  chart: {
    marginVertical: SIZES.margin,
    borderRadius: SIZES.radius,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginTop: SIZES.margin,
  },
  noDataText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginVertical: SIZES.marginLarge,
  },
  section: {
    paddingHorizontal: SIZES.marginLarge,
    marginTop: SIZES.marginLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.marginLarge,
  },
  achievementStatusCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    marginBottom: SIZES.marginLarge,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  achievementStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  achievementStatusTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    ...FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  statusMessage: {
    marginBottom: SIZES.margin,
  },
  statusMessageText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  progressCircleContainer: {
    marginBottom: SIZES.margin,
    alignItems: 'center',
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: COLORS.primary + '30',
  },
  progressCirclePercentage: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.primary,
  },
  progressCircleLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    marginBottom: SIZES.marginLarge,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementValue: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
    marginBottom: 4,
  },
  achievementLabel: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  achievementDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default StatsScreen; 