import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
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
  TextField,
  InputAdornment,
  CircularProgress,
  useTheme,
  Divider
} from '@mui/material';
import {
  Landmark,
  TrendingUp,
  CreditCard,
  Briefcase,
  Activity,
  SendHorizontal,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowUpRight,
  Plus,
  Compass
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { RootState } from '../../store/store';
import { setAccounts, setTransactions } from '../../store/slices/bankingSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import StatCard from '../../components/common/StatCard';
import GlassCard from '../../components/common/GlassCard';
import mockApi from '../../services/mockApi';

// Dummy data for main wealth chart
const chartData = [
  { month: 'Jan', Wealth: 242000, Deposits: 98000 },
  { month: 'Feb', Wealth: 247000, Deposits: 101000 },
  { month: 'Mar', Wealth: 245000, Deposits: 104000 },
  { month: 'Apr', Wealth: 254000, Deposits: 106000 },
  { month: 'May', Wealth: 259000, Deposits: 109000 },
  { month: 'Jun', Wealth: 267900.92, Deposits: 113700.92 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const user = useSelector((state: RootState) => state.auth.user);
  const { accounts, transactions, beneficiaries } = useSelector((state: RootState) => state.banking);
  const currencySymbol = useSelector((state: RootState) => {
    const curr = state.preferences.currency;
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'INR') return '₹';
    return '$';
  });

  // Calculate stats
  const checkingAcc = accounts.find((a) => a.id === 'acc-checking');
  const savingsAcc = accounts.find((a) => a.id === 'acc-savings');
  const portfolioAcc = accounts.find((a) => a.id === 'acc-portfolio');
  const creditAcc = accounts.find((a) => a.id === 'acc-credit');
  const loanAcc = accounts.find((a) => a.id === 'acc-loan');

  const totalWealth =
    (checkingAcc?.balance || 0) +
    (savingsAcc?.balance || 0) +
    (portfolioAcc?.balance || 0) -
    (creditAcc?.balance || 0) -
    (loanAcc?.balance || 0);

  // Quick transfer modal states
  const [quickTransferOpen, setQuickTransferOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickTransferLoading, setQuickTransferLoading] = useState(false);

  // Transaction detail modal state
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const handleQuickTransferClick = (ben: any) => {
    setSelectedBeneficiary(ben);
    setQuickTransferOpen(true);
  };

  const handleQuickTransferSubmit = async () => {
    if (!quickAmount || parseFloat(quickAmount) <= 0) return;
    if (parseFloat(quickAmount) > (checkingAcc?.balance || 0)) {
      dispatch(
        addNotification({
          title: 'Transfer Limit Exceeded',
          message: 'Insufficient balance in checking account.',
          type: 'error',
        })
      );
      return;
    }

    setQuickTransferLoading(true);
    try {
      const res = await mockApi.performTransfer({
        sourceAccountId: 'acc-checking',
        beneficiaryId: selectedBeneficiary.id,
        amount: parseFloat(quickAmount),
        remarks: 'Quick Transfer',
        category: 'Transfer'
      });

      if (res.success) {
        // Sync Redux with backend data
        const accountsRes = await mockApi.getAccounts();
        if (accountsRes.success && accountsRes.accounts) {
          dispatch(setAccounts(accountsRes.accounts));
        }

        const txRes = await mockApi.getTransactions();
        if (txRes.success && txRes.transactions) {
          dispatch(setTransactions(txRes.transactions));
        }

        dispatch(
          addNotification({
            title: 'Quick Transfer Success',
            message: `Transferred ${currencySymbol}${quickAmount} to ${selectedBeneficiary.name} successfully.`,
            type: 'success',
          })
        );
      } else {
        dispatch(
          addNotification({
            title: 'Transfer Failed',
            message: res.message || 'An error occurred during transfer.',
            type: 'error',
          })
        );
      }
    } catch (err) {
      dispatch(
        addNotification({
          title: 'Transfer Failed',
          message: 'Server error during transfer processing.',
          type: 'error',
        })
      );
    } finally {
      setQuickTransferLoading(false);
      setQuickTransferOpen(false);
      setQuickAmount('');
    }
  };

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

  return (
    <Box>
      {/* Welcome Banner */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: '16px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(13,148,136,0.05) 100%)',
          border: `1px solid ${isDark ? 'rgba(6,182,212,0.15)' : 'rgba(79,70,229,0.12)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              Hello, {user?.name?.split(' ')[0] || 'Guest'}
            </Typography>
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                borderRadius: '8px',
                fontSize: '0.65rem',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                backgroundColor:
                  user?.tier === 'Wealth'
                    ? 'rgba(139,92,246,0.18)'
                    : user?.tier === 'Premium'
                    ? 'rgba(6,182,212,0.18)'
                    : 'rgba(16,185,129,0.18)',
                color:
                  user?.tier === 'Wealth' ? '#a78bfa'
                  : user?.tier === 'Premium' ? '#22d3ee'
                  : '#34d399',
                border: '1px solid currentColor',
              }}
            >
              {user?.tier}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your financial health at a glance — updated in real time.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/accounts')}
            startIcon={<Landmark size={16} />}
            sx={{
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': {
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
            }}
          >
            Accounts
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/transfer')}
            startIcon={<SendHorizontal size={16} />}
          >
            Transfer Funds
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Worth Assets"
            value={`${currencySymbol}${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change="+4.8%"
            trend="up"
            icon={<Briefcase size={22} />}
            sparklineData={[250000, 252000, 251000, 255000, 256000, totalWealth]}
            glowColor={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Liquid Bank Balance"
            value={`${currencySymbol}${(checkingAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change="+12.4%"
            trend="up"
            icon={<Landmark size={22} />}
            sparklineData={checkingAcc?.sparklineData}
            glowColor={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Invested Portfolio"
            value={`${currencySymbol}${(portfolioAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            change="+1.5%"
            trend="up"
            icon={<TrendingUp size={22} />}
            sparklineData={portfolioAcc?.sparklineData}
            glowColor="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Credit Card Balance"
            value={`${currencySymbol}${(creditAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            change="-2.1%"
            trend="down"
            icon={<CreditCard size={22} />}
            sparklineData={creditAcc?.sparklineData}
            glowColor="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Main Graph & Sidebar Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Wealth Flow Chart */}
        <Grid item xs={12} lg={8}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                  Wealth Growth History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tracking your consolidated asset equity vs deposits
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Consolidated" size="small" color="primary" variant="filled" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                <Chip label="6 Months" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', opacity: 0.8 }} />
              </Box>
            </Box>

            {/* Recharts Container */}
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                    style={{ fontSize: '0.75rem', fontFamily: 'Inter' }}
                  />
                  <YAxis
                    stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                    style={{ fontSize: '0.75rem', fontFamily: 'Inter' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: isDark ? '#ffffff' : '#000000',
                      fontFamily: 'Inter',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Wealth"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWealth)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Deposits"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorDeposits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* Risk Score Dial & Target Wealth Meter */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Risk Gauge */}
            <Grid item xs={12} sm={6} lg={12}>
              <GlassCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <ShieldCheck size={20} style={{ color: theme.palette.success.main }} />
                  <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                    Risk Assessment Dial
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', py: 1.5 }}>
                  {/* Glass Dial Ring */}
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: isDark
                        ? 'radial-gradient(circle, rgba(17,24,39,0.9) 0%, rgba(7,10,19,0.9) 100%)'
                        : 'radial-gradient(circle, #ffffff 0%, #f1f5f9 100%)',
                      border: `4px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      boxShadow: isDark
                        ? '0 0 20px rgba(16, 185, 129, 0.15), inset 0 0 10px rgba(0,0,0,0.5)'
                        : '0 0 20px rgba(16, 185, 129, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: theme.palette.success.main }}>
                      28%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      Low Risk
                    </Typography>
                  </Box>
                  <Box sx={{ maxWidth: 160 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Balanced Allocation
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.3 }}>
                      Your asset mix is highly secure. Beta risk is optimized for preservation.
                    </Typography>
                    <Chip label="Optimal Mix" color="success" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                  </Box>
                </Box>
              </GlassCard>
            </Grid>

            {/* Insurance coverage dummy indicator */}
            <Grid item xs={12} sm={6} lg={12}>
              <GlassCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Compass size={20} style={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                    Asset Insurance Scope
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Consolidated Coverage: <strong>$250,000</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Your checking/savings are FDIC secured. Liability shield protection is fully active.
                </Typography>
                <Box sx={{ height: 6, width: '100%', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ width: '85%', height: '100%', backgroundColor: theme.palette.primary.main, borderRadius: 3 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">Shield Coverage (85%)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }} color="primary">Active</Typography>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Transactions & Quick Transfers Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity Table */}
        <Grid item xs={12} lg={8}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                  Recent Transactions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your last few incoming and outgoing operations
                </Typography>
              </Box>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/transactions')}
                endIcon={<ChevronRight size={14} />}
                sx={{ fontWeight: 700 }}
              >
                Full History
              </Button>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontWeight: 700, color: 'text.secondary' } }}>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.slice(0, 4).map((tx) => {
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
                        <TableCell sx={{ fontWeight: 600 }}>{tx.description}</TableCell>
                        <TableCell color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </TableCell>
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
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        {/* Quick Send Beneficiary strip */}
        <Grid item xs={12} lg={4}>
          <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Quick Send
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select a favorite contact to transfer funds instantly
              </Typography>
            </Box>

            {/* List Circular Avatars */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1.5, mb: 3 }}>
              {beneficiaries.slice(0, 4).map((ben) => (
                <Box
                  key={ben.id}
                  onClick={() => handleQuickTransferClick(ben)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minWidth: 72,
                    '&:hover img': { transform: 'scale(1.08)' },
                    '&:hover .avatar-ring': { borderColor: theme.palette.primary.main },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box
                    className="avatar-ring"
                    sx={{
                      p: '3px',
                      borderRadius: '50%',
                      border: '2px solid transparent',
                      transition: 'border-color 0.2s',
                      mb: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: ben.avatarColor || 'primary.main',
                        fontWeight: 700,
                        fontFamily: 'Outfit, sans-serif'
                      }}
                    >
                      {ben.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </Box>
                  <Typography variant="caption" noWrap sx={{ fontWeight: 600, width: '100%', textAlign: 'center' }}>
                    {ben.nickname || ben.name.split(' ')[0]}
                  </Typography>
                </Box>
              ))}
              <Box
                onClick={() => navigate('/beneficiaries')}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minWidth: 72,
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    border: `2px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    mb: 1,
                    '&:hover': { color: 'primary.main', borderColor: 'primary.main' }
                  }}
                >
                  <Plus size={20} />
                </Avatar>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Manage
                </Typography>
              </Box>
            </Box>

            {/* Quick Balance indicator */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
                mt: 'auto'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Checking Account Balance:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {currencySymbol}{(checkingAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* QUICK TRANSFER MODAL */}
      <Dialog
        open={quickTransferOpen}
        onClose={() => !quickTransferLoading && setQuickTransferOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            width: '100%',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, pb: 1 }}>
          Quick Fund Transfer
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Send money from your checking account to:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
            <Avatar sx={{ bgcolor: selectedBeneficiary?.avatarColor || 'primary.main', fontWeight: 700 }}>
              {selectedBeneficiary?.name.split(' ').map((n: any) => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedBeneficiary?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{selectedBeneficiary?.bankName} ({selectedBeneficiary?.accountNumber})</Typography>
            </Box>
          </Box>

          <TextField
            label="Transfer Amount"
            type="number"
            autoFocus
            fullWidth
            value={quickAmount}
            onChange={(e) => setQuickAmount(e.target.value)}
            disabled={quickTransferLoading}
            InputProps={{
              startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setQuickTransferOpen(false)} disabled={quickTransferLoading} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleQuickTransferSubmit}
            disabled={quickTransferLoading || !quickAmount || parseFloat(quickAmount) <= 0}
            startIcon={quickTransferLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowUpRight size={16} />}
          >
            Confirm & Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRANSACTION DETAILS DIALOG */}
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
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Transaction Amount
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
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>Settled / Complete</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Date & Time</Typography>
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

export default Dashboard;
