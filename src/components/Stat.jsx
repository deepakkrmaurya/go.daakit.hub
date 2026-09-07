import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/pickupStyles";

export default function Stat({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}