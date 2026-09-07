import { View, Text, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { makeShipments } from "../../data/mockData";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIMARY, styles } from '../../styles/pickupStyles';
import SelectFacilityScreen from './SelectFacilityScreen';
import ScanScreen from './SignScreen';
import ReviewScreen from './ReviewScreen';
import SignScreen from './SignScreen';
import PdfPreviewScreen from './PdfPreviewScreen';
import { manifestNo, nowStamp, shortHash } from '../../utils/manifestUtils';
import SuccessScreen from './SuccessScreen';
const ManifestDashboard = () => {
    const [step, setStep] = useState("dashboard");
    const [seller, setSeller] = useState(null);
    const [wh, setWh] = useState(null);
    const [shipments] = useState(() => makeShipments());
    const [scanned, setScanned] = useState([]);
    const [errors, setErrors] = useState([]);
    const [draft, setDraft] = useState(null);
    const [manifest, setManifest] = useState(null);
    const [pdf, setPdf] = useState(null)
    const reset = () => {
        setSeller(null);
        setWh(null);
        setScanned([]);
        setErrors([]);
        setDraft(null);
        setManifest(null);
    };

    const [facility, setFacility] = useState({
        facility_id: "",
        date: ""
    })

    const [scannedAwb, setScannedAwb] = useState([])





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0446DB" }}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0446DB"
                translucent={false}
            />
            {step === "dashboard" && (
                <SelectFacilityScreen
                    onStart={() => {
                        reset();
                        setStep("review");
                    }}

                    setFacility={setFacility}
                />
            )}

            {/* && seller && wh &&  */}

            {step === "review" && (
                <ReviewScreen
                    seller={seller} //not use
                    wh={wh} //not use
                    scanned={scanned} // not use
                    facility={facility}
                    ScannedAwb={setScannedAwb}
                    onBack={() => setStep("dashboard")}
                    onConfirm={() => setStep("sign")}
                />
            )}
            {/* && seller && wh && */}
            {step === "sign" && (
                <SignScreen
                    seller={seller} // not use
                    wh={wh} // not use
                    scanned={scanned}  //not use
                    scannedAwb={scannedAwb}
                    onBack={() => setStep("review")}
                    onSigned={(sig) => {
                        setDraft({
                            id: manifestNo(),
                            hash: shortHash(),
                            signedAt: nowStamp(),
                            signature: sig,
                        });
                        setStep("preview");
                    }}
                />
            )}

            {/* && draft && seller && wh */}

            {step === "preview" && (
                <PdfPreviewScreen
                    draft={draft} // note use
                    seller={seller} // not use
                    wh={wh} // not use
                    scanned={scanned} //not use
                    facility={facility}
                    scannedAwb={scannedAwb}
                    onBack={() => setStep("sign")}
                    onConfirm={() => {
                        setManifest(draft);
                        setStep("success");
                    }}

                    setPdf={setPdf}


                />
            )}
            {/* && manifest && seller && wh && */}
            {step === "success" && (
                <SuccessScreen
                    manifest={manifest}
                    seller={seller}
                    wh={wh}
                    scanned={scanned}
                    facility={facility}
                    onDone={() => {
                        reset();
                        setStep("dashboard");
                    }}
                    pdf={pdf}
                />
            )}


        </SafeAreaView>
    )
}

export default ManifestDashboard