import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { ChevronRight, QrCode, Warehouse } from "lucide-react-native";
import TopBar from "../components/TopBar";
import { WAREHOUSES } from "../data/mockData";
import { MUTED, TEXT, styles } from "../styles/pickupStyles";

export default function WarehouseScreen({ seller, onBack, onPick }) {
  const list = WAREHOUSES.filter((w) => w.sellerId === seller.id);

  return (
    <View style={styles.screen}>
      <TopBar
        title="Select Warehouse"
        subtitle={seller.name}
        onBack={onBack}
        step={{ i: 2, total: 5 }}
      />

      <ScrollView contentContainerStyle={styles.padding}>
        <Pressable
          style={styles.qrBtn}
          onPress={() => Alert.alert("QR Scanner", "Camera scanner yaha connect kar sakte ho.")}
        >
          <QrCode size={22} color={TEXT} />
          <Text style={styles.qrText}>Scan Warehouse QR</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Or pick from list</Text>

        {list.map((w) => (
          <Pressable key={w.id} onPress={() => onPick(w)} style={styles.listCard}>
            <View style={styles.rowIcon}>
              <Warehouse size={21} color={TEXT} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.codeBadge}>{w.code}</Text>
              <Text style={styles.listTitle}>{w.name}</Text>
              <Text style={styles.listSub}>{w.address}</Text>
            </View>

            <ChevronRight size={18} color={MUTED} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}