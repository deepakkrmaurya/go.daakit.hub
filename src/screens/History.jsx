
import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  Pressable,
  StatusBar,
} from "react-native";
import Header from "../global/Header";
import {
  SlidersHorizontal,
  Search,
  PackageCheck,
  Truck,
  Inbox,
  ChevronRight,
  CalendarDays,
  X,
  ChevronDown,
  ChevronLeft,
  Filter,
} from "lucide-react-native";
import { useScrollToTop, useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import axiosInstance from "../helper/AxioInstance";
import { getItem } from '../helper/Storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

const SCAN_TYPE_OPTIONS = ["All Types", "IN_SCAN", "PICKUP_SCAN", "OUT_SCAN"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseDateInput = (value) => {
  if (!value) return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return date;
};

const parseHistoryDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateForAPI = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "dd-mm-yyyy";
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const buildCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyDays = Array.from({ length: firstDay }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  return [...emptyDays, ...monthDays];
};

const scanMeta = {
  PICKUP_SCAN: {
    label: "Pickup",
    Icon: PackageCheck,
    color: "#EA580C",
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
  OUT_SCAN: {
    label: "Dispatch",
    Icon: Truck,
    color: "#0446DB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  IN_SCAN: {
    label: "Received",
    Icon: Inbox,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
};



const FilterChip = ({ title, active, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className={`mr-2 rounded-full border px-4 py-2 ${active ? "border-[#0446DB] bg-[#0446DB]" : "border-slate-200 bg-white"}`}
  >
    <Text className={`text-xs font-bold ${active ? "text-white" : "text-slate-600"}`}>
      {title}
    </Text>
  </TouchableOpacity>
);

const DatePickerModal = ({
  isVisible,
  monthDate,
  selectedValue,
  title,
  onClose,
  onMonthChange,
  onSelectDate,
}) => {
  const selectedDate = parseDateInput(selectedValue);
  const calendarDays = buildCalendarDays(monthDate);
  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.datePickerModal}
    >
      <View className="rounded-2xl bg-white p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-900">{title}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full"
          >
            <X size={19} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onMonthChange(-1)}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
          >
            <ChevronLeft size={18} color="#334155" />
          </TouchableOpacity>

          <Text className="text-sm font-bold text-slate-900">
            {MONTH_NAMES[month]} {year}
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onMonthChange(1)}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
          >
            <ChevronRight size={18} color="#334155" />
          </TouchableOpacity>
        </View>

        <View className="mb-2 flex-row">
          {WEEK_DAYS.map((day) => (
            <Text key={day} className="flex-1 text-center text-[11px] font-bold text-slate-400">
              {day}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) => {
            const isSelected =
              selectedDate &&
              day &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            return (
              <TouchableOpacity
                key={`${day || "empty"}-${index}`}
                disabled={!day}
                activeOpacity={0.8}
                onPress={() => onSelectDate(new Date(year, month, day))}
                style={styles.calendarDay}
                className="items-center justify-center"
              >
                {day ? (
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-full ${isSelected ? "bg-[#1D5BFF]" : "bg-white"}`}
                  >
                    <Text className={`text-sm ${isSelected ? "font-bold text-white" : "font-medium text-slate-800"}`}>
                      {day}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const HistoryCard = ({ item }) => {
  const meta = scanMeta[item.scan_type] || scanMeta.PICKUP_SCAN;
  const Icon = meta.Icon;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className="mb-3 overflow-hidden rounded-3xl border border-slate-100 bg-white"
      style={styles.shadow}
    >
      <View className="p-4">
        <View className="flex-row items-start">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl border"
            style={{ backgroundColor: meta.bg, borderColor: meta.border }}
          >
            <Icon size={22} color={meta.color} strokeWidth={2.7} />
          </View>

          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                AWB Number
              </Text>

              <View
                className="rounded-full border px-3 py-1"
                style={{ backgroundColor: meta.bg, borderColor: meta.border }}
              >
                <Text className="text-[11px] font-black" style={{ color: meta.color }}>
                  {meta.label}
                </Text>
              </View>
            </View>

            <Text className="mt-1 text-base font-black text-slate-950">
              {item.awb_number}
            </Text>

            <Text
              className="mt-2 text-[13px] font-medium leading-5 text-slate-500"
              numberOfLines={2}
            >
              {item.remarks || item.scan_type}
            </Text>
          </View>
        </View>

        <View className="mt-4 h-[1px] bg-slate-100" />

        <View className="mt-4 flex-row items-center">
          <View className="flex-[1.4] flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
              <CalendarDays size={15} color="#64748B" />
            </View>
            <View className="ml-2">
              <Text className="text-[10px] font-bold uppercase text-slate-400">
                Scan Time
              </Text>
              <Text className="text-xs font-black text-slate-800">
                {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
              </Text>
            </View>
          </View>

          {/* <ChevronRight size={18} color="#94A3B8" /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Get user data
  const userData = JSON.parse(getItem('hub') || '{}');
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');

  // Get today's date and last month's date
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);
  const [awbNumber, setAwbNumber] = useState("");
  const [scanType, setScanType] = useState("All Types");
  const [showScanTypes, setShowScanTypes] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [pickerMonth, setPickerMonth] = useState(new Date());
  const listRef = useRef(null);
  useScrollToTop(listRef);

  // No need for client-side filtering - API does all filtering
  const displayData = history;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openDatePicker = (target) => {
    const selectedDate = target === "start" ? startDate : endDate;
    setShowScanTypes(false);
    setPickerMonth(selectedDate || new Date());
    setDatePickerTarget(target);
  };

  const changePickerMonth = (direction) => {
    setPickerMonth((current) => {
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  };

  const selectDate = (date) => {
    if (datePickerTarget === "start") {
      setStartDate(date);
    }
    if (datePickerTarget === "end") {
      setEndDate(date);
    }
    setDatePickerTarget(null);
  };

  const applyAdvancedFilters = () => {
    setSearch(awbNumber.trim());
    setActiveFilter(scanType === "All Types" ? "All" : scanType);
    setShowScanTypes(false);
    setModalVisible(false);
    getHistory();
  };

  const clearAdvancedFilters = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    setStartDate(lastMonth);
    setEndDate(today);
    setAwbNumber("");
    setScanType("All Types");
    setSelectedFacility("");
    setSearch("");
    setActiveFilter("All");
    setShowScanTypes(false);
    setDatePickerTarget(null);
    getHistory();
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      // Map activeFilter to scan_type for API
      let scanTypeParam = "";
      if (activeFilter === "Pickup") scanTypeParam = "PICKUP_SCAN";
      else if (activeFilter === "Dispatch") scanTypeParam = "OUT_SCAN";
      else if (activeFilter === "Received") scanTypeParam = "IN_SCAN";
      else if (scanType !== "All Types") scanTypeParam = scanType;

      const params = {
        start_date: startDate ? formatDateForAPI(startDate) : "",
        end_date: endDate ? formatDateForAPI(endDate) : "",
        scan_type: scanTypeParam || "",
        awb_number: search?.trim() || awbNumber?.trim() || "",
        facility_id: selectedFacility || ""
      };

      console.log("API Params:", params);

      const res = await axiosInstance.get("/hub/getScanHistory", {
        params: params
      });

      console.log("History Response:", res.data.data);
      setHistory(res.data.data || []);
    } catch (error) {
      console.log(error?.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFacility = async () => {
    try {

      const res = await axiosInstance.get("/hub/getPickupFacilityList");
      setFacilityList(res.data.data || []);
    } catch (error) {
      console.log("Facility error:", error);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Reset all filters
    setStartDate(lastMonth);
    setEndDate(today);
    setAwbNumber("");
    setSearch("");
    setScanType("All Types");
    setActiveFilter("All");
    setSelectedFacility("");
    setShowScanTypes(false);
    setDatePickerTarget(null);

    // Call API with reset values
    getHistory();
  }, []);

  // Initial load
  useEffect(() => {
    getHistory();
    if (userData?.hub_role === 'admin') {
      getFacility();
    }
  }, []);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      getHistory();
    }, [])
  );

  // Auto-search when AWB number changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (awbNumber.trim() || search.trim()) {
        getHistory();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [awbNumber, search]);

  // Get counts for stats
  const getCounts = () => {
    const total = history.length;
    const pickup = history.filter(x => x.scan_type === "PICKUP_SCAN").length;
    const dispatch = history.filter(x => x.scan_type === "OUT_SCAN").length;
    const received = history.filter(x => x.scan_type === "IN_SCAN").length;
    return { total, pickup, dispatch, received };
  };

  const counts = getCounts();

  const selectedFacilityName = facilityList.find(
    item => String(item.id) === String(selectedFacility)
  )?.facility_name || 'All Facilities';

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#0446DB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#0446DB" />

      <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
        <Header title="History" showBack={true} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            ref={listRef}
            data={displayData}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => <HistoryCard item={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#0446DB"]}
                tintColor="#0446DB"
              />
            }
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 120,
            }}
            ListHeaderComponent={
              <View>


                {/* Search and Filter */}
                <View className="mb-4 flex-row justify-end px-4">
                  {/* <Search size={18} color="#94A3B8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search AWB number..."
                placeholderTextColor="#94A3B8"
                className="h-12 flex-1 px-3 text-sm font-semibold text-slate-900"
              /> */}

                  <TouchableOpacity
                    onPress={toggleModal}
                    activeOpacity={0.85}
                    className="h-9 w-9 items-center  justify-center rounded-xl bg-[#0446DB]"
                  >
                    <SlidersHorizontal size={17} color="#fff" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>



                {/* Filter Info */}
                <View className="mb-3 flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-black text-slate-950">
                      Scan History
                    </Text>

                  </View>
                  <Text className="text-xs font-bold text-slate-400">
                    {displayData.length} Results
                  </Text>
                </View>
              </View>
            }
            ListEmptyComponent={
              loading ? (
                <View className="mt-10 items-center rounded-3xl bg-white p-10">
                  <Text className="text-base font-black text-slate-900">Loading...</Text>
                </View>
              ) : (
                <View className="mt-10 items-center rounded-3xl bg-white p-10">
                  <Search size={38} color="#CBD5E1" />
                  <Text className="mt-3 text-base font-black text-slate-900">
                    No records found
                  </Text>
                  <Text className="mt-1 text-center text-sm text-slate-500">
                    Try another AWB number or filter.
                  </Text>
                </View>
              )
            }
          />

          {/* Advanced Filter Modal */}
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
            useNativeDriver={true}
          >
            <View style={styles.modalContainer}>
              <View style={{ width: "100%" }}>
                <Text style={styles.modalTitle}>Filter</Text>

                {/* Facility Filter - Only for Admin */}
                {/* {userData?.hub_role === 'admin' && (
              <View>
                <Text style={styles.inputLabel}>Select Facility</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={selectedFacility}
                    onValueChange={(value) => {
                      setSelectedFacility(value);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Facilities" value="" />
                    {facilityList.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={`${item.facility_name} (${item.facility_code})`}
                        value={String(item.id)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )} */}

                {/* Start Date */}
                <Text style={[styles.inputLabel, { marginTop: userData?.hub_role === 'admin' ? 16 : 0 }]}>
                  Start Date
                </Text>
                <Pressable
                  onPress={() => openDatePicker("start")}
                  style={styles.datePickerBtn}
                >
                  <Text style={styles.datePickerText}>
                    {startDate ? formatDateForAPI(startDate) : "yyyy-mm-dd"}
                  </Text>
                </Pressable>

                {/* End Date */}
                <Text style={[styles.inputLabel, { marginTop: 16 }]}>End Date</Text>
                <Pressable
                  onPress={() => openDatePicker("end")}
                  style={styles.datePickerBtn}
                >
                  <Text style={styles.datePickerText}>
                    {endDate ? formatDateForAPI(endDate) : "yyyy-mm-dd"}
                  </Text>
                </Pressable>

                {/* AWB Number */}
                <Text style={[styles.inputLabel, { marginTop: 16 }]}>AWB Number</Text>
                <TextInput
                  value={awbNumber}
                  onChangeText={setAwbNumber}
                  placeholder="Enter AWB Number"
                  placeholderTextColor="#71717A"
                  style={styles.textInput}
                />

                {/* Scan Type Dropdown */}
                <Text style={[styles.inputLabel, { marginTop: 16 }]}>Scan Type</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDatePickerTarget(null);
                    setShowScanTypes(!showScanTypes);
                  }}
                  style={styles.dropdownBtn}
                >
                  <Text style={styles.dropdownText}>{scanType}</Text>
                  <ChevronDown size={18} color="#111827" />
                </TouchableOpacity>

                {showScanTypes && (
                  <View style={styles.dropdownList}>
                    {SCAN_TYPE_OPTIONS.map((option, index) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setScanType(option);
                          setShowScanTypes(false);
                        }}
                        style={[
                          styles.dropdownItem,
                          index === SCAN_TYPE_OPTIONS.length - 1 ? { borderBottomWidth: 0 } : {}
                        ]}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          scanType === option && { color: "#0446DB", fontWeight: "700" }
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalBtn, styles.resetBtn]}
                    onPress={clearAdvancedFilters}
                  >
                    <Text style={styles.resetBtnText}>Reset</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalBtn, styles.applyBtn]}
                    onPress={applyAdvancedFilters}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Date Picker Modal */}
          <DatePickerModal
            isVisible={Boolean(datePickerTarget)}
            monthDate={pickerMonth}
            selectedValue={datePickerTarget === "start" ? formatDateForAPI(startDate) : formatDateForAPI(endDate)}
            title={datePickerTarget === "start" ? "Select Start Date" : "Select End Date"}
            onClose={() => setDatePickerTarget(null)}
            onMonthChange={changePickerMonth}
            onSelectDate={selectDate}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
    // <View className="flex-1 bg-[#F8FAFC]">
    //   <Header title="History" showBack={true} />

    //   <FlatList
    //     ref={listRef}
    //     data={displayData}
    //     keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
    //     renderItem={({ item }) => <HistoryCard item={item} />}
    //     showsVerticalScrollIndicator={false}
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={refreshing}
    //         onRefresh={onRefresh}
    //         colors={["#0446DB"]}
    //         tintColor="#0446DB"
    //       />
    //     }
    //     contentContainerStyle={{
    //       padding: 16,
    //       paddingBottom: 120,
    //     }}
    //     ListHeaderComponent={
    //       <View>


    //         {/* Search and Filter */}
    //         <View className="mb-4 flex-row justify-end px-4">
    //           {/* <Search size={18} color="#94A3B8" />
    //           <TextInput
    //             value={search}
    //             onChangeText={setSearch}
    //             placeholder="Search AWB number..."
    //             placeholderTextColor="#94A3B8"
    //             className="h-12 flex-1 px-3 text-sm font-semibold text-slate-900"
    //           /> */}

    //           <TouchableOpacity
    //             onPress={toggleModal}
    //             activeOpacity={0.85}
    //             className="h-9 w-9 items-center  justify-center rounded-xl bg-[#0446DB]"
    //           >
    //             <SlidersHorizontal size={17} color="#fff" strokeWidth={2.5} />
    //           </TouchableOpacity>
    //         </View>



    //         {/* Filter Info */}
    //         <View className="mb-3 flex-row items-center justify-between">
    //           <View>
    //             <Text className="text-lg font-black text-slate-950">
    //               Scan History
    //             </Text>

    //           </View>
    //           <Text className="text-xs font-bold text-slate-400">
    //             {displayData.length} Results
    //           </Text>
    //         </View>
    //       </View>
    //     }
    //     ListEmptyComponent={
    //       loading ? (
    //         <View className="mt-10 items-center rounded-3xl bg-white p-10">
    //           <Text className="text-base font-black text-slate-900">Loading...</Text>
    //         </View>
    //       ) : (
    //         <View className="mt-10 items-center rounded-3xl bg-white p-10">
    //           <Search size={38} color="#CBD5E1" />
    //           <Text className="mt-3 text-base font-black text-slate-900">
    //             No records found
    //           </Text>
    //           <Text className="mt-1 text-center text-sm text-slate-500">
    //             Try another AWB number or filter.
    //           </Text>
    //         </View>
    //       )
    //     }
    //   />

    //   {/* Advanced Filter Modal */}
    //   <Modal
    //     isVisible={isModalVisible}
    //     onBackdropPress={() => setModalVisible(false)}
    //     animationIn="zoomIn"
    //     animationOut="zoomOut"
    //     backdropOpacity={0.5}
    //     useNativeDriver={true}
    //   >
    //     <View style={styles.modalContainer}>
    //       <View style={{ width: "100%" }}>
    //         <Text style={styles.modalTitle}>Filter</Text>

    //         {/* Facility Filter - Only for Admin */}
    //         {/* {userData?.hub_role === 'admin' && (
    //           <View>
    //             <Text style={styles.inputLabel}>Select Facility</Text>
    //             <View style={styles.pickerBox}>
    //               <Picker
    //                 selectedValue={selectedFacility}
    //                 onValueChange={(value) => {
    //                   setSelectedFacility(value);
    //                 }}
    //                 style={styles.picker}
    //               >
    //                 <Picker.Item label="All Facilities" value="" />
    //                 {facilityList.map((item) => (
    //                   <Picker.Item
    //                     key={item.id}
    //                     label={`${item.facility_name} (${item.facility_code})`}
    //                     value={String(item.id)}
    //                   />
    //                 ))}
    //               </Picker>
    //             </View>
    //           </View>
    //         )} */}

    //         {/* Start Date */}
    //         <Text style={[styles.inputLabel, { marginTop: userData?.hub_role === 'admin' ? 16 : 0 }]}>
    //           Start Date
    //         </Text>
    //         <Pressable
    //           onPress={() => openDatePicker("start")}
    //           style={styles.datePickerBtn}
    //         >
    //           <Text style={styles.datePickerText}>
    //             {startDate ? formatDateForAPI(startDate) : "yyyy-mm-dd"}
    //           </Text>
    //         </Pressable>

    //         {/* End Date */}
    //         <Text style={[styles.inputLabel, { marginTop: 16 }]}>End Date</Text>
    //         <Pressable
    //           onPress={() => openDatePicker("end")}
    //           style={styles.datePickerBtn}
    //         >
    //           <Text style={styles.datePickerText}>
    //             {endDate ? formatDateForAPI(endDate) : "yyyy-mm-dd"}
    //           </Text>
    //         </Pressable>

    //         {/* AWB Number */}
    //         <Text style={[styles.inputLabel, { marginTop: 16 }]}>AWB Number</Text>
    //         <TextInput
    //           value={awbNumber}
    //           onChangeText={setAwbNumber}
    //           placeholder="Enter AWB Number"
    //           placeholderTextColor="#71717A"
    //           style={styles.textInput}
    //         />

    //         {/* Scan Type Dropdown */}
    //         <Text style={[styles.inputLabel, { marginTop: 16 }]}>Scan Type</Text>
    //         <TouchableOpacity
    //           onPress={() => {
    //             setDatePickerTarget(null);
    //             setShowScanTypes(!showScanTypes);
    //           }}
    //           style={styles.dropdownBtn}
    //         >
    //           <Text style={styles.dropdownText}>{scanType}</Text>
    //           <ChevronDown size={18} color="#111827" />
    //         </TouchableOpacity>

    //         {showScanTypes && (
    //           <View style={styles.dropdownList}>
    //             {SCAN_TYPE_OPTIONS.map((option, index) => (
    //               <TouchableOpacity
    //                 key={option}
    //                 onPress={() => {
    //                   setScanType(option);
    //                   setShowScanTypes(false);
    //                 }}
    //                 style={[
    //                   styles.dropdownItem,
    //                   index === SCAN_TYPE_OPTIONS.length - 1 ? { borderBottomWidth: 0 } : {}
    //                 ]}
    //               >
    //                 <Text style={[
    //                   styles.dropdownItemText,
    //                   scanType === option && { color: "#0446DB", fontWeight: "700" }
    //                 ]}>
    //                   {option}
    //                 </Text>
    //               </TouchableOpacity>
    //             ))}
    //           </View>
    //         )}

    //         <View style={styles.modalButtons}>
    //           <Pressable
    //             style={[styles.modalBtn, styles.resetBtn]}
    //             onPress={clearAdvancedFilters}
    //           >
    //             <Text style={styles.resetBtnText}>Reset</Text>
    //           </Pressable>

    //           <Pressable
    //             style={[styles.modalBtn, styles.applyBtn]}
    //             onPress={applyAdvancedFilters}
    //           >
    //             <Text style={styles.applyBtnText}>Apply</Text>
    //           </Pressable>
    //         </View>
    //       </View>
    //     </View>
    //   </Modal>

    //   {/* Date Picker Modal */}
    //   <DatePickerModal
    //     isVisible={Boolean(datePickerTarget)}
    //     monthDate={pickerMonth}
    //     selectedValue={datePickerTarget === "start" ? formatDateForAPI(startDate) : formatDateForAPI(endDate)}
    //     title={datePickerTarget === "start" ? "Select Start Date" : "Select End Date"}
    //     onClose={() => setDatePickerTarget(null)}
    //     onMonthChange={changePickerMonth}
    //     onSelectDate={selectDate}
    //   />
    // </View>
  );
};

export default History;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 25,
    alignItems: "center",
    width: "100%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
    textAlign: "center",
  },

  pickerBox: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginTop: 6,
    justifyContent: "center",
    overflow: "hidden",
  },

  picker: {
    width: "100%",
    height: 56,
    color: "#111827",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },

  datePickerBtn: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },

  datePickerText: {
    fontSize: 16,
    color: "#0F172A",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 16,
    color: "#0F172A",
  },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },

  dropdownText: {
    fontSize: 16,
    color: "#0F172A",
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#0F172A",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 25,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  applyBtn: {
    backgroundColor: "#0446DB",
  },

  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resetBtn: {
    backgroundColor: "#F1F5F9",
  },

  resetBtnText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "700",
  },

  datePickerModal: {
    justifyContent: "center",
    margin: 20,
  },

  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
  },

  shadow: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
});