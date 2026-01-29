import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Globe2, 
  Building2, 
  Plus, 
  LayoutList, 
  Calendar as CalendarIcon, 
  User, 
  Briefcase,
  Plane,
  Stethoscope,
  Coffee,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileText, 
  X,
  MoreVertical
} from 'lucide-react';
import { mockHolidays, mockCompanies, mockProjects, mockPeople } from '../services/mockData';
import ConfirmationModal from '../components/ConfirmationModal';
import PageHeader, { ViewMode } from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import { Holiday, AbsenceCategory } from '../types';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  TextField, 
  Select, 
  MenuItem, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Stack,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';

const HolidayManager: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date()); 

  // Form State
  const [formData, setFormData] = useState<Partial<Holiday>>({
    name: '',
    date: '',
    endDate: '',
    category: 'Feriado',
    type: 'Nacional',
    scope: 'Global',
    associatedName: ''
  });

  // Constants
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const yearsRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Derived Data
  const filteredHolidays = useMemo(() => {
    return holidays.filter(h => {
      const matchCategory = filterCategory !== 'all' ? h.category === filterCategory : true;
      const matchScope = filterScope !== 'all' ? h.scope === filterScope : true;
      
      let matchDate = true;
      if (filterStartDate) {
        matchDate = matchDate && h.date >= filterStartDate;
      }
      if (filterEndDate) {
        matchDate = matchDate && h.date <= filterEndDate;
      }

      return matchCategory && matchScope && matchDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [holidays, filterCategory, filterScope, filterStartDate, filterEndDate]);

  // Calendar Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  
  const calendarDays = useMemo(() => {
    const days = [];
    // Padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate, daysInMonth, firstDayOfMonth]);

  const getEventsForDay = (date: Date) => {
    return filteredHolidays.filter(h => {
      const hStart = new Date(h.date);
      const hEnd = h.endDate ? new Date(h.endDate) : hStart;
      hStart.setHours(0,0,0,0);
      hEnd.setHours(0,0,0,0);
      const current = new Date(date);
      current.setHours(0,0,0,0);
      
      return current >= hStart && current <= hEnd;
    });
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      endDate: '',
      category: 'Feriado',
      type: 'Nacional',
      scope: 'Global',
      associatedName: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingId(holiday.id);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      endDate: holiday.endDate || '',
      category: holiday.category,
      type: holiday.type,
      scope: holiday.scope,
      associatedName: holiday.associatedName || ''
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setHolidayToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (holidayToDelete) {
      setHolidays(prev => prev.filter(h => h.id !== holidayToDelete));
      setHolidayToDelete(null);
    }
  };

  const handleExport = (format: 'PDF' | 'EXCEL', item?: Holiday) => {
    const target = item ? `"${item.name}"` : 'a lista atual';
    alert(`Exportando ${target} para ${format}... (Funcionalidade Mock)`);
  };

  const handleSave = () => {
    if (!formData.name || !formData.date) return;
    
    if (editingId) {
      setHolidays(prev => prev.map(h => {
        if (h.id === editingId) {
          return {
            ...h,
            name: formData.name!,
            date: formData.date!,
            endDate: formData.endDate || undefined,
            category: formData.category as AbsenceCategory,
            type: ['Feriado', 'Afastamento'].includes(formData.category || '') ? formData.type as any : undefined,
            scope: formData.scope as any,
            associatedName: formData.scope !== 'Global' ? formData.associatedName : undefined
          };
        }
        return h;
      }));
    } else {
      const newHoliday: Holiday = {
        id: Date.now().toString(),
        name: formData.name!,
        date: formData.date!,
        endDate: formData.endDate || undefined,
        category: formData.category as AbsenceCategory,
        type: ['Feriado', 'Afastamento'].includes(formData.category || '') ? formData.type as any : undefined,
        scope: formData.scope as any,
        associatedName: formData.scope !== 'Global' ? formData.associatedName : undefined
      };
      setHolidays([...holidays, newHoliday]);
    }
    
    setIsModalOpen(false);
  };

  const getCategoryIcon = (category: AbsenceCategory) => {
    switch(category) {
      case 'Feriado': return <CalendarDays size={16} />;
      case 'Férias': return <Plane size={16} />;
      case 'Afastamento': return <Stethoscope size={16} />;
      case 'Dayoff': return <Coffee size={16} />;
      default: return <CalendarDays size={16} />;
    }
  };

  const getCategoryStyles = (category: AbsenceCategory) => {
    switch(category) {
      case 'Feriado': 
        return { bgcolor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }; // Red
      case 'Férias': 
        return { bgcolor: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }; // Green
      case 'Afastamento': 
        return { bgcolor: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa' }; // Orange
      case 'Dayoff': 
        return { bgcolor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }; // Blue
      default: 
        return { bgcolor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }; // Gray
    }
  };

  const getScopeIcon = (scope: string) => {
    switch(scope) {
      case 'Global': return <Globe2 size={14} color="#a855f7" />;
      case 'Pessoa': return <User size={14} color="#22c55e" />;
      case 'Projeto': return <Briefcase size={14} color="#f97316" />;
      default: return <Building2 size={14} color="#3b82f6" />;
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <PageHeader 
        title="Gestão de Ausências"
        subtitle="Feriados, férias, dayoffs e afastamentos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAdd={handleOpenModal}
        addButtonLabel="Adicionar"
        onExportPdf={() => handleExport('PDF')}
        onExportExcel={() => handleExport('EXCEL')}
        availableViews={['list', 'grid', 'calendar']}
      />

      <FilterBar
        showClear={filterCategory !== 'all' || filterScope !== 'all' || !!filterStartDate || !!filterEndDate}
        onClear={() => { 
          setFilterCategory('all'); 
          setFilterScope('all'); 
          setFilterStartDate(''); 
          setFilterEndDate(''); 
        }}
      >
        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Período De</InputLabel>
           <TextField type="date" size="small" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Box>

        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Até</InputLabel>
           <TextField type="date" size="small" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Box>

        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Categoria</InputLabel>
           <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} size="small" sx={{ minWidth: 140 }}>
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="Feriado">Feriados</MenuItem>
            <MenuItem value="Férias">Férias</MenuItem>
            <MenuItem value="Dayoff">Dayoffs</MenuItem>
            <MenuItem value="Afastamento">Afastamentos</MenuItem>
           </Select>
        </Box>

        <Box>
           <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>Abrangência</InputLabel>
           <Select value={filterScope} onChange={(e) => setFilterScope(e.target.value)} size="small" sx={{ minWidth: 140 }}>
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="Global">Global</MenuItem>
            <MenuItem value="Empresa">Por Empresa</MenuItem>
            <MenuItem value="Projeto">Por Projeto</MenuItem>
            <MenuItem value="Pessoa">Por Pessoa</MenuItem>
           </Select>
        </Box>
      </FilterBar>

      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {viewMode === 'calendar' ? <CalendarIcon size={20} color="#0060B1" /> : <LayoutList size={20} color="#0060B1" />}
            {viewMode === 'list' ? 'Lista de Registros' : viewMode === 'grid' ? 'Visualização em Blocos' : 'Visão Mensal'}
          </Typography>
          
          {viewMode === 'calendar' && (
            <Stack direction="row" spacing={1}>
              <Select value={currentDate.getMonth()} onChange={(e) => handleMonthSelect(Number(e.target.value))} size="small" sx={{ bgcolor: 'white' }}>
                {monthNames.map((month, index) => <MenuItem key={month} value={index}>{month}</MenuItem>)}
              </Select>
              <Select value={currentDate.getFullYear()} onChange={(e) => handleYearSelect(Number(e.target.value))} size="small" sx={{ bgcolor: 'white' }}>
                {yearsRange.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}
              </Select>
              <Button variant="outlined" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
            </Stack>
          )}
        </Box>

        {viewMode === 'list' && (
          <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
             <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Data</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Evento</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Categoria</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Abrangência</TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHolidays.map((holiday) => (
                  <TableRow key={holiday.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{new Date(holiday.date).toLocaleDateString('pt-BR')}</Typography>
                        {holiday.endDate && <Typography variant="caption" color="text.secondary">até {new Date(holiday.endDate).toLocaleDateString('pt-BR')}</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>
                       <Chip 
                         icon={getCategoryIcon(holiday.category)}
                         label={holiday.category}
                         size="small"
                         variant="outlined"
                         sx={{ 
                           fontWeight: 600, 
                           '& .MuiChip-icon': { ml: 1, color: 'inherit' },
                           ...getCategoryStyles(holiday.category)
                         }}
                       />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                           {getScopeIcon(holiday.scope)}
                           <Typography variant="body2">{holiday.scope}</Typography>
                        </Stack>
                        {holiday.associatedName && <Typography variant="caption" color="text.secondary" sx={{ pl: 2.5 }}>{holiday.associatedName}</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                       <Stack direction="row" justifyContent="flex-end">
                         <IconButton size="small" onClick={() => handleExport('PDF', holiday)}><FileText size={16} /></IconButton>
                         <IconButton size="small" onClick={() => handleExport('EXCEL', holiday)}><FileSpreadsheet size={16} /></IconButton>
                         <IconButton size="small" onClick={() => handleEdit(holiday)}><Pencil size={16} /></IconButton>
                         <IconButton size="small" color="error" onClick={() => confirmDelete(holiday.id)}><Trash2 size={16} /></IconButton>
                       </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHolidays.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                       <Typography color="text.secondary">Nenhum registro encontrado.</Typography>
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {viewMode === 'grid' && (
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
             <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12 }}>
               {filteredHolidays.map((holiday) => (
                 <Grid size={{ xs: 4, sm: 4, md: 4, lg: 3, xl: 3 }} key={holiday.id}>
                   <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative', '&:hover': { boxShadow: 2 } }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <IconButton size="small"><MoreVertical size={18} /></IconButton>
                      </Box>
                      
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                           <Avatar variant="rounded" sx={{ bgcolor: '#eff6ff', color: 'primary.main', border: '1px solid #bfdbfe', width: 32, height: 32 }}>
                              {getCategoryIcon(holiday.category)}
                           </Avatar>
                           <Box overflow="hidden">
                             <Typography variant="subtitle2" fontWeight="bold" noWrap title={holiday.name}>{holiday.name}</Typography>
                             <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                               {getScopeIcon(holiday.scope)}
                               <Typography variant="caption" noWrap>{holiday.scope}</Typography>
                             </Stack>
                           </Box>
                        </Stack>
                        
                        <Box sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: 1.5, mb: 1.5, border: '1px solid #e2e8f0' }}>
                           <Stack spacing={0.5}>
                             <Box>
                               <Typography variant="caption" fontWeight="bold" color="text.secondary">Início</Typography>
                               <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{new Date(holiday.date).toLocaleDateString('pt-BR')}</Typography>
                             </Box>
                             {holiday.endDate && (
                               <Box>
                                 <Typography variant="caption" fontWeight="bold" color="text.secondary">Fim</Typography>
                                 <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{new Date(holiday.endDate).toLocaleDateString('pt-BR')}</Typography>
                               </Box>
                             )}
                           </Stack>
                        </Box>
                        
                        {holiday.associatedName && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }} noWrap>
                            {holiday.associatedName}
                          </Typography>
                        )}

                        <Box sx={{ pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                             icon={getCategoryIcon(holiday.category)}
                             label={holiday.category}
                             size="small"
                             variant="outlined"
                             sx={{ 
                               fontWeight: 'bold', 
                               height: 20, 
                               fontSize: '0.65rem',
                               ...getCategoryStyles(holiday.category)
                             }}
                           />
                          <Stack direction="row">
                             <IconButton size="small" onClick={() => handleEdit(holiday)}><Pencil size={14} /></IconButton>
                             <IconButton size="small" color="error" onClick={() => confirmDelete(holiday.id)}><Trash2 size={14} /></IconButton>
                          </Stack>
                        </Box>
                      </CardContent>
                   </Card>
                 </Grid>
               ))}
             </Grid>
             {filteredHolidays.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Nenhum registro encontrado.</Typography>
                </Box>
             )}
          </Box>
        )}

        {viewMode === 'calendar' && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
               {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                 <Box key={day} sx={{ py: 1, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                   {day}
                 </Box>
               ))}
            </Box>
            <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', bgcolor: '#f1f5f9', gap: '1px' }}>
               {calendarDays.map((date, idx) => {
                 if (!date) return <Box key={`empty-${idx}`} sx={{ bgcolor: 'white', minHeight: 100 }} />;
                 
                 const events = getEventsForDay(date);
                 const isToday = new Date().toDateString() === date.toDateString();

                 return (
                   <Box 
                     key={date.toISOString()} 
                     sx={{ 
                       bgcolor: isToday ? '#eff6ff' : 'white', 
                       p: 1, 
                       minHeight: 100, 
                       display: 'flex', 
                       flexDirection: 'column',
                       '&:hover': { bgcolor: '#f8fafc' },
                       position: 'relative'
                     }}
                   >
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Box sx={{ 
                          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                          bgcolor: isToday ? 'primary.main' : 'transparent',
                          color: isToday ? 'white' : 'text.primary',
                          fontSize: '0.875rem', fontWeight: 500
                        }}>
                          {date.getDate()}
                        </Box>
                        <IconButton 
                          size="small" 
                          sx={{ p: 0.5 }}
                          onClick={() => {
                             setFormData({ ...formData, date: date.toISOString().split('T')[0] });
                             setIsModalOpen(true);
                          }}
                        >
                          <Plus size={14} />
                        </IconButton>
                      </Stack>
                      
                      <Stack spacing={0.5} sx={{ overflowY: 'auto', maxHeight: 80 }}>
                        {events.map(ev => (
                          <Chip 
                            key={ev.id}
                            label={ev.name}
                            size="small"
                            variant="outlined"
                            onClick={() => handleEdit(ev)}
                            icon={getCategoryIcon(ev.category)}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem', 
                              justifyContent: 'flex-start', 
                              cursor: 'pointer', 
                              '& .MuiChip-label': { px: 1 },
                              ...getCategoryStyles(ev.category)
                            }}
                          />
                        ))}
                      </Stack>
                   </Box>
                 );
               })}
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingId ? 'Editar Ausência' : 'Nova Ausência'}
          <IconButton onClick={() => setIsModalOpen(false)} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
             <TextField 
                label="Título" 
                fullWidth 
                placeholder="Ex: Férias João, Natal..." 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
             />
             
             <Box>
                <InputLabel sx={{ mb: 1 }}>Categoria</InputLabel>
                <Stack direction="row" spacing={1}>
                   {['Feriado', 'Dayoff', 'Férias', 'Afastamento'].map((cat) => (
                     <Chip 
                       key={cat}
                       label={cat}
                       onClick={() => setFormData({...formData, category: cat as AbsenceCategory})}
                       color={formData.category === cat ? 'primary' : 'default'}
                       variant={formData.category === cat ? 'filled' : 'outlined'}
                     />
                   ))}
                </Stack>
             </Box>

             <Stack direction="row" spacing={2}>
               <TextField 
                 type="date" 
                 label="Data Início" 
                 fullWidth 
                 value={formData.date} 
                 onChange={e => setFormData({...formData, date: e.target.value})} 
                 InputLabelProps={{ shrink: true }} 
               />
               <TextField 
                 type="date" 
                 label="Data Fim (Opcional)" 
                 fullWidth 
                 value={formData.endDate} 
                 onChange={e => setFormData({...formData, endDate: e.target.value})} 
                 InputLabelProps={{ shrink: true }} 
                 disabled={formData.category === 'Feriado'}
               />
             </Stack>

             {(formData.category === 'Feriado' || formData.category === 'Afastamento') && (
                <TextField 
                  select 
                  label={formData.category === 'Feriado' ? 'Tipo de Feriado' : 'Tipo de Afastamento'}
                  fullWidth
                  value={formData.type || ''}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  {formData.category === 'Feriado' ? 
                     ['Nacional', 'Estadual', 'Municipal'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>) : 
                     ['Licença Médica', 'Licença Maternidade', 'Outros'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)
                  }
                </TextField>
             )}

             <TextField 
                select 
                label="Abrangência" 
                fullWidth 
                value={formData.scope} 
                onChange={e => setFormData({...formData, scope: e.target.value as any, associatedName: ''})}
             >
                <MenuItem value="Global">Global (Todos)</MenuItem>
                <MenuItem value="Empresa">Por Empresa</MenuItem>
                <MenuItem value="Projeto">Por Projeto</MenuItem>
                <MenuItem value="Pessoa">Por Pessoa</MenuItem>
             </TextField>

             {formData.scope !== 'Global' && (
                <TextField 
                  select 
                  label={formData.scope === 'Empresa' ? 'Selecione a Empresa' : formData.scope === 'Projeto' ? 'Selecione o Projeto' : 'Selecione a Pessoa'}
                  fullWidth
                  value={formData.associatedName || ''}
                  onChange={e => setFormData({...formData, associatedName: e.target.value})}
                >
                   {formData.scope === 'Empresa' && mockCompanies.map(c => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
                   {formData.scope === 'Pessoa' && mockPeople.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
                   {formData.scope === 'Projeto' && mockProjects.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
                </TextField>
             )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disableElevation>Salvar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Registro"
        description="Tem certeza que deseja excluir esta ausência? Esta ação não pode ser desfeita."
      />
    </Box>
  );
};

export default HolidayManager;