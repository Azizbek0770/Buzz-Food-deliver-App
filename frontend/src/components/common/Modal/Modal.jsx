import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import './Modal.css';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  className = ''
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className={`modal ${className}`}
    >
      <DialogTitle className="modal-header">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers className="modal-content">
        {children}
      </DialogContent>

      {actions && (
        <DialogActions className="modal-actions">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal; 