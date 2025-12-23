const uid = (prefix = "wi") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

// Sample Warehouse In Records
const sampleInRecords = [
  {
    id: uid("wi"),
    inNo: "WI-2024-001",
    inType: "PURCHASE",
    status: "RECEIVED",
    supplierName: "Vina Textile Co.",
    referenceNo: "PO-2024-001",
    inDate: "2024-01-20T08:00:00Z",
    expectedDate: "2024-01-20T17:00:00Z",
    completedDate: "2024-01-20T16:30:00Z",
    notes: "Nhập vải cotton theo đơn hàng mua",
    totalAmount: 112500000,
    currency: "VND",
    exchangeRate: 1,
    warehouse: "Kho A",
    area: "NVL-01",
    items: [
      {
        id: uid("wii"),
        productId: "wp_rm_cotton",
        productCode: "RM_COTTON_001",
        productName: "Vải cotton 100% - Màu trắng",
        unit: "m",
        quantity: 2500,
        unitPrice: 45000,
        totalPrice: 112500000,
        lotNumber: "LOT20240120",
        expiryDate: "2025-01-20T08:00:00Z",
        quality: "A",
        location: "Kho A - NVL-01 - A1-S1-B5",
        notes: "Kiểm tra chất lượng OK"
      }
    ],
    attachments: ["/attachments/WI-2024-001.pdf"],
    createdBy: "Nguyễn Văn A",
    approvedBy: "Trần Văn B",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T16:30:00Z"
  },
  {
    id: uid("wi"),
    inNo: "WI-2024-002",
    inType: "PRODUCTION_RETURN",
    status: "APPROVED",
    referenceNo: "MO-2024-001",
    inDate: "2024-01-19T14:00:00Z",
    expectedDate: "2024-01-19T18:00:00Z",
    notes: "Trả bán thành phẩm từ quá trình sản xuất",
    totalAmount: 12250000,
    currency: "VND",
    exchangeRate: 1,
    warehouse: "Kho C",
    area: "WIP-01",
    items: [
      {
        id: uid("wii"),
        productId: "wp_wip_shirt",
        productCode: "WIP_HALF_SHIRT",
        productName: "Áo sơ mi nửa hoàn thiện",
        unit: "pcs",
        quantity: 350,
        unitPrice: 35000,
        totalPrice: 12250000,
        quality: "B",
        location: "Kho C - WIP-01 - W1-S1-B2",
        notes: "Giai đoạn sau may thân"
      }
    ],
    attachments: [],
    createdBy: "Lê Thị C",
    approvedBy: "Phạm Văn D",
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T17:00:00Z"
  }
];

export function listWarehouseInRecords() {
  const stored = localStorage.getItem('fake_warehouse_in_v1');
  if (!stored) {
    localStorage.setItem('fake_warehouse_in_v1', JSON.stringify(sampleInRecords));
    return sampleInRecords;
  }
  return JSON.parse(stored);
}

export function getWarehouseInRecord(id: string) {
  const records = listWarehouseInRecords();
  return records.find((r: any) => r.id === id) || null;
}

export function createWarehouseInRecord(record: any) {
  const records = listWarehouseInRecords();
  const newRecord = {
    ...record,
    id: uid("wi"),
    inNo: `WI-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  records.unshift(newRecord);
  localStorage.setItem('fake_warehouse_in_v1', JSON.stringify(records));
  return newRecord;
}

export function updateWarehouseInRecord(id: string, updates: any) {
  const records = listWarehouseInRecords();
  const index = records.findIndex((r: any) => r.id === id);
  if (index === -1) return null;
  
  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('fake_warehouse_in_v1', JSON.stringify(records));
  return records[index];
}

