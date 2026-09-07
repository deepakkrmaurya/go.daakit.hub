export const RIDER = {
  id: "RID1022",
  name: "Rajesh Kumar",
  phone: "+91 98xxxxxx12",
  device: "DKT-PDA-7741",
};

export const SELLERS = [
  { id: "SEL001", name: "ABC Fashion Pvt Ltd", code: "ABC001", phone: "+91 98xxxx1100" },
  { id: "SEL002", name: "Lumen Home Living", code: "LUM042", phone: "+91 98xxxx2233" },
  { id: "SEL003", name: "Northpeak Electronics", code: "NPE018", phone: "+91 98xxxx5577" },
  { id: "SEL004", name: "Greenleaf Organics", code: "GLO007", phone: "+91 98xxxx8181" },
];

export const WAREHOUSES = [
  { id: "WH001", code: "BLR-WH-01", name: "ABC Fashion Bengaluru", address: "Peenya Industrial Area, Bengaluru", sellerId: "SEL001" },
  { id: "WH002", code: "BLR-WH-02", name: "ABC Fashion Whitefield", address: "EPIP Zone, Whitefield, Bengaluru", sellerId: "SEL001" },
  { id: "WH003", code: "LUM-WH-01", name: "Lumen Central DC", address: "Bommasandra, Bengaluru", sellerId: "SEL002" },
  { id: "WH004", code: "NPE-WH-01", name: "Northpeak Hub", address: "Hosur Road, Electronic City", sellerId: "SEL003" },
  { id: "WH005", code: "GLO-WH-01", name: "Greenleaf Farms DC", address: "Devanahalli, Bengaluru", sellerId: "SEL004" },
];

const cities = ["Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Bengaluru", "Jaipur"];

export function makeShipments() {
  const list = [];
  let n = 123456700;

  WAREHOUSES.forEach((w) => {
    for (let i = 0; i < 14; i++) {
      n++;
      const cod = Math.random() > 0.65;
      const prefix = Math.random() > 0.5 ? "DKT" : "DKTGO";
      list.push({
        awb:`${prefix}${n}`,
        orderId: `ORD${1000 + (n % 9000)}`,
        sellerId: w.sellerId,
        warehouseId: w.id,
        payment: cod ? "COD" : "PREPAID",
        cod: cod ? Math.round((300 + Math.random() * 2200) / 10) * 10 : 0,
        city: cities[Math.floor(Math.random() * cities.length)],
        weight: Math.round((0.2 + Math.random() * 4) * 10) / 10,
        status: "READY",
      });
    }
  });

  list[3].status = "MANIFESTED";
  list[3].manifest = "MFST-20260612-000088";

  return list;
}