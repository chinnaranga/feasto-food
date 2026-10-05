import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/services/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type DateRangePreset = 'today' | 'week' | 'month' | 'quarter' | 'ytd';

export interface SubscriptionBilling {
  planTier: 'Growth' | 'Pro Merchant' | 'Enterprise';
  status: 'active' | 'past_due' | 'canceled';
  monthlyFee: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  paymentMethod: {
    cardBrand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingEmail: string;
  autoRenew: boolean;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  entityName: string;
  entityEmail: string;
  amount: number;
  taxAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
}

export type PayoutStatus = 'pending' | 'completed' | 'failed' | 'processing';

export interface PayoutBreakdown {
  grossSales: number;
  platformCommission: number;
  gatewayFee: number;
  deliveryPartnerFee: number;
  packagingFeeCollected: number;
  taxCollected: number;
  netSettlement: number;
}

export interface Payout {
  id: string;
  payoutNumber: string;
  amount: number;
  status: PayoutStatus;
  settlementDate: string;
  branchId: string;
  branchName: string;
  orderCount: number;
  breakdown: PayoutBreakdown;
  bankAccountLast4: string;
}

export interface TaxRecord {
  id: string;
  gstin: string;
  period: string; // e.g. "July 2026"
  totalTaxableSales: number;
  totalExemptSales: number;
  cgstCollected: number;
  sgstCollected: number;
  igstCollected: number;
  totalTaxCollected: number;
  status: 'ready' | 'filed' | 'pending';
}

export type ExpenseCategory =
  | 'vendor'
  | 'packaging'
  | 'ingredients'
  | 'payroll'
  | 'utilities'
  | 'rent'
  | 'operational';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendorName: string;
  amount: number;
  date: string;
  paymentStatus: 'paid' | 'pending';
  receiptRef?: string;
  notes?: string;
}

export type RefundReason =
  | 'item-missing'
  | 'quality-issue'
  | 'late-delivery'
  | 'cancelled-by-store'
  | 'customer-request';

export interface RefundRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  type: 'full' | 'partial';
  reason: RefundReason;
  status: 'requested' | 'approved' | 'processed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export type ReconciliationStatus = 'matched' | 'unreconciled' | 'discrepancy-flagged';

export interface ReconciliationItem {
  id: string;
  orderId: string;
  expectedAmount: number;
  settledAmount: number;
  discrepancy: number;
  status: ReconciliationStatus;
  paymentGateway: string;
  transactionDate: string;
  notes?: string;
}

export interface FeeBreakdown {
  orderId: string;
  grossSales: number;
  platformCommissionPct: number;
  platformCommissionAmt: number;
  gatewayFeeAmt: number;
  deliveryFeeAmt: number;
  packagingFeeAmt: number;
  taxAmt: number;
  netRevenue: number;
}

export interface FinancialInsight {
  id: string;
  title: string;
  type: 'anomaly' | 'optimization' | 'tax-risk' | 'forecast' | 'margin-leak';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  metricImpact?: string;
  actionLabel?: string;
}

// ─── Initial Mock Data Sets ──────────────────────────────────────────────────

