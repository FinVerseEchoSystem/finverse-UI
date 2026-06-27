import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Search,
  Plus,
  UserPlus,
  Trash2,
  Edit2,
  Mail,
  Building,
  CreditCard
} from 'lucide-react';
import { RootState } from '../../store/store';
import { setBeneficiaries } from '../../store/slices/bankingSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import GlassCard from '../../components/common/GlassCard';
import mockApi from '../../services/mockApi';

export const BeneficiaryManagement: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const beneficiaries = useSelector((state: RootState) => state.banking.beneficiaries);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [targetId, setTargetId] = useState('');
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setTargetId('');
    setName('');
    setAccountNumber('');
    setBankName('');
    setNickname('');
    setEmail('');
    setModalOpen(true);
  };

  const handleOpenEdit = (ben: any) => {
    setIsEditMode(true);
    setTargetId(ben.id);
    setName(ben.name);
    setAccountNumber(ben.accountNumber);
    setBankName(ben.bankName);
    setNickname(ben.nickname || '');
    setEmail(ben.email || '');
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !accountNumber || !bankName) {
      dispatch(
        addNotification({
          title: 'Validation Error',
          message: 'Please fill in Name, Account Number, and Bank Name.',
          type: 'warning',
        })
      );
      return;
    }

    const saveBeneficiary = async () => {
      try {
        if (isEditMode) {
          const res = await mockApi.updateBeneficiary(targetId, { name, accountNumber, bankName, nickname, email });
          if (res.success) {
            dispatch(
              addNotification({
                title: 'Payee Updated',
                message: `Successfully updated profile details for ${name}.`,
                type: 'success',
              })
            );
          } else {
            throw new Error(res.message);
          }
        } else {
          const res = await mockApi.createBeneficiary({ name, accountNumber, bankName, nickname, email });
          if (res.success) {
            dispatch(
              addNotification({
                title: 'Payee Added',
                message: `${name} has been added to your saved beneficiaries.`,
                type: 'success',
              })
            );
          } else {
            throw new Error(res.message);
          }
        }
        
        // Reload beneficiaries from database
        const benRes = await mockApi.getBeneficiaries();
        if (benRes.success && benRes.beneficiaries) {
          dispatch(setBeneficiaries(benRes.beneficiaries));
        }
      } catch (err: any) {
        dispatch(
          addNotification({
            title: 'Operation Failed',
            message: err.message || 'Failed to update beneficiaries list.',
            type: 'error',
          })
        );
      }
    };

    saveBeneficiary();
    setModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    const removeBeneficiary = async () => {
      try {
        const ben = beneficiaries.find((b) => b.id === deleteTargetId);
        const res = await mockApi.deleteBeneficiary(deleteTargetId);
        if (res.success) {
          dispatch(
            addNotification({
              title: 'Payee Removed',
              message: `${ben ? ben.name : 'Beneficiary'} was successfully deleted.`,
              type: 'info',
            })
          );
          
          // Reload from database
          const benRes = await mockApi.getBeneficiaries();
          if (benRes.success && benRes.beneficiaries) {
            dispatch(setBeneficiaries(benRes.beneficiaries));
          }
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        dispatch(
          addNotification({
            title: 'Delete Failed',
            message: err.message || 'Failed to delete beneficiary.',
            type: 'error',
          })
        );
      }
    };

    removeBeneficiary();
    setDeleteConfirmOpen(false);
  };

  const filteredBens = beneficiaries.filter((ben) =>
    ben.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ben.nickname && ben.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    ben.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 0.5 }}>
            Payees & Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your saved external accounts and corporate transfer contacts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          startIcon={<Plus size={16} />}
        >
          Add Beneficiary
        </Button>
      </Box>

      {/* Search Bar */}
      <GlassCard sx={{ mb: 4 }}>
        <TextField
          placeholder="Search payees by name, nickname, or bank..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
      </GlassCard>

      {/* Grid of payees */}
      <Grid container spacing={3}>
        {filteredBens.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
              <UserPlus size={40} style={{ opacity: 0.2, marginBottom: '8px' }} />
              <Typography variant="body2">No payees found.</Typography>
            </Box>
          </Grid>
        ) : (
          filteredBens.map((ben) => (
            <Grid item xs={12} sm={6} md={4} key={ben.id}>
              <GlassCard hoverable>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: ben.avatarColor || 'primary.main',
                      fontSize: '1.25rem',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {ben.name.split(' ').map((n) => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleOpenEdit(ben)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <Edit2 size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(ben.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {ben.name}
                  </Typography>
                  {ben.nickname && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Nickname: {ben.nickname}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <Building size={14} />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {ben.bankName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <CreditCard size={14} />
                    <Typography variant="caption" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      Acc: {ben.accountNumber}
                    </Typography>
                  </Box>
                  {ben.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <Mail size={14} />
                      <Typography variant="caption" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {ben.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </GlassCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* ADD / EDIT MODAL */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            width: '100%',
            maxWidth: 450,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
          {isEditMode ? 'Edit Payee Profile' : 'Add New Beneficiary'}
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Recipient Full Name"
              type="text"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Account Number"
              type="number"
              required
              fullWidth
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <TextField
              label="Bank Name"
              type="text"
              required
              fullWidth
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <TextField
              label="Nickname (Optional)"
              type="text"
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <TextField
              label="Email Address (Optional)"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setModalOpen(false)} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {isEditMode ? 'Save Changes' : 'Save Beneficiary'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
          Delete Beneficiary?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this contact? This will remove them from your quick-send shortcut strip.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BeneficiaryManagement;
