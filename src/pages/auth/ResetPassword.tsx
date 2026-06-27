import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { Eye, EyeOff, Sparkles, Lock } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import { mockApi } from '../../services/mockApi';
import { addNotification } from '../../store/slices/notificationsSlice';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get email from router state if available
  const email = (location.state as any)?.email || 'your account';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColorAndLabel = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return { color: theme.palette.error.main, label: 'Weak' };
    if (strength <= 75) return { color: theme.palette.warning.main, label: 'Fair' };
    return { color: theme.palette.success.main, label: 'Strong' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (getPasswordStrength() <= 25) {
      setErrorMsg('Please choose a stronger password.');
      return;
    }

    setLoading(true);

    try {
      const res = await mockApi.resetPassword(password);
      if (res.success) {
        setSuccessMsg(res.message);
        dispatch(
          addNotification({
            title: 'Password Updated',
            message: 'Your account password has been changed successfully.',
            type: 'success',
          })
        );
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const strengthMeta = getStrengthColorAndLabel();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        px: 2,
        py: 4,
        overflow: 'hidden',
      }}
    >
      {/* Background Blobs */}
      <Box className="bg-blobs">
        <Box className="blob blob-1" />
        <Box className="blob blob-2" />
        <Box className="blob blob-3" />
      </Box>

      {/* Brand Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px 0 rgba(6, 182, 212, 0.4)',
          }}
        >
          <Sparkles size={22} color="#ffffff" />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
          }}
        >
          FinVerse
        </Typography>
      </Box>

      <GlassCard
        sx={{
          width: '100%',
          maxWidth: 450,
          boxShadow: isDark
            ? '0 20px 40px 0 rgba(0, 0, 0, 0.4)'
            : '0 20px 40px 0 rgba(31, 38, 135, 0.06)',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 1 }}
        >
          Reset Password
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Setting up new password for {email}
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            {successMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !!successMsg}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <Lock size={18} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={loading || !!successMsg}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password strength progress bar */}
            {password && (
              <Box sx={{ mt: -1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength:
                  </Typography>
                  <Typography variant="caption" sx={{ color: strengthMeta.color, fontWeight: 700 }}>
                    {strengthMeta.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={strength}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: strengthMeta.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!successMsg}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <Lock size={18} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !!successMsg}
              fullWidth
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        </form>
      </GlassCard>
    </Box>
  );
};

export default ResetPassword;
