import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, UserCircle2, Clock, FileText, CheckSquare, Calendar } from 'lucide-react';
import { mockCompanies } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Stack, 
  Tabs, 
  Tab,
  Divider
} from '@mui/material';

const CompanyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === id);
  const [activeTab, setActiveTab] = React.useState(0);

  if (!company) {
    return <Box p={4}>Company not found</Box>;
  }

  const detailTabs = [
    { label: 'Dados da Empresa', icon: Building2 },
    { label: 'Pontos Focais', icon: UserCircle2 },
    { label: 'Histórico', icon: Clock },
    { label: 'Contatos', icon: UserCircle2 },
    { label: 'Documentos', icon: FileText },
    { label: 'Tarefas', icon: CheckSquare },
    { label: 'Agenda', icon: Calendar },
  ];

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#f1f5f9', p: 4, pb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="start" spacing={3} mb={4}>
          <Stack direction="row" spacing={3} alignItems="center">
             <Avatar 
               src={company.logo} 
               sx={{ width: 80, height: 80, border: '4px solid white', boxShadow: 1 }} 
             />
             <Box>
               <Typography variant="h5" fontWeight="bold" color="text.primary">{company.name}</Typography>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{company.legalName}</Typography>
               <StatusBadge status={company.status} />
             </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" sx={{ bgcolor: 'white' }}>Arquivar empresa</Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')} 
              startIcon={<ArrowLeft size={18} />}
              disableElevation
            >
              Voltar
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: '#f1f5f9', pt: 0 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Tabs 
                orientation="vertical" 
                value={activeTab} 
                onChange={(e, val) => setActiveTab(val)}
                sx={{ borderRight: 1, borderColor: 'divider', bgcolor: 'white' }}
                TabIndicatorProps={{ sx: { left: 0, width: 4, bgcolor: 'primary.main' } }}
              >
                {detailTabs.map((tab, idx) => (
                  <Tab 
                    key={idx} 
                    label={
                      <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
                        <tab.icon size={18} />
                        <Typography variant="body2" fontWeight="medium">{tab.label}</Typography>
                      </Stack>
                    }
                    sx={{ alignItems: 'start', py: 2, textTransform: 'none' }}
                  />
                ))}
              </Tabs>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Dados da Empresa</Typography>
              <Divider sx={{ mb: 4 }} />
              
              <Grid container spacing={4} sx={{ maxWidth: 800 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>Nome Social</Typography>
                  <Typography variant="body2" color="text.secondary">{company.legalName}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>Nome Fantasia</Typography>
                  <Typography variant="body2" color="text.secondary">{company.fantasyName}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>CNPJ</Typography>
                  <Typography variant="body2" color="text.secondary">{company.cnpj}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>ID Interno</Typography>
                  <Typography variant="body2" color="text.secondary">#PJST{Math.floor(Math.random() * 100000)}</Typography>
                </Grid>

                <Grid size={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Endereço</Typography>
                    <Grid container spacing={4}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>Cidade</Typography>
                        <Typography variant="body2" color="text.secondary">{company.city}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>Estado</Typography>
                        <Typography variant="body2" color="text.secondary">{company.state}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CompanyDetail;