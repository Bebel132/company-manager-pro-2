
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutGrid, 
  LayoutList, 
  PieChart, 
  Trophy, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Sparkles,
  Bot,
  Send,
  CheckCircle2, 
  Circle,
  Clock,
  AlertTriangle,
  User,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
  X,
  History,
  CopyPlus,
  Trash2,
  Palette,
  ThumbsUp,
  AlertCircle,
  Eye,
  Repeat,
  Target,
  BarChart3,
  CheckSquare,
  Link as LinkIcon,
  Paperclip,
  File,
  CornerUpLeft,
  ArrowRightLeft,
  MessageSquare,
  AlignLeft,
  Bold,
  Italic,
  List,
  Bell,
  BellOff,
  Smile,
  BookOpen,
  Frown,
  Lightbulb,
  FileText,
  ShieldAlert,
  DollarSign,
  Users,
  Mail,
  Video,
  Shuffle,
  PlayCircle,
  FileJson,
  Edit2,
  ThumbsDown,
  MoreVertical,
  CalendarDays,
  Plane,
  Coffee,
  Search,
  Award,
  Download,
  Mic,
  FileOutput
} from 'lucide-react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Tabs, 
  Tab, 
  Stack, 
  Avatar, 
  AvatarGroup,
  IconButton,
  Chip,
  TextField, 
  InputAdornment, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Grid,
  Card, 
  CardContent, 
  Collapse, 
  Tooltip, 
  Popover, 
  MenuItem, 
  Select, 
  TableSortLabel, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions, 
  Menu, 
  ListItemIcon, 
  Divider, 
  Snackbar, 
  Alert, 
  Checkbox, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  LinearProgress,
  List as MuiList,
  ListItem,
  ListItemText,
  InputLabel,
  Toolbar,
  ListItemButton
} from '@mui/material';
import { mockProjects, mockTasks, mockPeople, mockRetrospectives, mockActivities, mockProjectFiles, mockLessonsLearned, mockProjectMeetings, mockProjectEmails, mockProjectRisks, mockProjectChanges, mockBudgetEntries, mockHolidays, mockPins } from '../services/mockData';
import { Task, TaskStatus, Retrospective, RetroItem, RetroAction, RetroColumnType, TaskAttachment, TaskRelation, RelationType, TaskComment, Activity, ProjectGoal, ProjectRisk, ProjectChange, LessonLearned, Pin, PinCategory } from '../types';

type SortField = 'title' | 'assigneeId' | 'bucket' | 'priority' | 'dueDate' | 'status';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  assignee: string;
  priority: string;
  bucket: string;
  dateStart: string;
  dateEnd: string;
}

interface ConditionalRule {
  id: string;
  field: keyof Task | 'assigneeId';
  operator: 'equals' | 'not_equals' | 'contains';
  value: string;
  color: string;
}

type RetroPhase = 'collect' | 'vote' | 'act';

const AVAILABLE_COLORS = [
  '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#dbeafe', '#f3e8ff', '#fce7f3'
];

// Translations for Relations
const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  'Predecessor': 'Predecessora',
  'Successor': 'Sucessora',
  'Related': 'Relacionada',
  'Duplicate': 'Duplicada',
  'Blocks': 'Bloqueia',
  'Blocked By': 'Bloqueada por',
  'Tests': 'Testa',
  'Tested By': 'Testada por'
};

const POKER_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?'];

