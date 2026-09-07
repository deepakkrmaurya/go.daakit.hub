import React from "react";
import { Text, View } from "react-native";
import { BORDER, CARD, DANGER, MUTED, PRIMARY, TEXT, styles } from "../styles/pickupStyles";

export default function Counter({ label, value, tone }) {
  let bg = CARD;
  let color = TEXT;
  let border = BORDER;

  if (tone === "primary") {
    bg = PRIMARY;
    color = "#fff";
    border = PRIMARY;
  }

  if (tone === "danger") {
    bg = "#FEF2F2";
    color = DANGER;
    border = "#FECACA";
  }

  if (tone === "muted") {
    bg = "#EEF2F7";
    color = MUTED;
    border = "#EEF2F7";
  }

  return (
    <View style={[styles.counter, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.counterValue, { color }]}>{value}</Text>
      <Text style={[styles.counterLabel, { color }]}>{label}</Text>
    </View>
  );
}