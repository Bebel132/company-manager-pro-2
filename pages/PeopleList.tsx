import React, { useState, useMemo } from 'react';
import { 
  Search, 
  LayoutList, 
  LayoutGrid, 
  MoreVertical, 
  Mail,
  UserCircle,
  Briefcase,
  Pencil,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';
import { mockPeople } from '../services/mockData';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Avatar, 
  LinearProgress, 
  Link,
  Stack,
  TextField,
  InputAdornment, 
  InputLabel,
  Select,
  MenuItem,
  TableContainer, 
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert
} from '@mui/material';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ConfirmationModal from '../components/ConfirmationModal';
import { Person } from '../types';

const PeopleList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  // Derived Data
  const uniqueRoles = useMemo(() => 
    Array.from(new Set(people.map(p => p.role))), 
  [people]);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter !== 'all' ? person.role === roleFilter : true;

      return matchesSearch && matchesRole;
    });
  }, [people, searchTerm, roleFilter]);

  const handleExport = (format: 'PDF' | 'EXCEL', personName?: string) => {
    const target = personName ? `"${personName}"` : 'a lista de pessoas';
    alert(`Exportando ${target} para ${format}... (Funcionalidade Mock)`);
  };

  const confirmDelete = (id: string) => {
    setPersonToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (personToDelete) {
      setPeople(prev => prev.filter(p => p.id !== personToDelete));
      setShowToast(true);
      setPersonToDelete(null);
    }
  };

  const getAllocationColor = (value: number) => {
    if (value >= 100) return 'error';
    if (value >= 80) return 'warning';
    return 'success';
  };

  const getProductivityColor = (value: number) => {
    if (value >= 80) return 'success';
    if (value >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <PageHeader 
        title="Gestão de Pessoas"
        subtitle="Colaboradores, cargos, alocação e produtividade"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => console.log('Nova Pessoa')}
        addButtonLabel="Nova Pessoa"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
      />

      <FilterBar 
        showClear={roleFilter !== 'all' || !!searchTerm}
        onClear={() => {
          setRoleFilter('all');
          setSearchTerm('');
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Buscar</InputLabel>
          <TextField 
             placeholder="Nome ou Email..." 
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
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Cargo</InputLabel>
           <Select
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
             size="small"
             sx={{ minWidth: 160 }}
           >
             <MenuItem value="all">Todos</MenuItem>
             {uniqueRoles.map(role => (
               <MenuItem key={role} value={role}>{role}</MenuItem>
             ))}
           </Select>
        </Box>
      </FilterBar>

      {/* Content */}
      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredPeople.length} Pessoas Encontradas
           </Typography>
        </Box>

        {viewMode === 'list' ? (
           <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Colaborador</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Cargo</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', width: '20%' }}>Alocação</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', width: '20%' }}>Produtividade</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredPeople.map((person) => (
                   <TableRow key={person.id} hover>
                     <TableCell>
                       <Stack direction="row" spacing={2} alignItems="center">
                         <Avatar src={person.avatar} alt={person.name} sx={{ width: 40, height: 40, border: '1px solid #e2e8f0' }} />
                         <Box>
                           <Typography variant="subtitle2" fontWeight="bold">{person.name}</Typography>
                           <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                             <Mail size={12} />
                             <Typography variant="caption">{person.email}</Typography>
                           </Stack>
                         </Box>
                       </Stack>
                     </TableCell>
                     <TableCell>
                       <Stack direction="row" alignItems="center" spacing={1}>
                         <Briefcase size={16} color="#64748b" />
                         <Typography variant="body2">{person.role}</Typography>
                       </Stack>
                     </TableCell>
                     <TableCell>
                       <Box sx={{ width: '100%' }}>
                         <Stack direction="row" justifyContent="space-between" mb={0.5}>
                           <Typography variant="caption" fontWeight="medium">Ocupação</Typography>
                           <Typography variant="caption" fontWeight="bold">{person.allocation}%</Typography>
                         </Stack>
                         <LinearProgress 
                           variant="determinate" 
                           value={person.allocation} 
                           color={getAllocationColor(person.allocation)}
                           sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }} 
                         />
                       </Box>
                     </TableCell>
                     <TableCell>
                       <Box sx={{ width: '100%' }}>
                         <Stack direction="row" justifyContent="space-between" mb={0.5}>
                           <Typography variant="caption" fontWeight="medium">Nível</Typography>
                           <Typography variant="caption" fontWeight="bold">{person.productivity}%</Typography>
                         </Stack>
                         <LinearProgress 
                           variant="determinate" 
                           value={person.productivity} 
                           color={getProductivityColor(person.productivity)}
                           sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }} 
                         />
                       </Box>
                     </TableCell>
                     <TableCell align="right">
                       <Stack direction="row" justifyContent="flex-end">
                         <IconButton size="small"><Eye size={16} /></IconButton>
                         <IconButton size="small"><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(person.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredPeople.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                       <Typography color="text.secondary">Nenhuma pessoa encontrada com os filtros atuais.</Typography>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
             <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
               {filteredPeople.map((person) => (
                 <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={person.id}>
                   <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <IconButton size="small"><MoreVertical size={18} /></IconButton>
                      </Box>
                      
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 3, pb: 2, '&:last-child': { pb: 2 } }}>
                        <Avatar 
                          src={person.avatar} 
                          alt={person.name} 
                          sx={{ width: 64, height: 64, mb: 1.5, border: '3px solid #f0f9ff' }} 
                        />
                        
                        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ width: '100%' }}>{person.name}</Typography>
                        <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mb: 2, fontSize: '0.8rem' }}>{person.role}</Typography>
                        
                        <Box sx={{ width: '100%', mb: 1, px: 1 }}>
                          <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color="text.secondary">Alocação</Typography>
                            <Typography variant="caption" fontWeight="bold">{person.allocation}%</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={person.allocation} 
                            color={getAllocationColor(person.allocation)} 
                            sx={{ height: 6, borderRadius: 4, bgcolor: '#f0fdf4' }} 
                          />
                        </Box>

                        <Box sx={{ width: '100%', mb: 1, px: 1 }}>
                          <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color="text.secondary">Produtividade</Typography>
                            <Typography variant="caption" fontWeight="bold">{person.productivity}%</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={person.productivity} 
                            color={getProductivityColor(person.productivity)} 
                            sx={{ height: 6, borderRadius: 4, bgcolor: '#f0fdf4' }} 
                          />
                        </Box>
                        
                        <Link 
                          href={`mailto:${person.email}`} 
                          underline="hover" 
                          sx={{ mt: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                        >
                          <Mail size={12} />
                          {person.email}
                        </Link>

                        <Box sx={{ pt: 1.5, mt: 'auto', width: '100%', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Button size="small" startIcon={<Eye size={14} />} sx={{ fontSize: '0.75rem', px: 1 }}>Perfil</Button>
                          <IconButton size="small" onClick={() => console.log('Edit')}><Pencil size={14} /></IconButton>
                          <IconButton size="small" color="error" onClick={() => confirmDelete(person.id)}><Trash2 size={14} /></IconButton>
                        </Box>
                      </CardContent>
                   </Card>
                 </Grid>
               ))}
             </Grid>
             {filteredPeople.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhum colaborador encontrado.</Typography>
                </Box>
             )}
          </Box>
        )}
      </Paper>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Colaborador"
        description="Tem certeza que deseja remover este colaborador? Esta ação não pode ser desfeita."
      />

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Colaborador removido com sucesso.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PeopleList;