// --- Helper Components ---

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1, overflow: 'hidden', bgcolor: 'white' }}>
      <Box sx={{ borderBottom: '1px solid #f1f5f9', p: 0.5, bgcolor: '#f8fafc', display: 'flex', gap: 0.5 }}>
        <IconButton size="small"><Bold size={16} /></IconButton>
        <IconButton size="small"><Italic size={16} /></IconButton>
        <IconButton size="small"><List size={16} /></IconButton>
        <IconButton size="small"><AlignLeft size={16} /></IconButton>
      </Box>
      <TextField
        multiline
        rows={3}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="standard"
        placeholder="Escreva um comentário..."
        InputProps={{ disableUnderline: true, sx: { p: 1.5, fontSize: '0.875rem' } }}
      />
    </Box>
  );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPatiChat, setShowPatiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Tabs Management
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);

  // Load initial tasks from mock and keep in state for interactions
  const [tasks, setTasks] = useState<Task[]>(() => mockTasks.filter(t => t.projectId === id));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(mockTasks.map(t => t.id))); 
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  // Goals State
  const [goals, setGoals] = useState<ProjectGoal[]>([
    { id: '1', title: 'Entregar MVP do Módulo Financeiro', status: 'Concluído', dueDate: '2023-12-15', associatedTaskIds: ['103', '103-1', '103-2'] },
    { id: '2', title: 'Reduzir tempo de carregamento da Home em 20%', status: 'Pendente', dueDate: '2024-01-20', associatedTaskIds: ['102', '105'] },
    { id: '3', title: 'Finalizar documentação da API', status: 'Pendente', dueDate: '2024-02-01', associatedTaskIds: [] },
  ]);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newGoalTasks, setNewGoalTasks] = useState<string[]>([]);

  // Lessons State
  const [lessons, setLessons] = useState<LessonLearned[]>(() => mockLessonsLearned.filter(l => l.projectId === id).map(l => ({...l, status: 'Aprovado'})));
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState<Partial<LessonLearned>>({
    category: 'Técnica',
    impact: 'Positivo',
    description: '',
    actionTaken: ''
  });

  // Risk State
  const [risks, setRisks] = useState<ProjectRisk[]>(() => mockProjectRisks.filter(r => r.projectId === id));
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Partial<ProjectRisk>>({});

  // Changes State
  const [changes, setChanges] = useState<ProjectChange[]>(() => mockProjectChanges.filter(c => c.projectId === id));
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [newChange, setNewChange] = useState<Partial<ProjectChange>>({});

  // Team Allocation State
  const projectInitial = mockProjects.find(p => p.id === id);
  const [teamMembers, setTeamMembers] = useState(projectInitial?.team || []);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ personId: string, allocation: number } | null>(null);

  // Files State (Filters)
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');

  // Pin Dedication State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState<Partial<Pin>>({ category: 'Collaboration', message: '' });
  const [pins, setPins] = useState<Pin[]>(mockPins); // Local state for pins

  // Filtering & Sorting State
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    assignee: 'all', priority: 'all', bucket: 'all', dateStart: '', dateEnd: ''
  });
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'dueDate', direction: 'asc'
  });

  // Task Detail/Edit State
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskDetailTab, setTaskDetailTab] = useState(0); 
  const [taskFormData, setTaskFormData] = useState<Partial<Task> & { 
    description?: string; 
    checklist?: {id: string, text: string, done: boolean}[];
    estimatedTime?: number;
    sprint?: string;
    newRelationType?: RelationType;
    newRelationTarget?: string;
    newComment?: string;
  }>({});
  
  const [taskActivities, setTaskActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({ date: new Date().toISOString().split('T')[0], hours: '', description: '' });

  // Conditional Formatting State
  const [conditionalModalOpen, setConditionalModalOpen] = useState(false);
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([]);
  const [tempRules, setTempRules] = useState<ConditionalRule[]>([]);

  // Task Menu State
  const [taskMenuAnchorEl, setTaskMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState<Task | null>(null);
  
  // Retro State Management
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>(() => 
    mockRetrospectives.filter(r => r.projectId === id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [activeRetroId, setActiveRetroId] = useState<string>(retrospectives.length > 0 ? retrospectives[0].id : '');
  const [retroPhase, setRetroPhase] = useState<RetroPhase>('collect');

  const activeRetro = useMemo(() => 
    retrospectives.find(r => r.id === activeRetroId) || null
  , [retrospectives, activeRetroId]);

  // Poker State (Project Wide)
  const [pokerSelectedCard, setPokerSelectedCard] = useState<number | string | null>(null);
  const [pokerRevealed, setPokerRevealed] = useState(false);
  const [pokerCurrentTask, setPokerCurrentTask] = useState<string>('');
  
  // Feedback State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Expandable Sections in Task Detail
  const [expandedSections, setExpandedSections] = useState({
    checklist: true, 
    time: true, 
    attachments: true, 
    relations: true
  });

  const project = mockProjects.find(p => p.id === id);

  // --- FILES FILTER LOGIC ---
  const filteredFiles = useMemo(() => {
    const allFiles = [
      ...mockProjectFiles.filter(f => f.projectId === id),
      ...tasks.flatMap(t => (t.attachments || []).map(att => ({ ...att, taskTitle: t.title, taskId: t.id, uploadDate: new Date().toISOString() })))
    ];

    return allFiles.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
      const matchesType = fileTypeFilter === 'all' ? true : f.type === fileTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [id, tasks, fileSearch, fileTypeFilter]);

  if (!project) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Projeto não encontrado</Typography>
        <Button onClick={() => navigate('/projects')} sx={{ mt: 2 }}>Voltar para Projetos</Button>
      </Box>
    );
  }

  // --- PATI BOT CONTEXT ---
  const getPatiBotMessage = () => {
    switch(activeTab) {
      case 0: return "Veja a lista completa de tarefas. Posso destacar atrasos ou tarefas sem responsável.";
      case 1: return "Visão Kanban. Acompanhe o fluxo de trabalho e verifique as tarefas paradas.";
      case 2: return "Analise o desempenho com gráficos de Velocity e Burndown.";
      case 3: return "Acompanhe as metas estratégicas do projeto e suas entregas.";
      case 4: return "Gerencie a alocação e disponibilidade da equipe.";
      case 5: return "Reflita sobre os pontos de melhoria na Retrospectiva.";
      case 6: return "Utilize o Planning Poker para estimar esforços de forma colaborativa.";
      case 7: return "Centralize todos os arquivos e documentos do projeto aqui.";
      case 8: return "Registre e consulte lições aprendidas para projetos futuros.";
      case 9: return "Organize pautas e atas de reuniões do time.";
      case 10: return "Mantenha o histórico de comunicações importantes.";
      case 11: return "Gerencie e mitigue os riscos identificados no projeto.";
      case 12: return "Controle solicitações de mudança de escopo, prazo ou custo.";
      case 13: return "Acompanhe o orçamento previsto vs realizado.";
      case 14: return "Monitore o apontamento de horas da equipe.";
      default: return "Olá! Sou a Pati, sua assistente virtual. Como posso ajudar no projeto?";
    }
  };

  // --- MENU ACTIONS ---
  const handleTaskMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    event.stopPropagation();
    setTaskMenuAnchorEl(event.currentTarget);
    setSelectedTaskForMenu(task);
  };

  const handleTaskMenuClose = () => {
    setTaskMenuAnchorEl(null);
    setSelectedTaskForMenu(null);
  };

  const handleMenuAction = (action: string) => {
    if (!selectedTaskForMenu) return;
    switch (action) {
      case 'details': handleOpenTaskDetail(selectedTaskForMenu); break;
      case 'subtask': handleAddSubTask(selectedTaskForMenu.id); break;
      case 'dedicate': 
        handleOpenPinDialog(selectedTaskForMenu);
        break;
      case 'duplicate':
        const duplicatedTask: Task = {
          ...selectedTaskForMenu, id: Date.now().toString(), title: `${selectedTaskForMenu.title} (Cópia)`, history: []
        };
        setTasks([...tasks, duplicatedTask]);
        setToastMessage('Tarefa duplicada com sucesso');
        setShowToast(true);
        break;
      case 'delete':
        setTasks(prev => prev.filter(t => t.id !== selectedTaskForMenu?.id && t.parentId !== selectedTaskForMenu?.id));
        setToastMessage('Tarefa excluída');
        setShowToast(true);
        break;
    }
    handleTaskMenuClose();
  };

  // --- PIN LOGIC ---
  const handleOpenPinDialog = (task: Task) => {
    setNewPin({
        receiverId: task.assigneeId || '',
        category: 'Collaboration',
        message: `Dedico este pin pela excelente execução na atividade: "${task.title}".`,
        linkedTaskId: task.id
    });
    setPinModalOpen(true);
  };

  const handleDedicatePin = () => {
    if (!newPin.receiverId || !newPin.message) return;
    const pin: Pin = {
        id: Date.now().toString(),
        senderId: '1', // Current user
        receiverId: newPin.receiverId!,
        category: newPin.category as PinCategory,
        message: newPin.message!,
        date: new Date().toISOString(),
        likes: 0,
        comments: 0,
        status: 'Pendente',
        linkedTaskId: newPin.linkedTaskId
    };
    setPins([...pins, pin]);
    setPinModalOpen(false);
    setToastMessage('Pin dedicado com sucesso!');
    setShowToast(true);
  };

  // --- TASK DETAIL LOGIC ---
  const handleOpenTaskDetail = (task: Task) => {
    setCurrentTask(task);
    setTaskDetailTab(0);
    setPokerRevealed(false);
    setTaskFormData({
      ...task,
      description: task.description || "Esta é uma descrição simulada para o protótipo. Adicione detalhes aqui.",
      checklist: task.checklist || [{ id: '1', text: 'Validar requisitos', done: true }, { id: '2', text: 'Criar documentação', done: false }],
      estimatedTime: 8,
      sprint: 'Backlog',
      attachments: task.attachments || [],
      relations: task.relations || [],
      newRelationType: 'Related',
      newRelationTarget: '',
      comments: task.comments || [],
      pokerVotes: task.pokerVotes || {}
    });
    
    const linkedActivities = mockActivities.filter(a => a.taskId === task.id);
    setTaskActivities(linkedActivities);
    setNewActivity({ date: new Date().toISOString().split('T')[0], hours: '', description: '' });

    setTaskDetailOpen(true);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveTaskDetail = () => {
    if (!currentTask) return;
    setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, ...taskFormData } as Task : t));
    setTaskDetailOpen(false);
    setToastMessage('Tarefa atualizada');
    setShowToast(true);
  };

  const handleWatchToggle = () => {
    if (!currentTask) return;
    const newWatched = !taskFormData.watched;
    setTaskFormData({ ...taskFormData, watched: newWatched });
    setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, watched: newWatched } : t));
    setToastMessage(newWatched ? 'Você está seguindo esta tarefa.' : 'Você deixou de seguir esta tarefa.');
    setShowToast(true);
  };

  // Attachments
  const handleAddAttachment = () => {
    const fakeFile: TaskAttachment = {
      id: Date.now().toString(),
      name: 'documentacao_v1.pdf',
      url: '#',
      type: 'PDF',
      size: '2.4 MB'
    };
    setTaskFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), fakeFile] }));
  };

  const handleRemoveAttachment = (id: string) => {
    setTaskFormData(prev => ({ ...prev, attachments: (prev.attachments || []).filter(a => a.id !== id) }));
  };

  // Relations
  const handleAddRelation = () => {
    if (!taskFormData.newRelationType || !taskFormData.newRelationTarget) return;
    const newRelation: TaskRelation = {
      id: Date.now().toString(),
      type: taskFormData.newRelationType,
      targetTaskId: taskFormData.newRelationTarget
    };
    setTaskFormData(prev => ({ 
      ...prev, 
      relations: [...(prev.relations || []), newRelation],
      newRelationTarget: ''
    }));
  };

  const handleRemoveRelation = (id: string) => {
    setTaskFormData(prev => ({ ...prev, relations: (prev.relations || []).filter(r => r.id !== id) }));
  };

  // Comments
  const handleAddComment = () => {
    if(!taskFormData.newComment) return;
    const newComm: TaskComment = {
      id: Date.now().toString(),
      userId: '1',
      text: taskFormData.newComment,
      date: new Date().toISOString()
    };
    setTaskFormData(prev => ({ 
      ...prev, 
      comments: [...(prev.comments || []), newComm],
      newComment: ''
    }));
  };

  // Task Popup Poker
  const handleTaskPopupPokerVote = (card: number | string) => {
    setTaskFormData(prev => ({
      ...prev,
      pokerVotes: { ...(prev.pokerVotes || {}), '1': card }
    }));
  };

  // Hours Logic
  const handleAddActivity = () => {
    if (!newActivity.hours || !newActivity.description) return;
    const activity: Activity = {
      id: Date.now().toString(),
      date: newActivity.date,
      hours: Number(newActivity.hours),
      description: newActivity.description,
      project: project.name,
      taskId: currentTask?.id,
      status: 'Pendente',
      userId: '1'
    };
    setTaskActivities([activity, ...taskActivities]);
    setNewActivity({ ...newActivity, hours: '', description: '' });
    setToastMessage('Horas registradas com sucesso.');
    setShowToast(true);
  };

  const totalHours = taskActivities.reduce((acc, act) => acc + act.hours, 0);

  // --- FILTER & SORT LOGIC ---
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const clearFilters = () => {
    setFilters({ assignee: 'all', priority: 'all', bucket: 'all', dateStart: '', dateEnd: '' });
    handleFilterClose();
  };
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

  const handleSort = (field: SortField) => {
    const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
    setSortConfig({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    newExpanded.has(taskId) ? newExpanded.delete(taskId) : newExpanded.add(taskId);
    setExpandedTasks(newExpanded);
  };

  const handleAddSubTask = (parentId: string) => {
    const parent = tasks.find(t => t.id === parentId);
    if (!parent) return;
    const newTask: Task = {
      id: Date.now().toString(), projectId: project.id, parentId: parentId, title: 'Nova Subtarefa',
      bucket: parent.bucket, status: 'Não iniciado', priority: 'Média', assigneeId: parent.assigneeId
    };
    setTasks([...tasks, newTask]);
    if (!expandedTasks.has(parentId)) toggleExpand(parentId);
  };

  // --- CONDITIONAL FORMATTING LOGIC ---
  const handleOpenConditionalModal = () => {
    setTempRules([...conditionalRules]);
    if (conditionalRules.length === 0) setTempRules([{ id: Date.now().toString(), field: 'status', operator: 'equals', value: 'Atrasado', color: '#fee2e2' }]);
    setConditionalModalOpen(true);
  };

  const handleSaveConditionalRules = () => {
    setConditionalRules(tempRules.filter(r => r.value !== ''));
    setConditionalModalOpen(false);
  };

  const addRule = () => setTempRules([...tempRules, { id: Date.now().toString(), field: 'status', operator: 'equals', value: '', color: '#dbeafe' }]);
  const removeRule = (id: string) => setTempRules(tempRules.filter(r => r.id !== id));
  const updateRule = (id: string, updates: Partial<ConditionalRule>) => setTempRules(tempRules.map(r => r.id === id ? { ...r, ...updates } : r));

  const getRowColor = (task: Task) => {
    for (const rule of conditionalRules) {
      const taskValue = String(task[rule.field] || '').toLowerCase();
      const ruleValue = rule.value.toLowerCase();
      let match = false;
      if (rule.operator === 'equals') match = taskValue === ruleValue;
      if (rule.operator === 'not_equals') match = taskValue !== ruleValue;
      if (rule.operator === 'contains') match = taskValue.includes(ruleValue);
      if (match) return rule.color;
    }
    return undefined;
  };

  // --- FILTERED DATA ---
  const filteredRawTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.assignee !== 'all' && task.assigneeId !== filters.assignee) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.bucket !== 'all' && task.bucket !== filters.bucket) return false;
      if (filters.dateStart && (!task.dueDate || task.dueDate < filters.dateStart)) return false;
      if (filters.dateEnd && (!task.dueDate || task.dueDate > filters.dateEnd)) return false;
      return true;
    });
  }, [tasks, filters]);

  const flattenedTasks = useMemo(() => {
    const result: { task: Task; level: number }[] = [];
    const childrenMap: Record<string, Task[]> = {};
    filteredRawTasks.forEach(t => {
      if (t.parentId && filteredRawTasks.some(p => p.id === t.parentId)) {
         if (!childrenMap[t.parentId]) childrenMap[t.parentId] = [];
         childrenMap[t.parentId].push(t);
      }
    });

    const sortTasks = (taskList: Task[]) => {
      return [...taskList].sort((a, b) => {
        let aValue: any = a[sortConfig.field as keyof Task];
        let bValue: any = b[sortConfig.field as keyof Task];
        
        if (sortConfig.field === 'assigneeId') {
           aValue = mockPeople.find(p => p.id === a.assigneeId)?.name || '';
           bValue = mockPeople.find(p => p.id === b.assigneeId)?.name || '';
        }

        // Handle null/undefined values for consistent sorting
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';
        
        // Ensure we are comparing primitives or strings
        if (typeof aValue === 'object') aValue = JSON.stringify(aValue);
        if (typeof bValue === 'object') bValue = JSON.stringify(bValue);

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    };

    const addTasks = (taskList: Task[], level: number) => {
      const sortedList = sortTasks(taskList);
      sortedList.forEach(t => {
        result.push({ task: t, level });
        if (expandedTasks.has(t.id) && childrenMap[t.id]) addTasks(childrenMap[t.id], (level || 0) + 1);
      });
    };
    addTasks(filteredRawTasks.filter(t => !t.parentId || !filteredRawTasks.some(p => p.id === t.parentId)), 0);
    return result;
  }, [filteredRawTasks, sortConfig, expandedTasks]);

  // --- RETRO LOGIC ---
  const handleUpdateActiveRetro = (updates: Partial<Retrospective>) => {
    if (!activeRetro) return;
    setRetrospectives(prev => prev.map(r => r.id === activeRetro.id ? { ...r, ...updates } : r));
  };

  const handleAddRetroItem = (columnId: RetroColumnType) => {
    if (!activeRetro || activeRetro.status === 'Concluído') return;
    const text = prompt("Digite o feedback:");
    if (text) {
      const newItem: RetroItem = { id: Date.now().toString(), columnId, text, votes: 0, authorId: '1' };
      handleUpdateActiveRetro({ items: [...activeRetro.items, newItem] });
    }
  };

  const handleVoteRetroItem = (itemId: string) => {
    if (!activeRetro || activeRetro.status === 'Concluído') return;
    const newItems = activeRetro.items.map(item => item.id === itemId ? { ...item, votes: item.votes + 1 } : item);
    handleUpdateActiveRetro({ items: newItems });
  };

  // --- GOALS LOGIC ---
  const handleOpenGoalModal = () => {
    setNewGoalTitle('');
    setNewGoalDate(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]);
    setNewGoalTasks([]);
    setGoalModalOpen(true);
  }

  const handleAddGoal = () => {
    if(!newGoalTitle.trim()) return;
    const newGoal: ProjectGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      status: 'Pendente',
      dueDate: newGoalDate,
      associatedTaskIds: newGoalTasks
    };
    setGoals([...goals, newGoal]);
    setGoalModalOpen(false);
  };

  const handleToggleGoalTask = (taskId: string) => {
    setNewGoalTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleGoalStatus = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'Concluído' ? 'Pendente' : 'Concluído' } : g));
  };

  // --- LESSONS LOGIC ---
  const handleOpenLessonModal = () => {
    setNewLesson({
      category: 'Técnica',
      impact: 'Positivo',
      description: '',
      actionTaken: ''
    });
    setLessonModalOpen(true);
  };

  const handleSaveLesson = () => {
    if (!newLesson.description) return;
    const lesson: LessonLearned = {
      id: Date.now().toString(),
      projectId: id!,
      category: newLesson.category!,
      description: newLesson.description!,
      impact: newLesson.impact!,
      actionTaken: newLesson.actionTaken,
      date: new Date().toISOString(),
      status: 'Pendente'
    };
    setLessons([lesson, ...lessons]);
    setLessonModalOpen(false);
    setToastMessage('Lição registrada! Aguardando aprovação.');
    setShowToast(true);
  };

  const handleLessonStatus = (lessonId: string, status: 'Aprovado' | 'Rejeitado') => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, status } : l));
    setToastMessage(`Lição ${status.toLowerCase()} com sucesso.`);
    setShowToast(true);
  };

  // --- RISKS LOGIC ---
  const handleSaveRisk = () => {
    if (!editingRisk.description) return;
    
    if (editingRisk.id) {
        setRisks(prev => prev.map(r => r.id === editingRisk.id ? { ...r, ...editingRisk } as ProjectRisk : r));
    } else {
        const newRisk: ProjectRisk = {
            id: Date.now().toString(),
            projectId: id!,
            description: editingRisk.description || '',
            probability: editingRisk.probability || 'Média',
            impact: editingRisk.impact || 'Médio',
            status: 'Aberto',
            mitigationPlan: editingRisk.mitigationPlan || ''
        };
        setRisks([...risks, newRisk]);
    }
    setRiskModalOpen(false);
    setEditingRisk({});
  };

  // --- CHANGES LOGIC ---
  const handleSaveChange = () => {
    if (!newChange.title || !newChange.description) return;
    const change: ProjectChange = {
        id: Date.now().toString(),
        projectId: id!,
        title: newChange.title,
        description: newChange.description,
        requester: 'Eu (Admin)',
        date: new Date().toISOString().split('T')[0],
        status: 'Pendente',
        impactCost: Number(newChange.impactCost) || 0,
        impactTime: Number(newChange.impactTime) || 0
    };
    setChanges([...changes, change]);
    setChangeModalOpen(false);
    setNewChange({});
  };

  const handleChangeStatus = (changeId: string, status: 'Aprovado' | 'Rejeitado') => {
      setChanges(prev => prev.map(c => c.id === changeId ? { ...c, status } : c));
      setToastMessage(`Mudança ${status.toLowerCase()} com sucesso.`);
      setShowToast(true);
  };

  // --- TEAM ALLOCATION LOGIC ---
  const handleUpdateAllocation = () => {
      if (!editingMember) return;
      setTeamMembers(prev => prev.map(m => m.personId === editingMember.personId ? { ...m, allocationHours: editingMember.allocation } : m));
      setAllocationModalOpen(false);
      setEditingMember(null);
      setToastMessage("Alocação atualizada.");
      setShowToast(true);
  };

  // --- TEAM ABSENCES LOGIC ---
  const getMemberAbsences = (personId: string) => {
    const person = mockPeople.find(p => p.id === personId);
    if (!person) return [];

    const projectStart = new Date(project.startDate);
    const projectEnd = project.endDate ? new Date(project.endDate) : new Date(projectStart.getFullYear() + 1, 0, 1);

    return mockHolidays.filter(h => {
        // Consider only personal or global events
        const isRelevant = (h.scope === 'Pessoa' && h.associatedName === person.name) || h.scope === 'Global';
        if (!isRelevant) return false;

        const hStart = new Date(h.date);
        const hEnd = h.endDate ? new Date(h.endDate) : hStart;
        
        // Check overlap with project execution
        return hStart >= projectStart && hEnd <= projectEnd && hStart >= new Date(); // Only future
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // --- HELPER COMPONENTS ---
  const PatiBotBanner = () => (
    <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', color: '#0284c7' }}><Sparkles size={24} /></Box>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="bold" color="#0369a1">Pati Bot está ativa</Typography>
          <Typography variant="body2" color="#0c4a6e">{getPatiBotMessage()}</Typography>
        </Box>
        <Button variant="contained" startIcon={<Bot size={18} />} onClick={() => setShowPatiChat(!showPatiChat)}>Conversar</Button>
      </Stack>
      <Collapse in={showPatiChat}>
        <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 2, p: 2, border: '1px solid #e2e8f0' }}>
           {aiResponse && <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2 }}><Typography variant="body2">{aiResponse}</Typography></Box>}
           <TextField 
             fullWidth placeholder="Pergunte sobre o progresso..." size="small" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)}
             InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => { if(aiMessage) { setAiResponse("Analisando..."); setTimeout(() => setAiResponse("Sugestão: Verifique prazos."), 1000); } }}><Send size={18} /></IconButton></InputAdornment> }}
           />
        </Box>
      </Collapse>
    </Paper>
  );

  const getStatusChip = (status: TaskStatus) => {
    let color: any = 'default';
    let icon = <Circle size={14} />;
    switch (status) {
      case 'Concluído': color = 'success'; icon = <CheckCircle2 size={14} />; break;
      case 'Em andamento': color = 'primary'; icon = <Clock size={14} />; break;
      case 'Atrasado': color = 'error'; icon = <AlertTriangle size={14} />; break;
    }
    return <Chip label={status} size="small" color={color} variant={status === 'Não iniciado' ? 'outlined' : 'filled'} icon={icon} sx={{ height: 24, '& .MuiChip-icon': { ml: 1 } }} />;
  };

  const getPriorityColor = (priority: string) => {
     switch(priority) {
       case 'Urgente': return '#dc2626'; case 'Alta': return '#ea580c'; case 'Média': return '#ca8a04'; default: return '#64748b';
     }
  };

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Concluído').length;
    const inProgress = tasks.filter(t => t.status === 'Em andamento').length;
    const notStarted = tasks.filter(t => t.status === 'Não iniciado').length;
    const delayed = tasks.filter(t => t.status === 'Atrasado').length;
    
    return { total, completed, inProgress, notStarted, delayed };
  }, [tasks]);

  const TABS_MAIN = [
      { id: 0, label: 'Grade', icon: <LayoutList size={18} /> },
      { id: 1, label: 'Quadro', icon: <LayoutGrid size={18} /> },
      { id: 2, label: 'Gráficos', icon: <PieChart size={18} /> },
      { id: 3, label: 'Metas', icon: <Trophy size={18} /> },
      { id: 4, label: 'Equipe', icon: <Users size={18} /> },
  ];

  const TABS_MORE = [
      { id: 5, label: 'Retrospectiva', icon: <Repeat size={18} /> },
      { id: 6, label: 'Poker', icon: <IconSpade size={18} /> },
      { id: 7, label: 'Arquivos', icon: <FileText size={18} /> },
      { id: 8, label: 'Lições', icon: <BookOpen size={18} /> },
      { id: 9, label: 'Reuniões', icon: <Video size={18} /> },
      { id: 10, label: 'Comunicação', icon: <Mail size={18} /> },
      { id: 11, label: 'Riscos', icon: <ShieldAlert size={18} /> },
      { id: 12, label: 'Mudanças', icon: <Shuffle size={18} /> },
      { id: 13, label: 'Orçamento', icon: <DollarSign size={18} /> },
      { id: 14, label: 'Horas', icon: <Clock size={18} /> },
  ];

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = (tabId?: number) => {
    setMoreMenuAnchor(null);
    if (typeof tabId === 'number') {
        setActiveTab(tabId);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
           <Button startIcon={<ArrowLeft size={16} />} color="inherit" onClick={() => navigate('/projects')}>Meus planos</Button>
           <Typography color="text.secondary">/</Typography>
           <Chip label={project.companyName} size="small" sx={{ bgcolor: '#eff6ff', color: 'primary.main', fontWeight: 600 }} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
             <Avatar variant="rounded" sx={{ bgcolor: '#0060B1', width: 48, height: 48 }}>{project.name.charAt(0)}</Avatar>
             <Box>
               <Typography variant="h5" fontWeight="bold">{project.name}</Typography>
               <Typography variant="caption" color="text.secondary">{tasks.length} tarefas • {tasks.filter(t => t.status === 'Concluído').length} concluídas</Typography>
             </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AvatarGroup max={4}>{mockPeople.map(p => <Avatar key={p.id} src={p.avatar} alt={p.name} />)}</AvatarGroup>
            <IconButton><MoreHorizontal /></IconButton>
            <Button variant="outlined" startIcon={<User size={18} />}>Compartilhar</Button>
          </Stack>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 4, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Tabs 
          value={activeTab < 5 ? activeTab : 5} // If activeTab is >= 5, highlight the "More" tab (index 5)
          onChange={(e, v) => setActiveTab(v)} 
          sx={{ minHeight: 48 }}
        >
          {TABS_MAIN.map(tab => (
              <Tab key={tab.id} value={tab.id} icon={tab.icon} iconPosition="start" label={tab.label} sx={{ minHeight: 48 }} />
          ))}
          <Tab 
            value={5} // Assign a specific value for the "More" tab
            label="Mais..." 
            icon={<MoreVertical size={18}/>} 
            iconPosition="start"
            sx={{ minHeight: 48, ml: 'auto' }} 
            onClick={handleMoreMenuOpen} 
          />
        </Tabs>
        <Menu
            anchorEl={moreMenuAnchor}
            open={Boolean(moreMenuAnchor)}
            onClose={() => handleMoreMenuClose()}
        >
            {TABS_MORE.map(tab => (
                <MenuItem key={tab.id} onClick={() => handleMoreMenuClose(tab.id)} selected={activeTab === tab.id}>
                    <ListItemIcon>{tab.icon}</ListItemIcon>
                    {tab.label}
                </MenuItem>
            ))}
        </Menu>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto', bgcolor: '#f8fafc' }}>
        <PatiBotBanner />

        {/* TAB 0: LIST (Grid View) */}
        {activeTab === 0 && (
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            {/* ... Content ... */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
               <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                  <Button startIcon={<Plus size={18} />} variant="contained" disableElevation>Adicionar nova tarefa</Button>
                  <Stack direction="row" spacing={1} overflow="auto">
                    {activeFilterCount > 0 && <Chip label={`${activeFilterCount} filtros`} size="small" color="primary" onDelete={clearFilters} variant="outlined" />}
                    <Button startIcon={<Filter size={18} />} color="inherit" onClick={handleFilterClick} variant={activeFilterCount > 0 ? "outlined" : "text"}>Filtros</Button>
                    <Button startIcon={<Palette size={18} />} color="inherit" onClick={handleOpenConditionalModal} variant={conditionalRules.length > 0 ? "outlined" : "text"}>Coloração</Button>
                  </Stack>
               </Stack>
            </Box>

            <Popover open={Boolean(filterAnchorEl)} anchorEl={filterAnchorEl} onClose={handleFilterClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ sx: { width: 320, p: 3 } }}>
               <Typography variant="h6">Filtrar</Typography>
               <Button onClick={clearFilters}>Limpar</Button>
            </Popover>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={50}></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'title'} onClick={() => handleSort('title')}>Nome da Tarefa</TableSortLabel></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'assigneeId'} onClick={() => handleSort('assigneeId')}>Atribuído a</TableSortLabel></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'bucket'} onClick={() => handleSort('bucket')}>Bucket</TableSortLabel></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'priority'} onClick={() => handleSort('priority')}>Prioridade</TableSortLabel></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'dueDate'} onClick={() => handleSort('dueDate')}>Conclusão</TableSortLabel></TableCell>
                    <TableCell><TableSortLabel active={sortConfig.field === 'status'} onClick={() => handleSort('status')}>Status</TableSortLabel></TableCell>
                    <TableCell width={50}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flattenedTasks.map(({ task, level }) => {
                    const assignee = mockPeople.find(p => p.id === task.assigneeId);
                    const hasChildren = filteredRawTasks.some(t => t.parentId === task.id);
                    const isExpanded = expandedTasks.has(task.id);
                    const isHovered = hoveredTask === task.id;
                    const rowColor = getRowColor(task);

                    return (
                      <TableRow key={task.id} hover onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)} sx={{ bgcolor: rowColor ? `${rowColor} !important` : undefined }}>
                        <TableCell padding="none" align="center">
                          <IconButton size="small" onClick={() => handleOpenTaskDetail(task)}>
                            {task.status === 'Concluído' ? <CheckCircle2 color="#16a34a" size={18} /> : <Circle color="#cbd5e1" size={18} />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', pl: (level || 0) * 3 }}>
                            {hasChildren ? (
                              <IconButton size="small" onClick={() => toggleExpand(task.id)} sx={{ mr: 0.5, p: 0.5 }}>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</IconButton>
                            ) : <Box sx={{ width: 24, mr: 0.5 }} />}
                            {level > 0 && <CornerDownRight size={14} color="#94a3b8" style={{ marginRight: 8 }} />}
                            <Typography variant="body2" fontWeight={500} sx={{ textDecoration: task.status === 'Concluído' ? 'line-through' : 'none', cursor: 'pointer' }} onClick={() => handleOpenTaskDetail(task)}>{task.title}</Typography>
                            {isHovered && (<Tooltip title="Adicionar Subtarefa"><IconButton size="small" color="primary" onClick={() => handleAddSubTask(task.id)} sx={{ ml: 1, p: 0.5, bgcolor: '#eff6ff' }}><Plus size={14} /></IconButton></Tooltip>)}
                          </Box>
                        </TableCell>
                        <TableCell>{assignee ? <Stack direction="row" spacing={1} alignItems="center"><Avatar src={assignee.avatar} sx={{ width: 24, height: 24 }} /><Typography variant="body2">{assignee.name.split(' ')[0]}</Typography></Stack> : '-'}</TableCell>
                        <TableCell>{task.bucket}</TableCell>
                        <TableCell><Typography variant="caption" fontWeight="bold" sx={{ color: getPriorityColor(task.priority) }}>{task.priority}</Typography></TableCell>
                        <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell>{getStatusChip(task.status)}</TableCell>
                        <TableCell align="right" padding="none"><IconButton size="small" onClick={(e) => handleTaskMenuOpen(e, task)}><MoreHorizontal size={18} /></IconButton></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* TAB 1: BOARD (KANBAN) */}
        {activeTab === 1 && (
          <Box sx={{ overflowX: 'auto', height: '100%', pb: 2 }}>
            <Stack direction="row" spacing={3} sx={{ height: '100%', minWidth: 1200 }}>
              {['To Do', 'Desenvolvimento', 'Validação', 'Concluído'].map(bucket => {
                const bucketTasks = filteredRawTasks.filter(t => t.bucket === bucket);
                return (
                  <Paper key={bucket} sx={{ width: 320, bgcolor: '#f1f5f9', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography fontWeight="bold" variant="subtitle2">{bucket}</Typography>
                      <Chip label={bucketTasks.length} size="small" sx={{ bgcolor: 'white', fontWeight: 'bold' }} />
                    </Box>
                    <Stack spacing={2} sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
                      {bucketTasks.map(task => {
                        const checklistTotal = task.checklist?.length || 0;
                        const checklistDone = task.checklist?.filter(c => c.done).length || 0;

                        return (
                        <Card key={task.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2, cursor: 'pointer' } }} onClick={() => handleOpenTaskDetail(task)}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ flex: 1, mr: 1 }}>{task.title}</Typography>
                                {task.watched && <Bell size={14} fill="#f59e0b" color="#f59e0b" />}
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label={task.priority} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: getPriorityColor(task.priority), color: 'white' }} />
                                {task.dueDate && <Chip label={new Date(task.dueDate).toLocaleDateString().slice(0, 5)} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                {checklistTotal > 0 && (
                                  <Chip 
                                    icon={<CheckSquare size={12} />} 
                                    label={`${checklistDone}/${checklistTotal}`} 
                                    size="small" 
                                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: checklistDone === checklistTotal ? '#dcfce7' : '#f1f5f9', color: checklistDone === checklistTotal ? '#166534' : 'text.secondary' }} 
                                  />
                                )}
                              </Stack>
                              {task.assigneeId && <Avatar src={mockPeople.find(p => p.id === task.assigneeId)?.avatar} sx={{ width: 24, height: 24 }} />}
                            </Stack>
                          </CardContent>
                        </Card>
                      )})}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Box>
        )}

        {/* TAB 2: CHARTS (AGILE) */}
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 350 }}>
                <Typography variant="h6" gutterBottom>Status das Tarefas</Typography>
                <Stack spacing={2} mt={4}>
                  {Object.entries(taskStats).filter(([k]) => k !== 'total').map(([key, val]) => (
                    <Box key={key}>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{key === 'notStarted' ? 'Não Iniciado' : key}</Typography>
                        <Typography variant="caption" fontWeight="bold">{val} ({taskStats.total > 0 ? Math.round((val as number) / taskStats.total * 100) : 0}%)</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={taskStats.total > 0 ? (val as number) / taskStats.total * 100 : 0} 
                        sx={{ height: 8, borderRadius: 4 }} 
                        color={key === 'delayed' ? 'error' : key === 'completed' ? 'success' : 'primary'}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 350, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>Velocity Chart (Simulado)</Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'end', gap: 2, pt: 2, pb: 4, px: 2, borderBottom: '1px solid #e2e8f0' }}>
                    {[12, 18, 15, 22, 20].map((val: number, i: number) => (
                        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', height: val * 8, bgcolor: i === 4 ? '#22c55e' : '#cbd5e1', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                <Typography variant="caption" sx={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>{val}</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ mt: 1 }}>Sprint {i+30}</Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant="caption" color="text.secondary" align="center" mt={1}>Pontos por Sprint</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: 300 }}>
                 <Typography variant="h6" gutterBottom>Burndown Chart (Simulado)</Typography>
                 <Box sx={{ width: '100%', height: 200, position: 'relative', mt: 4, borderLeft: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                    {/* Simulated SVG Line */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline points="0,0 100,100" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                        <polyline points="0,0 20,10 40,30 60,45 80,70 100,95" fill="none" stroke="#0060B1" strokeWidth="2" />
                    </svg>
                    <Typography variant="caption" sx={{ position: 'absolute', bottom: -25, left: 0 }}>Início</Typography>
                    <Typography variant="caption" sx={{ position: 'absolute', bottom: -25, right: 0 }}>Fim</Typography>
                 </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 3: GOALS */}
        {activeTab === 3 && (
          <Box maxWidth={900} mx="auto">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button startIcon={<Plus />} variant="contained" onClick={handleOpenGoalModal}>Nova Meta</Button>
            </Box>
            
            <Stack spacing={2}>
              {goals.map(goal => (
                <Paper key={goal.id} sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" gap={2} mb={2}>
                    <Checkbox checked={goal.status === 'Concluído'} onChange={() => toggleGoalStatus(goal.id)} />
                    <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ textDecoration: goal.status === 'Concluído' ? 'line-through' : 'none', color: goal.status === 'Concluído' ? 'text.secondary' : 'text.primary' }}>{goal.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Prazo: {new Date(goal.dueDate).toLocaleDateString()}</Typography>
                    </Box>
                    <Chip label={goal.status} color={goal.status === 'Concluído' ? 'success' : 'default'} size="small" />
                  </Stack>
                  
                  {goal.associatedTaskIds && goal.associatedTaskIds.length > 0 && (
                      <Box sx={{ pl: 6, borderLeft: '2px solid #e2e8f0' }}>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>Tarefas Associadas:</Typography>
                          <Stack spacing={1} mt={1}>
                              {goal.associatedTaskIds.map(tid => {
                                  const t = tasks.find(tsk => tsk.id === tid);
                                  return t ? (
                                      <Paper key={tid} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f8fafc' }}>
                                          {t.status === 'Concluído' ? <CheckCircle2 size={14} color="#22c55e" /> : <Circle size={14} color="#94a3b8" />}
                                          <Typography variant="body2" sx={{ textDecoration: t.status === 'Concluído' ? 'line-through' : 'none' }}>{t.title}</Typography>
                                      </Paper>
                                  ) : null;
                              })}
                          </Stack>
                      </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* TAB 4: TEAM */}
        {activeTab === 4 && (
          <Box>
             <Typography variant="h6" gutterBottom>Membros do Time</Typography>
             <TableContainer component={Paper} variant="outlined">
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Membro</TableCell>
                    <TableCell>Papel</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell>Alocação Semanal</TableCell>
                    <TableCell>Valor Hora</TableCell>
                    <TableCell>Ausências no Período</TableCell>
                    <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teamMembers.map(member => {
                    const person = mockPeople.find(p => p.id === member.personId);
                    const absences = getMemberAbsences(member.personId);

                    return (
                        <TableRow key={member.personId}>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={person?.avatar} />
                            <Typography>{person?.name}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.workModel}</TableCell>
                        <TableCell>
                            <Chip label={`${member.allocationHours}h`} size="small" />
                        </TableCell>
                        <TableCell>R$ {member.hourlyRate}</TableCell>
                        <TableCell>
                            {absences.length > 0 ? (
                                <Stack spacing={0.5}>
                                    {absences.map(h => (
                                        <Chip 
                                            key={h.id} 
                                            label={`${new Date(h.date).toLocaleDateString().slice(0,5)} - ${h.name}`} 
                                            size="small" 
                                            color={h.category === 'Férias' ? 'success' : 'default'}
                                            variant="outlined"
                                            icon={h.category === 'Férias' ? <Plane size={12} /> : h.category === 'Dayoff' ? <Coffee size={12} /> : <CalendarDays size={12}/>}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="caption" color="text.secondary">Nenhuma ausência programada</Typography>
                            )}
                        </TableCell>
                        <TableCell align="right">
                            <IconButton size="small" onClick={() => {
                                setEditingMember({ personId: member.personId, allocation: member.allocationHours });
                                setAllocationModalOpen(true);
                            }}>
                                <Edit2 size={16} />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 5: RETROSPECTIVE */}
        {activeTab === 5 && (
          <Box sx={{ overflowX: 'auto', pb: 2 }}>
             {activeRetro ? (
               <>
                 <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{activeRetro.title} ({activeRetro.status})</Typography>
                    <Stack direction="row" spacing={2}>
                       <Select value={activeRetroId} onChange={(e) => setActiveRetroId(e.target.value)} size="small">
                          {retrospectives.map(r => <MenuItem key={r.id} value={r.id}>{r.title}</MenuItem>)}
                       </Select>
                       <Button variant="outlined" onClick={() => setRetroPhase(retroPhase === 'collect' ? 'vote' : retroPhase === 'vote' ? 'act' : 'collect')}>
                          Fase: {retroPhase === 'collect' ? 'Coleta' : retroPhase === 'vote' ? 'Votação' : 'Plano de Ação'}
                       </Button>
                    </Stack>
                 </Box>
                 
                 <Stack direction="row" spacing={2} sx={{ minWidth: 1000 }}>
                    {(['liked', 'learned', 'lacked', 'longed'] as RetroColumnType[]).map(col => (
                       <Paper key={col} sx={{ width: 300, bgcolor: '#f8fafc', p: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>
                             {col === 'liked' ? 'Gostamos' : col === 'learned' ? 'Aprendemos' : col === 'lacked' ? 'Faltou' : 'Desejamos'}
                          </Typography>
                          <Stack spacing={2} mt={2}>
                             {activeRetro.items.filter(i => i.columnId === col).map(item => (
                                <Card key={item.id} variant="outlined">
                                   <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                      <Typography variant="body2">{item.text}</Typography>
                                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                         <Chip 
                                            label={item.votes} 
                                            icon={<ThumbsUp size={12}/>} 
                                            size="small" 
                                            onClick={() => handleVoteRetroItem(item.id)}
                                            variant={item.votes > 0 ? 'filled' : 'outlined'}
                                            color="primary"
                                            sx={{ height: 20, fontSize: '0.65rem' }}
                                         />
                                      </Box>
                                   </CardContent>
                                </Card>
                             ))}
                             <Button size="small" startIcon={<Plus size={14}/>} onClick={() => handleAddRetroItem(col)}>Adicionar</Button>
                          </Stack>
                       </Paper>
                    ))}
                 </Stack>
               </>
             ) : (
                <Box textAlign="center" py={4}>
                   <Typography color="text.secondary">Nenhuma retrospectiva iniciada.</Typography>
                   <Button variant="contained" sx={{ mt: 2 }} onClick={() => alert("Criar Nova Retro (Mock)")}>Criar Retrospectiva</Button>
                </Box>
             )}
          </Box>
        )}

        {/* TAB 6: POKER */}
        {activeTab === 6 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
             <Typography variant="h5" gutterBottom>Planning Poker</Typography>
             <Typography color="text.secondary" mb={4}>Sessão de estimativa colaborativa.</Typography>
             
             <Paper variant="outlined" sx={{ p: 4, maxWidth: 800, mx: 'auto', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>?</Typography>
                <Typography variant="h6">Selecione uma tarefa para iniciar a votação</Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => alert("Iniciar Sessão (Mock)")}>Iniciar Sessão</Button>
             </Paper>
          </Box>
        )}

        {/* TAB 7: FILES (RESTORING FILTER) */}
        {activeTab === 7 && (
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6">Arquivos do Projeto</Typography>
                <Stack direction="row" spacing={2}>
                   <TextField 
                      size="small" 
                      placeholder="Buscar arquivo..." 
                      value={fileSearch} 
                      onChange={(e) => setFileSearch(e.target.value)} 
                      InputProps={{ startAdornment: <Search size={16} style={{ marginRight: 8 }}/> }} 
                      sx={{ bgcolor: 'white', minWidth: 200 }}
                   />
                   <Select
                      size="small"
                      value={fileTypeFilter}
                      onChange={(e) => setFileTypeFilter(e.target.value)}
                      displayEmpty
                      sx={{ bgcolor: 'white', minWidth: 150 }}
                   >
                      <MenuItem value="all">Todos os tipos</MenuItem>
                      <MenuItem value="PDF">PDF</MenuItem>
                      <MenuItem value="Image">Imagens</MenuItem>
                      <MenuItem value="Spreadsheet">Planilhas</MenuItem>
                      <MenuItem value="Document">Documentos</MenuItem>
                   </Select>
                   <Button variant="contained" startIcon={<Plus />}>Upload</Button>
                </Stack>
             </Box>
             <Grid container spacing={2}>
                {filteredFiles.map(file => (
                   <Grid item xs={12} sm={6} md={4} key={file.id}>
                      <Card variant="outlined">
                         <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar variant="rounded" sx={{ bgcolor: '#eff6ff' }}>
                               {file.type === 'Image' ? <File size={20} color="#3b82f6"/> : <FileText size={20} color="#64748b"/>}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                               <Typography variant="subtitle2" noWrap title={file.name}>{file.name}</Typography>
                               <Typography variant="caption" color="text.secondary">{file.size} • {new Date(file.uploadDate).toLocaleDateString()}</Typography>
                            </Box>
                            <IconButton size="small"><Download size={16} /></IconButton>
                         </CardContent>
                      </Card>
                   </Grid>
                ))}
                {filteredFiles.length === 0 && <Grid item xs={12}><Typography align="center" color="text.secondary">Nenhum arquivo encontrado.</Typography></Grid>}
             </Grid>
          </Box>
        )}

        {/* TAB 8: LESSONS LEARNED */}
        {activeTab === 8 && (
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Lições Aprendidas</Typography>
                <Button startIcon={<Plus />} variant="contained" onClick={handleOpenLessonModal}>Registrar Lição</Button>
             </Box>
             <Stack spacing={2}>
                {lessons.map(lesson => {
                    const sourceProject = lesson.sourceProjectId 
                        ? mockProjects.find(p => p.id === lesson.sourceProjectId) 
                        : null;

                    return (
                        <Paper key={lesson.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={lesson.category} size="small" color="primary" variant="outlined" />
                                    {sourceProject && (
                                        <Chip 
                                            icon={<Download size={12}/>}
                                            label={`Importada de: ${sourceProject.name}`} 
                                            size="small" 
                                            sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', borderColor: '#d8b4fe' }}
                                            variant="outlined"
                                        />
                                    )}
                                    <Typography variant="caption" color="text.secondary">{new Date(lesson.date).toLocaleDateString()}</Typography>
                                </Stack>
                                <Chip label={lesson.status || 'Pendente'} size="small" color={lesson.status === 'Aprovado' ? 'success' : 'default'} />
                            </Stack>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{lesson.description}</Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">Impacto</Typography>
                                    <Typography variant="body2" color={lesson.impact === 'Positivo' ? 'success.main' : 'error.main'}>{lesson.impact}</Typography>
                                </Grid>
                                {lesson.actionTaken && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">Ação Tomada</Typography>
                                        <Typography variant="body2">{lesson.actionTaken}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                {lesson.status === 'Pendente' && (
                                    <>
                                        <Button size="small" color="error" onClick={() => handleLessonStatus(lesson.id, 'Rejeitado')}>Rejeitar</Button>
                                        <Button size="small" color="success" onClick={() => handleLessonStatus(lesson.id, 'Aprovado')}>Aprovar</Button>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
                {lessons.length === 0 && (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>Nenhuma lição aprendida registrada.</Typography>
                )}
             </Stack>
          </Box>
        )}

        {/* TAB 9: MEETINGS (RESTORING BUTTONS & PARTICIPANTS) */}
        {activeTab === 9 && (
          <Box>
             <Typography variant="h6" gutterBottom>Atas de Reunião</Typography>
             <Stack spacing={2}>
                {mockProjectMeetings.filter(m => m.projectId === id).map(meeting => (
                   <Paper key={meeting.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                         <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{meeting.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(meeting.date).toLocaleString()} • {meeting.type}</Typography>
                         </Box>
                         <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" startIcon={<Video size={14}/>}>Gravação</Button>
                            <Button size="small" variant="outlined" startIcon={<FileText size={14}/>}>Ata</Button>
                            <Button size="small" variant="outlined" startIcon={<Bot size={14}/>} sx={{ borderColor: '#818cf8', color: '#6366f1' }}>Resumo IA</Button>
                         </Stack>
                      </Stack>
                      <Box mt={2} display="flex" alignItems="center" gap={2}>
                         <Typography variant="caption" color="text.secondary">Participantes:</Typography>
                         <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                            {meeting.participants.map(pid => {
                               const person = mockPeople.find(p => p.id === pid);
                               return <Avatar key={pid} src={person?.avatar} alt={person?.name} title={person?.name} />;
                            })}
                         </AvatarGroup>
                      </Box>
                   </Paper>
                ))}
                {mockProjectMeetings.filter(m => m.projectId === id).length === 0 && <Typography color="text.secondary">Nenhuma reunião registrada.</Typography>}
             </Stack>
          </Box>
        )}

        {/* TAB 10: COMMUNICATION (RESTORING PLAN TABLE) */}
        {activeTab === 10 && (
          <Box>
             {/* Communication Plan */}
             {project?.communicationPlan && project.communicationPlan.length > 0 && (
                <Box mb={4}>
                   <Typography variant="h6" gutterBottom>Plano de Comunicação</Typography>
                   <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                         <TableHead>
                            <TableRow>
                               <TableCell>Público</TableCell>
                               <TableCell>Canal</TableCell>
                               <TableCell>Frequência</TableCell>
                               <TableCell>Responsável</TableCell>
                               <TableCell>Objetivo</TableCell>
                            </TableRow>
                         </TableHead>
                         <TableBody>
                            {project.communicationPlan.map(item => {
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
                                  </TableRow>
                               );
                            })}
                         </TableBody>
                      </Table>
                   </TableContainer>
                </Box>
             )}

             <Typography variant="h6" gutterBottom>Histórico de Emails</Typography>
             <Stack spacing={2}>
                {mockProjectEmails.filter(e => e.projectId === id).map(email => (
                   <Paper key={email.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                         <Avatar sx={{ width: 32, height: 32 }}><Mail size={16}/></Avatar>
                         <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{email.subject}</Typography>
                            <Typography variant="caption" color="text.secondary">De: {email.from} Para: {email.to}</Typography>
                         </Box>
                         <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{new Date(email.date).toLocaleDateString()}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 6 }}>{email.snippet}</Typography>
                   </Paper>
                ))}
             </Stack>
          </Box>
        )}

        {/* TAB 11: RISKS */}
        {activeTab === 11 && (
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Matriz de Riscos</Typography>
                <Button startIcon={<Plus />} variant="contained" onClick={() => setRiskModalOpen(true)}>Novo Risco</Button>
             </Box>
             <TableContainer component={Paper} variant="outlined">
                <Table>
                   <TableHead>
                      <TableRow>
                         <TableCell>Descrição</TableCell>
                         <TableCell>Probabilidade</TableCell>
                         <TableCell>Impacto</TableCell>
                         <TableCell>Status</TableCell>
                         <TableCell>Plano de Mitigação</TableCell>
                         <TableCell align="right">Ações</TableCell>
                      </TableRow>
                   </TableHead>
                   <TableBody>
                      {risks.map(risk => (
                         <TableRow key={risk.id}>
                            <TableCell>{risk.description}</TableCell>
                            <TableCell><Chip label={risk.probability} size="small" color={risk.probability === 'Alta' ? 'error' : 'warning'} variant="outlined" /></TableCell>
                            <TableCell><Chip label={risk.impact} size="small" color={risk.impact === 'Alto' ? 'error' : 'warning'} variant="outlined" /></TableCell>
                            <TableCell>{risk.status}</TableCell>
                            <TableCell>{risk.mitigationPlan}</TableCell>
                            <TableCell align="right"><IconButton size="small" onClick={() => { setEditingRisk(risk); setRiskModalOpen(true); }}><Edit2 size={16}/></IconButton></TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </TableContainer>
          </Box>
        )}

        {/* TAB 12: CHANGES */}
        {activeTab === 12 && (
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Solicitações de Mudança</Typography>
                <Button startIcon={<Plus />} variant="contained" onClick={() => setChangeModalOpen(true)}>Solicitar Mudança</Button>
             </Box>
             <Stack spacing={2}>
                {changes.map(change => (
                   <Paper key={change.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                         <Typography variant="subtitle1" fontWeight="bold">{change.title}</Typography>
                         <Chip label={change.status} color={change.status === 'Aprovado' ? 'success' : change.status === 'Rejeitado' ? 'error' : 'default'} size="small" />
                      </Stack>
                      <Typography variant="body2" mb={2}>{change.description}</Typography>
                      <Stack direction="row" spacing={3} color="text.secondary">
                         <Typography variant="caption">Solicitante: {change.requester}</Typography>
                         <Typography variant="caption">Custo: R$ {change.impactCost}</Typography>
                         <Typography variant="caption">Prazo: +{change.impactTime} dias</Typography>
                      </Stack>
                      {change.status === 'Pendente' && (
                         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button size="small" color="error" onClick={() => handleChangeStatus(change.id, 'Rejeitado')}>Rejeitar</Button>
                            <Button size="small" color="success" onClick={() => handleChangeStatus(change.id, 'Aprovado')}>Aprovar</Button>
                         </Box>
                      )}
                   </Paper>
                ))}
             </Stack>
          </Box>
        )}

        {/* TAB 13: BUDGET (RESTORING BALANCE) */}
        {activeTab === 13 && (
          <Box>
             <Typography variant="h6" gutterBottom>Orçamento do Projeto</Typography>
             <Grid container spacing={2} mb={4}>
                <Grid item xs={12} md={4}>
                   <Paper sx={{ p: 2, bgcolor: '#eff6ff' }}>
                      <Typography variant="caption" color="text.secondary">Previsto Total</Typography>
                      <Typography variant="h5" fontWeight="bold">R$ 150.000</Typography>
                   </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                   <Paper sx={{ p: 2, bgcolor: '#f0fdf4' }}>
                      <Typography variant="caption" color="text.secondary">Realizado</Typography>
                      <Typography variant="h5" fontWeight="bold">R$ 45.000</Typography>
                   </Paper>
                </Grid>
                {/* Balance Card */}
                <Grid item xs={12} md={4}>
                   <Paper sx={{ p: 2, bgcolor: '#fefce8', color: '#ca8a04', border: '1px solid #fde047' }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Saldo</Typography>
                      <Typography variant="h5" fontWeight="bold">R$ 105.000</Typography>
                   </Paper>
                </Grid>
             </Grid>
             <TableContainer component={Paper} variant="outlined">
                <Table>
                   <TableHead>
                      <TableRow>
                         <TableCell>Categoria</TableCell>
                         <TableCell>Descrição</TableCell>
                         <TableCell align="right">Previsto</TableCell>
                         <TableCell align="right">Realizado</TableCell>
                      </TableRow>
                   </TableHead>
                   <TableBody>
                      {mockBudgetEntries.filter(b => b.projectId === id).map(entry => (
                         <TableRow key={entry.id}>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell align="right">R$ {entry.estimated}</TableCell>
                            <TableCell align="right">R$ {entry.actual}</TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </TableContainer>
          </Box>
        )}

        {/* TAB 14: HOURS (RESTORING BUTTON) */}
        {activeTab === 14 && (
          <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Apontamento de Horas</Typography>
                <Button variant="outlined" startIcon={<Clock />}>Solicitar Lançamento</Button>
             </Box>
             <TableContainer component={Paper} variant="outlined">
                <Table>
                   <TableHead>
                      <TableRow>
                         <TableCell>Colaborador</TableCell>
                         <TableCell>Data</TableCell>
                         <TableCell>Atividade</TableCell>
                         <TableCell align="right">Horas</TableCell>
                      </TableRow>
                   </TableHead>
                   <TableBody>
                      {mockActivities.filter(a => a.project === project.name).map(act => {
                         const person = mockPeople.find(p => p.id === act.userId);
                         return (
                            <TableRow key={act.id}>
                               <TableCell>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                     <Avatar src={person?.avatar} sx={{ width: 24, height: 24 }} />
                                     <Typography variant="body2">{person?.name}</Typography>
                                  </Stack>
                               </TableCell>
                               <TableCell>{new Date(act.date).toLocaleDateString()}</TableCell>
                               <TableCell>{act.description}</TableCell>
                               <TableCell align="right" sx={{ fontWeight: 'bold' }}>{act.hours}h</TableCell>
                            </TableRow>
                         );
                      })}
                   </TableBody>
                </Table>
             </TableContainer>
          </Box>
        )}

      </Box>

      {/* Task Menu */}
      <Menu anchorEl={taskMenuAnchorEl} open={Boolean(taskMenuAnchorEl)} onClose={handleTaskMenuClose}>
        <MenuItem onClick={() => handleMenuAction('details')}><ListItemIcon><Eye size={16} /></ListItemIcon> Ver Detalhes</MenuItem>
        <MenuItem onClick={() => handleMenuAction('subtask')}><ListItemIcon><CornerDownRight size={16} /></ListItemIcon> Adicionar Subtarefa</MenuItem>
        <MenuItem onClick={() => handleMenuAction('dedicate')}><ListItemIcon><Award size={16} /></ListItemIcon> Dedicar Pin</MenuItem>
        <MenuItem onClick={() => handleMenuAction('duplicate')}><ListItemIcon><CopyPlus size={16} /></ListItemIcon> Duplicar</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}><ListItemIcon><Trash2 size={16} color="#ef4444" /></ListItemIcon> Excluir</MenuItem>
      </Menu>

      {/* Pin Dedication Modal */}
      <Dialog open={pinModalOpen} onClose={() => setPinModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dedicar Pin pela Atividade</DialogTitle>
        <DialogContent dividers>
            <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                    Você está dedicando um pin relacionado à atividade: <strong>{selectedTaskForMenu?.title}</strong>
                </Typography>
                
                <Box>
                    <InputLabel>Destinatário (Responsável)</InputLabel>
                    <Select 
                        fullWidth 
                        size="small" 
                        value={newPin.receiverId || ''} 
                        onChange={(e) => setNewPin({...newPin, receiverId: e.target.value})}
                    >
                        {mockPeople.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </Select>
                </Box>

                <Box>
                    <InputLabel>Categoria</InputLabel>
                    <Select 
                        fullWidth 
                        size="small" 
                        value={newPin.category || 'Collaboration'} 
                        onChange={(e) => setNewPin({...newPin, category: e.target.value as any})}
                    >
                        <MenuItem value="Collaboration">Colaboração</MenuItem>
                        <MenuItem value="Knowledge">Conhecimento</MenuItem>
                        <MenuItem value="Extraordinary">Entrega Extraordinária</MenuItem>
                        <MenuItem value="Innovation">Inovação</MenuItem>
                    </Select>
                </Box>

                <TextField 
                    label="Mensagem"
                    multiline
                    rows={3}
                    fullWidth
                    value={newPin.message}
                    onChange={(e) => setNewPin({...newPin, message: e.target.value})}
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setPinModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleDedicatePin}>Enviar Pin</Button>
        </DialogActions>
      </Dialog>

      {/* Task Detail Dialog - Keeping existing structure... */}
      <Dialog open={taskDetailOpen} onClose={() => setTaskDetailOpen(false)} maxWidth="md" fullWidth>
        {currentTask && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{currentTask.title}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">Em {currentTask.bucket}</Typography>
                    {/* Parent Task Indicator */}
                    {currentTask.parentId && (
                      <Chip 
                        icon={<CornerUpLeft size={12} />} 
                        label={`Filho de: ${tasks.find(t => t.id === currentTask.parentId)?.title || 'Tarefa Pai'}`} 
                        size="small" 
                        variant="outlined" 
                        onClick={() => {
                           const parent = tasks.find(t => t.id === currentTask.parentId);
                           if(parent) handleOpenTaskDetail(parent);
                        }}
                        sx={{ height: 20, fontSize: '0.7rem', cursor: 'pointer', borderColor: '#cbd5e1' }}
                      />
                    )}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={handleWatchToggle} title={taskFormData.watched ? "Parar de seguir" : "Seguir tarefa"}>
                    {taskFormData.watched ? <Bell size={20} fill="#f59e0b" color="#f59e0b" /> : <Bell size={20} />}
                  </IconButton>
                  <IconButton onClick={() => setTaskDetailOpen(false)}><X /></IconButton>
                </Stack>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
               <Grid container sx={{ height: 650 }}>
                 {/* Left Column: Content Tabs */}
                 <Grid item xs={12} md={8} sx={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                      <Tabs value={taskDetailTab} onChange={(e, v) => setTaskDetailTab(v)} variant="scrollable" scrollButtons="auto">
                        <Tab label="Detalhes" />
                        <Tab label={<Stack direction="row" gap={1}>Comentários <Chip label={taskFormData.comments?.length || 0} size="small" sx={{ height: 16, fontSize: '0.65rem' }} /></Stack>} />
                        <Tab label="Horas" />
                        <Tab label="Retrospectivas" />
                        <Tab label="Planning Poker" />
                        <Tab label="Pins" />
                      </Tabs>
                    </Box>

                    <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                      
                      {/* TAB 0: DETAILS */}
                      {taskDetailTab === 0 && (
                        <>
                          {/* Description */}
                          <Box mb={4}>
                             <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">DESCRIÇÃO</Typography>
                             <TextField 
                               fullWidth multiline rows={4} 
                               value={taskFormData.description || ''} 
                               onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                               placeholder="Adicione uma descrição detalhada..."
                               variant="outlined"
                               sx={{ bgcolor: '#fafafa' }}
                             />
                          </Box>

                          {/* Checklist */}
                          <Box mb={4}>
                             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} onClick={() => toggleSection('checklist')} sx={{ cursor: 'pointer' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">CHECKLIST</Typography>
                                {expandedSections.checklist ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                             </Stack>
                             <Collapse in={expandedSections.checklist}>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                   {(taskFormData.checklist || []).map((item, idx) => (
                                     <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                                        <Checkbox checked={item.done} onChange={(e) => {
                                           const newList = [...(taskFormData.checklist || [])];
                                           newList[idx].done = e.target.checked;
                                           setTaskFormData({...taskFormData, checklist: newList});
                                        }} />
                                        <TextField 
                                          fullWidth size="small" value={item.text} variant="standard" 
                                          placeholder="Item da lista..."
                                          onChange={(e) => {
                                            const newList = [...(taskFormData.checklist || [])];
                                            newList[idx].text = e.target.value;
                                            setTaskFormData({...taskFormData, checklist: newList});
                                          }}
                                          InputProps={{ disableUnderline: true }}
                                        />
                                        <IconButton size="small" color="error" onClick={() => {
                                           const newList = (taskFormData.checklist || []).filter((_, i) => i !== idx);
                                           setTaskFormData({...taskFormData, checklist: newList});
                                        }}><Trash2 size={14} /></IconButton>
                                     </Stack>
                                   ))}
                                   <Button startIcon={<Plus size={14} />} size="small" onClick={() => setTaskFormData({...taskFormData, checklist: [...(taskFormData.checklist || []), { id: Date.now().toString(), text: '', done: false }]})}>Adicionar item</Button>
                                </Stack>
                             </Collapse>
                          </Box>

                          {/* Attachments Section */}
                          <Box mb={4}>
                             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} onClick={() => toggleSection('attachments')} sx={{ cursor: 'pointer' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">ANEXOS ({taskFormData.attachments?.length || 0})</Typography>
                                {expandedSections.attachments ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                             </Stack>
                             <Collapse in={expandedSections.attachments}>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                   {(taskFormData.attachments || []).map((att) => (
                                     <Paper key={att.id} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                           <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: '#f1f5f9' }}><File size={16} color="#64748b" /></Avatar>
                                           <Box>
                                              <Typography variant="body2" fontWeight="bold">{att.name}</Typography>
                                              <Typography variant="caption" color="text.secondary">{att.type} • {att.size}</Typography>
                                           </Box>
                                        </Stack>
                                        <IconButton size="small" color="error" onClick={() => handleRemoveAttachment(att.id)}><Trash2 size={14} /></IconButton>
                                     </Paper>
                                   ))}
                                   <Button variant="outlined" startIcon={<Paperclip size={14} />} size="small" onClick={handleAddAttachment} fullWidth sx={{ borderStyle: 'dashed' }}>
                                      Anexar Arquivo
                                   </Button>
                                </Stack>
                             </Collapse>
                          </Box>

                          {/* Relations Section */}
                          <Box mb={4}>
                             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} onClick={() => toggleSection('relations')} sx={{ cursor: 'pointer' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">ASSOCIAÇÕES ({taskFormData.relations?.length || 0})</Typography>
                                {expandedSections.relations ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                             </Stack>
                             <Collapse in={expandedSections.relations}>
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                   {/* List existing relations */}
                                   {(taskFormData.relations || []).map(rel => {
                                     const target = tasks.find(t => t.id === rel.targetTaskId);
                                     return (
                                       <Paper key={rel.id} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
                                          <Stack direction="row" spacing={1} alignItems="center">
                                             <Chip label={RELATION_TYPE_LABELS[rel.type]} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                                             <ArrowRightLeft size={12} color="#94a3b8" />
                                             <Typography variant="body2" sx={{ textDecoration: target?.status === 'Concluído' ? 'line-through' : 'none' }}>
                                                {target?.title || 'Tarefa não encontrada'}
                                             </Typography>
                                          </Stack>
                                          <IconButton size="small" onClick={() => handleRemoveRelation(rel.id)}><X size={14} /></IconButton>
                                       </Paper>
                                     );
                                   })}
                                   
                                   {/* Add new relation */}
                                   <Stack direction="row" spacing={1}>
                                      <Select 
                                        size="small" 
                                        value={taskFormData.newRelationType || 'Related'} 
                                        onChange={(e) => setTaskFormData({...taskFormData, newRelationType: e.target.value as any})}
                                        sx={{ minWidth: 140 }}
                                      >
                                         {(Object.keys(RELATION_TYPE_LABELS) as RelationType[]).map(key => (
                                            <MenuItem key={key} value={key}>{RELATION_TYPE_LABELS[key]}</MenuItem>
                                         ))}
                                      </Select>
                                      <Select 
                                        size="small" 
                                        fullWidth
                                        displayEmpty
                                        value={taskFormData.newRelationTarget || ''} 
                                        onChange={(e) => setTaskFormData({...taskFormData, newRelationTarget: e.target.value})}
                                        renderValue={(selected) => {
                                           if (!selected) return <Typography color="text.secondary" variant="body2">Selecione a tarefa...</Typography>;
                                           return tasks.find(t => t.id === selected)?.title || selected;
                                        }}
                                      >
                                         {tasks.filter(t => t.id !== currentTask.id).map(t => (
                                           <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                                         ))}
                                      </Select>
                                      <Button variant="contained" size="small" onClick={handleAddRelation} disabled={!taskFormData.newRelationTarget}>Adicionar</Button>
                                   </Stack>
                                </Stack>
                             </Collapse>
                          </Box>
                        </>
                      )}

                      {/* TAB 1: COMMENTS */}
                      {taskDetailTab === 1 && (
                        <Box>
                          <Box sx={{ mb: 3 }}>
                             <RichTextEditor 
                                value={taskFormData.newComment || ''}
                                onChange={(val) => setTaskFormData({...taskFormData, newComment: val})}
                             />
                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                               <Button variant="contained" size="small" startIcon={<Send size={14} />} onClick={handleAddComment} disabled={!taskFormData.newComment}>Enviar</Button>
                             </Box>
                          </Box>

                          <Stack spacing={3}>
                             {taskFormData.comments?.map(comment => {
                               const user = mockPeople.find(p => p.id === comment.userId);
                               return (
                                 <Stack key={comment.id} direction="row" spacing={2}>
                                    <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
                                    <Box flex={1}>
                                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                          <Typography variant="subtitle2" fontWeight="bold">{user?.name}</Typography>
                                          <Typography variant="caption" color="text.secondary">{new Date(comment.date).toLocaleString()}</Typography>
                                       </Box>
                                       <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{comment.text}</Typography>
                                    </Box>
                                 </Stack>
                               );
                             })}
                             {(taskFormData.comments?.length || 0) === 0 && (
                                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>Nenhum comentário ainda.</Typography>
                             )}
                          </Stack>
                        </Box>
                      )}

                      {/* TAB 2: HOURS */}
                      {taskDetailTab === 2 && (
                        <Box>
                           {/* Add New Log */}
                           <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
                              <Typography variant="subtitle2" fontWeight="bold" mb={2}>Registrar Horas</Typography>
                              <Stack spacing={2}>
                                 <Stack direction="row" spacing={2}>
                                    <TextField 
                                      type="date" 
                                      size="small" 
                                      label="Data" 
                                      InputLabelProps={{ shrink: true }}
                                      value={newActivity.date} 
                                      onChange={e => setNewActivity({...newActivity, date: e.target.value})} 
                                    />
                                    <TextField 
                                      type="number" 
                                      size="small" 
                                      label="Horas" 
                                      sx={{ width: 100 }}
                                      value={newActivity.hours} 
                                      onChange={e => setNewActivity({...newActivity, hours: e.target.value})} 
                                    />
                                 </Stack>
                                 <TextField 
                                    size="small" 
                                    fullWidth 
                                    label="Descrição" 
                                    value={newActivity.description} 
                                    onChange={e => setNewActivity({...newActivity, description: e.target.value})} 
                                 />
                                 <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" size="small" onClick={handleAddActivity}>Registrar</Button>
                                 </Box>
                              </Stack>
                           </Paper>

                           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              Histórico ({totalHours}h Total)
                           </Typography>
                           
                           <List dense>
                              {taskActivities.map((activity) => {
                                 const user = mockPeople.find(p => p.id === activity.userId);
                                 return (
                                    <React.Fragment key={activity.id}>
                                       <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                          <ListItemIcon sx={{ minWidth: 40 }}>
                                             <Avatar src={user?.avatar} sx={{ width: 24, height: 24 }} />
                                          </ListItemIcon>
                                          <ListItemText 
                                             primary={<Typography variant="body2" fontWeight="bold">{activity.description}</Typography>}
                                             secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                   {new Date(activity.date).toLocaleDateString()} • {user?.name}
                                                </Typography>
                                             }
                                          />
                                          <Typography variant="body2" fontWeight="bold">{activity.hours}h</Typography>
                                       </ListItem>
                                       <Divider component="li" />
                                    </React.Fragment>
                                 );
                              })}
                              {taskActivities.length === 0 && <Typography variant="caption" color="text.secondary">Nenhum lançamento.</Typography>}
                           </List>
                        </Box>
                      )}

                      {/* TAB 3: RETROSPECTIVES */}
                      {taskDetailTab === 3 && (
                        <Box>
                           <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Retrospectivas onde esta atividade foi mencionada ou vinculada.
                           </Typography>
                           <Stack spacing={2} mt={2}>
                              {retrospectives.filter(r => r.associatedTaskIds?.includes(currentTask.id)).map(retro => (
                                 <Paper key={retro.id} variant="outlined" sx={{ p: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                       <Box>
                                          <Typography variant="subtitle2" fontWeight="bold">{retro.title}</Typography>
                                          <Typography variant="caption" color="text.secondary">
                                             {new Date(retro.date).toLocaleDateString()} • {retro.status}
                                          </Typography>
                                       </Box>
                                       <Button size="small" variant="outlined" onClick={() => { /* Navigate to retro logic could go here */ }}>Ver</Button>
                                    </Stack>
                                 </Paper>
                              ))}
                              {retrospectives.filter(r => r.associatedTaskIds?.includes(currentTask.id)).length === 0 && (
                                 <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary">Nenhuma retrospectiva vinculada.</Typography>
                                 </Box>
                              )}
                           </Stack>
                        </Box>
                      )}

                      {/* TAB 4: PLANNING POKER (TASK MODAL) */}
                      {taskDetailTab === 4 && (
                        <Box textAlign="center" py={2}>
                           <Typography variant="h6" gutterBottom>Vote nesta Tarefa</Typography>
                           <Typography variant="body2" color="text.secondary" mb={4}>
                             Selecione uma carta que representa o esforço necessário.
                           </Typography>

                           {/* Cards */}
                           <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2} mb={4}>
                              {POKER_CARDS.map(card => {
                                 const isSelected = taskFormData.pokerVotes?.['1'] === card; // '1' is current user
                                 return (
                                   <Paper 
                                     key={card}
                                     onClick={() => handleTaskPopupPokerVote(card)}
                                     elevation={isSelected ? 4 : 1}
                                     sx={{ 
                                       width: 60, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                       borderRadius: 2, cursor: 'pointer',
                                       bgcolor: isSelected ? 'primary.main' : 'white',
                                       color: isSelected ? 'white' : 'text.primary',
                                       border: isSelected ? '2px solid transparent' : '1px solid #e2e8f0',
                                       transition: 'all 0.2s',
                                       '&:hover': { transform: 'translateY(-4px)' }
                                     }}
                                   >
                                      <Typography variant="h5" fontWeight="bold">{card}</Typography>
                                   </Paper>
                                 );
                              })}
                           </Stack>

                           <Divider sx={{ mb: 4 }} />

                           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="subtitle1" fontWeight="bold">Votos da Equipe</Typography>
                              <Button variant="outlined" size="small" onClick={() => setPokerRevealed(!pokerRevealed)} disabled={pokerRevealed}>Revelar Cartas</Button>
                           </Stack>

                           <Grid container spacing={2}>
                              {mockPeople.map(person => {
                                 const hasVoted = taskFormData.pokerVotes?.[person.id] !== undefined;
                                 const vote = taskFormData.pokerVotes?.[person.id];
                                 return (
                                   <Grid item xs={6} sm={3} key={person.id}>
                                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: hasVoted ? '#f0fdf4' : '#fff' }}>
                                         <Avatar src={person.avatar} sx={{ width: 32, height: 32, mx: 'auto', mb: 1 }} />
                                         <Typography variant="caption" display="block" noWrap>{person.name.split(' ')[0]}</Typography>
                                         <Box sx={{ mt: 1, minHeight: 24 }}>
                                            {hasVoted ? (
                                               pokerRevealed ? <Typography fontWeight="bold">{vote}</Typography> : <CheckCircle2 size={16} color="#16a34a" style={{ margin: '0 auto' }} />
                                            ) : (
                                               <Typography variant="caption" color="text.secondary">...</Typography>
                                            )}
                                         </Box>
                                      </Paper>
                                   </Grid>
                                 );
                              })}
                           </Grid>
                        </Box>
                      )}

                      {/* TAB 5: PINS (NEW) */}
                      {taskDetailTab === 5 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Reconhecimentos vinculados a esta atividade.</Typography>
                                <Button size="small" startIcon={<Award size={16} />} onClick={() => handleOpenPinDialog(currentTask)}>Novo Pin</Button>
                            </Box>
                            <Stack spacing={2}>
                                {pins.filter(p => p.linkedTaskId === currentTask.id).map(pin => {
                                    const sender = mockPeople.find(p => p.id === pin.senderId);
                                    return (
                                        <Card key={pin.id} variant="outlined">
                                            <CardContent sx={{ p: 2 }}>
                                                <Stack direction="row" spacing={2}>
                                                    <Avatar src={sender?.avatar} />
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">De: {sender?.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{new Date(pin.date).toLocaleDateString()}</Typography>
                                                        <Chip label={pin.category} size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />
                                                        <Typography variant="body2" mt={1}>{pin.message}</Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                {pins.filter(p => p.linkedTaskId === currentTask.id).length === 0 && (
                                    <Typography align="center" color="text.secondary" py={4}>Nenhum pin dedicado nesta atividade.</Typography>
                                )}
                            </Stack>
                        </Box>
                      )}

                    </Box>
                 </Grid>

                 {/* Right Column: Metadata */}
                 <Grid item xs={12} md={4} sx={{ p: 3, bgcolor: '#f8fafc', overflowY: 'auto' }}>
                    <Stack spacing={3}>
                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>STATUS</Typography>
                          <Select fullWidth size="small" value={currentTask.status} sx={{ mt: 0.5, bgcolor: 'white' }}>
                             <MenuItem value="Não iniciado">Não iniciado</MenuItem>
                             <MenuItem value="Em andamento">Em andamento</MenuItem>
                             <MenuItem value="Concluído">Concluído</MenuItem>
                             <MenuItem value="Atrasado">Atrasado</MenuItem>
                          </Select>
                       </Box>

                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">RESPONSÁVEL</Typography>
                          <Select 
                            fullWidth 
                            size="small" 
                            value={currentTask.assigneeId || ''} 
                            sx={{ mt: 0.5, bgcolor: 'white' }}
                            displayEmpty
                            renderValue={(selected) => {
                               const p = mockPeople.find(per => per.id === selected);
                               return p ? <Stack direction="row" spacing={1} alignItems="center"><Avatar src={p.avatar} sx={{ width: 24, height: 24 }} /><Typography variant="body2">{p.name}</Typography></Stack> : 'Não atribuído';
                            }}
                          >
                             {mockPeople.map(p => (
                               <MenuItem key={p.id} value={p.id}>
                                 <Stack direction="row" spacing={1} alignItems="center"><Avatar src={p.avatar} sx={{ width: 24, height: 24 }} /><Typography variant="body2">{p.name}</Typography></Stack>
                               </MenuItem>
                             ))}
                          </Select>
                       </Box>

                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">PRIORIDADE</Typography>
                          <Select fullWidth size="small" value={currentTask.priority} sx={{ mt: 0.5, bgcolor: 'white' }}>
                             <MenuItem value="Baixa">Baixa</MenuItem>
                             <MenuItem value="Média">Média</MenuItem>
                             <MenuItem value="Alta">Alta</MenuItem>
                             <MenuItem value="Urgente">Urgente</MenuItem>
                          </Select>
                       </Box>

                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">DATA DE ENTREGA</Typography>
                          <TextField type="date" fullWidth size="small" value={currentTask.dueDate || ''} sx={{ mt: 0.5, bgcolor: 'white' }} />
                       </Box>

                       {/* Goals Link */}
                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">VINCULAR A META</Typography>
                          <Select 
                            fullWidth 
                            size="small" 
                            value={taskFormData.goalId || ''} 
                            onChange={(e) => setTaskFormData({...taskFormData, goalId: e.target.value})}
                            displayEmpty
                            sx={{ mt: 0.5, bgcolor: 'white' }}
                          >
                             <MenuItem value=""><em>Nenhuma meta</em></MenuItem>
                             {goals.map(g => (
                               <MenuItem key={g.id} value={g.id}>
                                 <Stack direction="row" alignItems="center" spacing={1}>
                                    <Target size={14} color={g.status === 'Concluído' ? '#22c55e' : '#64748b'} />
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{g.title}</Typography>
                                 </Stack>
                               </MenuItem>
                             ))}
                          </Select>
                       </Box>

                       <Box>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">ESTIMATIVA (HORAS)</Typography>
                          <TextField type="number" fullWidth size="small" value={taskFormData.estimatedTime || ''} sx={{ mt: 0.5, bgcolor: 'white' }} InputProps={{ endAdornment: <InputAdornment position="end">h</InputAdornment> }} />
                       </Box>
                    </Stack>
                 </Grid>
               </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => setTaskDetailOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={handleSaveTaskDetail} disableElevation>Salvar Alterações</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Conditional Formatting Modal */}
      <Dialog open={conditionalModalOpen} onClose={() => setConditionalModalOpen(false)}>
        <DialogTitle>Formatação Condicional</DialogTitle>
        <DialogContent dividers>
           <Stack spacing={2}>
              {tempRules.map((rule, idx) => (
                <Stack key={rule.id} direction="row" spacing={1} alignItems="center">
                   <Typography variant="caption">Se</Typography>
                   <Select size="small" value={rule.field} onChange={(e) => updateRule(rule.id, { field: e.target.value as any })}>
                      <MenuItem value="status">Status</MenuItem>
                      <MenuItem value="priority">Prioridade</MenuItem>
                      <MenuItem value="assigneeId">Responsável</MenuItem>
                   </Select>
                   <Select size="small" value={rule.operator} onChange={(e) => updateRule(rule.id, { operator: e.target.value as any })}>
                      <MenuItem value="equals">É igual a</MenuItem>
                      <MenuItem value="not_equals">Não é igual a</MenuItem>
                      <MenuItem value="contains">Contém</MenuItem>
                   </Select>
                   <TextField size="small" placeholder="Valor" value={rule.value} onChange={(e) => updateRule(rule.id, { value: e.target.value })} />
                   <Typography variant="caption">então cor</Typography>
                   <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {AVAILABLE_COLORS.map(c => (
                        <Box 
                          key={c} 
                          onClick={() => updateRule(rule.id, { color: c })}
                          sx={{ 
                            width: 20, height: 20, bgcolor: c, borderRadius: '50%', cursor: 'pointer',
                            border: rule.color === c ? '2px solid #333' : '1px solid #ccc' 
                          }} 
                        />
                      ))}
                   </Box>
                   <IconButton size="small" color="error" onClick={() => removeRule(rule.id)}><Trash2 size={14} /></IconButton>
                </Stack>
              ))}
              <Button startIcon={<Plus size={16} />} onClick={addRule}>Adicionar Regra</Button>
           </Stack>
        </DialogContent>
        <DialogActions>
           <Button onClick={() => setConditionalModalOpen(false)}>Cancelar</Button>
           <Button variant="contained" onClick={handleSaveConditionalRules}>Aplicar</Button>
        </DialogActions>
      </Dialog>

      {/* Risk Modal */}
      <Dialog open={riskModalOpen} onClose={() => setRiskModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRisk.id ? 'Editar Risco' : 'Novo Risco'}</DialogTitle>
        <DialogContent dividers>
            <Stack spacing={2}>
                <TextField fullWidth multiline rows={2} label="Descrição do Risco" value={editingRisk.description || ''} onChange={(e) => setEditingRisk({...editingRisk, description: e.target.value})} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputLabel>Probabilidade</InputLabel>
                        <Select fullWidth size="small" value={editingRisk.probability || 'Média'} onChange={(e) => setEditingRisk({...editingRisk, probability: e.target.value as any})}>
                            <MenuItem value="Baixa">Baixa</MenuItem>
                            <MenuItem value="Média">Média</MenuItem>
                            <MenuItem value="Alta">Alta</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Impacto</InputLabel>
                        <Select fullWidth size="small" value={editingRisk.impact || 'Médio'} onChange={(e) => setEditingRisk({...editingRisk, impact: e.target.value as any})}>
                            <MenuItem value="Baixo">Baixo</MenuItem>
                            <MenuItem value="Médio">Médio</MenuItem>
                            <MenuItem value="Alto">Alto</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <TextField fullWidth multiline rows={3} label="Plano de Mitigação" value={editingRisk.mitigationPlan || ''} onChange={(e) => setEditingRisk({...editingRisk, mitigationPlan: e.target.value})} />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setRiskModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveRisk}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Change Request Modal */}
      <Dialog open={changeModalOpen} onClose={() => setChangeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Solicitar Mudança</DialogTitle>
        <DialogContent dividers>
            <Stack spacing={2}>
                <TextField fullWidth label="Título" value={newChange.title || ''} onChange={(e) => setNewChange({...newChange, title: e.target.value})} />
                <TextField fullWidth multiline rows={3} label="Descrição Detalhada" value={newChange.description || ''} onChange={(e) => setNewChange({...newChange, description: e.target.value})} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Impacto Custo (R$)" value={newChange.impactCost || ''} onChange={(e) => setNewChange({...newChange, impactCost: Number(e.target.value)})} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth type="number" label="Impacto Tempo (Dias)" value={newChange.impactTime || ''} onChange={(e) => setNewChange({...newChange, impactTime: Number(e.target.value)})} />
                    </Grid>
                </Grid>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setChangeModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveChange}>Enviar Solicitação</Button>
        </DialogActions>
      </Dialog>

      {/* Allocation Modal */}
      <Dialog open={allocationModalOpen} onClose={() => setAllocationModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Alterar Alocação</DialogTitle>
        <DialogContent>
            <Stack spacing={2} mt={1}>
                <Typography variant="body2">Defina a nova carga horária semanal para este membro.</Typography>
                <TextField 
                    type="number" 
                    label="Horas Semanais" 
                    fullWidth 
                    value={editingMember?.allocation || 0} 
                    onChange={(e) => setEditingMember(prev => prev ? {...prev, allocation: Number(e.target.value)} : null)}
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setAllocationModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleUpdateAllocation}>Atualizar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={showToast} autoHideDuration={3000} onClose={() => setShowToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setShowToast(false)}>{toastMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

function IconSpade({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 9c0-1.5 1.5-3 3-3s3 1.5 4 3c1-1.5 2.5-3 4-3s3 1.5 3 3-1.5 5-5 7v3h-4v-3c-3.5-2-5-5.5-5-7z" />
    </svg>
  );
}

export default ProjectDetail;
