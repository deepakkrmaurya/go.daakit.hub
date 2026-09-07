
// import React from 'react';
// import "./global.css"
// import { StatusBar } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { NavigationContainer } from "@react-navigation/native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Toast from 'react-native-toast-message';
// import AppNavigator from "./src/navigation/RootNavigator";
// import { navigationRef } from './src/utils/NavigationUtils';

// function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//         <NavigationContainer ref={navigationRef}>
//           <AppNavigator />
//         </NavigationContainer>
//         <Toast />
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// export default App;



import "react-native-gesture-handler";
import React from "react";
import "./global.css";

import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import AppNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/utils/NavigationUtils";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#0446DB" />

        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;