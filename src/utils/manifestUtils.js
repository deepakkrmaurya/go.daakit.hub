export function fmtINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function nowStamp() {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function manifestNo() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return `MFST-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(
    Math.random() * 900000 + 100000
  )}`;
}

export function shortHash() {
  return Array.from(
    { length: 12 },
    () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
}