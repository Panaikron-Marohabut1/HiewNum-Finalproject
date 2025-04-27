import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  FlatList,
  Alert,
  Platform,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../utils/AppContext';
import Button from '../components/Button';
import { UNITS } from '../constants/water';

const SettingsScreen = () => {
  const { 
    waterGoal, 
    updateWaterGoal, 
    unit, 
    containers, 
    updateContainers,
    reminders,
    updateReminders
  } = useApp();

  // Local state for settings
  const [goalInput, setGoalInput] = useState(waterGoal?.toString() || '0');
  const [editingContainer, setEditingContainer] = useState(null);
  const [containerModal, setContainerModal] = useState(false);
  const [containerName, setContainerName] = useState('');
  const [containerAmount, setContainerAmount] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(reminders?.enabled || false);

  // Update water goal
  const handleUpdateGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      updateWaterGoal(newGoal);
      Alert.alert('Success', 'Daily water goal updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid amount');
    }
  };

  // Save new or edited container
  const handleSaveContainer = () => {
    if (!containerName.trim()) {
      Alert.alert('Error', 'Please enter a container name');
      return;
    }

    const amount = parseInt(containerAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (editingContainer) {
      // Update existing container
      const updatedContainers = containers.map(c => 
        c.id === editingContainer.id ? 
        { ...c, name: containerName, amount } : c
      );
      updateContainers(updatedContainers);
      Alert.alert('Success', 'Container updated successfully!');
    } else {
      // Add new container
      const newContainer = {
        id: Date.now(), // Simple unique ID
        name: containerName,
        amount,
        icon: 'cup-water', // Default icon
      };
      updateContainers([...containers, newContainer]);
      Alert.alert('Success', 'Container added successfully!');
    }

    resetContainerForm();
  };

  // Delete container
  const handleDeleteContainer = (id) => {
    Alert.alert(
      'Delete Container',
      'Are you sure you want to delete this container?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedContainers = containers.filter(c => c.id !== id);
            updateContainers(updatedContainers);
          },
        },
      ]
    );
  };

  // Reset container form
  const resetContainerForm = () => {
    setContainerName('');
    setContainerAmount('');
    setEditingContainer(null);
    setContainerModal(false);
  };

  // Edit container
  const handleEditContainer = (container) => {
    setEditingContainer(container);
    setContainerName(container.name);
    setContainerAmount(container.amount.toString());
    setContainerModal(true);
  };

  // Toggle reminder and save automatically
  const toggleReminder = (value) => {
    setReminderEnabled(value);
    
    // Update reminder settings immediately
    const newReminders = {
      ...reminders,
      enabled: value,
    };
    
    updateReminders(newReminders);
  };

  // Render container item
  const renderContainerItem = ({ item }) => (
    <View style={styles.containerItem}>
      <View style={styles.containerIcon}>
        <MaterialCommunityIcons name={item.icon || 'cup-water'} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.containerInfo}>
        <Text style={styles.containerName}>{item.name}</Text>
        <Text style={styles.containerAmount}>{item.amount} {unit}</Text>
      </View>
      <View style={styles.containerActions}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleEditContainer(item)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleDeleteContainer(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render time period blocks (morning, afternoon, evening)
  const timePeriods = [
    {
      title: 'Morning',
      times: ['6:00 AM', '8:00 AM', '10:00 AM']
    },
    {
      title: 'Afternoon',
      times: ['12:00 PM', '2:00 PM', '4:00 PM']
    },
    {
      title: 'Evening',
      times: ['6:00 PM', '8:00 PM', '10:00 PM', '12:00 AM']
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Water Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Water Goal</Text>
          <View style={styles.settingCard}>
            <Text style={styles.settingLabel}>Set Custom Goal</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={goalInput}
                onChangeText={setGoalInput}
                placeholder="Enter amount"
              />
              <Text style={styles.unitText}>{unit}</Text>
              <Button
                title="Save"
                onPress={handleUpdateGoal}
                size="small"
                style={styles.smallButton}
              />
            </View>
          </View>
        </View>

        {/* Container Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Container Settings</Text>
          <View style={styles.settingCard}>
            <FlatList
              data={containers}
              renderItem={renderContainerItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No containers added yet</Text>
              )}
            />
            <Button
              title="Add New Container"
              onPress={() => setContainerModal(true)}
              type="outline"
              style={styles.addButton}
            />
          </View>
        </View>

        {/* Reminder Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>
          <View style={styles.settingCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderHeaderText}>
                <Text style={styles.reminderTitle}>Stay Hydrated</Text>
                <Text style={styles.reminderDescription}>
                  Get notifications every 2 hours from 6:00 AM to midnight
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ false: COLORS.lightGrey, true: COLORS.primaryLight }}
                thumbColor={reminderEnabled ? COLORS.primary : COLORS.grey}
                ios_backgroundColor={COLORS.lightGrey}
              />
            </View>

            {reminderEnabled && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>Notification Schedule</Text>
                
                {timePeriods.map((period, index) => (
                  <View key={index} style={styles.timePeriodContainer}>
                    <Text style={styles.timePeriodTitle}>{period.title}</Text>
                    <View style={styles.timeRowContainer}>
                      {period.times.map((time, timeIndex) => (
                        <View key={timeIndex} style={styles.timeItem}>
                          <Text style={styles.timeText}>{time}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Container Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={containerModal}
        onRequestClose={resetContainerForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingContainer ? 'Edit Container' : 'Add New Container'}
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Container Name</Text>
              <TextInput
                style={styles.formInput}
                value={containerName}
                onChangeText={setContainerName}
                placeholder="e.g., Glass, Cup, Bottle"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amount ({unit})</Text>
              <TextInput
                style={styles.formInput}
                value={containerAmount}
                onChangeText={setContainerAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalButtonsContainer}>
              <Button
                title="Cancel"
                onPress={resetContainerForm}
                type="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveContainer}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: SIZES.marginLarge,
    paddingTop: SIZES.marginLarge,
    paddingBottom: SIZES.margin,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SIZES.marginLarge,
    marginBottom: SIZES.marginLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  settingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
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
  settingLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.margin,
    fontSize: SIZES.medium,
  },
  unitText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    marginHorizontal: SIZES.margin,
  },
  smallButton: {
    flex: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.margin,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.marginLarge,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: SIZES.marginLarge,
  },
  formLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.margin / 2,
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.margin,
    fontSize: SIZES.medium,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
  },
  modalButton: {
    flex: 0.48,
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.margin,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  containerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  containerInfo: {
    flex: 1,
  },
  containerName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  containerAmount: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  containerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: SIZES.margin / 2,
  },
  addButton: {
    marginTop: SIZES.marginLarge,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginVertical: SIZES.marginLarge,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin,
  },
  reminderHeaderText: {
    flex: 1,
  },
  reminderTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: 5,
  },
  reminderDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  scheduleContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.margin,
    marginTop: SIZES.margin,
  },
  scheduleTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    textAlign: 'center',
    paddingVertical: SIZES.margin,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: SIZES.margin,
  },
  timePeriodContainer: {
    marginBottom: SIZES.margin,
  },
  timePeriodTitle: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginBottom: SIZES.margin / 2,
  },
  timeRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  timeItem: {
    paddingVertical: SIZES.margin / 2,
    paddingHorizontal: SIZES.margin,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginRight: SIZES.margin,
    marginBottom: SIZES.margin / 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  timeText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  }
});

export default SettingsScreen; 