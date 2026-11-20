import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import HomeScreen from "./screens/HomeScreen";
import CoinTossScreen from "./screens/CoinTossScreen";
import GameScreen from "./screens/GameScreen";
import ResultsScreen from "./screens/ResultsScreen";

const Stack = createStackNavigator();

export default function App() {
  // Android 16 (API 36) always draws apps edge-to-edge. Stack headers already pad
  // for the status bar; this keeps content clear of the gesture/navigation bar.
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["bottom"]}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Multiplication"
          component={HomeScreen}
          initialParams={{ duration: 5, totalProblems: 20 }}
          options={{ title: "Multiplication Game" }}
        />
        <Stack.Screen
          name="CoinToss"
          component={CoinTossScreen}
          options={{ title: "Coin Toss" }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: "Game" }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: "Results" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
