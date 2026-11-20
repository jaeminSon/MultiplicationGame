import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Game tile icon for the coin toss game: a gold coin. Pass `face` to show a
// letter (e.g. "H" / "T") instead of the star; the game screen reuses it.
export default function CoinIcon({ size = 72, face }) {
  const inner = size * 0.78;
  return (
    <View
      style={[
        styles.rim,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.inner,
          { width: inner, height: inner, borderRadius: inner / 2, borderWidth: size * 0.03 },
        ]}
      >
        <Text style={[styles.face, { fontSize: size * (face ? 0.42 : 0.38) }]}>
          {face ?? "★"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rim: {
    backgroundColor: "#d9a514",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    backgroundColor: "#f4c542",
    borderColor: "#e8b42a",
    justifyContent: "center",
    alignItems: "center",
  },
  face: {
    color: "#a8740a",
    fontWeight: "bold",
  },
});
