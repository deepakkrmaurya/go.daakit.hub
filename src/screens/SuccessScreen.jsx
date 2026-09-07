import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { CheckCircle2, Download, FileText, Share2 } from "lucide-react-native";
import PrimaryButton from "../components/PrimaryButton";
import GhostButton from "../components/GhostButton";
import MiniStat from "../components/MiniStat";
import { SUCCESS, TEXT, styles } from "../styles/pickupStyles";

export default function SuccessScreen({ manifest, seller, wh, scanned, onDone }) {
  const cod = scanned.filter((s) => s.payment === "COD");
  const codAmt = cod.reduce((a, b) => a + b.cod, 0);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.successHero}>
          <View style={styles.successIcon}>
            <CheckCircle2 size={42} color={TEXT} />
          </View>

          <Text style={styles.successTitle}>Manifest Generated</Text>
          <Text style={styles.successSub}>Emailed to seller & Daakit Ops</Text>
          <Text style={styles.manifestPill}>{manifest.id}</Text>
        </View>

        <View style={styles.padding}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={styles.rowIcon}>
                <FileText size={21} color={TEXT} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Daakit Pickup Manifest</Text>
                <Text style={styles.listSub}>
                  {seller.name} · {wh.code}
                </Text>
              </View>
            </View>

            <View style={styles.successStats}>
              <MiniStat k="Shipments" v={String(scanned.length)} />
              <MiniStat k="COD" v={String(cod.length)} />
              <MiniStat k="COD ₹" v={codAmt.toLocaleString("en-IN")} />
            </View>

            <Text style={styles.listSub}>Signed at: {manifest.signedAt}</Text>
            <Text style={styles.listSub}>Hash: {manifest.hash}...</Text>
            <Text style={styles.listSub}>GPS: 12.9716, 77.5946</Text>

            <Image source={{ uri: manifest.signature }} style={styles.signImage} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Email delivery</Text>

            {[
              `ops@${seller.code.toLowerCase()}.com`,
              `warehouse-${wh.code.toLowerCase()}@${seller.code.toLowerCase()}.com`,
              "ops@daakit.com",
            ].map((email) => (
              <View key={email} style={styles.emailRow}>
                <CheckCircle2 size={17} color={SUCCESS} />
                <Text style={styles.emailText}>{email}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <GhostButton icon={Download}>Download PDF</GhostButton>
            </View>

            <View style={{ flex: 1 }}>
              <GhostButton icon={Share2}>Share</GhostButton>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton onPress={onDone}>Done</PrimaryButton>
      </View>
    </View>
  );
}