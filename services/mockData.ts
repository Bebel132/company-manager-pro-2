import { Company, CompanyStatus, Project, Person, Activity, Contract, Holiday } from '../types';

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