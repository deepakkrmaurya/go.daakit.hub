import { StyleSheet } from "react-native";

export const PRIMARY = "#0446DB";
export const ACCENT = "#FFC107";
export const BG = "#F6F8FC";
export const CARD = "#FFFFFF";
export const BORDER = "#E5E7EB";
export const TEXT = "#111827";
export const MUTED = "#6B7280";
export const SUCCESS = "#16A34A";
export const DANGER = "#DC2626";
export const WARNING = "#F59E0B";

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG },
    screen: { flex: 1, backgroundColor: BG },
    padding: { padding: 16, gap: 12 },

    topBar: { backgroundColor: PRIMARY },
    topRow: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
    logoBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: { fontWeight: "900", color: TEXT },
    topTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
    topSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
    stepPill: {
        backgroundColor: "rgba(255,255,255,0.12)",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999,
    },
    stepText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    progressBg: { height: 4, backgroundColor: "rgba(255,255,255,0.12)" },
    progressFill: { height: 4, backgroundColor: ACCENT },

    hero: {
        backgroundColor: PRIMARY,
        padding: 20,
        paddingBottom: 32,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
    logoWhite: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    overlineLight: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    heroName: { color: "#fff", fontWeight: "700", fontSize: 14 },
    dutyPill: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
    },
    dot: { width: 7, height: 7, borderRadius: 99, backgroundColor: ACCENT },
    dutyText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    heroTitle: { color: "#fff", fontSize: 27, fontWeight: "800", marginTop: 24 },
    heroSub: { color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 5 },
    heroStats: { flexDirection: "row", gap: 8, marginTop: 20 },
    heroStat: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.07)",
        borderColor: "rgba(255,255,255,0.14)",
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
    },
    heroStatValue: { color: "#fff", fontSize: 21, fontWeight: "800" },
    heroStatLabel: { color: "rgba(255,255,255,0.65)", fontSize: 11 },

    startCard: {
        marginTop: -30,
        backgroundColor: ACCENT,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    startIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "rgba(0,0,0,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    startTitle: { color: TEXT, fontSize: 15, fontWeight: "800" },
    startSub: { color: "rgba(17,24,39,0.7)", fontSize: 12 },

    sectionTitle: {
        color: MUTED,
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 1.6,
        marginTop: 10,
    },

    rowCard: {
        backgroundColor: CARD,
        borderColor: BORDER,
        borderWidth: 1,
        borderRadius: 18,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    rowIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    rowTitle: { fontSize: 14, fontWeight: "800", color: TEXT },
    rowSub: { fontSize: 12, color: MUTED },
    countPill: {
        backgroundColor: ACCENT,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    countText: { color: TEXT, fontWeight: "800", fontSize: 11 },

    noteBox: {
        backgroundColor: "#EEF2F7",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        gap: 10,
    },
    noteText: { flex: 1, color: MUTED, fontSize: 12, lineHeight: 18 },

    searchBox: {
        height: 50,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 9,
    },
    searchInput: { flex: 1, color: TEXT, fontSize: 14 },
    listCard: {
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 18,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: PRIMARY,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { color: "#fff", fontWeight: "900" },
    listTitle: { color: TEXT, fontSize: 14, fontWeight: "800" },
    listSub: { color: MUTED, fontSize: 12, marginTop: 2 },

    qrBtn: {
        height: 56,
        borderRadius: 18,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: ACCENT,
        backgroundColor: "#FFF8DB",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    qrText: { color: TEXT, fontWeight: "800" },
    codeBadge: {
        alignSelf: "flex-start",
        backgroundColor: ACCENT,
        color: TEXT,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        fontWeight: "900",
        fontSize: 11,
    },

    scannerBox: {
        height: 260,
        borderRadius: 20,
        backgroundColor: PRIMARY,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraText: {
        position: "absolute",
        top: 14,
        left: 14,
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
    },
    scanFrame: {
        width: "72%",
        height: "58%",
        borderWidth: 2,
        borderColor: ACCENT,
        borderRadius: 16,
        justifyContent: "center",
    },
    scanLine: { height: 3, backgroundColor: ACCENT },
    simBtn: {
        position: "absolute",
        right: 14,
        bottom: 14,
        backgroundColor: ACCENT,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
    },
    simText: { color: TEXT, fontWeight: "800", fontSize: 12 },

    flashBox: {
        marginTop: 12,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        gap: 10,
        borderWidth: 1,
    },
    flashOk: { backgroundColor: "#ECFDF5", borderColor: "#BBF7D0" },
    flashBad: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
    flashTitle: { color: TEXT, fontWeight: "800", fontSize: 14 },
    flashSub: { color: MUTED, fontSize: 12 },

    linkText: {
        color: MUTED,
        fontSize: 12,
        marginTop: 12,
        textDecorationLine: "underline",
    },
    manualRow: { flexDirection: "row", gap: 8, marginTop: 8 },
    manualInput: {
        flex: 1,
        height: 50,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        paddingHorizontal: 12,
        color: TEXT,
        fontWeight: "700",
    },
    addBtn: {
        height: 50,
        borderRadius: 14,
        backgroundColor: PRIMARY,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
    },
    addText: { color: "#fff", fontWeight: "800" },

    counterRow: { flexDirection: "row", gap: 8, marginTop: 16 },
    counter: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 11,
        alignItems: "center",
    },
    counterValue: { fontSize: 21, fontWeight: "900" },
    counterLabel: {
        fontSize: 9,
        fontWeight: "800",
        textTransform: "uppercase",
        marginTop: 3,
    },

    codBox: {
        backgroundColor: PRIMARY,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    codLabel: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    codValue: { color: "#fff", fontSize: 24, fontWeight: "900" },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scanItem: {
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 8,
    },
    awbText: { color: TEXT, fontSize: 13, fontWeight: "900" },
    payBadge: {
        color: TEXT,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 7,
        fontSize: 10,
        fontWeight: "900",
    },
    errorItem: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        gap: 10,
        marginTop: 8,
    },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: ACCENT,
        borderRadius: 18,
        marginHorizontal: 15
    },
    bottomBarDark: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: "#111827",
    },

    primaryBtn: {
        height: 56,
        borderRadius: 18,
        backgroundColor: ACCENT,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryBtnText: {
        color: TEXT,
        fontSize: 15,
        fontWeight: "900",
        justifyContent: 'center',
        alignItems: 'center'
    },

    ghostBtn: {
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: CARD,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 7,
    },
    ghostText: { color: TEXT, fontWeight: "800" },

    card: {
        backgroundColor: CARD,
        borderColor: BORDER,
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        gap: 5,
    },
    miniLabel: {
        color: MUTED,
        fontSize: 11,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    cardTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
    divider: { height: 1, backgroundColor: BORDER, marginVertical: 10 },

    statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    statBox: {
        width: "48.8%",
        backgroundColor: CARD,
        borderColor: BORDER,
        borderWidth: 1,
        borderRadius: 16,
        padding: 13,
    },
    statLabel: {
        color: MUTED,
        fontSize: 10,
        fontWeight: "900",
        textTransform: "uppercase",
    },
    statValue: { color: TEXT, fontSize: 18, fontWeight: "900", marginTop: 4 },

    accentBox: {
        backgroundColor: ACCENT,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    accentLabel: {
        color: "rgba(17,24,39,0.65)",
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
    },
    accentValue: { color: TEXT, fontSize: 25, fontWeight: "900" },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
    indexText: { color: MUTED, width: 22 },
    payRight: { color: TEXT, fontSize: 12, fontWeight: "800", textAlign: "right" },
    weightRight: { color: MUTED, fontSize: 11, textAlign: "right" },

    warningBox: {
        backgroundColor: "#FFFBEB",
        borderColor: "#FDE68A",
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        gap: 8,
    },
    warningText: { flex: 1, color: TEXT, fontSize: 12 },

    signatureBox: {
        height: 260,
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: CARD,
    },
    noteSmall: { color: MUTED, fontSize: 12, lineHeight: 18 },

    pdfPage: { backgroundColor: "#fff", padding: 18, borderRadius: 4 },
    pdfHeader: {
        borderBottomWidth: 2,
        borderBottomColor: "#111827",
        paddingBottom: 12,
    },
    pdfBrand: { fontSize: 11, fontWeight: "900", letterSpacing: 2, color: TEXT },
    pdfTitle: { fontSize: 20, fontWeight: "900", color: TEXT, marginTop: 6 },
    pdfSmall: { fontSize: 11, color: "#374151", marginTop: 3 },
    pdfSection: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingVertical: 12,
    },
    pdfLabel: {
        color: MUTED,
        fontSize: 10,
        fontWeight: "900",
        textTransform: "uppercase",
        marginTop: 5,
    },
    pdfBold: { color: TEXT, fontWeight: "900", fontSize: 13, marginTop: 3 },
    pdfRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    signImage: {
        height: 80,
        width: "100%",
        resizeMode: "contain",
        backgroundColor: "#fff",
        marginTop: 8,
    },
    editBtn: {
        flex: 1,
        height: 56,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
    },

    confirmBtn: {
        flex: 2,
        height: 56,
        borderRadius: 18,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
    },

    successHero: {
        backgroundColor: PRIMARY,
        paddingTop: 44,
        paddingBottom: 45,
        alignItems: "center",
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    successIcon: {
        width: 70,
        height: 70,
        borderRadius: 999,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
    },
    successTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 14 },
    successSub: { color: "rgba(255,255,255,0.7)", marginTop: 4 },
    manifestPill: {
        marginTop: 14,
        color: "#fff",
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        fontWeight: "900",
    },
    successStats: { flexDirection: "row", gap: 8, marginVertical: 10 },
    miniStat: {
        flex: 1,
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
    },
    miniStatValue: { color: TEXT, fontWeight: "900" },
    miniStatLabel: {
        color: MUTED,
        fontSize: 10,
        marginTop: 2,
        textTransform: "uppercase",
    },
    emailRow: { flexDirection: "row", gap: 8, alignItems: "center", paddingVertical: 5 },
    emailText: { color: TEXT, fontSize: 12, flex: 1 },




    // pdf

    pdfScreen: {
        flex: 1,
        backgroundColor: "#071B3A",
    },

    pdfHeaderBar: {
        backgroundColor: "#041631",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    pdfHeaderTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    pdfHeaderSub: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 10,
        marginTop: 2,
    },

    draftBadge: {
        backgroundColor: "#5A4700",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },

    draftBadgeText: {
        color: "#FFC107",
        fontSize: 10,
        fontWeight: "800",
    },

    pdfCard: {
        margin: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        overflow: "hidden",
    },

    pdfCardHeader: {
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#D1D5DB",
    },

    pdfLogoRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    pdfLogoCircle: {
        width: 28,
        height: 28,
        borderRadius: 20,
        backgroundColor: "#0446DB",
        alignItems: "center",
        justifyContent: "center",
    },

    pdfLogoText: {
        color: "#FFF",
        fontSize: 8,
        fontWeight: "900",
    },

    pdfCompany: {
        marginLeft: 8,
        color: "#111827",
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: "800",
    },

    pdfManifestTitle: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "900",
        marginTop: 5,
    },

    pdfGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 18,
    },

    pdfCol: {
        width: "50%",
        marginBottom: 16,
    },

    pdfSectionLabel: {
        color: "#94A3B8",
        fontSize: 9,
        fontWeight: "800",
        textTransform: "uppercase",
    },

    pdfSectionValue: {
        color: "#111827",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 4,
    },

    pdfSectionSub: {
        color: "#6B7280",
        fontSize: 10,
        marginTop: 2,
    },

    pdfTable: {
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },

    pdfTableHead: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },

    pdfTableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    pdfTotalBox: {
        margin: 18,
        backgroundColor: "#F3F4F6",
        padding: 12,
    },

    pdfSignatureBox: {
        marginHorizontal: 18,
        marginBottom: 18,
        marginTop:10
    },

    signatureCard: {
        height: 70,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFF",
        justifyContent: "center",
    },

    verifyBox: {
        width: 58,
        height: 58,
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#111827",
    },

    reviewBox: {
        marginHorizontal: 12,
        marginTop: 8,
        backgroundColor: "#0B2347",
        borderWidth: 1,
        borderColor: "#23406A",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
    },

    reviewText: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 12,
        lineHeight: 18,
    },

    pdfBottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#071B3A",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
        flexDirection: "row",
        gap: 10,
    },




    // scanner 
    scannerBox: {
        height: 260,
        borderRadius: 20,
        backgroundColor: "#0446DB",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },


    facilityCard: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 28,
  padding: 24,
},

facilityTitle: {
  color: "#111827",
  fontSize: 22,
  fontWeight: "900",
  textAlign: "center",
},

facilitySub: {
  color: "#6B7280",
  fontSize: 13,
  marginTop: 8,
  textAlign: "center",
  lineHeight: 19,
},

facilityInput: {
  width: "100%",
  height: 56,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  backgroundColor: "#F8FAFC",
  borderRadius: 16,
  paddingHorizontal: 16,
  color: "#111827",
  fontSize: 16,
  fontWeight: "800",
  marginTop: 22,
},
}


);