const MOCK_SUBSCRIPTION: SubscriptionBilling = {
  planTier: 'Pro Merchant',
  status: 'active',
  monthlyFee: 4999,
  billingCycle: 'monthly',
  nextBillingDate: '2026-08-01',
  paymentMethod: {
    cardBrand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2028,
  },
  billingEmail: 'finance@sorasushi.com',
  autoRenew: true,
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    entityName: 'Tokyo Fish Market Traders',
    entityEmail: 'billing@tokyofish.co.jp',
    amount: 34500,
    taxAmount: 6210,
    status: 'paid',
    dueDate: '2026-07-15',
    createdAt: '2026-07-01',
    paidAt: '2026-07-14',
    lineItems: [
      { id: 'li-1', description: 'Fresh Sashimi Grade Atlantic Salmon (15 kg)', quantity: 15, unitPrice: 1800, total: 27000 },
      { id: 'li-2', description: 'Bluefin Tuna Loin Cuts (5 kg)', quantity: 5, unitPrice: 1500, total: 7500 },
    ],
    notes: 'Payment settled via direct HDFC NEFT transaction.',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-002',
    entityName: 'EcoPack Solutions India',
    entityEmail: 'accounts@ecopack.in',
    amount: 12800,
    taxAmount: 2304,
    status: 'overdue',
    dueDate: '2026-07-18',
    createdAt: '2026-07-04',
    lineItems: [
      { id: 'li-3', description: 'Biodegradable Sushi Bento Boxes (500 units)', quantity: 500, unitPrice: 18, total: 9000 },
      { id: 'li-4', description: 'Custom Printed Chopsticks Packs (1000 units)', quantity: 1000, unitPrice: 3.8, total: 3800 },
    ],
    notes: 'Second reminder notice transmitted to vendor.',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-003',
    entityName: 'Nippon Rice Exporters',
    entityEmail: 'finance@nipponrice.co.jp',
    amount: 18400,
    taxAmount: 3312,
    status: 'draft',
    dueDate: '2026-07-30',
    createdAt: '2026-07-20',
    lineItems: [
      { id: 'li-5', description: 'Premium Koshihikari Sushi Rice (100 kg)', quantity: 100, unitPrice: 184, total: 18400 },
    ],
  },
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'pay-501',
    payoutNumber: 'SETTLE-2026-029',
    amount: 142850,
    status: 'completed',
    settlementDate: '2026-07-19',
    branchId: 'sora-sushi',
    branchName: 'Sora Sushi — Downtown Flagship',
    orderCount: 184,
    breakdown: {
      grossSales: 168500,
      platformCommission: 16850,
      gatewayFee: 3370,
      deliveryPartnerFee: 8425,
      packagingFeeCollected: 4200,
      taxCollected: 8425,
      netSettlement: 142850,
    },
    bankAccountLast4: '8819',
  },
  {
    id: 'pay-502',
    payoutNumber: 'SETTLE-2026-030',
    amount: 98400,
    status: 'processing',
    settlementDate: '2026-07-22',
    branchId: 'artisan-table',
    branchName: 'Artisan Table — Koramangala',
    orderCount: 112,
    breakdown: {
      grossSales: 115000,
      platformCommission: 11500,
      gatewayFee: 2300,
      deliveryPartnerFee: 5750,
      packagingFeeCollected: 2800,
      taxCollected: 5750,
      netSettlement: 98400,
    },
    bankAccountLast4: '4102',
  },
  {
    id: 'pay-503',
    payoutNumber: 'SETTLE-2026-031',
    amount: 45200,
    status: 'pending',
    settlementDate: '2026-07-24',
    branchId: 'sora-sushi',
    branchName: 'Sora Sushi — Downtown Flagship',
    orderCount: 54,
    breakdown: {
      grossSales: 52000,
      platformCommission: 5200,
      gatewayFee: 1040,
      deliveryPartnerFee: 2600,
      packagingFeeCollected: 1200,
      taxCollected: 2600,
      netSettlement: 45200,
    },
    bankAccountLast4: '8819',
  },
];

const MOCK_TAXES: TaxRecord[] = [
  {
    id: 'tax-2026-q2',
    gstin: '29ABCDE1234F1Z5',
    period: 'Q2 2026 (Apr - Jun)',
    totalTaxableSales: 1245000,
    totalExemptSales: 45000,
    cgstCollected: 31125,
    sgstCollected: 31125,
    igstCollected: 0,
    totalTaxCollected: 62250,
    status: 'filed',
  },
  {
    id: 'tax-2026-jul',
    gstin: '29ABCDE1234F1Z5',
    period: 'July 2026 (Current Period)',
    totalTaxableSales: 485000,
    totalExemptSales: 12000,
    cgstCollected: 12125,
    sgstCollected: 12125,
    igstCollected: 0,
    totalTaxCollected: 24250,
    status: 'ready',
  },
];

const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    title: 'Salmon & Seafood Vendor Weekly Invoice',
    category: 'ingredients',
    vendorName: 'Tokyo Fish Market Traders',
    amount: 34500,
    date: '2026-07-14',
    paymentStatus: 'paid',
    receiptRef: 'REC-9012',
    notes: 'Paid via bank transfer',
  },
  {
    id: 'exp-02',
    title: 'Eco Bento Boxes & Chopsticks Batch #4',
    category: 'packaging',
    vendorName: 'EcoPack Solutions India',
    amount: 12800,
    date: '2026-07-04',
    paymentStatus: 'pending',
    receiptRef: 'REC-9015',
  },
  {
    id: 'exp-03',
    title: 'Kitchen Staff Bi-Weekly Payroll Allocation',
    category: 'payroll',
    vendorName: 'Internal Kitchen Roster',
    amount: 85000,
    date: '2026-07-15',
    paymentStatus: 'paid',
  },
  {
    id: 'exp-04',
    title: 'Store Rent — Shinjuku Premises',
    category: 'rent',
    vendorName: 'Shinjuku Commercial Realty',
    amount: 120000,
    date: '2026-07-01',
    paymentStatus: 'paid',
  },
  {
    id: 'exp-05',
    title: 'Electricity & High-Capacity Freezer Power Utility',
    category: 'utilities',
    vendorName: 'Tokyo Electric Power Co.',
    amount: 16400,
    date: '2026-07-10',
    paymentStatus: 'paid',
  },
];

