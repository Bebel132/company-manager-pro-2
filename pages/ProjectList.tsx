
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
  MoreVertical,
  Plus,
  Briefcase,
  Code,
  Smartphone,
  Globe,
  Database,
  Shield,
  Zap,
  Target,
  User,
  AlertTriangle,
  X,
  Mail,
  Phone,
  BookOpen
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  AvatarGroup,
  SelectChangeEvent,
  Checkbox
} from '@mui/material';
import { mockProjects, mockPeople, mockCompanies, mockLessonsLearned } from '../services/mockData';
import ConfirmationModal from '../components/ConfirmationModal';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import { Project, ProjectCustomField, ProjectMember, ClientContact, CommunicationPlanItem, LessonLearned } from '../types';
import { useNavigate } from 'react-router-dom';

const ICONS_MAP: Record<string, React.ReactNode> = {
  'Folder': <Folder size={20} />,
  'Briefcase': <Briefcase size={20} />,
  'Code': <Code size={20} />,
  'Smartphone': <Smartphone size={20} />,
  'Globe': <Globe size={20} />,
  'Database': <Database size={20} />,
  'Shield': <Shield size={20} />,
  'Zap': <Zap size={20} />,
  'Target': <Target size={20} />,
  'Cloud': <CheckCircle2 size={20} /> // Placeholder fallback
};

