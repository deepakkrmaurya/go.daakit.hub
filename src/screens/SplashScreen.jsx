import React, { useEffect } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { getItem, storage } from "../helper/Storage";
import { resetAndNavigate } from "../utils/NavigationUtils";
import logo from '../assets/hublogo.png'
const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const token = storage.getString("token");
    const timer = setTimeout(() => {
    
      if (token) {
        resetAndNavigate('Main')
        return
      }
      navigation.replace("Login");
      return
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0446DB"
      />

      <View className="flex-1 items-center justify-center bg-[#0446DB] px-6">
        <View className="items-center">
          {/* Logo */}
          <View style={{
            height: 96,
            width: 96,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 48,
            backgroundColor: '#EEF4FF',
            overflow: 'hidden',
          }}>
            <Image
              source={logo}
              style={{
                height: 80,
                width: 80,
                resizeMode: 'contain',
              }}
            />
          </View>

          {/* App Name */}
          <Text className="mt-6 text-3xl font-bold text-white">
            DAAKit Hub
          </Text>


        </View>

        {/* Footer */}
        <View className="absolute bottom-10 items-center">
          <Text className="text-sm text-blue-100">
            Powered by DAAKit
          </Text>
        </View>
      </View>
    </>
  );
};

export default SplashScreen;


