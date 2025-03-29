import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import icons from "../assets/icons/icons";
import { COLORS } from '@/constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const API_URL = 'http://10.42.0.1:8082/api/v1/transactions';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0MjMwODMsInVzZXJfaWQiOiI5OGVlOTE5ZS1kYzI4LTRhOTItOTUxMC01MzU4YWUzODI4NTYifQ.rSt4vBm60jIGuUfaXtbpgqefxhR5JrZ_a6KQ2zGAnGg"; // Change as needed

const Icon = ({ name, width = 24, height = 24 }) => {
  const icon = icons[name];
  if (!icon) return null;
  return <SvgXml xml={icon} width={width} height={height} />;
};

const getFormattedDate = (dateString) => {
  if (!dateString) return '';
  const createdDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (createdDate.toDateString() === today.toDateString()) return 'Today';
  if (createdDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return createdDate.toISOString().split('T')[0];
};

const TransactionOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // For testing purposes, you can use a static userID or implement filtering if needed
  const userID = 1;

  const fetchTransactions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
        },
      });
      
      // Assuming the API returns an array of transactions in response.data
      const fetchedTransactions = response.data;
      // Only update if there's a change to reduce unnecessary re-renders
      if (JSON.stringify(fetchedTransactions) !== JSON.stringify(transactions)) {
        setTransactions(fetchedTransactions);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transactions');
      console.error(error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch transactions on mount and refresh every 5 seconds
  useEffect(() => {
    fetchTransactions(true); // initial fetch with loader
    const intervalId = setInterval(() => {
      fetchTransactions(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Display a specific transaction by ID in an alert
  const viewTransaction = (txID) => {
    const transaction = transactions.find(txn => txn.id === txID);
    if (transaction) {
      Alert.alert('Transaction Details', JSON.stringify(transaction, null, 2));
    } else {
      Alert.alert('Error', 'Transaction not found');
    }
  };

  // Render individual transaction item
  const renderItem = ({ item: transaction }) => {
    const formattedAmount = `₹${transaction.amount}`;
    const roundedAmount = transaction.roundup ? `₹${transaction.roundup}` : '';
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => viewTransaction(transaction.id)}
        activeOpacity={0.7}
      >
        <View style={styles.newContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="currency-rupee" size={wp("10%")} color={"#fff"} />
          </View>
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
              {roundedAmount ? 'Saved ' + roundedAmount : ''}
            </Text>
            <View style={styles.bottomRow}>
              <View style={styles.leftInfo}>
                <Text style={styles.merchant}>
                  {transaction.merchant || ''}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.date}>
                  {transaction.created_at.split('T')[0] || ''}
                </Text>
              </View>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="search"
                  size={wp('3.8%')}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container1}>
      <View style={styles.container}>
        {loading && transactions.length === 0 ? (
          <Text>Loading transactions...</Text>
        ) : transactions.length === 0 ? (
          <Text>No transactions found</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: hp('2%') }}
          />
        )}
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
  },
  itemContainer: {
    width: '100%',
    padding: wp('2%'),
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd',
  },
  newContent: {
    alignItems: 'center',
    padding: wp('4%'),
    width: wp('90%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('4%'),
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
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
    color: '#68bb93',
    opacity: 0.8,
  },
  round: {
    fontSize: wp('3.5%'),
    color: '#ABA6DE',
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
    color: COLORS.BETTER_Pink,
  },
  dot: {
    fontSize: wp('3.2%'),
    color: '#6c757d',
    marginHorizontal: wp('1.5%'),
  },
  date: {
    fontSize: wp('3.2%'),
    color: COLORS.SUNDAR,
    opacity: 0.7,
  },
  deleteButton: {
    opacity: 0.6,
    padding: wp('1%'),
  },
});

export default TransactionOverview;
