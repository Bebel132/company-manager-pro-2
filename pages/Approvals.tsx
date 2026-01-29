import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  LayoutList, 
  LayoutGrid, 
  Filter, 
  History, 
  UserPlus, 
  MoreVertical,
  FileText, 
  User,
  ArrowRight,
  CheckSquare
} from 'lucide-react';
import { mockActivities, mockPeople, mockProjects } from '../services/mockData';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
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
  Grid,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Person, Activity } from '../types';

// Extended type for local state handling
interface ExtendedApproval extends Activity {
  assignees: Person[];
  history: {
    id: string;
    date: string;
    action: string;
    user: string;
    note?: string;
  }[];
}

const Approvals: React.FC = () => {
  // Initialize state with enriched mock data
  const [approvals, setApprovals] = useState<ExtendedApproval[]>(() => {
    return mockActivities.map(act => ({
      ...act,
      // Simulate initial assignee as the first person in mockPeople or random
      assignees: [mockPeople[0]], 
      history: [
        {
          id: '1',
          date: act.date,
          action: 'Solicitação Criada',
          user: 'Sistema',
          note: 'Criação automática de registro de horas'
        }
      ]
    }));
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pendente'); // Default to Pending
  const [projectFilter, setProjectFilter] = useState('all');

  // Modals State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<ExtendedApproval | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [justification, setJustification] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Filter Logic
  const filteredApprovals = useMemo(() => {
    return approvals.filter(item => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : 
                            statusFilter === 'Pendente' ? item.status === 'Pendente' :
                            item.status !== 'Pendente'; // History view
      const matchesProject = projectFilter === 'all' ? true : item.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [approvals, searchTerm, statusFilter, projectFilter]);

  // Actions
  const handleOpenAction = (item: ExtendedApproval, type: 'approve' | 'reject') => {
    setSelectedItem(item);
    setActionType(type);
    setJustification('');
    setActionModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedItem || !actionType) return;

    const newStatus = actionType === 'approve' ? 'Aprovado' : 'Rejeitado';
    const actionText = actionType === 'approve' ? 'Aprovado por' : 'Rejeitado por';

    setApprovals(prev => prev.map(app => {
      if (app.id === selectedItem.id) {
        return {
          ...app,
          status: newStatus,
          history: [
            ...app.history, 
            {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              action: actionText,
              user: 'Você (Admin)',
              note: justification
            }
          ]
        };
      }
      return app;
    }));
    setActionModalOpen(false);
  };

  const handleOpenReassign = (item: ExtendedApproval) => {
    setSelectedItem(item);
    setSelectedAssignees(item.assignees.map(p => p.id));
    setReassignModalOpen(true);
  };

  const confirmReassign = () => {
    if (!selectedItem) return;

    const newAssignees = mockPeople.filter(p => selectedAssignees.includes(p.id));
    const assigneeNames = newAssignees.map(p => p.name).join(', ');

    setApprovals(prev => prev.map(app => {
      if (app.id === selectedItem.id) {
        return {
          ...app,
          assignees: newAssignees,
          history: [
            ...app.history,
            {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              action: 'Reatribuído para',
              user: 'Você (Admin)',
              note: `Novos responsáveis: ${assigneeNames}`
            }
          ]
        };
      }
      return app;
    }));
    setReassignModalOpen(false);
  };

  const handleOpenHistory = (item: ExtendedApproval) => {
    setSelectedItem(item);
    setHistoryModalOpen(true);
  };

  const handleExport = (format: 'PDF' | 'EXCEL') => {
    alert(`Exportando aprovações em ${format}...`);
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader 
        title="Central de Aprovações"
        subtitle="Gerencie solicitações de horas, despesas e documentos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={() => console.log('Nova Solicitação')}
        addButtonLabel="Nova Solicitação"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
        availableViews={['list', 'grid']}
      />

      <FilterBar 
        showClear={statusFilter !== 'Pendente' || !!searchTerm || projectFilter !== 'all'}
        onClear={() => {
          setStatusFilter('Pendente');
          setSearchTerm('');
          setProjectFilter('all');
        }}
      >
         <Box sx={{ flex: 1, minWidth: 200 }}>
          <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Buscar</InputLabel>
          <TextField 
             placeholder="Projeto, descrição..." 
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
             {mockProjects.map(p => (
               <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
             ))}
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
             <MenuItem value="Pendente">Pendentes</MenuItem>
             <MenuItem value="Histórico">Resolvidos</MenuItem>
           </Select>
        </Box>
      </FilterBar>

      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
           {viewMode === 'grid' ? <LayoutGrid size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
           <Typography fontWeight="bold" color="text.primary">
             {filteredApprovals.length} Solicitações
           </Typography>
        </Box>

        {viewMode === 'list' ? (
           <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Solicitação</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Projeto</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Detalhes</TableCell>
                   <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Responsáveis</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredApprovals.map((item) => (
                   <TableRow key={item.id} hover>
                     <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: '#fff7ed', color: '#d97706', width: 40, height: 40 }}>
                             <Clock size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{item.description}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(item.date).toLocaleDateString('pt-BR')}</Typography>
                          </Box>
                        </Stack>
                     </TableCell>
                     <TableCell>
                       <Chip label={item.project} size="small" variant="outlined" />
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2" fontWeight="bold">{item.hours} Horas</Typography>
                        <Typography variant="caption" color="text.secondary">Registro de Tempo</Typography>
                     </TableCell>
                     <TableCell>
                        <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                          {item.assignees.map(assignee => (
                             <Avatar key={assignee.id} src={assignee.avatar} alt={assignee.name} sx={{ width: 28, height: 28 }} />
                          ))}
                        </AvatarGroup>
                     </TableCell>
                     <TableCell align="center">
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={item.status === 'Aprovado' ? 'success' : item.status === 'Rejeitado' ? 'error' : 'warning'} 
                          variant={item.status === 'Pendente' ? 'filled' : 'outlined'}
                        />
                     </TableCell>
                     <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                           <IconButton size="small" onClick={() => handleOpenHistory(item)} title="Histórico">
                             <History size={18} />
                           </IconButton>
                           {item.status === 'Pendente' && (
                             <>
                               <IconButton size="small" onClick={() => handleOpenReassign(item)} title="Reatribuir">
                                 <UserPlus size={18} />
                               </IconButton>
                               <IconButton size="small" color="error" onClick={() => handleOpenAction(item, 'reject')} title="Rejeitar">
                                 <XCircle size={18} />
                               </IconButton>
                               <IconButton size="small" color="success" onClick={() => handleOpenAction(item, 'approve')} title="Aprovar">
                                 <CheckCircle size={18} />
                               </IconButton>
                             </>
                           )}
                        </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredApprovals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Nenhuma solicitação encontrada.</Typography>
                      </TableCell>
                    </TableRow>
                 )}
               </TableBody>
             </Table>
           </TableContainer>
        ) : (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
              {filteredApprovals.map((item) => (
                <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={item.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                       <Chip 
                          label={item.status} 
                          size="small" 
                          color={item.status === 'Aprovado' ? 'success' : item.status === 'Rejeitado' ? 'error' : 'warning'} 
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                    </Box>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                       <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: '#fff7ed', color: '#d97706', width: 40, height: 40 }}>
                             <Clock size={20} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap title={item.project}>{item.project}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(item.date).toLocaleDateString('pt-BR')}</Typography>
                          </Box>
                       </Stack>
                       
                       <Typography variant="body2" sx={{ mb: 2, minHeight: 40 }}>{item.description}</Typography>
                       
                       <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Horas</Typography>
                          <Typography variant="subtitle2" fontWeight="bold">{item.hours}h</Typography>
                       </Stack>

                       <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Responsáveis</Typography>
                          <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                            {item.assignees.map(assignee => (
                               <Avatar key={assignee.id} src={assignee.avatar} alt={assignee.name} sx={{ width: 24, height: 24 }} />
                            ))}
                          </AvatarGroup>
                       </Box>

                       <Stack direction="row" spacing={1} pt={1} borderTop="1px solid #f1f5f9">
                          <Button size="small" fullWidth variant="outlined" startIcon={<History size={16}/>} onClick={() => handleOpenHistory(item)}>
                            Histórico
                          </Button>
                          {item.status === 'Pendente' && (
                             <Button size="small" variant="contained" sx={{ minWidth: 40, p: 0 }} onClick={() => handleOpenAction(item, 'approve')}>
                                <CheckCircle size={18} />
                             </Button>
                          )}
                          {item.status === 'Pendente' && (
                             <Button size="small" variant="outlined" color="error" sx={{ minWidth: 40, p: 0 }} onClick={() => handleOpenAction(item, 'reject')}>
                                <XCircle size={18} />
                             </Button>
                          )}
                       </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Action Dialog (Approve/Reject) */}
      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actionType === 'approve' ? <CheckCircle color="#16a34a" /> : <XCircle color="#dc2626" />}
          {actionType === 'approve' ? 'Aprovar Solicitação' : 'Reprovar Solicitação'}
        </DialogTitle>
        <DialogContent>
           <Typography variant="body2" sx={{ mb: 2 }}>
             Você está prestes a {actionType === 'approve' ? 'aprovar' : 'reprovar'} a solicitação de <strong>{selectedItem?.hours} horas</strong> para o projeto <strong>{selectedItem?.project}</strong>.
           </Typography>
           
           <TextField 
             label={actionType === 'reject' ? "Justificativa (Obrigatório)" : "Observação (Opcional)"}
             fullWidth
             multiline
             rows={3}
             value={justification}
             onChange={(e) => setJustification(e.target.value)}
             error={actionType === 'reject' && justification.trim() === ''}
             helperText={actionType === 'reject' && justification.trim() === '' ? "A justificativa é obrigatória para reprovações." : ""}
             sx={{ mt: 1 }}
           />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setActionModalOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            color={actionType === 'approve' ? 'success' : 'error'}
            onClick={confirmAction}
            disabled={actionType === 'reject' && justification.trim() === ''}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={reassignModalOpen} onClose={() => setReassignModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reatribuir Solicitação</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             Selecione as pessoas responsáveis por aprovar esta solicitação.
          </Typography>
          <Select
            multiple
            fullWidth
            value={selectedAssignees}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedAssignees(typeof val === 'string' ? val.split(',') : val);
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const person = mockPeople.find(p => p.id === value);
                  return <Chip key={value} label={person?.name} size="small" avatar={<Avatar src={person?.avatar} />} />;
                })}
              </Box>
            )}
          >
            {mockPeople.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                <Checkbox checked={selectedAssignees.indexOf(person.id) > -1} />
                <ListItemText primary={person.name} secondary={person.role} />
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReassignModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmReassign}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Histórico da Solicitação</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Stepper orientation="vertical" activeStep={selectedItem.history.length}>
               {selectedItem.history.map((hist, index) => (
                 <Step key={hist.id} active={true} expanded={true}>
                   <StepLabel 
                      icon={
                        <Box sx={{ 
                          width: 24, height: 24, borderRadius: '50%', 
                          bgcolor: index === selectedItem.history.length - 1 ? 'primary.main' : 'grey.300',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 
                        }}>
                          {index + 1}
                        </Box>
                      }
                   >
                     <Typography variant="subtitle2" fontWeight="bold">{hist.action}</Typography>
                     <Typography variant="caption" color="text.secondary">
                       {new Date(hist.date).toLocaleString()} • {hist.user}
                     </Typography>
                   </StepLabel>
                   <StepContent>
                     {hist.note && (
                       <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f8fafc', mt: 1 }}>
                         <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                           "{hist.note}"
                         </Typography>
                       </Paper>
                     )}
                   </StepContent>
                 </Step>
               ))}
            </Stepper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHistoryModalOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Approvals;