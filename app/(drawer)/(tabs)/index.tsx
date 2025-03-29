import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure installed: expo install @react-native-community/datetimepicker
import { COLORS } from '@/constants/theme';
import Header from '../../../components/Header';

const Settings = () => {
  const hardcodedPreferences = {
    roundupCategories: ["Groceries", "Transportation"],
    goalName: "Save for a trip",
    goalAmount: 5000,
    targetDate: new Date("2025-05-04"),
    currentSavings: 2000,
    roundupHistory: [0.5, 1.0, 1.5],
    roundupDates: [
      "2025-03-01 12:00:00",
      "2025-03-10 12:00:00",
      "2025-03-20 12:00:00"
    ]
  };

  const [preferences, setPreferences] = useState(hardcodedPreferences);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Exactly 10 categories (5 for left column, 5 for right column)
  const predefinedCategories = [
    { name: "Groceries", id: "Groceries" },
    { name: "Rent & Utilities", id: "Rent & Utilities" },
    { name: "Transportation", id: "Transportation" },
    { name: "Healthcare", id: "Healthcare" },
    { name: "Dining & Food", id: "Dining & Food" },
    { name: "Clothing & Accessories", id: "Clothing & Accessories" },
    { name: "Entertainment", id: "Entertainment" },
    { name: "Investments, Debt & Loans", id: "Investments, Debt & Loans" },
    { name: "Technology & Gadgets", id: "Technology & Gadgets" },
    { name: "Subscriptions & Memberships", id: "Subscriptions & Memberships" },
  ];

  // Split into two columns of 5 each
  const leftColumnCategories = predefinedCategories.slice(0, 5);
  const rightColumnCategories = predefinedCategories.slice(5);

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

  const handleSubmit = () => {
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

  // Toggle category selection on press
  const toggleCategory = (categoryId) => {
    let newCategories = [...preferences.roundupCategories];
    if (newCategories.includes(categoryId)) {
      newCategories = newCategories.filter((id) => id !== categoryId);
    } else {
      newCategories.push(categoryId);
    }
    handleChange('roundupCategories', newCategories);
  };

  // Render a column of category boxes
  const renderColumn = (columnCategories) => {
    return columnCategories.map((cat) => {
      const selected = preferences.roundupCategories.includes(cat.id);
      return (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.categoryBox,
            selected && styles.categoryBoxSelected,
          ]}
          onPress={() => toggleCategory(cat.id)}
        >
          <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Header searchIconShown={false} />
      <Text style={styles.mainHeader}>Settings</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Preferences Overview */}
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Current Preferences</Text>

            <View style={styles.preferenceItem}>
              <Text style={styles.label}>Roundup Categories:</Text>
              <Text style={styles.value}>
                {preferences.roundupCategories.join(', ')}
              </Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.label}>Goal:</Text>
              <Text style={styles.value}>
                {preferences.goalName} (₹{preferences.goalAmount})
              </Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.label}>Target Date:</Text>
              <Text style={styles.value}>{preferences.targetDate.toDateString()}</Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.label}>Current Savings:</Text>
              <Text style={styles.value}>₹{preferences.currentSavings}</Text>
            </View>
          </View>

          {/* Edit Preferences */}
          <Text style={styles.sectionHeader}>Edit Preferences</Text>

          {/* Categories in 2 Columns (5 left, 5 right) */}
          <View style={styles.card}>
            <Text style={styles.label}>Roundup Categories:</Text>
            <View style={styles.categoryRow}>
              {/* Left Column */}
              <View style={styles.categoryColumn}>
                {renderColumn(leftColumnCategories)}
              </View>
              {/* Right Column */}
              <View style={styles.categoryColumn}>
                {renderColumn(rightColumnCategories)}
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.card}>
            <Text style={styles.label}>Goal Name:</Text>
            <TextInput
              style={styles.input}
              value={preferences.goalName}
              onChangeText={(value) => handleChange('goalName', value)}
              placeholder="Goal name"
              placeholderTextColor={COLORS.text.secondary}
            />

            <Text style={styles.label}>Goal Amount:</Text>
            <TextInput
              style={styles.input}
              value={String(preferences.goalAmount)}
              onChangeText={(value) => handleChange('goalAmount', value)}
              placeholder="Goal amount"
              placeholderTextColor={COLORS.text.secondary}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Current Savings:</Text>
            <TextInput
              style={styles.input}
              value={String(preferences.currentSavings)}
              onChangeText={(value) => handleChange('currentSavings', value)}
              placeholder="Current savings"
              placeholderTextColor={COLORS.text.secondary}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Target Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={preferences.targetDate.toDateString()}
                editable={false}
                placeholderTextColor={COLORS.text.secondary}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={preferences.targetDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.lightbackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  preferenceItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 5,
    backgroundColor: 'rgb(46, 55, 69)',
    borderRadius: 5,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#584A90",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryColumn: {
    width: '48%',
  },
  categoryBox: {
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: COLORS.lightbackground,
    alignItems: 'center',
    // Same fixed size for all boxes:
    height: 60, // Adjust if needed for multiline text
    justifyContent: 'center',
  },
  categoryBoxSelected: {
    backgroundColor:"#584A90",
    borderColor: "#000",
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  categoryTextSelected: {
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
});

export default Settings;
