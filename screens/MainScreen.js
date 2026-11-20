import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { useAdsReady } from "../ageSignals";
import MultiplicationIcon from "../components/MultiplicationIcon";
import CoinIcon from "../components/CoinIcon";

const adUnitId = "ca-app-pub-6810850129615089/1353367622";

// Every game in the app. Add a new game here: its tile shows up in the 2-column grid.
const games = [
  {
    title: "Multiplication",
    Icon: MultiplicationIcon,
    screen: "Multiplication",
  },
  {
    title: "Coin Toss",
    Icon: CoinIcon,
    screen: "CoinToss",
  },
];

export default function MainScreen({ navigation }) {
  // This screen has no header, so it pads for the status bar itself.
  const insets = useSafeAreaInsets();
  // Wait for the Play Age Signals check so minors never get an unrestricted ad.
  const adsReady = useAdsReady();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 20 + insets.top }]}
      >
        <Text style={styles.title}>Brain Games</Text>
        <View style={styles.grid}>
          {games.map(({ title, Icon, screen }) => (
            <TouchableOpacity
              key={screen}
              style={styles.gameButton}
              onPress={() => navigation.navigate(screen)}
            >
              <View style={styles.iconWrapper}>
                <Icon />
              </View>
              <Text style={styles.gameTitle} numberOfLines={2} adjustsFontSizeToFit>
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        {adsReady && (
          <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Space for banner ad
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  gameButton: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
});
