import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import {
  LayoutDashboard,
  Landmark,
  Users,
  SendHorizontal,
  History,
  User,
  Settings,
  LogOut,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  FileText,
  Activity
} from 'lucide-react';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/notificationsSlice';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addNotification({
        title: 'Logged Out',
        message: 'You have been successfully signed out.',
        type: 'info',
      })
    );
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { text: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'core' },
    { text: 'Accounts', path: '/accounts', icon: Landmark, category: 'core' },
    { text: 'Beneficiaries', path: '/beneficiaries', icon: Users, category: 'core' },
    { text: 'Fund Transfer', path: '/transfer', icon: SendHorizontal, category: 'core' },
    { text: 'Transactions', path: '/transactions', icon: History, category: 'core' },
    { text: 'Statements', path: '/statements', icon: FileText, category: 'core' },
    
    // Release 2 Coming Soon Items
    { text: 'Trading Hub', path: '/trading', icon: TrendingUp, category: 'coming-soon', isLocked: true },
    { text: 'Insurance', path: '/insurance', icon: ShieldCheck, category: 'coming-soon', isLocked: true },
    { text: 'Risk Intel', path: '/risk', icon: Activity, category: 'coming-soon', isLocked: true },
    
    // User Settings
    { text: 'My Profile', path: '/profile', icon: User, category: 'user' },
    { text: 'Settings', path: '/settings', icon: Settings, category: 'user' },
  ];

  const handleNavigation = (path: string, isLocked?: boolean) => {
    if (isLocked) {
      dispatch(
        addNotification({
          title: 'Coming Soon',
          message: 'The requested service will be unlocked in Release 2 (Wealth & Advanced Trading MVP).',
          type: 'info',
        })
      );
      return;
    }
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? 'rgba(11, 17, 32, 0.96)' : 'rgba(248, 250, 252, 0.97)',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
        }}
        onClick={() => handleNavigation('/dashboard')}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px 0 rgba(6, 182, 212, 0.3)',
          }}
        >
          <Sparkles size={20} color="#ffffff" />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            FinVerse
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Wealth Ecosystem
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ opacity: 0.5 }} />

      {/* Nav List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
          Banking MVP (Release 1)
        </Typography>
        
        <List sx={{ p: 0, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {navItems
            .filter((i) => i.category === 'core')
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: '10px',
                      py: 1,
                      px: 2,
                      backgroundColor: isActive
                        ? isDark
                          ? 'rgba(6, 182, 212, 0.12)'
                          : 'rgba(79, 70, 229, 0.08)'
                        : 'transparent',
                      color: isActive
                        ? 'primary.main'
                        : 'text.secondary',
                      '&:hover': {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.02)',
                        color: 'text.primary',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>

        <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mt: 3, mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
          Future Modules
        </Typography>
        <List sx={{ p: 0, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {navItems
            .filter((i) => i.category === 'coming-soon')
            .map((item) => {
              const Icon = item.icon;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path, true)}
                    sx={{
                      borderRadius: '10px',
                      py: 1,
                      px: 2,
                      color: 'text.secondary',
                      opacity: 0.65,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label="LOCKED"
                      size="small"
                      sx={{
                        fontSize: '0.6rem',
                        height: 16,
                        fontWeight: 700,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>

        <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mt: 3, mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
          Account
        </Typography>
        <List sx={{ p: 0, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {navItems
            .filter((i) => i.category === 'user')
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: '10px',
                      py: 1,
                      px: 2,
                      backgroundColor: isActive
                        ? isDark
                          ? 'rgba(6, 182, 212, 0.12)'
                          : 'rgba(79, 70, 229, 0.08)'
                        : 'transparent',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        color: 'text.primary',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              py: 1.25,
              px: 2,
              color: 'error.main',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.03)' : 'rgba(239, 68, 68, 0.02)',
              border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.05)'}`,
              '&:hover': {
                backgroundColor: 'error.main',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'error.main', transition: 'color 0.2s' }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
