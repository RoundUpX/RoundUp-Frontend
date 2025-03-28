import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Dimensions, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ProgressBar } from 'react-native-paper';
import { COLORS } from "@/constants/theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


const getTransactionsByUserId = (userId) => {
  const transactions = [
    { id: 1, user_id: 1, amount: 100.00, category: 'Food', roundup: 5, date: '2025-03-21', merchant: 'Lunch' },
    { id: 2, user_id: 1, amount: 210.50, category: 'Transportation', roundup: 2, date: '2025-03-25', merchant: 'Bus fare' },
    { id: 3, user_id: 1, amount: 100.00, category: 'Food', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
    { id: 4, user_id: 2, amount: 100.00, category: 'Food', roundup: 1, date: '2025-03-25', merchant: 'Lunch' },
    { id: 5, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 6, user_id: 2, amount: 50.75, category: 'Health', roundup: 5, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 7, user_id: 2, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-26', merchant: 'Gym membership' },
    { id: 8, user_id: 1, amount: 200.50, category: 'Transportation', roundup: 10, date: '2025-03-27', merchant: 'Bus fare' },
    { id: 9, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 10, user_id: 1, amount: 150.75, category: 'Health', roundup: 3, date: '2025-03-27', merchant: 'Gym membership' },
    { id: 11, user_id: 1, amount: 50.75, category: 'Health', roundup: 5, date: '2025-03-28', merchant: 'Gym membership' },
    { id: 12, user_id: 1, amount: 100.00, category: 'Food', roundup: 14, date: '2025-03-28', merchant: 'Lunch' },
    { id: 13, user_id: 1, amount: 100.00, category: 'Food', roundup: 1, date: '2025-03-28', merchant: 'Lunch' },
  ];
  return transactions.filter(txn => txn.user_id === userId);
};

const Analysis = () => {
  const userId = 1;
  const goalAmount = 100.00;
  const transactions = getTransactionsByUserId(userId);

  const totalSaved = transactions.reduce((acc, txn) => acc + txn.roundup, 0);
  const goalCompletionPercentage = (totalSaved / goalAmount) * 100;

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        
        <View style={styles.DreamContainer}>
          <Text style={styles.chartTitle}>Goal Completion</Text>
            <Text style={styles.progressText}>
              <Text style={styles.boldText}>
                {Math.round(goalCompletionPercentage)}%
              </Text>
              {" of ₹" + goalAmount}
            </Text>
            <ProgressBar
              progress={goalCompletionPercentage / 100}  // Ensures progress is a value between 0 and 1
              color={COLORS.primary}
              style={styles.progressBar}
              height={10}
              width={300}
            />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Savings Progress</Text>

          <LineChart
            data={lineChartData}
            width={Dimensions.get("window").width - 40}
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
            withInnerLines={false}  // Disable inner grid lines
            withOuterLines={false}  // Disable inner grid lines
            yAxisLabel="₹"
            fromZero
            segments={5}
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
  DreamContainer: {
    height: hp("15%"),
    backgroundColor: `rgba(74, 55, 94, 0.82)`,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'left',
    paddingBottom: 20,
  },
  chartTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: hp("2%"),
    textAlign: 'center',
  },
  progressBar: {
    height: 15,
    borderRadius: 10,
  },
  boldText: {
    fontSize: 34, // Larger font size for the percentage
    fontWeight: 'bold', // Make it bold
    color: 'black', // Optional: you can change color if needed
    padding:0,
    margin:0,
  },
  progressText: {
    fontSize: 16, // Default font size
    paddingBottom:6 ,
    color: COLORS.text.primary,
  },
  chart: {
    borderRadius: 16,
    marginVertical: hp("2%"),
  },
  headerContainer: {
    paddingVertical: hp("2%"),
    alignItems: "center",
    backgroundColor: COLORS.primary, // Adjust to match your theme
    opacity: 0.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: COLORS.text.primary,
  },

});

export default Analysis;