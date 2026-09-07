// import React from "react";
// import { Image, Pressable, ScrollView, Text, View } from "react-native";
// import { ChevronLeft, ShieldCheck } from "lucide-react-native";
// import TopBar from "../components/TopBar";
// import PrimaryButton from "../components/PrimaryButton";
// import { RIDER } from "../data/mockData";
// import { fmtINR } from "../utils/manifestUtils";
// import { styles } from "../styles/pickupStyles";

// export default function PdfPreviewScreen({ draft, seller, wh, scanned, onBack, onConfirm }) {
//   const cod = scanned.filter((s) => s.payment === "COD");
//   const codAmt = cod.reduce((a, b) => a + b.cod, 0);
//   const weight = scanned.reduce((a, b) => a + b.weight, 0);

//   return (
//     <View style={[styles.screen, { backgroundColor: "#1F2937" }]}>
//       <TopBar title="Manifest preview" subtitle={`${draft.id}.pdf`} onBack={onBack} />

//       <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120 }}>
//         <View style={styles.pdfPage}>
//           <View style={styles.pdfHeader}>
//             <Text style={styles.pdfBrand}>DAAKIT LOGISTICS</Text>
//             <Text style={styles.pdfTitle}>Pickup Manifest</Text>
//             <Text style={styles.pdfSmall}>Manifest No: {draft.id}</Text>
//             <Text style={styles.pdfSmall}>Issued: {draft.signedAt}</Text>
//           </View>

//           <View style={styles.pdfSection}>
//             <Text style={styles.pdfLabel}>Seller</Text>
//             <Text style={styles.pdfBold}>{seller.name}</Text>
//             <Text style={styles.pdfSmall}>{seller.code}</Text>

//             <Text style={styles.pdfLabel}>Warehouse</Text>
//             <Text style={styles.pdfBold}>{wh.name}</Text>
//             <Text style={styles.pdfSmall}>
//               {wh.code} · {wh.address}
//             </Text>
//           </View>

//           <View style={styles.pdfSection}>
//             <Text style={styles.pdfLabel}>Shipments</Text>

//             {scanned.map((s, i) => (
//               <View key={s.awb} style={styles.pdfRow}>
//                 <Text style={styles.pdfSmall}>
//                   {i + 1}. {s.awb}
//                 </Text>
//                 <Text style={styles.pdfSmall}>
//                   {s.payment === "COD" ? fmtINR(s.cod) : "Prepaid"} · {s.weight}kg
//                 </Text>
//               </View>
//             ))}
//           </View>

//           <View style={styles.pdfSection}>
//             <Text style={styles.pdfBold}>Total shipments: {scanned.length}</Text>
//             <Text style={styles.pdfBold}>Total weight: {weight.toFixed(1)} kg</Text>
//             <Text style={styles.pdfBold}>COD amount: {fmtINR(codAmt)}</Text>
//           </View>

//           <View style={styles.pdfSection}>
//             <Text style={styles.pdfLabel}>Rider signature</Text>
//             <Image source={{ uri: draft.signature }} style={styles.signImage} />
//             <Text style={styles.pdfSmall}>Hash: {draft.hash}...</Text>
//             <Text style={styles.pdfSmall}>
//               GPS: 12.9716, 77.5946 · {RIDER.device}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.bottomBarDark}>
//         <View style={{ flexDirection: "row", gap: 10 }}>
//           <Pressable onPress={onBack} style={styles.editBtn}>
//             <ChevronLeft size={17} color="#fff" />
//             <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
//           </Pressable>

//           <View style={styles.confirmBtn}>
//             <PrimaryButton icon={ShieldCheck} onPress={onConfirm}>
//               Confirm & Generate
//             </PrimaryButton>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }



// import React from "react";
// import { Image, Pressable, ScrollView, Text, View } from "react-native";
// import { ChevronLeft, FileText, ShieldCheck } from "lucide-react-native";
// import { RIDER } from "../data/mockData";
// import { fmtINR } from "../utils/manifestUtils";

// export default function PdfPreviewScreen({
//   draft,
//   seller,
//   wh,
//   scanned,
//   onBack,
//   onConfirm,
// }) {
//   const cod = scanned.filter((s) => s.payment === "COD");
//   const codAmt = cod.reduce((a, b) => a + b.cod, 0);
//   const weight = scanned.reduce((a, b) => a + b.weight, 0);

