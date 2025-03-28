import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const GoalOverview = () => {
  const [goal, setGoal] = useState(null);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const userID = 'your-user-id'; // Replace with actual user ID (authentication context or state)

  // Fetch the current goal from the backend
  const fetchGoal = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost/goals/${userID}`);
      setGoal(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load goal');
    } finally {
      setLoading(false);
    }
  };

  // Add a new goal to the backend
  const addGoal = async () => {
    if (!goalName || !goalAmount || !targetDate) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const newGoal = {
      name: goalName,
      amount: parseFloat(goalAmount),
      date: targetDate,
    };

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost/goals`, newGoal, {
        headers: { 'Authorization': `Bearer ${userID}` },
      });
      Alert.alert('Success', response.data.message);
      fetchGoal(); // Refresh goal data after adding
    } catch (error) {
      Alert.alert('Error', 'Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  // Update the existing goal
  const updateGoal = async () => {
    if (!goalName || !goalAmount || !targetDate) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const updatedGoal = {
      name: goalName,
      amount: parseFloat(goalAmount),
      date: targetDate,
    };

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost/goals`, updatedGoal, {
        headers: { 'Authorization': `Bearer ${userID}` },
      });
      Alert.alert('Success', response.data.message);
      fetchGoal(); // Refresh goal data after updating
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal(); // Fetch goal when component mounts
  }, []);

  return (
    <View style={styles.container}>
      {goal ? (
        <>
          {/* Display existing goal */}
          <Text style={styles.heading}>Current Goal</Text>
          <Text style={styles.goalText}>Name: {goal.name}</Text>
          <Text style={styles.goalText}>Amount: ₹{goal.amount}</Text>
          <Text style={styles.goalText}>Target Date: {goal.date}</Text>

          {/* Update goal form */}
          <Text style={styles.heading}>Update Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            value={goalName}
            onChangeText={setGoalName}
          />
          <TextInput
            style={styles.input}
            placeholder="Goal Amount"
            value={goalAmount}
            onChangeText={setGoalAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Target Date (YYYY-MM-DD)"
            value={targetDate}
            onChangeText={setTargetDate}
          />
          <Button
            title={loading ? 'Updating...' : 'Update Goal'}
            onPress={updateGoal}
            disabled={loading}
          />
        </>
      ) : (
        <>
          {/* Add goal form */}
          <Text style={styles.heading}>Set a New Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Goal Title"
            value={goalName}
            onChangeText={setGoalName}
          />
          <TextInput
            style={styles.input}
            placeholder="Goal Amount"
            value={goalAmount}
            onChangeText={setGoalAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Target Date (YYYY-MM-DD)"
            value={targetDate}
            onChangeText={setTargetDate}
          />
          <Button
            title={loading ? 'Adding...' : 'Add Goal'}
            onPress={addGoal}
            disabled={loading}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default GoalOverview;
