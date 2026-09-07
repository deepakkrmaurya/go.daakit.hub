import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  ChevronRight,
  ClipboardList,
  History,
  MapPin,
  ScanLine,
  Truck,
} from "lucide-react-native";
import { RIDER } from "../data/mockData";
import { MUTED, PRIMARY, TEXT, styles } from "../styles/pickupStyles";
import { push } from "../utils/NavigationUtils"
export default function DashboardScreen({ onStart }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 28 }}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.logoWhite}>
            <Text style={{ fontWeight: "900", color: PRIMARY }}>D</Text>
          </View>

          <View>
            <Text style={styles.overlineLight}>Daakit Rider</Text>
            <Text style={styles.heroName}>Hey, {RIDER.name.split(" ")[0]} 👋</Text>
          </View>

          <View style={styles.dutyPill}>
            <View style={styles.dot} />
            <Text style={styles.dutyText}>On duty</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Warehouse Pickup</Text>
        <Text style={styles.heroSub}>Scan shipments, sign, and ship the manifest.</Text>

        <View style={styles.heroStats}>
          {[
            { k: "Today", v: "3" },
            { k: "Pending", v: "2" },
            { k: "Manifests", v: "11" },
          ].map((x) => (
            <View key={x.k} style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{x.v}</Text>
              <Text style={styles.heroStatLabel}>{x.k}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.padding}>
        <Pressable onPress={onStart} style={styles.startCard}>
          <View style={styles.startIcon}>
            <ScanLine size={25} color={TEXT} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.startTitle}>Start Warehouse Pickup</Text>
            <Text style={styles.startSub}>Select seller → scan → sign</Text>
          </View>

          <ChevronRight size={22} color={TEXT} />
        </Pressable>

        <Text style={styles.sectionTitle}>Quick access</Text>

        {[
          { i: ClipboardList, t: "Pending Pickups", s: "2 sellers waiting", c: "2", u: "" },
          { i: History, t: "Generated Manifests", s: "Today · 3 manifests", c: "", u: "Facility" },
          { i: Truck, t: "Active Route", s: "BLR · 5 stops", c: "", u: "" },
        ].map((r) => (
          <Pressable key={r.t}
            onPress={() => {
              push(r.u)
            }}
          >
            <View style={styles.rowCard}>
              <View style={styles.rowIcon}>
                <r.i size={21} color={TEXT} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{r.t}</Text>
                <Text style={styles.rowSub}>{r.s}</Text>
              </View>

              {!!r.c && (
                <View style={styles.countPill}>
                  <Text style={styles.countText}>{r.c}</Text>
                </View>
              )}

              <ChevronRight size={18} color={MUTED} />
            </View>

          </Pressable>
        ))}

        <View style={styles.noteBox}>
          <MapPin size={17} color={TEXT} />
          <Text style={styles.noteText}>
            GPS, device ID and timestamp are captured automatically for every pickup.
            {"\n"}Device: {RIDER.device}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}