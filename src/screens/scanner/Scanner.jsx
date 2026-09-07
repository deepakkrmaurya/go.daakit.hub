import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Camera } from "react-native-camera-kit";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCcw,
  ScanLine,
  X,
  Zap,
  AlertTriangle
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { setStorage, storage } from "../../helper/Storage";
import axiosInstance from "../../helper/AxioInstance";
const STORAGE_KEY = "admin_scan_data";

export default function ScannerScreen({ navigation, route }) {
  const lockRef = useRef(false);
  const [awb, setAwb] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [cameraKey, setCameraKey] = useState(1);
  const scanType = route?.params?.scanType;

  const [scannerEnabled, setScannerEnabled] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualAwb, setManualAwb] = useState("");
  const saveManualAwb = () => {
    if (!manualAwb.trim()) return;

    onReadCode({
      nativeEvent: {
        codeStringValue: manualAwb.trim(),
      },
    });

    setManualAwb("");
    setShowManualModal(false);
  };



  const updateScanCount = () => {
    try {
      const savedData = JSON.parse(storage.getString(STORAGE_KEY) || "[]");

      if (!Array.isArray(savedData)) {
        setScanCount(0);
        return;
      }

      const currentGroup = savedData.find(
        item => item.scanType === scanType
      );

      setScanCount(currentGroup?.awb_numbers?.length || 0);
    } catch (error) {
      console.log(error);
      setScanCount(0);
    }
  };

  const refreshCamera = () => {
    lockRef.current = false;
    setScannerEnabled(true);
    setShowSuccess(false);
    setShowDuplicate(false);
    setShowError(false);
    setDuplicateInfo(null);
    setAwb("");
    setCameraKey(prev => prev + 1);
  };

  const checkAwbScan = async (awb) => {
    let scan_type = "";

    if (scanType === "Out") {
      scan_type = "out_scan";
    } else if (scanType === "Receive") {
      scan_type = "in_scan";
    } else {
      scan_type = "pickup_scan";
    }
    try {
      const res = await axiosInstance.post("/hub/checkAwbScan", {
        awb_number: awb,
        scan_type: scan_type
      });

      console.log("ghj", res)

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.log(error.response.data?.results[0]?.message)
      return {
        success: false,
        message: error.response.data?.results[0]?.message || error?.response?.data?.message || "Invalid AWB",
      };
    }
  };



  const onReadCode = async (event) => {

    if (lockRef.current) return;

    const value = event?.nativeEvent?.codeStringValue;
    if (!value) return;

    lockRef.current = true;

    const cleanAwb = value.trim().toUpperCase();

    const result = await checkAwbScan(cleanAwb);

    if (!result.success) {
      setScannerEnabled(false);
      setAwb(cleanAwb);
      setErrorMessage(result?.message);
      setShowError(true);
      lockRef.current = true;
      return;
    }

    try {
      let savedData = JSON.parse(
        storage.getString(STORAGE_KEY) || "[]"
      );



      if (!Array.isArray(savedData)) {
        savedData = [];
      }

      // Check for duplicates across ALL scan types
      let duplicateFound = false;
      let duplicateScanType = null;
      let duplicateIndex = -1;

      // Search through all groups for the AWB
      for (let i = 0; i < savedData.length; i++) {
        const group = savedData[i];
        const awbNumbers = group.awb_numbers || [];

        const awbExists = awbNumbers.some(
          awb => String(awb).trim().toUpperCase() === cleanAwb
        );

        if (awbExists) {
          duplicateFound = true;
          duplicateScanType = group.scanType || 'Unknown';
          duplicateIndex = i;
          break;
        }
      }
      setTimeout(() => {
        updateScanCount();
      }, 2000);
      // If duplicate found anywhere, show popup and don't save
      if (duplicateFound) {
        setAwb(cleanAwb);
        setDuplicateInfo({
          scanType: duplicateScanType,
          index: duplicateIndex
        });
        setShowDuplicate(true);

        lockRef.current = false; // Reset lock so user can scan again
        return;
      }

      // No duplicate found - proceed with saving

      // Find existing group with same scanType
      const existingTypeIndex = savedData.findIndex(
        item => item.scanType === scanType
      );

      if (existingTypeIndex !== -1) {
        // Add to existing group
        savedData[existingTypeIndex].awb_numbers.push(cleanAwb);
      } else {
        // Create new group
        savedData.push({
          scanType: scanType,
          awb_numbers: [cleanAwb],
        });
      }

      storage.set(
        STORAGE_KEY,
        JSON.stringify(savedData)
      );

      console.log(
        "Saved Data =>",
        JSON.stringify(savedData, null, 2)
      );

      setAwb(cleanAwb);
      setShowSuccess(true);

    } catch (error) {
      console.log("MMKV Error:", error);
      lockRef.current = false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      updateScanCount();
      if (scanType) {
        setStorage("scanType", scanType);
      }
    }, [scanType])
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />


      <Camera
        key={cameraKey}
        style={styles.camera}
        scanBarcode
        onReadCode={onReadCode}

        showFrame={false}
        laserColor="transparent"
        frameColor="transparent"
      />


      <View style={styles.overlay} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={styles.iconBtn}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Barcode Scanner</Text>
          <Text style={styles.subtitle}>
            Scan Type: {scanType || 'Pickup'}
          </Text>
        </View>

        <Pressable onPress={refreshCamera} style={styles.iconBtn}>
          <RefreshCcw size={21} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      <View style={styles.scanArea}>
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        <View style={styles.scanLine} />

        <View style={styles.scanIconBox}>
          <ScanLine size={22} color="#FFC107" />
          <Text style={styles.scanText}>Align barcode inside frame</Text>
        </View>
      </View>

      <View style={styles.bottomPanel}>
        {/* <View style={styles.tipRow}>
          <Zap size={18} color="#FFC107" />
          <Text style={styles.tipText}>
            Hold steady and keep barcode inside the yellow frame
          </Text>
        </View> */}
        <View>
          <View style={styles.tipRow}>
            <Zap size={18} color="#FFC107" />
            <Text style={styles.tipText}>
              Total scanned: {scanCount}
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={[styles.tipText, { fontSize: 11, color: '#9CA3AF' }]}>
              Scan Type: {scanType || 'Pickup'} Scan
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setShowManualModal(true)}
          style={{
            position: "absolute",
            bottom: 120,
            alignSelf: "center",
            backgroundColor: "#0446DB",
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontWeight: "900",
              fontSize: 14,
            }}
          >
            Manual Enter AWB
          </Text>
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <Pressable
              onPress={() => {
                setShowSuccess(false);
                lockRef.current = false;
              }}
              style={styles.closeBtn}
            >
              <X size={20} color="#6B7280" />
            </Pressable>

            <View style={styles.successIcon}>
              <CheckCircle2 size={52} color="#16A34A" />
            </View>

            <Text style={styles.successTitle}>Scan Successful</Text>
            <Text style={styles.successSub}>
              AWB added to {scanType || 'Pickup'}
            </Text>

            <View style={styles.awbBox}>
              <Text style={styles.awbLabel}>AWB / Code</Text>
              <Text style={styles.awbText}>{awb}</Text>
            </View>

            <Pressable
              onPress={() => {
                setShowSuccess(false);
                lockRef.current = false;
              }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryText}>Continue Scanning</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Duplicate Modal */}
      <Modal transparent visible={showDuplicate} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.duplicateCard}>
            <Pressable
              onPress={() => {
                setShowDuplicate(false);
                setDuplicateInfo(null);
                lockRef.current = false;
              }}
              style={styles.closeBtn}
            >
              <X size={20} color="#6B7280" />
            </Pressable>

            <View style={styles.duplicateIcon}>
              <AlertTriangle size={52} color="#DC2626" />
            </View>

            <Text style={styles.duplicateTitle}>Duplicate AWB</Text>
            <Text style={styles.duplicateSub}>
              This AWB has already been scanned in another type
            </Text>

            <View style={styles.awbBox}>
              <Text style={styles.awbLabel}>AWB / Code</Text>
              <Text style={styles.awbText}>{awb}</Text>
            </View>

            {duplicateInfo && (
              <View style={styles.awbBox}>
                <Text style={styles.awbLabel}>Already Scanned In</Text>
                <Text style={[styles.awbText, { color: '#DC2626' }]}>
                  {duplicateInfo.scanType}
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => {
                setShowDuplicate(false);
                setDuplicateInfo(null);
                lockRef.current = false;
              }}
              style={styles.dangerBtn}
            >
              <Text style={styles.primaryText}>Continue Scanning</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* menual Awb */}
      <Modal
        transparent
        visible={showManualModal}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={{
              width: "100%",
              backgroundColor: "#FFF",
              borderRadius: 24,
              padding: 24,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: "#111827",
                marginBottom: 20,
              }}
            >
              Enter AWB Number
            </Text>

            <TextInput
              value={manualAwb}
              onChangeText={setManualAwb}
              placeholder="Enter AWB"
              autoCapitalize="characters"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 14,
                paddingHorizontal: 16,
                height: 56,
                fontSize: 16,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                gap: 10,
              }}
            >
              <Pressable
                onPress={() => setShowManualModal(false)}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveManualAwb}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: "#0446DB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "900" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>


      <Modal transparent visible={showError} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.duplicateCard}>
            <Pressable
              onPress={() => {
                setShowError(false);
                setErrorMessage("");
                lockRef.current = false;

              }}
              style={styles.closeBtn}
            >
              <X size={20} color="#6B7280" />
            </Pressable>

            <View style={styles.duplicateIcon}>
              <AlertTriangle size={52} color="#DC2626" />
            </View>

            <Text style={styles.duplicateTitle}>Invalid AWB</Text>

            <Text
              style={[
                styles.duplicateSub,
                {
                  marginTop: 15,
                  textAlign: "center",
                },
              ]}
            >
              {errorMessage}
            </Text>

            <View style={styles.awbBox}>
              <Text style={styles.awbLabel}>AWB</Text>
              <Text style={styles.awbText}>{awb}</Text>
            </View>

            <Pressable
              onPress={() => {
                setShowError(false);
                setErrorMessage("");
                setAwb("");
                lockRef.current = false;

                // Restart Camera
                setScannerEnabled(true);
                setCameraKey(prev => prev + 1);
              }}
              style={styles.dangerBtn}
            >
              <Text style={styles.primaryText}>Continue Scanning</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: "#020617",
  },

  camera: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(2,6,23,0.35)",
  },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    marginTop: 3,
  },

  liveBadge: {
    position: "absolute",
    top: 118,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(22,163,74,0.18)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: "#22C55E",
  },

  liveText: {
    color: "#BBF7D0",
    fontSize: 11,
    fontWeight: "900",
  },

  scanArea: {
    position: "absolute",
    left: 32,
    right: 32,
    top: "32%",
    height: 230,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  cornerTL: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderColor: "#FFC107",
    borderTopLeftRadius: 24,
  },

  cornerTR: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 50,
    height: 50,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderColor: "#FFC107",
    borderTopRightRadius: 24,
  },

  cornerBL: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 50,
    height: 50,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#FFC107",
    borderBottomLeftRadius: 24,
  },

  cornerBR: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#FFC107",
    borderBottomRightRadius: 24,
  },

  scanLine: {
    width: "82%",
    height: 3,
    backgroundColor: "#FFC107",
    shadowColor: "#FFC107",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },

  scanIconBox: {
    position: "absolute",
    bottom: -52,
    alignItems: "center",
  },

  scanText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "700",
  },

  bottomPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "rgba(15,23,42,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 18,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  tipText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  successCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },

  duplicateCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  successIcon: {
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  duplicateIcon: {
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
  },

  duplicateTitle: {
    color: "#DC2626",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
  },

  successSub: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 5,
  },

  duplicateSub: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  awbBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },

  awbLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  awbText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },

  primaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#0446DB",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  dangerBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#DC2626",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
};