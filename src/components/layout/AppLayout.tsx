import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Sun, Moon, LayoutDashboard, Landmark, SendHorizontal, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { RootState } from '../../store/store';
import { toggleTheme, setTheme, setCurrency, updateNotificationPrefs } from '../../store/slices/preferencesSlice';
import { logout } from '../../store/slices/authSlice';
import { addNotification, setNotifications } from '../../store/slices/notificationsSlice';
import Sidebar from './Sidebar';
import NotificationCenter from '../common/NotificationCenter';
import { setAccounts, setTransactions, setBeneficiaries } from '../../store/slices/bankingSlice';
import mockApi from '../../services/mockApi';

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDark = theme.palette.mode === 'dark';
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // 1. Fetch Accounts
          const accountsRes = await mockApi.getAccounts();
          if (accountsRes.success && accountsRes.accounts) {
            dispatch(setAccounts(accountsRes.accounts));
          }

          // 2. Fetch Transactions
          const txRes = await mockApi.getTransactions();
          if (txRes.success && txRes.transactions) {
            dispatch(setTransactions(txRes.transactions));
          }

          // 3. Fetch Beneficiaries
          const benRes = await mockApi.getBeneficiaries();
          if (benRes.success && benRes.beneficiaries) {
            dispatch(setBeneficiaries(benRes.beneficiaries));
          }

          // 4. Fetch Preferences
          const prefRes = await mockApi.getPreferences();
          if (prefRes.success && prefRes.data) {
            const { theme, currency, emailNotification, smsNotification, pushNotification } = prefRes.data;
            if (theme) dispatch(setTheme(theme));
            if (currency) dispatch(setCurrency(currency));
            dispatch(updateNotificationPrefs({
              email: !!emailNotification,
              sms: !!smsNotification,
              push: !!pushNotification,
            }));
          }

          // 5. Fetch Notifications
          const notiRes = await mockApi.getNotifications();
          if (notiRes.success && notiRes.data) {
            const formatTime = (ts: string) => {
              const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
              if (mins < 1) return 'Just Now';
              if (mins < 60) return `${mins}m ago`;
              const hrs = Math.floor(mins / 60);
              if (hrs < 24) return `${hrs}h ago`;
              return new Date(ts).toLocaleDateString();
            };
            dispatch(setNotifications(
              notiRes.data.map((n: any) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                read: n.read,
                timestamp: formatTime(n.timestamp),
              }))
            ));
          }
        } catch (err) {
          console.error("Failed to load user session data from backend database:", err);
        }
      };
      loadUserData();
    }
  }, [user, dispatch]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addNotification({
        title: 'Logged Out',
        message: 'Signed out successfully.',
        type: 'info',
      })
    );
    handleProfileClose();
    navigate('/login');
  };

  // Map route path to header title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Overview';
    if (path.startsWith('/accounts')) return 'Banking Accounts';
    if (path.startsWith('/transfer')) return 'Transfer Funds';
    if (path.startsWith('/beneficiaries')) return 'Payees & Contacts';
    if (path.startsWith('/transactions')) return 'Transaction Ledger';
    if (path.startsWith('/statements')) return 'Account Statements';
    if (path.startsWith('/profile')) return 'My Profile';
    if (path.startsWith('/settings')) return 'Preferences';
    return 'FinVerse';
  };

  // Mobile bottom navigation mapping
  const getBottomNavValue = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 0;
    if (path.startsWith('/accounts')) return 1;
    if (path.startsWith('/transfer')) return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Mesh Ambient Gradient Blobs */}
      <Box className="bg-blobs">
        <Box className="blob blob-1" />
        <Box className="blob blob-2" />
        <Box className="blob blob-3" />
      </Box>

      {/* Desktop Sidebar (Permanent) */}
      {!isMobile && (
        <Box component="nav" sx={{ width: 280, flexShrink: 0 }}>
          <Sidebar />
        </Box>
      )}

      {/* Mobile Sidebar (Temporary Drawer) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          PaperProps={{
            sx: {
              width: 280,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            },
          }}
        >
          <Sidebar onCloseMobile={handleDrawerToggle} />
        </Drawer>
      )}

      {/* Main Content Workspace */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          pb: isMobile ? 8 : 0, // padding for mobile bottom bar
        }}
      >
        {/* Top Header Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: isDark ? 'rgba(11, 17, 32, 0.96)' : 'rgba(248, 250, 252, 0.97)',
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            
            {/* Left side: Hamburger (Mobile) & Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    borderRadius: '12px',
                    p: 1.25,
                  }}
                >
                  <MenuIcon size={20} />
                </IconButton>
              )}
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                {getPageTitle()}
              </Typography>
            </Box>

            {/* Right side: Utilities */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              
              {/* Theme toggle switch */}
              <IconButton
                onClick={() => dispatch(toggleTheme())}
                sx={{
                  color: 'text.secondary',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  p: 1.25,
                  '&:hover': {
                    background: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(79, 70, 229, 0.08)',
                    color: 'primary.main',
                  },
                }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>

              {/* Notifications bell */}
              <NotificationCenter />

              {/* Profile Avatar Trigger */}
              <IconButton onClick={handleProfileOpen} sx={{ p: 0.25 }}>
                <Avatar
                  alt={user?.name || 'User'}
                  src={user?.avatarUrl}
                  sx={{
                    width: 40,
                    height: 40,
                    border: `2px solid ${isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(79, 70, 229, 0.4)'}`,
                    boxShadow: isDark
                      ? '0 0 10px rgba(6, 182, 212, 0.15)'
                      : '0 0 10px rgba(79, 70, 229, 0.1)',
                  }}
                >
                  {user?.name ? user.name[0] : 'U'}
                </Avatar>
              </IconButton>
              
              {/* Profile Context Menu */}
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                PaperProps={{
                  sx: {
                    width: 220,
                    mt: 1.5,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: isDark ? '0 12px 40px 0 rgba(0, 0, 0, 0.4)' : '0 12px 40px 0 rgba(31, 38, 135, 0.1)',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2.5, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }} color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      display: 'inline-block',
                      px: 1,
                      py: 0.25,
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor:
                        user?.tier === 'Wealth'
                          ? 'rgba(139, 92, 246, 0.15)'
                          : user?.tier === 'Premium'
                          ? 'rgba(6, 182, 212, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                      color:
                        user?.tier === 'Wealth'
                          ? '#a78bfa'
                          : user?.tier === 'Premium'
                          ? '#22d3ee'
                          : '#34d399',
                      border: '1px solid currentColor',
                    }}
                  >
                    {user?.tier} Member
                  </Box>
                </Box>
                
                <Divider />
                
                <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }}>
                  <ListItemIcon>
                    <User size={16} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }}>
                  <ListItemIcon>
                    <SettingsIcon size={16} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogOut size={16} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>

            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Render Panel */}
        <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3, md: 4 }, py: 3, overflowY: 'auto' }}>
          <Box className="fade-in">
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 1000,
          }}
        >
          <BottomNavigation
            value={getBottomNavValue()}
            onChange={(_, newValue) => {
              const paths = ['/dashboard', '/accounts', '/transfer', '/profile'];
              navigate(paths[newValue]);
            }}
            sx={{
              height: 64,
              backgroundColor: 'transparent',
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  '& .MuiTypography-root': {
                    fontWeight: 700,
                  },
                },
              },
            }}
          >
            <BottomNavigationAction label="Overview" icon={<LayoutDashboard size={20} />} />
            <BottomNavigationAction label="Accounts" icon={<Landmark size={20} />} />
            <BottomNavigationAction label="Transfer" icon={<SendHorizontal size={20} />} />
            <BottomNavigationAction label="Profile" icon={<User size={20} />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default AppLayout;
