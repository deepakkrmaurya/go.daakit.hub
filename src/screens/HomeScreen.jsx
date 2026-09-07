import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, ActivityIndicator, StatusBar, RefreshControl } from 'react-native'
import Header from '../global/Header'
import { Clock4, CheckCircle2, Rocket, Package, Filter, Calendar } from 'lucide-react-native'
import { useScrollToTop } from '@react-navigation/native'
import axiosInstance from '../helper/AxioInstance'
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import { getItem } from '../helper/Storage'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef(null)
  const hub = getItem("hub");

  const userData = hub ? JSON.parse(hub) : null;
  useScrollToTop(scrollRef)

  const [scanCount, setScanCount] = useState(null)
  const [pendingPickup, setPendingPickup] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [facilityList, setFacilityList] = useState([])
  const [selectedFacility, setSelectedFacility] = useState('')

  // Get today's date and last month's date
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const formatDate = (date) => {
    if (!date) return "dd-mm-yyyy";
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getData = async () => {
    setLoading(true);
    try {
      // Prepare params for API
      const params = {
        start_date: startDate ? formatDateForAPI(startDate) : "",
        end_date: endDate ? formatDateForAPI(endDate) : "",
        facility_id: selectedFacility || ""
      };





      console.log("API Params:", params);

      const res = await axiosInstance.get('/hub/getHubDashboardData', {
        params: params
      })

      console.log(res.data)
      setScanCount(res.data.scan_counts)
      setPendingPickup(res.data.pending_pickups)

      // Apply client-side filters if needed
      applyFilters(res.data.pending_pickups, startDate, endDate, selectedFacility);

    } catch (error) {
      console.log(error.response?.data || error.message)
    } finally {
      setLoading(false);
    }
  }

  // Apply all filters (date + facility)
  const applyFilters = (data, start, end, facilityId) => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let filtered = [...data];

    // Apply facility filter
    if (facilityId && facilityId !== '') {
      filtered = filtered.filter(item =>
        item.facility_id && String(item.facility_id) === String(facilityId)
      );
    }

    // Apply date filter
    if (start || end) {
      const startTime = start ? new Date(start).setHours(0, 0, 0, 0) : null;
      const endTime = end ? new Date(end).setHours(23, 59, 59, 999) : null;

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at || item.date || item.pickup_date);
        const itemTime = itemDate.setHours(0, 0, 0, 0);

        if (startTime && endTime) {
          return itemTime >= startTime && itemTime <= endTime;
        } else if (startTime) {
          return itemTime >= startTime;
        } else if (endTime) {
          return itemTime <= endTime;
        }
        return true;
      });
    }

    setFilteredData(filtered);
  };

  // Handle filter application
  const handleApplyFilter = () => {
    setVisible(false);
    // Fetch data with new filters
    getData();
  };

  // Handle reset filter
  const handleResetFilter = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    setStartDate(lastMonth);
    setEndDate(today);
    setSelectedFacility('');
    setVisible(false);
    // Fetch data with reset filters
    getData();
  };

  const getFacility = async () => {
    try {
      const res = await axiosInstance.get("/hub/getPickupFacilityList");
      console.log(res.data.data)
      setFacilityList(res.data.data || []);
    } catch (error) {
      console.log("Facility error:", error);
    }
  };

  useEffect(() => {
    getData();
    if (userData.hub_role === 'admin') {

      getFacility();
    }
  }, []);

  // Update count cards based on filtered data
  const getFilteredCounts = () => {
    const pending = filteredData.filter(item =>
      item.status === 'pending' || item.status === 'PENDING'
    ).length;
    const picked = filteredData.filter(item =>
      item.status === 'picked' || item.status === 'PICKED' || item.status === 'PICKUP'
    ).length;
    const dispatched = filteredData.filter(item =>
      item.status === 'dispatched' || item.status === 'DISPATCHED'
    ).length;
    const received = filteredData.filter(item =>
      item.status === 'received' || item.status === 'RECEIVED'
    ).length;

    return { pending, picked, dispatched, received };
  };

  const counts = getFilteredCounts();

  // Get selected facility name for display
  const selectedFacilityName = facilityList.find(
    item => String(item.id) === String(selectedFacility)
  )?.facility_name || 'All Facilities';

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#0446DB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#0446DB" />

      <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
        <Header title="Home" showBack={false} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0446DB"]}   // Android
              tintColor={"#0446DB"}  // iOS
            />
          }
        >
          <View className="mt-0 bg-white px-4 py-5">
            {/* Filter Button */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Welcome Back 👋
                </Text>

                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: 0.5,
                  }}
                >
                  Dashboard
                </Text>
              </View>

              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#0446DB",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 16,
                  gap: 8,
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                }}
                onPress={() => setVisible(true)}
              >
                <Filter size={18} color="#FFFFFF" />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Filter
                </Text>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-between">
              <View className="mb-3 w-[48%] rounded-3xl bg-amber-100 px-4 py-4">
                <View className="flex-row items-start justify-between">
                  <View>
                    <View className="mb-3 h-10 w-10 items-center justify-center rounded-2xl bg-amber-200">
                      <Clock4 size={20} color="#92400E" />
                    </View>
                    <Text className="text-sm font-medium text-amber-800">Pending Pickup</Text>
                  </View>
                  <Text className="text-3xl font-bold text-amber-900">{scanCount?.pending || 0}</Text>
                </View>
              </View>

              <View className="mb-3 w-[48%] rounded-3xl bg-sky-100 px-4 py-4">
                <View className="flex-row items-start justify-between">
                  <View>
                    <View className="mb-3 h-10 w-10 items-center justify-center rounded-2xl bg-sky-200">
                      <CheckCircle2 size={20} color="#075985" />
                    </View>
                    <Text className="text-sm font-medium text-sky-800">Picked</Text>
                  </View>
                  <Text className="text-3xl font-bold text-sky-900">{scanCount?.pickup_scan_count || 0}</Text>
                </View>
              </View>

              <View className="mb-3 w-[48%] rounded-3xl bg-fuchsia-100 px-4 py-4">
                <View className="flex-row items-start justify-between">
                  <View>
                    <View className="mb-3 h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-200">
                      <Rocket size={20} color="#9333EA" />
                    </View>
                    <Text className="text-sm font-medium text-fuchsia-800">Dispatched</Text>
                  </View>
                  <Text className="text-3xl font-bold text-fuchsia-900">{scanCount?.out_scan_count || 0}</Text>
                </View>
              </View>

              <View className="mb-3 w-[48%] rounded-3xl bg-emerald-100 px-4 py-4">
                <View className="flex-row items-start justify-between">
                  <View>
                    <View className="mb-3 h-10 w-10 items-center justify-center rounded-2xl bg-emerald-200">
                      <Package size={20} color="#047857" />
                    </View>
                    <Text className="text-sm font-medium text-emerald-800">Received</Text>
                  </View>
                  <Text className="text-3xl font-bold text-emerald-900">{scanCount?.in_scan_count || 0}</Text>
                </View>
              </View>
            </View>

            {/* Filter Modal */}
            <Modal
              isVisible={visible}
              onBackdropPress={() => setVisible(false)}
              animationIn="zoomIn"
              animationOut="zoomOut"
              backdropOpacity={0.5}
              useNativeDriver={true}
            >
              <View style={styles.modalContainer}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.modalTitle}>Filter</Text>

                  {/* Facility Filter */}
                  {
                    userData.hub_role === 'admin' && (
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
                    )
                  }


                  {/* Start Date */}
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Start Date</Text>
                  <Pressable
                    onPress={() => setShowStart(true)}
                    style={styles.datePickerBtn}
                  >
                    <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
                  </Pressable>

                  {/* End Date */}
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>End Date</Text>
                  <Pressable
                    onPress={() => setShowEnd(true)}
                    style={styles.datePickerBtn}
                  >
                    <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
                  </Pressable>

                  {/* Start Date Picker */}
                  {showStart && (
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStart(false);
                        if (selectedDate) {
                          setStartDate(selectedDate);
                        }
                      }}
                    />
                  )}

                  {/* End Date Picker */}
                  {showEnd && (
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEnd(false);
                        if (selectedDate) {
                          setEndDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalBtn, styles.resetBtn]}
                    onPress={handleResetFilter}
                  >
                    <Text style={styles.resetBtnText}>Reset</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalBtn, styles.applyBtn]}
                    onPress={handleApplyFilter}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>




            {loading ? (
              <View style={{ paddingVertical: 30 }}>
                <ActivityIndicator size="large" color="#0446DB" />
              </View>
            ) : (
              userData.hub_role === 'vendor' && (

                <FlatList
                  data={pendingPickup}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                      <View>
                        <Text style={styles.listTitle}>
                          Recent Shipments ({pendingPickup?.length})
                        </Text>

                      </View>
                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                      <Package size={48} color="#CBD5E1" />
                      <Text style={styles.emptyText}>No shipments found</Text>
                      <Text style={styles.emptySubText}>Try adjusting your filters</Text>
                    </View>
                  )}
                  renderItem={({ item, index }) => (
                    <View style={styles.shipmentCard}>
                      <View style={styles.cardHeader}>
                        <View style={[
                          styles.iconContainer,
                          { backgroundColor: item.status === "picked" || item.status === "PICKED" || item.status === "PICKUP" ? "#DCFCE7" : "#FEF3C7" }
                        ]}>
                          <Package
                            size={22}
                            color={item.status === "picked" || item.status === "PICKED" || item.status === "PICKUP" ? "#16A34A" : "#D97706"}
                          />
                        </View>

                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: item.status === "picked" || item.status === "PICKED" || item.status === "PICKUP" ? "#DCFCE7" : "#FEF3C7" }
                        ]}>
                          <Text style={[
                            styles.statusText,
                            { color: item.status === "picked" || item.status === "PICKED" || item.status === "PICKUP" ? "#15803D" : "#B45309" }
                          ]}>
                            {item.status || "Pending"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.awbLabel}>AWB NUMBER</Text>
                      <Text style={styles.awbValue}>{item.awb_number || "N/A"}</Text>

                      {/* Facility Info */}
                      {item.facility_name && (
                        <View style={styles.facilityRow}>
                          <Text style={styles.facilityLabel}>Facility:</Text>
                          <Text style={styles.facilityName}>{item.facility_name}</Text>
                        </View>
                      )}

                      <View style={styles.divider} />

                      <View style={styles.cardFooter}>
                        <View>
                          <Text style={styles.footerLabel}>STAGE</Text>
                          <Text style={styles.footerValue}>{item.pickup_stage || "Not Started"}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              )
            )}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
  },

  filterBtn: {
    backgroundColor: "#0446DB",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },

  filterBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

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

  listHeader: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  filterInfo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },

  shipmentCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 1,
    marginBottom: 12,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontWeight: "700",
    textTransform: "capitalize",
  },

  awbLabel: {
    marginTop: 16,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },

  awbValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },

  facilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  facilityLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 6,
  },

  facilityName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },

  footerValue: {
    marginTop: 4,
    color: "#0F172A",
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },

  emptySubText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },
});