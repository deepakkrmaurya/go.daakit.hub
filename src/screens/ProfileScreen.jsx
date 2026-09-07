import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
    Building2,
    Hash,
    LogOut,
    MapPin,
    ShieldCheck,
    UserCircle,
} from "lucide-react-native";
import Header from "../global/Header";
import { getItem, logout, removeItem } from "../helper/Storage";
import { resetAndNavigate } from "../utils/NavigationUtils";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserProfile() {
    const hub = getItem("hub");

    const userData = hub ? JSON.parse(hub) : null;

    const user = {
        name: userData?.hub_name || "",
        hubCode: userData?.hub_code || "",
        hubType: userData?.hub_type || "",
        location: `${userData?.city || ""}, ${userData?.state || ""}`,
    };

    const insets = useSafeAreaInsets();

    console.log(user);

    const info = [
        {
            label: "Hub Name",
            value: user.name,
            Icon: Building2,
            box: "bg-[#F4F0FF]",
            iconBox: "bg-[#E7DDFF]",
            iconColor: "#5B4DFF",
        },
        {
            label: "Hub Code",
            value: user.hubCode,
            Icon: Hash,
            box: "bg-[#EAFBFF]",
            iconBox: "bg-[#CFF4FF]",
            iconColor: "#0EA5E9",
        },
        {
            label: "Hub Type",
            value: user.hubType,
            iconText: "TYPE",
            box: "bg-[#FFF1FA]",
            iconBox: "bg-[#F8D7FF]",
            iconColor: "#B400FF",
        },
        {
            label: "Location",
            value: user.location,
            Icon: MapPin,
            box: "bg-[#EFFFF8]",
            iconBox: "bg-[#A7F3D0]",
            iconColor: "#10B981",
        },
    ];

    const Logout = () => {
        logout()
        removeItem('token')
        removeItem('hub')
        resetAndNavigate('Login')
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0446DB" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#0446DB" />

            <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
                <Header title="Profile" showBack={true} />

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="h-[76px] " />

                    <View className="bg-white pb-8 shadow-lg">
                        <View className="-mt-[54px] items-center">
                            <View className="relative h-[108px] w-[108px] items-center justify-center rounded-2xl border-[7px] border-white bg-[#EEEAFE] shadow-2xl">
                                <UserCircle size={72} color="#0446DB" />

                                <View className="absolute -right-2 bottom-2 h-8 w-8 items-center justify-center rounded-full border-[4px] border-white bg-emerald-500">
                                    <ShieldCheck size={15} color="#FFFFFF" />
                                </View>
                            </View>
                        </View>

                        <View className="items-center pt-4">
                            <Text className="text-xl font-black text-slate-950">
                                {user.name}
                            </Text>

                            <View className="mt-3 flex-row items-center gap-2">
                                <Text className="overflow-hidden rounded-full bg-blue-500 px-3 py-1 text-[11px] font-black text-white">
                                    {user.hubType}
                                </Text>
                                <Text className="text-slate-400">•</Text>
                                <Text className="text-[13px] font-semibold text-slate-600">
                                    Code: {user.hubCode}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="mx-3 mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <View className="mb-6 flex-row items-center gap-2">
                            <Building2 size={20} color="#584BC4" />
                            <Text className="text-lg font-black text-slate-950">
                                Hub Information
                            </Text>
                        </View>

                        <View className="gap-4">
                            {info.map((item) => {
                                const Icon = item.Icon;

                                return (
                                    <View
                                        key={item.label}
                                        className={`min-h-[68px] flex-row items-center gap-4 rounded-2xl px-4 ${item.box}`}
                                    >
                                        <View
                                            className={`h-11 w-11 items-center justify-center rounded-xl ${item.iconBox}`}
                                        >
                                            {item.iconText ? (
                                                <Text
                                                    style={{ color: item.iconColor }}
                                                    className="text-[11px] font-black"
                                                >
                                                    {item.iconText}
                                                </Text>
                                            ) : (
                                                <Icon size={20} color={item.iconColor} />
                                            )}
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-xs font-semibold text-slate-500">
                                                {item.label}
                                            </Text>
                                            <Text className="mt-1 text-sm font-black text-slate-950">
                                                {item.value}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <View className="my-6 h-px bg-slate-100" />

                        <TouchableOpacity
                            onPress={Logout}
                            activeOpacity={0.85}
                            className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-rose-600 shadow-lg"
                        >
                            <LogOut size={16} color="#FFFFFF" />
                            <Text className="text-sm font-black text-white">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}