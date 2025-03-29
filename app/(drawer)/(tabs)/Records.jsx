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
      <Text style={styles.title}>Transactions</Text>
      <TransactionOverview/>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop:hp('2%'),
    justifyContent: 'center',
    backgroundColor:COLORS.background,
  },
  title: {
    fontSize: 30,
    color:COLORS.text.primary,
    // fontWeight: 'bold',
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
});
