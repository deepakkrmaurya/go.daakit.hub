import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomTabs from "./BottomTabs";
import ProfileScreen from "../screens/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: false
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabs}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Drawer.Navigator>
  );
}