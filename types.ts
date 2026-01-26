
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

export interface Project {
  id: string;
  name: string;
  companyName: string;
  status: 'Em Andamento' | 'Concluído' | 'Pausado';
  progress: number;
  startDate: string;
  endDate: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  allocation: number; // Percentage
}

export interface Activity {
  id: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
}

export interface Contract {
  id: string;
  number: string;
  companyName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'Ativo' | 'Vencido' | 'Renovação';
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

export type NavItem = 'dashboard' | 'approvals' | 'activities' | 'people' | 'companies' | 'projects' | 'contracts' | 'holidays';