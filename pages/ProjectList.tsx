import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  Calendar, 
  Search, 
  LayoutList, 
  LayoutGrid, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  Building2,
  Clock,
  MoreVertical
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
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import { mockProjects } from '../services/mockData';
import ConfirmationModal from '../components/ConfirmationModal';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Derived Data
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter !== 'all' ? project.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleExport = (format: 'PDF' | 'EXCEL', projectName?: string) => {
    const target = projectName ? `"${projectName}"` : 'a lista de projetos';
    alert(`Exportando ${target} para ${format}... (Funcionalidade Mock)`);
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete));
      setShowToast(true);
      setProjectToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'success';
      case 'Pausado': return 'warning';
      case 'Em Andamento': return 'primary';
      default: return 'default';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Concluído': 
        return { bgcolor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }; // Green
      case 'Pausado': 
        return { bgcolor: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' }; // Orange
      case 'Em Andamento': 
        return { bgcolor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }; // Blue
      default: 
        return { bgcolor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }; // Gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído': return <CheckCircle2 size={14} />;
      case 'Pausado': return <PauseCircle size={14} />;
      case 'Em Andamento': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <PageHeader 
        title="Gestão de Projetos"
        subtitle="Acompanhamento de progresso e cronogramas"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => console.log('Novo Projeto')}
        addButtonLabel="Novo Projeto"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
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
             placeholder="Nome do projeto ou empresa..." 
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
             <MenuItem value="Em Andamento">Em Andamento</MenuItem>
             <MenuItem value="Concluído">Concluído</MenuItem>
             <MenuItem value="Pausado">Pausado</MenuItem>
           </Select>
        </Box>
      </FilterBar>

      {/* Content */}
      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredProjects.length} Projetos Encontrados
           </Typography>
        </Box>

        {viewMode === 'list' ? (
           <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Projeto</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Empresa</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Cronograma</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Progresso</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredProjects.map((proj) => (
                   <TableRow key={proj.id} hover>
                     <TableCell>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ bgcolor: '#eff6ff', color: 'primary.main', border: '1px solid #bfdbfe' }}>
                            <Folder size={18} />
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight="bold">{proj.name}</Typography>
                       </Stack>
                     </TableCell>
                     <TableCell>
                       <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                         <Building2 size={14} />
                         <Typography variant="body2">{proj.companyName}</Typography>
                       </Stack>
                     </TableCell>
                     <TableCell>
                       <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                         <Calendar size={14} />
                         <Typography variant="body2">
                           {new Date(proj.startDate).toLocaleDateString()} - {new Date(proj.endDate).toLocaleDateString()}
                         </Typography>
                       </Stack>
                     </TableCell>
                     <TableCell align="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={proj.progress} 
                            color={getStatusColor(proj.status) as any}
                            sx={{ width: '100%', borderRadius: 1, height: 8 }}
                          />
                          <Typography variant="caption" fontWeight="bold">{proj.progress}%</Typography>
                        </Stack>
                     </TableCell>
                     <TableCell align="center">
                       <Chip 
                         icon={getStatusIcon(proj.status)}
                         label={proj.status}
                         size="small"
                         variant="outlined"
                         sx={{ 
                           fontWeight: 600, 
                           '& .MuiChip-icon': { ml: 1, color: 'inherit' },
                           ...getStatusStyles(proj.status)
                         }}
                       />
                     </TableCell>
                     <TableCell align="right">
                       <Stack direction="row" justifyContent="flex-end">
                         <IconButton size="small" onClick={() => navigate(`/projects/${proj.id}`)}><Eye size={16} /></IconButton>
                         <IconButton size="small"><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(proj.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredProjects.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                       <Typography color="text.secondary">Nenhum projeto encontrado.</Typography>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
             <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
               {filteredProjects.map((proj) => (
                 <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3 }} key={proj.id}>
                   <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <IconButton size="small"><MoreVertical size={18} /></IconButton>
                      </Box>
                      
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                           <Avatar variant="rounded" sx={{ bgcolor: '#eff6ff', color: 'primary.main', border: '1px solid #bfdbfe', width: 32, height: 32 }}>
                              <Folder size={18} />
                           </Avatar>
                           <Box overflow="hidden">
                             <Typography variant="subtitle2" fontWeight="bold" noWrap title={proj.name}>{proj.name}</Typography>
                             <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                               <Building2 size={10} />
                               <Typography variant="caption" noWrap>{proj.companyName}</Typography>
                             </Stack>
                           </Box>
                        </Stack>
                        
                        <Box sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: 1.5, mb: 1.5, border: '1px solid #e2e8f0' }}>
                           <Stack direction="row" justifyContent="space-between" mb={0.5}>
                             <Typography variant="caption" fontWeight="bold" color="text.secondary">Progresso</Typography>
                             <Typography variant="caption" fontWeight="bold">{proj.progress}%</Typography>
                           </Stack>
                           <LinearProgress 
                              variant="determinate" 
                              value={proj.progress} 
                              color={getStatusColor(proj.status) as any}
                              sx={{ borderRadius: 1, height: 4 }}
                           />
                        </Box>

                        <Stack direction="row" justifyContent="space-between" mb={1.5}>
                           <Chip label={new Date(proj.startDate).toLocaleDateString()} size="small" variant="outlined" icon={<Calendar size={10}/>} sx={{ fontSize: '0.65rem', height: 20 }} />
                           <Chip label={new Date(proj.endDate).toLocaleDateString()} size="small" variant="outlined" icon={<Calendar size={10}/>} sx={{ fontSize: '0.65rem', height: 20 }} />
                        </Stack>

                        <Box sx={{ pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                             icon={getStatusIcon(proj.status)}
                             label={proj.status}
                             size="small"
                             variant="outlined"
                             sx={{ 
                               fontWeight: 'bold', 
                               height: 20, 
                               fontSize: '0.65rem',
                               ...getStatusStyles(proj.status)
                             }}
                           />
                          <Button size="small" sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }} onClick={() => navigate(`/projects/${proj.id}`)}>Detalhes</Button>
                        </Box>
                      </CardContent>
                   </Card>
                 </Grid>
               ))}
             </Grid>
             {filteredProjects.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhum projeto encontrado.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Projeto"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
      />

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Projeto excluído com sucesso.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectList;