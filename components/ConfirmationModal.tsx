import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  IconButton
} from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  variant = 'danger'
}) => {
  const isDanger = variant === 'danger';
  const color = isDanger ? 'error' : 'warning';
  const iconBg = isDanger ? '#fef2f2' : '#fff7ed';
  const iconColor = isDanger ? '#dc2626' : '#ea580c';

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, padding: 1, maxWidth: 448, width: '100%' }
      }}
    >
      <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', p: 2, pb: 0, gap: 2 }}>
        <Box 
          sx={{ 
            bgcolor: iconBg, 
            color: iconColor, 
            p: 1.5, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 48,
            height: 48
          }}
        >
          <AlertTriangle size={24} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>

      <DialogActions sx={{ p: 2, pt: 3, bgcolor: '#f9fafb', mt: 2, borderTop: '1px solid #f3f4f6', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ bgcolor: 'white', borderColor: '#e5e7eb' }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose();
          }} 
          variant="contained" 
          color={color}
          disableElevation
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;