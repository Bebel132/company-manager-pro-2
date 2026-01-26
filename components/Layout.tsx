import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsedWidth = 80;
  const expandedWidth = 256;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar 
        isExpanded={isExpanded} 
        toggleSidebar={() => setIsExpanded(!isExpanded)} 
        width={isExpanded ? expandedWidth : collapsedWidth}
      />
      
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `${isExpanded ? expandedWidth : collapsedWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;