const MOCK_REFUNDS: RefundRecord[] = [
  {
    id: 'ref-101',
    orderId: 'FST-892104',
    customerName: 'Aarav Sharma',
    amount: 480,
    type: 'full',
    reason: 'cancelled-by-store',
    status: 'processed',
    requestedAt: '2026-07-18T14:20:00Z',
    processedAt: '2026-07-18T14:25:00Z',
  },
  {
    id: 'ref-102',
    orderId: 'FST-773412',
    customerName: 'Priya Nair',
    amount: 180,
    type: 'partial',
    reason: 'item-missing',
    status: 'approved',
    requestedAt: '2026-07-19T19:40:00Z',
  },
  {
    id: 'ref-103',
    orderId: 'FST-662190',
    customerName: 'Kavita Patel',
    amount: 980,
    type: 'full',
    reason: 'quality-issue',
    status: 'requested',
    requestedAt: '2026-07-20T20:15:00Z',
  },
];

const MOCK_RECONCILIATION: ReconciliationItem[] = [
  {
    id: 'rec-01',
    orderId: 'FST-892104',
    expectedAmount: 522,
    settledAmount: 522,
    discrepancy: 0,
    status: 'matched',
    paymentGateway: 'Razorpay UPI',
    transactionDate: '2026-07-18',
  },
  {
    id: 'rec-02',
    orderId: 'FST-773412',
    expectedAmount: 940,
    settledAmount: 910,
    discrepancy: -30,
    status: 'discrepancy-flagged',
    paymentGateway: 'Stripe Card',
    transactionDate: '2026-07-19',
    notes: 'Gateway extra processing fee deduction of ₹30 logged.',
  },
  {
    id: 'rec-03',
    orderId: 'FST-662190',
    expectedAmount: 1120,
    settledAmount: 0,
    discrepancy: -1120,
    status: 'unreconciled',
    paymentGateway: 'Paytm Wallet',
    transactionDate: '2026-07-20',
    notes: 'Bank clearance pending for transaction.',
  },
];

const MOCK_FEES: FeeBreakdown[] = [
  {
    orderId: 'FST-892104',
    grossSales: 520,
    platformCommissionPct: 10,
    platformCommissionAmt: 52,
    gatewayFeeAmt: 10.4,
    deliveryFeeAmt: 0,
    packagingFeeAmt: 25,
    taxAmt: 26,
    netRevenue: 431.6,
  },
  {
    orderId: 'FST-773412',
    grossSales: 940,
    platformCommissionPct: 10,
    platformCommissionAmt: 94,
    gatewayFeeAmt: 18.8,
    deliveryFeeAmt: 35,
    packagingFeeAmt: 30,
    taxAmt: 47,
    netRevenue: 745.2,
  },
];

