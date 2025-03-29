import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Dimensions, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const getTransactionsByUserId = (userId) => {
  const transactions = [
    { id: 1, user_id: 1, amount: 100.0, category: 'Food', roundup: 5, date: '2025-03-21', merchant: 'Lunch' },
    { id: 2, user_id: 1, amount: 210.5, category: 'Transportation', roundup: 2, date: '2025-03-25', merchant: 'Bus fare' },
    { id: 3, user_id: 1, amount: 100.0, category: 'Food', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
    { id: 4, user_id: 2, amount: 100.0, category: 'Food', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
    { id: 5, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 6, user_id: 2, amount: 50.75, category: 'Health', roundup: 5, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 7, user_id: 2, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 8, user_id: 1, amount: 200.5, category: 'Transportation', roundup: 10, date: '2025-03-27', merchant: 'Bus fare' },
    { id: 9, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 10, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 11, user_id: 1, amount: 50.75, category: 'Health', roundup: 5, date: '2025-03-28', merchant: 'Gym membership' },
    { id: 12, user_id: 1, amount: 100.0, category: 'Food', roundup: 14, date: '2025-03-28', merchant: 'Lunch' },
    { id: 13, user_id: 1, amount: 100.0, category: 'Food', roundup: 1, date: '2025-03-28', merchant: 'Lunch' },
  ];
  return transactions.filter((txn) => txn.user_id === userId);
};

const Analysis = () => {
  const userId = 1;
  const goalAmount = 100.0;
  const transactions = getTransactionsByUserId(userId);

  const totalSaved = transactions.reduce((acc, txn) => acc + txn.roundup, 0);
  const remainingGoalAmount = goalAmount - totalSaved; // Remaining amount needed

  // Calculate daily savings for chart
  const dailySavings = {};
  transactions.forEach((txn) => {
    const date = txn.date;
    if (!dailySavings[date]) {
      dailySavings[date] = 0;
    }
    dailySavings[date] += txn.roundup;
  });
  const formattedLabels = Object.keys(dailySavings).map((date) => date.slice(-2));
  const lineChartData = {
    labels: formattedLabels,
    datasets: [
      {
        data: Object.values(dailySavings),
        color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  // Get the last 5 transactions (sorted descending by date)
  const sortedTransactions = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  const recentTransactions = sortedTransactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        {/* Gradient Goal Card */}
        <LinearGradient
          colors={["#2C3E50", "#4CA1AF"]} // A cool dark blue to turquoise gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.DreamContainer}
        >
          <Text style={styles.chartTitle}>Goal Completion</Text>
          <Text style={styles.progressText}>
            <Text style={styles.boldText}>
              {"₹" + remainingGoalAmount.toFixed(2)}
            </Text>
            {" remaining"}
          </Text>
          <ProgressBar
            progress={(goalAmount - remainingGoalAmount) / goalAmount} // Progress so far
            color={"#59a586"} // A vibrant amber that complements the gradient
            style={styles.progressBar}
          />
        </LinearGradient>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Savings Progress</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: `rgba(0, 0, 0, 0)`,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 255, 255, 1)`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
              style: { borderRadius: 20 },
              propsForLabels: { fontSize: 10, fontWeight: "bold" },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            yAxisLabel="₹"
            fromZero
            segments={5}
          />
        </View>

        {/* Recent Transactions List */}
        <View style={styles.recentTransactionsContainer}>
          <Text style={styles.recentTransactionsTitle}>Recent Transactions</Text>
          {recentTransactions.map((txn) => (
            <View key={txn.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                {txn.date} - {txn.merchant} - ₹{txn.amount.toFixed(2)}
              </Text>
            </View>
          ))}
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
    padding: wp("5%"),
  },
  chartContainer: {
    marginBottom: hp("5%"),
  },
  DreamContainer: {
    height: hp("30%"), // Increased height for larger card
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("3%"),
  },
  chartTitle: {
    fontSize: wp("6%"), // Increased font size for "Goal Completion"
    fontWeight: "bold",
    color: "white", // Set title text to white
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  progressBar: {
    width: wp("80%"),
    marginTop: hp("2%"),
    height: 20, // Thicker progress bar
    borderRadius: 10,
  },
  boldText: {
    fontSize: 32, // Adjusted font size for remaining amount
    fontWeight: "bold",
    color: "white", // Set remaining amount to white
  },
  progressText: {
    fontSize: 18, // Increase font size for progress text
    color: "white", // Set progress text color to white
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginVertical: hp("2%"),
  },
  recentTransactionsContainer: {
    marginTop: hp("3%"),
    padding: wp("3%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  recentTransactionsTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  transactionItem: {
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  transactionText: {
    fontSize: wp("4%"),
    color: COLORS.text.primary,
    textAlign: "center",
  },
});

export default Analysis;
