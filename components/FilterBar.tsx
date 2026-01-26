import React from 'react';
import { Filter } from 'lucide-react';
import { Box, Paper, Typography, Button } from '@mui/material';

interface FilterBarProps {
  children: React.ReactNode;
  onClear: () => void;
  showClear: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ children, onClear, showClear }) => {
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: { xs: 1, sm: 0 }, mr: 1 }}>
        <Filter size={20} />
        <Typography fontWeight={500}>Filtros:</Typography>
      </Box>

      {children}

      {showClear && (
        <Button 
          color="error" 
          size="small" 
          onClick={onClear}
          sx={{ mb: 0.5 }}
        >
          Limpar
        </Button>
      )}
    </Paper>
  );
};

export default FilterBar;