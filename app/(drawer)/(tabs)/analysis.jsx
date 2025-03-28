import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { COLORS } from "@/constants/theme";  // You can define your own colors or import them
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// Fake Data for Testing
const getUsers = () => {
  return [
    { id: 1, username: 'john_doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com' }
  ];
};

const getTransactionsByUserId = (userId) => {
  const transactions = [
    { id: 1, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: 1, date: '2025-03-28', merchant: 'Lunch' },
    { id: 2, user_id: 1, amount: 200.50, category: 'Transportation', roundup: 2, date: '2025-03-27', merchant: 'Bus fare' },
    { id: 3, user_id: 2, amount: 50.75, category: 'Health & Fitness', roundup: 5, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 4, user_id: 1, amount: 210.50, category: 'Transportation', roundup: 2, date: '2025-03-25', merchant: 'Bus fare' },
    { id: 5, user_id: 1, amount: 50.75, category: 'Health & Fitness', roundup: 5, date: '2025-03-28', merchant: 'Gym membership' },
    { id: 6, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 7, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 8, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: 1, date: '2025-03-28', merchant: 'Lunch' },
    { id: 9, user_id: 1, amount: 150.75, category: 'Health & Fitness', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 10, user_id: 1, amount: 100.00, category: 'Food & Dining', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
    { id: 11, user_id: 2, amount: 150.75, category: 'Health & Fitness', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 12, user_id: 2, amount: 100.00, category: 'Food & Dining', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
  ];
  return transactions.filter(txn => txn.user_id === userId);
};

const Analysis = () => {
  const userId = 1;  // Example userId
  const goalAmount = 120.00; // Goal Amount is fixed at 100.00

  const transactions = getTransactionsByUserId(userId);

  // Calculate total saved amount and daily savings
  const totalSaved = transactions.reduce((acc, txn) => acc + txn.roundup, 0);

  // Calculate the percentage of the goal completed
  const goalCompletionPercentage = (totalSaved / goalAmount) * 100;

  // Group transactions by date for Line Chart (daily savings)
  const dailySavings = {};
  transactions.forEach((txn) => {
    const date = txn.date;
    if (!dailySavings[date]) {
      dailySavings[date] = 0;
    }
    dailySavings[date] += txn.roundup;
  });

  // Prepare data for Pie Chart
  const pieChartData = [
    {
      name: "Completed",
      amount: totalSaved,
      color: COLORS.secondary,  // You can define colors based on your theme
      legendFontColor: COLORS.secondary,
      legendFontSize: 15,
    },
    {
      name: "Remaining",
      amount: goalAmount - totalSaved,
      color: COLORS.primary,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  const formattedLabels = Object.keys(dailySavings).map((date) => date.slice(-2));  // Only the first two characters of the date

  // Prepare data for Line Chart
  const lineChartData = {
    labels: formattedLabels, // Dates as labels
    datasets: [
      {
        data: Object.values(dailySavings), // Amount saved each day
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.content}>
        {/* Pie Chart: Goal Completion */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Goal Completion</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - wp("40%")}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft={0}
            absolute
            hasLegend={true}
            legendEntryPadding={10}
            center={[50, 0]}
            style={{ alignSelf: 'center' }}
          />

        </View>

        {/* Line Chart: Money Saved Per Day */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Money Saved Per Day</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - wp("12%")}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.primary,
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForLabels: {
                fontSize: 12, // Adjust label size
                fontWeight: 'bold',
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            fromZero={true}
            segments={5}
            yAxisLabel=""  // This is the Y-axis label (e.g., currency symbol)
            yAxisSuffix=""  // Suffix for the Y-axis values, e.g., "k" for thousands
            withDots={true} // If you want to hide dots on the line graph
            withHorizontalLabels={true}
            withVerticalLabels={true}
            xAxisLabel="Day" // X-axis label (can be customized to represent day, date, etc.)
            // yAxisLabel="Amount"
            yAxisInterval={1} // Adjust interval for Y-axis labels
          />

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
  chartTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: hp("2%"),
  },
  chart: {
    borderRadius: 16,
    marginVertical: hp("2%"),
  },
});

export default Analysis;
