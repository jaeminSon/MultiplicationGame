const withGoogleMobileAds = require("./with-google-mobile-ads");

export default {
  expo: {
    name: "MulGame",
    slug: "mulgame",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [withGoogleMobileAds],
    android: {
      package: "com.jaeminson.multiplicationgame",
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
