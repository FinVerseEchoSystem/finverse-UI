import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  ArrowUpRight,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Wallet
} from 'lucide-react';
import { RootState } from '../../store/store';
import GlassCard from '../../components/common/GlassCard';

export const AccountSummary: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const user = useSelector((state: RootState) => state.auth.user);
  const accounts = useSelector((state: RootState) => state.banking.accounts);
  const transactions = useSelector((state: RootState) => state.banking.transactions);
  
  const currencySymbol = useSelector((state: RootState) => {
    const curr = state.preferences.currency;
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'INR') return '₹';
    return '$';
  });

  const getAccountTxCount = (accId: string) => {
    return transactions.filter((t) => t.accountId === accId).length;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
          Banking Accounts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Summary of checking, savings, investment portfolio, credit, and debt.
        </Typography>
      </Box>

      {/* Credit Card / Wealth Card Showcase Row */}
      <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 2.5 }}>
        My Visual Cards
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Visa Infinite Glass Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              height: 220,
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.01) translateY(-2px)',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                boxShadow: '0 15px 35px rgba(6, 182, 212, 0.15)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onClick={() => navigate('/accounts/acc-credit')}
          >
            {/* Ambient inner glow */}
            <Box
              sx={{
                position: 'absolute',
                top: '-30%',
                right: '-20%',
                width: '60%',
                height: '80%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }}
            />
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)' }}>
                  FINVERSE
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#06b6d4' }}>
                  INFINITE CLUB
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontStyle: 'italic', color: '#ffffff' }}>
                VISA
              </Typography>
            </Box>

            {/* Chip */}
            <Box
              sx={{
                width: 38,
                height: 28,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '15%',
                  left: '15%',
                  width: '70%',
                  height: '70%',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '3px'
                }
              }}
            />

            {/* Number & Details */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Outfit, monospace',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  color: '#ffffff',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                ••••  ••••  ••••  3892
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                    Card Holder
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                    {user?.name || 'Alex Mercer'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                      Expires
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                      09 / 29
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                      CVV
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                      •••
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Wealth Management Glass Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              height: 220,
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.15) 0%, rgba(17, 24, 39, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.01) translateY(-2px)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                boxShadow: '0 15px 35px rgba(139, 92, 246, 0.15)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onClick={() => navigate('/accounts/acc-portfolio')}
          >
            {/* Ambient inner glow */}
            <Box
              sx={{
                position: 'absolute',
                top: '-30%',
                right: '-20%',
                width: '60%',
                height: '80%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }}
            />
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.7)' }}>
                  FINVERSE
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#a78bfa' }}>
                  WEALTH SHIELD
                </Typography>
              </Box>
              <Sparkles size={20} style={{ color: '#a78bfa' }} />
            </Box>

            {/* Chip */}
            <Box
              sx={{
                width: 38,
                height: 28,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '15%',
                  left: '15%',
                  width: '70%',
                  height: '70%',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '3px'
                }
              }}
            />

            {/* Number & Details */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Outfit, monospace',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  color: '#ffffff',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                ••••  ••••  ••••  7761
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                    Asset Holder
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                    {user?.name || 'Bruce Wayne'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                      Status
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>
                      Premium
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Main accounts lists */}
      <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 2.5 }}>
        Checking & Savings
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {accounts
          .filter((acc) => acc.type === 'checking' || acc.type === 'savings')
          .map((acc) => (
            <Grid item xs={12} md={6} key={acc.id}>
              <GlassCard hoverable>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                      {acc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Acc Number: {acc.accountNumber}
                    </Typography>
                  </Box>
                  <Wallet size={20} style={{ color: theme.palette.primary.main }} />
                </Box>

                <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 3 }}>
                  {currencySymbol}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Transactions
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getAccountTxCount(acc.id)} Settled
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Interest Rate
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {acc.type === 'savings' ? '4.25% APY' : '0.00%'}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="text"
                    size="small"
                    endIcon={<ArrowUpRight size={14} />}
                    onClick={() => navigate(`/accounts/${acc.id}`)}
                    sx={{ fontWeight: 700 }}
                  >
                    View Details
                  </Button>
                </Box>
              </GlassCard>
            </Grid>
          ))}
      </Grid>

      {/* Liabilities / Debt accounts */}
      <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 2.5 }}>
        Liabilities & Loans
      </Typography>
      <Grid container spacing={3}>
        {accounts
          .filter((acc) => acc.type === 'loan')
          .map((acc) => {
            const principal = acc.limit || 50000;
            const remaining = acc.balance;
            const paid = principal - remaining;
            const percentPaid = Math.round((paid / principal) * 100);

            return (
              <Grid item xs={12} md={6} key={acc.id}>
                <GlassCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                        {acc.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reference Number: {acc.accountNumber}
                      </Typography>
                    </Box>
                    <Percent size={20} style={{ color: theme.palette.error.main }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Remaining Loan Debt:</Typography>
                      <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                        {currencySymbol}{remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">Rate</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {acc.rate}% Fixed
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Principal: {currencySymbol}{principal.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {percentPaid}% Repaid
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentPaid}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2, mt: 3 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Next Payment
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {currencySymbol}{acc.monthlyPayment?.toLocaleString()}/mo
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Due Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          June 28, 2026
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      sx={{
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                        color: 'text.secondary'
                      }}
                    >
                      Auto-Pay On
                    </Button>
                  </Box>
                </GlassCard>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default AccountSummary;
