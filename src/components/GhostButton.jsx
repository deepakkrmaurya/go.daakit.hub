import React from "react";
import { Pressable, Text } from "react-native";
import { TEXT, styles } from "../styles/pickupStyles";

export default function GhostButton({ children, onPress, icon: Icon }) {
  return (
    <Pressable onPress={onPress} style={styles.ghostBtn}>
      {!!Icon && <Icon size={17} color={TEXT} />}
      <Text style={styles.ghostText}>{children}</Text>
    </Pressable>
  );
}