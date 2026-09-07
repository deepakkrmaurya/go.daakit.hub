
import React, { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Camera } from "react-native-camera-kit";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eraser,
  Plus,
  XCircle,
} from "lucide-react-native";

import TopBar from "../components/TopBar";
import PrimaryButton from "../components/PrimaryButton";
import Counter from "../components/Counter";
import { fmtINR } from "../utils/manifestUtils";
import { DANGER, MUTED, SUCCESS, styles } from "../styles/pickupStyles";

export default function ScanScreen({
  seller,
  wh,
  shipments,
  scanned,
  setScanned,
  errors,
  setErrors,
  onBack,
  onDone,
}) {
  const [awb, setAwb] = useState("");
  const [manual, setManual] = useState(false);
  const [flash, setFlash] = useState(null);
  const lockRef = useRef(false);

  const summary = useMemo(() => {
    const cod = scanned.filter((s) => s.payment === "COD");

    return {
      total: scanned.length,
      cod: cod.length,
      prepaid: scanned.length - cod.length,
      codAmt: cod.reduce((a, b) => a + b.cod, 0),
      weight: scanned.reduce((a, b) => a + b.weight, 0),
    };
  }, [scanned]);

  const reject = (code, reason) => {
    setErrors((old) => [
      {
        awb: code,
        reason,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...old,
    ]);

    setFlash({ ok: false, msg: reason, awb: code });
    setTimeout(() => setFlash(null), 2000);
  };

  // const handleScan = (code) => {
  //   const v = String(code || "").trim().toUpperCase();
  //   if (!v) return;

  //   setAwb("");

  //   // const ship = shipments.find((s) => s.awb === v);
  //   const isValidAwb =
  //     v.toUpperCase().startsWith("DKT") ||
  //     v.toUpperCase().startsWith("DKTGO");

  //   if (!isValidAwb) {
  //     return reject(v, "Invalid AWB format");
  //   }

  //   const ship = shipments.find(
  //     (s) => s.awb.toUpperCase() === v
  //   );

  //   console.log(ship)

  //   if (!ship) return reject(v, "Invalid shipment / AWB not found");
  //   if (scanned.find((s) => s.awb === v)) return reject(v, "Duplicate scan");
  //   if (ship.sellerId !== seller.id) return reject(v, "Belongs to a different seller");
  //   if (ship.warehouseId !== wh.id) return reject(v, "Belongs to a different warehouse");
  //   if (ship.status === "MANIFESTED") return reject(v, `Already in manifest ${ship.manifest}`);
  //   if (ship.status === "PICKED") return reject(v, "Already picked up");

  //   setScanned((old) => [...old, ship]);

  //   setFlash({
  //     ok: true,
  //     msg: "Scanned successfully",
  //     awb: v,
  //   });

  //   setTimeout(() => setFlash(null), 1600);
  // };

 
 const handleScan = (code) => {
  const v = String(code || "").trim().toUpperCase();
  if (!v) return;

  setAwb("");

  const isValidAwb =
    v.startsWith("DKT") ||
    v.startsWith("DKTGO");

  if (!isValidAwb) {
    return reject(v, "Invalid AWB format");
  }

  const existing = scanned.find(
    (s) => s.awb.toUpperCase() === v
  );

  if (existing) {
    return reject(v, "Duplicate scan");
  }

  const ship = shipments.find(
    (s) => s.awb.toUpperCase() === v
  );

  const finalShip =
    ship || {
      awb: v,
      orderId: `ORD${Date.now().toString().slice(-6)}`,
      sellerId: seller.id,
      warehouseId: wh.id,
      payment: "PREPAID",
      cod: 0,
      city: "Delhi",
      weight: 1.2,
      status: "READY",
    };

  if (finalShip.sellerId !== seller.id) {
    return reject(v, "Belongs to a different seller");
  }

  if (finalShip.warehouseId !== wh.id) {
    return reject(v, "Belongs to a different warehouse");
  }

  if (finalShip.status === "MANIFESTED") {
    return reject(v, `Already in manifest ${finalShip.manifest}`);
  }

  if (finalShip.status === "PICKED") {
    return reject(v, "Already picked up");
  }

  setScanned((old) => [...old, finalShip]);

  setFlash({
    ok: true,
    msg: "Scanned successfully",
    awb: v,
  });

  setTimeout(() => setFlash(null), 1600);
};
 
 
  const onReadCode = (event) => {
    if (lockRef.current) return;

    const value = event?.nativeEvent?.codeStringValue;
    if (!value) return;

    lockRef.current = true;
    handleScan(value);

    setTimeout(() => {
      lockRef.current = false;
    }, 1500);
  };

  return (
    <View style={styles.screen}>
      <TopBar
        title="Scan Shipments"
        subtitle={`${seller.name} · ${wh.code}`}
        onBack={onBack}
        step={{ i: 3, total: 5 }}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={[styles.scannerBox, { position: "relative" }]}>
          <Camera
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            scanBarcode
            onReadCode={onReadCode}
            showFrame={false}
            laserColor="transparent"
            frameColor="transparent"
          />

          <Text style={styles.cameraText}>● Camera live</Text>

          <View style={styles.scanFrame}>
            <View style={styles.scanLine} />
          </View>
        </View>

        {!!flash && (
          <View style={[styles.flashBox, flash.ok ? styles.flashOk : styles.flashBad]}>
            {flash.ok ? (
              <CheckCircle2 size={22} color={SUCCESS} />
            ) : (
              <XCircle size={22} color={DANGER} />
            )}

            <View>
              <Text style={styles.flashTitle}>{flash.msg}</Text>
              <Text style={styles.flashSub}>AWB {flash.awb}</Text>
            </View>
          </View>
        )}

        <Pressable onPress={() => setManual(!manual)}>
          <Text style={styles.linkText}>
            {manual ? "Hide manual entry" : "Enter AWB manually"}
          </Text>
        </Pressable>

        {manual && (
          <View style={styles.manualRow}>
            <TextInput
              value={awb}
              onChangeText={setAwb}
              placeholder="DKT123456789"
              placeholderTextColor={MUTED}
              autoCapitalize="characters"
              style={styles.manualInput}
            />

            <Pressable onPress={() => handleScan(awb)} style={styles.addBtn}>
              <Plus size={17} color="#fff" />
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.counterRow}>
          <Counter label="Scanned" value={summary.total} tone="primary" />
          <Counter label="Prepaid" value={summary.prepaid} />
          <Counter label="COD" value={summary.cod} />
          <Counter
            label="Invalid"
            value={errors.length}
            tone={errors.length ? "danger" : "muted"}
          />
        </View>

        <View style={styles.codBox}>
          <View>
            <Text style={styles.codLabel}>Total COD</Text>
            <Text style={styles.codValue}>{fmtINR(summary.codAmt)}</Text>
          </View>

          <View>
            <Text style={styles.codLabel}>Weight</Text>
            <Text style={styles.codValue}>{summary.weight.toFixed(1)} kg</Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent scans</Text>

          {scanned.length > 0 && (
            <Pressable
              onPress={() => setScanned([])}
              style={{ flexDirection: "row", gap: 4 }}
            >
              <Eraser size={14} color={MUTED} />
              <Text style={{ color: MUTED, fontSize: 12 }}>Clear</Text>
            </Pressable>
          )}
        </View>

        {scanned
          .slice()
          .reverse()
          .slice(0, 6)
          .map((s) => (
            <View key={s.awb} style={styles.scanItem}>
              <CheckCircle2 size={21} color={SUCCESS} />

              <View style={{ flex: 1 }}>
                <Text style={styles.awbText}>{s.awb}</Text>
                <Text style={styles.listSub}>
                  {s.orderId} · {s.city} · {s.weight}kg
                </Text>
              </View>

              <Text style={styles.payBadge}>
                {s.payment}
                {s.payment === "COD" ? ` ${fmtINR(s.cod)}` : ""}
              </Text>
            </View>
          ))}

        {errors.length > 0 && <Text style={styles.sectionTitle}>Rejected</Text>}

        {errors.slice(0, 4).map((e, i) => (
          <View key={i} style={styles.errorItem}>
            <AlertTriangle size={18} color={DANGER} />

            <View style={{ flex: 1 }}>
              <Text style={styles.awbText}>{e.awb}</Text>
              <Text style={styles.listSub}>
                {e.reason} · {e.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          disabled={scanned.length === 0}
          onPress={onDone}
          icon={ChevronRight}
        >
          Complete Pickup · {scanned.length}
        </PrimaryButton>
      </View>
    </View>
  );
}