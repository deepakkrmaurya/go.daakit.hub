import { View, Text, StatusBar } from 'react-native'

import { makeShipments } from "../data/mockData";
import { manifestNo, nowStamp, shortHash } from "../utils/manifestUtils";
import { PRIMARY, styles } from "../styles/pickupStyles";

import DashboardScreen from "./DashboardScreen";
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SellerScreen from "./SellerScreen";
import WarehouseScreen from "./WarehouseScreen";
import ScanScreen from "./ScanScreen";
import ReviewScreen from "./ReviewScreen";
import SignScreen from "./SignScreen";
import PdfPreviewScreen from "./PdfPreviewScreen";
import SuccessScreen from "./SuccessScreen";

const ManifestScreen = () => {

    const [step, setStep] = useState("dashboard");
    const [seller, setSeller] = useState(null);
    const [wh, setWh] = useState(null);
    const [shipments] = useState(() => makeShipments());
    const [scanned, setScanned] = useState([]);
    const [errors, setErrors] = useState([]);
    const [draft, setDraft] = useState(null);
    const [manifest, setManifest] = useState(null);

    const reset = () => {
        setSeller(null);
        setWh(null);
        setScanned([]);
        setErrors([]);
        setDraft(null);
        setManifest(null);
    };
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
            {step === "dashboard" && (
                <DashboardScreen
                    onStart={() => {
                        reset();
                        setStep("seller");
                    }}
                />
            )}

            {step === "seller" && (
                <SellerScreen
                    onBack={() => setStep("dashboard")}
                    onPick={(s) => {
                        setSeller(s);
                        setStep("warehouse");
                    }}
                />
            )}


            {step === "warehouse" && seller && (
                <WarehouseScreen
                    seller={seller}
                    onBack={() => setStep("seller")}
                    onPick={(w) => {
                        setWh(w);
                        setStep("scan");
                    }}
                />
            )}


            {step === "scan" && seller && wh && (
                <ScanScreen
                    seller={seller}
                    wh={wh}
                    shipments={shipments}
                    scanned={scanned}
                    setScanned={setScanned}
                    errors={errors}
                    setErrors={setErrors}
                    onBack={() => setStep("warehouse")}
                    onDone={() => setStep("review")}
                />
            )}


            {step === "review" && seller && wh && (
                <ReviewScreen
                    seller={seller}
                    wh={wh}
                    scanned={scanned}
                    onBack={() => setStep("scan")}
                    onConfirm={() => setStep("sign")}
                />
            )}


            {step === "sign" && seller && wh && (
                <SignScreen
                    seller={seller}
                    wh={wh}
                    scanned={scanned}
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


            {step === "preview" && draft && seller && wh && (
                <PdfPreviewScreen
                    draft={draft}
                    seller={seller}
                    wh={wh}
                    scanned={scanned}
                    onBack={() => setStep("sign")}
                    onConfirm={() => {
                        setManifest(draft);
                        setStep("success");
                    }}
                />
            )}


            {step === "success" && manifest && seller && wh && (
                <SuccessScreen
                    manifest={manifest}
                    seller={seller}
                    wh={wh}
                    scanned={scanned}
                    onDone={() => {
                        reset();
                        setStep("dashboard");
                    }}
                />
            )}

        </SafeAreaView>
    )
}

export default ManifestScreen