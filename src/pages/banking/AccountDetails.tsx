import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Download,
  Search,
  Filter,
  Calendar,
  Wallet
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RootState } from '../../store/store';
import { addNotification } from '../../store/slices/notificationsSlice';
import GlassCard from '../../components/common/GlassCard';

export const AccountDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const account = accounts.find((a) => a.id === id);

  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(false);

  if (!account) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Account not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/accounts')}>
          Back to Accounts
        </Button>
      </Box>
    );
  }

  // Filter transactions for this account
  const accountTxs = transactions.filter((t) => t.accountId === account.id);
  
  // Search filter
  const filteredTxs = accountTxs.filter((tx) =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group transactions for donut spending chart
  const spendingByCategory = accountTxs
    .filter((tx) => tx.type === 'withdrawal' || tx.type === 'transfer_out')
    .reduce((acc: { [key: string]: number }, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const pieData = Object.keys(spendingByCategory).map((cat) => ({
    name: cat,
    value: spendingByCategory[cat],
  }));

  const COLORS = {
    'Salary': '#10b981',
    'Food & Dining': '#f59e0b',
    'Shopping': '#06b6d4',
    'Utilities': '#0d9488',
    'Investments': '#8b5cf6',
    'Transfer': '#3b82f6',
    'Entertainment': '#ec4899',
    'Insurance': '#f43f5e',
    'Other': '#9ca3af',
  };

  const getCategoryColor = (cat: string) => {
    return (COLORS as any)[cat] || theme.palette.text.secondary;
  };

  // Simulate CSV download
  const handleDownloadCSV = () => {
    setDownloading(true);
    dispatch(
      addNotification({
        title: 'Statement Downloaded',
        message: `Successfully downloaded statement for ${account.name} in CSV format.`,
        type: 'success',
      })
    );
    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/accounts')} sx={{ color: 'text.secondary' }}>
          <ChevronLeft size={20} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          Back to Accounts
        </Typography>
      </Box>

      {/* Hero Header */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                    {account.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Account: {account.accountNumber} | Type: <span style={{ textTransform: 'capitalize' }}>{account.type}</span>
                  </Typography>
                </Box>
                <Chip label="Active" color="success" size="small" variant="filled" sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="caption" color="text.secondary">Available Balance</Typography>
              <Typography variant="h3" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mt: 0.5, mb: 3 }}>
                {currencySymbol}{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/transfer')}
                startIcon={<ArrowUpRight size={16} />}
              >
                Send Money
              </Button>
              <Button
                variant="outlined"
                onClick={handleDownloadCSV}
                disabled={downloading}
                startIcon={<Download size={16} />}
                sx={{
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  color: 'text.secondary'
                }}
              >
                {downloading ? 'Downloading...' : 'Export CSV'}
              </Button>
            </Box>
          </GlassCard>
        </Grid>

        {/* Donut Chart of Spending */}
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 1 }}>
              Spending Breakdown
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Consolidated expenses categorized for the current month
            </Typography>

            {pieData.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                <Wallet size={36} style={{ opacity: 0.2, marginBottom: '8px' }} />
                <Typography variant="body2">No expenses recorded for this account.</Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 160, display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${currencySymbol}${val.toLocaleString()}`, 'Expenses']}
                      contentStyle={{
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: isDark ? '#ffffff' : '#000000',
                        fontFamily: 'Inter',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom list description */}
                <Box sx={{ width: '50%', overflowY: 'auto', maxHeight: 150, pr: 1 }}>
                  {pieData.map((d) => (
                    <Box key={d.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getCategoryColor(d.name) }} />
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', maxWidth: 80 }} noWrap>{d.name}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {currencySymbol}{Math.round(d.value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </GlassCard>
        </Grid>
      </Grid>

      {/* Transactions List */}
      <GlassCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
              Transaction Ledger
            </Typography>
            <Typography variant="caption" color="text.secondary">
              List of deposits and withdrawals processed on this account.
            </Typography>
          </Box>

          <TextField
            placeholder="Search transactions..."
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
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontWeight: 700, color: 'text.secondary' } }}>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTxs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No transactions match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTxs.map((tx) => {
                  const isIncome = tx.type === 'deposit' || tx.type === 'transfer_in';
                  return (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{ '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` } }}
                    >
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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
                      <TableCell sx={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'text.secondary' }}>
                        {tx.type.replace('_', ' ')}
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
    </Box>
  );
};

export default AccountDetails;
