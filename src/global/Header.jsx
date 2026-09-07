import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Header({
  title = "Dashboard",
  showBack = false,
}) {
  const navigation = useNavigation();

  return (
    <View
      className="flex-row items-center justify-between bg-[#0446DB] px-4"
      style={{
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
      }}
    >
        <StatusBar barStyle={'light-content'} backgroundColor={"#0446DB"} />
      {/* Left */}
      <View className="w-12">
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full "
          >
            <ChevronLeft size={22} color="#FFFFFF" /> 
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <Text className="flex-1 text-center text-lg font-bold text-white">
        {title}
      </Text>

      {/* Profile */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        className="h-10 w-10 overflow-hidden"
      >
        {/* <Image
          source={{
            uri: "https://i.pravatar.cc/150",
          }}
          className="h-full w-full"
        /> */}
      </TouchableOpacity>
    </View>
  );
}