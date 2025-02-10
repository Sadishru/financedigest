import {
  Image,
  StyleSheet,
  Text,
  View,
  Linking,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useFonts } from "@expo-google-fonts/roboto";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface NewsThreadProps {
  thumbnail: string;
  source: string;
  date: number;
  headline: string;
  url: string;
}

const NewsThread: React.FC<NewsThreadProps> = ({
  thumbnail,
  source,
  date,
  headline,
  url,
}) => {
  // Font guy, Roboto
  let [fontsLoaded] = useFonts({
    Roboto: require("@expo-google-fonts/roboto/Roboto_400Regular.ttf"),
    Roboto900: require("@expo-google-fonts/roboto/Roboto_900Black.ttf"),
    RobotoMed: require("@expo-google-fonts/roboto/Roboto_500Medium.ttf"),
    RubikMed: require("@expo-google-fonts/rubik/Rubik_500Medium.ttf"),
    Rubik400: require("@expo-google-fonts/rubik/Rubik_400Regular.ttf"),
  });
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Powered by Blott Studio...</Text>
      </View>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };
  return (
    <TouchableOpacity onPress={() => handlePress(url)}>
      <View style={styles.container}>
        <View style={styles.imgView}>
          <Image
            source={{ uri: thumbnail }}
            style={styles.img}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.texts}>
          <View style={styles.sources}>
            <Text style={styles.textSource}>{source}</Text>
            <Text style={styles.textSource}>{formatDate(date)}</Text>
          </View>
          <Text style={styles.headline}>{headline}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsThread;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: hp("20%"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text2: {
    fontFamily: "RubikMed",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: "#ffffff",
  },
  img: {
    width: wp("30%"),
    height: hp("12%"),
    borderRadius: 3,
  },
  sources: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("55%"),
  },
  texts: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: wp("3%"),
  },
  textSource: {
    fontFamily: "Rubik400",
    color: "#FFFFFFB3",
    fontSize: 12,
    lineHeight: 16,
  },
  headline: {
    fontFamily: "RobotoMed",
    fontSize: hp("1.5"),
    lineHeight: 18,
    color: "#ffffff",
    width: wp("58%"),
  },
});
