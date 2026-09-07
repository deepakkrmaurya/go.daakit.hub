
import React, { useEffect, useRef, useState } from "react";
import {
    BackHandler,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    StatusBar,
    Text,
    View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createMMKV } from "react-native-mmkv";
import { Camera } from "react-native-camera-kit";
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    RefreshCcw,
    ScanLine,
    X,
    Zap,
} from "lucide-react-native";
import axiosInstance from "../../helper/AxioInstance";
import { getItem, setStorage } from "../../helper/Storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { TextInput } from "react-native-gesture-handler";

const storage = createMMKV();
const STORAGE_KEY = "admin_scan_data";

export default function AdminScannerScreen({ route, navigation }) {
    const lockRef = useRef(false);
    const scanType = route?.params?.scanType;
    const [facilityId, setFacilityId] = useState("");
    const [facilityList, setFacilityList] = useState([]);
    const [awb, setAwb] = useState("");
    const [awbNumbers, setAwbNumbers] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [duplicateData, setDuplicateData] = useState(null);
    const [cameraKey, setCameraKey] = useState(1);
    const hub = getItem('hub');
    const data = JSON.parse(hub);


    const [scannerEnabled, setScannerEnabled] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");




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



    console.log(data.hub_role == 'vendor');

    const { facility_id } = route.params || {};

    // Check if facility_id is passed in params
    const hasFacilityId = facility_id && facility_id !== '';

    const [showFacilityModal, setShowFacilityModal] = useState(
        data?.hub_role === 'vendor'
            ? false
            : hasFacilityId
                ? false  // Don't show modal if facility_id is passed
                : true
    );

    const getAllFacilitiesData = () => {
        const saved = storage.getString(STORAGE_KEY);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const saveScannedAwb = (selectedFacilityId, awbNumber) => {
        const facilities = getAllFacilitiesData();
        const cleanAwb = String(awbNumber).trim().toUpperCase();

        // Vendor case: No facility_id, save as array with scanType
        if (data.hub_role === 'vendor' || !selectedFacilityId) {
            // Check if this AWB already exists in any group
            let duplicateFound = false;

            // Check in all groups
            for (const item of facilities) {
                if (item.awb_numbers && Array.isArray(item.awb_numbers)) {
                    if (item.awb_numbers.some(a => String(a).trim().toUpperCase() === cleanAwb)) {
                        duplicateFound = true;
                        return {
                            isDuplicate: true,
                            duplicateAwb: cleanAwb,
                            duplicateFacilityId: item.facility_id || 'vendor',
                        };
                    }
                }
            }

            // Find existing group with same scanType
            const existingGroupIndex = facilities.findIndex(
                item => item.scanType === scanType && !item.facility_id
            );

            if (existingGroupIndex >= 0) {
                // Add to existing group
                facilities[existingGroupIndex].awb_numbers.push(cleanAwb);
            } else {
                // Create new group
                facilities.push({
                    scanType: scanType || 'Pickup',
                    awb_numbers: [cleanAwb]
                });
            }

            storage.set(STORAGE_KEY, JSON.stringify(facilities));

            const updatedGroup = facilities.find(
                item => item.scanType === scanType && !item.facility_id
            );

            return {
                ...updatedGroup,
                isDuplicate: false,
            };
        }

        // Admin case: With facility_id
        const id = Number(selectedFacilityId);

        // Check for duplicate AWB
        const duplicateFacility = facilities.find((item) =>
            (item.awb_numbers || []).some(
                (a) => String(a).trim().toUpperCase() === cleanAwb
            )
        );

        if (duplicateFacility) {
            return {
                ...duplicateFacility,
                isDuplicate: true,
                duplicateFacilityId: duplicateFacility.facility_id,
                duplicateAwb: cleanAwb,
            };
        }

        // Find existing facility group with same scanType
        const existingIndex = facilities.findIndex(
            (item) => Number(item.facility_id) === id && item.scanType === scanType
        );

        if (existingIndex >= 0) {
            // Add to existing group
            facilities[existingIndex].awb_numbers.push(cleanAwb);
        } else {
            // Create new group
            facilities.push({
                facility_id: id,
                scanType: scanType || 'Pickup',
                awb_numbers: [cleanAwb],
            });
        }

        storage.set(STORAGE_KEY, JSON.stringify(facilities));

        const updatedGroup = facilities.find(
            (item) => Number(item.facility_id) === id && item.scanType === scanType
        );

        return {
            ...updatedGroup,
            isDuplicate: false,
        };
    };

    const loadFacilityAwbs = (selectedFacilityId) => {
        const facilities = getAllFacilitiesData();

        if (data.hub_role === 'vendor' || !selectedFacilityId) {
            // Vendor: Load AWBs for current scanType
            const group = facilities.find(
                item => item.scanType === scanType && !item.facility_id
            );
            setAwbNumbers(group?.awb_numbers || []);
            return;
        }

        // Admin: Load AWBs for facility and scanType
        const id = Number(selectedFacilityId);
        const group = facilities.find(
            (item) => Number(item.facility_id) === id && item.scanType === scanType
        );
        setAwbNumbers(group?.awb_numbers || []);
    };

    const handleBack = () => {
        if (showDuplicatePopup) {
            setShowDuplicatePopup(false);
            lockRef.current = false;
            return true;
        }

        if (showSuccess) {
            setShowSuccess(false);
            lockRef.current = false;
            return true;
        }

        if (navigation?.canGoBack?.()) {
            navigation.goBack();
        } else {
            navigation?.navigate?.("Main");
        }

        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBack
        );

        return () => backHandler.remove();
    }, [showSuccess, showDuplicatePopup]);

    const startScanner = () => {
        if (!facilityId) return;

        loadFacilityAwbs(facilityId);
        setShowFacilityModal(false);
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
                scan_type: scan_type,
                facility_id: facilityId
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




    const closeDuplicatePopup = () => {
        setShowDuplicatePopup(false);
        setDuplicateData(null);
        lockRef.current = false;
    };

    const onReadCode = async (event) => {
        if (showFacilityModal) return;
        if (lockRef.current) return;

        const value = event?.nativeEvent?.codeStringValue;
        if (!value) return;

        // Check if facility is required
        if (data?.hub_role === 'admin' && !facilityId) {
            return;
        }

        lockRef.current = true;


        const cleanAwb = value.trim().toUpperCase();

        // API Validation
        const result = await checkAwbScan(cleanAwb);

        if (!result.success) {
            setAwb(cleanAwb);
            setErrorMessage(result.message);
            setShowError(true);
            lockRef.current = true;
            return;
        }




        const currentFacility = saveScannedAwb(facilityId, value);

        if (currentFacility?.isDuplicate) {
            setAwb(value);
            loadFacilityAwbs(facilityId);
            setDuplicateData(currentFacility);
            setShowDuplicatePopup(true);
            lockRef.current = false;
            return;
        }

        setAwb(cleanAwb);
        setAwbNumbers(currentFacility?.awb_numbers || []);
        setShowSuccess(true);
    };

    const selectedFacility = facilityList.find(
        (item) => String(item.id) === String(facilityId)
    );

    const getFacility = async () => {
        try {
            const res = await axiosInstance.get("/hub/getPickupFacilityList");
            setFacilityList(res.data.data || []);
        } catch (error) {
            console.log("Facility error:", error);
        }
    };

    // Load data when facility_id changes
    useEffect(() => {
        if (hasFacilityId) {
            setFacilityId(String(facility_id));
            // Load the AWB data for this facility
            loadFacilityAwbs(facility_id);
        }
        if (data?.hub_role === 'admin') {
            getFacility();
        }
    }, [facility_id]);

    useFocusEffect(
        useCallback(() => {
            if (scanType) {
                setStorage("scanType", scanType);
            }
            // Reload AWB data when screen comes into focus
            if (hasFacilityId && facilityId) {
                loadFacilityAwbs(facilityId);
            }
        }, [scanType, facilityId, hasFacilityId])
    );

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />

            {!showFacilityModal && (
                <Camera
                    key={cameraKey}
                    style={styles.camera}
                    scanBarcode
                    onReadCode={onReadCode}
                    showFrame={false}
                    laserColor="transparent"
                    frameColor="transparent"
                />
            )}

            <View style={styles.overlay} />

            <View style={styles.topBar}>
                <Pressable onPress={handleBack} style={styles.iconBtn}>
                    <ArrowLeft size={22} color="#FFFFFF" />
                </Pressable>

                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Barcode Scanner</Text>
                    <Text style={styles.subtitle}>
                        {data.hub_role === 'vendor'
                            ? `Scan Type: ${scanType || 'Pickup'}`
                            : `Facility: ${selectedFacility?.facility_name || "Not selected"}`
                        }
                    </Text>
                </View>

                <Pressable onPress={refreshCamera} style={styles.iconBtn}>
                    <RefreshCcw size={21} color="#FFFFFF" />
                </Pressable>
            </View>

            {!showFacilityModal && (
                <>
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

                    <View style={styles.bottomPanel}>
                        <View style={styles.tipRow}>
                            <Zap size={18} color="#FFC107" />
                            <Text style={styles.tipText}>
                                Total scanned: {awbNumbers.length}
                            </Text>
                        </View>
                        <View style={styles.tipRow}>
                            <Text style={[styles.tipText, { fontSize: 11, color: '#9CA3AF' }]}>
                                Scan Type: {scanType || 'Pickup'}
                            </Text>
                        </View>
                    </View>
                </>
            )}

            <Modal transparent visible={showFacilityModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.facilityCard}>
                        <Pressable onPress={handleBack} style={styles.facilityBackBtn}>
                            <ArrowLeft size={20} color="#111827" />
                        </Pressable>

                        <Text style={styles.facilityTitle}>Select Facility</Text>

                        <Text style={styles.facilitySub}>
                            Please select a facility to start scanning.
                        </Text>

                        <View style={styles.pickerBox}>
                            <Picker
                                selectedValue={facilityId}
                                onValueChange={(value) => {
                                    setFacilityId(value);
                                    setAwb("");
                                    if (value) loadFacilityAwbs(value);
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Facility" value="" />

                                {facilityList.map((item) => (
                                    <Picker.Item
                                        key={item.id}
                                        label={`${item.facility_name} (${item.facility_code})`}
                                        value={String(item.id)}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <Pressable
                            onPress={startScanner}
                            style={[styles.primaryBtn, { opacity: facilityId ? 1 : 0.5 }]}
                        >
                            <Text style={styles.primaryText}>Start Scanner</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

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
                        <Text style={styles.successSub}>Data saved in MMKV storage</Text>

                        {data.hub_role !== 'vendor' && (
                            <View style={styles.awbBox}>
                                <Text style={styles.awbLabel}>Facility ID</Text>
                                <Text style={styles.awbText}>{facilityId}</Text>
                            </View>
                        )}

                        <View style={styles.awbBox}>
                            <Text style={styles.awbLabel}>Scan Type</Text>
                            <Text style={styles.awbText}>{scanType || 'Pickup'}</Text>
                        </View>

                        <View style={styles.awbBox}>
                            <Text style={styles.awbLabel}>AWB / Code</Text>
                            <Text style={styles.awbText}>{awb}</Text>
                        </View>

                        <View style={styles.awbBox}>
                            <Text style={styles.awbLabel}>Total AWB</Text>
                            <Text style={styles.awbText}>{awbNumbers.length}</Text>
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

            <Modal transparent visible={showDuplicatePopup} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.duplicateCard}>
                        <Pressable onPress={closeDuplicatePopup} style={styles.closeBtn}>
                            <X size={20} color="#6B7280" />
                        </Pressable>

                        <View style={styles.warningIcon}>
                            <AlertTriangle size={52} color="#DC2626" />
                        </View>

                        <Text style={styles.duplicateTitle}>Duplicate AWB</Text>
                        <Text style={styles.duplicateSub}>
                            This AWB has already been scanned.
                        </Text>

                        <View style={styles.awbBox}>
                            <Text style={styles.awbLabel}>AWB / Code</Text>
                            <Text style={styles.awbText}>
                                {duplicateData?.duplicateAwb || awb}
                            </Text>
                        </View>

                        {duplicateData?.duplicateFacilityId && (
                            <View style={styles.awbBox}>
                                <Text style={styles.awbLabel}>Already Scanned In</Text>
                                <Text style={styles.awbText}>
                                    {duplicateData.duplicateFacilityId === 'vendor'
                                        ? 'Vendor Scan'
                                        : `Facility ID: ${duplicateData.duplicateFacilityId}`
                                    }
                                </Text>
                            </View>
                        )}

                        <Pressable onPress={closeDuplicatePopup} style={styles.dangerBtn}>
                            <Text style={styles.primaryText}>Continue Scanning</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal transparent visible={showError} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.duplicateCard}>
                        <View style={styles.warningIcon}>
                            <AlertTriangle size={52} color="#DC2626" />
                        </View>

                        <Text style={styles.duplicateTitle}>Invalid AWB</Text>

                        <Text style={styles.duplicateSub}>
                            {errorMessage}
                        </Text>

                        <View style={styles.awbBox}>
                            <Text style={styles.awbLabel}>AWB</Text>
                            <Text style={styles.awbText}>{awb}</Text>
                        </View>

                        <Pressable
                            style={styles.dangerBtn}
                            onPress={() => {
                                setShowError(false);
                                setErrorMessage("");
                                setAwb("");
                                lockRef.current = false;

                                // Camera refresh
                                setCameraKey(prev => prev + 1);
                            }}
                        >
                            <Text style={styles.primaryText}>
                                Continue Scanning
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


            {/* menual awb */}

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
    facilityCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 24,
        paddingTop: 64,
    },
    facilityBackBtn: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 38,
        height: 38,
        borderRadius: 99,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
    },
    facilityTitle: {
        color: "#111827",
        fontSize: 22,
        fontWeight: "900",
        textAlign: "center",
    },
    facilitySub: {
        color: "#6B7280",
        fontSize: 13,
        marginTop: 8,
        textAlign: "center",
        lineHeight: 19,
    },
    pickerBox: {
        width: "100%",
        height: 56,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        marginTop: 22,
        justifyContent: "center",
        overflow: "hidden",
    },
    picker: {
        width: "100%",
        height: 56,
        color: "#111827",
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
    warningIcon: {
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