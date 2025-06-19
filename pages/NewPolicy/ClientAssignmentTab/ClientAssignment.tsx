import { ButtonGroup, DialogContent, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import _ from "lodash";
import { default as moment, default as Moment } from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dangerColor, navyColor } from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import Dialogbox from "../../../components/Dialog/DialogBox";
import { exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import GridItem from "../../../components/Grid/GridItem";
import RadioButton from "../../../components/RadioButton/RadioButton";
import AgGrids from "../../../components/TableGrid/AgGrids";
import { apiUrl, policyConfigUrl } from "../../../configs/apiUrls";
import { addChangesData, getChangesById, getChangesId } from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { DIALOG } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  deleteClientAssignmentData,
  editClientAssignment,
  getActiveClientGroups,
  getActiveClientGroupsNotHp,
  getClientAssignmentData,
  postClientAssignment,
} from "../../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { getClientgroupData } from "../../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import { NEW_POLICY_CREATE_ARRAY } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "../NewPolicy.css";
import { NewPolicyPopState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyPopReducer";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { ClientAssignmentState } from "../../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import JiraComponent from "../JiraComponent";

const ClientAssignment = ({
  fromViewPolicy,
  policyId,
  edit,
  forClientTabPolicyId,
}) => {
  const [numberOfRows, setNumberOfRows] = useState(0);

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const [rowData, setRowData] = useState([]);
  const [orginalData, setOrginalData] = React.useState([]);
  const [clientAssignmentData, setClientAssignmentData] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  const dispatch = useDispatch();

  const ClientAssignmentColumns = {
    policyClntAssmtKey: undefined,
    policyId: undefined,
    clientCode: undefined,
    clientName: undefined,
    clientGroupId: undefined,
    clientGroupCode: undefined,
    clientGroupName: undefined,
    clientStartDate: undefined,
    clientEndDate: undefined,
    excludeClientSpecificCodes: undefined,
    hp: undefined,
  };
  const fullWidth = true;
  const maxWidth = "sm";

  const [deletedById, setDeletedById] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [openedit, setOpenedit] = React.useState(false);
  const [opendelete, setOpendelete] = React.useState(false);
  const [clientAssignment, setClientAssignment] = useState(
    ClientAssignmentColumns
  );
  const [clientGroupCode, setClientGroupCode] = React.useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [totalData, setTotalData] = React.useState([]);
  const [excludeData, setExcludeData] = React.useState(1);
  const [startDate, setStartDate] = React.useState(undefined);
  let checkFileds = false;
  const [fieldError, setFiledError] = useState(false);
  const [jiraId, setJiraId] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");
  const updatedState = useSelector((state: any) => state.clientPolicy);

  const policyCreateState: NewPolicyPopState = useSelector(
    (state: any) => state.policyCreation
  );

  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );
  const clientAssignmentTabFields: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );

  const activeClients =
    policyCreateState.newpolicyCreateArray.addAllActiveClients;
  const newPolicyCloneClientPopUpValue =
    policyCreateState.newpolicyCreateArray.cloneClientAssignmentTab;
  let newPolicyClientStartDate =
    policyCreateState.newpolicyCreateArray.newPolicyStartDate;

  useEffect(() => {
    if (policyId != null) {
      getChangesId(dispatch, policyId);
    }
  }, [policyId]);

  const refreshJiraDetails = () => {
    setJiraId("");
    setJiraDescription("");
  };

  const handleToClose = () => {
    setInputValue("");
    setOpenedit(false);
    setOpendelete(false);
    setIsDelete(false);
    refreshJiraDetails();
    setFiledError(false);
  };

  function editData() {
    setOpenedit(true);
    setTotalData([]);
    setInputValue("");
  }
  const handleClickToCancel = () => {
    refreshJiraDetails();
    setOpenedit(false);
    setFiledError(false);
    setOpendelete(false);
  };

  const DeletedMethod = () => {
    setOpendelete(true);
    setIsDelete(false);
  };

  const handleDelete = async () => {
    const jiraIdNotExist = await handlechanges();
    if (jiraIdNotExist) {
      setIsDelete(false);
      setOpendelete(false);
      deleteClientAssignmentData(dispatch, deletedById, policyId);
      refreshJiraDetails();
      setFiledError(false);
    }
  };
  const handleClickToCloseEdit = () => {
    refreshJiraDetails();
    setOpenedit(false);
    setOpendelete(false);
    setIsDelete(false);
  };

  function deleteData() {
    refreshJiraDetails();
    setOpendelete(false);
    setIsDelete(true);
  }

  useEffect(() => {
    if (edit) {
      dispatch({ type: NEW_POLICY_CREATE_ARRAY, payload: [] });
    }
  }, [edit]);
  useEffect(() => {
    if (updatedState.getClientExclusion.length === 0) {
      getClientgroupData(dispatch);
    }
  }, [updatedState.getClientExclusion]);
  useEffect(() => {
    if(clientAssignmentTabFields.getActiveClientData?.length === 0){
      getActiveClientGroups(dispatch);
    }
  }, [
    policyId,
    fromViewPolicy,
    clientAssignmentTabFields?.getActiveClientData.length,
    dispatch,
  ]);

  useEffect(() => {
    if (
      newPolicyCloneClientPopUpValue &&
      !fromViewPolicy &&
      forClientTabPolicyId
    ) {
      getClientAssignmentData(dispatch, forClientTabPolicyId);
    }
  }, [
    newPolicyCloneClientPopUpValue,
    forClientTabPolicyId,
    dispatch,
    fromViewPolicy,
  ]);


  useEffect(() => {
    if (policyCreateState.newpolicyCreateArray.addAllActiveClients) {
      getActiveClientGroupsNotHp(dispatch);
    }
  }, [dispatch, policyCreateState.newpolicyCreateArray.addAllActiveClients]);

  const exportButtonStyle = {
    backgroundColor: navyColor,
    color: "white",
    position: "relative",
    right: 20,
    boxShadow: "none",
    padding: 4,
    fontSize: 12,
    textTransform: "capitalize",
    marginTop: 8,
    marginRight: 4,
    justifyContent: "center",
    opacity: clientAssignmentData.length > 0 ? 1 : 0.7,
    float: "right",
  };

  function resetLookup() {
    setClientAssignment(ClientAssignmentColumns);
    setTotalData([]);
    setClientGroupCode([]);
    clientAssignment.clientGroupCode = [];
    setFiledError(false);
  }

  let clientGroupExclusion = clientAssignmentTabFields?.getActiveClientData
    .filter(
      (k) =>
        k.clientCode === inputValue ||
        k.clientCode === clientAssignment.clientCode
    )
    .map((k) => {
      return {
        label: k.clientGroupCode,
        value: k.clientGroupCode,
        id: k.clientGroupId,
      };
    });

  function check() {
    if (
      clientAssignment.clientCode == undefined ||
      clientAssignment.clientCode == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      clientAssignment.clientGroupCode == undefined ||
      clientAssignment.clientGroupCode == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      clientAssignment.clientStartDate == undefined ||
      clientAssignment.clientStartDate == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      (isEdit && clientAssignment.clientEndDate == undefined) ||
      clientAssignment.clientEndDate == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (jiraId == "" || jiraId == undefined) {
      checkFileds = true;
      setFiledError(true);
    }
    if (jiraDescription == "" || jiraDescription == undefined) {
      checkFileds = true;
      setFiledError(true);
    }
    return checkFileds;
  }

  function removeRowByPolicyClntAssmtKey(rowData, key) {
    return rowData.filter((row) => row.policyClntAssmtKey !== key);
  }

  function dateCheck(d1, d2) {
    let flag = false;
    if (d1 < d2) {
      flag = true;
    }
    return flag;
  }

  function checkDates(d) {
    let flag = false;
    let clientStartDate = moment(clientAssignment.clientStartDate).format(
      "YYYY-MM-DD"
    );
    let clientEndDate = moment(clientAssignment.clientEndDate).format(
      "YYYY-MM-DD"
    );
    let defaultEndDate = moment(d.clientEndDate).format("YYYY-MM-DD");
    if (isEdit) {
      if (!dateCheck(clientStartDate, clientEndDate)) {
        flag = true;
      } else if (startDate !== clientStartDate && clientStartDate < startDate) {
        flag = true;
      }
    } else if (clientStartDate < defaultEndDate) {
      flag = true;
    }
    return flag;
  }

  function duplicateCheck() {
    let checkDuplicate = false;
    let clientEndDate = "";
    let existedClientGroupCodes = [];
    if (isEdit) {
      setRowData(
        removeRowByPolicyClntAssmtKey(
          rowData,
          clientAssignment.policyClntAssmtKey
        )
      );
    } else {
      clientAssignment.clientGroupCode =
        clientGroupCode.length > 0 ? clientGroupCode : clientGroupExclusion;
    }
    rowData.forEach((d) => {
      if (d.clientCode === clientAssignment.clientCode && checkDates(d)) {
        clientAssignment?.clientGroupCode?.forEach((k) => {
          if (k.value === d.clientGroupCode) {
            checkDuplicate = true;
            existedClientGroupCodes.push(d.clientGroupCode);
            clientEndDate = d.clientEndDate;
          }
        });
      }
    });

    return [checkDuplicate, clientEndDate, existedClientGroupCodes];
  }

  const fillRequiredFields = () => {
    return dispatch({
      type: DIALOG,
      payload: {isDialog:true,
        title: "Error",
      message: "Please fill in required fields"}
    });
  };

  async function saveDiag() {
    let error = check();
    let duplicate = duplicateCheck();
    if (error) {
      fillRequiredFields();
    } else if (duplicate[0]) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message:
          duplicate[1] == "9999-12-31"
            ? `A record for client group codes ` +
              duplicate[2] +
              ` already exists. Please check the end date`
            : `Record already exists. Please enter the valid start date.`}
      });
    } else {
      const jiraIdNotExist = await handlechanges();
      if (jiraIdNotExist) {
        if (!isEdit) {
          postClientAssignment(dispatch, totalData, policyId);
        } else {
          editClientAssignment(dispatch, clientAssignment, policyId);
        }
        setOpenedit(false);
        refreshJiraDetails();
      }
    }
    getClientAssignmentData(dispatch, policyId);
  }
  const todaysDate = new Date();

  const showTableData = useCallback(() => {
    if (!edit) {
      if (activeClients) {
        // return newpolicyState.getActiveClientData;
        return clientAssignmentTabFields?.getActiveClientDataNotHp;
      } else {
        if (newPolicyCloneClientPopUpValue && forClientTabPolicyId) {
          return clientAssignmentTabFields?.getClientAssignmentTableData;
        } else {
          return [];
        }
      }
    } else {
      return clientAssignmentTabFields?.getClientAssignmentTableData;
    }
  }, [
    edit,
    activeClients,
    newPolicyCloneClientPopUpValue,
    forClientTabPolicyId,
    clientAssignmentTabFields.getActiveClientData,
    clientAssignmentTabFields.getClientAssignmentTableData,
  ]);

  let [exportedData, setExportedData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      let clientAssignmentData = [];
      let data;
      setClientAssignmentData([]);
      if(activeClients || clientAssignmentTabFields?.getClientAssignmentTableData?.length > 0){
       data = await showTableData();
      }
      data?.forEach((k) => {
        clientAssignmentTabFields?.getActiveClientData?.forEach((d) => {
          if (d.clientGroupId === k.clientGroupId) {
            clientAssignmentData.push({
              policyId: k.policyId,
              policyClntAssmtKey: k.policyClntAssmtKey,
              clientCode: d.clientCode,
              clientName: d.clientName,
              clientGroupId: d.clientGroupId,
              clientGroupCode: d.clientGroupCode,
              clientGroupName: d.clientGroupName,
              clientStartDate: newPolicyClientStartDate
                ? moment(newPolicyClientStartDate).format("MM-DD-YYYY")
                : moment(k.clientStartDate).format("MM-DD-YYYY"),
              clientEndDate: k.clientEndDate
                ? moment(k.clientEndDate).format("MM-DD-YYYY")
                : "12-31-9999",
              excludeClientSpecificCodes:
                k.excludeClientSpecificCodes === false ? "No" : "Yes",
              hp: k.hp === true ? 1 : 0,
              createDate: k.createDate
                ? moment(k.createDate).format("MM-DD-YYYY")
                : moment(todaysDate).format("MM-DD-YYYY"),
              updateDate: k.updateDate
                ? moment(k.updateDate).format("MM-DD-YYYY")
                : moment(todaysDate).format("MM-DD-YYYY"),
            });
          }
        });
      });
      // Sort the clientAssignmentData
      clientAssignmentData.sort((a, b) =>
        a.clientCode.localeCompare(b.clientCode)
      );

      setExportedData(clientAssignmentData);
      setNumberOfRows(clientAssignmentData.length);
      // Set the processed data
      setRowData(clientAssignmentData);
      let groupedData = preprocessData(clientAssignmentData);
      setOrginalData(groupedData);
      setClientAssignmentData(groupedData);
    };

    fetchData(); // Call the async function to fetch data
  }, [showTableData]);

  useEffect(() => {
    let desc = [];
    clientAssignmentTabFields.getActiveClientData?.forEach((k) => {
      if (clientGroupCode.length > 0) {
        clientGroupCode.forEach((f) => {
          if (f.id === k.clientGroupId) {
            desc.push(k);
          }
        });
      } else if (inputValue === k.clientCode) {
        desc.push(k);
        clientAssignment.clientGroupCode = [
          {
            label: k.clientGroupCode,
            value: k.clientGroupCode,
            id: k.clientGroupId,
          },
        ];
      }
    });

    let data;
    data = desc.map((d, i) => {
      return {
        policyId: policyId,
        clientGroupId: d.clientGroupId,
        hp: d.hp === true ? 1 : 0,
        clientStartDate: clientAssignment.clientStartDate,
        clientEndDate: "9999-12-31",
        excludeClientSpecificCodes: excludeData,
      };
    });
    setTotalData(data);
  }, [clientGroupCode, clientAssignment, inputValue]);

  const suggestionsList = document.getElementById(
    "suggestionList"
  ) as HTMLElement;
  if (suggestionsList) {
    const options = suggestionsList.children.length;

    if (options < 2) {
      suggestionsList.style.overflowY = "hidden";
    } else {
      suggestionsList.style.overflowY = "scroll";
    }
  }

  useEffect(() => {
    if (!isEdit) {
      setExcludeData(clientAssignment.excludeClientSpecificCodes ?? 1);
    } else {
      setExcludeData(
        clientAssignment.excludeClientSpecificCodes === "Yes" ||
          clientAssignment.excludeClientSpecificCodes === "True" ||
          clientAssignment.excludeClientSpecificCodes === 1
          ? 1
          : 0
      );
    }
  }, [clientAssignment.excludeClientSpecificCodes]);

  const handleInputChange = (event) => {
    let value = event.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = clientAssignmentTabFields.getActiveClientData
        .filter((k) => {
          const clientCodeLower = k.clientCode?.toLowerCase();
          if (
            clientCodeLower.includes(value?.toLowerCase()) &&
            !seen.has(clientCodeLower)
          ) {
            seen.add(clientCodeLower);
            return true;
          }
          return false;
        })
        .map((k) => ({ label: k.clientCode, value: k.clientCode }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
      setClientGroupCode([]);
      clientAssignment.clientGroupCode = [];
      clientAssignment.clientCode = "";
    }
  };

  const handlechanges = async () => {
    if (
      jiraId == undefined ||
      jiraId == "" ||
      jiraDescription == undefined ||
      jiraDescription == ""
    ) {
      fillRequiredFields();
      setFiledError(true);
      return false;
    } else if (
      changesTabFields.changesTableData?.find((obj) => obj.jiraId === jiraId) ||
      changesTabFields.jiraId ==jiraId
    ) {
      setIsDelete(false);
      setOpendelete(false);
      setOpenedit(false);
      refreshJiraDetails();
      CustomSwal("error", "Jira Id already Exists", navyColor, "OK", "");
      setFiledError(false);
      return false;
    } else {
      addChangesData(dispatch, policyId, jiraId, jiraDescription);
      setFiledError(false);
      return true;
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    clientAssignment.clientCode = value;
    setSuggestions([]);
  };

  const preprocessData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.clientCode]) {
        acc[item.clientCode] = { ...item, expanded: false, children: [] };
      } else {
        acc[item.clientCode].children.push({
          ...item,
          expanded: false, // Initialize expanded for child items as well
        });
      }
      return acc;
    }, {});
    return Object.values(groupedData);
  };

  const flattenData = (data) => {
    const flatData = [];
    data.forEach((item) => {
      flatData.push(item);
      if (item.children) {
        flatData.push(...flattenData(item.children));
      }
    });
    return flatData;
  };

  const onFilterChanged = (event) => {
    const filterModel = event.api.getFilterModel();
    const isFilterModelEmpty =
      Object.keys(filterModel).length === 0 &&
      filterModel.constructor === Object;

    if (isFilterModelEmpty) {
      setClientAssignmentData(orginalData);
      const flatData = flattenData(orginalData);
      setNumberOfRows(flatData.length);
      event.api.refreshCells({ force: true }); // Force re-rendering
      setExportedData(rowData);
      return;
    }

    // Extract filter values for each column
    const filters = {
      clientGroupCode: filterModel?.clientGroupCode?.filter || "",
      clientCode: filterModel?.clientCode?.filter || "",
      clientName: filterModel?.clientName?.filter || "",
      clientGroupName: filterModel?.clientGroupName?.filter || "",
      clientGroupId: filterModel?.clientGroupId?.filter || "",
      clientStartDate: filterModel?.clientStartDate?.filter || "",
      clientEndDate: filterModel?.clientEndDate?.filter || "",
      createDate: filterModel?.createDate?.filter || "",
      updateDate: filterModel?.updateDate?.filter || "",
      excludeClientSpecificCodes:
        filterModel?.excludeClientSpecificCodes?.filter || "",
      hp: filterModel?.hp?.filter || "",
    };

    const areAllFiltersEmpty = Object.values(filters).every(
      (value) => value === ""
    );

    if (areAllFiltersEmpty) {
      setClientAssignmentData(orginalData);
      const flatData = flattenData(orginalData);
      setNumberOfRows(flatData.length);
      event.api.refreshCells({ force: true }); // Force re-rendering
    } else {
      const filteredData = filterData(filters);
      setExportedData(filteredData);
      const groupedData = preprocessData(filteredData);
      setClientAssignmentData(groupedData);
      setNumberOfRows(filteredData.length);
      event.api.refreshCells({ force: true }); // Force re-rendering
    }
  };

  const filterData = (filters) => {
    const flatData = flattenData(orginalData);

    return flatData.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true;

        const itemValue = item[key]?.toString().toLowerCase() || "";
        return itemValue.includes(filterValue.toLowerCase());
      });
    });
  };
  const HideData = (field) => {
    return (params) => {
      const filterModel = params.api.getFilterModel(); // Get the filter model from the grid API
      // Check if there is a filter applied to the specified field
      const isFilterApplied =
        filterModel && filterModel[field] && filterModel[field].filter;

      // Display value based on filter state
      if (isFilterApplied) {
        return params.value; // Show value if filter is applied
      } else {
        // Show value only if the row is expanded
        return params.node.data.expanded
          ? params.value
          : params.node.data.children.length === 0
          ? params.value
          : "";
      }
    };
  };

  const ExpandCellRenderer = ({ value, data, context }) => {
    const handleExpandCollapse = () => {
      // context.setExpandedState(data.clientCode, !data.expanded);

      const gridBody = document.querySelector(".ag-body-viewport");
      const currentScrollTop = gridBody ? gridBody.scrollTop : 0;

      context.setExpandedState(data.clientCode, !data.expanded);

      // Use setTimeout to ensure the grid updates before resetting scroll position
      setTimeout(() => {
        if (gridBody) {
          gridBody.scrollTop = currentScrollTop;
        }
      }, 0);
    };
    const showIcon = data.children && data.children.length > 0;
    return (
      <span>
        {showIcon && (
          <span
            style={{ cursor: "pointer", marginRight: 5 }}
            onClick={handleExpandCollapse}
          >
            {data.expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          </span>
        )}
        <span style={{ marginLeft: showIcon ? 0 : 30 }}>{value}</span>
      </span>
    );
  };

  const setExpandedState = (clientCode, isExpanded) => {
    const updatedData = clientAssignmentData.map((item) => {
      if (item.clientCode === clientCode) {
        return {
          ...item,
          expanded: isExpanded,
          children: item.children.map((child) => ({
            ...child,
            expanded: isExpanded, // Update child rows based on the parent state
          })),
        };
      }
      // Do not collapse other rows; only update the clicked row
      return { ...item };
    });
    setClientAssignmentData(updatedData);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Client Code",
        field: "clientCode",
        cellRendererFramework: ExpandCellRenderer,
        minWidth: 100,
      },
      {
        field: "clientName",
        headerName: "Client Name",
        minWidth: 100,
        headerTooltip: "Client Name",
      },
      {
        field: "clientGroupId",
        headerName: "Client Group ID",
        minWidth: 120,
        headerTooltip: "Client Group ID",
        cellRendererFramework: HideData("clientGroupID"),
      },
      {
        field: "clientGroupCode",
        headerName: "Client Group Code",
        minWidth: 120,
        headerTooltip: "Client Group Code",
        // cellRendererFramework: (params) => {
        //     return params.node.data.expanded == true ? params.value : '';
        // }
        cellRendererFramework: HideData("clientGroupCode"),
      },
      {
        field: "clientGroupName",
        headerName: "Client Group Name",
        minWidth: 120,
        headerTooltip: "Client Group Name",
        cellRendererFramework: HideData("clientGroupName"),
      },
      {
        field: "clientStartDate",
        headerName: "Client Start Date",
        minWidth: 120,
        headerTooltip: "Client Start Date",
      },
      {
        field: "clientEndDate",
        headerName: "Client End Date",
        minWidth: 120,
        headerTooltip: "Client End Date",
      },
      {
        field: "excludeClientSpecificCodes",
        headerName: "Exclude Client Specific Codes",
        minWidth: 150,
        headerTooltip: "Exclude Client Specific Codes",
        cellRendererFramework: HideData("excludeClientSpecificCodes"),
      },
      {
        field: "hp",
        headerTooltip: "HP",
        headerName: "HP",
        minWidth: 70,
        cellRenderer: (data) => {
          return (
            <input
              type="checkbox"
              disabled
              checked={data.value == true ? true : false}
            />
          );
        },
      },

      {
        field: "createDate",
        headerName: "Create Date",
        minWidth: 100,
        headerTooltip: "Create Date",
      },
      {
        field: "updateDate",
        headerName: "Update Date",
        minWidth: 100,
        headerTooltip: "Update Date",
      },
      {
        field: "button",
        headerName: "Action",
        minWidth: 170,
        resizable: false,
        cellRenderer: (row) => {
          return (
            <ButtonGroup>
              <CustomButton
                variant="contained"
                style={{
                  height: 18,
                  marginTop: 1,
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: navyColor,
                  color: "white",
                  opacity: fromViewPolicy ? 0.7 : 1,
                }}
                disabled={edit && fromViewPolicy}
                onClick={() => {
                  let obj = _.cloneDeep(clientAssignment);
                  obj.policyClntAssmtKey = row.data.policyClntAssmtKey;
                  obj.clientCode = row.data.clientCode;
                  obj.clientName = row.data.clientName;
                  obj.clientGroupCode = row.data.clientGroupCode
                    ? [
                        {
                          label: row.data.clientGroupCode,
                          value: row.data.clientGroupCode,
                        },
                      ]
                    : row.data.clientGroupCode;
                  obj.clientGroupName = row.data.clientGroupName;
                  obj.clientGroupId = row.data.clientGroupId;
                  obj.clientStartDate = row.data.clientStartDate
                    ? Moment(row.data.clientStartDate).format("YYYY-MM-DD")
                    : "";
                  obj.clientEndDate = row.data.clientEndDate
                    ? Moment(row.data.clientEndDate).format("YYYY-MM-DD")
                    : "";
                  obj.excludeClientSpecificCodes =
                    row.data.excludeClientSpecificCodes === "Yes" ? 1 : 0;
                  obj.policyId = row.data.policyId;
                  obj.hp = row.data.hp;
                  setClientAssignment(obj);
                  setStartDate(
                    Moment(obj.clientStartDate).format("MM-DD-YYYY")
                  );
                  refreshJiraDetails();
                  setIsEdit(true);
                  editData();
                }}
              >
                Edit
              </CustomButton>

              <CustomButton
                variant="contained"
                style={{
                  height: 18,
                  marginTop: 1,
                  marginLeft: 3,
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: dangerColor,
                  color: "white",
                  left: "3px",

                  opacity: fromViewPolicy ? 0.7 : 1,
                }}
                onClick={() => {
                  setDeletedById(row.data.policyClntAssmtKey);
                  deleteData();
                }}
                disabled={edit && fromViewPolicy}
              >
                Delete
              </CustomButton>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  const flatData = useMemo(() => {
    return clientAssignmentData.reduce((acc, item) => {
      acc.push(item);
      if (item.expanded && item.children) {
        acc.push(...item.children);
      }
      return acc;
    }, []);
  }, [clientAssignmentData]);

  const gridContext = useMemo(
    () => ({
      setExpandedState,
    }),
    [setExpandedState]
  );

  let exportToExcel = async (data) => {
    if (data.length > 0) {
      let exportedData = data.map((d) => {
        return {
          CLIENTCODE: d.clientCode,
          CLIENTNAME: d.clientName,
          CLIENTGROUPID: d.clientGroupId,
          CLIENTGROUPCODE: d.clientGroupCode,
          CLIENTGROUPNAME: d.clientGroupName,
          CLIENTSTARTDATE: d.clientStartDate,
          CLIENTENDDATE: d.clientEndDate,
          EXCLUDECLIENTSPECIFICCODES: d.excludeClientSpecificCodes,
          HP: d.hp ? "Yes" : "No",
          CREATEDATE: d.createDate,
          UPDATEDATE: d.updateDate,
        };
      });
      await exportedExcelFileData(
        exportedData,
        `${policyFields.policyNumber}/${policyFields.version}`,
        "ClientAssignmentData"
      );
    }
  };

  const renderJiraDetails = () => {
    return (
      <JiraComponent
        jiraId={jiraId}
        jiraDescription={jiraDescription}
        fieldError={fieldError}
        setJiraId={setJiraId}
        setJiraDescription={setJiraDescription}
        existingJiraIds={[
          ...changesTabFields.changesTableData?.map((data) => data.id),
          changesTabFields.jiraId,
        ]}
      />
    );
  };

  return (
    <div style={{ height: window.innerHeight / 2.2 }}>
      <CustomPaper
        style={{
          paddingLeft: 10,
          position: "relative",
          right: 20,
          paddingRight: 8,
          paddingTop: 0,
          paddingBottom: 15,
          boxShadow: "none",
          border: clientAssignmentData.length > 0 ? "1px solid #D6D8DA" : "",
        }}
      >
      {edit ? ( <IconButton
          onClick={() => {
            editData();
            setIsEdit(false);
            resetLookup();
          }}
          style={{
            backgroundColor: navyColor,
            color: "white",
            padding: 5,
            marginTop: 2,
            opacity: fromViewPolicy ? 0.7 : 1,
            float: "right",
          }}
          disabled={false}
        >
          <Add />
        </IconButton>) : undefined}
        <div
          style={{
            height: window.innerHeight / 2.2,
            // opacity: fromViewPolicy ? 0.7 : 1,
          }}
        >
         <AgGrids
            columnDefs={columnDefs}
            animateRows={true}
            context={gridContext}
            rowData={flatData}
            onFilterChanged={onFilterChanged}
          />

          
        </div>
      </CustomPaper>
      <CustomButton
        variant={"contained"}
        style={exportButtonStyle}
        onClick={() => {
          exportToExcel(exportedData);
        }}
        disabled={clientAssignmentData.length === 0}
      >
        Export
      </CustomButton>

      {clientAssignmentData.length > 0 ? (
        <small style={{ position: "relative", fontSize: "12px" }}>
          Number of rows : {numberOfRows}
        </small>
      ) : undefined}

      <Dialogbox
        open={fromViewPolicy ? false : openedit}
        onClose={handleToClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        style={{ overflowY: "scroll" }}
        disableBackdropClick={true}
        title={isEdit ? "Edit Client Details" : "Add Client Details"}
        message={
          <DialogContent>
            <GridItem sm={12} md={12} xs={12}>
              {renderJiraDetails()}
              <div>
                <CustomInput
                  type="text"
                  error={
                    clientAssignment.clientCode == undefined ||
                    clientAssignment.clientCode == ""
                      ? fieldError
                      : false
                  }
                  labelText={"Client Code"}
                  showStarIcon={true}
                  variant={"outlined"}
                  disabled={isEdit}
                  value={isEdit ? clientAssignment.clientCode : inputValue}
                  onChange={handleInputChange}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-list"
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions-list" id="suggestionList">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.label)}
                        role="option"
                      >
                        {suggestion.label ? suggestion.label : suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="row">
                <div className="col-sm-10">
                  <CustomSelect
                    isMulti
                    checkBoxes={true}
                    // error={clientAssignment?.clientGroupCode?.length === 0 || clientAssignment?.clientGroupCode === undefined ? fieldError : false}
                    options={inputValue ? clientGroupExclusion : undefined}
                    labelText={"Client Group Code"}
                    isDisabled={isEdit}
                    onSelect={(e) => {
                      clientAssignment.clientGroupCode = e;
                      setClientGroupCode(e);
                    }}
                    value={
                      isEdit
                        ? clientGroupExclusion.filter(function (option) {
                            return (
                              option.value ==
                              clientAssignment.clientGroupCode[0].value
                            );
                          })
                        : clientGroupCode
                    }
                  />
                </div>
              </div>
              <CustomInput
                id="date"
                type="date"
                error={
                  clientAssignment.clientStartDate == undefined ||
                  clientAssignment.clientStartDate == ""
                    ? fieldError
                    : false
                }
                labelText={"Process Start Date"}
                showStarIcon={true}
                variant={"outlined"}
                onChange={(e) => {
                  let obj = _.cloneDeep(clientAssignment);
                  obj.clientStartDate = e.target.value;
                  setClientAssignment(obj);
                }}
                value={
                  isEdit
                    ? Moment(clientAssignment.clientStartDate).format(
                        "YYYY-MM-DD"
                      )
                    : undefined
                }
              />
              <CustomInput
                id="date"
                type="date"
                error={
                  clientAssignment.clientEndDate == undefined ||
                  clientAssignment.clientEndDate == ""
                    ? fieldError
                    : false
                }
                labelText={"Process End Date"}
                variant={"outlined"}
                disabled={!isEdit}
                value={
                  isEdit
                    ? Moment(clientAssignment.clientEndDate).format(
                        "YYYY-MM-DD"
                      )
                    : undefined
                }
                onChange={(e) => {
                  let obj = _.cloneDeep(clientAssignment);
                  obj.clientEndDate = e.target.value;
                  setClientAssignment(obj);
                }}
              />
              <div className="height"></div>
              <br></br>
              <span>Exclude Client Specific Codes</span>
              <RadioButton
                label={"Yes"}
                checked={excludeData == 1}
                onChange={(e) => {
                  let obj = _.cloneDeep(clientAssignment);
                  if (e.target.checked) {
                    setExcludeData(1);
                    obj.excludeClientSpecificCodes = 1;
                  }
                  clientAssignment.excludeClientSpecificCodes = obj;
                  setClientAssignment(obj);
                }}
              />
              <RadioButton
                label={"No"}
                checked={excludeData == 0}
                onChange={(e) => {
                  let obj = _.cloneDeep(clientAssignment);
                  if (e.target.checked) {
                    setExcludeData(0);
                    obj.excludeClientSpecificCodes = 0;
                  }
                  clientAssignment.excludeClientSpecificCodes = obj;
                  setClientAssignment(obj);
                }}
              />
            </GridItem>
            <ButtonGroup>
              <CustomButton
                onClick={saveDiag}
                // disabled={diagFromExist == true || diagToExist == true}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  margin: 10,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                save
              </CustomButton>
              <CustomButton
                onClick={() => {
                  handleClickToCancel();
                }}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  margin: 10,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                cancel
              </CustomButton>
            </ButtonGroup>
          </DialogContent>
        }
      />
      <Dialogbox
        open={fromViewPolicy ? false : opendelete}
        title={"Delete Client Details"}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleToClose();
        }}
        message={<div>{renderJiraDetails()}</div>}
        actions={
          <div>
            <CustomButton
              onClick={handleDelete}
              style={{
                backgroundColor: navyColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              save
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleClickToCancel();
              }}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              cancel
            </CustomButton>
          </div>
        }
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      ></Dialogbox>
      <Dialogbox
        open={isDelete}
        onClose={handleToClose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={"Would you like to Delete This Record ?"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={DeletedMethod}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={handleClickToCloseEdit}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    </div>
  );
};
export default ClientAssignment;
