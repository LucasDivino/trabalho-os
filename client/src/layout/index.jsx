import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
} from "@material-ui/core";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RoomIcon from "@material-ui/icons/Room";

const menuRoutes = [
  { text: "Cadastrar Aluno", icon: <PersonAddIcon />, route: "/" },
  { text: "Melhor rota", icon: <RoomIcon />, route: "/map" },
];

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },

    list: {
      width: 250,
    },
  })
);

const MenuAppBar = ({ children }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={() => setOpen(true)}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            <Icon fontSize="large">
              <AirportShuttleIcon style={{ fontSize: 60, marginTop: 10 }} />
            </Icon>
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <React.Fragment key="menu">
          <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
          >
            <List className={classes.list}>
              {menuRoutes.map((element) => (
                <ListItem
                  button
                  key={element.text}
                  onClick={() => {
                    navigate(element.route);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon>{element.icon}</ListItemIcon>
                  <ListItemText primary={element.text} />
                </ListItem>
              ))}
            </List>
          </SwipeableDrawer>
        </React.Fragment>
      </AppBar>

      {children}
    </div>
  );
};

export default MenuAppBar;
