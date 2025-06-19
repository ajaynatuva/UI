import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import  {DashboardSidebar}  from './dashboardSidebar.js';
import React from 'react';
const DashboardLayoutRoot = styled('div')(({ theme,open }) => {
  return({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 60,
  backgroundColor:'white',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: open?210:85,
    // paddingLeft:225,
    paddingRight:22
  }
})})

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <DashboardLayoutRoot open={isSidebarOpen}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardSidebar
        onSidebarChange={(value) => setSidebarOpen(value)}
        open={isSidebarOpen}
        roleName={props.roleName}
        onLogout={props.onLogout} 
      />
    </>
  );
};
export default DashboardLayout;
