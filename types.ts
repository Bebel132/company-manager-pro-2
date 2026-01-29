
export enum CompanyStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  ARCHIVED = 'Arquivado'
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  segment: string;
  status: CompanyStatus;
  logo: string; // URL or placeholder color
  cnpj: string;
  fantasyName: string;
  city: string;
  state: string;
}

// --- Project Configuration Types ---

export interface ProjectCustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  required: boolean;
  options?: string[]; // Comma separated for select
}

export interface ProjectMember {
  personId: string;
  role: string; // Override default role
  allocationHours: number; // Weekly allocation
  workModel: 'Híbrido' | 'Remoto' | 'Presencial';
  hourlyRate: number;
  requiresApproval: boolean;
  approverId?: string; // ID of the person who approves
}

export interface ProjectMonitoringRules {
  missingEstimates: boolean; // Ausência de registro estimado
  deviationLogging: boolean; // Menos/Mais horas que o previsto
  offHoursLogging: boolean; // Fora do horário padrão (madrugada/fds)
  retroactiveFutureLogging: boolean; // Lançamentos retroativos/futuros
}

export interface ClientContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface CommunicationPlanItem {
  id: string;
  audience: string;
  channel: string;
  frequency: string;
  responsibleId: string;
  objective: string;
}

export interface Project {
  id: string;
  name: string;
  companyName: string;
  managerId?: string; // New: Gestor
  icon?: string; // New: Friendly Icon Name
  color?: string; // New: Icon Background Color
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Planejamento';
  progress: number;
  weeklyAllocation: number; 
  startDate: string;
  endDate: string;
  
  // Detailed Configuration
  customFields?: ProjectCustomField[];
  team?: ProjectMember[];
  monitoring?: ProjectMonitoringRules;
  clientContacts?: ClientContact[];
  communicationPlan?: CommunicationPlanItem[];
}

export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  allocation: number; // Percentage
  productivity: number; // Percentage 0-100
  hourlyRate?: number; // Base rate
  workModel?: 'Híbrido' | 'Remoto' | 'Presencial'; // Default work model
}

export interface Activity {
  id: string;
  date: string;
  project: string;
  taskId?: string; // Linked specific task
  description: string;
  hours: number;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  userId?: string; // Who logged it
}

export interface Contract {
  id: string;
  number: string;
  companyId: string; // Link to Company
  companyName: string; // Denormalized for display ease, or lookup
  value: number;
  startDate: string;
  endDate: string;
  status: 'Ativo' | 'Vencido' | 'Renovação';
  
  // New detailed fields
  files?: string[];
  hours?: number; // Carga horária
  segment?: string;
  serviceType?: string;
  
  // Logic fields
  parentContractId?: string; // If present, this is an addendum (Aditivo)
  projectId?: string; // If missing, UI needs to flag warning
}

export type AbsenceCategory = 'Feriado' | 'Dayoff' | 'Férias' | 'Afastamento';

export interface Holiday {
  id: string;
  date: string;
  endDate?: string; // For ranges like Vacations
  name: string;
  category: AbsenceCategory;
  type?: 'Nacional' | 'Estadual' | 'Municipal' | 'Licença Médica' | 'Licença Maternidade' | 'Outros'; 
  scope: 'Global' | 'Empresa' | 'Projeto' | 'Pessoa';
  associatedName?: string; // Name of the specific entity if not global
}

