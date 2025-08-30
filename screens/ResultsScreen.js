import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ResultsScreen({ route, navigation }) {
  const { score, table, totalProblems, duration } = route.params;
  const correctAnswers = score;
  const percentage = Math.round((correctAnswers / totalProblems) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Excellent! 🌟";
    if (percentage >= 80) return "Great job! 👏";
    if (percentage >= 70) return "Good work! 👍";
    if (percentage >= 60) return "Not bad! 😊";
    return "Keep practicing! 💪";
  };

  const handleHome = () => {
    // Pass back duration (seconds) and totalProblems to Home
    navigation.navigate("Home", {
      duration: parseInt(duration),
      totalProblems: parseInt(totalProblems),
    });
  };

  const handleRestart = () => {
    navigation.navigate("Game", { table, duration:parseInt(duration), totalProblems:parseInt(totalProblems) });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Complete!</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.finalScore}>{percentage}</Text>
        <Text style={styles.scoreLabel}>Final Score</Text>

        <Text style={styles.details}>
          {correctAnswers} out of {totalProblems} correct
        </Text>

        <Text style={styles.performanceMessage}>{getPerformanceMessage()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleHome}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.restartButton]}
          onPress={handleRestart}
        >
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 40,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 50,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  finalScore: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#202020",
  },
  scoreLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#928e85",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 0.45,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  restartButton: {
    backgroundColor: "#928e85",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
