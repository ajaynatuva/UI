import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;

  return (
    <>
      <AppBar
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1
            }}
            src="/static/images/avatars/avatar_1.png"
          >
          </Avatar>
        </Toolbar>
      </AppBar>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
