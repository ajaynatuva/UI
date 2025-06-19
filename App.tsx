import { CacheProvider } from "@emotion/react";
import { ButtonGroup } from "@material-ui/core";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@mui/material/styles";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers"; // Correct package
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Correct adapter
import "./App.css";
import { navyColor } from "./assets/jss/material-kit-react";
import CustomButton from "./components/CustomButtons/CustomButton";
import { DashboardLayout } from "./components/dashboardLayout";
import Dialogbox from "./components/Dialog/DialogBox";
import "./components/FontAwesomeIcons";
import Claim from "./pages/Claims/Claims";
import DeltaConfig from "./pages/DeltaConfig/DeltaConfig";
import NewPolicy from "./pages/NewPolicy/NewPolicy";
// import Search from "./pages/search/Search";
import TestingReport from "./pages/TestingReport/TestingReport";
import ViewMeta from "./pages/ViewMeta/ViewMeta";
import ViewPolicy from "./pages/ViewPolicy/ViewPolicy";
import { DIALOG } from "./redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { USER_LOGIN_DETAILS_CACHE } from "./redux/ApiCalls/UserApis/UserApiActionType";
import { UserState } from "./redux/reducers/UserReducer/UserReducer";
import { theme } from "./theme";
import { createEmotionCache } from "./utils/create-emotion-cache";
import PolicyDisplay from "./pages/PolicyView/PolicyView";
import AddExclusion from "./pages/ClientPolicyExclusion/AddExclusion";
import PolicyViewExport from "./pages/PolicyView/PolicyViewExport";
import PolicyUpdateReport from "./pages/PolicyUpdateReport/PolicyUpdateReport";
import NewClientSetUp from "./pages/NewClientSetUp/NewClientSetUp";
import IdleTimer from "react-idle-timer";
import ShowSpinnerInDialogBox from "./components/Spinner/ShowSpinnerInDialogBox";
import Login from "./pages/Login/Login";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { DialogState } from "./redux/reducers/DiaglogBoxReducer/DialogState";
import { changesTabFieldState } from "./redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";

//Routes that are not immediately required during the initial page load.
const ViewCrawler = lazy(()=>import('../src/pages/ViewCrawler/ViewCrawler'));
const AddCrawler = lazy(()=>import('../src/pages/AddCrawler/AddCrawler'));
const MetaDataLoader = lazy(()=>import('../src/pages/MetaDataLoader/MetaDataLoader'));
const MyTask = lazy(()=>import('../src/pages/MyTask/MyTask'));
const GroupTask = lazy(()=>import('../src/pages/GroupTask/GroupTask'));
//currently not using 
// const ClientgroupExclusions = lazy(()=>import('../src/pages/ClientPolicyExclusion/ClientgroupExclusions'));
const ViewConfig = lazy(()=>import('../src/pages/LookUps/ViewConfig'));
const ConfigValidationReport = lazy(()=>import('../src/pages/ConfigValidationReport/ConfigValidationReports'));
const RbrvsReport = lazy(()=>import('../src/pages/RbrvsReport/RbrvsReport'));
const CreateUser = lazy(()=>import('../src/pages/Users/CreateUser'));
const UserList = lazy(()=>import('../src/pages/Users/UsersList'));
const Cache = lazy(()=>import('../src/pages/Cache/Cache'));
const SearchCache = lazy(()=>import('../src/pages/search/Search'));


