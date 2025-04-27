import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, Platform, ToastAndroid, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../utils/AppContext';
import WaterProgress from '../components/WaterProgress';
import ContainerButton from '../components/ContainerButton';
import Button from '../components/Button';
import moment from 'moment';

const HomeScreen = () => {
  const { containers, addWaterIntake, unit, reminders, todayWater, deleteWaterEntry } = useApp();
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Function to show message across platforms
  const showMessage = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS and other platforms
      Alert.alert('Success', message);
    }
  };

  // Function to add water intake
  const handleAddWater = async (amount) => {
    await addWaterIntake(amount);
    // No message displayed after adding water
  };

  // Handle custom amount submission
  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handleAddWater(amount);
      setCustomModalVisible(false);
      setCustomAmount('');
    } else {
      // Still show error message for invalid input
      showMessage('Please enter a valid amount');
    }
  };

  // Handle delete entry
  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setConfirmDeleteVisible(true);
  };

  // Confirm delete entry
  const confirmDelete = async () => {
    if (selectedEntry) {
      await deleteWaterEntry(selectedEntry);
      setConfirmDeleteVisible(false);
      setSelectedEntry(null);
    }
  };

  // Get next reminder time (mock implementation)
  const getNextReminderTime = () => {
    if (!reminders.enabled) return null;

    const now = moment();
    const startTime = moment(reminders.startTime, 'HH:mm');
    const endTime = moment(reminders.endTime, 'HH:mm');

    // If current time is before start time, next reminder is at start time
    if (now.isBefore(startTime)) {
      return startTime.format('h:mm A');
    }

    // If current time is after end time, no more reminders today
    if (now.isAfter(endTime)) {
      return null;
    }

    // Calculate next reminder based on frequency
    const minutesSinceStart = now.diff(startTime, 'minutes');
    const reminderCycles = Math.floor(minutesSinceStart / reminders.frequency);
    const nextReminderMinutes = (reminderCycles + 1) * reminders.frequency;
    
    const nextReminder = moment(startTime).add(nextReminderMinutes, 'minutes');
    
    // If next reminder is after end time, no more reminders
    if (nextReminder.isAfter(endTime)) {
      return null;
    }

    return nextReminder.format('h:mm A');
  };

  const nextReminder = getNextReminderTime();

  // Render Container Items
  const renderContainerItem = ({ item }) => (
    <ContainerButton 
      container={item} 
      onPress={handleAddWater} 
      unit={unit} 
    />
  );

  // Render Entry Item
  const renderEntryItem = (entry, index) => (
    <View key={index} style={styles.entryItem}>
      <View style={styles.entryIcon}>
        <MaterialCommunityIcons name="cup" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.entryInfo}>
        <Text style={styles.entryAmount}>{entry.amount} {unit}</Text>
        <Text style={styles.entryTime}>
          {moment(entry.timestamp).format('h:mm A')}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteEntry(entry)}
      >
        <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Water Tracker</Text>
          <Text style={styles.subtitle}>
            {moment().format('dddd, MMMM D')}
          </Text>
        </View>

        {/* Progress Section */}
        <WaterProgress />

        {/* Reminders Section */}
        {reminders.enabled && nextReminder && (
          <View style={styles.reminderContainer}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={COLORS.primary} />
            <Text style={styles.reminderText}>
              Next reminder: {nextReminder}
            </Text>
          </View>
        )}

        {/* Quick Add Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <FlatList
            data={containers}
            renderItem={renderContainerItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.containerList}
          />
        </View>

        {/* Custom Add Button */}
        <Button
          title="Add Custom Amount"
          onPress={() => setCustomModalVisible(true)}
          type="outline"
          style={styles.customButton}
        />

        {/* Recent Entries */}
        {todayWater.entries.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today's Entries</Text>
            
            {showAllEntries ? (
              // Show all entries
              todayWater.entries.slice().reverse().map((entry, index) => renderEntryItem(entry, index))
            ) : (
              // Show only the latest 3 entries
              <>
                {todayWater.entries.slice(-3).reverse().map((entry, index) => renderEntryItem(entry, index))}
                
                {todayWater.entries.length > 3 && (
                  <Button
                    title={`Show All ${todayWater.entries.length} Entries`}
                    onPress={() => setShowAllEntries(true)}
                    type="outline"
                    size="small"
                    style={styles.showMoreButton}
                  />
                )}
              </>
            )}

            {showAllEntries && todayWater.entries.length > 3 && (
              <Button
                title="Show Less"
                onPress={() => setShowAllEntries(false)}
                type="outline"
                size="small"
                style={styles.showMoreButton}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Custom Amount Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customModalVisible}
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Custom Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.unitText}>{unit}</Text>
            </View>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setCustomModalVisible(false)}
                type="outline"
                style={styles.modalButton}
              />
              <Button
                title="Add"
                onPress={handleCustomAdd}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Entry</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this water entry of {selectedEntry?.amount} {unit}?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setConfirmDeleteVisible(false)}
                type="outline"
                style={styles.modalButton}
              />
              <Button
                title="Delete"
                onPress={confirmDelete}
                type="primary"
                style={[styles.modalButton, styles.deleteButtonModal]}
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
    paddingBottom: 20,
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
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    marginTop: SIZES.margin / 2,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.margin,
    paddingHorizontal: SIZES.marginLarge,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.marginLarge,
    marginVertical: SIZES.margin,
    ...SHADOWS.small,
  },
  reminderText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginLeft: SIZES.margin,
  },
  sectionContainer: {
    marginTop: SIZES.marginExtraLarge,
    paddingHorizontal: SIZES.marginLarge,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  containerList: {
    paddingVertical: SIZES.margin,
    paddingHorizontal: SIZES.marginLarge - 5,
  },
  customButton: {
    marginTop: SIZES.marginLarge,
    marginHorizontal: SIZES.marginLarge,
  },
  showMoreButton: {
    marginTop: SIZES.margin,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.margin,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    ...SHADOWS.small,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryInfo: {
    marginLeft: SIZES.margin,
    flex: 1,
  },
  entryAmount: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  entryTime: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  deleteButton: {
    padding: SIZES.margin / 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.marginLarge,
    ...SHADOWS.medium,
  },
  modalTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.marginLarge,
    textAlign: 'center',
  },
  modalText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.marginLarge,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.marginLarge,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.margin,
    fontSize: SIZES.medium,
  },
  unitText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginLeft: SIZES.margin,
    width: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: SIZES.margin / 2,
  },
  deleteButtonModal: {
    backgroundColor: COLORS.error,
  },
});

export default HomeScreen; 