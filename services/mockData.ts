
import { Company, CompanyStatus, Project, Person, Activity, Contract, Holiday, Task, Retrospective, ProjectFile, LessonLearned, ProjectMeeting, ProjectEmail, ProjectRisk, ProjectChange, BudgetEntry, Pin } from '../types';

// Helper to get current dates
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const nextMonth = String(today.getMonth() + 2).padStart(2, '0'); // Simplification, might wrap year in real app

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Feeling Digital',
    legalName: 'Feeling Digital Gestão de Royalties LTDA',
    segment: 'Serviços de Gestão',
    status: CompanyStatus.ACTIVE,
    logo: 'https://picsum.photos/id/1/200/200',
    cnpj: '00.000.000/0000-00',
    fantasyName: 'Feeling Digital',
    city: 'Fortaleza',
    state: 'Ceará'
  },
  {
    id: '2',
    name: 'Arco Educação SA',
    legalName: 'Arco Educação Sistemas de Ensino SA',
    segment: 'Educação',
    status: CompanyStatus.INACTIVE,
    logo: 'https://picsum.photos/id/2/200/200',
    cnpj: '11.111.111/0001-11',
    fantasyName: 'Arco Educação',
    city: 'São Paulo',
    state: 'São Paulo'
  },
  {
    id: '3',
    name: 'Tech Solutions',
    legalName: 'Tech Solutions Brasil LTDA',
    segment: 'Tecnologia',
    status: CompanyStatus.ARCHIVED,
    logo: 'https://picsum.photos/id/3/200/200',
    cnpj: '22.222.222/0001-22',
    fantasyName: 'TechSol',
    city: 'Curitiba',
    state: 'Paraná'
  },
  {
    id: '4',
    name: 'Green Energy Corp',
    legalName: 'Green Energy Sustainable Power SA',
    segment: 'Energia',
    status: CompanyStatus.ACTIVE,
    logo: 'https://picsum.photos/id/4/200/200',
    cnpj: '33.333.333/0001-33',
    fantasyName: 'Green Energy',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro'
  },
  {
    id: '5',
    name: 'Construct Base',
    legalName: 'Construct Base Engenharia LTDA',
    segment: 'Construção',
    status: CompanyStatus.ACTIVE,
    logo: 'https://picsum.photos/id/5/200/200',
    cnpj: '44.444.444/0001-44',
    fantasyName: 'Base Engenharia',
    city: 'Belo Horizonte',
    state: 'Minas Gerais'
  }
];

export const mockPeople: Person[] = [
  { id: '1', name: 'Ana Silva', role: 'Gerente de Projetos', email: 'ana.silva@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=1', allocation: 100, productivity: 95, hourlyRate: 150, workModel: 'Híbrido' },
  { id: '2', name: 'Carlos Oliveira', role: 'Desenvolvedor Senior', email: 'carlos.o@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=2', allocation: 80, productivity: 88, hourlyRate: 120, workModel: 'Remoto' },
  { id: '3', name: 'Mariana Costa', role: 'UX Designer', email: 'mari.costa@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=3', allocation: 50, productivity: 92, hourlyRate: 100, workModel: 'Híbrido' },
  { id: '4', name: 'Roberto Santos', role: 'Analista de QA', email: 'roberto.s@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=4', allocation: 100, productivity: 75, hourlyRate: 90, workModel: 'Presencial' },
];

