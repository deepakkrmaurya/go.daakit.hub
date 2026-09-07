// import React, { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Keyboard,
//   View,
// } from "react-native";
// import { ActivityIndicator } from "react-native";
// import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
// import Toast from "react-native-toast-message";
// import axiosInstance from "../helper/AxioInstance"
// import { setStorage } from "../helper/Storage";
// import { resetAndNavigate, navigate } from '../utils/NavigationUtils'
// export default function LoginScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);

//   const handleLogin = async () => {
//     if (!email?.trim()) {
//       Toast.show({
//         type: "error",
//         text1: "Email is required",
//       });
//       return;
//     }

//     if (!password?.trim()) {
//       Toast.show({
//         type: "error",
//         text1: "Password is required",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//         console.log(email,password)
//       const res = await axiosInstance.post("/hub/loginHub", {
//         username: email.trim(),
//         password: password.trim(),
//       });

//       console.log(res)

//       const data = res?.data;

//       if (data.success) {
//         setStorage("token", data.token);
//         setStorage("hub", data.hub);

//         Toast.show({
//           type: "success",
//           text1: data.message || "Login successful",
//         });

//         resetAndNavigate("Main");
//       } else {
//         Toast.show({
//           type: "error",
//           text1: data.message || "Login failed",
//         });
//       }
//     } catch (error) {
//       console.log(error)
//       Toast.show({
//         type: "error",
//         text1:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar backgroundColor="#0446DB" barStyle="light-content" />

//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <KeyboardAvoidingView
//           className="flex-1"
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <View className="flex-1 justify-center px-6">
//             {/* Logo */}
//             <View className="items-center">
//               <View className="h-24 w-24 items-center justify-center rounded-full bg-[#EEF4FF]">
//                 <Text className="text-4xl font-black text-[#0446DB]">
//                   D
//                 </Text>
//               </View>

//               <Text className="mt-6 text-3xl font-black text-slate-900">
//                 Welcome Back
//               </Text>

//               <Text className="mt-2 text-center text-base text-slate-500">
//                 Login to continue your hub operations
//               </Text>
//             </View>

//             {/* Form */}
//             <View className="mt-10 gap-5">
//               {/* Email */}
//               <View>
//                 <Text className="mb-2 text-sm font-bold text-slate-700">
//                   Email
//                 </Text>

//                 <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
//                   <Mail size={20} color="#64748B" />

//                   <TextInput
//                     value={email}
//                     onChangeText={setEmail}
//                     placeholder="Enter email or phone"
//                     placeholderTextColor="#94A3B8"
//                     autoCapitalize="none"
//                     keyboardType="email-address"
//                     className="ml-3 flex-1 text-base font-medium text-slate-900"
//                   />
//                 </View>
//               </View>

//               {/* Password */}
//               <View className="">
//                 <Text className="mb-2 text-sm font-bold text-slate-700">
//                   Password
//                 </Text>

//                 <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
//                   <Lock size={20} color="#64748B" />

//                   <TextInput
//                     value={password}
//                     onChangeText={setPassword}
//                     placeholder="Enter password"
//                     placeholderTextColor="#94A3B8"
//                     secureTextEntry={!showPass}
//                     className="ml-3 flex-1 text-base font-medium text-slate-900"
//                   />

//                   <TouchableOpacity
//                     activeOpacity={0.7}
//                     onPress={() => setShowPass(!showPass)}
//                   >
//                     {showPass ? (
//                       <EyeOff size={20} color="#64748B" />
//                     ) : (
//                       <Eye size={20} color="#64748B" />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Forgot Password */}
//               {/* <TouchableOpacity className="self-end">
//                 <Text className="font-bold text-[#0446DB]">
//                   Forgot Password?
//                 </Text>
//               </TouchableOpacity> */}
//             </View>

//             {/* Login Button */}
//             <TouchableOpacity
//               activeOpacity={0.85}
//               onPress={handleLogin}
//               disabled={loading}
//               className={`mt-6 h-14 items-center justify-center rounded-2xl ${loading ? "bg-[#0446DB]/70" : "bg-[#0446DB]"
//                 }`}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text className="text-base font-black text-white">Login</Text>
//               )}
//             </TouchableOpacity>

//             {/* Footer */}
//             <Text className="mt-10 text-center text-xs text-slate-400">
//               © 2026 Daakit Hub Controller
//             </Text>
//           </View>
//         </KeyboardAvoidingView>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }



