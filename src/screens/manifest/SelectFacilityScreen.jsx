
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
    CalendarDays,
    ShieldCheck,
} from "lucide-react-native";

import { RIDER } from "../../data/mockData";
import { MUTED, PRIMARY, TEXT, styles } from "../../styles/pickupStyles";
import PrimaryButton from "../../components/PrimaryButton";
import axiosInstance from "../../helper/AxioInstance";
import { getItem } from "../../helper/Storage";


export default function SelectFacilityScreen({ onStart, setFacility }) {
    const [facilityId, setFacilityId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const hub = getItem('hub')
    const data = JSON.parse(hub)
    console.log(data)
    const getFacility = async () => {
        try {
            const res = await axiosInstance.get("/hub/getPickupFacilityList");
            setFacilityList(res.data.data || []);
        } catch (error) {
            console.log("Facility error:", error);
        }
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };

    const indiaDate = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata'
    });

    console.log(indiaDate);





    useEffect(() => {
        getFacility()
    }, [])

    useEffect(() => {
        setFacility({
            facility_id: facilityId,
            date: indiaDate
        })
    }, [facilityId])



    return (
        <>
            <ScrollView
                style={styles.screen}
                contentContainerStyle={{ paddingBottom: 28 }}
            >
                
                <View style={styles.hero}>
                    <View style={styles.heroTop}>
                        <View style={styles.logoWhite}>
                            <Text style={{ fontWeight: "900", color: PRIMARY }}> {data?.hub_name?.charAt(0).toUpperCase()}</Text>
                        </View>

                        <View>
                            {/* <Text style={styles.overlineLight}>Daakit Rider</Text> */}
                            <Text style={styles.heroName}>
                                Hey, {data?.hub_name} 👋
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>Generate Manifest</Text>
                    <Text style={styles.heroSub}>
                        Select facility and date to generate manifest.
                    </Text>
                </View>

                <View style={styles.padding}>
                    <View style={localStyles.filterCard}

                    >
                        <Text style={localStyles.label}>Select Facility</Text>

                        <View style={localStyles.pickerBox}>
                            <Picker
                                selectedValue={facilityId}
                                onValueChange={(value) => setFacilityId(value)}
                                style={localStyles.picker}
                            >
                                <Picker.Item label="Select Facility" value="" />

                                {facilityList?.map((facility) => (
                                    <Picker.Item
                                        key={facility.id}
                                        label={`${facility.facility_name} (${facility.facility_code})`}
                                        value={String(facility.id)}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            {/* <Text style={[localStyles.label, { marginTop: 16 }]}>
                                Select Date
                            </Text>

                            <Pressable
                                onPress={() => setShowDatePicker(true)}
                                style={localStyles.dateBox}
                            >
                                <CalendarDays size={18} color={MUTED} />

                                <Text
                                    style={[
                                        localStyles.dateText,
                                        {
                                            color: selectedDate ? TEXT : MUTED,
                                        },
                                    ]}
                                >
                                    {selectedDate || "Select Date"}
                                </Text>
                            </Pressable> */}
                        </View>
                        <View
                         style={
                            [styles.bottomBar, {
                            marginBottom: 8}]
                            }

                        >
                            <PrimaryButton
                                onPress={onStart}
                            >
                                Submit
                            </PrimaryButton>
                        </View>

                    </View>

                    {/* Existing Commented Code Yahin Rehne Do */}
                </View>
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                            setSelectedDate(formatDate(date));
                        }
                    }}
                />
            )}


        </>
    );
}

const localStyles = {
    filterCard: {
        height: 180,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",

    },

    label: {
        color: "#111827",
        fontSize: 13,
        fontWeight: "900",
        marginBottom: 8,
    },

    pickerBox: {
        height: 56,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        overflow: "hidden",
        justifyContent: "center",
    },

    picker: {
        width: "100%",
        color: "#111827",
    },

    dateBox: {
        height: 56,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    dateText: {
        fontSize: 14,
        fontWeight: "700",
    },
};