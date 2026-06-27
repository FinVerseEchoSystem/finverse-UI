import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  useTheme,
  ListItemButton
} from '@mui/material';
import { Bell, ShieldAlert, CheckCircle, Info, AlertTriangle, Trash2, MailCheck } from 'lucide-react';
import { RootState } from '../../store/store';
import { markAsRead, markAllAsRead, clearNotifications } from '../../store/slices/notificationsSlice';
import mockApi from '../../services/mockApi';

export const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMarkAsRead = async (id: string) => {
    dispatch(markAsRead(id));
    try { await mockApi.markNotificationRead(id); } catch { /* local state already updated */ }
  };

  const handleMarkAllAsRead = async () => {
    dispatch(markAllAsRead());
    try { await mockApi.markAllNotificationsRead(); } catch { /* local state already updated */ }
  };

  const handleClearNotifications = async () => {
    dispatch(clearNotifications());
    try { await mockApi.clearAllNotifications(); } catch { /* local state already updated */ }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} style={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ShieldAlert size={18} style={{ color: theme.palette.error.main }} />;
      default:
        return <Info size={18} style={{ color: theme.palette.info.main }} />;
    }
  };

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
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
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              right: 2,
              top: 2,
              border: `2px solid ${isDark ? '#0b0f19' : '#ffffff'}`,
              padding: '0 4px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
            },
          }}
        >
          <Bell size={20} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            mt: 1.5,
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark
              ? '0 12px 40px 0 rgba(0, 0, 0, 0.5)'
              : '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              startIcon={<MailCheck size={14} />}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}
            >
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              All caught up! No notifications.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, overflowY: 'auto', maxHeight: 350 }}>
            {notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Divider sx={{ opacity: 0.5 }} />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMarkAsRead(item.id)}
                    sx={{
                      alignItems: 'flex-start',
                      py: 1.5,
                      px: 2,
                      backgroundColor: item.read
                        ? 'transparent'
                        : isDark
                        ? 'rgba(6, 182, 212, 0.04)'
                        : 'rgba(79, 70, 229, 0.04)',
                      '&:hover': {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                      {getIcon(item.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: item.read ? 600 : 700,
                            color: 'text.primary',
                            fontSize: '0.875rem',
                          }}
                        >
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}
                          >
                            {item.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {item.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                color="error"
                size="small"
                fullWidth
                onClick={handleClearNotifications}
                startIcon={<Trash2 size={14} />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Clear all notifications
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationCenter;