//   return (
//     <View className="flex-1 bg-[#071B3A]">
//       <View className="bg-[#041631] px-4 pt-4 pb-3 flex-row items-center gap-3">
//         <Pressable onPress={onBack} className="w-8 h-8 items-center justify-center">
//           <ChevronLeft size={24} color="#FFFFFF" />
//         </Pressable>

//         <View className="flex-1">
//           <View className="flex-row items-center gap-2">
//             <FileText size={15} color="#F7931A" />
//             <Text className="text-white text-[15px] font-bold">
//               Manifest preview
//             </Text>
//           </View>
//           <Text className="text-white/60 text-[10px] font-mono mt-0.5">
//             {draft.id}.pdf
//           </Text>
//         </View>

//         <View className="bg-[#5E4A00] px-3 py-1 rounded-full">
//           <Text className="text-[#FACC15] text-[10px] font-bold">DRAFT</Text>
//         </View>
//       </View>

//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{
//           paddingBottom: 130,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="mx-3 mt-4  rounded-2xl overflow-hidden">
//           <View className="px-5 pt-5 pb-4 border-b border-[#111827]">
//             <View className="flex-row justify-between">
//               <View className="flex-1">
//                 <View className="flex-row items-center gap-2">
//                   <View className="w-7 h-7 rounded-full bg-[#0446DB] items-center justify-center">
//                     <Text className="text-white text-[8px] font-black">DAAK</Text>
//                   </View>

//                   <Text className="text-[#111827] text-[10px] font-black tracking-[3px]">
//                     DAAKIT LOGISTICS
//                   </Text>
//                 </View>

//                 <Text className="text-[#111827] text-[18px] font-black mt-4">
//                   Pickup Manifest
//                 </Text>
//               </View>

//               <View className="items-end">
//                 <Text className="text-slate-400 text-[9px] uppercase">
//                   Manifest No
//                 </Text>
//                 <Text className="text-[#111827] text-[10px] font-black font-mono mt-1">
//                   {draft.id}
//                 </Text>

//                 <Text className="text-slate-400 text-[9px] uppercase mt-3">
//                   Issued
//                 </Text>
//                 <Text className="text-[#111827] text-[10px] mt-1">
//                   {draft.signedAt}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View className="px-5 py-4 border-b border-slate-200 flex-row flex-wrap">
//             <View className="w-1/2 pr-3 mb-5">
//               <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px]">
//                 Seller
//               </Text>
//               <Text className="text-[#111827] text-[12px] font-black mt-2">
//                 {seller.name}
//               </Text>
//               <Text className="text-[#111827] text-[10px] font-mono mt-1">
//                 {seller.code}
//               </Text>
//             </View>

//             <View className="w-1/2 pr-1 mb-5">
//               <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px]">
//                 Warehouse
//               </Text>
//               <Text className="text-[#111827] text-[12px] font-black mt-2">
//                 {wh.name}
//               </Text>
//               <Text className="text-[#111827] text-[10px] font-mono mt-1">
//                 {wh.code}
//               </Text>
//               <Text className="text-slate-500 text-[9px] mt-1">
//                 {wh.address}
//               </Text>
//             </View>

//             <View className="w-1/2 pr-3">
//               <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px]">
//                 Rider
//               </Text>
//               <Text className="text-[#111827] text-[12px] font-black mt-2">
//                 {RIDER.name}
//               </Text>
//               <Text className="text-[#111827] text-[10px] mt-1">
//                 {RIDER.id} · {RIDER.phone}
//               </Text>
//             </View>

//             <View className="w-1/2 pr-1">
//               <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px]">
//                 Pickup
//               </Text>
//               <Text className="text-[#111827] text-[10px] mt-2">
//                 {draft.signedAt}
//               </Text>
//               <Text className="text-[#111827] text-[10px] font-mono mt-1">
//                 12.9716, 77.5946
//               </Text>
//             </View>
//           </View>

//           <View className="px-5 pt-4">
//             <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px] mb-2">
//               Shipments
//             </Text>

//             <View className="border border-slate-300 overflow-hidden">
//               <View className="bg-slate-100 flex-row px-2 py-2">
//                 <Text className="w-6 text-[8px] font-black text-[#111827]">#</Text>
//                 <Text className="flex-1 text-[8px] font-black text-[#111827]">
//                   AWB / ORDER
//                 </Text>
//                 <Text className="w-14 text-[8px] font-black text-[#111827]">
//                   PAY
//                 </Text>
//                 <Text className="w-12 text-[8px] font-black text-[#111827] text-right">
//                   COD
//                 </Text>
//                 <Text className="w-10 text-[8px] font-black text-[#111827] text-right">
//                   WT
//                 </Text>
//               </View>