const PROJECT_COLORS = [
  '#0060B1', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#db2777', '#4b5563'
];

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
  
  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Project>>({});
  
  // Helper form states
  const [newCustomField, setNewCustomField] = useState<Partial<ProjectCustomField>>({ label: '', type: 'text', required: false });
  const [newTeamMember, setNewTeamMember] = useState<Partial<ProjectMember>>({ allocationHours: 40, workModel: 'Híbrido', requiresApproval: true });
  const [newContact, setNewContact] = useState<Partial<ClientContact>>({ name: '', role: '', email: '', phone: '' });
  const [newCommItem, setNewCommItem] = useState<Partial<CommunicationPlanItem>>({ audience: '', channel: '', frequency: '', responsibleId: '', objective: '' });

  // Lessons Import State
  const [lessonsToImport, setLessonsToImport] = useState<string[]>([]);
  const [importSearch, setImportSearch] = useState('');
  const [importDateStart, setImportDateStart] = useState('');

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

  // Derived Data for Lessons Import
  const filteredLessonsToImport = useMemo(() => {
    return mockLessonsLearned.filter(l => {
      // Exclude lessons from the current project being edited
      if (formData.id && l.projectId === formData.id) return false;

      const matchesSearch = l.description.toLowerCase().includes(importSearch.toLowerCase()) ||
                            l.category.toLowerCase().includes(importSearch.toLowerCase());
      
      let matchesDate = true;
      if (importDateStart) {
          matchesDate = l.date >= importDateStart;
      }

      return matchesSearch && matchesDate;
    });
  }, [importSearch, importDateStart, formData.id]);

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

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setFormData({ ...project });
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        companyName: '',
        status: 'Planejamento',
        progress: 0,
        weeklyAllocation: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        icon: 'Folder',
        color: PROJECT_COLORS[0],
        customFields: [],
        team: [],
        clientContacts: [],
        communicationPlan: [],
        monitoring: {
          missingEstimates: true,
          deviationLogging: true,
          offHoursLogging: true,
          retroactiveFutureLogging: true
        }
      });
    }
    setLessonsToImport([]);
    setImportSearch('');
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    const projectId = formData.id || Date.now().toString();

    // Logic to save (update or create)
    setProjects(prev => {
      const exists = prev.some(p => p.id === projectId);
      const newProjectData = { ...formData, id: projectId } as Project;
      if (exists) {
        return prev.map(p => p.id === projectId ? newProjectData : p);
      }
      return [newProjectData, ...prev];
    });

    // Simulate Saving Imported Lessons
    if (lessonsToImport.length > 0) {
       lessonsToImport.forEach(lessonId => {
          const original = mockLessonsLearned.find(l => l.id === lessonId);
          if (original) {
             const newLesson: LessonLearned = {
                ...original,
                id: Date.now().toString() + Math.random().toString().slice(2,5), // New unique ID
                projectId: projectId,
                sourceProjectId: original.projectId, // Link to source
                status: 'Aprovado' // Auto-approve or set to Pending
             };
             mockLessonsLearned.push(newLesson);
          }
       });
       alert(`${lessonsToImport.length} lições importadas com sucesso!`);
    }
    
    setIsModalOpen(false);
  };

  // --- Sub-handlers for complex form parts ---

  // Custom Fields
  const addCustomField = () => {
    if (!newCustomField.label) return;
    const field: ProjectCustomField = {
      id: Date.now().toString(),
      label: newCustomField.label!,
      type: newCustomField.type || 'text',
      required: newCustomField.required || false,
      options: newCustomField.options
    };
    setFormData(prev => ({ ...prev, customFields: [...(prev.customFields || []), field] }));
    setNewCustomField({ label: '', type: 'text', required: false });
  };

  const removeCustomField = (id: string) => {
    setFormData(prev => ({ ...prev, customFields: (prev.customFields || []).filter(f => f.id !== id) }));
  };

  // Team Members
  const handlePersonSelect = (e: SelectChangeEvent) => {
    const personId = e.target.value;
    const person = mockPeople.find(p => p.id === personId);
    if (person) {
      setNewTeamMember({
        ...newTeamMember,
        personId: person.id,
        role: person.role, // Pre-fill role
        hourlyRate: person.hourlyRate, // Pre-fill rate
        workModel: person.workModel || 'Híbrido' // Pre-fill model
      });
    }
  };

  const addTeamMember = () => {
    if (!newTeamMember.personId) return;
    const person = mockPeople.find(p => p.id === newTeamMember.personId);
    const member: ProjectMember = {
      personId: newTeamMember.personId!,
      role: newTeamMember.role || person?.role || 'Colaborador',
      allocationHours: Number(newTeamMember.allocationHours) || 0,
      workModel: newTeamMember.workModel || 'Híbrido',
      hourlyRate: Number(newTeamMember.hourlyRate) || person?.hourlyRate || 0,
      requiresApproval: newTeamMember.requiresApproval || false,
      approverId: newTeamMember.approverId
    };
    setFormData(prev => ({ ...prev, team: [...(prev.team || []), member] }));
    setNewTeamMember({ allocationHours: 40, workModel: 'Híbrido', requiresApproval: true });
  };

  const removeTeamMember = (personId: string) => {
    setFormData(prev => ({ ...prev, team: (prev.team || []).filter(m => m.personId !== personId) }));
  };

  // Client Contacts
  const addContact = () => {
    if (!newContact.name) return;
    const contact: ClientContact = {
      id: Date.now().toString(),
      name: newContact.name!,
      role: newContact.role || '',
      email: newContact.email || '',
      phone: newContact.phone || ''
    };
    setFormData(prev => ({ ...prev, clientContacts: [...(prev.clientContacts || []), contact] }));
    setNewContact({ name: '', role: '', email: '', phone: '' });
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({ ...prev, clientContacts: (prev.clientContacts || []).filter(c => c.id !== id) }));
  };

  // Communication Plan
  const addCommItem = () => {
    if (!newCommItem.audience || !newCommItem.channel) return;
    const item: CommunicationPlanItem = {
      id: Date.now().toString(),
      audience: newCommItem.audience!,
      channel: newCommItem.channel!,
      frequency: newCommItem.frequency!,
      responsibleId: newCommItem.responsibleId!,
      objective: newCommItem.objective!
    };
    setFormData(prev => ({ ...prev, communicationPlan: [...(prev.communicationPlan || []), item] }));
    setNewCommItem({ audience: '', channel: '', frequency: '', responsibleId: '', objective: '' });
  };

  const removeCommItem = (id: string) => {
    setFormData(prev => ({ ...prev, communicationPlan: (prev.communicationPlan || []).filter(c => c.id !== id) }));
  };

  // Lessons Import
  const toggleLessonImport = (id: string) => {
      setLessonsToImport(prev => 
          prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
      );
  };

  // Styling Helpers
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
        return { bgcolor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }; 
      case 'Pausado': 
        return { bgcolor: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' };
      case 'Em Andamento': 
        return { bgcolor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' };
      default: 
        return { bgcolor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' };
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
        onAdd={() => handleOpenModal()}
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
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Equipe</TableCell>
                   <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Status</TableCell>
                   <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>Ações</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {filteredProjects.map((proj) => (
                   <TableRow key={proj.id} hover>
                     <TableCell>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ bgcolor: proj.color ? `${proj.color}20` : '#eff6ff', color: proj.color || 'primary.main', border: '1px solid', borderColor: proj.color ? `${proj.color}40` : '#bfdbfe' }}>
                            {proj.icon ? ICONS_MAP[proj.icon] : <Folder size={18} />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{proj.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Gestor: {mockPeople.find(p => p.id === proj.managerId)?.name || 'N/A'}</Typography>
                          </Box>
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
                           {new Date(proj.startDate).toLocaleDateString()} - {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Em aberto'}
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
                        <AvatarGroup max={3} sx={{ justifyContent: 'center' }}>
                          {(proj.team || []).map(m => (
                            <Avatar key={m.personId} src={mockPeople.find(p => p.id === m.personId)?.avatar} sx={{ width: 24, height: 24 }} />
                          ))}
                        </AvatarGroup>
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
                         <IconButton size="small" onClick={() => handleOpenModal(proj)}><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(proj.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
                 {filteredProjects.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
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
                 <Grid item xs={4} sm={4} md={4} lg={3} key={proj.id}>
                   <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <IconButton size="small"><MoreVertical size={18} /></IconButton>
                      </Box>
                      
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                           <Avatar variant="rounded" sx={{ bgcolor: proj.color ? `${proj.color}20` : '#eff6ff', color: proj.color || 'primary.main', border: '1px solid', borderColor: proj.color ? `${proj.color}40` : '#bfdbfe', width: 32, height: 32 }}>
                              {proj.icon ? ICONS_MAP[proj.icon] : <Folder size={18} />}
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
                           <Chip label={proj.endDate ? new Date(proj.endDate).toLocaleDateString() : '...'} size="small" variant="outlined" icon={<Calendar size={10}/>} sx={{ fontSize: '0.65rem', height: 20 }} />
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
                          <Stack direction="row">
                             <IconButton size="small" onClick={() => handleOpenModal(proj)}><Pencil size={14} /></IconButton>
                             <Button size="small" sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }} onClick={() => navigate(`/projects/${proj.id}`)}>Detalhes</Button>
                          </Stack>
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

      {/* Main Creation/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {formData.id ? 'Editar Projeto' : 'Novo Projeto'}
          <IconButton onClick={() => setIsModalOpen(false)}><X /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', height: 600 }}>
            {/* Tabs Sidebar */}
            <Tabs 
              orientation="vertical" 
              variant="scrollable"
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200, bgcolor: '#f8fafc' }}
            >
              <Tab label="Dados Gerais" sx={{ alignItems: 'start' }} />
              <Tab label="Campos Personalizados" sx={{ alignItems: 'start' }} />
              <Tab label="Equipe & Alocação" sx={{ alignItems: 'start' }} />
              <Tab label="Monitoramento" sx={{ alignItems: 'start' }} />
              <Tab label="Pontos Focais" sx={{ alignItems: 'start' }} />
              <Tab label="Plano de Comunicação" sx={{ alignItems: 'start' }} />
              <Tab label="Lições Aprendidas" sx={{ alignItems: 'start' }} />
            </Tabs>

            {/* Content Area */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
              
              {/* TAB 0: GENERAL DATA */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <InputLabel>Título do Projeto</InputLabel>
                    <TextField fullWidth size="small" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InputLabel>Status</InputLabel>
                    <Select fullWidth size="small" value={formData.status || 'Planejamento'} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                      <MenuItem value="Planejamento">Planejamento</MenuItem>
                      <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                      <MenuItem value="Pausado">Pausado</MenuItem>
                      <MenuItem value="Concluído">Concluído</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputLabel>Empresa/Cliente</InputLabel>
                    <Select 
                      fullWidth 
                      size="small" 
                      value={formData.companyName || ''} 
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      renderValue={(selected) => {
                        const company = mockCompanies.find(c => c.name === selected);
                        return company ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={company.logo} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2">{company.name}</Typography>
                          </Stack>
                        ) : selected;
                      }}
                    >
                      {mockCompanies.map(c => (
                        <MenuItem key={c.id} value={c.name}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={c.logo} sx={{ width: 24, height: 24 }} />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">{c.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{c.cnpj}</Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputLabel>Gestor do Projeto</InputLabel>
                    <Select 
                      fullWidth 
                      size="small" 
                      value={formData.managerId || ''} 
                      onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                      renderValue={(selected) => {
                        const manager = mockPeople.find(p => p.id === selected);
                        return manager ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={manager.avatar} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2">{manager.name}</Typography>
                          </Stack>
                        ) : selected;
                      }}
                    >
                      {mockPeople.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={p.avatar} sx={{ width: 24, height: 24 }} />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">{p.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{p.role}</Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <InputLabel>Data Início</InputLabel>
                    <TextField type="date" fullWidth size="small" value={formData.startDate || ''} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <InputLabel>Previsão Conclusão</InputLabel>
                    <TextField type="date" fullWidth size="small" value={formData.endDate || ''} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>Ícone e Cor do Projeto</InputLabel>
                    <Stack direction="column" spacing={2}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {Object.keys(ICONS_MAP).map(iconKey => (
                          <IconButton 
                            key={iconKey} 
                            onClick={() => setFormData({...formData, icon: iconKey})}
                            sx={{ 
                              border: '2px solid', 
                              borderColor: formData.icon === iconKey ? 'primary.main' : 'transparent',
                              bgcolor: formData.icon === iconKey ? (formData.color ? `${formData.color}20` : '#eff6ff') : '#f1f5f9',
                              color: formData.icon === iconKey ? formData.color || 'primary.main' : 'inherit'
                            }}
                          >
                            {ICONS_MAP[iconKey]}
                          </IconButton>
                        ))}
                      </Stack>
                      <Divider />
                      <Stack direction="row" spacing={1}>
                        {PROJECT_COLORS.map(color => (
                          <Box 
                            key={color}
                            onClick={() => setFormData({...formData, color})}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: color,
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: formData.color === color ? 'black' : 'transparent',
                              boxShadow: formData.color === color ? 2 : 0,
                              transform: formData.color === color ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.2s'
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {/* TAB 1: CUSTOM FIELDS */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Defina campos que devem ser preenchidos ao lançar horas neste projeto (ex: Número do Ticket).
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={2} alignItems="end">
                      <Box flex={2}>
                        <InputLabel>Nome do Campo</InputLabel>
                        <TextField fullWidth size="small" placeholder="Ex: Ticket Jira" value={newCustomField.label} onChange={(e) => setNewCustomField({...newCustomField, label: e.target.value})} />
                      </Box>
                      <Box flex={1}>
                        <InputLabel>Tipo</InputLabel>
                        <Select fullWidth size="small" value={newCustomField.type} onChange={(e) => setNewCustomField({...newCustomField, type: e.target.value as any})}>
                          <MenuItem value="text">Texto</MenuItem>
                          <MenuItem value="number">Número</MenuItem>
                          <MenuItem value="select">Seleção</MenuItem>
                          <MenuItem value="date">Data</MenuItem>
                        </Select>
                      </Box>
                      <FormControlLabel 
                        control={<Switch size="small" checked={newCustomField.required} onChange={(e) => setNewCustomField({...newCustomField, required: e.target.checked})} />} 
                        label={<Typography variant="body2">Obrigatório</Typography>} 
                      />
                      <Button variant="contained" onClick={addCustomField}>Adicionar</Button>
                    </Stack>
                  </Box>

                  <Stack spacing={1}>
                    {(formData.customFields || []).map(field => (
                      <Paper key={field.id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip label={field.type} size="small" />
                          <Typography fontWeight="bold">{field.label}</Typography>
                          {field.required && <Chip label="Obrigatório" size="small" color="error" variant="outlined" />}
                        </Stack>
                        <IconButton size="small" color="error" onClick={() => removeCustomField(field.id)}><Trash2 size={16} /></IconButton>
                      </Paper>
                    ))}
                    {(formData.customFields || []).length === 0 && <Typography variant="caption" color="text.secondary" align="center">Nenhum campo personalizado.</Typography>}
                  </Stack>
                </Stack>
              )}

              {/* TAB 2: TEAM & ALLOCATION */}
              {activeTab === 2 && (
                <Stack spacing={3}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={2}>Adicionar Colaborador</Typography>
                    <Grid container spacing={2} alignItems="end">
                      <Grid item xs={12} md={4}>
                        <InputLabel>Colaborador</InputLabel>
                        <Select 
                          fullWidth 
                          size="small" 
                          displayEmpty 
                          value={newTeamMember.personId || ''} 
                          onChange={handlePersonSelect}
                          renderValue={(selected) => {
                            if (!selected) return 'Selecione...';
                            const p = mockPeople.find(person => person.id === selected);
                            return p ? (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar src={p.avatar} sx={{ width: 20, height: 20 }} />
                                <Typography variant="body2">{p.name}</Typography>
                              </Stack>
                            ) : selected;
                          }}
                        >
                          <MenuItem value="" disabled>Selecione...</MenuItem>
                          {mockPeople.map(p => (
                            <MenuItem key={p.id} value={p.id}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar src={p.avatar} sx={{ width: 24, height: 24 }} />
                                <Box>
                                  <Typography variant="body2">{p.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{p.role}</Typography>
                                </Box>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <InputLabel>Papel no Projeto</InputLabel>
                        <TextField fullWidth size="small" placeholder="Dev, PO, etc." value={newTeamMember.role || ''} onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})} />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <InputLabel>Valor Hora (R$)</InputLabel>
                        <TextField type="number" fullWidth size="small" value={newTeamMember.hourlyRate || ''} onChange={(e) => setNewTeamMember({...newTeamMember, hourlyRate: Number(e.target.value)})} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <InputLabel>Modelo</InputLabel>
                        <Select fullWidth size="small" value={newTeamMember.workModel} onChange={(e) => setNewTeamMember({...newTeamMember, workModel: e.target.value as any})}>
                          <MenuItem value="Remoto">Remoto</MenuItem>
                          <MenuItem value="Híbrido">Híbrido</MenuItem>
                          <MenuItem value="Presencial">Presencial</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <InputLabel>Horas/Semana</InputLabel>
                        <TextField type="number" fullWidth size="small" value={newTeamMember.allocationHours} onChange={(e) => setNewTeamMember({...newTeamMember, allocationHours: Number(e.target.value)})} />
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <FormControlLabel 
                          control={<Switch size="small" checked={newTeamMember.requiresApproval} onChange={(e) => setNewTeamMember({...newTeamMember, requiresApproval: e.target.checked})} />} 
                          label={<Typography variant="body2">Requer Aprovação de Horas</Typography>} 
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                         {newTeamMember.requiresApproval && (
                           <>
                             <InputLabel>Aprovador</InputLabel>
                             <Select fullWidth size="small" value={newTeamMember.approverId || ''} onChange={(e) => setNewTeamMember({...newTeamMember, approverId: e.target.value})}>
                               {mockPeople.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                             </Select>
                           </>
                         )}
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button fullWidth variant="contained" onClick={addTeamMember}>Adicionar</Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell>Papel</TableCell>
                          <TableCell>Alocação</TableCell>
                          <TableCell>Modelo</TableCell>
                          <TableCell>Valor/h</TableCell>
                          <TableCell>Aprovação?</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(formData.team || []).map(member => {
                          const person = mockPeople.find(p => p.id === member.personId);
                          const isRoleChanged = person && person.role !== member.role;
                          const isRateChanged = person && person.hourlyRate !== member.hourlyRate;

                          return (
                            <TableRow key={member.personId}>
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Avatar src={person?.avatar} sx={{ width: 24, height: 24 }} />
                                  <Typography variant="body2">{person?.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  {member.role}
                                  {isRoleChanged && <Typography variant="caption" display="block" color="warning.main">Original: {person?.role}</Typography>}
                                </Box>
                              </TableCell>
                              <TableCell>{member.allocationHours}h</TableCell>
                              <TableCell>{member.workModel}</TableCell>
                              <TableCell>
                                R$ {member.hourlyRate}
                                {isRateChanged && <Chip label="Modificado" size="small" color="info" variant="outlined" sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} />}
                              </TableCell>
                              <TableCell>{member.requiresApproval ? (member.approverId ? 'Sim (Gestor)' : 'Sim') : 'Não'}</TableCell>
                              <TableCell align="right">
                                <IconButton size="small" color="error" onClick={() => removeTeamMember(member.personId)}><Trash2 size={16} /></IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {(formData.team || []).length === 0 && (
                          <TableRow><TableCell colSpan={7} align="center">Nenhum membro alocado.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {/* TAB 3: MONITORING */}
              {activeTab === 3 && (
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Configurações de Monitoramento de Desvios</Typography>
                  <Typography variant="body2" color="text.secondary">O sistema irá gerar alertas automáticos caso estas regras sejam violadas.</Typography>
                  
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={formData.monitoring?.missingEstimates} 
                          onChange={(e) => setFormData(prev => ({...prev, monitoring: {...prev.monitoring!, missingEstimates: e.target.checked}}))} 
                        />
                      } 
                      label="Ausência de registro de horas estimada para o projeto" 
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={formData.monitoring?.deviationLogging} 
                          onChange={(e) => setFormData(prev => ({...prev, monitoring: {...prev.monitoring!, deviationLogging: e.target.checked}}))} 
                        />
                      } 
                      label="Lançamento de menos/mais horas do que o previsto (Alocação)" 
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={formData.monitoring?.offHoursLogging} 
                          onChange={(e) => setFormData(prev => ({...prev, monitoring: {...prev.monitoring!, offHoursLogging: e.target.checked}}))} 
                        />
                      } 
                      label="Registro fora do horário padrão (Madrugada/Finais de semana)" 
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel 
                      control={
                        <Switch 
                          checked={formData.monitoring?.retroactiveFutureLogging} 
                          onChange={(e) => setFormData(prev => ({...prev, monitoring: {...prev.monitoring!, retroactiveFutureLogging: e.target.checked}}))} 
                        />
                      } 
                      label="Lançamentos retroativos ou futuros sem justificativa" 
                    />
                  </Paper>
                </Stack>
              )}

              {/* TAB 4: CLIENT FOCAL POINTS */}
              {activeTab === 4 && (
                <Stack spacing={3}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={2}>Adicionar Ponto Focal</Typography>
                    <Grid container spacing={2} alignItems="end">
                      <Grid item xs={12} md={3}>
                        <InputLabel>Nome</InputLabel>
                        <TextField fullWidth size="small" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <InputLabel>Cargo</InputLabel>
                        <TextField fullWidth size="small" value={newContact.role} onChange={(e) => setNewContact({...newContact, role: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <InputLabel>Email</InputLabel>
                        <TextField fullWidth size="small" value={newContact.email} onChange={(e) => setNewContact({...newContact, email: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <InputLabel>Telefone</InputLabel>
                        <TextField fullWidth size="small" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Button fullWidth variant="contained" onClick={addContact}><Plus size={20}/></Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <Grid container spacing={2}>
                    {(formData.clientContacts || []).map(contact => (
                      <Grid item xs={12} md={6} key={contact.id}>
                        <Card variant="outlined">
                          <CardContent sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                              <IconButton size="small" color="error" onClick={() => removeContact(contact.id)}><X size={16} /></IconButton>
                            </Box>
                            <Stack spacing={1}>
                              <Typography fontWeight="bold">{contact.name}</Typography>
                              <Chip label={contact.role} size="small" sx={{ width: 'fit-content' }} />
                              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                <Mail size={14} />
                                <Typography variant="body2">{contact.email}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                <Phone size={14} />
                                <Typography variant="body2">{contact.phone}</Typography>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {(formData.clientContacts || []).length === 0 && (
                      <Grid item xs={12}><Typography align="center" color="text.secondary">Nenhum ponto focal cadastrado.</Typography></Grid>
                    )}
                  </Grid>
                </Stack>
              )}

              {/* TAB 5: COMMUNICATION PLAN */}
              {activeTab === 5 && (
                <Stack spacing={3}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={2}>Adicionar Regra de Comunicação</Typography>
                    <Grid container spacing={2} alignItems="end">
                      <Grid item xs={12} md={3}>
                        <InputLabel>Público</InputLabel>
                        <TextField fullWidth size="small" placeholder="Ex: Steering Committee" value={newCommItem.audience} onChange={(e) => setNewCommItem({...newCommItem, audience: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <InputLabel>Canal</InputLabel>
                        <Select fullWidth size="small" value={newCommItem.channel || ''} onChange={(e) => setNewCommItem({...newCommItem, channel: e.target.value})}>
                          <MenuItem value="Email">Email</MenuItem>
                          <MenuItem value="Reunião Presencial">Reunião Presencial</MenuItem>
                          <MenuItem value="Videochamada">Videochamada</MenuItem>
                          <MenuItem value="Slack / Teams">Slack / Teams</MenuItem>
                          <MenuItem value="Relatório">Relatório</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <InputLabel>Frequência</InputLabel>
                        <Select fullWidth size="small" value={newCommItem.frequency || ''} onChange={(e) => setNewCommItem({...newCommItem, frequency: e.target.value})}>
                          <MenuItem value="Diário">Diário</MenuItem>
                          <MenuItem value="Semanal">Semanal</MenuItem>
                          <MenuItem value="Quinzenal">Quinzenal</MenuItem>
                          <MenuItem value="Mensal">Mensal</MenuItem>
                          <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <InputLabel>Responsável</InputLabel>
                        <Select fullWidth size="small" value={newCommItem.responsibleId || ''} onChange={(e) => setNewCommItem({...newCommItem, responsibleId: e.target.value})}>
                           {mockPeople.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button fullWidth variant="contained" onClick={addCommItem}>Adicionar</Button>
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Objetivo</InputLabel>
                        <TextField fullWidth size="small" placeholder="Ex: Reportar status e riscos" value={newCommItem.objective} onChange={(e) => setNewCommItem({...newCommItem, objective: e.target.value})} />
                      </Grid>
                    </Grid>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Público</TableCell>
                          <TableCell>Canal</TableCell>
                          <TableCell>Frequência</TableCell>
                          <TableCell>Responsável</TableCell>
                          <TableCell>Objetivo</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(formData.communicationPlan || []).map(item => {
                          const responsible = mockPeople.find(p => p.id === item.responsibleId);
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.audience}</TableCell>
                              <TableCell><Chip label={item.channel} size="small" /></TableCell>
                              <TableCell>{item.frequency}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar src={responsible?.avatar} sx={{ width: 20, height: 20 }} />
                                  <Typography variant="body2">{responsible?.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{item.objective}</TableCell>
                              <TableCell align="right">
                                <IconButton size="small" color="error" onClick={() => removeCommItem(item.id)}><Trash2 size={16} /></IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {(formData.communicationPlan || []).length === 0 && (
                          <TableRow><TableCell colSpan={6} align="center">Nenhum plano definido.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {/* TAB 6: IMPORT LESSONS LEARNED */}
              {activeTab === 6 && (
                <Stack spacing={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Aproveite o conhecimento da organização. Selecione lições aprendidas em outros projetos para importar para este.
                    </Typography>

                    {/* Import Filters */}
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'end', flexWrap: 'wrap' }}>
                        <Box flex={1} minWidth={200}>
                            <InputLabel sx={{mb: 0.5}}>Buscar</InputLabel>
                            <TextField 
                                fullWidth size="small" 
                                placeholder="Descrição, categoria..." 
                                value={importSearch}
                                onChange={(e) => setImportSearch(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16}/></InputAdornment> }}
                            />
                        </Box>
                        {/* Removed Project Filter as per request to remove company filter */}
                        <Box>
                            <InputLabel sx={{mb: 0.5}}>A partir de</InputLabel>
                            <TextField 
                                type="date" size="small" 
                                value={importDateStart}
                                onChange={(e) => setImportDateStart(e.target.value)}
                            />
                        </Box>
                    </Paper>

                    {/* Lessons Table */}
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"></TableCell>
                                    <TableCell>Projeto Origem</TableCell>
                                    <TableCell>Categoria</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Impacto</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLessonsToImport.map(lesson => {
                                    const sourceProject = mockProjects.find(p => p.id === lesson.projectId);
                                    const isSelected = lessonsToImport.includes(lesson.id);
                                    
                                    return (
                                        <TableRow 
                                            key={lesson.id} 
                                            hover 
                                            onClick={() => toggleLessonImport(lesson.id)}
                                            selected={isSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar variant="rounded" sx={{ width: 20, height: 20, bgcolor: sourceProject?.color, fontSize: 10 }}>
                                                        {sourceProject?.name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>{sourceProject?.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{lesson.category}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }} title={lesson.description}>
                                                    {lesson.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={lesson.impact} 
                                                    size="small" 
                                                    color={lesson.impact === 'Positivo' ? 'success' : 'error'} 
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(lesson.date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredLessonsToImport.length === 0 && (
                                    <TableRow><TableCell colSpan={6} align="center">Nenhuma lição encontrada para importação.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="caption" sx={{ mr: 2, alignSelf: 'center' }}>{lessonsToImport.length} lições selecionadas</Typography>
                    </Box>
                </Stack>
              )}

            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar Projeto</Button>
        </DialogActions>
      </Dialog>

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
