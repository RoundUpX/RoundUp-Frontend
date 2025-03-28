import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importing Ionicons
import { COLORS } from '../../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Header from '../../../components/Header';
import TransactionOverview from '@/components/transactions';


const WalletScreen = () => {
  const currencySymbol = '₹';

  // Example data for account balances (Can be updated dynamically)
  const [accountBalances, setAccountBalances] = useState({
    'Credit Card': 0,
    'Cash': 5000,
    'Savings': 15000,
    'Bank Account': 0,
    'Investment': 0
  });

  // Calculate saved amount
  const savedAmount = accountBalances['Cash'] + accountBalances['Savings'];

  // Calculate daily saving average
  const dailySavingAverage = savedAmount / 30; // Assuming 30 days in a month for simplicity



  return (
    <SafeAreaView style={styles.container}>
      <Header searchIconShown={false} />
      <ScrollView style={styles.content}>
        {/* Saved Amount Section */}
        <View style={styles.totalBalance}>
            <Ionicons name="wallet" size={wp('8%')} color={COLORS.text.primary} /> {/* Icon for Left Side */}
            <View style={styles.dailySavingTextContainer}>
            <Text style={styles.totalBalanceLabel}>{'Total Amount'}</Text>
            <Text style={[styles.totalBalanceAmount, { color: savedAmount >= 0 ? '#51cf66' : '#ff6b6b' }]}>{currencySymbol}{Math.abs(savedAmount).toFixed(2)}</Text>
          </View>
        </View>

        {/* Daily Saving Average Section */}
        <View style={styles.dailySavingContainer}>
          <View style={styles.dailySavingBox}>
            <Ionicons name="logo-usd" size={wp('6%')} color={COLORS.text.primary} /> {/* Icon for Left Side */}
            <View style={styles.dailySavingTextContainer}>
              <Text style={styles.dailySavingLabel}>Daily Expenses</Text>
              <Text style={styles.dailySavingAmount}>{currencySymbol}{dailySavingAverage.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.dailySavingBox}>
            <Ionicons name="wallet" size={wp('6%')} color={COLORS.text.primary} /> {/* Icon for Left Side */}
            <View style={styles.dailySavingTextContainer}>
              <Text style={styles.dailySavingLabel}>Daily Saving</Text>
              <Text style={styles.dailySavingAmount}>{currencySymbol}{dailySavingAverage.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <Text style={styles.sectionTitle}>{'Recent Transactions'}</Text>
        <View style={styles.transactionsList}>
        <TransactionOverview/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  totalBalance: {
    alignSelf:'center',
    alignItems: 'center',
    padding: wp('4%'),
    width:wp('60%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-evenly',
  },
  totalBalanceLabel: {
    fontSize: wp('5%'),
    fontWeight: '400',
    opacity:0.8,
    color: COLORS.text.primary,
  },
  totalBalanceAmount: {
    fontSize: wp('7%'),
    fontWeight: '600',
  },
  dailySavingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp('4%'),
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightbackground
  },
  dailySavingBox: {
    flexDirection: 'row',
    flex: 1,
    padding: wp('3%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
    justifyContent:'space-evenly',
    alignItems: 'center', // Aligns both the icon and text horizontally
  },
  dailySavingTextContainer: {
    marginLeft: wp('2%'), // Space between icon and text
  },
  dailySavingLabel: {
    fontSize: wp('3.5%'),
    color: COLORS.text.secondary,
    marginBottom: hp('0.5%'),
  },
  dailySavingAmount: {
    fontSize: wp('5%'),
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '500',
    color: COLORS.text.primary,
    padding: wp('4%'),
    paddingBottom: wp('2%')
  },
  transactionsList: {
    // padding: wp('4%'),
  },
  transactionItem: {
    marginBottom: wp('3%'),
    padding: wp('4%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('3%'),
  },
  transactionType: {
    fontSize: wp('4.5%'),
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  transactionAmount: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  transactionDate: {
    fontSize: wp('3.5%'),
    color: COLORS.text.secondary,
    marginTop: hp('0.5%'),
  },
});

export default WalletScreen;
