import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ChevronRight, Search, Warehouse } from "lucide-react-native";
import TopBar from "../../components/TopBar";
import { MUTED, styles } from "../../styles/pickupStyles";
import {goBack} from "../../utils/NavigationUtils"
const FACILITIES = [
  { id: 1, name: "Delhi Hub", code: "DLH001", phone: "9876543210" },
  { id: 2, name: "Mumbai Hub", code: "MUM001", phone: "9876543211" },
  { id: 3, name: "Bangalore Hub", code: "BLR001", phone: "9876543212" },
  { id: 4, name: "Hyderabad Hub", code: "HYD001", phone: "9876543213" },
  { id: 5, name: "Chennai Hub", code: "CHE001", phone: "9876543214" },
];

export default function FacilityScreen({ onBack, onPick,onStart }) {
  const [q, setQ] = useState("");

  const list = FACILITIES.filter((f) =>
    [f.name, f.code, f.phone].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <TopBar
        title="Select Facility"
        subtitle="Select facility for scanning"
        onBack={goBack}
      />

      <ScrollView contentContainerStyle={styles.padding}>
        <View style={styles.searchBox}>
          <Search size={18} color={MUTED} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by facility, code or phone"
            placeholderTextColor={MUTED}
            style={styles.searchInput}
          />
        </View>

        {list.map((facility) => (
          <Pressable
            key={facility.id}
            onPress={() => onPick(facility)}
            style={styles.listCard}
          >
            {/* <View style={styles.avatar}>
              <Warehouse size={20} color="#0446DB" />
            </View> */}

            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{facility.name}</Text>
              <Text style={styles.listSub}>
                {facility.code} · {facility.phone}
              </Text>
            </View>

            <ChevronRight size={18} color={MUTED} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}