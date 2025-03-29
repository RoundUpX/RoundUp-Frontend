import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, ScrollView, FlatList, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select'; // Importing RNPickerSelect
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed and imported

import { SvgXml } from "react-native-svg";
import icons from "../assets/icons/icons"; // Import all icons

const Icon = ({ name, width = 24, height = 24 }) => {
  const icon = icons[name];
  if (!icon) return null;
  return <SvgXml xml={icon} width={width} height={height} />;
};

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const API_URL = 'http://10.42.0.1:8082/api/v1/transactions'; 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0MjMwODMsInVzZXJfaWQiOiI5OGVlOTE5ZS1kYzI4LTRhOTItOTUxMC01MzU4YWUzODI4NTYifQ.rSt4vBm60jIGuUfaXtbpgqefxhR5JrZ_a6KQ2zGAnGg"; // Change as needed

const TransactionOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const userID = 1; // For testing purposes, you can use a static userID

  // Fetch transactions from the API and filter by user ID
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
        },
      });

      // console.log(response.data)
      
      // Assuming the API returns an array of transactions in response.data
      const allTransactions = response.data;
      const userTransactions = allTransactions;
      setTransactions(userTransactions);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
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
      user_id: userID,
    };

    try {
      setLoading(true);
      // Post the new transaction to the API
      const response = await axios.post(API_URL, newTransaction, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Assuming the API returns the created transaction in response.data
      setTransactions(prevTransactions => [...prevTransactions, response.data]);
      Alert.alert('Success', 'Transaction added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
      console.error(error);
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
      <View style={styles.container}>
        {/* Transaction List */}
        <ScrollView>
          {loading ? (
            <Text>Loading transactions...</Text>
          ) : transactions.length === 0 ? (
            <Text>No transactions found</Text>
          ) : (
            transactions.map((transaction) => {
              const formattedAmount = `₹${transaction.amount}`;
              const roundedAmount = transaction.roundup ? `₹${transaction.roundup}` : '';
              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.container}
                  onPress={() => viewTransaction(transaction.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.newContent}>
                    <Ionicons name="logo-usd" size={wp('6%')} color={COLORS.text.primary} /> 
                    <View style={styles.second}>
                      <View style={styles.mainContent}>
                        <View style={styles.leftContent}>
                          <Text style={styles.category}>
                            {transaction.category || 'Uncategorized'}
                          </Text>
                        </View>
                        <Text style={styles.amount}>{formattedAmount}</Text>
                      </View>
                      <Text style={styles.round}>
                        {roundedAmount ? 'Rounded ' + roundedAmount : ''}
                      </Text>
                      <View style={styles.bottomRow}>
                        <View style={styles.leftInfo}>
                          <Text style={styles.merchant}>
                            {transaction.merchant || ''}
                          </Text>
                          <Text style={styles.dot}>•</Text>
                          <Text style={styles.date}>
                            {transaction.date || 'N/A'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={styles.deleteButton}
                        >
                          <Ionicons
                            name="search"
                            size={wp('3.8%')}
                            color={'#8a36c9'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
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
    backgroundColor: COLORS.background,
  },
  container: {
    width: '100%',
    padding: wp('2%'),
    backgroundColor: COLORS.background,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd',
  },
  newContent: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: wp('4%'),
    width: wp('90%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('4%'),
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  second: {
    width: '85%',
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
    color: COLORS.text.primary,
  },
  amount: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: COLORS.text.secondary,
    opacity: 0.8,
  },
  round: {
    fontSize: wp('3.5%'),
    color: '#6c757d',
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
    opacity: 0.7,
  },
  deleteButton: {
    opacity: 0.6,
    padding: wp('1%'),
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
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
