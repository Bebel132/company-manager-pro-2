import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Briefcase, 
  LayoutList, 
  LayoutGrid, 
  Search,
  Pencil,
  Trash2,
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { mockActivities, mockProjects } from '../services/mockData';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  TextField, 
  MenuItem, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Chip,
  Stack,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { Activity } from '../types';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Activity>>({
    project: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: '',
    status: 'Pendente'
  });

  // Derived Data
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = projectFilter !== 'all' ? act.project === projectFilter : true;
      const matchesStatus = statusFilter !== 'all' ? act.status === statusFilter : true;
      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [activities, searchTerm, projectFilter, statusFilter]);

  const handleSave = () => {
    if (!formData.project || !formData.hours || !formData.description) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      project: mockProjects.find(p => p.id === formData.project)?.name || formData.project || '',
      date: formData.date!,
      hours: Number(formData.hours),
      description: formData.description!,
      status: 'Pendente'
    };

    setActivities([newActivity, ...activities]);
    setIsAddModalOpen(false);
    setFormData({
        project: '',
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        description: '',
        status: 'Pendente'
    });
  };

  const confirmDelete = (id: string) => {
    setActivityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (activityToDelete) {
      setActivities(prev => prev.filter(a => a.id !== activityToDelete));
      setShowToast(true);
      setActivityToDelete(null);
    }
  };

  const handleExport = (format: 'PDF' | 'EXCEL') => {
    alert(`Exportando atividades para ${format}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'success';
      case 'Rejeitado': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado': return <CheckCircle2 size={14} />;
      case 'Rejeitado': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader 
        title="Registro de Atividades"
        subtitle="Apontamento de horas e tarefas realizadas"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => setIsAddModalOpen(true)}
        addButtonLabel="Nova Atividade"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
        availableViews={['list', 'grid']}
      />

      <FilterBar 
        showClear={projectFilter !== 'all' || statusFilter !== 'all' || !!searchTerm}
        onClear={() => {
          setProjectFilter('all');
          setStatusFilter('all');
          setSearchTerm('');
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Buscar</InputLabel>
          <TextField 
             placeholder="Descrição..." 
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
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Projeto</InputLabel>
           <Select
             value={projectFilter}
             onChange={(e) => setProjectFilter(e.target.value)}
             size="small"
             sx={{ minWidth: 160 }}
           >
             <MenuItem value="all">Todos</MenuItem>
             {mockProjects.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
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
             <MenuItem value="all">Todos</MenuItem>
             <MenuItem value="Pendente">Pendente</MenuItem>
             <MenuItem value="Aprovado">Aprovado</MenuItem>
             <MenuItem value="Rejeitado">Rejeitado</MenuItem>
           </Select>
        </Box>
      </FilterBar>

      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredActivities.length} Registros Encontrados
           </Typography>
        </Box>

        {viewMode === 'list' ? (
          <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Data</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Projeto</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Descrição</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Horas</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                        <Calendar size={16} />
                        <Typography variant="body2">{new Date(activity.date).toLocaleDateString('pt-BR')}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Briefcase size={16} color="#0060B1" />
                        <Typography variant="body2" fontWeight="medium">{activity.project}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{activity.description}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold">{activity.hours}h</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={getStatusIcon(activity.status)}
                        label={activity.status} 
                        size="small"
                        color={getStatusColor(activity.status) as any}
                        variant="outlined"
                        sx={{ fontWeight: 600, '& .MuiChip-icon': { ml: 1 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                       <Stack direction="row" spacing={1} justifyContent="flex-end">
                         <IconButton size="small"><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(activity.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Nenhuma atividade encontrada.</Typography>
                      </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
              {filteredActivities.map((activity) => (
                <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={activity.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                       <Chip 
                        label={activity.status} 
                        size="small"
                        color={getStatusColor(activity.status) as any}
                        variant="outlined"
                        sx={{ fontWeight: 600, height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                       <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: '#eff6ff', color: 'primary.main', border: '1px solid #bfdbfe', width: 32, height: 32 }}>
                             <Clock size={18} />
                          </Avatar>
                          <Box overflow="hidden">
                            <Typography variant="subtitle2" fontWeight="bold" noWrap title={activity.project}>{activity.project}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(activity.date).toLocaleDateString('pt-BR')}</Typography>
                          </Box>
                       </Stack>
                       
                       <Typography variant="body2" sx={{ mb: 2, minHeight: 40 }} color="text.secondary">
                         {activity.description}
                       </Typography>
                       
                       <Box sx={{ borderTop: '1px solid #f1f5f9', pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="bold">{activity.hours} Horas</Typography>
                          <Stack direction="row" spacing={0.5}>
                             <IconButton size="small"><Pencil size={14} /></IconButton>
                             <IconButton size="small" color="error" onClick={() => confirmDelete(activity.id)}><Trash2 size={14} /></IconButton>
                          </Stack>
                       </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {filteredActivities.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhuma atividade encontrada.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      {/* Add Dialog */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Atividade</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                select 
                fullWidth 
                label="Projeto" 
                value={formData.project}
                onChange={(e) => setFormData({...formData, project: e.target.value})}
              >
                {mockProjects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                type="date" 
                fullWidth 
                label="Data" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                type="number" 
                fullWidth 
                label="Horas" 
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: Number(e.target.value)})}
                inputProps={{ step: 0.5 }} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Descrição" 
                multiline 
                rows={3} 
                placeholder="O que foi feito?" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disableElevation>Salvar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Atividade"
        description="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
      />

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Atividade excluída com sucesso.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Activities;