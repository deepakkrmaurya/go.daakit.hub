import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { styles } from "../styles/pickupStyles";

export default function TopBar({ title, subtitle, onBack, step }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <ChevronLeft size={23} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>D</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
          {!!subtitle && <Text style={styles.topSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {!!step && (
          <View style={styles.stepPill}>
            <Text style={styles.stepText}>Step {step.i} / {step.total}</Text>
          </View>
        )}
      </View>

      {!!step && (
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(step.i / step.total) * 100}%` }]} />
        </View>
      )}
    </View>
  );
}