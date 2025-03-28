import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { COLORS } from '@/constants/Colors';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   // return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.PURPLE,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.lightbackground,
          borderTopWidth: 1,
          paddingBottom: hp('1%'),
          // marginBottom: hp('1%'),
          height: hp('7.5%')
        },
        // tabBarLabelStyle: {
        //   fontSize: wp('3%'),
        //   marginTop: 0,
        //   paddingBottom: hp('0.5%')
        // },
        tabBarInactiveTintColor: COLORS.text.secondary,
      }}
    >
      <Tabs.Screen
        name="Records"
        options={{
          title: 'Transaction',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list"  color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color }) => <Ionicons name="analytics" color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => <Ionicons name="camera" color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
