import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useFonts } from "@expo-google-fonts/roboto";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";


const LegalName = () => {
  // Font guy, Roboto
  let [fontsLoaded] = useFonts({
    Roboto: require("@expo-google-fonts/roboto/Roboto_400Regular.ttf"),
    RobotoBold: require("@expo-google-fonts/roboto/Roboto_700Bold.ttf"),
    RobotoMed: require("@expo-google-fonts/roboto/Roboto_500Medium.ttf"),
  });

  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //functions
  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        await AsyncStorage.setItem("firstName", firstName);
        await AsyncStorage.setItem("lastName", lastName);
        console.log("Data saved homie!", firstName, lastName);
        setModalVisible(true);
      } catch (e) {
        console.error("Error saving data", e);
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        console.log("Notification permissions granted");
        handleModalClose();
        router.push("/");
      } else {
        console.log("Notification permissions denied");
      }
    } catch (error) {
      console.error("Error requesting notifications permission", error);
    }
  };

  //effects go here
  useEffect(() => {
    if (firstName && lastName) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem("firstName");
        const storedLastName = await AsyncStorage.getItem("lastName");

        if (storedFirstName !== null) {
          console.log("firstName", storedFirstName);
        }
        if (storedLastName !== null) {
          console.log("lastName", storedLastName);
        }
      } catch (e) {
        console.error("Error retrieving data", e);
      }
    };

    getData();
  }, []);
  return (
    <SafeAreaView>
      <StatusBar style="light" backgroundColor="#F9FAFB" translucent={false} />
      <View style={styles.container}>
        <Text style={styles.h1}>Your legal name</Text>
        <Text style={styles.p3}>
          We need to know a bit about you so that we can create your account.
        </Text>
        <View style={styles.inputForm}>
          <TextInput
            style={[styles.input, styles.underline]}
            placeholder="First name"
            placeholderTextColor="#A3A3A3"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={[styles.input, styles.underline]}
            placeholder="Last name"
            placeholderTextColor="#A3A3A3"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <TouchableOpacity style={styles.cta} onPress={handleSubmit}>
            {isFormValid ? (
              <Image
                source={require("@/assets/images/ctaBtnActive.png")}
                style={styles.ctaBtn}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("@/assets/images/ctaBtn.png")}
                style={styles.ctaBtn}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}
        >
          <View style={styles.container2}>
            <Image
              source={require("@/assets/images/message-notif.png")}
              style={styles.notif}
              resizeMode="contain"
            />
            <Text style={styles.h2main}>Get the most out of Blott ✅</Text>
            <Text style={styles.p}>
              Allow notifications to stay in the loop with your payments,
              requests and groups.
            </Text>
            <TouchableOpacity
              style={styles.cta2}
              onPress={requestNotificationPermissions}
            >
              <Text style={styles.btnP}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default LegalName;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "#F9FAFB",
    paddingTop: hp("7%"),
    paddingHorizontal: wp("5%"),
  },
  container2: {
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "#F9FAFB",
    paddingTop: hp("7%"),
    paddingHorizontal: wp("5%"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: hp("10%"),
  },
  h1: {
    fontSize: 30,
    fontFamily: "RobotoBold",
  },
  h2: {
    fontSize: 24,
    fontFamily: "RobotoBold",
  },
  h2main: {
    fontSize: 23,
    fontFamily: "RobotoBold",
    textAlign: "center",
  },
  p: {
    fontSize: 16,
    fontFamily: "Roboto",
    lineHeight: 24,
    paddingTop: hp("2%"),
    color: "#737373",
    textAlign: "center",
  },
  p3: {
    fontSize: 16,
    fontFamily: "Roboto",
    lineHeight: 24,
    paddingTop: hp("2%"),
    color: "#737373",
    textAlign: "left",
  },
  inputForm: {
    flex: 1,
    paddingTop: hp("2%"),
    rowGap: hp("3%"),
    // backgroundColor: "#000",
  },
  input: {
    fontFamily: "Roboto",
    fontSize: 20,
    lineHeight: 30,
    paddingBottom: hp("1%"),
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#d9d7d7",
  },
  cta: {
    position: "absolute",
    right: 0,
    marginTop: hp("30%"),
  },
  ctaBtn: {
    width: wp("15%"),
    height: hp("10%"),
  },
  notif: {
    width: wp("30%"),
    height: hp("15%"),
  },
  cta2: {
    backgroundColor: "#523AE4",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("30%"),
    borderRadius: 20,
    position: "absolute",
    bottom: hp("10%"),
  },
  btnP: {
    fontSize: 16,
    fontFamily: "RobotoMed",
    color: "#fff",
  },
});
