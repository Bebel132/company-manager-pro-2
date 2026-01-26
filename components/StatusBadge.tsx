import React from 'react';
import { CompanyStatus } from '../types';
import { CheckCircle2, XCircle, Archive } from 'lucide-react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: CompanyStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorSx = {};
  let Icon = CheckCircle2;

  switch (status) {
    case CompanyStatus.ACTIVE:
      colorSx = {
        bgcolor: '#eff6ff', // blue-50
        color: '#1d4ed8',   // blue-700
        borderColor: '#bfdbfe' // blue-200
      };
      Icon = CheckCircle2;
      break;
    case CompanyStatus.INACTIVE:
      colorSx = {
        bgcolor: '#fef2f2', // red-50
        color: '#b91c1c',   // red-700
        borderColor: '#fecaca' // red-200
      };
      Icon = XCircle;
      break;
    case CompanyStatus.ARCHIVED:
      colorSx = {
        bgcolor: '#f9fafb', // gray-50
        color: '#374151',   // gray-700
        borderColor: '#e5e7eb' // gray-200
      };
      Icon = Archive;
      break;
  }

  return (
    <Chip
      icon={<Icon size={14} />}
      label={status}
      size="small"
      variant="outlined"
      sx={{
        ...colorSx,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: '24px',
        '& .MuiChip-icon': {
          color: 'inherit',
          marginLeft: '8px'
        }
      }}
    />
  );
};

export default StatusBadge;