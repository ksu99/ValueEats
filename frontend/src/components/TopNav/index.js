import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import SearchDate from "../SearchDate";
import { logout } from "../../actions/auth";
import { toast } from "react-toastify";
import "./TopNav.css";
import { FilledButton, OutlinedButton } from "../General/button";
import { setAuth } from "../../redux/slices/auth.slice";
import { Search } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import categoryList from "../../assets/categories";
import {
  makeStyles,
  Avatar,
  Button,
  Grid,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Popover,
  TextField,
  IconButton,
  Tabs,
  Tab,
} from "@material-ui/core";
import { setCuisine } from "../../redux/slices/browsing.slice";
import { setPage } from "../../redux/slices/page.slice";
import { resetBrowse } from "../../redux/slices/browsing.slice";
import EventNoteIcon from "@material-ui/icons/EventNote";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function TopNav() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);
  const { page } = useSelector((state) => state.page);
  const [showSearch, setShowSearch] = useState(null);
  const dispatch = useDispatch();

  const openPopover = Boolean(showSearch);
  const id = openPopover ? "searchDate-popover" : undefined;

  let history = useHistory();

  const [userSearch, setUserSearch] = useState("");
  function handleChange(event, values) {
    setUserSearch(values);
  }
  function handleClick(category, isCuisine) {
    history.push({
      pathname: "/category/" + category,
    });
    dispatch(setCuisine(isCuisine));
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    dispatch(resetBrowse());
    setOpen(false);
  };

  const handleLogout = async (event) => {
    try {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
      await logout(token, user._id);
      window.localStorage.removeItem("auth");
      dispatch(setAuth({ token: "", user: {} }));
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response.data);
    }
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const onKeyPress = async (event) => {
    if (event.charCode === 13) {
      if (userSearch.length !== 0) {
        handleClick(userSearch);
      } else {
        handleClick("all");
      }
    }
  };
  
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const renderLogin = () => {
    if (token !== "") {
      console.log("logged In");
      return (
        <div classname="right_loggedIn">
          {!user.isDiner && (
            <FilledButton variant="outlined" component={Link} to="/calendar">
              Create Voucher
            </FilledButton>
          )}
          <Button
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            classname="right_loggedIn"
          >
            <Avatar />
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      className="menu-login-list"
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem
                        component={Link}
                        to="/profile"
                        onClick={handleClose}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem component={Link} to="/" onClick={handleLogout}>
                        Log Out
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      );
    }
    return (
      <Grid container spacing={2} className="right_buttons">
        <Grid item>
          <OutlinedButton
            variant="outlined"
            component={Link}
            to="/auth/register"
          >
            Sign Up
          </OutlinedButton>
        </Grid>
        <Grid item>
          <FilledButton variant="outlined" component={Link} to="/auth/login">
            Login
          </FilledButton>
        </Grid>
      </Grid>
    );
  };

  const navigate = (event, newValue) => {
    dispatch(setPage(newValue));
    dispatch(resetBrowse());
    if (newValue === 0) {
      history.push("/");
    } else if (newValue === 1) {
      history.push("/feed");
    }
  };

  const style = {
    minWidth: "0px",
    width: "100px",
    color: "black",
    fontWeight: "550",
  };

  return (
    <div className="topnav">
      <Grid container className="topnav_right">
        <Grid item>
          <Link className="" to="/" onClick={() => dispatch(setPage(0))}>
            <img className="topnav__icon" src="https://bit.ly/3hQitOG" alt="" />
          </Link>
        </Grid>
        <Grid item className="top-search-bar">
          <div className="top-search-bar">
            <Autocomplete
              onKeyPress={onKeyPress}
              options={categoryList}
              getOptionLabel={(category) => category.label}
              autoHighlight
              autoSelect
              onInputChange={handleChange}
              className="eatery-search-field"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Enter a cuisine or category ..."
                />
              )}
            />
            <IconButton
              onClick={() => {
                if (userSearch.length !== 0) {
                  handleClick(userSearch);
                } else {
                  handleClick("all");
                }
              }}
            >
              <Search className="search-icon" />
            </IconButton>
            <IconButton onClick={(event) => setShowSearch(event.currentTarget)}>
              <EventNoteIcon className="search-icon" />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <div className="topnav__center">
        <div className="tab_nav">
          <Tabs
            value={page}
            onChange={navigate}
            indicatorColor="primary"
            textColor="primary"
            centered
            TabIndicatorProps={{
              style: { background: "green" },
            }}
          >
            <Tab
              label="Explore"
              style={{ ...style, color: page === 0 ? "green" : "black" }}
              className="top-nav-tab-button"
            />
            <Tab
              label="Feed"
              style={{ ...style, color: page === 1 ? "green" : "black" }}
              className="top-nav-tab-button"
            />
          </Tabs>
        </div>

        <Popover
          id={id}
          open={openPopover}
          anchorEl={showSearch}
          onClose={() => setShowSearch(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <SearchDate />
        </Popover>
      </div>
      <div className="right">{renderLogin()}</div>
    </div>
  );
}

export default TopNav;