export const mockProjects: Project[] = [
  { 
    id: '1', 
    name: 'Implantação ERP', 
    companyName: 'Feeling Digital', 
    status: 'Em Andamento', 
    progress: 65, 
    weeklyAllocation: 20, 
    startDate: '2023-01-15', 
    endDate: '2023-12-20',
    managerId: '1',
    icon: 'Briefcase',
    color: '#0060B1',
    team: [
      { personId: '1', role: 'Gerente', allocationHours: 10, workModel: 'Híbrido', hourlyRate: 150, requiresApproval: false },
      { personId: '2', role: 'Tech Lead', allocationHours: 20, workModel: 'Remoto', hourlyRate: 120, requiresApproval: true, approverId: '1' },
      { personId: '3', role: 'Designer', allocationHours: 10, workModel: 'Híbrido', hourlyRate: 100, requiresApproval: false }
    ],
    monitoring: {
      missingEstimates: true,
      deviationLogging: true,
      offHoursLogging: true,
      retroactiveFutureLogging: false
    },
    communicationPlan: [
      { id: 'cp1', audience: 'Steering Committee', channel: 'Reunião Presencial', frequency: 'Mensal', responsibleId: '1', objective: 'Reporte de Status e Riscos' },
      { id: 'cp2', audience: 'Time do Projeto', channel: 'Slack / Daily', frequency: 'Diário', responsibleId: '2', objective: 'Alinhamento tático' }
    ]
  },
  { 
    id: '2', 
    name: 'Migração Cloud', 
    companyName: 'Arco Educação', 
    status: 'Pausado', 
    progress: 30, 
    weeklyAllocation: 10, 
    startDate: '2023-06-01', 
    endDate: '2024-02-28',
    managerId: '1',
    icon: 'Cloud',
    color: '#9333ea',
    team: [],
    monitoring: {
      missingEstimates: false,
      deviationLogging: true,
      offHoursLogging: false,
      retroactiveFutureLogging: true
    }
  },
  { 
    id: '3', 
    name: 'App Mobile V2', 
    companyName: 'Tech Solutions', 
    status: 'Concluído', 
    progress: 100, 
    weeklyAllocation: 0, 
    startDate: '2022-11-01', 
    endDate: '2023-05-30',
    managerId: '1',
    icon: 'Smartphone',
    color: '#16a34a',
    team: [],
    monitoring: {
      missingEstimates: false,
      deviationLogging: false,
      offHoursLogging: false,
      retroactiveFutureLogging: false
    }
  },
];

export const mockActivities: Activity[] = [
  { id: '1', date: '2023-10-23', project: 'Implantação ERP', taskId: '101', description: 'Reunião de alinhamento com stakeholders', hours: 2, status: 'Aprovado', userId: '1' },
  { id: '2', date: '2023-10-23', project: 'Implantação ERP', taskId: '103', description: 'Desenvolvimento do módulo financeiro', hours: 6, status: 'Pendente', userId: '2' },
  { id: '3', date: '2023-10-24', project: 'Migração Cloud', description: 'Configuração de ambiente AWS', hours: 8, status: 'Pendente', userId: '2' },
  { id: '4', date: '2023-10-24', project: 'Implantação ERP', taskId: '102', description: 'Ajustes no layout', hours: 4, status: 'Aprovado', userId: '3' },
];

export const mockContracts: Contract[] = [
  { 
    id: '1', 
    number: 'CTR-2023-001', 
    companyId: '1',
    companyName: 'Feeling Digital', 
    value: 150000, 
    startDate: '2023-01-01', 
    endDate: '2024-01-01', 
    status: 'Ativo',
    hours: 1000,
    segment: 'Software',
    serviceType: 'Consultoria',
    projectId: '1', // Linked to 'Implantação ERP'
    files: ['contrato_assinado.pdf']
  },
  { 
    id: '2', 
    number: 'CTR-2022-099', 
    companyId: '3',
    companyName: 'Tech Solutions', 
    value: 50000, 
    startDate: '2022-06-01', 
    endDate: '2023-06-01', 
    status: 'Vencido',
    hours: 500,
    segment: 'Mobile',
    serviceType: 'Desenvolvimento',
    projectId: '3' // Linked to 'App Mobile V2'
  },
  {
    id: '3',
    number: 'CTR-2023-002-ADT',
    companyId: '1',
    companyName: 'Feeling Digital',
    value: 20000,
    startDate: '2023-06-01',
    endDate: '2024-01-01',
    status: 'Ativo',
    hours: 200,
    segment: 'Software',
    serviceType: 'Suporte',
    parentContractId: '1', // Addendum to CTR-2023-001
    projectId: '1',
    files: ['aditivo_01.pdf']
  },
  {
    id: '4',
    number: 'CTR-2023-NEW',
    companyId: '2',
    companyName: 'Arco Educação',
    value: 80000,
    startDate: '2023-11-01',
    endDate: '2024-11-01',
    status: 'Ativo',
    hours: 600,
    segment: 'Infraestrutura',
    serviceType: 'Cloud',
    // Missing Project ID! Should trigger warning
  }
];