const MOCK_AI_INSIGHTS: FinancialInsight[] = [
  {
    id: 'ai-fin-1',
    title: 'Revenue Anomaly Detected',
    type: 'anomaly',
    severity: 'warning',
    description: 'Weekend dinner net revenue spiked +28% due to high volume of Omakase Salmon Roll sales.',
    metricImpact: '+₹42,000 impact',
    actionLabel: 'View Breakdown',
  },
  {
    id: 'ai-fin-2',
    title: 'Packaging Expense Optimization',
    type: 'optimization',
    severity: 'info',
    description: 'Bulk ordering Bento Boxes in units of 2,000 reduces unit packaging costs by 14%.',
    metricImpact: 'Save ₹4,800/mo',
    actionLabel: 'Optimize Order',
  },
  {
    id: 'ai-fin-3',
    title: 'Margin Leak Warning',
    type: 'margin-leak',
    severity: 'critical',
    description: 'Payment gateway fees on credit card transactions exceeded estimated parameters by 1.2%.',
    metricImpact: '₹1,240 leak',
    actionLabel: 'Reconcile Gateway',
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface FinanceState {
  subscription: SubscriptionBilling;
  invoices: Invoice[];
  payouts: Payout[];
  taxes: TaxRecord[];
  expenses: Expense[];
  refunds: RefundRecord[];
  reconciliation: ReconciliationItem[];
  fees: FeeBreakdown[];
  insights: FinancialInsight[];

  dateRangePreset: DateRangePreset;
  selectedBranchId: string;
  searchQuery: string;
  statusFilter: string;

  // Actions
  setDateRangePreset: (preset: DateRangePreset) => void;
  setSelectedBranchId: (branchId: string) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (filter: string) => void;

  // Invoice Actions
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  duplicateInvoice: (id: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: 'paid' | 'pending') => void;

  // Refund Actions
  approveRefund: (id: string) => void;
  rejectRefund: (id: string) => void;

  // Reconciliation Actions
  resolveReconciliation: (id: string, notes?: string) => void;

  // Firestore Sync Listener
  initializeFinanceSync: () => () => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────

export const usePortalFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      subscription: MOCK_SUBSCRIPTION,
      invoices: MOCK_INVOICES,
      payouts: MOCK_PAYOUTS,
      taxes: MOCK_TAXES,
      expenses: MOCK_EXPENSES,
      refunds: MOCK_REFUNDS,
      reconciliation: MOCK_RECONCILIATION,
      fees: MOCK_FEES,
      insights: MOCK_AI_INSIGHTS,

      dateRangePreset: 'month',
      selectedBranchId: 'all',
      searchQuery: '',
      statusFilter: 'all',

      setDateRangePreset: (dateRangePreset) => set({ dateRangePreset }),
      setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      createInvoice: (invoiceData) => {
        const id = `inv-${Date.now()}`;
        const newInv: Invoice = {
          ...invoiceData,
          id,
          createdAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({ invoices: [newInv, ...state.invoices] }));

        // Firestore async write
        try {
          setDoc(doc(db, 'portal_invoices', id), newInv);
        } catch (e) {
          console.warn('Firestore invoice write backup', e);
        }
      },

      updateInvoiceStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status,
                  paidAt: status === 'paid' ? new Date().toISOString().split('T')[0] : inv.paidAt,
                }
              : inv
          ),
        }));

        try {
          setDoc(doc(db, 'portal_invoices', id), { status }, { merge: true });
        } catch (e) {
          console.warn('Firestore invoice status sync', e);
        }
      },

      duplicateInvoice: (id) => {
        const target = get().invoices.find((i) => i.id === id);
        if (target) {
          const newId = `inv-${Date.now()}`;
          const duplicated: Invoice = {
            ...target,
            id: newId,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            status: 'draft',
            createdAt: new Date().toISOString().split('T')[0],
            paidAt: undefined,
          };
          set((state) => ({ invoices: [duplicated, ...state.invoices] }));
          try {
            setDoc(doc(db, 'portal_invoices', newId), duplicated);
          } catch (e) {
            console.warn('Firestore duplicate invoice write', e);
          }
        }
      },

      addExpense: (expenseData) => {
        const id = `exp-${Date.now()}`;
        const newExp: Expense = { ...expenseData, id };
        set((state) => ({ expenses: [newExp, ...state.expenses] }));

        try {
          setDoc(doc(db, 'portal_expenses', id), newExp);
        } catch (e) {
          console.warn('Firestore expense write', e);
        }
      },

      updateExpenseStatus: (id, status) => {
        set((state) => ({
          expenses: state.expenses.map((exp) => (exp.id === id ? { ...exp, paymentStatus: status } : exp)),
        }));
      },

      approveRefund: (id) => {
        set((state) => ({
          refunds: state.refunds.map((ref) =>
            ref.id === id ? { ...ref, status: 'approved', processedAt: new Date().toISOString() } : ref
          ),
        }));
      },

      rejectRefund: (id) => {
        set((state) => ({
          refunds: state.refunds.map((ref) => (ref.id === id ? { ...ref, status: 'rejected' } : ref)),
        }));
      },

      resolveReconciliation: (id, notes) => {
        set((state) => ({
          reconciliation: state.reconciliation.map((rec) =>
            rec.id === id ? { ...rec, status: 'matched', discrepancy: 0, notes } : rec
          ),
        }));
      },

      initializeFinanceSync: () => {
        const unsubInvoices = onSnapshot(collection(db, 'portal_invoices'), (snap) => {
          if (!snap.empty) {
            const list: Invoice[] = [];
            snap.forEach((docSnap) => list.push({ ...docSnap.data(), id: docSnap.id } as Invoice));
            set({ invoices: list });
          }
        });

        const unsubExpenses = onSnapshot(collection(db, 'portal_expenses'), (snap) => {
          if (!snap.empty) {
            const list: Expense[] = [];
            snap.forEach((docSnap) => list.push({ ...docSnap.data(), id: docSnap.id } as Expense));
            set({ expenses: list });
          }
        });

        return () => {
          unsubInvoices();
          unsubExpenses();
        };
      },
    }),
    {
      name: 'feasto-merchant-finance-store',
      partialize: (state) => ({
        subscription: state.subscription,
        invoices: state.invoices,
        payouts: state.payouts,
        expenses: state.expenses,
        dateRangePreset: state.dateRangePreset,
      }),
    }
  )
);

export default usePortalFinanceStore;
