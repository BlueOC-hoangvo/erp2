// Chart of Accounts Types
export interface AccountEntity {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentId?: string;
  level: number;
  isActive: boolean;
  isPostable: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Journal Entry Types
export interface JournalEntryItem {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
  reference: string;
}

export interface JournalEntryEntity {
  id: string;
  entryNo: string;
  entryDate: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  source: 'MANUAL' | 'AUTO' | 'IMPORT';
  sourceReference?: string;
  postedBy?: string;
  postedAt?: string;
  reversedBy?: string;
  reversedAt?: string;
  reversedReason?: string;
  items: JournalEntryItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice Types
export interface InvoiceEntity {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  type: 'SALES' | 'PURCHASE';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  exchangeRate: number;
  notes: string;
  items: InvoiceItem[];
  journalEntryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Payment Types
export interface PaymentEntity {
  id: string;
  paymentNo: string;
  paymentDate: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CARD';
  reference: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: 'RECEIPT' | 'PAYMENT';
  partyType: 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE';
  partyId: string;
  partyName: string;
  invoiceIds: string[];
  bankAccountId?: string;
  checkNumber?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Financial Report Types
export interface TrialBalanceItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
}

export interface TrialBalanceReport {
  asOfDate: string;
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface BalanceSheetItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  currentAmount: number;
  previousAmount: number;
  variance: number;
  variancePercent: number;
}

export interface BalanceSheetReport {
  asOfDate: string;
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface IncomeStatementItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  currentPeriod: number;
  previousPeriod: number;
  variance: number;
  variancePercent: number;
}

export interface IncomeStatementReport {
  fromDate: string;
  toDate: string;
  revenue: IncomeStatementItem[];
  expenses: IncomeStatementItem[];
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

// Cost Center Types
export interface CostCenterEntity {
  id: string;
  code: string;
  name: string;
  type: 'PRODUCTION' | 'ADMINISTRATION' | 'SALES' | 'RESEARCH';
  manager: string;
  budget: number;
  actualCost: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Constants
export const ACCOUNT_TYPES = [
  { key: 'ASSET', label: 'Tài sản', color: 'blue' },
  { key: 'LIABILITY', label: 'Nợ phải trả', color: 'red' },
  { key: 'EQUITY', label: 'Vốn chủ sở hữu', color: 'green' },
  { key: 'REVENUE', label: 'Doanh thu', color: 'gold' },
  { key: 'EXPENSE', label: 'Chi phí', color: 'orange' }
] as const;

export const PAYMENT_METHODS = [
  { key: 'CASH', label: 'Tiền mặt' },
  { key: 'BANK_TRANSFER', label: 'Chuyển khoản' },
  { key: 'CHECK', label: 'Séc' },
  { key: 'CARD', label: 'Thẻ' }
] as const;

export const INVOICE_STATUSES = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'SENT', label: 'Đã gửi', color: 'blue' },
  { key: 'PAID', label: 'Đã thanh toán', color: 'green' },
  { key: 'OVERDUE', label: 'Quá hạn', color: 'red' },
  { key: 'CANCELLED', label: 'Hủy', color: 'orange' }
] as const;

export const JOURNAL_ENTRY_STATUSES = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'POSTED', label: 'Đã ghi sổ', color: 'green' },
  { key: 'REVERSED', label: 'Đã đảo', color: 'red' }
] as const;
