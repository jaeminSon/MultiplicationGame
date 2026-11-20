import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Game tile icon for the multiplication game: a small version of the app icon
// (a rounded grey square with a multiplication problem on it).
export default function MultiplicationIcon({ size = 72 }) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size * 0.22 },
      ]}
    >
      <Text style={[styles.problem, { fontSize: size * 0.34 }]}>
        7<Text style={styles.times}>×</Text>8
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#928e85",
    justifyContent: "center",
    alignItems: "center",
  },
  problem: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  times: {
    color: "#f4d35e",
  },
});
