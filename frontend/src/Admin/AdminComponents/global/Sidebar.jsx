import {useState} from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import {Link} from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import GroupIcon from '@mui/icons-material/Group';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  const menuItems = [
    {title: 'Dashboard', to: 'admin-dashboard', icon: <HomeOutlinedIcon />},
    {title: 'Manage Team', to: '/admin-team', icon: <PeopleOutlinedIcon />},
    {
      title: 'Contacts Information',
      to: '/admin-contacts',
      icon: <ContactsOutlinedIcon />,
    },
    {title: 'Profile Form', to: '/admin-form', icon: <PersonOutlinedIcon />},
    {
      title: 'Calendar',
      to: '/admin-calendar',
      icon: <CalendarTodayOutlinedIcon />,
    },
    {title: 'FAQ Page', to: '/admin-faq', icon: <HelpOutlineOutlinedIcon />},
    {title: 'Bar Chart', to: '/admin-bar', icon: <BarChartOutlinedIcon />},
    {
      title: 'Pie Chart',
      to: '/admin-pie',
      icon: <PieChartOutlineOutlinedIcon />,
    },
    {title: 'Line Chart', to: '/admin-line', icon: <TimelineOutlinedIcon />},
    {
      title: 'Geography Chart',
      to: '/admin-geography',
      icon: <MapOutlinedIcon />,
    },
    {title: 'Add Event', to: '/admin-addevent', icon: <EventIcon />},
    {title: 'List Event', to: '/admin-listevent', icon: <EventNoteIcon />},
    {title: 'Show Users', to: '/admin/show-users', icon: <GroupIcon />},
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? 80 : 250,
        height: '115vh',
        backgroundColor: '#333',
        color: 'white',
        transition: 'width 0.3s',
        paddingTop: 2,
        overflowY: 'auto', // 🟢 This makes it scrollable
        scrollbarWidth: 'thin', // optional: for Firefox
        '&::-webkit-scrollbar': {
          width: '6px', // optional: for Chrome
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#555', // optional: color of scrollbar thumb
          borderRadius: '4px',
        },
      }}
    >
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{marginLeft: 2}}
      >
        <MenuOutlinedIcon sx={{color: 'white'}} />
      </IconButton>
      {!isCollapsed && (
        <Typography
          variant="h5"
          textAlign="center"
          sx={{mt: 2, fontWeight: 'bold'}}
        >
          ADMIN PANEL
        </Typography>
      )}

      <List>
        {menuItems.map(item => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                backgroundColor:
                  selected === item.title ? '#444' : 'transparent',
              }}
              onClick={() => setSelected(item.title)}
            >
              <ListItemIcon sx={{color: 'white'}}>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.title} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
