import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, ScrollView, FlatList, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select'; // Importing RNPickerSelect
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed and imported

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

// Fake Data for Testing
const getUsers = () => {
  return [
    { id: 1, username: 'john_doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com' }
  ];
};

const getTransactionsByUserId = (userId) => {
  const transactions = [
    { id: 1, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: '1', date: '', merchant: 'Lunch' },
    { id: 2, user_id: 1, amount: 200.50, category: 'Transportation', roundup: '2', date: '24/03/26', merchant: 'Bus fare' },
    { id: 3, user_id: 2, amount: 50.75, category: 'Health & Fitness', roundup: '5', date: '', merchant: 'Gym membership' },
    { id: 4, user_id: 1, amount: 210.50, category: 'Transportation', roundup: '2', date: '24/03/26', merchant: 'Bus fare' },
    { id: 5, user_id: 1, amount: 50.75, category: 'Health & Fitness', roundup: '5', date: '', merchant: 'Gym membership' },
    { id: 6, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: '3', date: '', merchant: 'Gym membership' },
    { id: 7, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: '3', date: '', merchant: 'Gym membership' },
    { id: 8, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: '1', date: '', merchant: 'Lunch' },
    { id: 9, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: '3', date: '', merchant: 'Gym membership' },
    { id: 10, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: '1', date: '', merchant: 'Lunch' },
  ];
  return transactions.filter(txn => txn.user_id === userId);
};

const TransactionOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const userID = 1; // For testing purposes, you can use a static userID

  const displayUsers = () => {
    const users = getUsers();
    // console.log('Users:', users);
  };

  // Fetch and display transactions for a specific user
  const displayTransactionsForUser = (userId) => {
    const transactions = getTransactionsByUserId(userId);
    setTransactions(transactions);
    // console.log(`Transactions for user ${userId}:`, transactions);
  };

  useEffect(() => {
    displayUsers(); // Display users
    displayTransactionsForUser(userID); // Display transactions for user with ID 1 (Testing)
  }, []);

  const EXPENSE_CATEGORIES = [
    { label: "Food & Dining", value: "Food & Dining" },
    { label: "Transportation", value: "Transportation" },
    { label: "Shopping", value: "Shopping" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Bills & Utilities", value: "Bills & Utilities" },
    { label: "Health & Fitness", value: "Health & Fitness" },
    { label: "Travel", value: "Travel" },
    { label: "Other", value: "Other" },
  ];

  // Add a new transaction (Simulating API call)
  const addTransaction = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Amount and category are required');
      return;
    }

    const newTransaction = {
      amount: parseFloat(amount),
      category,
      merchant: merchant,
    };

    try {
      setLoading(true);
      // Simulate a successful API call by adding the transaction to the state
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      Alert.alert('Success', 'Transaction added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  // Display a specific transaction by ID
  const viewTransaction = (txID) => {
    const transaction = transactions.find(txn => txn.id === txID);
    if (transaction) {
      Alert.alert('Transaction Details', JSON.stringify(transaction, null, 2));
    } else {
      Alert.alert('Error', 'Transaction not found');
    }
  };

  return (
    <View style={styles.container1}>
      {/* Add Transaction Form */}
      
      {/* <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: "Select a Category", value: null }}
        value={category}
        onValueChange={(value) => setCategory(value)}
        items={EXPENSE_CATEGORIES}
      />
      <TextInput
        style={styles.input}
        value={merchant}
        onChangeText={setMerchant}
        placeholder="Merchant (optional)"
      />
      <Button title={loading ? "Adding..." : "Add Transaction"} onPress={addTransaction} disabled={loading} /> */}

      {/* Transaction List */}

      <View style={styles.container}>
        {/* Transaction List */}
        <ScrollView>
          {transactions.length === 0 ? (
            <Text>No transactions found</Text>
          ) : (
            transactions.map((transaction) => {
              const formattedAmount = `₹${transaction.amount}`;
              const roundedAmount = `₹${transaction.roundup}`;
              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.container}
                  onPress={() => viewTransaction(transaction.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.mainContent}>
                    <View style={styles.leftContent}>
                      <Text style={styles.category}>
                        {transaction.category || 'Uncategorized'}
                      </Text>
                    </View>
                    <Text
                      style={styles.amount}
                    >
                      {formattedAmount}
                    </Text>
                  </View>

                  <Text style={styles.round}>
                    {'Rounded ' + roundedAmount || ''}
                  </Text>

                  <View style={styles.bottomRow}>
                    <View style={styles.leftInfo}>
                      <Text style={styles.merchant}>
                        {transaction.merchant || ''}
                      </Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.date}>
                        {transaction.date}
                      </Text>
                    </View>

                    <TouchableOpacity
                      // onPress={alert('You cant delete this')}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.deleteButton}
                    >
                      <Ionicons
                        name=""
                        size={wp('3.8%')}
                        color={'#ff6b6b'}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

    </View>
  );
};



const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 16,
    paddingTop:0,
    marginTop:0,
    width: wp('100%'),
    // margin:hp('2%'),
    // backgroundColor:'#fff',
    // justifyContent: 'center',
  },
  transactionList: { flex: 1, backgroundColor: COLORS.background },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  transactionItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  transactionText: {
    fontSize: 18,
    marginBottom: 5,
  },

  container: {
    
    padding: wp('4%'),
    // paddingBlockEnd: wp('8%'),
    backgroundColor: COLORS.background, // Adjust to your preferred background color
    borderBottomWidth: 0.8,
    borderBottomColor: '#ddd', // Adjust the divider color as needed
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('0.5%'),
  },
  leftContent: {
    flex: 1,
    marginRight: wp('2%'),
  },
  category: {
    fontSize: wp('4%'),
    // fontWeight: '800',
    color: COLORS.text.primary, // Adjust the text color as needed
  },
  amount: {
    // paddingRight: hp('%'),
    fontSize: wp('4%'),
    fontWeight: '500',
    color:COLORS.text.secondary,
    opacity:0.8
  },
  round: {
    fontSize: wp('3.5%'),
    color: '#88D9E6',
    // marginBottom: hp('1%'),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  merchant: {
    fontSize: wp('3.2%'),
    color: COLORS.text.secondary,
  },
  dot: {
    fontSize: wp('3.2%'),
    color: '#6c757d',
    marginHorizontal: wp('1.5%'),
  },
  date: {
    fontSize: wp('3.2%'),
    color: COLORS.secondary,
    opacity:0.7
  },
  deleteButton: {
    opacity: 0.6,
    padding: wp('1%'),
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputIOS: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
};

export default TransactionOverview;
