// Play Age Signals: ask Google Play for the user's age range once per launch and,
// for users under 18, restrict the ads this app shows.
//
// Play's terms allow age signals only for age-appropriate experiences, not for
// ad targeting, profiling or analytics. Here the range only switches ads to
// child-/minor-safe settings; it is never stored or sent anywhere.
import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";

import { requestAgeSignals, setTestResult } from "./modules/age-signals";

// Ads wait at most this long for Google Play before loading with default settings.
const TIMEOUT_MS = 15000;
const PLAY_STORE_URL = "market://details?id=com.jaeminson.multiplicationgame";

let adsReady = null;

function isMinor(signals) {
  return signals.status === "SHARED" && signals.ageUpper !== null && signals.ageUpper < 18;
}

async function applyAdSettings(signals) {
  if (!isMinor(signals)) {
    return;
  }
  const child = signals.ageUpper < 13;
  await mobileAds().setRequestConfiguration({
    maxAdContentRating: child ? MaxAdContentRating.G : MaxAdContentRating.PG,
    tagForChildDirectedTreatment: child,
    tagForUnderAgeOfConsent: true,
  });
}

function askToVerifyInPlayStore() {
  Alert.alert(
    "Confirm your age",
    "Google Play needs you to confirm your age before apps can use it. Please open the Play Store to continue.",
    [
      { text: "Later", style: "cancel" },
      { text: "Open Play Store", onPress: () => Linking.openURL(PLAY_STORE_URL).catch(() => {}) },
    ],
  );
}

function applyTestResultInDev() {
  // e.g. EXPO_PUBLIC_AGE_SIGNALS_TEST="1,6,8" -> SHARED, age 6-8 (debug builds only)
  const test = process.env.EXPO_PUBLIC_AGE_SIGNALS_TEST;
  if (__DEV__ && test) {
    const [status, lower, upper] = test.split(",").map((v) => (v === "" ? null : Number(v)));
    setTestResult(status, lower ?? null, upper ?? null, true);
  }
}

/** Starts the age check (Android only) and resolves once ads may be requested. */
export function prepareAds() {
  if (adsReady) {
    return adsReady;
  }
  if (Platform.OS !== "android") {
    adsReady = Promise.resolve();
    return adsReady;
  }

  applyTestResultInDev();
  const check = requestAgeSignals().then(async (signals) => {
    if (__DEV__) {
      console.log("[age-signals]", JSON.stringify(signals), "minor:", isMinor(signals));
    }
    try {
      await applyAdSettings(signals);
    } catch {
      // Keep ads working even if the settings call fails.
    }
    if (signals.status === "VERIFICATION_REQUIRED") {
      askToVerifyInPlayStore();
    }
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS));
  adsReady = Promise.race([check, timeout]);
  return adsReady;
}

/** True once ads may be requested. */
export function useAdsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    prepareAds().then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);
  return ready;
}
