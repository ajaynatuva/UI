import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  dangerColor,
  navyColor,
  successColor,
  goldColor,
  yellow,
  disabledColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import {
  DIALOG_CAT_RESET_STATE,
  DIALOG_REASON_RESET_STATE,
  RESET_STATE,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import NewPolicy from "../NewPolicy/NewPolicy";
import { getConfigValidation } from "../../redux/ApiCalls/ConfigValidationReportApis/ConfigValidApis";
import Dialogbox from "../../components/Dialog/DialogBox";
import { ButtonGroup } from "@material-ui/core";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../ViewPolicy/ViewPolicy.css";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import { CustomPolicyState } from "../../redux/reducers/CustomPolicyReducer/CustomPolicyReducer";
import {
  CLONE_ASSIGNMENT_CHECK,
  CLONE_TAXONOMY_CHECK,
  CUSTOM_JIRAID,
  CUSTOM_JIRA_DESCRIPTION,
  CUSTOM_JIRA_LINK,
  CUSTOM_NEW_POLICY_DATE,
  CUSTOM_POLICY_FORM_REST_STATE,
} from "../../redux/ApiCalls/CustomPolicyApis/CustomPolicyActionType";
import {
  onSaveCustomPolicy,
  validateCustomPolicyForm,
} from "../../redux/ApiCalls/CustomPolicyApis/CustomPolicyApis";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { GET_CLIENT_ASSIGNMENT_DATA } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { GET_TAXONOMY_DATA } from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpTypes";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { DetailsTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DetailsTabFieldsReducer";
import { changesTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { DescriptionTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { BillTypeState } from "../../redux/reducers/NewPolicyTabReducers/BillTypeReducer";
import { conditionCodeTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ConditionCodeTabFieldsReducer";
import { getTaxonomyOfPolicy } from "../../redux/ApiCalls/NewPolicyTabApis/TaxonomyApis";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { getActiveClientGroups } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import moment from "moment";
import AgGrids from "../../components/TableGrid/AgGrids";
import { taxonomyTabColumns } from "../NewPolicy/Columns";
import Taxonomy from "../NewPolicy/TaxonomyTab/Taxonomy";
import { populateCategoryFields } from "../NewPolicy/newPolicyUtils";
import { CLIENT_ASSIGNMENT_DATA } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyTabTypes";

const ViewPolicy = () => {
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const [hide, sethide] = useState(true);

  const [button, setbutton] = useState(false);
  const [clickOnConfirmation, setClickOnConfirmation] = useState(false);
  const [clickOnCreatedB, setClickOnCreatedB] = useState(false);
  const [taxonomyData, setTaxonomyData] = useState([]);
  const [selectedTaxonomyData, setSelectedTaxonomyData] = useState([]);

  const [review, setReview] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openTaxnomyPopUp, setOpenTaxonomyPopUp] = useState(false);
  
  const roleState: UserState = useSelector((state: any) => state.userReducer);

  
  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  
  const customFormState: CustomPolicyState = useSelector(
    (state: any) => state.customPolicy
  );
  const descTabFields: DescriptionTabFieldState = useSelector(
    (state: any) => state.DescTabFieldsRedux
  );
  const detailsTabFields: DetailsTabFieldState = useSelector(
    (state: any) => state.DetailsTabFieldsRedux
  );
  const catTabState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );
  const billTypeTabFields: BillTypeState = useSelector(
    (state: any) => state.billTypeTabFieldsRedux
  );
  const conditonTabFields: conditionCodeTabFieldState = useSelector(
    (state: any) => state.conditionCodeTabFieldsRedux
  );
  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  const clientAssignmentState: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );


  const fullWidth = true;
  const maxWidth = "sm";
  useEffect(() => {
    return () => {
      localStorage.setItem("jiraId", "");
    };
  }, []);
  let data = roleState.roleName;
  let Role = JSON.stringify(data);
  let testIdx = Role.toLocaleLowerCase().search("testing");
  let auditIdx = Role.toLocaleLowerCase().search("audit");
  let adminIdx = Role.toLocaleLowerCase().search("admin");
  let researchIdx = Role.toLocaleLowerCase().search("research");

  let emailId = localStorage.getItem("emailId");

  async function onConfigData() {
    let obj = {
      selectedType: "SINGLE_POLICY",
      policyId: policyFields.policyId,
      policyNumber: policyFields.policyNumber,
      policyVersion: policyFields.version,
      emailId: emailId,
    };
    await getConfigValidation(dispatch, obj);
  }

  const navigate = useNavigate();

  const navigate1 = () => {
    dispatch({ type: DIALOG_REASON_RESET_STATE });
    dispatch({ type: DIALOG_CAT_RESET_STATE });
    dispatch({ type: RESET_STATE });
    navigate("/search");
  };

  const onBack = () => {
    navigate("/editPolicy");
    setDisabled(false);
  };
  useEffect(() => {
    if (adminIdx > 0) {
      setbutton(false);
    } else if (changesTabFields.userId !== emailId) {
      setbutton(true);
    } else if (
      changesTabFields.userId == "" ||
      changesTabFields.userId === emailId
    ) {
      setbutton(false);
    }

    if (researchIdx > 0) {
      if (changesTabFields.userId !== emailId) {
        setbutton(true);
      }
      if (changesTabFields.userId === "") {
        setbutton(false);
      }
      if (
        adminIdx > 0 ||
        changesTabFields.userId == "" ||
        changesTabFields.userId === emailId
      ) {
        setbutton(false);
      }
    }
  }, [roleState.roleName, changesTabFields]);

  useEffect(() => {
    if (adminIdx > 0 || researchIdx > 0) {
      sethide(true);
    } else if (testIdx > 0 || auditIdx > 0) {
      sethide(false);
    } else {
      sethide(true);
    }
  }, [roleState]);

  const handleToClose = () => {
    setClickOnCreatedB(false);
    setOpenPopUp(false);
    dispatch({ type: CUSTOM_POLICY_FORM_REST_STATE });
    setClickOnConfirmation(false);
  };

  // taxonomy check box selection code
  const closeTaxnomyPopUp = () => {
    setOpenTaxonomyPopUp(false);
    setReview(false);
    if (gridApi.current.getSelectedRows().length === 0) {
      customFormState.cloneTaxonomyCheck = false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (openPopUp) {
        await getTaxonomyOfPolicy(dispatch, policyFields.policyId);
        await getActiveClientGroups(dispatch);
      }
    };
    fetchData();
  }, [openPopUp]);

  useEffect(() => {
    let taxonomyArrData = [];
    if (openPopUp) {
      newpolicyState.getTaxonomyData?.forEach((data) => {
        if (data.function === 1) {
          taxonomyArrData.push({
            taxonomyKey: data.taxonomyKey,
            clientCode:
              data.clientGroupId == 0
                ? "ALL"
                : clientAssignmentState.getActiveClientData?.find(
                    (option) => option.clientGroupId === data.clientGroupId
                  )?.clientCode,
            clientGroupCode:
              data.clientGroupId == 0
                ? "ALL"
                : clientAssignmentState.getActiveClientData?.find(
                    (option) => option.clientGroupId === data.clientGroupId
                  )?.clientGroupCode,
            clientGroupId: data.clientGroupId,
            taxonomyCode: data.taxonomyCode == 0 ? "ALL" : data.taxonomyCode,
            specCode: data.specCode == 0 ? "ALL" : data.specCode,
            subspecCode: data.subSpecCode == 0 ? "ALL" : data.subSpecCode,
            subspecDesc: data.subSpecDesc == 0 ? "ALL" : data.subSpecDesc,
            function: data.function === 1 ? "Applies To" : "Exclude",
            createdDate: data.createdDate
              ? moment(data.createdDate).format("MM-DD-YYYY")
              : "",
            updatedDate: data.updatedDate
              ? moment(data.updatedDate).format("MM-DD-YYYY")
              : "",
            action: data.deletedB === 0 ? "Active" : "Deactivated",
          });
        }
      });
      setTaxonomyData(taxonomyArrData);
    }
  }, [newpolicyState.getTaxonomyData]);

  const taxonomyColumnDef = useMemo(
    () => taxonomyTabColumns("", "", "", "", "", false),
    []
  );
  const gridApi = useRef(null);


  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const handleReview = () => {
    if (!gridApi.current) return;
    gridApi.current.setFilterModel(null);
    const selectedRows = gridApi.current.getSelectedRows();

    const taxonomies = new Set(selectedRows.map((row) => row.taxonomyCode));
    setSelectedTaxonomyData(selectedRows);
    const remainingRows = taxonomyData.filter(
      (row) => !taxonomies?.has(row.taxonomyCode)
    );
    const sortedRows = [
      ...selectedRows,
      ...taxonomyData.filter((row) => !taxonomies?.has(row.taxonomyCode)),
    ];
    setTaxonomyData([...sortedRows]);
    // setRows([...sortedRows]);
    setTimeout(() => {
      gridApi.current.forEachNode((node) => {
        if (taxonomies?.has(node.data.taxonomyCode)) {
          node.setSelected(true);
        }
      });
    }, 100);
    setReview(true);
  };


  function OpenTaxonomyData() {

    const [selectedRows, setSelectedRows] = useState(0);

    const onSelectionChanged = (event) => {
      const count = event.api.getSelectedRows().length;
      setSelectedRows(count); // update count, will re-render button only
    };

    return (
      <>
        <Dialogbox
          open={openTaxnomyPopUp}
          onClose={closeTaxnomyPopUp}
          fullWidth={true}
          maxWidth={"lg"}
          title={"Taxonomy Data"}
          message={
            <div
              style={{
                height: window.innerHeight / 2.2,
              }}
            >
              <AgGrids
                columnDefs={taxonomyColumnDef}
                animateRows={true}
                rowData={taxonomyData}
                rowSelection={"multiple"}
                onSelectionChanged={(e) => {
                  onSelectionChanged(e);
                }}
                onGridReady={onGridReady}
                // onFilterChanged={onFilterChanged}
              />
              <span>
                Selected Rows:{" "}
                <span  style={{ color: dangerColor }}>
                  {selectedRows}
                </span>
              </span>
            </div>
          }
          actions={
            <ButtonGroup>
              <CustomButton 
                onClick={() => {
                  !review ? handleReview() : closeTaxnomyPopUp();
                }}
                style={{
                  backgroundColor: !review
                  ? selectedRows === 0
                    ? disabledColor
                    : navyColor
                  : navyColor,              
                  color: "white",
                  margin: 10,
                  padding: 4,
                  fontSize: 12,  
                  textTransform: "capitalize",
                }}
                disabled={selectedRows === 0}
                >
                {!review ? "Review" : "Ok"}
              </CustomButton>
              {review && (
                <CustomButton
                  onClick={() => {
                    closeTaxnomyPopUp();
                    customFormState.cloneTaxonomyCheck = false;
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
                  Cancel
                </CustomButton>
              )}
            </ButtonGroup>
          }
        />
        <></>
      </>
    );
  }

//--------------Till here taxonomy check box selection code------------------

  function showFields() {
    return (
      <>
        <div className="row rowVp">
          <div className="col-sm-6">
            <CustomInput
              error={customFormState.customPolicyErrors?.customJiraId}
              fullWidth={true}
              labelText={"Jira ID"}
              showStarIcon={true}
              value={customFormState.customJiraId}
              onChange={(event) => {
                dispatch({
                  type: CUSTOM_JIRAID,
                  payload: event.target.value.trim(),
                });
              }}
              variant={"outlined"}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              error={customFormState.customPolicyErrors?.customJiraDesc}
              fullWidth={true}
              labelText={"Jira Description"}
              showStarIcon={true}
              value={customFormState.customJiraDesc}
              onChange={(event) => {
                dispatch({
                  type: CUSTOM_JIRA_DESCRIPTION,
                  payload: event.target.value.trim(),
                });
                dispatch({
                  type: CUSTOM_JIRA_LINK,
                  payload:
                    "https://advancedpricing.atlassian.net/browse/" +
                    event.target.value,
                });
              }}
              variant={"outlined"}
            />
          </div>
        </div>
        <div className="row rowVp">
          <CustomCheckBox
            checked={customFormState.cloneAssignmentCheck}
            size="small"
            disabled={true}
            onChange={(event) => {
              dispatch({
                type: CLONE_ASSIGNMENT_CHECK,
                payload: event.target.checked,
              });
            }}
            label={
              <span
                style={{
                  fontSize: "13px",
                  position: "relative",
                  fontWeight: "400",
                  bottom: "2px",
                }}
              >
                Clone Client Assignment Tab
              </span>
            }
          />
          <CustomCheckBox
            checked={customFormState.cloneTaxonomyCheck}
            size="small"
            // disabled={true}
            onChange={(event) => {
              const isChecked = event.target.checked;
              setOpenTaxonomyPopUp(isChecked ? true : false);
              dispatch({
                type: CLONE_TAXONOMY_CHECK,
                payload: event.target.checked,
              });
            }}
            label={
              <span
                style={{
                  fontSize: "13px",
                  position: "relative",
                  fontWeight: "400",
                  bottom: "2px",
                }}
              >
                Clone Taxonomy Tab
              </span>
            }
          />
           {openTaxnomyPopUp && taxonomyData.length > 0 ? (
            <OpenTaxonomyData />
          ) : (
            ""
          )}
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              disabled={!customFormState.cloneAssignmentCheck}
              error={customFormState.customPolicyErrors?.customNewPolicyDate}
              labelText={"Process Start Date"}
              type="date"
              variant={"outlined"}
              value={customFormState.customNewPolicyDate}
              onChange={(event) => {
                dispatch({
                  type: CUSTOM_NEW_POLICY_DATE,
                  payload: event.target.value,
                });
              }}
            />
          </div>
        </div>
      </>
    );
  }
  function checkFormValidation(formState) {
    let flag = validateCustomPolicyForm(customFormState, dispatch);
    if (!flag) {
      setClickOnConfirmation(true);
    }
    if (clickOnConfirmation == true) {
      saveCustomPolicy(policyFields);
    }
  }

  let clonedPolicy = policyFields.policyId;

  async function saveCustomPolicy(policyFields) {
    let taxonomyList = [];
    selectedTaxonomyData.map((tax) => {
      taxonomyList.push({
        clientGroupId: tax.clientGroupId,
        taxonomyCode: tax.taxonomyCode,
        specCode: tax.specCode,
        subSpecCode: tax.subspecCode,
        subSpecDesc: tax.subspecDesc,
        function: tax.function === "Applies To" ? 1 : 0,
        createdDate: moment(tax.createdDate).format("YYYY-MM-DD"),
        updatedDate: moment(tax.updatedDate).format("YYYY-MM-DD"),
      });
    });

    let emailId = localStorage.getItem("emailId");
    customFormState.customPolicyForm = policyFields;
    policyFields.custom = 1;
    changesTabFields.jiraId = customFormState.customJiraId;
    changesTabFields.jiraDesc = customFormState.customJiraDesc;
    changesTabFields.jiraLink = customFormState.customJiraLink;
    changesTabFields.userId = emailId;
    // formState.isOpenb = 1;
    changesTabFields.jiraIsOpen = 1;
    // formState.policy = formState.policy;
    policyFields.policyId = "";
    policyFields.clonedPolicyId = clonedPolicy;
    const date = new Date().toISOString().slice(0, 10);
    let createdDate = customFormState.customNewPolicyDate
      ? customFormState.customNewPolicyDate
      : date;
    let cloned = customFormState.cloneAssignmentCheck;
    let clonedTaxonomy = customFormState.cloneTaxonomyCheck;
    let allStates = {
      policyFields: policyFields,
      descTabFields: descTabFields,
      detailsTabFields: detailsTabFields,
      changesTabFields: changesTabFields,
      billTypeTabFields: billTypeTabFields,
      conditonTabFields: conditonTabFields,
      catTabFields: populateCategoryFields(policyFields, catTabState),
      taxonomyList: taxonomyList,
    };
    await onSaveCustomPolicy(
      dispatch,
      allStates,
      createdDate,
      cloned,
      clonedTaxonomy,
      navigate,
      true
    );
    dispatch({ type: GET_CLIENT_ASSIGNMENT_DATA, payload: [] });
    dispatch({ type: GET_TAXONOMY_DATA, payload: [] });
    dispatch({
      type: CLIENT_ASSIGNMENT_DATA,
      payload: { getActiveClientData: [] },
    });
    handleToClose();
  }

  return (
    <>
      <div>
        <div style={{ height: "3px" }}></div>
        {!disabled ? undefined : (
          <CustomButton
            variant={"contained"}
            style={{
              backgroundColor: dangerColor,
              color: "white",
              textTransform: "capitalize",
              fontSize: 12,
              padding: 4,
              float: "right",
              marginLeft: "15px",
            }}
            color={"secondary"}
            onClick={() => navigate1()}
          >
            Back
          </CustomButton>
        )}
        {!disabled ? undefined : (
          <CustomButton
            variant={"contained"}
            style={{
              float: "right",
              color: "white",
              textTransform: "capitalize",
              padding: 4,
              backgroundColor: goldColor,
              fontSize: 12,
            }}
            onClick={() => onConfigData()}
          >
            Validate
          </CustomButton>
        )}
        {disabled ? (
          <CustomButton
            variant={"contained"}
            style={{
              backgroundColor: !hide ? "#BBCBCF" : successColor,
              color: "white",
              textTransform: "capitalize",
              fontSize: 12,
              padding: 4,
              float: "right",
              marginRight: "15px",
            }}
            disabled={!hide}
            color={"secondary"}
            onClick={() => {
              setClickOnCreatedB(true);
              setOpenPopUp(true);
              customFormState.cloneTaxonomyCheck = false;
            }}
          >
            Create
          </CustomButton>
        ) : undefined}
        {disabled && hide ? (
          <CustomButton
            variant={"contained"}
            style={{
              float: "right",
              marginRight: 10,
              textTransform: "capitalize",
              padding: 4,
              fontSize: 12,
              backgroundColor: button ? "#BBCBCF" : navyColor,
              color: "white",
            }}
            onClick={() => onBack()}
            disabled={button}
          >
            Edit
          </CustomButton>
        ) : undefined}

        <NewPolicy
          edit={disabled}
          fromViewPolicy={true}
          showImportButton={false}
          customCreatedB={clickOnCreatedB}
        />
      </div>
      <Dialogbox
        disableBackdropClick={true}
        open={openPopUp}
        onClose={handleToClose}
        fullWidth={clickOnConfirmation ? "" : fullWidth}
        maxWidth={clickOnConfirmation ? "" : maxWidth}
        title={clickOnConfirmation ? "Confirm" : "New Policy Version"}
        message={
          clickOnConfirmation
            ? "Do you want to continue with the Policy Creation?"
            : showFields()
        }
        actions={
          <ButtonGroup>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                checkFormValidation(policyFields);
              }}
              style={{
                backgroundColor: clickOnConfirmation ? navyColor : successColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {clickOnConfirmation ? "Ok" : "Continue"}
            </CustomButton>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                if (clickOnConfirmation) {
                  setClickOnConfirmation(false);
                } else {
                  dispatch({ type: CUSTOM_POLICY_FORM_REST_STATE });
                  handleToClose();
                }
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
              Cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
    </>
  );
};
export default ViewPolicy;
