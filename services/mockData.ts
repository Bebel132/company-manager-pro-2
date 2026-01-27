
import { Company, CompanyStatus, Project, Person, Activity, Contract, Holiday, Task, Retrospective } from '../types';

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

export const mockProjects: Project[] = [
  { id: '1', name: 'Implantação ERP', companyName: 'Feeling Digital', status: 'Em Andamento', progress: 65, startDate: '2023-01-15', endDate: '2023-12-20' },
  { id: '2', name: 'Migração Cloud', companyName: 'Arco Educação', status: 'Pausado', progress: 30, startDate: '2023-06-01', endDate: '2024-02-28' },
  { id: '3', name: 'App Mobile V2', companyName: 'Tech Solutions', status: 'Concluído', progress: 100, startDate: '2022-11-01', endDate: '2023-05-30' },
];

export const mockPeople: Person[] = [
  { id: '1', name: 'Ana Silva', role: 'Gerente de Projetos', email: 'ana.silva@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=1', allocation: 100 },
  { id: '2', name: 'Carlos Oliveira', role: 'Desenvolvedor Senior', email: 'carlos.o@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=2', allocation: 80 },
  { id: '3', name: 'Mariana Costa', role: 'UX Designer', email: 'mari.costa@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=3', allocation: 50 },
  { id: '4', name: 'Roberto Santos', role: 'Analista de QA', email: 'roberto.s@managerpro.com', avatar: 'https://i.pravatar.cc/150?u=4', allocation: 100 },
];

export const mockActivities: Activity[] = [
  { id: '1', date: '2023-10-23', project: 'Implantação ERP', description: 'Reunião de alinhamento com stakeholders', hours: 2, status: 'Aprovado' },
  { id: '2', date: '2023-10-23', project: 'Implantação ERP', description: 'Desenvolvimento do módulo financeiro', hours: 6, status: 'Pendente' },
  { id: '3', date: '2023-10-24', project: 'Migração Cloud', description: 'Configuração de ambiente AWS', hours: 8, status: 'Pendente' },
];

export const mockContracts: Contract[] = [
  { id: '1', number: 'CTR-2023-001', companyName: 'Feeling Digital', value: 150000, startDate: '2023-01-01', endDate: '2024-01-01', status: 'Ativo' },
  { id: '2', number: 'CTR-2022-099', companyName: 'Tech Solutions', value: 50000, startDate: '2022-06-01', endDate: '2023-06-01', status: 'Vencido' },
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
    ]
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
    actions: []
  }
];