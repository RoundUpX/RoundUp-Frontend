import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const getTransactionsByUserId = (userId) => {
  const transactions = [
    { id: 1, user_id: 1, amount: 100.0, category: "Food", roundup: 59, date: "2025-03-21", merchant: "Lunch" },
    { id: 2, user_id: 1, amount: 210.5, category: "Transportation", roundup: 2, date: "2025-03-25", merchant: "Bus fare" },
    { id: 3, user_id: 1, amount: 100.0, category: "Food", roundup: 1, date: "2025-03-25", merchant: "Lunch" },
    { id: 4, user_id: 2, amount: 100.0, category: "Food", roundup: 91, date: "2025-03-25", merchant: "Lunch" },
    { id: 5, user_id: 1, amount: 150.75, category: "Health", roundup: 3, date: "2025-03-26", merchant: "Gym membership" },
    { id: 6, user_id: 2, amount: 50.75, category: "Health", roundup: 55, date: "2025-03-26", merchant: "Gym membership" },
    { id: 7, user_id: 2, amount: 150.75, category: "Health", roundup: 43, date: "2025-03-26", merchant: "Gym membership" },
    { id: 8, user_id: 1, amount: 200.5, category: "Transportation", roundup: 10, date: "2025-03-27", merchant: "Bus fare" },
    { id: 9, user_id: 1, amount: 150.75, category: "Health", roundup: 43, date: "2025-03-27", merchant: "Gym membership" },
    { id: 10, user_id: 1, amount: 150.75, category: "Health", roundup: 103, date: "2025-03-27", merchant: "Gym membership" },
    { id: 11, user_id: 1, amount: 50.75, category: "Health", roundup: 95, date: "2025-03-28", merchant: "Gym membership" },
    { id: 12, user_id: 1, amount: 100.0, category: "Food", roundup: 14, date: "2025-03-28", merchant: "Lunch" },
    { id: 13, user_id: 1, amount: 100.0, category: "Food", roundup: 1, date: "2025-03-28", merchant: "Lunch" },
  ];
  return transactions.filter((txn) => txn.user_id === userId);
};

const Analysis = () => {
  const userId = 1;
  const goalAmount = 1000.0;
  const transactions = getTransactionsByUserId(userId);

  const totalSaved = transactions.reduce((acc, txn) => acc + txn.roundup, 0);
  const remainingGoalAmount = goalAmount - totalSaved; // Remaining amount needed

  // Sort transactions descending by date and take the last 5 transactions
  const sortedTransactions = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  const recentTransactions = sortedTransactions.slice(0, 5);

  // Build chart data using each recent transaction as a separate point
  // For labels, we use the last two digits of the date plus an index to ensure uniqueness.
  const chartLabels = recentTransactions.map((txn, index) => {
    return `${txn.date.slice(-2)}-${index + 1}`;
  });
  const chartDataPoints = recentTransactions.map((txn) => txn.roundup);

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataPoints,
        color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  // Helper to show transaction details
  const viewTransaction = (tx) => {
    Alert.alert("Transaction Details", JSON.stringify(tx, null, 2));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        {/* Gradient Goal Card */}
        <LinearGradient
          colors={["#2C3E50", "#4CA1AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.DreamContainer}
        >
          <Text style={styles.chartTitle}>Trip to Shillong</Text>
          <Text style={styles.progressText}>
            <Text style={styles.boldText}>{"₹" + remainingGoalAmount.toFixed(2)}</Text>
            {" remaining"}
          </Text>
          <ProgressBar
            progress={(goalAmount - remainingGoalAmount) / goalAmount}
            color={"#59a586"}
            style={styles.progressBar}
          />
        </LinearGradient>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Savings Progress (Last 5 Transactions)</Text>
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
          {recentTransactions.map((txn) => {
            const formattedAmount = `₹${txn.amount.toFixed(2)}`;
            const roundedAmount = txn.roundup ? `₹${txn.roundup}` : "";
            return (
              <TouchableOpacity
                key={txn.id}
                style={styles.transactionWrapper}
                onPress={() => viewTransaction(txn)}
                activeOpacity={0.7}
              >
                <View style={styles.newContent}>
                  <View style={styles.iconsss}>
                    <MaterialIcons name="currency-rupee" size={wp("10%")} color={"#fff"} />
                  </View>
                  <View style={styles.second}>
                    <View style={styles.mainContent}>
                      <View style={styles.leftContent}>
                        <Text style={styles.category}>
                          {txn.category || "Uncategorized"}
                        </Text>
                      </View>
                      <Text style={styles.amount}>{formattedAmount}</Text>
                    </View>
                    <Text style={styles.round}>
                      {roundedAmount ? "Saved " + roundedAmount : ""}
                    </Text>
                    <View style={styles.bottomRow}>
                      <View style={styles.leftInfo}>
                        <Text style={styles.merchant}>
                          {txn.merchant || ""}
                        </Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.date}>
                          {txn.date || ""}
                        </Text>
                      </View>
                      <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="search" size={wp("3.8%")} color={"#fff"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    height: hp("30%"),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("3%"),
  },
  chartTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "white",
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  progressBar: {
    width: wp("80%"),
    marginTop: hp("2%"),
    height: 20,
    borderRadius: 10,
  },
  boldText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  progressText: {
    fontSize: 18,
    color: "white",
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
  transactionWrapper: {
    width: "100%",
    padding: wp("2%"),
    borderBottomWidth: 0.3,
    borderBottomColor: "#ddd",
  },
  newContent: {
    alignItems: "center",
    padding: wp("4%"),
    width: "100%",
    backgroundColor: COLORS.lightbackground,
    borderRadius: wp("4%"),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconsss: {
    marginRight: wp("3%"),
  },
  second: {
    width: "85%",
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("0.5%"),
  },
  leftContent: {
    flex: 1,
    marginRight: wp("2%"),
  },
  category: {
    fontSize: wp("4%"),
    color: COLORS.text.primary,
  },
  amount: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: "#68bb93",
    opacity: 0.8,
  },
  round: {
    fontSize: wp("3.5%"),
    color: "#ABA6DE",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  merchant: {
    fontSize: wp("3.2%"),
    color: COLORS.BETTER_Pink,
  },
  dot: {
    fontSize: wp("3.2%"),
    color: "#6c757d",
    marginHorizontal: wp("1.5%"),
  },
  date: {
    fontSize: wp("3.2%"),
    color: COLORS.SUNDAR,
    opacity: 0.7,
  },
  deleteButton: {
    opacity: 0.6,
    padding: wp("1%"),
  },
});

export default Analysis;
