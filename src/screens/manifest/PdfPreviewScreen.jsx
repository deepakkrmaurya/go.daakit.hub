
// import React from "react";
// import { Image, Pressable, ScrollView, Text, View } from "react-native";
// import { ChevronLeft, FileText, ShieldCheck } from "lucide-react-native";
// import { RIDER } from "../../data/mockData";
// import { fmtINR } from "../../utils/manifestUtils";
// import { styles } from "../../styles/pickupStyles";
// import { getItem, storage } from "../../helper/Storage";
// import axiosInstance from "../../helper/AxioInstance";

// export default function PdfPreviewScreen({
//   draft,
//   seller,
//   wh,
//   scanned,
//   onBack,
//   onConfirm,
//   scannedAwb,
//   facility
// }) {
//   const cod = scanned.filter((s) => s.payment === "COD");
//   const codAmt = cod.reduce((a, b) => a + b.cod, 0);
//   const weight = scanned.reduce((a, b) => a + b.weight, 0);
//   console.log(scannedAwb)
//   const hubData = getItem("hub");
//   const hub = hubData ? JSON.parse(hubData) : null;
//   console.log(hub)




//   const uploadManifestPdf = async (pdfPath) => {
//     try {
//       if (!pdfPath) {
//         console.log("PDF path missing");
//         return;
//       }

//       console.log(pdfPath)

//       const formData = new FormData();

//       formData.append("pdf", {
//         uri: `file://${pdfPath}`,
//         name: "manifest.pdf",
//         type: "application/pdf",
//       });
//       // console.log(formData)
//       formData.append("facility_id",facility?.facility_id);
//      console.log(formData)
//      return
//       const res = await axiosInstance.post("/hub/sendPickupFacilityPdfMail",formData);

//       console.log(res.data);
//     } catch (error) {
//       console.log(error?.response?.data || error.message);
//     }
//   };


//   return (
//     <View style={styles.pdfScreen}>
//       <View style={styles.pdfHeaderBar}>
//         <Pressable onPress={onBack} style={{ marginRight: 10 }}>
//           <ChevronLeft size={24} color="#FFFFFF" />
//         </Pressable>

//         <View style={{ flex: 1 }}>
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
//             <FileText size={15} color="#FFC107" />
//             <Text style={styles.pdfHeaderTitle}>Manifest preview</Text>
//           </View>
//           <Text style={styles.pdfHeaderSub}>{draft.id}.pdf</Text>
//         </View>

//         <View style={styles.draftBadge}>
//           <Text style={styles.draftBadgeText}>DRAFT</Text>
//         </View>
//       </View>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 130 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.pdfCard}>
//           <View style={styles.pdfCardHeader}>
//             <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//               <View style={{ flex: 1 }}>
//                 <View style={styles.pdfLogoRow}>
//                   <View style={styles.pdfLogoCircle}>
//                     <Text style={styles.pdfLogoText}>DAAK</Text>
//                   </View>
//                   <Text style={styles.pdfCompany}>DAAKIT LOGISTICS</Text>
//                 </View>

//                 <Text style={styles.pdfManifestTitle}>Pickup Manifest</Text>
//               </View>

//               <View style={{ alignItems: "flex-end" }}>
//                 {/* <Text style={styles.pdfSectionLabel}>MANIFEST NO</Text>
//                 <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
//                   {draft.id}
//                 </Text> */}

//                 <Text style={[styles.pdfSectionLabel, { marginTop: 10 }]}>
//                   ISSUED
//                 </Text>
//                 <Text style={{ color: "#111827", fontSize: 10 }}>
//                   {draft.signedAt}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.pdfGrid}>
//             <Info title="Hub Name" value={`${hub.hub_name}`} sub={` Hub Code : ${hub.hub_code}`} />
//             <Info title="hub Type" value={hub.hub_type} sub={`City : ${hub.city}`} note={`State : ${hub.state}`} />
//             {/* <Info
//               title="RIDER"
//               value={RIDER?.name}
//               sub={`${RIDER.id} · ${RIDER.phone}`}
//             />
//             <Info title="PICKUP" value={draft.signedAt} sub="12.9716, 77.5946" /> */}
//           </View>

//           <View style={{ paddingHorizontal: 18 }}>
//             <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>SHIPMENTS</Text>

//             <View style={styles.pdfTable}>
//               <View style={styles.pdfTableHead}>
//                 <Text style={tableHeadStyle(24)}>#</Text>
//                 <Text style={[tableHeadText, { flex: 1 }]}>AWB / ORDER</Text>
//                 {/* <Text style={tableHeadStyle(52)}>PAY</Text> */}
//                 {/* <Text style={[tableHeadText, { width: 45, textAlign: "right" }]}>
//                   COD
//                 </Text>
//                 <Text style={[tableHeadText, { width: 38, textAlign: "right" }]}>
//                   WT
//                 </Text> */}
//               </View>

