import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import { FileText, Download, FileSpreadsheet, Layers, Info } from 'lucide-react';
import { RootState } from '../../store/store';
import { addNotification } from '../../store/slices/notificationsSlice';
import GlassCard from '../../components/common/GlassCard';

export const Statements: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accounts = useSelector((state: RootState) => state.banking.accounts);

  const [selectedAccount, setSelectedAccount] = useState('acc-checking');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const activeAccount = accounts.find((a) => a.id === selectedAccount);

  const mockStatements = [
    { id: 'st-05', month: 'May 2026', range: 'May 01 - May 31, 2026', size: '142 KB', format: 'PDF' },
    { id: 'st-04', month: 'April 2026', range: 'Apr 01 - Apr 30, 2026', size: '139 KB', format: 'PDF' },
    { id: 'st-03', month: 'March 2026', range: 'Mar 01 - Mar 31, 2026', size: '154 KB', format: 'PDF' },
    { id: 'st-02', month: 'February 2026', range: 'Feb 01 - Feb 28, 2026', size: '128 KB', format: 'PDF' },
    { id: 'st-01', month: 'January 2026', range: 'Jan 01 - Jan 31, 2026', size: '145 KB', format: 'PDF' },
  ];

  const handleDownload = async (st: any) => {
    setDownloadingId(st.id);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    dispatch(
      addNotification({
        title: 'Statement Downloaded',
        message: `e-Statement for ${st.month} (${activeAccount?.name}) has been saved.`,
        type: 'success',
      })
    );

    setDownloadingId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
          Account Statements
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and download monthly e-statements for auditing and tax preparation.
        </Typography>
      </Box>

      {/* Account Selection */}
      <GlassCard sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              select
              label="Select Bank Account"
              fullWidth
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name} ({acc.accountNumber})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary', p: 1 }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <Typography variant="caption" lineHeight={1.3}>
                Statements are compiled at 11:59 PM on the last day of each calendar month.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </GlassCard>

      {/* Statements Table */}
      <GlassCard>
        <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 2 }}>
          Statement Registry (2026)
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontWeight: 700, color: 'text.secondary' } }}>
                <TableCell>Month</TableCell>
                <TableCell>Billing Period</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>File Size</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockStatements.map((st) => {
                const isDownloading = downloadingId === st.id;
                return (
                  <TableRow
                    key={st.id}
                    hover
                    sx={{ '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FileText size={18} style={{ color: theme.palette.primary.main }} />
                        {st.month}
                      </Box>
                    </TableCell>
                    <TableCell color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {st.range}
                    </TableCell>
                    <TableCell>
                      <Chip label={st.format} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {st.size}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={downloadingId !== null}
                        onClick={() => handleDownload(st)}
                        startIcon={isDownloading ? <CircularProgress size={12} color="inherit" /> : <Download size={14} />}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          py: 0.5,
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                          color: 'text.secondary'
                        }}
                      >
                        {isDownloading ? 'Downloading' : 'Download'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
};

export default Statements;
