const uid = (prefix = "acc") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

import type { 
  AccountEntity,
  JournalEntryEntity,
  TrialBalanceItem,
  TrialBalanceReport,
  BalanceSheetReport,
  IncomeStatementReport
} from '../types';

// Sample Chart of Accounts Data
const sampleAccounts: AccountEntity[] = [
  // ASSETS
  {
    id: uid("acc"),
    code: "1",
    name: "TÀI SẢN",
    type: "ASSET",
    level: 0,
    isActive: true,
    isPostable: false,
    description: "Tài sản của doanh nghiệp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "11",
    name: "Tài sản ngắn hạn",
    type: "ASSET",
    parentId: "1",
    level: 1,
    isActive: true,
    isPostable: false,
    description: "Tài sản có thể chuyển đổi thành tiền trong vòng 1 năm",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "111",
    name: "Tiền và tương đương tiền",
    type: "ASSET",
    parentId: "11",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Tiền mặt, tiền gửi ngân hàng",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "1111",
    name: "Tiền mặt",
    type: "ASSET",
    parentId: "111",
    level: 3,
    isActive: true,
    isPostable: true,
    description: "Tiền mặt tại quỹ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "1112",
    name: "Tiền gửi ngân hàng",
    type: "ASSET",
    parentId: "111",
    level: 3,
    isActive: true,
    isPostable: true,
    description: "Tiền gửi tại các ngân hàng",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "112",
    name: "Đầu tư ngắn hạn",
    type: "ASSET",
    parentId: "11",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Các khoản đầu tư ngắn hạn",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "131",
    name: "Phải thu khách hàng",
    type: "ASSET",
    parentId: "11",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Các khoản phải thu từ khách hàng",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "156",
    name: "Hàng hóa",
    type: "ASSET",
    parentId: "11",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Hàng hóa tồn kho",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  // LIABILITIES
  {
    id: uid("acc"),
    code: "2",
    name: "NỢ PHẢI TRẢ",
    type: "LIABILITY",
    level: 0,
    isActive: true,
    isPostable: false,
    description: "Các khoản nợ phải trả",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "21",
    name: "Nợ ngắn hạn",
    type: "LIABILITY",
    parentId: "2",
    level: 1,
    isActive: true,
    isPostable: false,
    description: "Nợ phải trả trong vòng 1 năm",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "211",
    name: "Vay ngắn hạn",
    type: "LIABILITY",
    parentId: "21",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Các khoản vay ngắn hạn",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "331",
    name: "Phải trả người bán",
    type: "LIABILITY",
    parentId: "21",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Các khoản phải trả cho nhà cung cấp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "333",
    name: "Thuế và các khoản phải nộp Nhà nước",
    type: "LIABILITY",
    parentId: "21",
    level: 2,
    isActive: true,
    isPostable: true,
    description: "Thuế GTGT, thuế TNDN, thuế TNCN",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  // EQUITY
  {
    id: uid("acc"),
    code: "3",
    name: "VỐN CHỦ SỞ HỮU",
    type: "EQUITY",
    level: 0,
    isActive: true,
    isPostable: false,
    description: "Vốn chủ sở hữu và các quỹ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "411",
    name: "Vốn góp của chủ sở hữu",
    type: "EQUITY",
    parentId: "3",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Vốn góp của các cổ đông",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "421",
    name: "Lợi nhuận sau thuế chưa phân phối",
    type: "EQUITY",
    parentId: "3",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Lợi nhuận sau thuế chưa phân phối",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  // REVENUE
  {
    id: uid("acc"),
    code: "5",
    name: "DOANH THU",
    type: "REVENUE",
    level: 0,
    isActive: true,
    isPostable: false,
    description: "Doanh thu từ hoạt động kinh doanh",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "511",
    name: "Doanh thu bán hàng",
    type: "REVENUE",
    parentId: "5",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Doanh thu từ bán hàng",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  // EXPENSES
  {
    id: uid("acc"),
    code: "6",
    name: "CHI PHÍ",
    type: "EXPENSE",
    level: 0,
    isActive: true,
    isPostable: false,
    description: "Chi phí hoạt động kinh doanh",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "621",
    name: "Chi phí nguyên liệu, vật liệu",
    type: "EXPENSE",
    parentId: "6",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Chi phí nguyên liệu, vật liệu trực tiếp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "622",
    name: "Chi phí nhân công trực tiếp",
    type: "EXPENSE",
    parentId: "6",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Chi phí nhân công trực tiếp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "641",
    name: "Chi phí bán hàng",
    type: "EXPENSE",
    parentId: "6",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Chi phí bán hàng và marketing",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: uid("acc"),
    code: "642",
    name: "Chi phí quản lý doanh nghiệp",
    type: "EXPENSE",
    parentId: "6",
    level: 1,
    isActive: true,
    isPostable: true,
    description: "Chi phí quản lý và điều hành",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Sample Journal Entries
const sampleJournalEntries: JournalEntryEntity[] = [
  {
    id: uid("je"),
    entryNo: "JE-2024-001",
    entryDate: "2024-01-20",
    description: "Định khoản bán hàng - Hóa đơn S001",
    totalDebit: 110000000,
    totalCredit: 110000000,
    status: "POSTED",
    source: "AUTO",
    sourceReference: "SO-S001",
    postedBy: "accountant",
    postedAt: "2024-01-20T10:00:00Z",
    items: [
      {
        id: uid("jei"),
        accountId: "131",
        accountCode: "131",
        accountName: "Phải thu khách hàng",
        debitAmount: 110000000,
        creditAmount: 0,
        description: "Bán hàng cho khách hàng ABC",
        reference: "SO-S001"
      },
      {
        id: uid("jei"),
        accountId: "511",
        accountCode: "511",
        accountName: "Doanh thu bán hàng",
        debitAmount: 0,
        creditAmount: 100000000,
        description: "Doanh thu bán hàng tháng 1/2024",
        reference: "SO-S001"
      },
      {
        id: uid("jei"),
        accountId: "333",
        accountCode: "333",
        accountName: "Thuế GTGT phải nộp",
        debitAmount: 0,
        creditAmount: 10000000,
        description: "Thuế GTGT 10%",
        reference: "SO-S001"
      }
    ],
    createdBy: "system",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: uid("je"),
    entryNo: "JE-2024-002",
    entryDate: "2024-01-22",
    description: "Định khoản mua hàng - Đơn mua PO-2024-002",
    totalDebit: 25000000,
    totalCredit: 25000000,
    status: "POSTED",
    source: "AUTO",
    sourceReference: "PO-2024-002",
    postedBy: "accountant",
    postedAt: "2024-01-22T14:00:00Z",
    items: [
      {
        id: uid("jei"),
        accountId: "621",
        accountCode: "621",
        accountName: "Chi phí nguyên liệu, vật liệu",
        debitAmount: 22727273,
        creditAmount: 0,
        description: "Mua chỉ cotton và phụ kiện",
        reference: "PO-2024-002"
      },
      {
        id: uid("jei"),
        accountId: "333",
        accountCode: "333",
        accountName: "Thuế GTGT phải nộp",
        debitAmount: 2272727,
        creditAmount: 0,
        description: "Thuế GTGT đầu vào 10%",
        reference: "PO-2024-002"
      },
      {
        id: uid("jei"),
        accountId: "331",
        accountCode: "331",
        accountName: "Phải trả người bán",
        debitAmount: 0,
        creditAmount: 25000000,
        description: "Phải trả nhà cung cấp Bình Minh",
        reference: "PO-2024-002"
      }
    ],
    createdBy: "system",
    createdAt: "2024-01-22T14:00:00Z",
    updatedAt: "2024-01-22T14:00:00Z"
  }
];

// Account functions
export function listAccounts(): AccountEntity[] {
  const stored = localStorage.getItem('fake_accounts_v1');
  if (!stored) {
    localStorage.setItem('fake_accounts_v1', JSON.stringify(sampleAccounts));
    return sampleAccounts;
  }
  return JSON.parse(stored);
}

export function getAccount(id: string): AccountEntity | null {
  const accounts = listAccounts();
  return accounts.find(account => account.id === id) || null;
}

export function getAccountsByType(type: string): AccountEntity[] {
  const accounts = listAccounts();
  return accounts.filter(account => account.type === type);
}

// Journal Entry functions
export function listJournalEntries(): JournalEntryEntity[] {
  const stored = localStorage.getItem('fake_journal_entries_v1');
  if (!stored) {
    localStorage.setItem('fake_journal_entries_v1', JSON.stringify(sampleJournalEntries));
    return sampleJournalEntries;
  }
  return JSON.parse(stored);
}

export function getJournalEntry(id: string): JournalEntryEntity | null {
  const entries = listJournalEntries();
  return entries.find(entry => entry.id === id) || null;
}

export function createJournalEntry(entry: Omit<JournalEntryEntity, 'id' | 'entryNo' | 'createdAt' | 'updatedAt'>): JournalEntryEntity {
  const entries = listJournalEntries();
  const newEntry: JournalEntryEntity = {
    ...entry,
    id: uid("je"),
    entryNo: `JE-${new Date().getFullYear()}-${String(entries.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  entries.unshift(newEntry);
  localStorage.setItem('fake_journal_entries_v1', JSON.stringify(entries));
  return newEntry;
}

// Trial Balance Report
export function generateTrialBalance(asOfDate: string): TrialBalanceReport {
  const accounts = listAccounts();
  const postableAccounts = accounts.filter(acc => acc.isPostable);
  
  // Mock balances - in real app, these would be calculated from journal entries
  const items: TrialBalanceItem[] = postableAccounts.map(account => {
    const balance = Math.floor(Math.random() * 100000000);
    const isDebit = ['ASSET', 'EXPENSE'].includes(account.type);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.type,
      debitBalance: isDebit ? balance : 0,
      creditBalance: !isDebit ? balance : 0
    };
  });
  
  const totalDebit = items.reduce((sum, item) => sum + item.debitBalance, 0);
  const totalCredit = items.reduce((sum, item) => sum + item.creditBalance, 0);
  
  return {
    asOfDate,
    items,
    totalDebit,
    totalCredit,
    isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
  };
}

// Balance Sheet Report
export function generateBalanceSheet(asOfDate: string): BalanceSheetReport {
  const accounts = listAccounts();
  
  const assets = accounts.filter(acc => acc.type === 'ASSET' && acc.isPostable).map(account => {
    const amount = Math.floor(Math.random() * 200000000);
    const previousAmount = Math.floor(amount * 0.8);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.type,
      currentAmount: amount,
      previousAmount,
      variance: amount - previousAmount,
      variancePercent: ((amount - previousAmount) / previousAmount) * 100
    };
  });
  
  const liabilities = accounts.filter(acc => acc.type === 'LIABILITY' && acc.isPostable).map(account => {
    const amount = Math.floor(Math.random() * 100000000);
    const previousAmount = Math.floor(amount * 0.9);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.type,
      currentAmount: amount,
      previousAmount,
      variance: amount - previousAmount,
      variancePercent: ((amount - previousAmount) / previousAmount) * 100
    };
  });
  
  const equity = accounts.filter(acc => acc.type === 'EQUITY' && acc.isPostable).map(account => {
    const amount = Math.floor(Math.random() * 150000000);
    const previousAmount = Math.floor(amount * 0.95);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.type,
      currentAmount: amount,
      previousAmount,
      variance: amount - previousAmount,
      variancePercent: ((amount - previousAmount) / previousAmount) * 100
    };
  });
  
  const totalAssets = assets.reduce((sum, item) => sum + item.currentAmount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.currentAmount, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.currentAmount, 0);
  
  return {
    asOfDate,
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity
  };
}

// Income Statement Report
export function generateIncomeStatement(fromDate: string, toDate: string): IncomeStatementReport {
  const accounts = listAccounts();
  
  const revenue = accounts.filter(acc => acc.type === 'REVENUE' && acc.isPostable).map(account => {
    const currentPeriod = Math.floor(Math.random() * 500000000);
    const previousPeriod = Math.floor(currentPeriod * 0.85);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      currentPeriod,
      previousPeriod,
      variance: currentPeriod - previousPeriod,
      variancePercent: ((currentPeriod - previousPeriod) / previousPeriod) * 100
    };
  });
  
  const expenses = accounts.filter(acc => acc.type === 'EXPENSE' && acc.isPostable).map(account => {
    const currentPeriod = Math.floor(Math.random() * 300000000);
    const previousPeriod = Math.floor(currentPeriod * 0.9);
    
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      currentPeriod,
      previousPeriod,
      variance: currentPeriod - previousPeriod,
      variancePercent: ((currentPeriod - previousPeriod) / previousPeriod) * 100
    };
  });
  
  const totalRevenue = revenue.reduce((sum, item) => sum + item.currentPeriod, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.currentPeriod, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  return {
    fromDate,
    toDate,
    revenue,
    expenses,
    totalRevenue,
    totalExpenses,
    netIncome
  };
}

// Statistics function
export function getAccountingStats() {
  const entries = listJournalEntries();
  const accounts = listAccounts();
  const postedEntries = entries.filter(e => e.status === 'POSTED').length;
  const draftEntries = entries.filter(e => e.status === 'DRAFT').length;
  const reversedEntries = entries.filter(e => e.status === 'REVERSED').length;
  const totalEntries = entries.length;
  
  const totalDebit = entries
    .filter(e => e.status === 'POSTED')
    .reduce((sum, e) => sum + e.totalDebit, 0);
  
  const totalCredit = entries
    .filter(e => e.status === 'POSTED')
    .reduce((sum, e) => sum + e.totalCredit, 0);
  
  // Tính tổng tài sản, nợ phải trả, vốn chủ sở hữu
  const assetAccounts = accounts.filter(a => a.type === 'ASSET' && a.isPostable);
  const liabilityAccounts = accounts.filter(a => a.type === 'LIABILITY' && a.isPostable);
  const equityAccounts = accounts.filter(a => a.type === 'EQUITY' && a.isPostable);
  const revenueAccounts = accounts.filter(a => a.type === 'REVENUE' && a.isPostable);
  const expenseAccounts = accounts.filter(a => a.type === 'EXPENSE' && a.isPostable);
  
  // Mock số dư cho các tài khoản
  const totalAssets = assetAccounts.reduce((sum, acc) => sum + Math.floor(Math.random() * 1000000000), 0);
  const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + Math.floor(Math.random() * 500000000), 0);
  const totalEquity = equityAccounts.reduce((sum, acc) => sum + Math.floor(Math.random() * 800000000), 0);
  const monthlyRevenue = revenueAccounts.reduce((sum, acc) => sum + Math.floor(Math.random() * 200000000), 0);
  const monthlyExpenses = expenseAccounts.reduce((sum, acc) => sum + Math.floor(Math.random() * 150000000), 0);
  const netIncome = monthlyRevenue - monthlyExpenses;
  
  // Dữ liệu cho biểu đồ doanh thu vs chi phí theo tháng
  const revenueExpenseData = [
    { month: 'Tháng 1', revenue: 1200000000, expense: 980000000 },
    { month: 'Tháng 2', revenue: 1450000000, expense: 1150000000 },
    { month: 'Tháng 3', revenue: 980000000, expense: 920000000 },
    { month: 'Tháng 4', revenue: 1670000000, expense: 1340000000 },
    { month: 'Tháng 5', revenue: 1890000000, expense: 1520000000 },
    { month: 'Tháng 6', revenue: 2100000000, expense: 1680000000 },
  ];
  
  // Phân bố số dư tài khoản
  const accountBalanceData = [
    { category: 'Tiền mặt', balance: 450000000, color: '#52c41a' },
    { category: 'Ngân hàng', balance: 1250000000, color: '#1890ff' },
    { category: 'Khoản phải thu', balance: 890000000, color: '#722ed1' },
    { category: 'Khoản phải trả', balance: -560000000, color: '#ff4d4f' },
    { category: 'Tồn kho', balance: 2100000000, color: '#faad14' },
  ];
  
  // Bút toán theo tháng
  const journalEntriesByMonth = [
    { month: 'Tháng 1', entries: 245, amount: 2180000000 },
    { month: 'Tháng 2', entries: 312, amount: 2600000000 },
    { month: 'Tháng 3', entries: 189, amount: 1820000000 },
    { month: 'Tháng 4', entries: 378, amount: 3010000000 },
    { month: 'Tháng 5', entries: 425, amount: 3410000000 },
    { month: 'Tháng 6', entries: 467, amount: 3780000000 },
  ];
  
  return {
    totalAccounts: accounts.filter(a => a.isPostable).length,
    postableAccounts: assetAccounts.length + liabilityAccounts.length + equityAccounts.length + revenueAccounts.length + expenseAccounts.length,
    totalEntries,
    postedEntries,
    draftEntries,
    reversedEntries,
    totalDebit,
    totalCredit,
    balance: totalDebit - totalCredit,
    totalAssets,
    totalLiabilities,
    totalEquity,
    monthlyRevenue,
    monthlyExpenses,
    netIncome,
    revenueExpenseData,
    accountBalanceData,
    journalEntriesByMonth,
    entryStatusDistribution: {
      POSTED: postedEntries,
      DRAFT: draftEntries,
      REVERSED: reversedEntries
    },
    financialRatios: {
      currentRatio: totalAssets / totalLiabilities || 0,
      debtToEquity: totalLiabilities / totalEquity || 0,
      profitMargin: (netIncome / monthlyRevenue) * 100 || 0
    }
  };
}