//               {scanned.map((s, i) => (
//                 <View key={s.awb} className="flex-row px-2 py-2 border-t border-slate-200">
//                   <Text className="w-6 text-[9px] text-slate-400">{i + 1}</Text>

//                   <View className="flex-1">
//                     <Text className="text-[10px] text-[#111827] font-black font-mono">
//                       {s.awb}
//                     </Text>
//                     <Text className="text-[9px] text-slate-500 mt-1">
//                       {s.orderId} · {s.city}
//                     </Text>
//                   </View>

//                   <Text className="w-14 text-[9px] text-[#111827] font-black">
//                     {s.payment}
//                   </Text>

//                   <Text className="w-12 text-[9px] text-[#111827] font-bold text-right">
//                     {s.cod ? fmtINR(s.cod) : "—"}
//                   </Text>

//                   <Text className="w-10 text-[9px] text-[#111827] font-bold text-right">
//                     {s.weight}kg
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>

//           <View className="mx-5 mt-4 bg-slate-100 p-3">
//             <View className="flex-row mb-2">
//               <View className="w-1/2 flex-row justify-between pr-4">
//                 <Text className="text-slate-500 text-[10px]">Total shipments</Text>
//                 <Text className="text-[#111827] text-[10px] font-black">
//                   {scanned.length}
//                 </Text>
//               </View>

//               <View className="w-1/2 flex-row justify-between">
//                 <Text className="text-slate-500 text-[10px]">Total weight</Text>
//                 <Text className="text-[#111827] text-[10px] font-black">
//                   {weight.toFixed(1)} kg
//                 </Text>
//               </View>
//             </View>

//             <View className="flex-row mb-3">
//               <View className="w-1/2 flex-row justify-between pr-4">
//                 <Text className="text-slate-500 text-[10px]">Prepaid</Text>
//                 <Text className="text-[#111827] text-[10px] font-black">
//                   {scanned.length - cod.length}
//                 </Text>
//               </View>

//               <View className="w-1/2 flex-row justify-between">
//                 <Text className="text-slate-500 text-[10px]">COD</Text>
//                 <Text className="text-[#111827] text-[10px] font-black">
//                   {cod.length}
//                 </Text>
//               </View>
//             </View>

//             <View className="border-t border-slate-300 pt-3 flex-row justify-between">
//               <Text className="text-slate-500 text-[10px]">Total COD amount</Text>
//               <Text className="text-[#111827] text-[13px] font-black">
//                 {fmtINR(codAmt)}
//               </Text>
//             </View>
//           </View>

//           <View className="px-5 pt-4 pb-5 flex-row gap-4">
//             <View className="flex-1">
//               <Text className="text-slate-400 text-[9px] uppercase tracking-[1.5px] mb-2">
//                 Digitally signed by rider
//               </Text>

//               <View className="h-16 border border-slate-300 justify-center bg-white">
//                 <Image
//                   source={{ uri: draft.signature }}
//                   className="w-full h-12"
//                   resizeMode="contain"
//                 />
//               </View>

//               <Text className="text-[#111827] text-[9.5px] font-bold mt-2">
//                 {RIDER.name} · {RIDER.id}
//               </Text>
//               <Text className="text-slate-600 text-[9px] mt-0.5">
//                 Signed at {draft.signedAt}
//               </Text>
//               <Text className="text-slate-600 text-[9px] mt-0.5">
//                 GPS 12.9716, 77.5946 · {RIDER.device}
//               </Text>
//               <Text className="text-slate-600 text-[9px] mt-0.5">
//                 Hash {draft.hash}...
//               </Text>
//             </View>

//             <View className="items-center justify-end">
//               <View className="w-16 h-16 bg-black p-1">
//                 <View className="flex-1 border border-white" />
//               </View>
//               <Text className="text-slate-500 text-[8px] uppercase mt-1">
//                 Scan to verify
//               </Text>
//             </View>
//           </View>

//           <View className="px-5 py-2 border-t border-slate-200 flex-row justify-between">
//             <Text className="text-slate-500 text-[8px]">
//               daakit.com/manifest/verify/{draft.id}
//             </Text>
//             <Text className="text-slate-500 text-[8px]">Page 1 of 1</Text>
//           </View>
//         </View>