const clientSideEmotionCache = createEmotionCache();
const App = (props) => {
  const { emotionCache = clientSideEmotionCache } = props;
  const dispatch = useDispatch();

  const [isLoggedIn, setIsloggedIn] = useState(false);
  const updatedState = useSelector((state: any) => state.spinnerReducer);
  const roleState: UserState = useSelector((state: any) => state.userReducer);

  const dialogState: DialogState = useSelector((state:any)=>state.diaglogBoxReducer);
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );

      const changesTabFields: changesTabFieldState = useSelector(
        (state: any) => state.ChangesTabFieldsRedux
      );
    
  let emailId = localStorage.getItem("emailId");
  let data = roleState.roleName;
  let Role = JSON.stringify(data);
  let researchIdx = Role.toLocaleLowerCase().search("research");
  let adminIdx = Role.toLocaleLowerCase().search("admin");
  const [loading, setLoading] = useState(true);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [seconds, setSeconds] = useState(180);
  const cacheEmailId = sessionStorage.getItem("emailId");

  useEffect(() => {
    let countdown;

    if (isTimedOut && seconds > 0) {
      countdown = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (seconds <= 0 && isTimedOut) {
      dispatch({ type: "RESET_LOGIN_DETAILS" });
      setIsloggedIn(false);
      setIsTimedOut(false);
      localStorage.clear();
      sessionStorage.clear();
    }

    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [seconds, isTimedOut, dispatch]);

  const handleIdle = () => {
    setIsTimedOut(true);
    setSeconds(180);
  };

  const handleStayLoggedIn = () => {
    setIsTimedOut(false);
    setSeconds(180);
  };

  const handleLogout = () => {
    dispatch({ type: USER_LOGIN_DETAILS_CACHE, payload: [] });
    setIsloggedIn(false);
    setIsTimedOut(false);
    setSeconds(180);
    localStorage.clear();
    sessionStorage.clear();
  };

  useEffect(() => {
    if (cacheEmailId) {
      setIsloggedIn(true);
    }
    setLoading(false);
  }, [cacheEmailId]);
  const commonRoutes = [
    { path: "/metaDataLoader", element: <MetaDataLoader /> },
    {
      path: "/groupTask",
      element: <GroupTask onLogout={() => setIsloggedIn(false)} />,
    },
    { path: "/myTask", element: <MyTask /> },
    { path: "/deltaConfig", element: <DeltaConfig /> },
    { path: "/PolicyUpdateReport", element: <PolicyUpdateReport /> },
    {
      path: "/newPolicy",
      element: (
        <NewPolicy
          edit={false}
          fromViewPolicy={false}
          showImportButton={true}
          customCreatedB={false}
        />
      ),
    },
  ];
  const adminRoutes = [
    { path: "/rbrvsReport", element: <RbrvsReport /> },
    { path: "/policyViewExport", element: <PolicyViewExport /> },
    { path: "/viewCrawler", element: <ViewCrawler /> },
    { path: "/NewClientSetUp", element: <NewClientSetUp /> },
    { path: "/addCrawler", element: <AddCrawler fromViewCrawler={false} /> },
    { path: "/editCrawler", element: <AddCrawler fromViewCrawler={true} /> },
    { path: "/userList", element: <UserList /> },
    { path: "/createUser", element: <CreateUser edit={false} /> },
    { path: "/editUser", element: <CreateUser edit={true} /> },
    { path: "/addExclusion", element: <AddExclusion /> },
    {
      path: "/editPolicy",
      element: (
        <NewPolicy
          edit={false}
          fromViewPolicy={true}
          showImportButton={true}
          customCreatedB={false}
        />
      ),
    },
    { path: "/cache", element: <Cache /> },
  ];

  function getPrivateRoutes() {
    const routes = [];
    if (adminIdx > 0) {
      // Add common and admin-specific routes
      routes.push(...commonRoutes, ...adminRoutes);
    } else if (researchIdx > 0) {
      const emailId1 = emailId; // Add logic here if necessary
      routes.push(...commonRoutes);
      if (changesTabFields.userId === emailId1 || !changesTabFields.userId) {
        routes.push({
          path: "/editPolicy",
          element: (
            <NewPolicy
              edit={false}
              fromViewPolicy={true}
              showImportButton={true}
              customCreatedB={false}
            />
          ),
        });
      }
    }
    return routes.map((route, index) => <Route key={index} {...route} />);
  }

  const CustomIdleTimer = ({
    onIdle,
    timeout,
  }: {
    onIdle: () => void;
    timeout: number;
  }) => {
    return (
      <IdleTimer
        element={document}
        onIdle={onIdle}
        debounce={2500}
        timeout={timeout}
      />
    );
  };
  if (loading) {
    return ShowSpinnerInDialogBox(loading);
  }
  if (!isLoggedIn) {
    return (
      <>
        <Dialogbox
          message={dialogState.message}
          title={dialogState.title}
          open={dialogState.isDialog}
          onClose={() => {
            dispatch({ type: DIALOG, payload: {isDialog:false} });
          }}
          actions={
            <CustomButton
              style={{
                color: "white",
                fontSize: 12,
                backgroundColor: navyColor,
              }}
              onClick={() => {
                dispatch({ type: DIALOG, payload: {isDialog:false} });
              }}
            >
              Ok
            </CustomButton>
          }
        />

        <Login
          onUserLoginSuccess={(success: boolean) => setIsloggedIn(success)}
        />
      </>
    );
  } else {
    return (
      <CacheProvider value={emotionCache}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CustomIdleTimer onIdle={handleIdle} timeout={20 * 60 * 1000} />
            {/* 20 minutes */}
            <CustomIdleTimer onIdle={handleLogout} timeout={23 * 60 * 1000} />
            {/* 23 minutes */}
            <Dialogbox
              fullWidth
              maxWidth="xs"
              open={isTimedOut}
              onClose={handleStayLoggedIn}
              disableBackdropClick={true}
              title={
                <>
                  <ErrorOutlineRoundedIcon
                    style={{
                      fontSize: "30px",
                      marginLeft: "5px",
                      color: "red",
                    }}
                  />
                  Session Timeout
                </>
              }
              message={
                <>
                  <p style={{ textAlign: "left", fontSize: "16px" }}>
                    You will be logged out in
                    <span style={{ color: "red" }}>{seconds}</span> seconds.
                  </p>
                  <p style={{ textAlign: "left", fontSize: "16px" }}>
                    Please respond to stay logged in.
                  </p>
                </>
              }
              actions={
                <ButtonGroup>
                  <CustomButton
                    onClick={handleStayLoggedIn}
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      fontSize: 12,
                      size: "small",
                      textTransform: "capitalize",
                      marginRight: 10,
                    }}
                  >
                    Yes
                  </CustomButton>
                  <CustomButton
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      size: "small",
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}
                  >
                    No
                  </CustomButton>
                </ButtonGroup>
              }
            />
            <Router>
              <DashboardLayout onLogout={() => setIsloggedIn(false)}>
                {ShowSpinnerInDialogBox(updatedState.isLoading)}
                <Dialogbox
                  message={dialogState.message}
                  title={dialogState.title}
                  onClose={() => {
                    dispatch({ type: DIALOG, payload: {isDialog:false} });
                  }}
                  open={dialogState.isDialog}
                  actions={
                    <CustomButton
                      style={{
                        color: "white",
                        textTransform: "capitalize",
                        fontSize: 12,
                        backgroundColor: navyColor,
                      }}
                      onClick={() => {
                        dispatch({ type: DIALOG, payload: {isDialog:false} });
                      }}
                    >
                      Ok
                    </CustomButton>
                  }
                />
                <Suspense fallback={ShowSpinnerInDialogBox(true)}>
                  <Routes>
                  <Route path="/" element={<Navigate replace to="/search" />} />
                  <Route path="/search" element={<SearchCache/>}></Route>
                  <Route path="/policyView" element={<PolicyDisplay />}></Route>
                  {/* currently not using */}
                  {/* <Route
                    path="/ClientgroupExclusions"
                    element={<ClientgroupExclusions />}
                  ></Route> */}
                  <Route
                    path="/NewClientSetUp"
                    element={<NewClientSetUp />}
                  ></Route>

                  <Route path="/viewConfig" element={<ViewConfig />}></Route>
                  <Route path="/viewMeta" element={<ViewMeta />}></Route>
                  <Route path="/viewPolicy" element={<ViewPolicy />}></Route>
                  <Route path="/claim" element={<Claim />}></Route>
                  <Route
                    path="/testingReport"
                    element={<TestingReport />}
                  ></Route>
                  <Route
                    path="/configValidation"
                    element={<ConfigValidationReport />}
                  ></Route>
                  <Route path="/rbrvsReport" element={<RbrvsReport />}></Route>
                  {getPrivateRoutes().map((r, index) => (
                    <Route key={index} {...r.props} element={<ErrorBoundary>{r.props.element}</ErrorBoundary>} />
                  ))}
                  </Routes>
                </Suspense>
              </DashboardLayout>
            </Router>
          </ThemeProvider>
        </LocalizationProvider>
      </CacheProvider>
    );
  }
};

export default App;
