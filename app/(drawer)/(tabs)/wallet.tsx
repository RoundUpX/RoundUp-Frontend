import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Header from '../../../components/Header';
import TransactionOverview from '@/components/transactions';

const WalletScreen = () => {
  const currencySymbol = '₹';
  const API_BASE_URL = 'http://10.42.0.1:8082/api/v1';

  // State for wallet data
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wallet balance and transactions
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);

        // Fetch balance
        const balanceResponse = await fetch(`${API_BASE_URL}/wallet/balance`, {
          method: 'GET',
          headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0OTI0OTcsInVzZXJfaWQiOiI5OGVlOTE5ZS1kYzI4LTRhOTItOTUxMC01MzU4YWUzODI4NTYifQ.ij8YEckEFEooJYLp03I0QxSI6evOheSi5UKzuDkze60',          // Add host value if needed
          }
        });

        if (!balanceResponse.ok) {
          throw new Error(`Balance API error: ${balanceResponse.status}`);
        }

        const balanceData = await balanceResponse.json();
        console.log(balanceResponse)


        // Fetch transactions
        const transactionsResponse = await fetch(`${API_BASE_URL}/wallet/transactions`, {
          method: 'GET',
          headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM0OTI0OTcsInVzZXJfaWQiOiI5OGVlOTE5ZS1kYzI4LTRhOTItOTUxMC01MzU4YWUzODI4NTYifQ.ij8YEckEFEooJYLp03I0QxSI6evOheSi5UKzuDkze60'   // Add authorization if needed
          }
        });

        if (!transactionsResponse.ok) {
          console.log(transactionsResponse)
          throw new Error(`Transactions API error: ${transactionsResponse.status}`);
        }

        const transactionsData = await transactionsResponse.json();

        // Update state with fetched data
        setWalletBalance(balanceData.balance || 0);
        setTransactions(transactionsData || []);

      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Calculate daily saving average
  const dailySavingAverage = walletBalance / 30; // Simplified for this example

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header searchIconShown={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading wallet data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header searchIconShown={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header searchIconShown={false} />
      <ScrollView style={styles.content}>
        {/* Wallet Balance Section */}
        <View style={styles.totalBalance}>
          <Ionicons name="wallet" size={wp('8%')} color={COLORS.text.primary} />
          <View style={styles.dailySavingTextContainer}>
            <Text style={styles.totalBalanceLabel}>{'Total Amount'}</Text>
            <Text style={[styles.totalBalanceAmount, { color: walletBalance >= 0 ? '#51cf66' : '#ff6b6b' }]}>
              {currencySymbol}{Math.abs(walletBalance).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Daily Saving Average Section */}
        <View style={styles.dailySavingContainer}>
          <View style={styles.dailySavingBox}>
            <Ionicons name="logo-usd" size={wp('6%')} color={COLORS.text.primary} />
            <View style={styles.dailySavingTextContainer}>
              <Text style={styles.dailySavingLabel}>Daily Expenses</Text>
              <Text style={styles.dailySavingAmount}>{currencySymbol}{dailySavingAverage.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.dailySavingBox}>
            <Ionicons name="wallet" size={wp('6%')} color={COLORS.text.primary} />
            <View style={styles.dailySavingTextContainer}>
              <Text style={styles.dailySavingLabel}>Daily Saving</Text>
              <Text style={styles.dailySavingAmount}>{currencySymbol}{dailySavingAverage.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <Text style={styles.sectionTitle}>{'Recent Transactions'}</Text>
        <View style={styles.transactionsList}>
          <TransactionOverview transactions={transactions} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: COLORS.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('4%'),
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#ff6b6b',
    textAlign: 'center',
  },
  totalBalance: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: wp('4%'),
    width: wp('60%'),
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  totalBalanceLabel: {
    fontSize: wp('5%'),
    fontWeight: '400',
    opacity: 0.8,
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  dailySavingTextContainer: {
    marginLeft: wp('2%'),
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
});

export default WalletScreen;
