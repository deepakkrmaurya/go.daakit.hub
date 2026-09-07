
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "@react-native-community/blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import {
  ClipboardList,
  Home,
  Package,
  User,
  Settings,
  LogOut,
  ChevronRight,
  MoreHorizontal,
  X,
  QrCode,
  ScanLine,
  Barcode,
  PackageCheck,
  History,
} from "lucide-react-native";
import { push, resetAndNavigate } from '../utils/NavigationUtils'
import HistoryScreen from "../screens/History";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScannerScreen from "../screens/scanner/Scanner";
import AdminScannerScreen from "../screens/scanner/AdminScanner";
import ManifestScreen from "../screens/ManifestScreen";
import { DrawerActions } from "@react-navigation/native";
import { getItem, logout, removeItem } from "../helper/Storage";
const Tab = createBottomTabNavigator();

const BAR_MARGIN = 16;
const BAR_PADDING = 8;
const BAR_HEIGHT = 72;

const ANDROID_RIPPLE = {
  borderless: true,
  color: "rgba(255,255,255,0.12)",
};

// const TAB_META = {
//   Home: { label: "Home", Icon: Home },
//   Inventory: { label: "Stock", Icon: Package },
//   History: { label: "History", Icon: ClipboardList },
//   More: { label: "More", Icon: MoreHorizontal },
// };

const TAB_META = {
  Home: { label: "Home", Icon: Home },

  Pickup: { label: "Pickup", Icon: ScanLine },

  Out: { label: "Out", Icon: ScanLine },

  Receive: { label: "Receive", Icon: ScanLine },

  More: { label: "More", Icon: MoreHorizontal },
};

const InventoryScreen = () => (
  <View style={styles.centerScreen}>
    <Text style={styles.screenTitle}>Inventory</Text>
  </View>
);

const EmptyScreen = () => null;

