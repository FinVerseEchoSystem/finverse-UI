import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
  amount: number;
  category: 'Shopping' | 'Food & Dining' | 'Utilities' | 'Salary' | 'Investments' | 'Transfer' | 'Insurance' | 'Entertainment' | 'Other';
  description: string;
  date: string; // ISO String
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  limit?: number; // for credit card
  rate?: number; // interest rate for loan
  monthlyPayment?: number; // for loan
  sparklineData: number[];
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  nickname?: string;
  email?: string;
  avatarColor?: string;
}

interface BankingState {
  accounts: BankAccount[];
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  selectedAccountId: string | null;
}

const initialState: BankingState = {
  accounts: [],
  beneficiaries: [],
  transactions: [],
  selectedAccountId: null
};

const bankingSlice = createSlice({
  name: 'banking',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.accounts = action.payload;
      if (!state.selectedAccountId && action.payload.length > 0) {
        state.selectedAccountId = action.payload[0].id;
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setBeneficiaries: (state, action: PayloadAction<Beneficiary[]>) => {
      state.beneficiaries = action.payload;
    },
    addBeneficiary: (state, action: PayloadAction<Omit<Beneficiary, 'id' | 'avatarColor'>>) => {
      const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newBeneficiary: Beneficiary = {
        ...action.payload,
        id: `ben-${Date.now()}`,
        avatarColor: randomColor
      };
      state.beneficiaries.push(newBeneficiary);
    },
    editBeneficiary: (state, action: PayloadAction<Beneficiary>) => {
      const idx = state.beneficiaries.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) {
        state.beneficiaries[idx] = action.payload;
      }
    },
    deleteBeneficiary: (state, action: PayloadAction<string>) => {
      state.beneficiaries = state.beneficiaries.filter(b => b.id !== action.payload);
    },
    setSelectedAccountId: (state, action: PayloadAction<string | null>) => {
      state.selectedAccountId = action.payload;
    },
    performTransfer: (
      state,
      action: PayloadAction<{
        sourceAccountId: string;
        beneficiaryId: string;
        amount: number;
        remarks: string;
        category?: Transaction['category'];
      }>
    ) => {
      const { sourceAccountId, beneficiaryId, amount, remarks, category } = action.payload;
      const account = state.accounts.find(acc => acc.id === sourceAccountId);
      const beneficiary = state.beneficiaries.find(ben => ben.id === beneficiaryId);
      
      if (!account) return;

      // Handle subtraction or addition based on account types
      if (account.type === 'credit') {
        account.balance += amount; // Spending money on credit card increases balance
      } else {
        account.balance -= amount; // Withdrawing from checking/savings decreases balance
      }

      // Add to sparkline
      account.sparklineData.push(account.balance);
      if (account.sparklineData.length > 8) {
        account.sparklineData.shift();
      }

      // Record transaction
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId: sourceAccountId,
        type: 'transfer_out',
        amount,
        category: category || 'Transfer',
        description: `Transfer to ${beneficiary ? beneficiary.name : 'Unknown'}${remarks ? ` - ${remarks}` : ''}`,
        date: new Date().toISOString()
      };

      state.transactions.unshift(newTx);
    },
    depositFunds: (state, action: PayloadAction<{ accountId: string; amount: number; description: string; category: Transaction['category'] }>) => {
      const { accountId, amount, description, category } = action.payload;
      const account = state.accounts.find(acc => acc.id === accountId);
      if (!account) return;

      if (account.type === 'credit') {
        account.balance -= amount; // paying credit card bill decreases balance
      } else {
        account.balance += amount; // deposit increases balance
      }

      account.sparklineData.push(account.balance);
      if (account.sparklineData.length > 8) {
        account.sparklineData.shift();
      }

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId,
        type: 'deposit',
        amount,
        category,
        description,
        date: new Date().toISOString()
      };
      state.transactions.unshift(newTx);
    }
  }
});

export const {
  setAccounts,
  setTransactions,
  setBeneficiaries,
  addBeneficiary,
  editBeneficiary,
  deleteBeneficiary,
  setSelectedAccountId,
  performTransfer,
  depositFunds
} = bankingSlice.actions;

export default bankingSlice.reducer;
