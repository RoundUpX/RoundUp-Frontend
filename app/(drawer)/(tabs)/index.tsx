import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select'; // For multiple category selection
import DateTimePicker from '@react-native-community/datetimepicker'; // For Date Picker

const Settings = () => {
  const hardcodedPreferences = {
    roundupCategories: ["account", "Transportation"],
    goalName: "Save for a trip",
    goalAmount: 5000,
    targetDate: new Date("2025-05-04"), // Use Date object for date picker
    currentSavings: 2000,
    roundupHistory: [0.50, 1.00, 1.50],
    roundupDates: [
      "2025-03-01 12:00:00",
      "2025-03-10 12:00:00",
      "2025-03-20 12:00:00"
    ]
  };

  const [preferences, setPreferences] = useState(hardcodedPreferences); // Using hardcoded data for now
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State for Date Picker visibility

  const predefinedCategories = [
    { name: "account", id: "account" },
    { name: "apparel", id: "apparel" },
    { name: "Transportation", id: "commute" },
    { name: "devices", id: "devices" },
    { name: "grocery", id: "grocery" },
    { name: "medications", id: "medication" },
    { name: "money_bag", id: "money_bag" },
    { name: "restaurant", id: "restaurant" },
    { name: "subscriptions", id: "subscriptions" },
    { name: "videogame", id: "videogame" },
    { name: "wallet", id: "wallet" },
  ];

  const multiSelectRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPreferences(hardcodedPreferences); // Set hardcoded preferences after mock delay
      setLoading(false);
    }, 500); // Mock API delay
  }, []);

  const handleChange = (name, value) => {
    setPreferences({
      ...preferences,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      Alert.alert("Preferences Updated", "Your preferences have been updated successfully.");
      setLoading(false);
    }, 1000); // Mock API delay
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('targetDate', selectedDate);
    }
  };

  return (
    <View style={styles.scrollViewContainer}>
      <Text style={styles.header}>Settings</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={[preferences]} // Passing the preferences as a single-item array to use FlatList
          renderItem={() => (
            <>
              {/* Displaying current preferences in a distinct box with a different color */}
              <View style={styles.currentPreferencesBox}>
                <Text style={styles.subHeader}>Current Preferences:</Text>

                <Text style={styles.label}>Roundup Categories:</Text>
                <Text style={styles.currentValue}>{preferences.roundupCategories.join(', ')}</Text>

                <Text style={styles.label}>Goal Name:</Text>
                <Text style={styles.currentValue}>{preferences.goalName}</Text>

                <Text style={styles.label}>Goal Amount:</Text>
                <Text style={styles.currentValue}>₹{preferences.goalAmount}</Text>

                <Text style={styles.label}>Target Date:</Text>
                <Text style={styles.currentValue}>{preferences.targetDate.toDateString()}</Text>

                <Text style={styles.label}>Current Savings:</Text>
                <Text style={styles.currentValue}>₹{preferences.currentSavings}</Text>

                <Text style={styles.label}>Roundup History:</Text>
                <Text style={styles.currentValue}>{preferences.roundupHistory.join(', ')}</Text>

                <Text style={styles.label}>Roundup Dates:</Text>
                <Text style={styles.currentValue}>{preferences.roundupDates.join(', ')}</Text>
              </View>

              <Text style={styles.subHeader}>Edit Preferences:</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup Categories:</Text>
                <MultiSelect
                  ref={multiSelectRef}
                  items={predefinedCategories}
                  uniqueKey="name"
                  onSelectedItemsChange={(selectedItems) => handleChange('roundupCategories', selectedItems)}
                  selectedItems={preferences.roundupCategories}
                  selectText="Select Categories"
                  searchInputPlaceholderText="Search Categories..."
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#333"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#48BBEC"
                  submitButtonText="Submit"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Goal Name:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.goalName}
                  onChangeText={(value) => handleChange('goalName', value)}
                  placeholder="e.g., Save for a trip"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Goal Amount:</Text>
                <TextInput
                  style={styles.input}
                  value={String(preferences.goalAmount)}
                  onChangeText={(value) => handleChange('goalAmount', value)}
                  placeholder="e.g., 5000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Target Date:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.targetDate.toDateString()}
                  onFocus={() => setShowDatePicker(true)} // Trigger date picker on focus
                  editable={false} // Disable direct editing, only allow date picker
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={preferences.targetDate}
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Savings:</Text>
                <TextInput
                  style={styles.input}
                  value={String(preferences.currentSavings)}
                  onChangeText={(value) => handleChange('currentSavings', value)}
                  placeholder="e.g., 2000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup History:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.roundupHistory.join(', ')} // assuming it's an array
                  onChangeText={(value) => handleChange('roundupHistory', value)}
                  placeholder="e.g., 0.50, 1.00"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup Dates:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.roundupDates.join(', ')} // assuming it's an array
                  onChangeText={(value) => handleChange('roundupDates', value)}
                  placeholder="e.g., 2025-03-01, 2025-03-10"
                />
              </View>

              <Button title="Save Changes" onPress={handleSubmit} />
            </>
          )}
          keyExtractor={() => 'settings'}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  currentPreferencesBox: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 20,
  },
  currentValue: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
});

export default Settings;
