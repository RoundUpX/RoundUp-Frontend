import { StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { COLORS } from '@/constants/theme';
import { Text, View } from '@/components/Themed';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import TransactionOverview from '@/components/transactions';
export default function Records() {
  return (<>
    <Header searchIconShown={''}/>
    <View style={styles.container}>
      <Text style={styles.title}>Transactions Log</Text>
      <View style={styles.separator} Color="rgba(68, 24, 24, 0.52)" />
      <TransactionOverview/>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // paddingTop:hp('4%'),
    justifyContent: 'center',
    backgroundColor:COLORS.background,
  },
  title: {
    fontSize: 30,
    color:COLORS.text.primary,
    // fontWeight: 'bold',
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '80%',
  },
});