function TabBarItem({
  Icon,
  focused,
  label,
  onLongPress,
  onPress,
  options,
  tabWidth,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={ANDROID_RIPPLE}
      style={[styles.tabItem, { width: tabWidth }]}
    >
      <View style={styles.tabContent}>
        <Icon
          size={22}
          strokeWidth={focused ? 2.7 : 2.2}
          color={focused ? "#0446DB" : "#FFFFFF"}
        />

        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            focused ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function MoreDrawerModal({ visible, onClose, navigation }) {
  const hub = getItem('hub')
  const data = JSON.parse(hub)
  // console.log(data)
  // if (data.hub_role === 'vendor') {
  //   console.log(data)
  //   return 
  // }
  const handleProfile = () => {
    push('Profile')
    onClose();
  };

  const handleManifest = () => {
    push("Manifest")
    onClose();
  };
  const handleManifestDas = () => {
    push("ManifestDash")
    onClose();
  };
  const handleHistory = () => {
    push("History")
    onClose();
  };

  const handleLogout = () => {
    logout()
    removeItem('token')
    removeItem('hub')
    resetAndNavigate('Login')
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="left"
      onSwipeComplete={onClose}
      swipeThreshold={60}
      panResponderThreshold={6}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      animationInTiming={420}
      animationOutTiming={360}
      backdropTransitionInTiming={420}
      backdropTransitionOutTiming={360}
      backdropOpacity={0.42}
      useNativeDriver={false}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={false}
      statusBarTranslucent={true}
      style={styles.drawerModal}
    >
      <View style={styles.drawerCard}>
        <View style={styles.drawerTop}>
          <Text style={styles.drawerTopTitle}>

            <View style={styles.drawerHeader}>
              <View style={styles.avatarBox}>
                <User size={26} color="#0446DB" />
              </View>

              {/* <View>
                <Text style={styles.drawerTitle}>More</Text>
                <Text style={styles.drawerSubTitle}>Account options</Text>
              </View> */}
              <View>
                <Text style={styles.drawerTitle}>
                  {data?.hub_name || data?.name || "Dashboard"}
                </Text>

                <Text style={styles.drawerSubTitle}>
                  {data?.hub_role || "Account options"}
                </Text>
              </View>
            </View>
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onClose}
            style={styles.closeBtn}
          >
            <X size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>



        {/* <TouchableOpacity activeOpacity={0.75} style={styles.drawerRow} onPress={handleManifest}>
          <View style={styles.rowLeft}>
            <Settings size={20} color="#0446DB" />
            <Text style={styles.rowText}>Manifest</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity> */}
        <View style={{ marginTop: 20 }}>
          {
            data.hub_role === 'admin' && (

              <TouchableOpacity activeOpacity={0.75} style={styles.drawerRow} onPress={handleManifestDas}>
                <View style={styles.rowLeft}>
                  <ClipboardList size={20} color="#0446DB" />
                  <Text style={styles.rowText}>Manifest</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            )
          }

          <TouchableOpacity activeOpacity={0.75} style={styles.drawerRow} onPress={handleHistory}>
            <View style={styles.rowLeft}>
              <History size={20} color="#0446DB" />
              <Text style={styles.rowText}>History</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.75} style={styles.drawerRow} onPress={() => {
            push("VendorReviewAwbScreen")
            // if (data.hub_role === 'vendor') {
            // } else {

            //   push("ReviewAwbScreen")
            // }
            onClose();
          }}>
            <View style={styles.rowLeft}>
              <PackageCheck size={20} color="#0446DB" />
              <Text style={styles.rowText}>Scanned Awb</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.75} style={styles.drawerRow} onPress={handleProfile}>
            <View style={styles.rowLeft}>
              <User size={20} color="#0446DB" />
              <Text style={styles.rowText}>Profile</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.drawerRow, styles.drawerRowLast]}
            onPress={handleLogout}
          >
            <View style={styles.rowLeft}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function CustomTabBar({ state, descriptors, navigation, openMoreModal }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [visualIndex, setVisualIndex] = useState(state.index);
  const indicatorIndex = useRef(new Animated.Value(state.index)).current;

  const tabWidth = useMemo(() => {
    const barWidth = width - BAR_MARGIN * 2;
    return (barWidth - BAR_PADDING * 2) / state.routes.length;
  }, [state.routes.length, width]);

  const moveToIndex = useCallback(
    index => {
      Animated.timing(indicatorIndex, {
        toValue: index,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [indicatorIndex]
  );

  useEffect(() => {
    setVisualIndex(state.index);
    moveToIndex(state.index);
  }, [moveToIndex, state.index]);

  const translateX = indicatorIndex.interpolate({
    inputRange: state.routes.map((_, index) => index),
    outputRange: state.routes.map((_, index) => index * tabWidth),
  });

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabBarOuter,
        {
          left: BAR_MARGIN,
          right: BAR_MARGIN,
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.glassWrapper}>
        <BlurView
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
          blurType={Platform.OS === "ios" ? "dark" : "light"}
          blurAmount={Platform.OS === "ios" ? 28 : 12}
          blurRadius={Platform.OS === "android" ? 16 : undefined}
          downsampleFactor={8}
          overlayColor="rgba(4,70,219,0.72)"
          reducedTransparencyFallbackColor="#0446DB"
        />

        <View pointerEvents="none" style={styles.glassOverlay} />

        <View style={styles.tabsContainer}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePill,
              {
                width: tabWidth,
                transform: [{ translateX }],
              },
            ]}
          />

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const meta = TAB_META[route.name];

            const Icon = meta?.Icon ?? Home;
            const label = options.tabBarLabel ?? options.title ?? meta?.label ?? route.name;
            const focused = visualIndex === index;

            const onPress = () => {
              if (route.name === "More") {
                openMoreModal();
                return;
              }

              setVisualIndex(index);
              moveToIndex(index);

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                setVisualIndex(state.index);
                moveToIndex(state.index);
                return;
              }

              if (state.index !== index) {
                navigation.jumpTo(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TabBarItem
                key={route.key}
                Icon={Icon}
                focused={focused}
                label={label}
                onLongPress={onLongPress}
                onPress={onPress}
                options={options}
                tabWidth={tabWidth}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function BottomTabs() {
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const hub = getItem('hub')
  const data = JSON.parse(hub)
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={props => (
          <CustomTabBar
            {...props}
            openMoreModal={() => setMoreModalVisible(true)}
          />
        )}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />



        {
          data.hub_role === 'vendor' ? (
            <Tab.Screen
              name="Pickup"
              component={ScannerScreen}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();

                  navigation.navigate("ScannerScreen", {
                    scanType: "Pickup",
                  });
                },
              })}
            />
          ) : (

            <Tab.Screen
              name="Pickup"
              component={AdminScannerScreen}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();

                  navigation.getParent()?.navigate("AdminScannerScreen", {
                    scanType: "Pickup",
                  });
                },
              })}
            />
          )
        }


        <Tab.Screen
          name="Out"
          component={ScannerScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();

              navigation.navigate("ScannerScreen", {
                scanType: "Out",
              });
            },
          })}
        />
        <Tab.Screen
          name="Receive"
          component={ScannerScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();

              navigation.navigate("ScannerScreen", {
                scanType: "Receive",
              });
            },
          })}
        />

        {/* <Tab.Screen name="History" component={HistoryScreen} /> */}
        <Tab.Screen name="More" component={EmptyScreen} />
        {/* <Tab.Screen name="Moree" component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.dispatch(DrawerActions.openDrawer());
            },
          })}
        /> */}
      </Tab.Navigator>

      <MoreDrawerModal
        visible={moreModalVisible}
        onClose={() => setMoreModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },

  tabBarOuter: {
    position: "absolute",
    height: BAR_HEIGHT,
    elevation: 18,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  glassWrapper: {
    flex: 1,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "#0446DB",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(4,70,219,0.82)"
        : "rgba(4,70,219,0.55)",
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: BAR_PADDING,
  },
  activePill: {
    position: "absolute",
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    left: BAR_PADDING,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
  },
  tabItem: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    marginTop: 3,
    maxWidth: 70,
    fontSize: 10,
    fontWeight: "800",
    includeFontPadding: false,
    textAlign: "center",
  },
  tabLabelActive: {
    color: "#0446DB",
  },
  tabLabelInactive: {
    color: "#FFFFFF",
  },

  drawerModal: {
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  drawerCard: {
    width: "80%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: {
      width: 10,
      height: 0,
    },
    elevation: 30,
  },
  drawerTop: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerTopTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 28,
  },
  avatarBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  drawerSubTitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  drawerRow: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  drawerRowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
  },
});