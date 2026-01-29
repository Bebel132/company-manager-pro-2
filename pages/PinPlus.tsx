
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  Trophy, 
  Lightbulb, 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Send,
  Filter,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stack, 
  Avatar, 
  TextField, 
  InputAdornment, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Tabs, 
  Tab, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip
} from '@mui/material';
import { mockPins, mockPeople, mockTasks } from '../services/mockData';
import { Pin, PinCategory, Person } from '../types';

const CATEGORY_CONFIG: Record<PinCategory, { label: string, color: string, icon: React.ReactNode, bg: string }> = {
  'Collaboration': { label: 'Colaboração', color: '#0ea5e9', bg: '#e0f2fe', icon: <Users size={20} /> },
  'Knowledge': { label: 'Conhecimento', color: '#eab308', bg: '#fef9c3', icon: <GraduationCap size={20} /> },
  'Extraordinary': { label: 'Entrega Extraordinária', color: '#ec4899', bg: '#fce7f3', icon: <Trophy size={20} /> },
  'Innovation': { label: 'Inovação', color: '#a855f7', bg: '#f3e8ff', icon: <Lightbulb size={20} /> },
};

const PinCard: React.FC<{ pin: Pin, showSender?: boolean }> = ({ pin, showSender = true }) => {
  const sender = mockPeople.find(p => p.id === pin.senderId);
  const receiver = mockPeople.find(p => p.id === pin.receiverId);
  const config = CATEGORY_CONFIG[pin.category];

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: '#e2e8f0' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Header / Avatars */}
          <Stack direction="row" alignItems="center" spacing={1} flex={1}>
            {showSender && <Avatar src={sender?.avatar} sx={{ width: 40, height: 40, border: '2px solid white', boxShadow: 1 }} />}
            {showSender && <ArrowRight size={16} color="#94a3b8" />}
            <Avatar src={receiver?.avatar} sx={{ width: showSender ? 40 : 48, height: showSender ? 40 : 48, border: '2px solid white', boxShadow: 1 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {showSender ? `${sender?.name} para ${receiver?.name}` : `Recebido de ${sender?.name}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(pin.date).toLocaleDateString('pt-BR')} • {new Date(pin.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
              </Typography>
            </Box>
          </Stack>
          
          {/* Category Icon */}
          <Tooltip title={config.label}>
            <Box sx={{ 
              bgcolor: config.bg, color: config.color, 
              p: 1, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              {config.icon}
            </Box>
          </Tooltip>
        </Stack>

        {/* Content */}
        <Box sx={{ mt: 2, mb: 2, pl: showSender ? 7 : 0 }}>
          {pin.linkedTaskId && (
              <Chip 
                  label={`Atividade: ${mockTasks.find(t => t.id === pin.linkedTaskId)?.title || 'Tarefa'}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mb: 1, fontSize: '0.7rem' }} 
              />
          )}
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {pin.message}
          </Typography>
        </Box>

        {/* Footer / Actions */}
        <Stack direction="row" spacing={2} sx={{ pl: showSender ? 7 : 0 }}>
          <Button size="small" startIcon={<ThumbsUp size={16} />} sx={{ color: 'text.secondary', minWidth: 'auto' }}>
            {pin.likes || 'Curtir'}
          </Button>
          <Button size="small" startIcon={<MessageCircle size={16} />} sx={{ color: 'text.secondary', minWidth: 'auto' }}>
            Comentar
          </Button>
          {pin.verifiedClient && (
             <Chip label="Reconhecimento de Cliente" size="small" color="info" variant="outlined" icon={<CheckCircle2 size={12}/>} sx={{ height: 20, fontSize: '0.65rem' }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const PinPlus: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Feed, 1: Received, 2: Sent
  const [pins, setPins] = useState<Pin[]>(mockPins);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newPin, setNewPin] = useState<Partial<Pin>>({
    receiverId: '',
    category: 'Collaboration',
    message: ''
  });

  const currentUser = mockPeople.find(p => p.id === '1')!; // Ana Silva

  // --- DERIVED DATA ---
  const feedPins = useMemo(() => {
    return pins.filter(p => p.status === 'Aprovado').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [pins]);

  const receivedPins = useMemo(() => {
    return pins.filter(p => p.receiverId === currentUser.id && p.status === 'Aprovado').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [pins, currentUser.id]);

  const sentPins = useMemo(() => {
    return pins.filter(p => p.senderId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [pins, currentUser.id]);

  const topPerformers = useMemo(() => {
    const counts: Record<string, number> = {};
    pins.filter(p => p.status === 'Aprovado').forEach(p => {
      counts[p.receiverId] = (counts[p.receiverId] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ person: mockPeople.find(p => p.id === id), count }));
  }, [pins]);

  // --- ACTIONS ---
  const handleOpenModal = () => {
    setNewPin({ receiverId: '', category: 'Collaboration', message: '' });
    setIsModalOpen(true);
  };

  const handleSendPin = () => {
    if (!newPin.receiverId || !newPin.message) return;
    const pin: Pin = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: newPin.receiverId!,
      category: newPin.category!,
      message: newPin.message!,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      status: 'Pendente' // Default to pending
    };
    setPins([pin, ...pins]);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      
      {/* Banner Area */}
      <Paper 
        sx={{ 
          p: 3, mb: 3, borderRadius: 3, 
          background: 'linear-gradient(135deg, #0060B1 0%, #0ea5e9 100%)', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">Pin+ Reconhecimento</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {activeTab === 1 ? 'Celebre suas conquistas e feedbacks!' : 'Valorize quem faz a diferença no dia a dia.'}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: '#f1f5f9' } }}
          startIcon={<Award />}
          onClick={handleOpenModal}
        >
          Dedique um Pin!
        </Button>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Feed Geral" />
          <Tab label="Meus Pins Recebidos" />
          <Tab label="Gestão (Enviados)" />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Grid container spacing={4} sx={{ flex: 1, overflow: 'hidden' }}>
        
        {/* Left/Center Content */}
        <Grid item xs={12} md={activeTab === 2 ? 12 : 8} sx={{ height: '100%', overflowY: 'auto' }}>
          
          {/* Filters */}
          <Stack direction="row" spacing={2} mb={3}>
            <TextField 
              size="small" 
              placeholder="Buscar por @usuario ou #tema..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16}/></InputAdornment> }}
              sx={{ bgcolor: 'white', borderRadius: 1, flex: 1 }}
            />
            {activeTab === 1 && (
               <Select size="small" defaultValue="all" sx={{ bgcolor: 'white', minWidth: 120 }}>
                  <MenuItem value="all">Todo o período</MenuItem>
                  <MenuItem value="month">Este Mês</MenuItem>
                  <MenuItem value="year">Este Ano</MenuItem>
               </Select>
            )}
          </Stack>

          {/* TAB 0: FEED */}
          {activeTab === 0 && (
            <Box>
              {feedPins.map(pin => <PinCard key={pin.id} pin={pin} />)}
            </Box>
          )}

          {/* TAB 1: RECEIVED */}
          {activeTab === 1 && (
            <Box>
               {receivedPins.length > 0 ? (
                 receivedPins.map(pin => <PinCard key={pin.id} pin={pin} showSender={true} />)
               ) : (
                 <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">Você ainda não recebeu nenhum Pin. Continue fazendo um bom trabalho!</Typography>
                 </Paper>
               )}
            </Box>
          )}

          {/* TAB 2: SENT (MANAGEMENT) */}
          {activeTab === 2 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Para</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Mensagem</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentPins.map(pin => {
                    const receiver = mockPeople.find(p => p.id === pin.receiverId);
                    const config = CATEGORY_CONFIG[pin.category];
                    return (
                      <TableRow key={pin.id}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={receiver?.avatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2">{receiver?.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                           <Chip 
                             icon={config.icon as any} 
                             label={config.label} 
                             size="small" 
                             sx={{ bgcolor: config.bg, color: config.color, fontWeight: 'bold' }} 
                           />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" noWrap>{pin.message}</Typography>
                        </TableCell>
                        <TableCell>{new Date(pin.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                           <Chip 
                             label={pin.status} 
                             size="small" 
                             color={pin.status === 'Aprovado' ? 'success' : pin.status === 'Recusado' ? 'error' : 'warning'} 
                             variant="outlined"
                           />
                        </TableCell>
                        <TableCell align="right">
                           <IconButton size="small"><Clock size={16} /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        </Grid>

        {/* Right Sidebar (Ranking) - Only for Feed and Received Tabs */}
        {activeTab !== 2 && (
          <Grid item xs={12} md={4} sx={{ height: '100%', overflowY: 'auto' }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Ranking de Destaques</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>Baseado em Pins aprovados este mês</Typography>
              
              <Stack spacing={2}>
                {topPerformers.map((item, idx) => (
                  <Stack key={item.person?.id} direction="row" alignItems="center" spacing={2} sx={{ p: 1, borderRadius: 2, '&:hover': { bgcolor: '#f8fafc' } }}>
                    <Typography variant="h6" color="text.secondary" sx={{ width: 24, textAlign: 'center' }}>{idx + 1}</Typography>
                    <Avatar src={item.person?.avatar} />
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="bold">{item.person?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.count} pins recebidos</Typography>
                    </Box>
                    {idx === 0 && <Trophy size={20} color="#eab308" />}
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mt: 3, bgcolor: '#fdf2f8', borderColor: '#fce7f3' }}>
               <Stack direction="row" spacing={1} alignItems="center" color="#db2777">
                  <AlertTriangle size={20} />
                  <Typography variant="subtitle2" fontWeight="bold">Dica da Semana</Typography>
               </Stack>
               <Typography variant="body2" mt={1}>
                 Reconheça pequenas atitudes! Um "obrigado" pode transformar o dia de alguém. Use a categoria <strong>Colaboração</strong>.
               </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Creation Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dedicar um Novo Pin</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <InputLabel>Quem você quer reconhecer?</InputLabel>
              <Select 
                fullWidth 
                size="small" 
                value={newPin.receiverId} 
                onChange={(e) => setNewPin({...newPin, receiverId: e.target.value})}
                displayEmpty
              >
                <MenuItem value="" disabled>Selecione um colega...</MenuItem>
                {mockPeople.filter(p => p.id !== currentUser.id).map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={p.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography>{p.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Qual a competência?</InputLabel>
              <Grid container spacing={1}>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <Grid item xs={6} key={key}>
                    <Paper 
                      variant="outlined"
                      onClick={() => setNewPin({...newPin, category: key as PinCategory})}
                      sx={{ 
                        p: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1,
                        borderColor: newPin.category === key ? config.color : 'divider',
                        bgcolor: newPin.category === key ? config.bg : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box sx={{ color: config.color }}>{config.icon}</Box>
                      <Typography variant="caption" fontWeight="bold">{config.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <TextField 
              label="Mensagem"
              multiline
              rows={3}
              fullWidth
              placeholder="Descreva o motivo do reconhecimento..."
              value={newPin.message}
              onChange={(e) => setNewPin({...newPin, message: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSendPin} disabled={!newPin.receiverId || !newPin.message}>Enviar Pin</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PinPlus;