//         <View className="mx-3 mt-4 bg-[#0B2347] border border-[#2C4B75] rounded-2xl p-4 flex-row gap-3">
//           <ShieldCheck size={17} color="#F7931A" />
//           <Text className="flex-1 text-white text-[12px] leading-5 font-semibold">
//             Review the manifest carefully. Once you confirm, the PDF will be
//             sealed, shipments will be marked MANIFESTED, and a copy will be
//             emailed to the seller and Daakit Ops.
//           </Text>
//         </View>
//       </ScrollView>

//       <View className="absolute bottom-0 left-0 right-0 bg-[#071B3A] px-4 pt-4 pb-4 flex-row gap-3">
//         <Pressable
//           onPress={onBack}
//           className="h-14 px-5 rounded-2xl border border-white/20 flex-row items-center justify-center gap-1"
//         >
//           <ChevronLeft size={18} color="#FFFFFF" />
//           <Text className="text-white font-bold">Edit</Text>
//         </Pressable>

//         <Pressable
//           onPress={onConfirm}
//           className="flex-1 h-14 rounded-2xl bg-[#F7931A] flex-row items-center justify-center gap-2"
//         >
//           <ShieldCheck size={18} color="#FFFFFF" />
//           <Text className="text-white text-[16px] font-bold">
//             Confirm & Generate
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ChevronLeft, FileText, ShieldCheck } from "lucide-react-native";
import { RIDER } from "../data/mockData";
import { fmtINR } from "../utils/manifestUtils";
import { styles } from "../styles/pickupStyles";

