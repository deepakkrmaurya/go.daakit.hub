import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/pickupStyles";

export default function MiniStat({ k, v }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{v}</Text>
      <Text style={styles.miniStatLabel}>{k}</Text>
    </View>
  );
}