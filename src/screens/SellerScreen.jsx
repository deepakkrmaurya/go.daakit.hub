import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ChevronRight, Search } from "lucide-react-native";
import TopBar from "../components/TopBar";
import { SELLERS } from "../data/mockData";
import { MUTED, styles } from "../styles/pickupStyles";

export default function SellerScreen({ onBack, onPick }) {
  const [q, setQ] = useState("");

  const list = SELLERS.filter((s) =>
    [s.name, s.code, s.phone].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <TopBar
        title="Select Seller"
        subtitle="Only sellers assigned to your route"
        onBack={onBack}
        step={{ i: 1, total: 5 }}
      />

      <ScrollView contentContainerStyle={styles.padding}>
        <View style={styles.searchBox}>
          <Search size={18} color={MUTED} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by name, code or phone"
            placeholderTextColor={MUTED}
            style={styles.searchInput}
          />
        </View>

        {list.map((s) => (
          <Pressable key={s.id} onPress={() => onPick(s)} style={styles.listCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {s.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{s.name}</Text>
              <Text style={styles.listSub}>
                {s.code} · {s.phone}
              </Text>
            </View>

            <ChevronRight size={18} color={MUTED} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}