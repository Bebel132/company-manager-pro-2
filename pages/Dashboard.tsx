import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  CalendarDays, 
  TrendingUp, 
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Stack, 
  Avatar, 
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  keyframes
} from '@mui/material';
import { mockActivities, mockProjects, mockHolidays } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

// Animation Keyframes
const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Stats data
  const stats = [
    { label: 'Aprovações Pendentes', value: '3', icon: CheckCircle2, color: '#eab308', bg: '#fefce8' }, // Yellow
    { label: 'Horas Este Mês', value: '126h', icon: Clock, color: '#0060B1', bg: '#eff6ff' }, // Blue
    { label: 'Eficiência', value: '94%', icon: TrendingUp, color: '#9333ea', bg: '#f3e8ff' }, // Purple
    { label: 'Próximo Feriado', value: '25/12', icon: CalendarDays, color: '#16a34a', bg: '#f0fdf4' }, // Green
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1600, mx: 'auto' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Olá, João Silva <span style={{ fontSize: '1.2em' }}>👋</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aqui está o resumo das suas atividades e pendências de hoje.
        </Typography>
      </Box>

      {/* Main Grid Container for Everything */}
      <Grid container spacing={3}>
        
        {/* Stats Row */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 } }}>
                <Box 
                  sx={{ 
                    bgcolor: stat.bg, 
                    color: stat.color, 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2,
                    // Icon Animation
                    animation: `${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                    animationDelay: `${index * 0.15}s`,
                    opacity: 0, // Start hidden for animation
                    transformOrigin: 'center'
                  }}
                >
                  <stat.icon size={28} strokeWidth={2} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Main Content Column (Left) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {/* Active Projects */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Meus Projetos Ativos</Typography>
                <Button 
                  size="small" 
                  endIcon={<ArrowRight size={16} />} 
                  onClick={() => navigate('/projects')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Ver Todos
                </Button>
              </Stack>
              <Grid container spacing={2}>
                {mockProjects.slice(0, 3).map((project) => (
                  <Grid size={{ xs: 12, md: 4 }} key={project.id}>
                    <Card variant="outlined" sx={{ 
                      borderRadius: 2, 
                      height: '100%',
                      border: '1px solid #f1f5f9',
                      '&:hover': { borderColor: 'primary.main', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
                      transition: 'all 0.2s'
                    }}>
                      <CardContent>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                          <Avatar variant="rounded" sx={{ bgcolor: '#f0f9ff', color: 'primary.main', width: 40, height: 40 }}>
                            <Briefcase size={20} />
                          </Avatar>
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>{project.name}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">{project.companyName}</Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                          <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" fontWeight="medium" color="text.secondary">Progresso</Typography>
                            <Typography variant="caption" fontWeight="bold">{project.progress}%</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={project.progress} 
                            sx={{ 
                              borderRadius: 2, 
                              height: 6, 
                              bgcolor: '#f1f5f9',
                              '& .MuiLinearProgress-bar': { borderRadius: 2 }
                            }} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Activities */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Atividades Recentes</Typography>
                <Button 
                  size="small" 
                  endIcon={<ArrowRight size={16} />} 
                  onClick={() => navigate('/activities')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Ver Registro
                </Button>
              </Stack>
              <List disablePadding>
                {mockActivities.slice(0, 3).map((activity, idx) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 56 }}>
                        <Box sx={{ 
                          width: 40, height: 40, borderRadius: '50%', 
                          bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' 
                        }}>
                          <Clock size={20} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                            {activity.description}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center" component="span" sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">{new Date(activity.date).toLocaleDateString('pt-BR')}</Typography>
                            <Typography variant="caption" color="text.secondary">•</Typography>
                            <Typography variant="caption" color="primary.main" fontWeight="medium">{activity.project}</Typography>
                          </Stack>
                        }
                      />
                      <Stack alignItems="end" spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">{activity.hours}h</Typography>
                        <Chip 
                          label={activity.status} 
                          size="small" 
                          color={activity.status === 'Aprovado' ? 'success' : 'warning'} 
                          variant="outlined" 
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} 
                        />
                      </Stack>
                    </ListItem>
                    {idx < 2 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar Column (Right) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4}>
            {/* Quick Actions */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: 'primary.main', 
                color: 'white', 
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background decoration */}
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                 <Briefcase size={120} />
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>Acesso Rápido</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 4, maxWidth: '90%' }}>
                Inicie suas tarefas diárias com apenas um clique.
              </Typography>
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main', 
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } 
                  }}
                  startIcon={<Clock />}
                  onClick={() => navigate('/activities')}
                >
                  Registrar Atividade
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.3)', 
                    fontWeight: 'bold',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                  }}
                  startIcon={<CheckCircle2 />}
                  onClick={() => navigate('/approvals')}
                >
                  Ver Aprovações
                </Button>
              </Stack>
            </Paper>

            {/* Next Holidays */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Próximos Feriados</Typography>
              <List disablePadding>
                {mockHolidays.slice(0, 3).map((holiday, index) => (
                  <ListItem key={holiday.id} sx={{ px: 0, py: 2, borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none' }}>
                    <Box sx={{ mr: 2, textAlign: 'center', minWidth: 48 }}>
                      <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold" textTransform="uppercase" sx={{ fontSize: '0.7rem' }}>
                        {new Date(holiday.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                      </Typography>
                      <Typography variant="h5" lineHeight={1} fontWeight="bold" color="text.primary">
                        {new Date(holiday.date).getDate()}
                      </Typography>
                    </Box>
                    <ListItemText 
                      primary={holiday.name}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">{holiday.category}</Typography>
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button 
                fullWidth 
                size="small" 
                sx={{ mt: 1, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }} 
                onClick={() => navigate('/holidays')}
              >
                Ver Calendário Completo
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;