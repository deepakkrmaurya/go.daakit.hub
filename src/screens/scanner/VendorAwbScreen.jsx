
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
import { getItem, removeItem, storage } from "../../helper/Storage";
import { goBack, navigate } from "../../utils/NavigationUtils"
import SwiperButton from "../../components/SwiperButten";
import axiosInstance from "../../helper/AxioInstance";

import { SafeAreaView } from "react-native-safe-area-context";
import requestStoragePermission from "../../premission/storagepremission";
import { generatePDF } from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "admin_scan_data";

export default function VendorReviewAwbScreen({
    seller,
    wh,
    scanned,
    onConfirm,
}) {
    const [facilityData, setFacilityData] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState({});
    

    const [showError, setShowError] = useState(false);
const [errorMessage, setErrorMessage] = useState("");




    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
            return;
        }
        Alert.alert("Confirmed", "AWBs confirmed successfully.");
    };

    const loadStorageData = () => {
        const saved = storage.getString(STORAGE_KEY);
        console.log(saved)
        if (!saved) {
            setFacilityData([]);
            return;
        }

        console.log("save", saved);

        try {
            const parsed = JSON.parse(saved);
            console.log(parsed);
            setFacilityData(Array.isArray(parsed) ? parsed : []);
        } catch {
            setFacilityData([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStorageData();
        }, [])
    );

    const hub = getItem("hub");
    const hubData = hub ? JSON.parse(hub) : null;

    const createManifestHtml = (awbs, scanType) => {
        const rows = awbs
            .map(
                (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item}</td>
        </tr>
      `
            )
            .join("");

        return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0446DB;
            padding-bottom: 14px;
            margin-bottom: 24px;
          }

          .brand {
            color: #0446DB;
            font-size: 24px;
            font-weight: bold;
          }

          .title {
            font-size: 20px;
            font-weight: bold;
            margin-top: 8px;
          }

          .date-box {
            text-align: right;
          }

          .info {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
          }

          .box {
            flex: 1;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px;
            background: #F9FAFB;
          }

          .label {
            color: #6B7280;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }

          .value {
            margin-top: 6px;
            font-size: 14px;
            font-weight: bold;
          }

          .section-title {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            background: #EEF4FF;
            color: #111827;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            border: 1px solid #E5E7EB;
          }

          td {
            padding: 10px 12px;
            border: 1px solid #E5E7EB;
            font-size: 12px;
          }

          tr:nth-child(even) {
            background: #FAFAFA;
          }

          .signature {
            margin-top: 40px;
          }

          .signature-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .sign-box {
            width: 220px;
            height: 80px;
            border: 1px solid #D1D5DB;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .sign-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #6B7280;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div>
            <div class="brand">DAAKit Technologies Pvt Ltd</div>
           
          </div>

          <div class="date-box">
            <div class="label">Issued On</div>
            <div class="value">
              ${new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div class="info">
            <div class="box">
              <div class="label">Hub Name</div>
              <div class="value">${hubData?.hub_name || ""}</div>
              <div>Hub Code: ${hubData?.hub_code || ""}</div>
            </div>

            <div class="box">
              <div class="label">Hub Type</div>
              <div class="value">${hubData?.hub_type || ""}</div>
              <div>City: ${hubData?.city || ""}</div>
              <div>State: ${hubData?.state || ""}</div>
            </div>
          </div>

        <div class="info">
          <div class="box">
            <div class="label">Scan Type</div>
            <div class="value">${scanType || "Pickup"} SCAN</div>
          </div>
          <div class="box">
            <div class="label">Total Shipments</div>
            <div class="value">${awbs.length}</div>
          </div>
        </div>

        <div class="section-title">Shipment Details</div>

        <table>
          <thead>
            <tr>
              <th style="width:60px">#</th>
              <th>AWB Number</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <span>
            Generated on ${new Date().toLocaleDateString()}
          </span>
        </div>

      </body>
    </html>
  `;
    };

    const generateAndSendPdf = async (awbs, scanType) => {
        try {
            await requestStoragePermission();

            const html = createManifestHtml(awbs, scanType);

            const file = await generatePDF({
                html,
                fileName: `manifest_${scanType}_${Date.now()}`,
                directory: "Documents",
                base64: true,
            });

            console.log("Generated PDF:", file);

            const downloadPath =
                `${RNFS.DownloadDirectoryPath}/manifest_${scanType}_${Date.now()}.pdf`;

            await RNFS.copyFile(file.filePath, downloadPath);

            console.log("Saved to:", downloadPath);
            Alert.alert(
                "Success",
                "PDF saved in Download folder"
            );
            return true;
        } catch (error) {
            console.log(
                "PDF Upload Error:",
                error?.response?.data || error?.message || error
            );
            return false;
        }
    };

    const onSubmit = async (awbs, scanType, groupIndex, facility_id) => {
        setLoadingGroups(prev => ({ ...prev, [groupIndex]: true }));
        console.log(awbs, scanType, facility_id)

        try {
            let response;

            if (scanType === 'Out') {
                response = await axiosInstance.post("/hub/outorderbycanner", {
                    awb_numbers: awbs
                });
            } else if (scanType === 'Receive') {
                response = await axiosInstance.post("/hub/receiveorderbycanner", {
                    awb_numbers: awbs
                });
            } else {
                console.log(facility_id ? facility_id : null)
                response = await axiosInstance.post("/hub/pickupOrderByVendorRider", {
                    awb_numbers: awbs,
                    facility_id: facility_id ? facility_id : null
                });
            }

            console.log(response);
            Toast.show({
                type: "success",
                text1: response.data.message || "Successfully submitted"
            });

            const res = await generateAndSendPdf(response?.data?.successful_awb_numbers, scanType);
            if (res) {
                // Remove the submitted group from storage
                const updatedData = facilityData.filter((_, index) => index !== groupIndex);
                storage.set(STORAGE_KEY, JSON.stringify(updatedData));
                setFacilityData(updatedData);

                // Check if all groups are submitted
                if (updatedData.length === 0) {
                    removeItem("scanType");
                    goBack();
                }
            }

        } catch (error) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || "Something went wrong"
            });
            console.log("Error:", error?.response?.data?.message || error.message);
        } finally {
            setLoadingGroups(prev => ({ ...prev, [groupIndex]: false }));
        }
    };

    const clearAwb = () => {
        removeItem(STORAGE_KEY);
        removeItem("scanType");
        loadStorageData();
    };


    const removeAwb = (groupIndex, awbToRemove) => {
        const updatedData = facilityData
            .map((group, index) => {
                if (index !== groupIndex) return group;

                return {
                    ...group,
                    awb_numbers: group.awb_numbers.filter(
                        awb => awb !== awbToRemove
                    ),
                };
            })
            // Agar group empty ho jaye to usko bhi remove kar do
            .filter(group => group.awb_numbers.length > 0);

        storage.set(STORAGE_KEY, JSON.stringify(updatedData));
        setFacilityData(updatedData);

        if (updatedData.length === 0) {
            removeItem("scanType");
            goBack();
        }
    };

    const getScanTypeDisplayName = (scanType) => {
        if (!scanType) return "Pickup";
        const names = {
            "Out": "Out Scanner",
            "Receive": "Receive Scanner",
            "Pickup": "Pickup"
        };
        return names[scanType] || scanType;
    };

    const getScanTypeColor = (scanType) => {
        const colors = {
            "Out": "#EF4444",
            "Receive": "#3B82F6",
            "Pickup": "#10B981"
        };
        return colors[scanType] || "#6B7280";
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0446DB]">
            <StatusBar barStyle="light-content" backgroundColor="#0446DB" />
            <View style={styles.screen}>
                <TopBar
                    title="Scanned AWBs"
                    subtitle="Review shipments by scan type"
                    onBack={goBack}
                />

                <ScrollView
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 20,
                        gap: 16,
                    }}
                >
                    {facilityData.length === 0 ? (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Shipments · 0</Text>
                            <Text style={styles.listSub}>No AWB found in storage.</Text>
                        </View>
                    ) : (
                        <>
                            <Pressable onPress={clearAwb} style={{ alignItems: 'flex-end', marginBottom: 8 }}>
                                <Text style={{ color: '#EF4444', fontWeight: '600' }}>Clear All</Text>
                            </Pressable>

                            {facilityData.map((group, groupIndex) => (
                                <View key={groupIndex} style={[styles.card, { marginBottom: 8 }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        paddingBottom: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#E5E7EB'
                                    }}>
                                        <View>
                                            <Text style={[styles.cardTitle, { fontSize: 16 }]}>
                                                {getScanTypeDisplayName(group.scanType)} Scan
                                            </Text>
                                            <Text style={[styles.listSub, { fontSize: 12 }]}>
                                                {group.awb_numbers?.length || 0} Shipments
                                            </Text>
                                            {
                                                group?.facility_id && (

                                                    <Text style={[styles.listSub, { fontSize: 12 }]}>
                                                        Facility Id:  {group.facility_id || 0}
                                                    </Text>
                                                )
                                            }
                                        </View>
                                        <View style={{
                                            backgroundColor: getScanTypeColor(group.scanType),
                                            paddingHorizontal: 12,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                        }}>
                                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                                                {group.scanType || 'Pickup'}
                                            </Text>
                                        </View>
                                    </View>

                                    {group.awb_numbers?.length === 0 ? (
                                        <Text style={styles.listSub}>No AWB found.</Text>
                                    ) : (
                                        group.awb_numbers.map((awb, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.tableRow,
                                                    {
                                                        backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white',
                                                        paddingVertical: 8,
                                                        paddingHorizontal: 12,
                                                        borderRadius: 4,
                                                        marginBottom: 2
                                                    }
                                                ]}
                                            >
                                                <Text style={[styles.indexText, { fontWeight: '600' }]}>
                                                    {index + 1}
                                                </Text>
                                                <View style={{ flex: 1, marginLeft: 12 }}>
                                                    <Text style={[styles.awbText, { fontSize: 13 }]}>{awb}</Text>
                                                    <Text style={[styles.listSub, { fontSize: 10 }]}>
                                                        {getScanTypeDisplayName(group.scanType)} Shipment
                                                    </Text>
                                                </View>
                                                <Pressable
                                                    onPress={() => removeAwb(groupIndex, awb)}
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 6,
                                                        backgroundColor: "#EF4444",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                                                        Remove
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        ))
                                    )}

                                    {/* <View
                                        style={{
                                            marginTop: 16,
                                            flexDirection: "row",
                                            gap: 10,
                                        }}
                                    >
                                        <View style={{
                                            marginTop: 16,
                                            backgroundColor: "#0446DB",
                                            padding: 10,
                                            borderRadius: 8,
                                            flex: 1

                                        }}>
                                            <PrimaryButton onPress={() => navigate("AdminScannerScreen")}>
                                                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                                                    Scan
                                                </Text>
                                            </PrimaryButton>
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <PrimaryButton
                                                onPress={() =>
                                                    onSubmit(group.awb_numbers, group.scanType, groupIndex)
                                                }
                                                disabled={loadingGroups[groupIndex]}
                                            >
                                                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                                                    {loadingGroups[groupIndex]
                                                        ? "Submitting..."
                                                        : "Submit"}
                                                </Text>
                                            </PrimaryButton>
                                        </View>
                                    </View> */}


                                    <View
                                        style={{
                                            marginTop: 16,
                                            flexDirection: "row",
                                            gap: 10,
                                        }}
                                    >
                                        {/* Scan Button */}

                                        {
                                            group?.facility_id && (

                                                <Pressable
                                                    onPress={() => {
                                                        navigate("AdminScannerScreen", {
                                                            facility_id: group.facility_id,
                                                            scanType: group.scanType // Optional
                                                        })
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        height: 50,
                                                        backgroundColor: "#10B981",
                                                        borderRadius: 10,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#FFFFFF",
                                                            fontWeight: "700",
                                                            fontSize: 15,
                                                        }}
                                                    >
                                                        Continue
                                                    </Text>
                                                </Pressable>
                                            )
                                        }

                                        {/* Submit Button */}
                                        <Pressable
                                            onPress={() =>
                                                onSubmit(group.awb_numbers, group.scanType, groupIndex, group.facility_id)
                                            }
                                            disabled={loadingGroups[groupIndex]}
                                            style={{
                                                flex: 1,
                                                height: 50,
                                                backgroundColor: loadingGroups[groupIndex]
                                                    ? "#94A3B8"
                                                    : "#0446DB",
                                                borderRadius: 10,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                opacity: loadingGroups[groupIndex] ? 0.7 : 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#FFFFFF",
                                                    fontWeight: "700",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {loadingGroups[groupIndex]
                                                    ? "Submitting..."
                                                    : "Submit"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    <View style={styles.warningBox}>
                        <AlertTriangle size={18} color={WARNING} />
                        <Text style={styles.warningText}>
                            Each scan type group can be submitted separately. Once submitted, the group will be removed from the list.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}