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
  FileText,
  AlertTriangle,
  Link as LinkIcon,
  Upload,
  Plus
} from 'lucide-react';
import { mockContracts, mockCompanies, mockProjects } from '../services/mockData';
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
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Contract } from '../types';

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  
  // Form State
  const [activeTab, setActiveTab] = useState(0); // 0 = New Contract, 1 = Addendum
  const [formData, setFormData] = useState<Partial<Contract> & { projectAction?: 'none' | 'existing' | 'new', newProjectName?: string }>({
    number: '',
    companyId: '',
    status: 'Ativo',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    files: [],
    hours: 0,
    segment: '',
    serviceType: '',
    parentContractId: '',
    projectId: '',
    projectAction: 'existing'
  });

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

  const handleOpenModal = () => {
    setFormData({
      number: '',
      companyId: '',
      status: 'Ativo',
      value: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      files: [],
      hours: 0,
      segment: '',
      serviceType: '',
      parentContractId: '',
      projectId: '',
      projectAction: 'existing',
      newProjectName: ''
    });
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.number || (!formData.companyId && activeTab === 0) || (activeTab === 1 && !formData.parentContractId)) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const company = activeTab === 0 
      ? mockCompanies.find(c => c.id === formData.companyId)
      : mockCompanies.find(c => c.id === contracts.find(ct => ct.id === formData.parentContractId)?.companyId);

    const newContract: Contract = {
      id: Date.now().toString(),
      number: formData.number || '',
      companyId: company?.id || '',
      companyName: company?.name || '',
      value: Number(formData.value) || 0,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      status: formData.status as any,
      hours: Number(formData.hours) || 0,
      segment: formData.segment,
      serviceType: formData.serviceType,
      files: formData.files,
      parentContractId: activeTab === 1 ? formData.parentContractId : undefined,
      projectId: formData.projectAction === 'existing' ? formData.projectId : undefined // In a real app, 'new' would create a project first
    };

    setContracts([newContract, ...contracts]);
    setIsModalOpen(false);
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
        subtitle="Controle de vigências, valores e aditivos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={handleOpenModal}
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
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Detalhes</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredContracts.map((contract) => {
                   const isAddendum = !!contract.parentContractId;
                   const company = mockCompanies.find(c => c.id === contract.companyId);
                   const hasProject = !!contract.projectId;

                   return (
                   <TableRow key={contract.id} hover>
                     <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ bgcolor: isAddendum ? '#eff6ff' : '#f3e8ff', color: isAddendum ? '#2563eb' : '#9333ea', width: 32, height: 32 }}>
                             {isAddendum ? <LinkIcon size={16} /> : <FileSignature size={18} />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{contract.number}</Typography>
                            {isAddendum && (
                              <Typography variant="caption" color="text.secondary">Aditivo</Typography>
                            )}
                          </Box>
                        </Stack>
                     </TableCell>
                     <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                           <Avatar src={company?.logo} sx={{ width: 24, height: 24, borderRadius: 1 }} />
                           <Box>
                             <Typography variant="body2" fontWeight="medium">{contract.companyName}</Typography>
                             <Typography variant="caption" color="text.secondary">{company?.cnpj}</Typography>
                           </Box>
                        </Stack>
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2">
                          {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contract.hours}h contratadas
                        </Typography>
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2" fontWeight="bold">{formatCurrency(contract.value)}</Typography>
                        {!hasProject && (
                          <Tooltip title="Atenção: Necessário cadastrar projeto">
                            <Chip 
                              icon={<AlertTriangle size={12} />} 
                              label="Sem Projeto" 
                              size="small" 
                              color="warning" 
                              sx={{ height: 20, fontSize: '0.65rem', mt: 0.5, animation: 'pulse 2s infinite' }}
                            />
                          </Tooltip>
                        )}
                        {hasProject && <Chip label="Com Projeto" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', mt: 0.5, borderColor: '#e2e8f0' }} />}
                     </TableCell>
                     <TableCell>
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
                 )})}
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
            <Grid container spacing={2}>
              {filteredContracts.map((contract) => {
                const isAddendum = !!contract.parentContractId;
                const hasProject = !!contract.projectId;
                const company = mockCompanies.find(c => c.id === contract.companyId);

                return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={contract.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton size="small"><MoreVertical size={18} /></IconButton>
                    </Box>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                         <Avatar variant="rounded" sx={{ bgcolor: isAddendum ? '#eff6ff' : '#f3e8ff', color: isAddendum ? '#2563eb' : '#9333ea', width: 48, height: 48 }}>
                           {isAddendum ? <LinkIcon size={24} /> : <FileSignature size={24} />}
                         </Avatar>
                         <Stack alignItems="end">
                           <Chip 
                              label={contract.status} 
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 'bold', fontSize: '0.65rem', height: 20, mb: 0.5, ...getStatusStyles(contract.status) }}
                            />
                            {!hasProject && (
                              <Tooltip title="Sem Projeto vinculado">
                                <AlertTriangle size={16} color="#ea580c" />
                              </Tooltip>
                            )}
                         </Stack>
                      </Stack>
                      
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>{contract.companyName}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>{contract.number} {isAddendum ? '(Aditivo)' : ''}</Typography>
                      
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
              )})}
            </Grid>
            {filteredContracts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhum contrato encontrado.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle variant="h6" fontWeight="bold">Cadastro de Contrato</DialogTitle>
        <DialogContent dividers>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Novo Contrato" sx={{ fontWeight: 600 }} />
            <Tab label="Aditivo" sx={{ fontWeight: 600 }} />
          </Tabs>

          <Grid container spacing={2}>
            {activeTab === 1 && (
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 0.5 }}>Contrato Original</InputLabel>
                <Select
                  fullWidth
                  size="small"
                  value={formData.parentContractId}
                  onChange={(e) => {
                    const parent = contracts.find(c => c.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      parentContractId: e.target.value,
                      companyId: parent?.companyId // Inherit company
                    });
                  }}
                >
                  {contracts.filter(c => !c.parentContractId).map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.number} - {c.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}

            {/* Row 1: Company, Number, Status, Hours, Start, End */}
            <Grid item xs={12} md={2}>
              <InputLabel sx={{ mb: 0.5 }}>Empresa</InputLabel>
              <Select
                fullWidth
                size="small"
                disabled={activeTab === 1}
                value={formData.companyId}
                onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                renderValue={(selected) => {
                  const company = mockCompanies.find(c => c.id === selected);
                  return company ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={company.logo} sx={{ width: 20, height: 20 }} />
                      <Typography variant="body2">{company.name}</Typography>
                    </Stack>
                  ) : selected;
                }}
              >
                {mockCompanies.map(company => (
                  <MenuItem key={company.id} value={company.id}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={company.logo} sx={{ width: 24, height: 24 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{company.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{company.cnpj}</Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={3}>
              <InputLabel sx={{ mb: 0.5 }}>Número do Contrato</InputLabel>
              <TextField 
                size="small"
                fullWidth 
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <InputLabel sx={{ mb: 0.5 }}>Status</InputLabel>
              <Select
                fullWidth
                size="small"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Renovação">Renovação</MenuItem>
                <MenuItem value="Vencido">Vencido</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <InputLabel sx={{ mb: 0.5 }}>Carga Horária Total</InputLabel>
              <TextField 
                size="small"
                type="number"
                fullWidth 
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: Number(e.target.value)})}
                InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption" color="text.secondary">h</Typography></InputAdornment> }}
              />
            </Grid>

            <Grid item xs={6} md={1.5}>
              <InputLabel sx={{ mb: 0.5 }}>Data Início</InputLabel>
              <TextField 
                size="small"
                type="date"
                fullWidth 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </Grid>

            <Grid item xs={6} md={1.5}>
              <InputLabel sx={{ mb: 0.5 }}>Data Conclusão</InputLabel>
              <TextField 
                size="small"
                type="date"
                fullWidth 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </Grid>

            {/* Row 2: Value, Segment */}
            <Grid item xs={6} md={2}>
              <InputLabel sx={{ mb: 0.5 }}>Valor (R$)</InputLabel>
              <TextField 
                size="small"
                type="number"
                fullWidth 
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
              />
            </Grid>

            <Grid item xs={6} md={4}>
              <InputLabel sx={{ mb: 0.5 }}>Segmento</InputLabel>
              <TextField 
                size="small"
                fullWidth 
                placeholder="Ex: Tecnologia, Jurídico..."
                value={formData.segment}
                onChange={(e) => setFormData({...formData, segment: e.target.value})}
              />
            </Grid>

            {/* Row 3: Association and Upload */}
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Associação de Projeto</Typography>
                <RadioGroup 
                  row 
                  value={formData.projectAction}
                  onChange={(e) => setFormData({...formData, projectAction: e.target.value as any})}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel value="existing" control={<Radio size="small" />} label={<Typography variant="body2">Projeto Existente</Typography>} />
                  <FormControlLabel value="new" control={<Radio size="small" />} label={<Typography variant="body2">Novo Projeto</Typography>} />
                  <FormControlLabel value="none" control={<Radio size="small" />} label={<Typography variant="body2">Nenhum (Pendente)</Typography>} />
                </RadioGroup>

                {formData.projectAction === 'existing' && (
                  <Box>
                    <InputLabel sx={{ mb: 0.5 }}>Selecione o Projeto</InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      value={formData.projectId || ''}
                      onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                      displayEmpty
                      renderValue={(selected) => {
                        const project = mockProjects.find(p => p.id === selected);
                        return project ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar variant="rounded" sx={{ width: 20, height: 20, bgcolor: project.color }}>
                               <FileSignature size={12} color="white" />
                            </Avatar>
                            <Typography variant="body2">{project.name}</Typography>
                          </Stack>
                        ) : selected;
                      }}
                    >
                      <MenuItem value="" disabled>Selecione...</MenuItem>
                      {mockProjects.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                           <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar variant="rounded" sx={{ width: 24, height: 24, bgcolor: p.color }}>
                                 <FileSignature size={14} color="white" />
                              </Avatar>
                              <Typography variant="body2">{p.name}</Typography>
                           </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}

                {formData.projectAction === 'new' && (
                  <TextField 
                    fullWidth 
                    size="small"
                    label="Nome do Novo Projeto" 
                    value={formData.newProjectName}
                    onChange={(e) => setFormData({...formData, newProjectName: e.target.value})}
                  />
                )}
                
                {formData.projectAction === 'none' && (
                  <Alert severity="warning" sx={{ py: 0 }}>Este contrato ficará sinalizado até que um projeto seja vinculado.</Alert>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button 
                variant="outlined" 
                component="label" 
                fullWidth 
                sx={{ 
                  height: '100%', 
                  borderStyle: 'dashed', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  textTransform: 'none'
                }}
              >
                <Upload size={24} />
                <Typography fontWeight="bold">Anexar Arquivos do Contrato</Typography>
                <input type="file" hidden multiple />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f9fafb' }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disableElevation>Salvar Contrato</Button>
        </DialogActions>
      </Dialog>

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