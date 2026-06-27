import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { RootState } from '../../store/store';
import GlassCard from '../../components/common/GlassCard';

export const TransactionHistory: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accounts = useSelector((state: RootState) => state.banking.accounts);
  const transactions = useSelector((state: RootState) => state.banking.transactions);
  
  const currencySymbol = useSelector((state: RootState) => {
    const curr = state.preferences.currency;
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'INR') return '₹';
    return '$';
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Details Modal
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Categories list
  const categories = ['Salary', 'Food & Dining', 'Shopping', 'Utilities', 'Investments', 'Transfer', 'Insurance', 'Entertainment', 'Other'];

  // Filter logic
  const filteredTxs = transactions
    .filter((tx) => {
      const matchSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAccount = selectedAccount === 'all' || tx.accountId === selectedAccount;
      const matchCategory = selectedCategory === 'all' || tx.category === selectedCategory;
      const matchType =
        selectedType === 'all' ||
        (selectedType === 'income' && (tx.type === 'deposit' || tx.type === 'transfer_in')) ||
        (selectedType === 'expense' && (tx.type === 'withdrawal' || tx.type === 'transfer_out'));

      return matchSearch && matchAccount && matchCategory && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Salary':
        return theme.palette.success.main;
      case 'Food & Dining':
        return '#f59e0b';
      case 'Shopping':
        return theme.palette.primary.main;
      case 'Utilities':
        return '#0d9488';
      case 'Investments':
        return theme.palette.secondary.main;
      case 'Transfer':
        return '#3b82f6';
      default:
        return theme.palette.text.secondary;
    }
  };

  const getAccountName = (accId: string) => {
    const acc = accounts.find((a) => a.id === accId);
    return acc ? acc.name : 'Unknown Account';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
          Transaction Ledger
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed filterable record of all deposits, withdrawals, and fund transfers.
        </Typography>
      </Box>

      {/* Advanced Filter Panel */}
      <GlassCard sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {/* Search bar */}
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Search by description or reference..."
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Account Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Account"
              fullWidth
              size="small"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <MenuItem value="all">All Accounts</MenuItem>
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Category"
              fullWidth
              size="small"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Type Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Flow Type"
              fullWidth
              size="small"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <MenuItem value="all">All Flows</MenuItem>
              <MenuItem value="income">Incoming (+)</MenuItem>
              <MenuItem value="expense">Outgoing (-)</MenuItem>
            </TextField>
          </Grid>

          {/* Sort selection */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Sort By"
              fullWidth
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date-desc">Newest First</MenuItem>
              <MenuItem value="date-asc">Oldest First</MenuItem>
              <MenuItem value="amount-desc">Amount: High to Low</MenuItem>
              <MenuItem value="amount-asc">Amount: Low to High</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </GlassCard>

      {/* Ledgers table */}
      <GlassCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontWeight: 700, color: 'text.secondary' } }}>
                <TableCell>Date</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTxs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ color: 'text.secondary' }}>
                      <Inbox size={32} style={{ opacity: 0.2, marginBottom: '8px' }} />
                      <Typography variant="body2">No matching transactions found.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTxs.map((tx) => {
                  const isIncome = tx.type === 'deposit' || tx.type === 'transfer_in';
                  return (
                    <TableRow
                      key={tx.id}
                      hover
                      onClick={() => setSelectedTx(tx)}
                      sx={{
                        cursor: 'pointer',
                        '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }
                      }}
                    >
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: '0.8rem', color: 'text.secondary' }}>
                        {getAccountName(tx.accountId)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{tx.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={tx.category}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: `${getCategoryColor(tx.category)}12`,
                            color: getCategoryColor(tx.category),
                            border: `1px solid ${getCategoryColor(tx.category)}20`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isIncome ? 'success.main' : 'text.primary' }}>
                        {isIncome ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      {/* TRANSACTION DETAILS POPUP DIALOG */}
      <Dialog
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            width: '100%',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
          Transaction Details
        </DialogTitle>
        <DialogContent>
          {selectedTx && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  Authorized Amount
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: selectedTx.type.includes('in') || selectedTx.type === 'deposit' ? 'success.main' : 'text.primary', mt: 0.5 }}>
                  {selectedTx.type.includes('in') || selectedTx.type === 'deposit' ? '+' : '-'}{currencySymbol}{selectedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Reference ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTx.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Origin Account</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{getAccountName(selectedTx.accountId)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(selectedTx.date).toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Category</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTx.category}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTx.description}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedTx(null)} fullWidth variant="outlined" sx={{ borderRadius: '12px' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory;