import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import Toast from "react-native-toast-message";
import axiosInstance from "../helper/AxioInstance"
import { setStorage } from "../helper/Storage";
import { resetAndNavigate, navigate } from '../utils/NavigationUtils'
import logo from '../assets/hublogo.png'

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!email?.trim()) {
      Toast.show({
        type: "error",
        text1: "Email is required",
      });
      return;
    }

    if (!password?.trim()) {
      Toast.show({
        type: "error",
        text1: "Password is required",
      });
      return;
    }

    try {
      setLoading(true);
      console.log(email, password)
      const res = await axiosInstance.post("/hub/loginHub", {
        username: email.trim(),
        password: password.trim(),
      });

      console.log(res)

      const data = res?.data;

      if (data.success) {
        setStorage("token", data.token);
        setStorage("hub", data.hub);

        Toast.show({
          type: "success",
          text1: data.message || "Login successful",
        });

        resetAndNavigate("Main");
      } else {
        Toast.show({
          type: "error",
          text1: data.message || "Login failed",
        });
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor="#0446DB" barStyle="light-content" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : StatusBar.currentHeight || 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={{ 
              flex: 1,
              paddingHorizontal: 24,
              paddingVertical: 20,
              justifyContent: 'center',
            }}>
              {/* Logo */}
              <View style={{ alignItems: 'center' }}>
                <View style={{ 
                  height: 96, 
                  width: 96, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: 48, 
                  backgroundColor: '#EEF4FF',
                  overflow: 'hidden',
                }}>
                  <Image 
                    source={logo} 
                    style={{ 
                      height: 80, 
                      width: 80,
                      resizeMode: 'contain',
                    }}
                  />
                </View>

                <Text style={{ 
                  marginTop: 24, 
                  fontSize: 30, 
                  fontWeight: '900', 
                  color: '#0F172A' 
                }}>
                  Welcome Back
                </Text>

                <Text style={{ 
                  marginTop: 8, 
                  textAlign: 'center', 
                  fontSize: 16, 
                  color: '#64748B' 
                }}>
                  Login to continue your hub operations
                </Text>
              </View>

              {/* Form */}
              <View style={{ marginTop: 40, gap: 20 }}>
                {/* Email */}
                <View>
                  <Text style={{ 
                    marginBottom: 8, 
                    fontSize: 14, 
                    fontWeight: '700', 
                    color: '#334155' 
                  }}>
                    Email
                  </Text>

                  <View style={{ 
                    height: 56, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    borderRadius: 16, 
                    borderWidth: 1, 
                    borderColor: '#E2E8F0', 
                    backgroundColor: '#F8FAFC', 
                    paddingHorizontal: 16 
                  }}>
                    <Mail size={20} color="#64748B" />

                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter email"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={{ 
                        marginLeft: 12, 
                        flex: 1, 
                        fontSize: 16, 
                        fontWeight: '500', 
                        color: '#0F172A',
                        paddingVertical: Platform.OS === 'ios' ? 8 : 0,
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        passwordInputRef.current?.focus();
                      }}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                {/* Password */}
                <View>
                  <Text style={{ 
                    marginBottom: 8, 
                    fontSize: 14, 
                    fontWeight: '700', 
                    color: '#334155' 
                  }}>
                    Password
                  </Text>

                  <View style={{ 
                    height: 56, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    borderRadius: 16, 
                    borderWidth: 1, 
                    borderColor: '#E2E8F0', 
                    backgroundColor: '#F8FAFC', 
                    paddingHorizontal: 16 
                  }}>
                    <Lock size={20} color="#64748B" />

                    <TextInput
                      ref={passwordInputRef}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPass}
                      style={{ 
                        marginLeft: 12, 
                        flex: 1, 
                        fontSize: 16, 
                        fontWeight: '500', 
                        color: '#0F172A',
                        paddingVertical: Platform.OS === 'ios' ? 8 : 0,
                      }}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShowPass(!showPass)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPass ? (
                        <EyeOff size={20} color="#64748B" />
                      ) : (
                        <Eye size={20} color="#64748B" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
                style={{ 
                  marginTop: 24, 
                  height: 56, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: 16,
                  backgroundColor: loading ? '#0446DBB3' : '#0446DB',
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFFFFF' }}>
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}