//               {scannedAwb.map((item, index) => (
//                 <View key={item.awb} style={styles.pdfTableRow}>
//                   <Text style={[tableText, { width: 24, color: "#94A3B8" }]}>
//                     {index + 1}
//                   </Text>

//                   <View style={{ flex: 1 }}>
//                     <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
//                       {item.awb_number}
//                     </Text>
//                     {/* <Text style={{ color: "#6B7280", fontSize: 9 }}>
//                       {item.orderId} · {item.city}
//                     </Text> */}
//                   </View>

//                   {/* <Text style={[tableTextBold, { width: 52 }]}>{item.payment}</Text>

//                   <Text style={[tableTextBold, { width: 45, textAlign: "right" }]}>
//                     {item.cod ? fmtINR(item.cod) : "—"}
//                   </Text>

//                   <Text style={[tableTextBold, { width: 38, textAlign: "right" }]}>
//                     {item.weight}kg
//                   </Text> */}
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* <View style={styles.pdfTotalBox}>
//             <View style={{ flexDirection: "row", marginBottom: 8 }}>
//               <Total label="Total shipments" value={scanned.length} />
//               <Total label="Total weight" value={`${weight.toFixed(1)} kg`} />
//             </View>

//             <View style={{ flexDirection: "row", marginBottom: 10 }}>
//               <Total label="Prepaid" value={scanned.length - cod.length} />
//               <Total label="COD" value={cod.length} />
//             </View>

//             <View
//               style={{
//                 borderTopWidth: 1,
//                 borderTopColor: "#D1D5DB",
//                 paddingTop: 10,
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={{ color: "#6B7280", fontSize: 10 }}>
//                 Total COD amount
//               </Text>
//               <Text style={{ color: "#111827", fontSize: 13, fontWeight: "900" }}>
//                 {fmtINR(codAmt)}
//               </Text>
//             </View>
//           </View> */}

//           <View style={styles.pdfSignatureBox}>
//             <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>
//               DIGITALLY SIGNED BY RIDER
//             </Text>

//             <View style={{ flexDirection: "row", gap: 14 }}>
//               <View style={{ flex: 1 }}>
//                 <View style={styles.signatureCard}>
//                   <Image
//                     source={{ uri: draft.signature }}
//                     style={{ width: "100%", height: 48, resizeMode: "contain" }}
//                   />
//                 </View>

//                 {/* <Text style={{ color: "#111827", fontSize: 9.5, fontWeight: "900", marginTop: 8 }}>
//                   {RIDER.name} · {RIDER.id}
//                 </Text>
//                 <Text style={{ color: "#6B7280", fontSize: 9 }}>
//                   Signed at {draft.signedAt}
//                 </Text>
//                 <Text style={{ color: "#6B7280", fontSize: 9 }}>
//                   GPS 12.9716, 77.5946 · {RIDER.device}
//                 </Text>
//                 <Text style={{ color: "#6B7280", fontSize: 9 }}>
//                   Hash {draft.hash}...
//                 </Text> */}
//               </View>

//               <View style={{ alignItems: "center", justifyContent: "flex-end" }}>
//                 <View style={styles.verifyBox} />
//                 <Text style={{ color: "#6B7280", fontSize: 8, marginTop: 4 }}>
//                   SCAN TO VERIFY
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View
//             style={{
//               paddingHorizontal: 18,
//               paddingVertical: 8,
//               borderTopWidth: 1,
//               borderTopColor: "#E5E7EB",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <Text style={{ color: "#6B7280", fontSize: 8 }}>
//               daakit.com/manifest/verify/{draft.id}
//             </Text>
//             <Text style={{ color: "#6B7280", fontSize: 8 }}>Page 1 of 1</Text>
//           </View>
//         </View>

//         <View style={styles.reviewBox}>
//           <ShieldCheck size={17} color="#FFC107" />
//           <Text style={styles.reviewText}>
//             Review the manifest carefully. Once you confirm, the PDF will be sealed,
//             shipments will be marked MANIFESTED, and a copy will be emailed to the
//             seller and Daakit Ops.
//           </Text>
//         </View>
//       </ScrollView>

//       <View style={styles.pdfBottomBar}>
//         <Pressable onPress={onBack} style={styles.editBtn}>
//           <ChevronLeft size={18} color="#FFFFFF" />
//           <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Edit</Text>
//         </Pressable>