export type TaskStatus = 'Não iniciado' | 'Em andamento' | 'Concluído' | 'Atrasado';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface TaskHistory {
  id: string;
  action: string;
  date: string;
  user: string;
  details?: string;
  type: 'creation' | 'status' | 'assignment' | 'date' | 'priority' | 'comment';
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export type RelationType = 
  | 'Predecessor' 
  | 'Successor' 
  | 'Related' 
  | 'Duplicate' 
  | 'Blocks' 
  | 'Blocked By' 
  | 'Tests' 
  | 'Tested By';

export interface TaskRelation {
  id: string;
  type: RelationType;
  targetTaskId: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  text: string; // Can contain HTML for rich text
  date: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  bucket: 'To Do' | 'Desenvolvimento' | 'Validação' | 'Concluído' | 'Backlog';
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  parentId?: string; // ID of the parent task
  history?: TaskHistory[];
  watched?: boolean; // User notification setting
  checklist?: {id: string, text: string, done: boolean}[]; // Added for checklist logic
  
  // New Fields
  goalId?: string; // Linked to a Project Goal
  attachments?: TaskAttachment[];
  relations?: TaskRelation[];
  comments?: TaskComment[];
  pokerVotes?: Record<string, number | string>; // userId -> vote
}

export type NavItem = 'dashboard' | 'approvals' | 'activities' | 'people' | 'companies' | 'projects' | 'contracts' | 'holidays' | 'pinplus';

// --- Retrospective Types ---
export type RetroColumnType = 'liked' | 'learned' | 'lacked' | 'longed';

export interface RetroItem {
  id: string;
  columnId: RetroColumnType;
  text: string;
  votes: number;
  authorId?: string;
}

export interface RetroAction {
  id: string;
  text: string;
  done: boolean;
  assigneeId?: string;
}

export interface Retrospective {
  id: string;
  projectId: string;
  title: string;
  date: string;
  status: 'Em Andamento' | 'Concluído';
  items: RetroItem[];
  actions: RetroAction[];
  associatedTaskIds?: string[]; // Tasks discussed in this retro
}

// --- New Project Management Types ---

export interface ProjectGoal {
  id: string;
  title: string;
  status: 'Pendente' | 'Concluído';
  dueDate: string;
  associatedTaskIds?: string[];
}

export interface ProjectFile {
  id: string;
  projectId: string;
  taskId?: string; // Linked to task?
  name: string;
  url: string;
  type: 'PDF' | 'Image' | 'Document' | 'Spreadsheet' | 'Other';
  size: string;
  uploadDate: string;
  uploaderId: string;
}

export interface LessonLearned {
  id: string;
  projectId: string;
  category: 'Técnica' | 'Processo' | 'Pessoas' | 'Negócio';
  description: string;
  impact: 'Positivo' | 'Negativo';
  actionTaken?: string;
  date: string;
  status?: 'Pendente' | 'Aprovado' | 'Rejeitado'; // Added status
  sourceProjectId?: string; // If imported from another project
}

export interface ProjectMeeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  type: 'Daily' | 'Weekly' | 'Review' | 'Planning' | 'Ad-hoc';
  participants: string[]; // Names or IDs
  notesUrl?: string;
}

export interface ProjectEmail {
  id: string;
  projectId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
}

export interface ProjectRisk {
  id: string;
  projectId: string;
  description: string;
  probability: 'Baixa' | 'Média' | 'Alta';
  impact: 'Baixo' | 'Médio' | 'Alto';
  status: 'Aberto' | 'Mitigado' | 'Ocorrido';
  ownerId?: string;
  mitigationPlan: string;
}

export interface ProjectChange {
  id: string;
  projectId: string;
  title: string;
  description: string;
  requester: string;
  date: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  impactCost: number;
  impactTime: number; // Days
}

export interface BudgetEntry {
  id: string;
  projectId: string;
  category: 'Pessoal' | 'Licenças' | 'Infraestrutura' | 'Viagens' | 'Outros';
  description: string;
  estimated: number;
  actual: number;
  date: string;
}

// --- Pin+ Module Types ---

export type PinCategory = 'Collaboration' | 'Knowledge' | 'Extraordinary' | 'Innovation';

export interface Pin {
  id: string;
  senderId: string;
  receiverId: string;
  category: PinCategory;
  message: string;
  date: string;
  likes: number;
  comments: number;
  status?: 'Pendente' | 'Aprovado' | 'Recusado';
  linkedTaskId?: string; // Linked to a project task
  verifiedClient?: boolean; // Selo Marista etc
}
