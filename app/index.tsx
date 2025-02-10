import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useFonts } from "@expo-google-fonts/roboto";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

//Custom Components
import LegalName from "@/components/LegalName";
import NewsThread from "@/components/NewsThread";

const Index = () => {
  // Font guy, Roboto
  let [fontsLoaded] = useFonts({
    Roboto: require("@expo-google-fonts/roboto/Roboto_400Regular.ttf"),
    Roboto900: require("@expo-google-fonts/roboto/Roboto_900Black.ttf"),
    RobotoMed: require("@expo-google-fonts/roboto/Roboto_500Medium.ttf"),
    RubikMed: require("@expo-google-fonts/rubik/Rubik_500Medium.ttf"),
  });

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authScreen, setAuthScreen] = useState(false);
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState(false);

  // Animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-14);
  const newsOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withSpring(0, { damping: 4 });
    newsOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const newsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: newsOpacity.value,
  }));

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://finnhub.io/api/v1/news?category=general&token=crals9pr01qhk4bqotb0crals9pr01qhk4bqotbg",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error.message);
      setNewsError(true);
    }
  };

  useEffect(() => {
    //   const deleteData = async () => {
    //   try {
    //     await AsyncStorage.removeItem("firstName");
    //     await AsyncStorage.removeItem("lastName");
    //     setFirstName(null);
    //     setLastName(null);
    //     console.log("Data deleted successfully!");
    //   } catch (e) {
    //     console.error("Error deleting data", e);
    //   }
    // };

    // deleteData();
    const getData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem("firstName");
        const storedLastName = await AsyncStorage.getItem("lastName");

        if (storedFirstName && storedLastName !== null) {
          setFirstName(storedFirstName);
          setLastName(storedLastName);
        } else {
          setAuthScreen(true);
        }
      } catch (e) {
        console.error("Error retrieving data", e);
      }
    };

    getData();
    fetchNews();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Powered by Blott Studio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {authScreen ? (
        <LegalName />
      ) : (
        <SafeAreaView>
          <StatusBar
            style="light"
            backgroundColor="#05021B"
            translucent={false}
          />
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Animated.Text style={[styles.text, headerAnimatedStyle]}>
                Hey, {firstName}
              </Animated.Text>
            </View>
            <View style={styles.content}>
              {newsError ? (
                <Text style={styles.text2}>
                  Something went wrong. Please try again later.
                </Text>
              ) : (
                <Animated.View style={[styles.newsSection, newsAnimatedStyle]}>
                  {news.map((item, index) => (
                    <NewsThread
                      key={index}
                      thumbnail={item.image}
                      source={item.source}
                      date={item.datetime}
                      headline={item.headline}
                      url={item.url}
                    />
                  ))}
                </Animated.View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp("100%"),
    width: wp("100%"),
    backgroundColor: "#000000",
    color: "#ffffff",
  },
  header: {
    height: hp("15%"),
    width: wp("100%"),
    backgroundColor: "#05021B",
    paddingTop: hp("4%"),
    paddingHorizontal: wp("5%"),
  },
  text: {
    fontFamily: "Roboto900",
    fontSize: 32,
    marginBottom: 20,
    color: "#ffffff",
  },
  content: {
    transform: [{ translateY: -hp("5%") }],
    paddingHorizontal: wp("5%"),
  },
  text2: {
    fontFamily: "RubikMed",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: "#ffffff",
  },
  newsSection: {
    transform: [{ translateY: -hp("2%") }],
  },
});

export default Index;
