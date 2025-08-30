import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-6810850129615089/1353367622";

const multiplicationTables = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];

export default function HomeScreen({ route, navigation }) {
  const [showSettings, setShowSettings] = useState(false);
  const [duration, setDuration] = useState("5");
  const [totalProblems, setTotalProblems] = useState("20");

  useEffect(() => {
    if (route?.params?.duration !== undefined) {
      setDuration(String(route.params.duration));
    }
    if (route?.params?.totalProblems !== undefined) {
      setTotalProblems(String(route.params.totalProblems));
    }
  }, [route?.params?.duration, route?.params?.totalProblems]);

  const handleTableSelect = (table) => {
    navigation.navigate("Game", {
      table,
      duration: parseInt(duration),
      totalProblems: parseInt(totalProblems),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {multiplicationTables
              .slice(rowIndex * 2, rowIndex * 2 + 2)
              .map((table) => (
                <TouchableOpacity
                  key={table}
                  style={styles.tableButton}
                  onPress={() => handleTableSelect(table)}
                >
                  <Text style={styles.buttonText}>
                    × {table - 8}~{table}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <BannerAd
          // 광고 단위 ID
          unitId={adUnitId}
          // 베너 광고 크기
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>

      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Duration per problem (seconds):
              </Text>
              <TextInput
                style={styles.textInput}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Total number of problems:</Text>
              <TextInput
                style={styles.textInput}
                value={totalProblems}
                onChangeText={setTotalProblems}
                keyboardType="numeric"
                placeholder="20"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSettings(false)}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Space for banner ad
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: "#ffffff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
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
  settingsButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  tableButton: {
    backgroundColor: "#928e85",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: "48%",
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
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: {
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#928e85",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 1000,
  },
});
