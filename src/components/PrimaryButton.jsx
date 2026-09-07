import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/pickupStyles";

export default function PrimaryButton({ children, disabled, onPress, icon: Icon }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryBtn,
        disabled && { opacity: 0.45 },
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
      ]}

    >
      <View
        style={
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }
        }
      >

        {!!Icon && <Icon size={20} color="#111827" />}
        <Text style={styles.primaryBtnText}>{children}</Text>
      </View>
    </Pressable>
  );
}