export default function PdfPreviewScreen({
  draft,
  seller,
  wh,
  scanned,
  onBack,
  onConfirm,
}) {
  const cod = scanned.filter((s) => s.payment === "COD");
  const codAmt = cod.reduce((a, b) => a + b.cod, 0);
  const weight = scanned.reduce((a, b) => a + b.weight, 0);

  return (
    <View style={styles.pdfScreen}>
      <View style={styles.pdfHeaderBar}>
        <Pressable onPress={onBack} style={{ marginRight: 10 }}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <FileText size={15} color="#FFC107" />
            <Text style={styles.pdfHeaderTitle}>Manifest preview</Text>
          </View>
          <Text style={styles.pdfHeaderSub}>{draft.id}.pdf</Text>
        </View>

        <View style={styles.draftBadge}>
          <Text style={styles.draftBadgeText}>DRAFT</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pdfCard}>
          <View style={styles.pdfCardHeader}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <View style={styles.pdfLogoRow}>
                  <View style={styles.pdfLogoCircle}>
                    <Text style={styles.pdfLogoText}>DAAK</Text>
                  </View>
                  <Text style={styles.pdfCompany}>DAAKIT LOGISTICS</Text>
                </View>

                <Text style={styles.pdfManifestTitle}>Pickup Manifest</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.pdfSectionLabel}>MANIFEST NO</Text>
                <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
                  {draft.id}
                </Text>

                <Text style={[styles.pdfSectionLabel, { marginTop: 10 }]}>
                  ISSUED
                </Text>
                <Text style={{ color: "#111827", fontSize: 10 }}>
                  {draft.signedAt}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.pdfGrid}>
            <Info title="SELLER" value={seller.name} sub={seller.code} />
            <Info title="WAREHOUSE" value={wh.name} sub={wh.code} note={wh.address} />
            <Info
              title="RIDER"
              value={RIDER.name}
              sub={`${RIDER.id} · ${RIDER.phone}`}
            />
            <Info title="PICKUP" value={draft.signedAt} sub="12.9716, 77.5946" />
          </View>

          <View style={{ paddingHorizontal: 18 }}>
            <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>SHIPMENTS</Text>

            <View style={styles.pdfTable}>
              <View style={styles.pdfTableHead}>
                <Text style={tableHeadStyle(24)}>#</Text>
                <Text style={[tableHeadText, { flex: 1 }]}>AWB / ORDER</Text>
                <Text style={tableHeadStyle(52)}>PAY</Text>
                <Text style={[tableHeadText, { width: 45, textAlign: "right" }]}>
                  COD
                </Text>
                <Text style={[tableHeadText, { width: 38, textAlign: "right" }]}>
                  WT
                </Text>
              </View>

              {scanned.map((item, index) => (
                <View key={item.awb} style={styles.pdfTableRow}>
                  <Text style={[tableText, { width: 24, color: "#94A3B8" }]}>
                    {index + 1}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
                      {item.awb}
                    </Text>
                    <Text style={{ color: "#6B7280", fontSize: 9 }}>
                      {item.orderId} · {item.city}
                    </Text>
                  </View>

                  <Text style={[tableTextBold, { width: 52 }]}>{item.payment}</Text>

                  <Text style={[tableTextBold, { width: 45, textAlign: "right" }]}>
                    {item.cod ? fmtINR(item.cod) : "—"}
                  </Text>

                  <Text style={[tableTextBold, { width: 38, textAlign: "right" }]}>
                    {item.weight}kg
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.pdfTotalBox}>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <Total label="Total shipments" value={scanned.length} />
              <Total label="Total weight" value={`${weight.toFixed(1)} kg`} />
            </View>

            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Total label="Prepaid" value={scanned.length - cod.length} />
              <Total label="COD" value={cod.length} />
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#D1D5DB",
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#6B7280", fontSize: 10 }}>
                Total COD amount
              </Text>
              <Text style={{ color: "#111827", fontSize: 13, fontWeight: "900" }}>
                {fmtINR(codAmt)}
              </Text>
            </View>
          </View>

          <View style={styles.pdfSignatureBox}>
            <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>
              DIGITALLY SIGNED BY RIDER
            </Text>

            <View style={{ flexDirection: "row", gap: 14 }}>
              <View style={{ flex: 1 }}>
                <View style={styles.signatureCard}>
                  <Image
                    source={{ uri: draft.signature }}
                    style={{ width: "100%", height: 48, resizeMode: "contain" }}
                  />
                </View>

                <Text style={{ color: "#111827", fontSize: 9.5, fontWeight: "900", marginTop: 8 }}>
                  {RIDER.name} · {RIDER.id}
                </Text>
                <Text style={{ color: "#6B7280", fontSize: 9 }}>
                  Signed at {draft.signedAt}
                </Text>
                <Text style={{ color: "#6B7280", fontSize: 9 }}>
                  GPS 12.9716, 77.5946 · {RIDER.device}
                </Text>
                <Text style={{ color: "#6B7280", fontSize: 9 }}>
                  Hash {draft.hash}...
                </Text>
              </View>

              <View style={{ alignItems: "center", justifyContent: "flex-end" }}>
                <View style={styles.verifyBox} />
                <Text style={{ color: "#6B7280", fontSize: 8, marginTop: 4 }}>
                  SCAN TO VERIFY
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 8 }}>
              daakit.com/manifest/verify/{draft.id}
            </Text>
            <Text style={{ color: "#6B7280", fontSize: 8 }}>Page 1 of 1</Text>
          </View>
        </View>

        <View style={styles.reviewBox}>
          <ShieldCheck size={17} color="#FFC107" />
          <Text style={styles.reviewText}>
            Review the manifest carefully. Once you confirm, the PDF will be sealed,
            shipments will be marked MANIFESTED, and a copy will be emailed to the
            seller and Daakit Ops.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.pdfBottomBar}>
        <Pressable onPress={onBack} style={styles.editBtn}>
          <ChevronLeft size={18} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Edit</Text>
        </Pressable>

        <Pressable onPress={onConfirm} style={styles.confirmBtn}>
          <ShieldCheck size={18} color="#111827" />
          <Text style={{ color: "#111827", fontWeight: "900" }}>
            Confirm & Generate
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Info({ title, value, sub, note }) {
  return (
    <View style={styles.pdfCol}>
      <Text style={styles.pdfSectionLabel}>{title}</Text>
      <Text style={styles.pdfSectionValue}>{value}</Text>
      <Text style={styles.pdfSectionSub}>{sub}</Text>
      {!!note && <Text style={styles.pdfSectionSub}>{note}</Text>}
    </View>
  );
}

function Total({ label, value }) {
  return (
    <View style={{ width: "50%", flexDirection: "row", justifyContent: "space-between", paddingRight: 12 }}>
      <Text style={{ color: "#6B7280", fontSize: 10 }}>{label}</Text>
      <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
        {value}
      </Text>
    </View>
  );
}

const tableHeadText = {
  color: "#111827",
  fontSize: 8,
  fontWeight: "900",
};

const tableText = {
  color: "#111827",
  fontSize: 9,
};

const tableTextBold = {
  color: "#111827",
  fontSize: 9,
  fontWeight: "800",
};

function tableHeadStyle(width) {
  return [tableHeadText, { width }];
}