const withGoogleMobileAds = require("./with-google-mobile-ads");
const withReleaseSigning = require("./plugins/with-release-signing");
const withOptionalHardwareFeatures = require("./plugins/with-optional-hardware-features");

export default {
  expo: {
    name: "MulGame",
    slug: "mulgame",
    // Bump both on every Play release: versionCode must be higher than the last upload.
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    // react-native-google-mobile-ads 17 requires the New Architecture.
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      withGoogleMobileAds,
      [withReleaseSigning, { prefix: "MULGAME_UPLOAD" }],
      // Portrait lock stays, but Play must not treat a portrait screen as required hardware.
      [withOptionalHardwareFeatures, ["android.hardware.screen.portrait"]],
      [
        "expo-build-properties",
        {
          android: {
            // Google Play: new apps and updates must target Android 16 (API 36) since 2026-08-31.
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            // Google Mobile Ads SDK 25.x is compiled with Kotlin 2.3; Kotlin 2.2 can read it, RN 0.81's 2.1 can't.
            kotlinVersion: "2.2.20",
          },
        },
      ],
    ],
    android: {
      package: "com.jaeminson.multiplicationgame",
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    ios: {
      bundleIdentifier: "com.jaeminson.multiplicationgame",
      supportsTablet: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "a7717b14-ab4c-4760-91d1-609063ba9116",
      },
    },
  },
};
