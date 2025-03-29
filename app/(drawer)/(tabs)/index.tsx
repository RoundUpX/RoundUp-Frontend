import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { COLORS } from '@/constants/theme';
import Header from '../../../components/Header';

const Settings = () => {
  const hardcodedPreferences = {
    roundupCategories: ["account", "commute"],
    goalName: "Save for a trip",
    goalAmount: 5000,
    targetDate: new Date("2025-05-04"),
    currentSavings: 2000,
    roundupHistory: [0.50, 1.00, 1.50],
    roundupDates: [
      "2025-03-01 12:00:00",
      "2025-03-10 12:00:00",
      "2025-03-20 12:00:00"
    ]
  };

  const [preferences, setPreferences] = useState(hardcodedPreferences);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setPreferences(hardcodedPreferences);
      setLoading(false);
    }, 500);
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
    }, 1000);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('targetDate', selectedDate);
    }
  };

  return (
    <View style={styles.container}>
            <Header searchIconShown={false} />
      <Text style={styles.header}>Settings</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={[preferences]}
          renderItem={() => (
            <>
               {/* Current Preferences Box */}
              <View style={styles.currentPreferencesBox}>
                <Text style={styles.subHeader}>Current Preferences</Text>

                <Text style={styles.label}>Roundup Categories:</Text>
                <Text style={styles.currentValue}>
                  {preferences.roundupCategories.join(', ')}
                </Text>

                <Text style={styles.label}>Goal Name:</Text>
                <Text style={styles.currentValue}>{preferences.goalName}</Text>

                <Text style={styles.label}>Goal Amount:</Text>
                <Text style={styles.currentValue}>₹{preferences.goalAmount}</Text>

                <Text style={styles.label}>Target Date:</Text>
                <Text style={styles.currentValue}>{preferences.targetDate.toDateString()}</Text>

                <Text style={styles.label}>Current Savings:</Text>
                <Text style={styles.currentValue}>₹{preferences.currentSavings}</Text>

                <Text style={styles.label}>Roundup History:</Text>
                <Text style={styles.currentValue}>{preferences.roundupHistory.join(' : ')}</Text>

                <Text style={styles.label}>Roundup Dates:</Text>
                <Text style={styles.currentValue}>{preferences.roundupDates.join('\n')}</Text>
              </View>

              {/* Edit Preferences */}
              <Text style={styles.subHeader}>Edit Preferences</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup Categories:</Text>
                <MultiSelect
                  ref={multiSelectRef}
                  items={predefinedCategories}
                  uniqueKey="id"
                  onSelectedItemsChange={(selectedItems) =>
                    handleChange('roundupCategories', selectedItems)
                  }
                  selectedItems={preferences.roundupCategories}
                  selectText="Select Categories"
                  styleTextDropdownSelected={styles.dropText}
                  searchInputPlaceholderText="Search Categories..."
                  tagRemoveIconColor={COLORS.text.secondary}
                  tagBorderColor={COLORS.text.secondary}
                  tagTextColor={COLORS.text.primary}
                  selectedItemTextColor={COLORS.accent}
                  selectedItemIconColor={COLORS.accent}
                  itemTextColor={COLORS.text.primary}
                  displayKey="name"
                  searchInputStyle={{ color: COLORS.text.primary }}
                  submitButtonColor={COLORS.primary}
                  submitButtonText="Submit"
                  styleDropdownMenu={styles.multiSelectDropdown}
                  styleDropdownMenuSubsection={styles.multiSelectSubsection}
                  styleInputGroup={{ backgroundColor: COLORS.lightbackground }}
                  styleItemsContainer={{ backgroundColor: COLORS.lightbackground }}
                  styleListContainer={{ backgroundColor: COLORS.lightbackground }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Goal Name:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.goalName}
                  onChangeText={(value) => handleChange('goalName', value)}
                  placeholder="e.g., Save for a trip"
                  placeholderTextColor={COLORS.text.secondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Goal Amount:</Text>
                <TextInput
                  style={styles.input}
                  value={String(preferences.goalAmount)}
                  onChangeText={(value) => handleChange('goalAmount', value)}
                  placeholder="e.g., 5000"
                  placeholderTextColor={COLORS.text.secondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Target Date (TODO//):</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    style={styles.input}
                    value={preferences.targetDate.toDateString()}
                    editable={false}
                    placeholderTextColor={COLORS.text.secondary}
                  />
                </TouchableOpacity>
                {showDatePicker && (
                  // NOTE: Make sure you have the correct import and usage for DateTimePicker in your project
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
                  placeholderTextColor={COLORS.text.secondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup History(IDK WHY):</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.roundupHistory.join(', ')}
                  onChangeText={(value) => handleChange('roundupHistory', value)}
                  placeholder="e.g., 0.50, 1.00"
                  placeholderTextColor={COLORS.text.secondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roundup Dates:</Text>
                <TextInput
                  style={styles.input}
                  value={preferences.roundupDates.join(': ')}
                  onChangeText={(value) => handleChange('roundupDates', value)}
                  placeholder="e.g., 2025-03-01, 2025-03-10"
                  placeholderTextColor={COLORS.text.secondary}
                />
              </View>

              <Button title="Save Changes" onPress={handleSubmit} color={COLORS.primary} />
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginVertical: 20,
    color: COLORS.text.primary,
  },
  subHeader: {
    fontSize: 22,    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 10,
    marginBottom: 10,
    color: COLORS.text.primary,
  },
  currentPreferencesBox: {
    padding: 15,
    backgroundColor: COLORS.lightbackground,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.text.primary,
  },
  currentValue: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgb(46, 55, 69)', // or use another subtle shade
    borderRadius: 5,
    color: COLORS.text.primary,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444', // darker border to match dark theme
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    color: COLORS.text.primary,
    backgroundColor: COLORS.lightbackground,
  },
  multiSelectDropdown: {
    backgroundColor: COLORS.background,
    borderRadius:50,
    padding: 0,
    paddingBottom:0,
    alignItems:'center',
    justifyContent:'center',
  },
  multiSelectSubsection: {
    backgroundColor: COLORS.lightbackground,
  },
  dropText:{
    // textAlign:'center',
    color:COLORS.text.primary,
    paddingLeft:15,
  },
});

export default Settings;