//         <Pressable onPress={() => {
//           uploadManifestPdf(draft)
//         }} style={styles.confirmBtn}>
//           <ShieldCheck size={18} color="#111827" />
//           <Text style={{ color: "#111827", fontWeight: "900" }}>
//             Confirm & Generate
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// function Info({ title, value, sub, note }) {
//   return (
//     <View style={styles.pdfCol}>
//       <Text style={styles.pdfSectionLabel}>{title}</Text>
//       <Text style={styles.pdfSectionValue}>{value}</Text>
//       <Text style={styles.pdfSectionSub}>{sub}</Text>
//       {!!note && <Text style={styles.pdfSectionSub}>{note}</Text>}
//     </View>
//   );
// }

// function Total({ label, value }) {
//   return (
//     <View style={{ width: "50%", flexDirection: "row", justifyContent: "space-between", paddingRight: 12 }}>
//       <Text style={{ color: "#6B7280", fontSize: 10 }}>{label}</Text>
//       <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
//         {value}
//       </Text>
//     </View>
//   );
// }

// const tableHeadText = {
//   color: "#111827",
//   fontSize: 8,
//   fontWeight: "900",
// };

// const tableText = {
//   color: "#111827",
//   fontSize: 9,
// };

// const tableTextBold = {
//   color: "#111827",
//   fontSize: 9,
//   fontWeight: "800",
// };

// function tableHeadStyle(width) {
//   return [tableHeadText, { width }];
// }



