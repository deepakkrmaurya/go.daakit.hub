import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HistoryScreen from "../screens/History";
import ManifestScreen from "../screens/ManifestScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScannerScreen from "../screens/scanner/Scanner";
import PdfView from "../screens/manifest/PdfView";
import ManifestDashboardScreen from "../screens/manifest/ManifestDashboard";
import AdminScannerScreen from "../screens/scanner/AdminScanner";
import ReviewAwbScreen from "../screens/scanner/ReviewAwbScreen";
import VendorReviewAwbScreen from "../screens/scanner/VendorAwbScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",

      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="view"
        component={PdfView}
      />

      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="ScannerScreen"
        component={ScannerScreen}
      />
      <Stack.Screen
        name="AdminScannerScreen"
        component={AdminScannerScreen}
      />
      <Stack.Screen
        name="ReviewAwbScreen"
        component={ReviewAwbScreen}
      />
      <Stack.Screen
        name="VendorReviewAwbScreen"
        component={VendorReviewAwbScreen}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
      />

      <Stack.Screen name="Manifest" component={ManifestScreen} />
      <Stack.Screen name="ManifestDash" component={ManifestDashboardScreen} />
    </Stack.Navigator>
  );
}