import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  disabledColor,
  navyColor,
} from "../../../assets/jss/material-kit-react";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import { getUserList } from "../../../redux/ApiCalls/UserApis/UserApis";
// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { UserState } from "../../../redux/reducers/UserReducer/UserReducer";
import "../NewPolicy.css";
import { PolicyConstants } from "../PolicyConst";
import AgGrids from "../../../components/TableGrid/AgGrids";
import { Changescolumns } from "../Columns";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { CHANGES_TAB_FIELDS } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../newPolicyUtils";

const _ = require("lodash");

const colStyle = {
  backgroundColor: navyColor,
  color: "white",
  fontWeight: "400px",
  fontFamily: "Arial, Helvetica, sans-serif",
  width: "130px",
};
const userIdStyle = {
  backgroundColor: navyColor,
  color: "white",
  fontWeight: "400px",
  fontFamily: "Arial, Helvetica, sans-serif",
  width: "150px",
};
const JiraLink = {
  backgroundColor: navyColor,
  color: "white",
  fontWeight: "400px",
  fontFamily: "Arial, Helvetica, sans-serif",
  width: "250px",
};

const Changes = ({ edit, viewMode,showAllErrors }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [role1, setRole] = useState(false);
  const [research, setResarch] = useState(false);
  const [isJiraValid, setIsJiraValid] = useState(false);
  const [numberofRows, setNumberOfRows] = useState(0);
  const userDataCM = userData?.map((rs) => {
    return { label: rs.emailId, value: rs.emailId };
  });

  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  const roleState: UserState = useSelector((state: any) => state.userReducer);
  // let emailId1 = JSON.parse(sessionStorage.getItem("user-info"))?.emailId;
  let emailId1 = localStorage.getItem("emailId");
  // let one = JSON.parse(sessionStorage.getItem("user-info"));
  let emailTest = {
    // label: one.emailId,
    // value: one.emailId,
    label: emailId1,
    value: emailId1,
  };
  const location = useLocation();
  const paths = location.pathname.replaceAll("/", "");

  useEffect(() => {
    if (edit) {
      if (changesTabFields?.userId) {
        changesTabFields.userId = changesTabFields.userId;
      } else {
        changesTabFields.userId = emailId1;
      }
    } else {
      dispatch({ type: CHANGES_TAB_FIELDS, payload: { userId: emailId1 } });
      // changesTabFields.userId = emailId1;
    }
  }, []);
  useEffect(() => {
    if (
      changesTabFields.isJiraValid != "" &&
      changesTabFields.isJiraValid != undefined &&
      changesTabFields.jiraDesc != "" &&
      changesTabFields.jiraDesc != undefined
    ) {
      setIsJiraValid(true);
    } else {
      setIsJiraValid(false);
    }
  }, []);
  
  useEffect(() => {
    const changesData = changesTabFields?.changesTableData?.map((gt) => {
      return {
        ...gt,
        id: gt.jiraId,
        updatedOn: new Date(gt.updatedOn), // Store as Date object
      };
    });
    setData(changesData);
    setNumberOfRows(changesData.length);
  }, [changesTabFields?.changesTableData?.length]);

  useEffect(() => {
    if (updatedState.users.length == 0) {
      getUserList(dispatch);
    }
  }, []);

  const updatedState: UserState = useSelector(
    (state: any) => state.userReducer
  );
  useEffect(() => {
    setUserData(updatedState.users);
  }, [updatedState.users]);

  useEffect(() => {
    if (edit) {
      setOnShow(!onShow);
    }
  }, []);
  useEffect(() => {
    if (edit) {
      if (
        changesTabFields.jiraId == "" &&
        changesTabFields.jiraDesc == "" &&
        changesTabFields?.changesTableData.length == 0
      ) {
        setOnShow(onShow);
      }
    }
    if (paths == PolicyConstants.VIEW_POLICY) {
      if (
        changesTabFields.jiraId == "" &&
        changesTabFields.jiraDesc == "" &&
        changesTabFields?.changesTableData.length == 0
      ) {
        setOnShow(!onShow);
      }
    }
  }, [changesTabFields]);

  // let userDetails = sessionStorage.getItem("user-info");

  useEffect(() => {
    let data = roleState.roleName;
    let Role = JSON.stringify(data);
    let adminIdx = Role.toLocaleLowerCase().search("admin");
    let researchIdx = Role.toLocaleLowerCase().search("research");
    if (adminIdx > 0) {
      setRole(true);
    }
    if (researchIdx > 0) {
      setResarch(true);
    }
  }, [roleState]);

  const [onShow, setOnShow] = useState(edit);
  const [showBorder, setShowBorder] = useState(false);
  useEffect(() => {
    if (changesTabFields.changesTableData?.length == 0 && onShow) {
      setShowBorder(true);
    }
    if (changesTabFields.changesTableData?.length == 0 && !onShow) {
      setShowBorder(false);
    }
    if (changesTabFields.changesTableData?.length > 0 && onShow) {
      setShowBorder(true);
    }
  }, [onShow]);

  useEffect(() => {
    //@ts-ignore
    if (changesTabFields.jiraIsOpen == 1 ? true : false) {
      setOnShow(onShow);
    }
  }, []);
  function checkIsOpen() {}
  useEffect(() => {
    if (!edit) {
      setOnShow(!onShow);
    }
  }, []);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  function checkJiraId(jiraId) {
    let exists = false;
    changesTabFields.changesTableData?.find((gt) => {
      if (gt.jiraId === jiraId) {
        exists = true;
      }
    });
    return exists;
  }

  return (
    <div>
      <CustomPaper
        style={{
          paddingLeft: 10,
          position: "relative",
          right: 20,
          paddingRight: 8,
          paddingTop: 10,
          paddingBottom: 4,
          boxShadow: "none",
          height: "350px",
          border: showBorder ? "1px solid #D6D8DA" : "",
        }}
      >
        {edit ? (
          <IconButton
            onClick={() => {
              checkIsOpen();
              setOnShow(!onShow);
            }}
            style={{
              backgroundColor: viewMode ? disabledColor : navyColor,
              float: "right",
              color: "white",
              padding: 5,
              marginTop: -2,
            }}
            disabled={viewMode}
          >
            <Add />
          </IconButton>
        ) : undefined}
        <div
          style={{
            pointerEvents: viewMode ? "none" : "visible",
            opacity: viewMode ? 0.7 : 1,
          }}
        >
          <GridContainer style={{ marginTop: -15 }}>
            {onShow ? (
              <>
                <GridItem sm={1} md={1} xs={1}>
                  <CustomInput
                  error={showAllErrors ? isFieldInvalid(changesTabFields.jiraId) : false}              
                    fullWidth={true}
                    disabled={edit && isJiraValid}
                    labelText={"Jira ID"}
                    showStarIcon={true}
                    onChange={(event) => {
                      dispatch({
                        type: CHANGES_TAB_FIELDS,
                        payload: {
                          jiraLink:
                            "https://advancedpricing.atlassian.net/browse/" +
                            event.target.value,
                        },
                      });
                      if (checkJiraId(event.target.value?.trim())) {
                        dispatch({
                          type: CHANGES_TAB_FIELDS,
                          payload: { jiraId: undefined },
                        });
                      } else {
                        dispatch({
                          type: CHANGES_TAB_FIELDS,
                          payload: { jiraId: event.target.value },
                        });
                      }
                    }}
                    value={changesTabFields.jiraId?.trim()}
                    variant={"outlined"}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    error={showAllErrors ? isFieldInvalid(changesTabFields.jiraDesc) : false}              
                    fullWidth={true}
                    disabled={edit && isJiraValid}
                    labelText={"Jira Description"}
                    showStarIcon={true}
                    value={changesTabFields.jiraDesc}
                    onChange={(event) => {
                      dispatch({
                        type: CHANGES_TAB_FIELDS,
                        payload: { jiraDesc: event.target.value?.trim() },
                      });
                    }}
                    onBlur={(e) => {
                      dispatch({
                        type: CHANGES_TAB_FIELDS,
                        payload: { jiraDesc: e.target.value },
                      });
                    }}
                    variant={"outlined"}
                  />
                </GridItem>
                <GridItem sm={4} md={4} xs={4}>
                  <CustomInput
                    error={showAllErrors ? isFieldInvalid(changesTabFields.jiraLink) : false}              
                    disabled={edit && changesTabFields.jiraLink?.length > 0}
                    fullWidth={true}
                    value={changesTabFields.jiraLink}
                    labelText={"Jira Link"}
                    showStarIcon={true}
                    onChange={(event) => {}}
                    variant={"outlined"}
                  />
                </GridItem>
                {role1 && edit ? (
                  <GridItem sm={3} md={3} xs={3}>
                    <CustomSelect
                      options={userDataCM}
                      labelText={"User ID"}
                      showStarIcon={true}
                      onSelect={(e) => {
                        if (e != null) {
                          dispatch({
                            type: CHANGES_TAB_FIELDS,
                            payload: { TempUser: e },
                          });
                        }
                      }}
                      value={
                        changesTabFields.TempUser?.label === "" ||
                        changesTabFields.TempUser?.label === undefined
                          ? emailTest
                          : changesTabFields.TempUser
                      }
                    />
                  </GridItem>
                ) : (
                  <GridItem sm={3} md={3} xs={3}>
                    <CustomInput
                      fullWidth={true}
                      labelText={"User ID"}
                      value={changesTabFields?.userId}
                      onChange={(event) => {
                        dispatch({
                          type: CHANGES_TAB_FIELDS,
                          payload: { userId: event.target.value },
                        });
                      }}
                      disabled={edit && research}
                      variant={"outlined"}
                    />
                  </GridItem>
                )}
                <GridItem sm={1} md={1} xs={1}>
                  <div style={{ marginTop: 12 }}>
                    <CustomCheckBox
                      style={{ marginLeft: -20, marginTop: 18 }}
                      checked={changesTabFields.jiraIsOpen == 1}
                      label={<span style={{ fontSize: "12px" }}>Open</span>}
                      onChange={(event) => {
                        // formState.jiraIsOpen = event.target.checked ? 1 : 0;
                        dispatch({
                          type: CHANGES_TAB_FIELDS,
                          payload: { jiraIsOpen: event.target.checked },
                        });
                      }}
                    />
                  </div>
                </GridItem>
              </>
            ) : undefined}
          </GridContainer>
        </div>
        <GridContainer>
          <GridItem sm={12} md={12} xs={12}>
            {edit && data.length > 0 ? (
              <>
                <div
                  style={{ height: "250px", marginTop: onShow ? "" : "20px" }}
                >
                  <AgGrids
                    columnDefs={Changescolumns}
                    showGridFilters={true}
                    rowData={data}
                    onFilterChanged={onFilterChanged}
                  />
                </div>
              </>
            ) : undefined}
          </GridItem>
        </GridContainer>
      </CustomPaper>
      <small style={{ position: "relative", fontSize: "12px", top: "7px" }}>
        Number of rows : {numberofRows}
      </small>
    </div>
  );
};

export default Changes;