export const mockHolidays: Holiday[] = [
  { 
    id: '1', 
    date: `${currentYear}-${currentMonth}-25`, 
    name: 'Reunião Mensal', 
    category: 'Feriado', 
    type: 'Nacional', 
    scope: 'Global' 
  },
  { 
    id: '2', 
    date: `${currentYear}-${currentMonth}-20`, 
    name: 'Consciência Negra', 
    category: 'Feriado', 
    type: 'Municipal', 
    scope: 'Empresa', 
    associatedName: 'Feeling Digital' 
  },
  { 
    id: '3', 
    date: `${currentYear}-${currentMonth}-15`, 
    endDate: `${currentYear}-${currentMonth}-30`, 
    name: 'Férias Carlos', 
    category: 'Férias', 
    scope: 'Pessoa', 
    associatedName: 'Carlos Oliveira' 
  },
  { 
    id: '4', 
    date: `${currentYear}-${currentMonth}-10`, 
    name: 'Dayoff Pós-Entrega', 
    category: 'Dayoff', 
    scope: 'Projeto', 
    associatedName: 'Implantação ERP' 
  },
  { 
    id: '5', 
    date: `${currentYear}-${currentMonth}-02`, 
    name: 'Feriado Local', 
    category: 'Feriado', 
    type: 'Nacional', 
    scope: 'Global' 
  },
  { 
    id: '6', 
    date: `${currentYear}-${nextMonth}-01`, 
    name: 'Planejamento Trimestral', 
    category: 'Dayoff', 
    scope: 'Global' 
  },
];

export const mockTasks: Task[] = [
  // Implantação ERP (ID: 1)
  { 
    id: '101', 
    projectId: '1', 
    title: 'Relatar status mensal', 
    bucket: 'To Do', 
    status: 'Concluído', 
    priority: 'Média', 
    dueDate: '2025-09-08', 
    assigneeId: '1',
    watched: true,
    attachments: [
        { id: 'att1', name: 'Relatorio_Julho.pdf', url: '#', type: 'PDF', size: '2MB' }
    ],
    comments: [
      { id: 'c1', userId: '2', text: 'Já enviei o draft por email.', date: '2025-09-01T10:00:00' }
    ],
    history: [
      { id: 'h1', action: 'Tarefa criada', date: '2025-08-01T09:00:00', user: 'Ana Silva', type: 'creation' },
      { id: 'h2', action: 'Status alterado', date: '2025-08-15T14:30:00', user: 'Ana Silva', details: 'Não iniciado -> Em andamento', type: 'status' },
      { id: 'h3', action: 'Conclusão', date: '2025-09-05T10:00:00', user: 'Ana Silva', details: 'Tarefa marcada como concluída', type: 'status' }
    ]
  },
  { 
    id: '102', 
    projectId: '1', 
    title: 'Relatório de BI do preenchimento', 
    bucket: 'Concluído', 
    status: 'Concluído', 
    priority: 'Alta', 
    startDate: '2025-05-02', 
    dueDate: '2025-05-16', 
    assigneeId: '3',
    history: [
      { id: 'h1', action: 'Tarefa criada', date: '2025-05-01T10:00:00', user: 'Roberto Santos', type: 'creation' },
    ]
  },
  { 
    id: '103', 
    projectId: '1', 
    title: 'Automação de Descrições e Classificações', 
    bucket: 'Desenvolvimento', 
    status: 'Não iniciado', 
    priority: 'Alta', 
    startDate: '2025-06-30', 
    dueDate: '2025-08-15', 
    assigneeId: '2',
    pokerVotes: { '1': 8, '3': 5 },
    watched: false,
    history: [
      { id: 'h1', action: 'Tarefa criada', date: '2025-06-20T11:00:00', user: 'Ana Silva', type: 'creation' },
      { id: 'h2', action: 'Responsável alterado', date: '2025-06-25T16:00:00', user: 'Ana Silva', details: 'Ana Silva -> Carlos Oliveira', type: 'assignment' },
      { id: 'h3', action: 'Prazo alterado', date: '2025-07-01T09:00:00', user: 'Carlos Oliveira', details: '01/08/2025 -> 15/08/2025', type: 'date' }
    ]
  },
  
  // Subtasks for 103
  { id: '103-1', projectId: '1', parentId: '103', title: 'Mapear tabelas do sistema', bucket: 'Desenvolvimento', status: 'Concluído', priority: 'Alta', dueDate: '2025-07-10', assigneeId: '2' },
  { id: '103-2', projectId: '1', parentId: '103', title: 'Criar script de automação', bucket: 'Desenvolvimento', status: 'Em andamento', priority: 'Alta', dueDate: '2025-07-25', assigneeId: '2' },
  { id: '103-3', projectId: '1', parentId: '103', title: 'Testar com dados de homologação', bucket: 'Validação', status: 'Não iniciado', priority: 'Média', dueDate: '2025-08-01', assigneeId: '4' },

  { id: '104', projectId: '1', title: 'Integração com I.A', bucket: 'Concluído', status: 'Concluído', priority: 'Alta', startDate: '2025-05-02', dueDate: '2025-05-30', assigneeId: '4' },
  { id: '105', projectId: '1', title: 'Ajustes do BI - 01', bucket: 'Concluído', status: 'Concluído', priority: 'Média', startDate: '2025-05-02', dueDate: '2025-05-16', assigneeId: '3' },
  { 
    id: '106', 
    projectId: '1', 
    title: 'Formalizar pedido de ajuste nomenclatura', 
    bucket: 'To Do', 
    status: 'Atrasado', 
    priority: 'Urgente', 
    dueDate: '2025-07-04', 
    assigneeId: '1',
    history: [
      { id: 'h1', action: 'Tarefa criada', date: '2025-06-01T10:00:00', user: 'Ana Silva', type: 'creation' },
      { id: 'h2', action: 'Prioridade alterada', date: '2025-07-05T08:00:00', user: 'Sistema', details: 'Alta -> Urgente (Atraso detectado)', type: 'priority' }
    ]
  },
  { id: '107', projectId: '1', title: 'Validação por Amostragem', bucket: 'Validação', status: 'Em andamento', priority: 'Alta', startDate: '2025-08-22', assigneeId: '2' },
  { id: '108', projectId: '1', title: 'Rótulos de Confidencialidade', bucket: 'To Do', status: 'Não iniciado', priority: 'Média', dueDate: '2025-06-06', assigneeId: '4' },
  
  // Subtask for 108
  { id: '108-1', projectId: '1', parentId: '108', title: 'Definir taxonomia de dados', bucket: 'To Do', status: 'Não iniciado', priority: 'Média', assigneeId: '4' },

  { id: '109', projectId: '1', title: 'Terminado as descrições', bucket: 'Concluído', status: 'Concluído', priority: 'Baixa', startDate: '2025-05-09', dueDate: '2025-05-09', assigneeId: '2' },
  { id: '110', projectId: '1', title: 'Atualização automática do Painel', bucket: 'Desenvolvimento', status: 'Em andamento', priority: 'Média', assigneeId: '3' },
];

