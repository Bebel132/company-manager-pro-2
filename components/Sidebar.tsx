import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2, 
  FileText, 
  FileSignature, 
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Hexagon,
  Home
} from 'lucide-react';
import { NavItem } from '../types';
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  IconButton,
  Tooltip
} from '@mui/material';

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar, width }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveItem = (): NavItem | string => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/companies')) return 'companies';
    return path.substring(1);
  };

  const activeItem = getActiveItem();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início', path: '/' },
    { id: 'approvals', icon: CheckCircle2, label: 'Aprovações', path: '/approvals' },
    { id: 'activities', icon: Clock, label: 'Atividades', path: '/activities' },
    { id: 'people', icon: Users, label: 'Pessoas', path: '/people' },
    { id: 'companies', icon: Building2, label: 'Empresas', path: '/companies' },
    { id: 'projects', icon: FileText, label: 'Projetos', path: '/projects' },
    { id: 'contracts', icon: FileSignature, label: 'Contratos', path: '/contracts' },
    { id: 'holidays', icon: CalendarDays, label: 'Feriados', path: '/holidays' },
  ];

  return (
    <Box 
      sx={{ 
        width: width,
        bgcolor: 'primary.main',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        transition: theme => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxShadow: 4,
        overflow: 'hidden'
      }}
    >
      {/* Header / Logo */}
      <Box 
        onClick={() => navigate('/')}
        sx={{ 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isExpanded ? 'space-between' : 'center',
          px: isExpanded ? 3 : 0,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(0,0,0,0.1)',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 40, height: 40, bgcolor: 'white', color: 'primary.main', 
            borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 2, flexShrink: 0
          }}>
            <Hexagon size={24} strokeWidth={2.5} />
          </Box>
          <Box sx={{ 
            opacity: isExpanded ? 1 : 0, 
            width: isExpanded ? 'auto' : 0, 
            transition: 'opacity 0.2s',
            overflow: 'hidden'
          }}>
            <Typography variant="h6" color="white" fontWeight="bold" lineHeight={1}>SYS</Typography>
            <Typography variant="caption" color="blue.100" sx={{ letterSpacing: 1, color: '#bfdbfe' }} fontWeight="medium">MANAGER PRO</Typography>
          </Box>
        </Box>

        {/* Toggle Button */}
        <IconButton 
          onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
          size="small"
          sx={{ 
            color: 'white', 
            bgcolor: 'rgba(255,255,255,0.1)', 
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            position: isExpanded ? 'static' : 'absolute',
            bottom: isExpanded ? 'auto' : 8, 
            display: isExpanded ? 'inline-flex' : 'none' 
          }}
        >
           <ChevronLeft size={18} />
        </IconButton>
        
        {!isExpanded && (
           <IconButton 
             onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
             size="small"
             sx={{ 
               position: 'absolute',
               bottom: 8, 
               color: 'white',
               '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
             }}
           >
             <ChevronRight size={18} />
           </IconButton>
        )}
      </Box>

      {/* Nav Items */}
      <List sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <Tooltip title={!isExpanded ? item.label : ''} placement="right" key={item.id} arrow>
              <ListItemButton
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  minHeight: 48,
                  height: isExpanded ? 'auto' : 48,
                  width: isExpanded ? 'auto' : 48,
                  justifyContent: isExpanded ? 'initial' : 'center',
                  px: isExpanded ? 2.5 : 0,
                  mx: isExpanded ? 0 : 'auto', 
                  borderRadius: 2, 
                  bgcolor: isActive ? 'white' : 'transparent',
                  color: isActive ? 'primary.main' : 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: isActive ? 'white' : 'rgba(255,255,255,0.1)',
                    color: isActive ? 'primary.main' : 'white',
                  },
                  mb: 0.5, 
                  boxShadow: isActive ? 2 : 0,
                  transition: 'all 0.2s'
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0, 
                  mr: isExpanded ? 2 : 0, 
                  justifyContent: 'center',
                  color: 'inherit'
                }}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    opacity: isExpanded ? 1 : 0, 
                    display: isExpanded ? 'block' : 'none',
                    whiteSpace: 'nowrap'
                  }} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} 
                />
                
                {isExpanded && isActive && (
                   <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7dd3fc', ml: 1 }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        bgcolor: 'rgba(0,0,0,0.1)',
        p: isExpanded ? 2 : 1,
        mt: 'auto'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          justifyContent: isExpanded ? 'flex-start' : 'center'
        }}>
          <Avatar 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.5)' }} 
          />
          
          {isExpanded && (
             <Box sx={{ overflow: 'hidden' }}>
               <Typography variant="body2" color="white" fontWeight="bold" noWrap>João Silva</Typography>
               <Typography variant="caption" sx={{ color: '#bfdbfe' }} noWrap>joao@empresa.com</Typography>
             </Box>
          )}
          
          {isExpanded && (
            <IconButton sx={{ ml: 'auto', color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(239,68,68,0.2)' } }}>
              <LogOut size={18} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;