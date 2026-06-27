import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  useTheme
} from '@mui/material';
import {
  Sun,
  Moon,
  Coins,
  BellRing,
  Globe
} from 'lucide-react';
import { RootState } from '../../store/store';
import { toggleTheme, setCurrency, updateNotificationPrefs } from '../../store/slices/preferencesSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import GlassCard from '../../components/common/GlassCard';
import mockApi from '../../services/mockApi';

export const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const preferences = useSelector((state: RootState) => state.preferences);

  const savePreferences = async (updated: Partial<typeof preferences>) => {
    try {
      const merged = {
        theme: updated.theme || preferences.theme,
        currency: updated.currency || preferences.currency,
        notificationPrefs: updated.notificationPrefs || preferences.notificationPrefs,
      };
      await mockApi.updatePreferences(merged);
    } catch (e) {
      console.error("Failed to save preferences to database:", e);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value as any;
    dispatch(setCurrency(val));
    savePreferences({ currency: val });
    dispatch(
      addNotification({
        title: 'Currency Changed',
        message: `System display currency has been updated to ${val}.`,
        type: 'success',
      })
    );
  };

  const handleTogglePref = (channel: 'email' | 'sms' | 'push', checked: boolean) => {
    const nextPrefs = { ...preferences.notificationPrefs, [channel]: checked };
    dispatch(updateNotificationPrefs({ [channel]: checked }));
    savePreferences({ notificationPrefs: nextPrefs });
    dispatch(
      addNotification({
        title: 'Preferences Saved',
        message: `Notification alerts via ${channel.toUpperCase()} ${checked ? 'enabled' : 'disabled'}.`,
        type: 'success',
      })
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
          Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure application themes, global currencies, alert channels, and localization.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* System Theme Selection */}
        <Grid item xs={12}>
          <GlassCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              {isDark ? <Moon size={20} style={{ color: theme.palette.primary.main }} /> : <Sun size={20} style={{ color: theme.palette.primary.main }} />}
              <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                System Theme Styling
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Theme Mode</Typography>
                <Typography variant="caption" color="text.secondary">
                  Toggle between the ambient low-light Dark Mode and high-contrast Light Mode.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => {
                  const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
                  dispatch(toggleTheme());
                  savePreferences({ theme: nextTheme });
                }}
                startIcon={isDark ? <Sun size={16} /> : <Moon size={16} />}
                sx={{
                  borderRadius: '10px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  color: 'text.secondary'
                }}
              >
                {isDark ? 'Switch Light' : 'Switch Dark'}
              </Button>
            </Box>
          </GlassCard>
        </Grid>

        {/* Global Currency Selection */}
        <Grid item xs={12} sm={6}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Coins size={20} style={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Display Currency
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Choose your primary base currency. Ledger records will convert display symbols dynamically.
            </Typography>

            <TextField
              select
              label="Ecosystem Currency"
              fullWidth
              value={preferences.currency}
              onChange={handleCurrencyChange}
            >
              <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
              <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
              <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
              <MenuItem value="INR">INR (₹) - Indian Rupee</MenuItem>
            </TextField>
          </GlassCard>
        </Grid>

        {/* Localisation / Mock */}
        <Grid item xs={12} sm={6}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Globe size={20} style={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Localization Settings
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Set your geographic language preferences. Default locale is configured to English.
            </Typography>

            <TextField
              select
              label="Preferred Language"
              fullWidth
              defaultValue="en"
              disabled
            >
              <MenuItem value="en">English (US)</MenuItem>
              <MenuItem value="es">Español (ES)</MenuItem>
              <MenuItem value="de">Deutsch (DE)</MenuItem>
              <MenuItem value="hi">हिन्दी (IN)</MenuItem>
            </TextField>
          </GlassCard>
        </Grid>

        {/* Notification preferences */}
        <Grid item xs={12}>
          <GlassCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <BellRing size={20} style={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Notification Channels
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Select the communication feeds on which you wish to receive financial logs and security flags.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notificationPrefs.email}
                    onChange={(e) => handleTogglePref('email', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Email Communications</Typography>
                    <Typography variant="caption" color="text.secondary">Receive auditing receipts and account ledger statement compile warnings.</Typography>
                  </Box>
                }
                sx={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse', mx: 0 }}
              />

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notificationPrefs.push}
                    onChange={(e) => handleTogglePref('push', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>System Push Notifications</Typography>
                    <Typography variant="caption" color="text.secondary">Trigger immediate alerts inside browser headers for all fund activities.</Typography>
                  </Box>
                }
                sx={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse', mx: 0 }}
              />

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notificationPrefs.sms}
                    onChange={(e) => handleTogglePref('sms', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>SMS Text Messaging</Typography>
                    <Typography variant="caption" color="text.secondary">Receive OTP codes and account login safety notifications on your mobile.</Typography>
                  </Box>
                }
                sx={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse', mx: 0 }}
              />
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
