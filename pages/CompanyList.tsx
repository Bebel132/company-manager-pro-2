import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  LayoutGrid, 
  LayoutList, 
  FileText, 
  MoreVertical, 
  MapPin, 
  Building2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { mockCompanies } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import { CompanyStatus, Company } from '../types';

const CompanyList: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showToast, setShowToast] = useState(false);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  
  // Filter States
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Derived Data
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.cnpj.includes(searchTerm);
      
      const matchesSegment = segmentFilter !== 'all' ? company.segment === segmentFilter : true;
      const matchesStatus = statusFilter !== 'all' ? company.status === statusFilter : true;

      return matchesSearch && matchesSegment && matchesStatus;
    });
  }, [companies, searchTerm, segmentFilter, statusFilter]);

  const uniqueSegments = useMemo(() => 
    Array.from(new Set(companies.map(c => c.segment))), 
  [companies]);

  const handleExport = (format: 'PDF' | 'EXCEL', companyName?: string) => {
    const target = companyName ? `"${companyName}"` : 'a lista de empresas';
    alert(`Exportando ${target} para ${format}... (Funcionalidade Mock)`);
  };

  const confirmDelete = (id: string) => {
    setCompanyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (companyToDelete) {
      setCompanies(prev => prev.filter(c => c.id !== companyToDelete));
      setShowToast(true);
      setCompanyToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <PageHeader 
        title="Gestão de Empresas"
        subtitle="Parceiros, fornecedores e unidades cadastradas"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => console.log('Nova Empresa')}
        addButtonLabel="Nova Empresa"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
      />

      <FilterBar 
        showClear={segmentFilter !== 'all' || statusFilter !== 'all' || !!searchTerm}
        onClear={() => {
          setSegmentFilter('all');
          setStatusFilter('all');
          setSearchTerm('');
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Buscar</InputLabel>
          <TextField 
             placeholder="Nome ou CNPJ..." 
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
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Segmento</InputLabel>
           <Select
             value={segmentFilter}
             onChange={(e) => setSegmentFilter(e.target.value)}
             size="small"
             sx={{ minWidth: 160 }}
           >
             <MenuItem value="all">Todas</MenuItem>
             {uniqueSegments.map(seg => <MenuItem key={seg} value={seg}>{seg}</MenuItem>)}
           </Select>
        </Box>

        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Status</InputLabel>
           <Select
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             size="small"
             sx={{ minWidth: 160 }}
           >
             <MenuItem value="all">Todas</MenuItem>
             {Object.values(CompanyStatus).map(status => (
               <MenuItem key={status} value={status}>{status}</MenuItem>
             ))}
           </Select>
        </Box>
      </FilterBar>

      {/* Content */}
      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredCompanies.length} Empresas Encontradas
           </Typography>
        </Box>

        {viewMode === 'list' ? (
           <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Empresa</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Segmento</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Localização</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredCompanies.map((company) => (
                   <TableRow key={company.id} hover>
                     <TableCell>
                       <Stack direction="row" spacing={2} alignItems="center">
                         <Avatar src={company.logo} alt={company.name} variant="rounded" />
                         <Box>
                           <Typography variant="subtitle2" fontWeight="bold">{company.name}</Typography>
                           <Typography variant="caption" color="text.secondary">{company.cnpj}</Typography>
                         </Box>
                       </Stack>
                     </TableCell>
                     <TableCell>
                       <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, bgcolor: '#f1f5f9', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                         <Building2 size={12} />
                         <Typography variant="caption" fontWeight="medium">{company.segment}</Typography>
                       </Box>
                     </TableCell>
                     <TableCell>
                       <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                         <MapPin size={16} />
                         <Typography variant="body2">{company.city}, {company.state}</Typography>
                       </Stack>
                     </TableCell>
                     <TableCell align="center">
                       <StatusBadge status={company.status} />
                     </TableCell>
                     <TableCell align="right">
                       <Stack direction="row" justifyContent="flex-end">
                         <IconButton size="small" onClick={() => handleExport('PDF', company.name)}><FileText size={16} /></IconButton>
                         <IconButton size="small" onClick={() => navigate(`/company/${company.id}`)}><Eye size={16} /></IconButton>
                         <IconButton size="small"><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(company.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredCompanies.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                       <Typography color="text.secondary">Nenhuma empresa encontrada com os filtros atuais.</Typography>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
             <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
               {filteredCompanies.map((company) => (
                 <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={company.id}>
                   <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <IconButton size="small"><MoreVertical size={18} /></IconButton>
                      </Box>
                      
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Avatar src={company.logo} sx={{ width: 56, height: 56, mb: 1.5, border: '1px solid #f1f5f9' }} />
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>{company.name}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom noWrap>{company.legalName}</Typography>
                        
                        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
                           <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                             <Building2 size={14} />
                             <Typography variant="caption" noWrap>{company.segment}</Typography>
                           </Stack>
                           <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                             <MapPin size={14} />
                             <Typography variant="caption" noWrap>{company.city} - {company.state}</Typography>
                           </Stack>
                        </Stack>

                        <Box sx={{ pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <StatusBadge status={company.status} />
                          <Button size="small" onClick={() => navigate(`/company/${company.id}`)} sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}>Detalhes</Button>
                        </Box>
                      </CardContent>
                   </Card>
                 </Grid>
               ))}
             </Grid>
             {filteredCompanies.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhuma empresa encontrada.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Empresa"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita e removerá todos os dados associados."
      />

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Empresa excluída com sucesso.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyList;