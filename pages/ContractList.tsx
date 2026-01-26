import React, { useState, useMemo } from 'react';
import { 
  FileSignature, 
  DollarSign, 
  Calendar, 
  Search, 
  LayoutList, 
  LayoutGrid, 
  Eye, 
  Pencil, 
  Trash2, 
  MoreVertical,
  Building2,
  FileText
} from 'lucide-react';
import { mockContracts } from '../services/mockData';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Avatar,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Contract } from '../types';

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);

  // Derived Data
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter !== 'all' ? contract.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleExport = (format: 'PDF' | 'EXCEL', contract?: Contract) => {
    const target = contract ? `o contrato ${contract.number}` : 'a lista de contratos';
    alert(`Exportando ${target} para ${format}... (Funcionalidade Mock)`);
  };

  const confirmDelete = (id: string) => {
    setContractToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (contractToDelete) {
      setContracts(prev => prev.filter(c => c.id !== contractToDelete));
      setShowToast(true);
      setContractToDelete(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativo': 
        return { bgcolor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }; // Green
      case 'Vencido': 
        return { bgcolor: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' }; // Red
      default: 
        return { bgcolor: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' }; // Orange (Renovação)
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader 
        title="Gestão de Contratos"
        subtitle="Controle de vigências, valores e renovações"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => console.log('Novo Contrato')}
        addButtonLabel="Novo Contrato"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
        availableViews={['list', 'grid']}
      />

      <FilterBar 
        showClear={statusFilter !== 'all' || !!searchTerm}
        onClear={() => {
          setStatusFilter('all');
          setSearchTerm('');
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Buscar</InputLabel>
          <TextField 
             placeholder="Nº Contrato ou Empresa..." 
             size="small" 
             fullWidth
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <Search size={16} />
                 </InputAdornment>
               ),
             }}
          />
        </Box>

        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Status</InputLabel>
           <Select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             size="small"
             sx={{ minWidth: 160 }}
           >
             <MenuItem value="all">Todos</MenuItem>
             <MenuItem value="Ativo">Ativo</MenuItem>
             <MenuItem value="Renovação">Renovação</MenuItem>
             <MenuItem value="Vencido">Vencido</MenuItem>
           </Select>
        </Box>
      </FilterBar>

      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredContracts.length} Contratos Encontrados
           </Typography>
        </Box>

        {viewMode === 'list' ? (
           <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Contrato</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Empresa</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Vigência</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Valor</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredContracts.map((contract) => (
                   <TableRow key={contract.id} hover>
                     <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ bgcolor: '#f3e8ff', color: '#9333ea', width: 32, height: 32 }}>
                             <FileSignature size={18} />
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight="bold">{contract.number}</Typography>
                        </Stack>
                     </TableCell>
                     <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                           <Building2 size={16} />
                           <Typography variant="body2" color="text.primary">{contract.companyName}</Typography>
                        </Stack>
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2">
                          {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </Typography>
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2" fontWeight="bold">{formatCurrency(contract.value)}</Typography>
                     </TableCell>
                     <TableCell align="center">
                        <Chip 
                          label={contract.status} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 600, ...getStatusStyles(contract.status) }}
                        />
                     </TableCell>
                     <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                           <IconButton size="small" onClick={() => handleExport('PDF', contract)}><FileText size={16} /></IconButton>
                           <IconButton size="small"><Pencil size={16} /></IconButton>
                           <IconButton size="small" color="error" onClick={() => confirmDelete(contract.id)}><Trash2 size={16} /></IconButton>
                        </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredContracts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Nenhum contrato encontrado.</Typography>
                      </TableCell>
                    </TableRow>
                 )}
               </TableBody>
             </Table>
           </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
              {filteredContracts.map((contract) => (
                <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={contract.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton size="small"><MoreVertical size={18} /></IconButton>
                    </Box>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                         <Avatar variant="rounded" sx={{ bgcolor: '#f3e8ff', color: '#9333ea', width: 48, height: 48 }}>
                           <FileSignature size={24} />
                         </Avatar>
                         <Chip 
                            label={contract.status} 
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 'bold', fontSize: '0.65rem', height: 20, mr: 3, ...getStatusStyles(contract.status) }}
                          />
                      </Stack>
                      
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>{contract.companyName}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>{contract.number}</Typography>
                      
                      <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1.5, my: 2, border: '1px solid #e2e8f0' }}>
                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                           <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                             <DollarSign size={12}/> Valor
                           </Typography>
                           <Typography variant="body2" fontWeight="bold">{formatCurrency(contract.value)}</Typography>
                         </Stack>
                         <Stack direction="row" justifyContent="space-between" alignItems="center">
                           <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                             <Calendar size={12}/> Fim
                           </Typography>
                           <Typography variant="body2" fontWeight="bold">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</Typography>
                         </Stack>
                      </Box>

                      <Box sx={{ pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: 1 }}>
                         <IconButton size="small" onClick={() => handleExport('PDF', contract)}><FileText size={16} /></IconButton>
                         <IconButton size="small"><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(contract.id)}><Trash2 size={16} /></IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {filteredContracts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhum contrato encontrado.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Contrato"
        description="Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita."
      />

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Contrato excluído com sucesso.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContractList;