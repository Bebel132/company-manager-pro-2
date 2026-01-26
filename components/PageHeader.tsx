import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack, 
  ToggleButtonGroup, 
  ToggleButton 
} from '@mui/material';

export type ViewMode = 'list' | 'grid' | 'calendar';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: () => void;
  addButtonLabel: string;
  onExportPdf: () => void;
  onExportExcel: () => void;
  availableViews?: ViewMode[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  onAdd,
  addButtonLabel,
  onExportPdf,
  onExportExcel,
  availableViews = ['list', 'grid']
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={<FileText size={18} color="#ef4444" />}
            onClick={onExportPdf}
            sx={{ bgcolor: 'white', color: 'text.primary', borderColor: '#e2e8f0' }}
          >
            PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileSpreadsheet size={18} color="#16a34a" />}
            onClick={onExportExcel}
            sx={{ bgcolor: 'white', color: 'text.primary', borderColor: '#e2e8f0' }}
          >
            Excel
          </Button>
        </Stack>
        
        <Box sx={{ width: '1px', height: 24, bgcolor: '#cbd5e1', display: { xs: 'none', sm: 'block' } }} />

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newView) => { if (newView) onViewModeChange(newView) }}
          size="small"
          sx={{ 
            bgcolor: '#f1f5f9',
            p: 0.5,
            borderRadius: 2,
            gap: 0.5,
            '& .MuiToggleButtonGroup-grouped': {
              border: 0,
              borderRadius: 1.5,
              '&.Mui-selected': {
                bgcolor: 'white',
                color: 'primary.main',
                boxShadow: 1,
                '&:hover': { bgcolor: 'white' }
              },
              '&:not(.Mui-selected)': {
                color: 'text.secondary',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
              }
            }
          }}
        >
          {availableViews.includes('list') && (
            <ToggleButton value="list" aria-label="list">
              <LayoutList size={20} />
            </ToggleButton>
          )}
          {availableViews.includes('grid') && (
            <ToggleButton value="grid" aria-label="grid">
              <LayoutGrid size={20} />
            </ToggleButton>
          )}
          {availableViews.includes('calendar') && (
            <ToggleButton value="calendar" aria-label="calendar">
              <CalendarIcon size={20} />
            </ToggleButton>
          )}
        </ToggleButtonGroup>

        <Button 
          variant="contained" 
          startIcon={<Plus size={20} />} 
          onClick={onAdd}
          disableElevation
          sx={{ fontWeight: 'bold' }}
        >
          {addButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
};

export default PageHeader;