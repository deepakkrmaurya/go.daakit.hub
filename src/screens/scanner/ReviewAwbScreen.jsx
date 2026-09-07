import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { AlertTriangle, ChevronLeft, Package, ShieldCheck } from "lucide-react-native";
import SwipeButton from "rn-swipe-button";
import TopBar from "../../components/TopBar";
import PrimaryButton from "../../components/PrimaryButton";
import Stat from "../../components/Stat";
import { fmtINR } from "../../utils/manifestUtils";
import { WARNING, styles } from "../../styles/pickupStyles";
import { getItem, storage } from "../../helper/Storage";
import { goBack, navigate } from "../../utils/NavigationUtils"
import SwiperButton from "../../components/SwiperButten";
import axiosInstance from "../../helper/AxioInstance";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
const STORAGE_KEY = "admin_scan_data";

export default function ReviewAwbScreen({
    seller,
    wh,
    scanned,
    onConfirm,

}) {

    
    const [facilityData, setFacilityData] = useState([]);
    console.log(facilityData)
    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
            return;
        }

        Alert.alert("Confirmed", "AWBs confirmed successfully.");
    };

    // useEffect(() => {
    //     const saved = storage.getString(STORAGE_KEY);

    //     if (!saved) {
    //         setFacilityData([]);
    //         return;
    //     }

    //     try {
    //         const parsed = JSON.parse(saved);

    //         if (Array.isArray(parsed)) {
    //             setFacilityData(parsed);
    //         } else if (parsed?.facility_id) {
    //             setFacilityData([parsed]);
    //         } else {
    //             setFacilityData([]);
    //         }
    //     } catch (error) {
    //         console.log("Storage parse error:", error);
    //         setFacilityData([]);
    //     }
    // }, []);

    const totalShipments = facilityData.reduce(
        (total, item) => total + (item?.awb_numbers?.length || 0),
        0
    );



    const loadStorageData = () => {
        const saved = storage.getString(STORAGE_KEY);

        if (!saved) {
            setFacilityData([]);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            setFacilityData(Array.isArray(parsed) ? parsed : []);
        } catch {
            setFacilityData([]);
        }
    };

    const removeFacilityData = (facilityId) => {
        const saved = storage.getString(STORAGE_KEY);
        console.log(saved)
        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);

            const updatedData = parsed.filter(
                (item) => item.facility_id !== facilityId
            );

            storage.set(STORAGE_KEY, JSON.stringify(updatedData));
            setFacilityData(updatedData);
        } catch (error) {
            console.log("Error removing facility data:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStorageData();
        }, [])
    );



    const onSubmit = async (facility = []) => {
        try {




            const responses = await Promise.all(
                facility.map(async (item) => {
                    const res = await axiosInstance.post("/hub/pickupOrderByVendorRider", {
                        facility_id: item.facility_id,
                        awb_numbers: item.awb_numbers,
                    });

                    removeFacilityData(item.facility_id);

                    return res;
                })
            );


            loadStorageData()

            Toast.show({
                type: "success",
                text1: responses.data.message
            })
            goBack()

        } catch (error) {
            Toast.show({
                type: "error",
                text1: error.response.data.message
            })
            console.log("Error:", error?.response?.data || error.message);
        }
    };

    const weight = totalShipments * 0.5;
    const codAmt = 0;

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            <View style={styles.screen}>

                <TopBar
                    title="Scanned AWBs"
                    subtitle="Review scanned shipments by facility"
                    onBack={goBack}
                />

                <ScrollView
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 120,
                        gap: 10,
                    }}
                >
                    {/* <View style={styles.card}>
                    <Text style={styles.miniLabel}>Seller</Text>
                    <Text style={styles.cardTitle}>{seller?.name || "Demo Seller"}</Text>
                    <Text style={styles.listSub}>{seller?.code || "SELLER-001"}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.miniLabel}>Warehouse</Text>
                    <Text style={styles.cardTitle}>
                        {wh?.name || "Demo Warehouse"} · {wh?.code || "WH-001"}
                    </Text>
                    <Text style={styles.listSub}>
                        {wh?.address || "Static warehouse address"}
                    </Text>
                </View> */}

                    {/* <View style={styles.statGrid}>
                    <Stat label="Total shipments" value={String(totalShipments)} />
                    <Stat label="Total weight" value={`${weight.toFixed(1)} kg`} />
                    <Stat label="Prepaid" value={String(totalShipments)} />
                    <Stat label="COD" value="0" />
                </View> */}

                    {/* <View style={styles.accentBox}>
                    <View>
                        <Text style={styles.accentLabel}>Total COD amount</Text>
                        <Text style={styles.accentValue}>{fmtINR(codAmt)}</Text>
                    </View>

                    <Package size={38} color="#111827" />
                </View> */}

                    {facilityData.length === 0 ? (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Shipments · 0</Text>
                            <Text style={styles.listSub}>No AWB found in storage.</Text>
                        </View>
                    ) : (
                        facilityData.map((facility) => {
                            const awbs = facility?.awb_numbers || [];

                            return (
                                <View key={facility.facility_id} style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        Facility ID : {facility.facility_id}
                                    </Text>

                                    <Text style={[styles.listSub, { marginBottom: 12 }]}>
                                        Shipments · {awbs.length}
                                    </Text>

                                    {awbs.length === 0 ? (
                                        <Text style={styles.listSub}>No AWB found.</Text>
                                    ) : (
                                        awbs.map((awb, index) => (
                                            <View
                                                key={`${facility.facility_id}-${awb}-${index}`}
                                                style={styles.tableRow}
                                            >
                                                <Text style={styles.indexText}>{index + 1}</Text>

                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.awbText}>{awb}</Text>
                                                    <Text style={styles.listSub}>Scanned Shipment</Text>
                                                </View>

                                                {/* <View>
                                                <Text style={styles.payRight}>Prepaid</Text>
                                                <Text style={styles.weightRight}>0.5kg</Text>
                                            </View> */}
                                            </View>
                                        ))
                                    )}

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            gap: 12,
                                            marginTop: 16,
                                        }}
                                    >
                                        <Pressable
                                            onPress={() =>
                                                navigate("AdminScannerScreen", {
                                                    facility_id: facility.facility_id,
                                                })
                                            }
                                            style={{
                                                flex: 1,
                                                height: 45,
                                                borderRadius: 18,
                                                backgroundColor: "#0446DB",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "row",
                                                gap: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#FFFFFF",
                                                    fontWeight: "800",
                                                }}
                                            >
                                                Continue
                                            </Text>

                                        </Pressable>

                                        <Pressable
                                            onPress={() => {
                                                onSubmit([facility])
                                            }}
                                            style={{
                                                flex: 1,
                                                height: 45,
                                                borderRadius: 18,
                                                backgroundColor: "#F3F4F6",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "row",
                                                gap: 5,
                                            }}
                                        >

                                            <Text
                                                style={{
                                                    color: "#111827",
                                                    fontWeight: "900",
                                                }}
                                            >
                                                Submit
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            );
                        })
                    )}

                    <View style={styles.warningBox}>
                        <AlertTriangle size={18} color={WARNING} />
                        <Text style={styles.warningText}>
                            Once generated, this manifest cannot be edited.
                        </Text>
                    </View>
                </ScrollView>


                <View style={styles.bottomBar}>
                    <PrimaryButton onPress={onConfirm}>
                        Confirm & Sign
                    </PrimaryButton>
                </View>
            </View>
        </SafeAreaView>
    );
}
