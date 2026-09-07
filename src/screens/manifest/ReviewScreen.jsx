import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import TopBar from "../../components/TopBar";
import PrimaryButton from "../../components/PrimaryButton";

import axiosInstance from "../../helper/AxioInstance";
import { styles } from "../../styles/pickupStyles";


export default function ReviewScreen({ seller, wh, scanned, onBack, onConfirm, facility,ScannedAwb }) {
  const cod = scanned.filter((s) => s.payment === "COD");
  const codAmt = cod.reduce((a, b) => a + b.cod, 0);
  const weight = scanned.reduce((a, b) => a + b.weight, 0);
  const [scannedAwb,setScannedAwb]=useState([])
  const getScannedAwbs = async () => {
    try {
      const res = await axiosInstance.post('/hub/getScannedAwbs', facility)

      console.log(res.data.data)
       setScannedAwb(res.data.data)
       ScannedAwb(res.data.data)
    } catch (error) {
        console.log(error.response.data)
    }
  }


  useEffect(() => {
    getScannedAwbs()
  }, [])


  console.log(facility)
  return (
    <View style={styles.screen}>
      <TopBar
        title="Review Manifest"
        subtitle="Confirm before generating"
        onBack={onBack}
        // step={{ i: 4, total: 5 }}
      />

      <ScrollView contentContainerStyle={{
        padding: 16,
        paddingBottom: 120,
        gap: 10,
      }}>
        {/* <View style={styles.card}>
          <Text style={styles.miniLabel}>Seller</Text>
          <Text style={styles.cardTitle}>{seller?.name}</Text>
          <Text style={styles.listSub}>{seller?.code}</Text>

          <View style={styles.divider} />
          <Text style={styles.miniLabel}>Warehouse</Text>
          <Text style={styles.cardTitle}>
            {wh?.name} · {wh?.code}
          </Text>
          <Text style={styles.listSub}>{wh?.address}</Text>
        </View> */}

        {/* <View style={styles.statGrid}>
          <Stat label="Total shipments" value={String(scanned.length)} />
          <Stat label="Total weight" value={`${weight.toFixed(1)} kg`} />
          <Stat label="Prepaid" value={String(scanned?.length - cod?.length)} />
          <Stat label="COD" value={String(cod.length)} />
        </View> */}

        {/* <View style={styles.accentBox}>
          <View>
            <Text style={styles.accentLabel}>Total COD amount</Text>
            <Text style={styles.accentValue}>{fmtINR(codAmt)}</Text>
          </View>

          <Package size={38} color="#111827" />
        </View> */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Scann · {scannedAwb.length}</Text>

          {scannedAwb?.map((s, i) => (
            <View key={s.awb_number} style={styles.tableRow}>
              <Text style={styles.indexText}>{i + 1}</Text>

              <View style={{ flex: 1 }}>
                <Text style={styles.awbText}>{s.awb_number}</Text>
                <Text style={styles.listSub}>
                  {s.pickup_stage} · {s.scan_type}
                </Text>
              </View>

              <View>
                <Text style={styles.payRight}>
                  {s?.status}
                </Text>
                {/* <Text style={styles.weightRight}>{s?.weight}kg</Text> */}
              </View>
            </View>
          ))}
        </View>

        {/* <View style={styles.warningBox}>
          <AlertTriangle size={18} color={WARNING} />
          <Text style={styles.warningText}>
            Once generated, this manifest cannot be edited.
          </Text>
        </View> */}
      </ScrollView>
      {
        scannedAwb.length > 0 && (

      <View style={styles.bottomBar}>
        <PrimaryButton 
        disabled={scannedAwb.length===0}
        onPress={onConfirm}
        
        >
          Submit
        </PrimaryButton>
      </View>
        )
      }
    </View>
  );
}