import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View, ActivityIndicator, Alert } from "react-native";
import { ChevronLeft, FileText, ShieldCheck } from "lucide-react-native";
import { generatePDF } from "react-native-html-to-pdf";
import { styles } from "../../styles/pickupStyles";
import { getItem } from "../../helper/Storage";
import axiosInstance from "../../helper/AxioInstance";
import RNFS from "react-native-fs";
import { PermissionsAndroid } from 'react-native';
import FileViewer from "react-native-file-viewer";
import logo from '../../assets/logo_pdf.png';
import requestStoragePermission from '../../premission/storagepremission'
export default function PdfPreviewScreen({
  draft,
  scanned = [],
  onBack,
  scannedAwb = [],
  facility,
  onConfirm,
  setPdf
}) {
  const [loading, setLoading] = useState(false);

  const hubData = getItem("hub");
  const hub = hubData ? JSON.parse(hubData) : {};

  const createManifestHtml = () => {
    const rows = scannedAwb
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.awb_number}</td>
          </tr>
        `
      )
      .join("");

    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
            }
            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #0446DB;
              padding-bottom: 14px;
              margin-bottom: 20px;
            }
            .brand {
              color: #0446DB;
              font-size: 22px;
              font-weight: bold;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              margin-top: 10px;
            }
            .info {
              display: flex;
              gap: 20px;
              margin-bottom: 20px;
            }
            .box {
              width: 50%;
              border: 1px solid #E5E7EB;
              padding: 12px;
              border-radius: 8px;
            }
            .label {
              color: #6B7280;
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .value {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            th {
              background: #EEF4FF;
              color: #111827;
              text-align: left;
              padding: 10px;
              font-size: 12px;
            }
            td {
              border-bottom: 1px solid #E5E7EB;
              padding: 10px;
              font-size: 12px;
            }
            .signature {
              margin-top: 30px;
              border-top: 1px solid #E5E7EB;
              padding-top: 16px;
            }
            .sign-img {
              width: 180px;
              height: 70px;
              object-fit: contain;
            }
            .footer {
              margin-top: 30px;
              font-size: 10px;
              color: #6B7280;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">DAAKit Technologies Pvt Ltd</div>
              <div class="title">Pickup Manifest</div>
            </div>
            <div>
              <div class="label">Issued</div>
              <div class="value">${draft?.signedAt || ""}</div>
            </div>
          </div>

          <div class="info">
            <div class="box">
              <div class="label">Hub Name</div>
              <div class="value">${hub?.hub_name || ""}</div>
              <div>Hub Code: ${hub?.hub_code || ""}</div>
            </div>

            <div class="box">
              <div class="label">Hub Type</div>
              <div class="value">${hub?.hub_type || ""}</div>
              <div>City: ${hub?.city || ""}</div>
              <div>State: ${hub?.state || ""}</div>
            </div>
          </div>

          <div class="label">Shipments</div>
          <table>
            <thead>
              <tr>
                <th style="width:50px;">#</th>
                <th>AWB / ORDER</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="signature">
            <div class="label">Digitally Signed</div>
            ${draft?.signature
        ? `<img class="sign-img" src="${draft.signature}" />`
        : ""
      }
          </div>

          
        </body>
      </html>
    `;
  };

  const uploadManifestPdf = async (pdfPath) => {
    const hub = getItem('hub')
    const data = JSON.parse(hub)
    // console.log(data)
    // if (data.hub_role === 'vendor') {
    //   console.log(data)
    //   return 
    // }

    const formData = new FormData();
    formData.append("pdf", {
      uri: pdfPath.startsWith("file://") ? pdfPath : `file://${pdfPath}`,
      name: `${draft?.id || "manifest"}.pdf`,
      type: "application/pdf",
    });

    formData.append("facility_id", String(facility?.facility_id));

    const res = await axiosInstance.post(
      "/hub/sendPickupFacilityPdfMail",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );




    return res.data;
  };

  const generateAndSendPdf = async () => {
    try {

      await requestStoragePermission()


      setLoading(true);

      const html = createManifestHtml();


      const file = await generatePDF({
        html,
        fileName: draft?.id || "manifest",
        directory: "Documents",
        base64: true,
      });

      const downloadPath =
        `${RNFS.DownloadDirectoryPath}/${draft?.id || "manifest"}.pdf`;
      await RNFS.copyFile(file.filePath, downloadPath);
      console.log("Saved to:", downloadPath);
      setPdf(downloadPath);
      const result = await uploadManifestPdf(file.filePath);

      onConfirm()
      Alert.alert(
              "Success",
              "PDF saved in Download folder"
            );
      console.log("UPLOAD RESULT:", result);
    } catch (error) {
      console.log("PDF Upload Error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.pdfHeaderSub}>{draft?.id}.pdf</Text>
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
              <View style={{ marginBottom: 2 }}>
                <Text  
                 style={[
                    styles.pdfManifestTitle,
                    { textAlign: "left" }
                  ]}
                 >DAAKit Technologies Pvt Ltd</Text>
                {/* <Image
                  source={logo}
                  style={{
                    width: 100,
                    height: 30,
                    resizeMode: "contain",
                    alignSelf: "flex-start",
                    
                  }}
                /> */}

                <Text
                  style={[
                    
                    { textAlign: "left" }
                  ]}
                >
                  Pickup Manifest
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.pdfSectionLabel, { marginTop: 10 }]}>
                  ISSUED
                </Text>
                <Text style={{ color: "#111827", fontSize: 10 }}>
                  {draft?.signedAt}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.pdfGrid}>
            <Info
              title="Hub Name"
              value={hub?.hub_name || ""}
              sub={`Hub Code : ${hub?.hub_code || ""}`}
            />
            <Info
              title="Hub Type"
              value={hub?.hub_type || ""}
              sub={`City : ${hub?.city || ""}`}
              note={`State : ${hub?.state || ""}`}
            />
          </View>

          <View style={{ paddingHorizontal: 18 }}>
            <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>
              SHIPMENTS
            </Text>

            <View style={styles.pdfTable}>
              <View style={styles.pdfTableHead}>
                <Text style={tableHeadStyle(24)}>#</Text>
                <Text style={[tableHeadText, { flex: 1 }]}>AWB / ORDER</Text>
              </View>

              {scannedAwb.map((item, index) => (
                <View key={`${item.awb_number}-${index}`} style={styles.pdfTableRow}>
                  <Text style={[tableText, { width: 24, color: "#94A3B8" }]}>
                    {index + 1}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#111827", fontSize: 10, fontWeight: "900" }}>
                      {item.awb_number}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.pdfSignatureBox}>
            <Text style={[styles.pdfSectionLabel, { marginBottom: 8 }]}>
              DIGITALLY SIGNED BY RIDER
            </Text>

            <View style={styles.signatureCard}>
              <Image
                source={{ uri: draft?.signature }}
                style={{ width: "100%", height: 48, resizeMode: "contain" }}
              />
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
            {/* <Text style={{ color: "#6B7280", fontSize: 8 }}>
              daakit.com/manifest/verify/{draft?.id}
            </Text> */}
            <Text style={{ color: "#6B7280", fontSize: 8 }}>Page 1 of 1</Text>
          </View>
        </View>

        <View style={styles.reviewBox}>
          <ShieldCheck size={17} color="#FFC107" />
          <Text style={styles.reviewText}>
            Review the manifest carefully. Once you confirm, the PDF will be
            generated and sent to API.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.pdfBottomBar}>
        <Pressable onPress={onBack} style={styles.editBtn}>
          <ChevronLeft size={18} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Edit</Text>
        </Pressable>

        <Pressable
          onPress={generateAndSendPdf}
          disabled={loading}
          style={styles.confirmBtn}
        >
          {loading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <>
              <ShieldCheck size={18} color="#111827" />
              <Text style={{ color: "#111827", fontWeight: "900" }}>
                Confirm & Generate
              </Text>
            </>
          )}
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

const tableHeadText = {
  color: "#111827",
  fontSize: 8,
  fontWeight: "900",
};

const tableText = {
  color: "#111827",
  fontSize: 9,
};

function tableHeadStyle(width) {
  return [tableHeadText, { width }];
}