export const mockRetrospectives: Retrospective[] = [
  {
    id: 'r1',
    projectId: '1',
    title: 'Retrospectiva Sprint 31',
    date: '2023-05-31',
    status: 'Concluído',
    items: [
      { id: '1', columnId: 'liked', text: 'Entregas no prazo', votes: 5, authorId: '1' },
      { id: '2', columnId: 'lacked', text: 'Documentação da API', votes: 3, authorId: '2' }
    ],
    actions: [
      { id: 'a1', text: 'Atualizar Swagger', done: true, assigneeId: '2' }
    ],
    associatedTaskIds: ['101', '102']
  },
  {
    id: 'r2',
    projectId: '1',
    title: 'Retrospectiva Sprint 32',
    date: '2023-06-15',
    status: 'Em Andamento',
    items: [
      { id: '1', columnId: 'liked', text: 'Comunicação do time fluiu bem', votes: 2, authorId: '1' },
      { id: '2', columnId: 'learned', text: 'Nova biblioteca de gráficos', votes: 1, authorId: '2' }
    ],
    actions: [],
    associatedTaskIds: ['103', '104']
  }
];

// --- Additional Mock Data for Project Management Features ---

export const mockProjectFiles: ProjectFile[] = [
  { id: 'f1', projectId: '1', name: 'Especificação_Funcional_v2.pdf', url: '#', type: 'PDF', size: '3.5MB', uploadDate: '2023-02-10', uploaderId: '1' },
  { id: 'f2', projectId: '1', name: 'Logo_Cliente.png', url: '#', type: 'Image', size: '500KB', uploadDate: '2023-01-15', uploaderId: '3' },
  { id: 'f3', projectId: '1', name: 'Cronograma_Geral.xlsx', url: '#', type: 'Spreadsheet', size: '1.2MB', uploadDate: '2023-01-20', uploaderId: '1' },
];

// Expanded Mock Lessons Learned to support Import feature testing
export const mockLessonsLearned: LessonLearned[] = [
  { id: 'l1', projectId: '1', category: 'Processo', description: 'Aprovação do cliente demorou mais que o esperado devido à hierarquia.', impact: 'Negativo', actionTaken: 'Revisar matriz de stakeholders no início.', date: '2023-03-10', status: 'Aprovado' },
  { id: 'l2', projectId: '1', category: 'Técnica', description: 'Uso da nova biblioteca de gráficos acelerou o desenvolvimento.', impact: 'Positivo', date: '2023-04-05', status: 'Aprovado' },
  { id: 'l3', projectId: '2', category: 'Técnica', description: 'Não subestimar a complexidade de migração de dados legados.', impact: 'Negativo', date: '2023-08-15', status: 'Aprovado' },
  { id: 'l4', projectId: '2', category: 'Negócio', description: 'Treinamento antecipado dos usuários chave reduziu chamados de suporte.', impact: 'Positivo', date: '2023-09-01', status: 'Aprovado' },
  { id: 'l5', projectId: '3', category: 'Processo', description: 'Daily meetings com cliente externo geraram microgerenciamento.', impact: 'Negativo', actionTaken: 'Mudar para report semanal.', date: '2022-12-10', status: 'Aprovado' },
];

