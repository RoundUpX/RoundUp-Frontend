import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  StatusBar,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from 'react-i18next';
import { COLORS } from "../../constants/Colors";
import { useRouter } from "expo-router";
const CustomDrawerContent = (props) => {
  const router = useRouter();
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({ language: 'English' });

  const handleLanguageSelect = (language) => {
    console.log("Current language in state:", state.language);
    changeLanguage(language);
    setIsModalVisible(false);
    console.log("Language changed to", language);
  };


  useEffect(() => {
    if (state.language && i18n.language !== state.language) {
      // i18n.changeLanguage(state.language);
    } else {
      // i18n.changeLanguage(state.language);
    }
  }, [state.language]);


  return (
    <>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.lightbackground}
          translucent={false}
          hidden={false}
        />
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{t('RoundUP')}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          {props.state.routes
            .filter((route) => route.name !== "(tabs)")
            .map((route) => (
              <DrawerItem
                key={route.key}
                label={t(props.descriptors[route.key].options.drawerLabel || route.name)}
                icon={props.descriptors[route.key].options.drawerIcon}
                labelStyle={{
                  color: selectedItem === route.key ? COLORS.secondary : COLORS.text.primary,
                  fontWeight: selectedItem === route.key ? "bold" : "normal",
                }}
                onPress={() => {
                  setSelectedItem(route.key);
                  props.navigation.navigate(route.name);
                }}
                style={{
                  backgroundColor: selectedItem === route.key ? COLORS.primary : COLORS.lightbackground,
                }}
              />
            ))}

          <DrawerItem
            label={t('Scan QR')}
            icon={() => <MaterialIcons name="qr-code-scanner" size={wp("6%")} color={"#000000"} />}
            // onPress={handleScanQR}
            labelStyle={{ color: COLORS.background }}
          />
          <DrawerItem
            label={t('Request Data')}
            icon={() => <Ionicons name="exit" size={wp("6%")} color={"#000000"} />}
            onPress={() => Linking.openURL("")}
            labelStyle={{ color: COLORS.background }}
          />
           <DrawerItem
              label={t('CurrencySettings')}
              icon={() => <MaterialIcons name="money" size={wp("6%")} color="#1f1f1f" />}
              labelStyle={{ color: COLORS.background }}
            />      
            <DrawerItem
              label={t('Help Us')}
              icon={() => <MaterialIcons name="currency-rupee" size={wp("6%")} color={"#000000"} />}
              // onPress={handleScanQR}
              labelStyle={{ color: COLORS.background }}
            />
          <DrawerItem
            label={t('Backup')}
            icon={() => <MaterialIcons name="logout" size={wp("6%")} color="#1f1f1f" />}
            onPress={() => router.push('/signup')}
            labelStyle={{ color: COLORS.background }}
          />          
          <DrawerItem

            label={t('Help')}
            icon={() => <MaterialIcons name="help-outline" size={wp("6%")} color={"#000000"} />}
            onPress={() => Linking.openURL("")}
            labelStyle={{ color: COLORS.background }}
          />
          <DrawerItem
            label={t('Feedback')}
            icon={() => <MaterialIcons name="feedback" size={wp("6%")} color={"#000000"} />}
            onPress={() => Linking.openURL("")}
            labelStyle={{ color: COLORS.background }}
          />
           
        </View>
      </DrawerContentScrollView>

    </>

  );
};

export default function Layout({ navigation }) {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: wp("72%"),
        },
        swipeEnabled: true,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
        hideStatusBar: false,
        statusBarAnimation: "slide",
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} navigation={navigation} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "rgba(197, 197, 197, 0.68)",
  },
  profileContainer: {
    alignItems: "center",
    padding: wp("5%"),
    paddingTop: hp("5%"),
    backgroundColor: "rgba(0, 0, 0, 0.64)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightbackground,
  },
  profileImage: {
    width: wp("20%"),
    height: wp("20%"),
    resizeMode: "contain",
    borderRadius: wp("10%"),
    marginBottom: hp("1%"),
    backgroundColor: "#000",
  },
  userName: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  userEmail: {
    fontSize: wp("3.5%"),
    color: COLORS.text.secondary,
    marginTop: hp("0.5%"),
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: hp("1%"),
    marginTop: hp("1%"),
    // color:"#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: wp("80%"),
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  languageOption: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  selectedLanguage: {
    backgroundColor: COLORS.primary,
  },
  languageText: {
    fontSize: wp("4%"),
    textAlign: "center",
  },
  selectedLanguageText: {
    color: "white",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: COLORS.text.secondary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: wp("4%"),
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp('2.5%'),
  },
  currencyButton: {
    width: wp('30%'),
    padding: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  selectedCurrency: {
    backgroundColor: COLORS.primary,
  },
  currencySymbol: {
    fontSize: wp('6%'),
    marginBottom: hp('0.5%'),
  },
  currencyCode: {
    fontSize: wp('4%'),
  },
  selectedText: {
    color: '#fff',
  },
  note: {
    marginTop: hp('2.5%'),
    color: '#666',
    textAlign: 'center',
    fontSize: wp('3.5%'),
  },
});