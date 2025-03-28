import React, { useState } from 'react';  // Import React and useState hook
import { View, Text, Button } from 'react-native';
import { StyleSheet } from 'react-native';
import Header from '../../../components/Header'
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed and imported

export default function wallet() {
  return (<>
    <Header searchIconShown={''}/>
    <View style={styles.container}>
      <Text style={styles.title}>Wallet OverView</Text>      
    </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
