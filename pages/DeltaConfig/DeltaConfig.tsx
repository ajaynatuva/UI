import {
  Box,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ButtonGroup, Stack } from "@mui/material";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Template from "../../components/Template/Template";
import {
  ErrorStatus,
  getDeltaConfigById,
  UpdateStatus,
} from "../../redux/ApiCalls/TaskApis/TaskApis";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import "../DeltaConfig/DeltaConfig.css";
import "../GroupTask/Group.css";
import { GroupAndMyTaskConstants } from "../GroupTask/GroupAndMyTaskConst";
import { MetaLoaderConstants } from "../MetaDataLoader/MetaLoaderConst";
import {
  loadDataToTarget,
} from "../../redux/ApiCalls/MetaLoaderApis/MetaLoaderApi";
const options1 = [
  { value: "Approve", label: "Approve" },
  { value: "Reject", label: "Reject" },
];
const DeltaConfig = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  //@ts-ignore
  const taskId = state?.taskId;
  //@ts-ignore
  const isError = state?.error;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


  const currentYear = new Date().getFullYear();
  const [selectedTask, setSelectedTask] = useState(undefined);
  const updatedState: TaskState = useSelector(
    (state: any) => state.taskReducer
  );
  useEffect(() => {
    (async () => {
      await getDeltaConfigById(dispatch, taskId);
    })();
  }, [taskId]);
  const [selectedOption, setSelectedOption] = useState(undefined);
  useEffect(() => {
    setSelectedTask(updatedState.selectedDeltaConfigTask);
  }, [updatedState]);
  const [open, setOpen] = React.useState(false);
  const handleClickToOpen = () => {
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
  };

  const [button, setbutton] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {};
  const hidebutton = () => {
    setbutton(false);
  };
  const viewbutton = () => {
    setbutton(true);
  };
  return (
    <Template>
      <div className="deltaconfig" />
      <CustomHeader labelText={"Delta Review"} />
      <CustomPaper
        style={{
          height: isError ? "530px" : "auto",
          width: isError ? "100%" : "100%",
          padding: 13,
          boxShadow: "none",
          border: "1px solid #D6D8DA",
        }}
      >
        <div className="row">
          {isError ? (
            <h6 style={{ fontWeight: 400 }}>
              {selectedTask?.sourceName}, {selectedTask?.quarterName} Delta
              Error Report
            </h6>
          ) : (
            <h6 style={{ fontWeight: 400 }}>
              {selectedTask?.sourceName}, {selectedTask?.quarterName} Delta
              Report
            </h6>
          )}
        </div>
        <div className="row">
          <table>
            <tr>
              <th>Loader Type</th>
              <th>Source Name</th>
              <th>Quarter Value</th>
              <th>Time Stamp</th>
            </tr>
            <tbody>
              <tr>
                <td>{selectedTask?.loadType.loadType}</td>
                <td>{selectedTask?.sourceName}</td>
                <td>
                  {selectedTask?.sourceName == "BW Pairs" ||
                  selectedTask?.sourceName == "Modifier Interaction" ||
                  selectedTask?.sourceName == "CCI DEVIATIONS"
                    ? "N/A"
                    : selectedTask?.quarterName}
                </td>
                <td>
                  {Moment(selectedTask?.updatedDate).format(
                    "MM-DD-YYYY HH:mm:ss"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {isError ? (
          <div className="row">
            <div className="col-sm-2">
              <h6 style={{ marginTop: 10 }}>Error message:</h6>
            </div>
            <div className="col-sm-9">
              <div className="errorMsg">
              <table className="ErrorTask">
                <tr>
                  {selectedTask?.sourceName == "BW Pairs" &&
                selectedTask.taskType.taskType == "Error Task" ? 
                <td>
                  <a target="_blank" href={selectedTask?.errorLog}>
                    {selectedTask?.errorLog}
                  </a>
                  </td>
                : (
                  <td>{selectedTask?.errorLog}</td>
                )}
                </tr>
              </table>
            </div>
          </div>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-sm-2">
                <h6 style={{ fontWeight: 400, height: 10, marginTop: 10 }}>
                  Link to source file:
                </h6>
              </div>
              <div className="col-sm-9">
                <div className="locationUrl">
                  <a
                    target="_blank"
                    title={selectedTask?.sourceLocation}
                    href={selectedTask?.sourceLocation}
                  >
                    {selectedTask?.sourceLocation}
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <h6 style={{ fontWeight: 400, height: 10, marginTop: 10 }}>
                  Link to delta report:
                </h6>
              </div>
              <div className="col-sm-9">
                <div className="locationUrl">
                  <a
                    target="_blank"
                    title={selectedTask?.deltaLocation}
                    href={selectedTask?.deltaLocation}
                  >
                    {selectedTask?.deltaLocation}
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <h6 style={{ fontWeight: 400, marginLeft: 20, marginTop: 7 }}>
                  Approve/Reject:
                </h6>
              </div>
              <div className="col-sm-2">
                <CustomSelect
                  options={options1}
                  onSelect={(event) => {
                    if (event == null) {
                      setSelectedOption(undefined);
                    } else {
                      setSelectedOption(event.value);
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}
      </CustomPaper>
      <div className="row" style={{ marginTop: 10 }}>
        <div className="col-sm-9" />
        <div className="col-sm-2">
          {isError ? (
            selectedTask?.taskStatus.taskStatus ==
            GroupAndMyTaskConstants.COMPLETED ? undefined : (
              <CustomButton
                variant="contained"
                disabled={selectedOption == undefined && !isError}
                style={{
                  fontSize: 12,
                  backgroundColor: navyColor,
                  color: "white",
                  textTransform: "capitalize",
                  cursor: "pointer",
                }}
                onClick={() => setOpen(true)}
              >
                Complete
              </CustomButton>
            )
          ) : selectedOption == undefined ? undefined : (
            <CustomButton
              variant="contained"
              disabled={selectedOption == undefined && !isError}
              style={{
                fontSize: 12,
                backgroundColor: navyColor,
                color: "white",
                textTransform: "capitalize",
                cursor: "pointer",
                marginLeft: 10,
              }}
              onClick={() => setOpen(true)}
            >
              Confirm
            </CustomButton>
          )}
          <CustomButton
            variant="contained"
            style={{
              backgroundColor: dangerColor,
              color: "white",
              textTransform: "capitalize",
              fontSize: 12,
              marginLeft: 10,
            }}
            onClick={() => {
              isError ? navigate("/groupTask") : navigate("/myTask");
            }}
          >
            Cancel
          </CustomButton>
        </div>
      </div>
      {selectedOption == GroupAndMyTaskConstants.APPROVE
        ? ApprovalPopupData()
        : selectedOption == GroupAndMyTaskConstants.REJECT
        ? RejectPopupData()
        : ErrorPopup()}
    </Template>
  );
  function ErrorPopup() {
    return (
      <div>
        <Dialogbox
          open={open}
          onClose={handleToClose}
          disableBackdropClick={true}
          title={"Confirm"}
          message={"Would you like to Complete the Error Task"}
          actions={
            <ButtonGroup>
              <CustomButton
                onClick={() => errorStatus()}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  marginRight: 10,
                  fontSize: 12,
                  padding: 4,
                  textTransform: "capitalize",
                }}
              >
                Yes
              </CustomButton>
              <CustomButton
                onClick={handleToClose}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  // margin: 10,
                  fontSize: 12,
                  padding: 4,
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
  }
  function ApprovalPopupData() {
    return (
      <Dialogbox
        open={open}
        onClose={handleToClose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={" Would you like to initiate the Target Load?"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={() => onApproveData()}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                fontSize: 12,
                padding: 4,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={handleToClose}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                fontSize: 12,
                padding: 4,
                textTransform: "capitalize",
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    );
  }

  function RejectPopupData() {
    return (
      <Dialogbox
        open={open}
        onClose={handleToClose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={"  Are you sure, you want to cancel the Target Load"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={() => rejectStatus()}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                fontSize: 12,
                padding: 4,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>

            <CustomButton
              onClick={handleToClose}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                fontSize: 12,
                padding: 4,
                textTransform: "capitalize",
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    );
  }

  function onApproveData() {
    let emailId = localStorage.getItem("emailId");
    let params = {
      recipients: emailId,
      currentQuarter: selectedTask.quarterName,
      sourceName: selectedTask.sourceName.replaceAll("_", " "),
      sourceFilePath: selectedTask.sourceLocation,
      taskId: selectedTask.taskId,
      currentYear: selectedTask.QuarterName,
    };
    const navigateToGroupTask = () => navigate("/grouptask");
    const validSources = [
      MetaLoaderConstants.MFS,
      MetaLoaderConstants.SAME_OR_SIMILAR,
      MetaLoaderConstants.MFS_DATE_BINDED,
      MetaLoaderConstants.ADHOC_CPT_HCPCS,
      MetaLoaderConstants.HCPCS,
      MetaLoaderConstants.ICD_10_CM,
      MetaLoaderConstants.RBRVS,
      MetaLoaderConstants.ICD_10_CM_DRGN,
      MetaLoaderConstants.BW_Pairs,
      MetaLoaderConstants.Modifier_Interaction,
      MetaLoaderConstants.GPCI,
      MetaLoaderConstants.GPCI_DATE_BINDED,
      MetaLoaderConstants.ZIP_5,
      MetaLoaderConstants.ZIP_9,
      MetaLoaderConstants.ZIP_5_DATE_BINDED,
      MetaLoaderConstants.ZIP_9_DATE_BINDED,
      MetaLoaderConstants.CCI_MEDICAID_HOSPITAL,
      MetaLoaderConstants.CCI_MEDICAID_PRACT,
      MetaLoaderConstants.CCI_MEDICARE_HOSPITAL,
      MetaLoaderConstants.CCI_MEDICARE_PRACT,
      MetaLoaderConstants.DMUV_PROFESSIONAL,
      MetaLoaderConstants.DMUV_OUTPATIENT,
      MetaLoaderConstants.ANNUAL_MAX_UNITS,
      MetaLoaderConstants.MEDICAID_MUE_DME,
      MetaLoaderConstants.MEDICAID_MUE_OUTPATIENT,
      MetaLoaderConstants.MEDICAID_MUE_PROFESSIONAL,
      MetaLoaderConstants.MEDICAID_MUE_DME_AUTO,
      MetaLoaderConstants.MEDICAID_MUE_OUTPATIENT_AUTO,
      MetaLoaderConstants.MEDICAID_MUE_PROFESSIONAL_AUTO,
      MetaLoaderConstants.MEDSTAR_MFCMD_MUE_PROFESSIONAL,
      MetaLoaderConstants.MEDSTAR_MFCMD_MUE_OUTPATIENT,
      MetaLoaderConstants.MEDSTAR_MFCDC_MUE_PROFESSIONAL,
      MetaLoaderConstants.MEDSTAR_MFCDC_MUE_OUTPATIENT,
      MetaLoaderConstants.MEDICARE_NCCI_MEDICALLY_UNLIKELY_DME,
      MetaLoaderConstants.MEDSTAR_MFCDC_MUE_ASC,
      MetaLoaderConstants.MEDSTAR_MFCMD_MUE_DME,
      MetaLoaderConstants.DMUV_PROFESSIONAL_AUTO,
      MetaLoaderConstants.DMUV_OUTPATIENT_AUTO,
      MetaLoaderConstants.DMUV_DME_AUTO,
      MetaLoaderConstants.ICD_10_PCS,
      MetaLoaderConstants.ICD_10_PCS_DRGN_AUTO,
      MetaLoaderConstants.ADD_ON_CODES,
      MetaLoaderConstants.ADDON_CODE_TYPE_2,
      MetaLoaderConstants.ADDON_CODE_TYPE_3,
      MetaLoaderConstants.APC_DATE_BINDED,
      MetaLoaderConstants.CAPC_DATE_BINDED,
      MetaLoaderConstants.HCPCS_DATE_BINDED,
      MetaLoaderConstants.APC,
      MetaLoaderConstants.OCE_HCPCS,
      MetaLoaderConstants.CAPC,
      MetaLoaderConstants.CCI_DEVIATIONS,
    ];
    if (validSources.includes(selectedTask.sourceName)) {
      loadDataToTarget(dispatch, params, selectedTask.sourceName);
      navigateToGroupTask();
    }
    switch (selectedTask.sourceName) {
      case MetaLoaderConstants.CPT:
        if (selectedTask.sourceName !== MetaLoaderConstants.ADHOC) {
          loadDataToTarget(dispatch, params, MetaLoaderConstants.CPT);
          navigateToGroupTask();
        }
        break;
      default:
    }
  }

  function rejectStatus() {
    if (selectedOption === GroupAndMyTaskConstants.REJECT) {
      UpdateStatus(dispatch, selectedTask.taskId);
      setOpen(false);
      navigate("/grouptask");
    }
  }
  function errorStatus() {
    ErrorStatus(dispatch, selectedTask.taskId);
    setOpen(false);
    navigate("/grouptask");
  }
};
export default DeltaConfig;
