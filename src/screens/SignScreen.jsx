import React, { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { ShieldCheck } from "lucide-react-native";
import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import { RIDER } from "../data/mockData";
import { nowStamp } from "../utils/manifestUtils";
import { MUTED, styles } from "../styles/pickupStyles";

export default function SignScreen({ seller, wh, scanned, onBack, onSigned }) {
  const signRef = useRef(null);
  const [hasInk, setHasInk] = useState(false);

  return (
    <View style={styles.screen}>
      <TopBar
        title="Rider Signature"
        subtitle={`${seller.code} · ${wh.code} · ${scanned.length} shipments`}
        onBack={onBack}
        step={{ i: 5, total: 5 }}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.miniLabel}>Signed by</Text>
          <Text style={styles.cardTitle}>{RIDER.name}</Text>
          <Text style={styles.listSub}>
            {RIDER.id} · {RIDER.phone}
          </Text>
          <Text style={styles.listSub}>Timestamp: {nowStamp()}</Text>
          <Text style={styles.listSub}>GPS: 12.9716, 77.5946</Text>
          <Text style={styles.listSub}>Device: {RIDER.device}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Sign below</Text>

          <Pressable
            onPress={() => {
              signRef.current?.clearSignature();
              setHasInk(false);
            }}
          >
            <Text style={{ color: MUTED }}>Clear</Text>
          </Pressable>
        </View>

        <View style={styles.signatureBox}>
          <SignatureCanvas
            ref={signRef}
            onBegin={() => setHasInk(true)}
            onOK={onSigned}
            descriptionText="Use your finger or stylus"
            clearText="Clear"
            confirmText="Save"
            webStyle={`
              .m-signature-pad { box-shadow: none; border: none; }
              .m-signature-pad--body { border: none; }
              .m-signature-pad--footer { display: none; margin: 0px; }
              body,html { width: 100%; height: 100%; }
            `}
          />
        </View>

        <Text style={styles.noteSmall}>
          By signing, you confirm pickup of the listed shipments on behalf of Daakit.
        </Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          disabled={!hasInk}
          icon={ShieldCheck}
          onPress={() => signRef.current?.readSignature()}
        >
          Preview Manifest PDF
        </PrimaryButton>
      </View>
    </View>
  );
}