export const mockProjectMeetings: ProjectMeeting[] = [
  { id: 'm1', projectId: '1', title: 'Kickoff do Projeto', date: '2023-01-15T10:00:00', type: 'Ad-hoc', participants: ['1', '2', '3'] },
  { id: 'm2', projectId: '1', title: 'Daily Sprint 32', date: '2023-06-10T09:00:00', type: 'Daily', participants: ['1', '2'] },
];

export const mockProjectEmails: ProjectEmail[] = [
  { id: 'e1', projectId: '1', subject: 'Aprovação do Escopo', from: 'cliente@feeling.com', to: 'ana.silva@managerpro.com', date: '2023-01-20', snippet: 'Conforme conversamos, o escopo está aprovado...' },
  { id: 'e2', projectId: '1', subject: 'Dúvida sobre layout', from: 'ana.silva@managerpro.com', to: 'cliente@feeling.com', date: '2023-02-05', snippet: 'Poderiam validar a cor do botão principal?' },
];

export const mockProjectRisks: ProjectRisk[] = [
  { id: 'r1', projectId: '1', description: 'Indisponibilidade da API de terceiros', probability: 'Média', impact: 'Alto', status: 'Aberto', mitigationPlan: 'Criar mock da API para desenvolvimento' },
  { id: 'r2', projectId: '1', description: 'Saída de membro chave da equipe', probability: 'Baixa', impact: 'Alto', status: 'Mitigado', mitigationPlan: 'Documentação rigorosa e pair programming' },
];

export const mockProjectChanges: ProjectChange[] = [
  { id: 'ch1', projectId: '1', title: 'Inclusão de módulo de relatórios avançados', description: 'Cliente solicitou exportação em PDF e Excel customizável.', requester: 'Cliente', date: '2023-05-10', status: 'Aprovado', impactCost: 5000, impactTime: 10 },
  { id: 'ch2', projectId: '1', title: 'Alteração na tecnologia de banco de dados', description: 'Mudança de SQL para NoSQL.', requester: 'Tech Lead', date: '2023-02-01', status: 'Rejeitado', impactCost: 0, impactTime: 0 },
];

export const mockBudgetEntries: BudgetEntry[] = [
  { id: 'b1', projectId: '1', category: 'Pessoal', description: 'Desenvolvimento Backend', estimated: 80000, actual: 45000, date: '2023-01-01' },
  { id: 'b2', projectId: '1', category: 'Licenças', description: 'AWS Hosting', estimated: 5000, actual: 1200, date: '2023-01-01' },
  { id: 'b3', projectId: '1', category: 'Viagens', description: 'Visita ao cliente', estimated: 2000, actual: 0, date: '2023-01-01' },
];

export const mockPins: Pin[] = [
  { id: 'p1', senderId: '2', receiverId: '1', category: 'Collaboration', message: 'Obrigado pelo apoio na reunião de hoje!', date: '2023-10-25T14:30:00', likes: 5, comments: 2, status: 'Aprovado' },
  { id: 'p2', senderId: '3', receiverId: '2', category: 'Knowledge', message: 'Ótima explicação sobre a arquitetura do novo módulo.', date: '2023-10-24T10:00:00', likes: 8, comments: 1, status: 'Aprovado', linkedTaskId: '103' },
  { id: 'p3', senderId: '1', receiverId: '3', category: 'Innovation', message: 'A solução de UX para o painel ficou incrível!', date: '2023-10-23T16:45:00', likes: 12, comments: 4, status: 'Aprovado' },
  { id: 'p4', senderId: '1', receiverId: '2', category: 'Extraordinary', message: 'Entrega antecipada e com zero bugs. Parabéns!', date: '2023-10-22T09:15:00', likes: 20, comments: 6, status: 'Aprovado', verifiedClient: true },
  { id: 'p5', senderId: '2', receiverId: '4', category: 'Collaboration', message: 'Valeu pela ajuda nos testes!', date: '2023-10-26T11:20:00', likes: 3, comments: 0, status: 'Pendente' },
];
