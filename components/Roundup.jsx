import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RoundupDialog = ({ visible, onClose, userID }) => {
  const [amount, setAmount] = useState('');
  const [roundup, setRoundup] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle the amount input change
  const handleAmountChange = (value) => {
    setAmount(value);
    setRoundup(null); // Reset roundup when amount is changed
  };

  // Send the amount to the backend for roundup calculation
  const calculateRoundup = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost/roundup', {
        userID: userID,
        transactionAmount: parseFloat(amount),
      });

      // Assume the backend returns the calculated roundup
      const { roundupAmount } = response.data;

      setRoundup(roundupAmount);
    } catch (error) {
      console.error('Error calculating roundup:', error);
      Alert.alert('Error', 'Failed to calculate roundup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Enter Transaction Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
          />

          <Button
            title={loading ? 'Calculating...' : 'Calculate Roundup'}
            onPress={calculateRoundup}
            disabled={loading}
          />

          {roundup !== null && (
            <View style={styles.roundupContainer}>
              <Text style={styles.roundupText}>Rounded-up amount: ₹{roundup.toFixed(2)}</Text>
            </View>
          )}

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  roundupContainer: {
    marginTop: 20,
  },
  roundupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoundupDialog;
