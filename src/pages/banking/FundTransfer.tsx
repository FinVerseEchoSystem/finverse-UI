import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  useTheme
} from '@mui/material';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Building,
  KeyRound,
  Download,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RootState } from '../../store/store';
import { performTransfer, setAccounts, setTransactions } from '../../store/slices/bankingSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { mockApi } from '../../services/mockApi';
import GlassCard from '../../components/common/GlassCard';

export const FundTransfer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accounts = useSelector((state: RootState) => state.banking.accounts);
  const beneficiaries = useSelector((state: RootState) => state.banking.beneficiaries);
  const currencySymbol = useSelector((state: RootState) => {
    const curr = state.preferences.currency;
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'INR') return '₹';
    return '$';
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1 states
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');

  // Step 2 states
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [speed, setSpeed] = useState<'Standard' | 'Instant'>('Standard');
  const [category, setCategory] = useState<any>('Transfer');

  // Step 3 states
  const [otpCode, setOtpCode] = useState('');
  const [correctOtp, setCorrectOtp] = useState('');

  // Step 4 states (Result)
  const [txRef, setTxRef] = useState('');

  const selectedAccount = accounts.find((a) => a.id === sourceAccountId);
  const selectedBeneficiary = beneficiaries.find((b) => b.id === beneficiaryId);

  // Trigger confetti on success step
  useEffect(() => {
    if (activeStep === 3) {
      // Confetti burst
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#8b5cf6', '#10b981'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#8b5cf6', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [activeStep]);

  const handleNext = async () => {
    setErrorMsg(null);

    if (activeStep === 0) {
      if (!sourceAccountId || !beneficiaryId) {
        setErrorMsg('Please select a source account and a beneficiary.');
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        setErrorMsg('Please enter a valid transfer amount.');
        return;
      }
      if (selectedAccount && selectedAccount.type !== 'credit' && numAmount > selectedAccount.balance) {
        setErrorMsg('Insufficient funds in the selected account.');
        return;
      }

      setLoading(true);
      try {
        const res = await mockApi.sendOtp(selectedBeneficiary?.email || 'user');
        if (res.success && res.data) {
          setCorrectOtp(res.data.otpToken);
          dispatch(
            addNotification({
              title: 'Verification Code Dispatched',
              message: 'Check console for simulated verification code (4209).',
              type: 'info',
            })
          );
          setActiveStep(2);
        } else {
          setErrorMsg(res.message);
        }
      } catch (err) {
        setErrorMsg('Failed to send OTP code.');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 2) {
      if (!otpCode) {
        setErrorMsg('Please enter the verification code.');
        return;
      }

      setLoading(true);
      try {
        const res = await mockApi.verifyOtp(otpCode, correctOtp);
        if (res.success) {
          const transferAmount = parseFloat(amount);
          const transferRes = await mockApi.performTransfer({
            sourceAccountId,
            beneficiaryId,
            amount: transferAmount,
            remarks,
            category
          });

          if (transferRes.success && transferRes.data) {
            dispatch(
              addNotification({
                title: 'Transfer Settled',
                message: `Successfully transferred ${currencySymbol}${transferAmount} to ${selectedBeneficiary?.name}.`,
                type: 'success',
              })
            );

            const backendData = transferRes.data as any;
            setTxRef(backendData.reference || `TXN${Date.now().toString().slice(-8)}`);
            
            const accountsRes = await mockApi.getAccounts();
            if (accountsRes.success && accountsRes.accounts) {
              dispatch(setAccounts(accountsRes.accounts));
            }
            const txRes = await mockApi.getTransactions();
            if (txRes.success && txRes.transactions) {
              dispatch(setTransactions(txRes.transactions));
            }

            setActiveStep(3);
          } else {
            setErrorMsg(transferRes.message || 'Transfer failed on backend.');
          }
        } else {
          setErrorMsg(res.message);
        }
      } catch (err) {
        setErrorMsg('OTP verification failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSourceAccountId('');
    setBeneficiaryId('');
    setAmount('');
    setRemarks('');
    setOtpCode('');
    setCorrectOtp('');
    setTxRef('');
  };

  const handleDownloadReceipt = () => {
    dispatch(
      addNotification({
        title: 'Receipt Downloaded',
        message: 'Transaction receipt PDF simulation saved to your device.',
        type: 'success',
      })
    );
  };

  const steps = ['Select Recipient', 'Transfer Details', 'Verify', 'Complete'];

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
          Fund Transfer Wizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transfer money globally to verified beneficiaries immediately.
        </Typography>
      </Box>

      {/* Modern Stepper Indicator */}
      <GlassCard sx={{ mb: 4, py: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label} sx={{
              '& .MuiStepLabel-label': {
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
              },
              '& .MuiStepIcon-root': {
                '&.Mui-active': { color: 'primary.main' },
                '&.Mui-completed': { color: 'success.main' },
              }
            }}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </GlassCard>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMsg}
        </Alert>
      )}

      {/* STEP 1: Select Accounts & Payee */}
      {activeStep === 0 && (
        <GlassCard>
          <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 3 }}>
            Choose Source & Recipient
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                label="Source Account"
                fullWidth
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
              >
                {accounts
                  .filter((a) => a.type === 'checking' || a.type === 'savings' || a.type === 'credit')
                  .map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{acc.name}</Typography>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                          {currencySymbol}{acc.balance.toLocaleString()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            {/* Payee Selection */}
            <Grid item xs={12}>
              <TextField
                select
                label="Recipient Beneficiary"
                fullWidth
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
              >
                {beneficiaries.map((ben) => (
                  <MenuItem key={ben.id} value={ben.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: ben.avatarColor, fontWeight: 700 }}>
                        {ben.name.split(' ').map((n) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{ben.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{ben.bankName} | {ben.accountNumber}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowRight size={16} />}
            >
              Continue
            </Button>
          </Box>
        </GlassCard>
      )}

      {/* STEP 2: Input Details */}
      {activeStep === 1 && (
        <GlassCard>
          <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 3 }}>
            Transfer Parameters
          </Typography>
          
          <Box sx={{ mb: 3.5, p: 2, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Source:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedAccount?.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Recipient:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedBeneficiary?.name}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Transfer Amount"
                type="number"
                required
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Transaction Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="Transfer">Standard Transfer</MenuItem>
                <MenuItem value="Investments">Investments / Wealth</MenuItem>
                <MenuItem value="Food & Dining">Food & Restaurants</MenuItem>
                <MenuItem value="Shopping">Shopping & Luxury</MenuItem>
                <MenuItem value="Utilities">Utilities & Rent</MenuItem>
                <MenuItem value="Insurance">Insurance Payment</MenuItem>
                <MenuItem value="Other">Other Expenses</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Transfer Speed"
                fullWidth
                value={speed}
                onChange={(e) => setSpeed(e.target.value as any)}
                disabled={loading}
              >
                <MenuItem value="Standard">Standard Clearing (3-5 business hours) - Free</MenuItem>
                <MenuItem value="Instant">Instant Settlement (RTGS/IMPS) - Free</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description / Remarks (Optional)"
                type="text"
                fullWidth
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={loading}
              startIcon={<ArrowLeft size={16} />}
              sx={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: 'text.secondary' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={16} />}
            >
              Send OTP Code
            </Button>
          </Box>
        </GlassCard>
      )}

      {/* STEP 3: OTP Verification */}
      {activeStep === 2 && (
        <GlassCard>
          <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 1 }}>
            Secure Verification
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
            We've simulated sending a 4-digit code to your registered profile contact info.
          </Typography>

          <Box sx={{ textAlign: 'center', py: 2, mb: 3 }}>
            <KeyRound size={44} style={{ color: theme.palette.primary.main, opacity: 0.8, margin: '0 auto 16px' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Please enter the code <strong>4209</strong> to authorize this payment of {currencySymbol}{amount}.
            </Typography>
          </Box>

          <TextField
            label="Verification Code (OTP)"
            type="number"
            required
            fullWidth
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            disabled={loading}
            placeholder="4209"
            sx={{ maxWidth: 300, mx: 'auto', display: 'flex' }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={loading}
              startIcon={<ArrowLeft size={16} />}
              sx={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: 'text.secondary' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !otpCode}
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShieldCheck size={16} />}
            >
              Authorize Payment
            </Button>
          </Box>
        </GlassCard>
      )}

      {/* STEP 4: Success Receipt */}
      {activeStep === 3 && (
        <GlassCard>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle2 size={52} style={{ color: theme.palette.success.main, margin: '0 auto 16px' }} />
            <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
              Transaction Settled
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your transfer has been processed and debited successfully.
            </Typography>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Receipt details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2.5, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0, 0, 0, 0.04)'}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Transaction Reference</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{txRef}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Source Account</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedAccount?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Recipient Payee</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedBeneficiary?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Bank & Account</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedBeneficiary?.bankName} ({selectedBeneficiary?.accountNumber})</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Clearing Speed</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{speed} Settlement</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Category</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{category}</Typography>
            </Box>
            
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Amount Transferred</Typography>
              <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'primary.main' }}>
                {currencySymbol}{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDownloadReceipt}
              startIcon={<Download size={16} />}
              sx={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: 'text.secondary' }}
            >
              Download Receipt
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleReset}
              startIcon={<ArrowRight size={16} />}
            >
              Make Another Transfer
            </Button>
          </Box>
        </GlassCard>
      )}
    </Box>
  );
};

export default FundTransfer;
