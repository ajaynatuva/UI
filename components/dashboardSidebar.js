import {
  Add,
  Cached,
  ContentPasteSearch,
  CreateNewFolder,
  Flag,
  FormatListBulleted,
  Group,
  LibraryAdd,
  Person,
  PlayCircleFilled,
  SearchRounded,
  SmartDisplayOutlined,
  Upload,
  Visibility,
  VisibilityOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SummarizeIcon from "@mui/icons-material/Summarize";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import swal from "sweetalert2";
import { navyColor, primaryColor } from "../assets/jss/material-kit-react";
import CustomInput from "../components/CustomInput/CustomInput";
import GridItem from "../components/Grid/GridItem";
import { environment } from "../environments/environment.prod";
import { editPassword, getUserRoleById } from "../redux/ApiCalls/UserApis/UserApis";
import {
  GET_USER_LIST,
  RESET_LOGIN_DETAILS,
  TAB_PATHS,
  USER_LOGIN_DETAILS_CACHE,
} from "../redux/ApiCalls/UserApis/UserApiActionType";
import { RESET } from "../redux/ApiCalls/SearchPolicyApis/SearchPolicyConstants";
import { SEARCH_POLICY } from "../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NavItem } from "./navItem";
import "./navItems.css";

//avatar
import CustomButton from "../components/CustomButtons/CustomButton";

import { Avatar } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import usePasswordToggle from "../hooks/usePasswordToggle";
import "./navItems.css";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { version } from "../../package.json";
import logo from "../assets/img/amps/logo.png";
import Dialogbox from "../components/Dialog/DialogBox";
import { RESET_CRAWLER_STATE } from "../redux/ApiCalls/CrawlerApis/CrwalerActionType";
import {
  DIALOG_CAT_RESET_STATE,
  DIALOG_REASON_RESET_STATE,
  RESET_STATE,
} from "../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import ViewListIcon from "@mui/icons-material/ViewList";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import "./navItems.css";
import { RESET_STATE_OF_VIEW_META } from "../redux/ApiCalls/ReferentialDataApi/ReferetialDataTypes";
import { CustomSwal } from "./CustomSwal/CustomSwal";
import { getCrawlerVersion, getCurationVersion, getEmailVersion, getPolicyConfigVersion, getPolicyEngineVersion, getUserVersion } from "../redux/ApiCalls/VersionApi/versionApis";
import { batchDispatch } from "../redux/ApiCallAction/ApiCallAction";
const _ = require("lodash");

const drawerWidth = 190;

const iconSize = 18;
export const intialItems = [
  {
    href: "/crawlwer",
    title: "Data Crawler",
    subHeaders: [
      {
        label: "Add Crawler",
        path: "addCrawler",
        icon: <LibraryAdd style={{ fontSize: iconSize }} />,
      },
      {
        label: "View Crawler",
        path: "viewCrawler",
        icon: <VisibilityOutlined style={{ fontSize: iconSize }} />,
      },
    ],
  },
  {
    href: "/",
    title: "Data Curation",
    subHeaders: [
      {
        label: "Metadata Loader",
        path: "metaDataLoader",
        icon: <Upload style={{ fontSize: iconSize }} />,
      },
      {
        label: "Group Task",
        path: "groupTask",
        icon: <Group style={{ fontSize: iconSize }} />,
      },
      {
        label: "My Task",
        path: "myTask",
        icon: <Person style={{ fontSize: iconSize }} />,
      },
    ],
  },
  {
    href: "/customers",
    title: "Policy",
    subHeaders: [
      {
        label: "Search",
        path: "search",
        icon: <SearchRounded style={{ fontSize: iconSize }} />,
      },
      {
        label: "Policy View",
        path: "policyView",
        icon: <SmartDisplayOutlined style={{ fontSize: iconSize }} />,
      },
      {
        label: "New Policy",
        path: "newPolicy",
        icon: <CreateNewFolder style={{ fontSize: iconSize }} />,
      },
      {
        label: "View Config Table",
        path: "viewConfig",
        icon: <Visibility style={{ fontSize: iconSize }} />,
      },
      {
        label: "Referential Data",
        path: "viewMeta",
        icon: <ContentPasteSearch style={{ fontSize: iconSize }} />,
      },
      {
        label: "New Client Set-up",
        path: "NewCleintSetUp",
        icon: <CreateNewFolder style={{ fontSize: iconSize }} />,
      },
      //currently not using
      // {
      //   label: "Client Policy Exclusions",
      //   path: "ClientgroupExclusions",
      //   icon: <ViewListIcon style={{ fontSize: iconSize }} />,
      // },
    ],
  },
  {
    href: "/products",
    title: "Reports",
    subHeaders: [
      {
        label: "Config Validation",
        path: "configValidation",
        icon: <PlayCircleFilled style={{ fontSize: iconSize }} />,
      },
      {
        label: "Testing Report",
        path: "testingReport",
        icon: <AssignmentTurnedInIcon style={{ fontSize: iconSize }} />,
      },
      {
        label: "Rbrvs Report",
        path: "rbrvsReport",
        icon: <SummarizeIcon style={{ fontSize: iconSize }} />,
      },
      {
        label: "Claims",
        path: "claim",
        icon: <SearchRounded style={{ fontSize: iconSize }} />,
      },
    ],
  },
  {
    href: "/userList",
    title: "User",
    subHeaders: [
      {
        label: "Create User",
        path: "createUser",
        icon: <Add style={{ fontSize: iconSize }} />,
      },
      {
        label: "User List",
        path: "userList",
        icon: <FormatListBulleted style={{ fontSize: iconSize }} />,
      },
    ],
  },
  {
    href: "/policyEngine",
    title: "Update Cache",
    subHeaders: [
      {
        label: "Cache",
        path: "cache",
        icon: <Cached style={{ fontSize: iconSize }} />,
      },
    ],
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const DashboardSidebar = (props) => {
  useEffect(() => {
    if (updatedState.curationVer === "") {
      getCurationVersion(dispatch);
    }
    if (updatedState.engineVer === "") {
      getPolicyEngineVersion(dispatch);
    }
    if (updatedState.configVer === "") {
      getPolicyConfigVersion(dispatch);
    }
    if (updatedState.crawleVer === "") {
      getCrawlerVersion(dispatch);
    }
    if (updatedState.email === "") {
      getEmailVersion(dispatch);
    }
    if (updatedState.userVer === "") {
      getUserVersion(dispatch);
    }
  }, []);
  const { classes } = props;
  // const loginState = useSelector(
  //   (state) => state.userReducer
  // );
  const loginState = useSelector((state) => state.newPolicyForm);
  const updatedState = useSelector((state) => state.newPolicy);
  const roleState = useSelector((state) => state.userReducer);

  const handleToClose = () => {
    setOpen(false);
  };
  const [passwordInputType, ToggleIcon] = usePasswordToggle();
  const [passwordInputType2, ToggleIcon2] = usePasswordToggle();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popup, setPopUp] = useState(false);

  const _ = require("lodash");
  const openAv = Boolean(anchorEl);
  const fullWidth = true;
  const maxWidth = "sm";
  const [resetPwdError, setResetPwdError] = useState("");
  const [resetConfirmPwdError, setResetConfirmPwdError] = useState("");
  const [role, setRole] = React.useState();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { onSidebarOpen, ...other } = props;
  function logout() {
    navigate("/");
    const actions = [
      { type: RESET_LOGIN_DETAILS },
      { type: GET_USER_LIST, payload: [] },
      { type: USER_LOGIN_DETAILS_CACHE, payload: {} },
      { type: RESET },
      { type: SEARCH_POLICY, payload: [] },
    ];
   batchDispatch(dispatch,actions);
    localStorage.clear();
    sessionStorage.clear();
    props.onLogout();
  }
  const intialResetPaswordState = {
    oldPassword: undefined,
    password: undefined,
    confirmPassword: undefined,
    userId: undefined,
  };
  const [resetPasswordState, setResetPasswordState] = useState(
    intialResetPaswordState
  );
  function popUpCloseHandler() {
    setPopUp(false);
    setResetPasswordState(intialResetPaswordState);
  }
  const navigate = useNavigate();

  const theme = useTheme();

  const handleDrawerOpen = () => {
    props.onSidebarChange(true);
  };
  function handleResetClick() {
    setPopUp(true);
    setAnchorEl(null);
  }

  const handleDrawerClose = () => {
    props.onSidebarChange(false);
  };
  const resetInputField = () => {
    dispatch({ type: RESET_STATE });
    dispatch({ type: DIALOG_REASON_RESET_STATE });
    dispatch({ type: DIALOG_CAT_RESET_STATE });
  };
  const resetReferential = () => {
    dispatch({ type: RESET_STATE_OF_VIEW_META });
  };

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = (value) => {
    // props.onSetSelectedTab(value);
    switch (value) {
      case "newPolicy": {
        resetInputField();
        navigate("/newPolicy", { state: { new: true } });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "search": {
        resetInputField();
        navigate("/search", { state: { search: true } });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "metaDataLoader": {
        navigate("/metaDataLoader");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "groupTask": {
        navigate("/groupTask");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "myTask": {
        navigate("/myTask");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "loadConfig": {
        navigate("/loadConfig");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "viewConfig": {
        navigate("/viewConfig");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "viewMeta": {
        resetReferential();
        navigate("/viewMeta");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "configValidation": {
        navigate("/configValidation");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "viewCrawler": {
        navigate("/viewCrawler");
        dispatch({ type: RESET_CRAWLER_STATE });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "addCrawler": {
        dispatch({ type: RESET_CRAWLER_STATE });
        navigate("/addCrawler", { state: { add: true } });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "userList": {
        navigate("/userList");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "createUser": {
        navigate("/createUser");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "testingReport": {
        navigate("/testingReport", { state: { testingReport: true } });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "policyUpdateReport": {
        navigate("/policyUpdateReport", {
          state: { policyUpdateReport: true },
        });
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "login": {
        navigate("/login");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "claim": {
        navigate("/claim");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "cache": {
        navigate("/cache");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "rbrvsReport": {
        navigate("/rbrvsReport");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      case "policyView": {
        navigate("/policyView");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      //currently not using
      // case "ClientgroupExclusions": {
      //   navigate("/ClientgroupExclusions");
      //   dispatch({ type: TAB_PATHS, payload: value });
      //   break;
      // }
      case "NewClientSetUp": {
        navigate("/NewClientSetUp");
        dispatch({ type: TAB_PATHS, payload: value });
        break;
      }
      default:
        break;
    }
  };
  if (Object.keys(roleState.userLoginDetailsCache).length !== 0) {
    localStorage.setItem("emailId", roleState.userLoginDetailsCache.emailId);
    localStorage.setItem("userId", roleState.userLoginDetailsCache.userId);
    sessionStorage.setItem("emailId", roleState.userLoginDetailsCache.emailId);
  }
  useEffect(() => {
    const userId =
      roleState.userLoginDetailsCache.userId || localStorage.getItem("userId");
    if (!userId) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      props.onLogout();
      return;
    }

    const fetchUserRole = async () => {
      const role = await getUserRoleById(dispatch, userId);
      if (role && sessionStorage.getItem("emailId")) {
        const isAdmin = role.some((r) => r.roleId.roleName.toLowerCase() === "admin");
        setRole(isAdmin);
      } else {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
        props.onLogout();
      }
    };

    fetchUserRole();
  }, [roleState.userLoginDetailsCache]);

  const message =
    "Password should contain min 8 characters and must contain 1 lowercase and 1 uppercase character, 1 numeric character and at least one special character";

  function resetPasswordValidation() {
    const passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

    let isValid = false;
    if (
      !(
        !resetPasswordState.password ||
        passwordRegex.test(resetPasswordState.password) === false
      )
    ) {
      isValid = true;
      setResetPwdError("");
    } else {
      isValid = false;
      setResetPwdError(message);
    }
    if (
      !(
        !resetPasswordState.confirmPassword ||
        passwordRegex.test(resetPasswordState.confirmPassword) === false
      )
    ) {
      isValid = true;
      setResetConfirmPwdError("");
    } else {
      isValid = false;
      setResetConfirmPwdError(message);
    }
    return isValid;
  }
  function editUserPassword() {
    let userId = "";
    if (roleState.userLoginDetailsCache.userId) {
      userId = roleState.userLoginDetailsCache.userId;
    } else {
      userId = localStorage.getItem("userId");
    }
    let isValid = resetPasswordValidation();
    if (isValid) {
      if (resetPasswordState.password === resetPasswordState.confirmPassword) {
        resetPasswordState.userId = userId;
        setResetPasswordState(resetPasswordState);
        let obj = {};
        Object.entries(resetPasswordState).forEach(
          ([key, val]) => (obj[key] = val)
        );
        editPassword(dispatch, obj);
        setPopUp(false);
        setResetPasswordState(intialResetPaswordState);
        logout();
      } else {
        setPopUp(false);
        CustomSwal(
          "error",
          "Password and confirm password are not matching",
          navyColor,
          "OK",
          "Error"
        );
        setResetPasswordState(intialResetPaswordState);
      }
    }
  }

  const [selectedTab, setSelectedTab] = useState("search");
  const [items, setItems] = useState(intialItems);

  const dispatch = useDispatch();
  useEffect(() => {
    let urlPath = window.location.pathname;
    let currentTab = urlPath.split("/").pop();
    setSelectedTab(currentTab);
    dispatch({ type: TAB_PATHS, payload: currentTab });
  }, [dispatch, roleState.tabPaths]);

  useEffect(() => {
    const its = [
      {
        href: "/crawlwer",
        title: "Data Crawler",
        subHeaders: [
          {
            label: "Add Crawler",
            path: "addCrawler",
            icon: <LibraryAdd style={{ fontSize: iconSize }} />,
          },
          {
            label: "View Crawler",
            path: "viewCrawler",
            icon: <VisibilityOutlined style={{ fontSize: iconSize }} />,
          },
        ],
      },
      {
        href: "/",
        title: "Data Curation",
        subHeaders: [
          {
            label: "Metadata Loader",
            path: "metaDataLoader",
            icon: <Upload style={{ fontSize: iconSize }} />,
          },
          {
            label: "Group Task",
            path: "groupTask",
            icon: <Group style={{ fontSize: iconSize }} />,
          },
          {
            label: "My Task",
            path: "myTask",
            icon: <Person style={{ fontSize: iconSize }} />,
          },
        ],
      },
      {
        href: "/customers",
        title: "Policy",
        subHeaders: [
          {
            label: "Search",
            path: "search",
            icon: <SearchRounded style={{ fontSize: iconSize }} />,
          },
          {
            label: "Policy View",
            path: "policyView",
            icon: <SmartDisplayOutlined style={{ fontSize: iconSize }} />,
          },

          {
            label: "New Policy",
            path: "newPolicy",
            icon: <CreateNewFolder style={{ fontSize: iconSize }} />,
          },
          {
            label: "View Config Table",
            path: "viewConfig",
            icon: <Visibility style={{ fontSize: iconSize }} />,
          },
          {
            label: "Referential Data",
            path: "viewMeta",
            icon: <ContentPasteSearch style={{ fontSize: iconSize }} />,
          },
          {
            label: "New Client Set-up",
            path: "NewClientSetUp",
            icon: <CreateNewFolder style={{ fontSize: iconSize }} />,
          },
          // currently not using 
          // {
          //   label: "Client Policy Exclusions",
          //   path: "ClientgroupExclusions",
          //   icon: <ViewListIcon style={{ fontSize: iconSize }} />,
          // },
        ],
      },
      {
        href: "/products",
        title: "Reports",
        subHeaders: [
          {
            label: "Config Validation",
            path: "configValidation",
            icon: <PlayCircleFilled style={{ fontSize: iconSize }} />,
          },
          {
            label: "Testing Report",
            path: "testingReport",
            icon: <AssignmentTurnedInIcon style={{ fontSize: iconSize }} />,
          },
          {
            label: "Policy Update Report",
            path: "policyUpdateReport",
            icon: <AssignmentTurnedInIcon style={{ fontSize: iconSize }} />,
          },
          {
            label: "Rbrvs Report",
            path: "rbrvsReport",
            icon: <SummarizeIcon style={{ fontSize: iconSize }} />,
          },
          {
            label: "Claims",
            path: "claim",
            icon: <SearchRounded style={{ fontSize: iconSize }} />,
          },
        ],
      },
      {
        href: "/userList",
        title: "User",
        subHeaders: [
          {
            label: "Create User",
            path: "createUser",
            icon: <Add style={{ fontSize: iconSize }} />,
          },
          {
            label: "User List",
            path: "userList",
            icon: <FormatListBulleted style={{ fontSize: iconSize }} />,
          },
        ],
      },
      {
        href: "/policyEngine",
        title: "Update Cache",
        subHeaders: [
          {
            label: "Cache",
            path: "cache",
            icon: <Cached style={{ fontSize: iconSize }} />,
          },
        ],
      },
    ];
    let roles = roleState.roleName;
    let role = JSON.stringify(roles);
    let researchIdx = role.toLocaleLowerCase().search("research");
    let adminIdx = role.toLocaleLowerCase().search("admin");
    let testIdx = role.toLocaleLowerCase().search("testing");
    let auditIdx = role.toLocaleLowerCase().search("audit");
    let prodIdx = environment.isProd;
    if (adminIdx > 0) {
      setItems(its);
    } else if (prodIdx != 0 && researchIdx > 0) {
      its[0].subHeaders.splice(0, 2);
      its[0].title = "";
      its[2].subHeaders.splice(5, 1);
      its[4].subHeaders.splice(0, 2);
      its[4].title = "";
      its[5].subHeaders.splice(0, 1);
      its[5].title = "";
      setItems(its);
    } else if (prodIdx != 0 && (testIdx > 0 || auditIdx > 0)) {
      its[0].subHeaders.splice(0, 2);
      its[2].subHeaders.splice(5, 1);
      its[2].subHeaders.splice(2, 1);
      its[3].subHeaders.splice(2, 1);
      its[0].title = "";
      its[1].subHeaders.splice(0, 3);
      its[1].title = "";
      its[4].subHeaders.splice(0, 2);
      its[4].title = "";
      its[5].subHeaders.splice(0, 1);
      its[5].title = "";

      setItems(its);
    }
  }, [roleState.roleName]);

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#ecf0f1",
          color: "white",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              // icon={item.icon}
              href={item.href}
              title={item.title}
              subHeaders={item.subHeaders}
              selectedTab={selectedTab}
              onSetSelectedTab={(value) => setSelectedTab(value)}
            />
          ))}
        </Box>
        {/* <span>v1.4.56</span> */}

        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Divider sx={{ borderColor: "#2D3748" }} />
          <Typography color="neutral.100" variant="subtitle2"></Typography>
        </Box>
      </Box>
    </>
  );
  document.addEventListener("click", function handleClickOutsideBox(event) {
    // 👇️ the element the user clicked
    const box = document.getElementById("box");
    if (!box?.contains(event.target)) {
      if (anchorEl != null) {
        setAnchorEl(null);
      }
    }
  });
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={props.open}>
        <Toolbar
          id="box"
          style={{ backgroundColor: "#004f71", width: "100%", minHeight: 59 }}
        >
          {!props.open ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                // marginRight: 1,
                ...(props.open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon
                  style={{ color: "white", marginLeft: -100 }}
                />
              ) : (
                <ChevronLeftIcon style={{ color: "white" }} />
              )}
            </IconButton>
          )}
          {!props.open ? (
            <img height={40} src={logo} />
          ) : (
            <img style={{ marginLeft: "-200px" }} height={40} src={logo} />
          )}
          <div style={{ position: "fixed", left: "80%", color: "white" }}>
            <span>
              {localStorage.getItem("emailId")}
              {role ? <span>(Admin)</span> : undefined}
            </span>
          </div>
          <CustomButton
            id="basic-button"
            aria-controls={openAv ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAv ? "true" : undefined}
            onClick={handleClick1}
            style={{ color: "white", position: "fixed", left: "94%" }}
          >
            <Stack direction="row">
              <div>
                <Avatar
                  sx={{
                    bgcolor: "#8bc34a",
                    width: 32,
                    height: 32,
                    fontSize: "17px",
                    float: "right",
                  }}
                >
                  {localStorage.getItem("emailId")?.charAt(0).toUpperCase()}
                </Avatar>
              </div>
            </Stack>
          </CustomButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openAv}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <div style={{ paddingLeft: 7, paddingRight: 7, marginLeft: 2 }}>
              <MenuItem onClick={handleResetClick}>Reset Password</MenuItem>
              <div />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </div>
          </Menu>
        </Toolbar>

        <Dialog
          onClose={() => setPopUp(false)}
          open={popup}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
        >
          <DialogTitle>
            Reset Password
            <IconButton
              aria-label="close"
              onClick={popUpCloseHandler}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <GridItem sm={12} md={12} xs={12}>
              <CustomInput
                fullWidth={true}
                labelText={"Password"}
                type={passwordInputType}
                endAdornment={ToggleIcon}
                onBlur={resetPasswordValidation}
                variant={"outlined"}
                value={resetPasswordState.password}
                onChange={(event) => {
                  let obj = _.cloneDeep(resetPasswordState);
                  obj.password = event.target.value;
                  setResetPasswordState(obj);
                }}
              />
              {/* <i className="password">{newIcon}</i> */}
              <small
                style={{ color: "red" }}
                className={`message ${
                  resetPasswordValidation ? "success" : "error"
                }`}
              >
                {resetPwdError}
              </small>
            </GridItem>
            <GridItem sm={12} md={12} xs={12}>
              <CustomInput
                fullWidth={true}
                labelText={"Confirm Password"}
                type={passwordInputType2}
                endAdornment={ToggleIcon2}
                variant={"outlined"}
                onBlur={resetPasswordValidation}
                value={resetPasswordState.confirmPassword}
                onChange={(event) => {
                  let obj = _.cloneDeep(resetPasswordState);
                  obj.confirmPassword = event.target.value;
                  setResetPasswordState(obj);
                }}
              />
              {/* <i className="password">{confirmIcon}</i> */}
              <small
                style={{ color: "red" }}
                className={`message ${
                  resetPasswordValidation ? "success" : "error"
                }`}
              >
                {resetConfirmPwdError}
              </small>
            </GridItem>
          </DialogContent>
          <DialogActions>
            <CustomButton
              variant="contained"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onClick={() => editUserPassword()}
            >
              Save
            </CustomButton>
          </DialogActions>
        </Dialog>
      </AppBar>
      <Drawer variant="permanent" open={props.open}>
        <DrawerHeader
          style={{
            backgroundColor: "#004f71",
            minHeight: 61,
            position: "fixed",
            width: "193px",
            top: "-2px",
            zIndex: "100",
          }}
        ></DrawerHeader>
        <List style={{ backgroundColor: "#ecf0f1", height: "100%" }}>
          {items.map((i) => {
            return (
              <>
                {props.open ? (
                  <Typography
                    variant="button"
                    display="block"
                    style={{
                      paddingLeft: 15,
                      marginBottom: -5,
                      paddingTop: 5,
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "Arial, Helvetica, sans-serif",
                      color: "lightseagreen",
                      textTransform: "capitalize",
                      background: "#ecf0f1",
                    }}
                    gutterBottom
                  >
                    {i.title}
                  </Typography>
                ) : undefined}
                {i.subHeaders.map((sh) => {
                  return (
                    <>
                      <ListItemButton
                        onClick={() => handleClick(sh.path)}
                        key={sh.path}
                        className="sideNav"
                        style={{
                          backgroundColor:
                            selectedTab === sh.path ? "#555" : "",
                          borderLeft:
                            selectedTab === sh.path ? "3px solid #EE5209" : "",
                          color: selectedTab === sh.path ? "white" : "black",
                          cursor: "pointer",
                        }}
                        sx={{
                          // minHeight: 20,
                          height: 24,
                          justifyContent: props.open ? "initial" : "center",
                          // px: 2.5,
                          paddingLeft: 1,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: props.open ? 1 : "auto",
                            justifyContent: "center",
                            paddingLeft: !props.open ? 1.5 : 0,
                          }}
                          style={{
                            color: selectedTab === sh.path ? "white" : "black",
                            cursor: "pointer",
                          }}
                        >
                          {/*  style={{
                            marginTop:  sh.label=="Rbrvs Report"?"50px":0
                          }}  */}
                          <span title={sh.label}>{sh.icon}</span>
                        </ListItemIcon>
                        <ListItemText
                          style={{
                            marginTop: "9px",
                          }}
                          primary={sh.label}
                          sx={{ opacity: props.open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </>
                  );
                })}
              </>
            );
          })}
          {/* <h6 className="header"
          onClick={()=>{
            navigate("/cache");
          }}>
            Update Cache
          </h6> */}
          <p
            className="versions"
            onClick={() => {
              setOpen(true);
            }}
          >
            v{version}
          </p>
        </List>
        <Dialogbox
          onClose={handleToClose}
          open={open}
          title={"Versions"}
          message={
            <div>
              <div>Data Curation : {updatedState.curationVer}</div>
              <div>
                Data Crawler
                <span style={{ marginLeft: 5 }}>
                  : {updatedState.crawleVer}
                </span>
              </div>
              <div>
                Policy Config
                <span style={{ marginLeft: 5 }}>
                  : {updatedState.configVer}
                </span>
              </div>
              <div>
                Policy Engine
                <span style={{ marginLeft: 2 }}>
                  : {updatedState.engineVer}
                </span>
              </div>
              <div>
                IPU User
                <span style={{ marginLeft: 32 }}>: {updatedState.userVer}</span>
              </div>
              <div>
                Email
                <span style={{ marginLeft: 51 }}> : {updatedState.email}</span>
              </div>
            </div>
          }
        />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph></Typography>
      </Box>
    </Box>
  );
};
DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
