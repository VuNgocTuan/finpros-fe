import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useRouter } from 'next/router';
import { Collapse, List } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import MapIcon from '@mui/icons-material/Map';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MainMenuListItem = () => {
  const router = useRouter();
  const [openTactics, setOpenTactics] = React.useState(true);

  return (
    <React.Fragment>
      <ListItemButton selected={router.pathname == '/'} onClick={() => { router.push('/') }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => { setOpenTactics(!openTactics) }}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Tactics" />
        {openTactics ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openTactics} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} selected={router.pathname == '/tactics/list'} onClick={() => { router.push('/tactics/list') }}>
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary="List" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} selected={router.pathname == '/tactics/add'} onClick={() => { router.push('/tactics/add') }}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton>
        <ListItemIcon>
          <AttachMoneyIcon />
        </ListItemIcon>
        <ListItemText primary="Profit" />
      </ListItemButton>
    </React.Fragment>
  )
};

export default MainMenuListItem;