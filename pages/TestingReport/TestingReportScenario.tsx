import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../TestingReport/TestingReport.css";
import CustomInput from "../../components/CustomInput/CustomInput";
import Moment from "moment";
import CustomButton from "../../components/CustomButtons/CustomButton";
import { navyColor, successColor } from "../../assets/jss/material-kit-react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { sendClaimData } from "../../redux/ApiCalls/TestingReportApis/TestingReportApis";
import { LINE_LEVEL_DATA } from "../../redux/ApiCalls/TestingReportApis/TestingReportTypes";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { renderClaimRows, tableHeaders } from "./TestingReportLogic";
import { TestingReportState } from "../../redux/reducers/TestingReportReducer/TestingReportReducer";

const _ = require("lodash");

const TestingReportScenario = (selectedType) => {
  const dispatch = useDispatch();

  const updatedState: TestingReportState = useSelector(
    (state: any) => state.testingReportReducer
  );
  const [headerLevelData, setHeaderLeveldata] = useState([]);

  const checkHeaderDate = useCallback(
    (id, type) => {
      let headerDate = "";
      let dateArray = [];

      updatedState.lineLevelData.filter((k) => {
        if (k.scenarioId == id) {
          dateArray.push({
            date: type === "from" ? k.dosFrom : k.dosTo,
          });
        }
      });

      for (let i = 0; i < updatedState.lineLevelData.length; i++) {
        dateArray.filter((k) => {
          if (updatedState.lineLevelData[i].scenarioId == id) {
            const currentDate = new Date(
              type === "from"
                ? updatedState.lineLevelData[i].dosFrom
                : updatedState.lineLevelData[i].dosTo
            );
            const comparedDate = new Date(k.date);

            if (
              (type === "from" && comparedDate < currentDate) ||
              (type === "to" && comparedDate > currentDate)
            ) {
              headerDate = k.date;
            } else if (headerDate == "") {
              headerDate = k.date;
            }
          }
        });
      }

      return Moment(headerDate).format("MM-DD-YYYY");
    },
    [updatedState.lineLevelData]
  );

  let header = [];
  let lineLevel = [];

  useEffect(() => {
    let i = updatedState.tempData.length;
    for (let p = 0; p < i; p++) {
      updatedState.tempData[p].forEach((k) => {
        header.push({
          scenarioId: k.scenarioId,
          claimSlId: k.claimSlId,
          postiveData: k.postiveData,
          gender: k.gender,
          memberId: k.memberId,
          dosFrom: k.dosFrom,
          dosTo: k.dosTo,
          claimFormType: k.claimFormType,
          tin: k.tin,
          npi: k.npi,
          taxonomy: k.taxonomy,
          diagsCodes: k.diagsCodes,
          pos: k.pos,
          conditionCode: k.conditionCode,
          dob: k.dob,
          billType: k.billType,
          scenarioDesc: k.scenarioDesc,
          zipCode: k.zipCode,
        });
        lineLevel.push({
          scenarioId: k.scenarioId,
          claimSlId: k.claimSlId,
          cptFrom: k.cptFrom,
          payerAllowedProcedureCode: k.payerAllowedProcedureCode,
          quantity: k.qty,
          payerAllowedUnits: k.payerAllowedUnits,
          mod1: k.mod1,
          payerAllowedModifier1: k.payerAllowedModifier1,
          mod2: k.mod2,
          payerAllowedModifier2: k.payerAllowedModifier2,
          mod3: k.mod3,
          payerAllowedModifier3: k.payerAllowedModifier3,
          mod4: k.mod4,
          payerAllowedModifier4: k.payerAllowedModifier4,
          dx1: k.dx1,
          dx2: k.dx2,
          dx3: k.dx3,
          dx4: k.dx4,
          dosFrom: k.dosFrom,
          dosTo: k.dosTo,
          challengeCode: k.challengeCode ? k.challengeCode : "",
          reasonCode: k.reasonCode ? k.reasonCode : "",
          policyNumber: k.policyNumber ? k.policyNumber : "",
          policyVersion: k.policyVersion ? k.policyVersion : "",
          refDrgnSlId: k.refDrgnSlId ? k.refDrgnSlId : "",
          // revCode:k.revCode,
          refDrgnClaimId: k.refDrgnClaimId ? k.refDrgnClaimId : "",
          revenueCode: k.revenueCode,
          payerAllowedRevenueCode: k.payerAllowedRevenueCode,
          totalChargeAmount: k.totalChargeAmount,
          payerAllowedAmount: k.payerAllowedAmount,
          lineLevelNpi: k.lineLevelNpi,
          lineLevelPos: k.lineLevelPos,
          lineLevelTaxonomy: k.lineLevelTaxonomy,
          claimStatus: k.claimStatus,
        });
      });
    }
    dispatch({ type: LINE_LEVEL_DATA, payload: lineLevel });

    const unquie = header.filter((obj, index) => {
      return index === header.findIndex((o) => obj.scenarioId === o.scenarioId);
    });
    setHeaderLeveldata(unquie);
  }, [updatedState.tempData]);

  const sendClaim = useCallback(
    async (id) => {
      let claimDataDTO = {};
      let lineLevelDetails = [];
      // Collecting header-level data
      headerLevelData.forEach((k) => {
        if (k.scenarioId === id) {
          claimDataDTO["patientDateOfBirth"] = Moment(k.dob).format(
            "YYYY-MM-DD"
          );
          claimDataDTO["patientGender"] = k.gender;
          claimDataDTO["clmFormType"] = k.claimFormType;
          claimDataDTO["billType"] = k.billType;
          claimDataDTO["posLkp"] = k.pos;
          claimDataDTO["condCode"] = k.conditionCode;
          claimDataDTO["diags"] = k.diagsCodes;
          claimDataDTO["renderingTaxonomy"] = k.taxonomy;
          claimDataDTO["renderingProviderNpi"] = k.npi;
          claimDataDTO["taxIdentifier"] = k.tin;
          claimDataDTO["ipuPatientId"] = k.memberId;
          claimDataDTO["zipCode"] = k.zipCode;
          claimDataDTO["dateOfService"] = Moment(
            checkHeaderDate(id, "from")
          ).format("YYYY-MM-DD");
        }
      });

      // Collecting line-level data
      updatedState.lineLevelData.forEach((k) => {
        if (k.scenarioId === id) {
          lineLevelDetails.push({
            drgClaimSlId: k.claimSlId,
            scenarioDesc: k.scenarioDesc,
            cptFrom: k.cptFrom,
            submittedUnits: k.quantity,
            submittedModifier1: k.mod1,
            submittedModifier2: k.mod2,
            submittedModifier3: k.mod3,
            submittedModifier4: k.mod4,
            dxCode1: k.dx1,
            dxCode2: k.dx2,
            dxCode3: k.dx3,
            dxCode4: k.dx4,
            dosFrom: k.dosFrom,
            dosTo: k.dosTo,
            revenueCode: k.revenueCode,
            payerAllowedRevenueCode: k.payerAllowedRevenueCode,
            submittedChargeAmount: k.totalChargeAmount,
            allowedQuantity: k.allowedQuantity,
            payerAllowedProcedureCode: k.payerAllowedProcedureCode,
            payerAllowedUnits: k.payerAllowedUnits,
            payerAllowedModifier1: k.payerAllowedModifier1,
            payerAllowedModifier2: k.payerAllowedModifier2,
            payerAllowedModifier3: k.payerAllowedModifier3,
            payerAllowedModifier4: k.payerAllowedModifier4,
            renderingProviderNpi: k.lineLevelNpi,
            pos: k.lineLevelPos,
            renderingTaxonomy: k.lineLevelTaxonomy,
            payerAllowedAmount: k.payerAllowedAmount,
            rvuPrice: k.rvuPrice,
          });
        }
      });

      // Handling selected type logic
      if (selectedType.selectedType === "single") {
        claimDataDTO["policyId"] = updatedState?.getTestingReportData.policyId;
      }

      claimDataDTO["testClaimLines"] = lineLevelDetails;
      claimDataDTO["clientGroupType"] = selectedType.clientGroupType.label;
      claimDataDTO["clientGroupCode"] = selectedType.clientGroupCode;
      claimDataDTO["clientGroupId"] = selectedType.clientGroup;
      claimDataDTO["fileHistoricalClaimLines"] = updatedState.historicTempData;
      claimDataDTO["includeDBHistory"] =
        selectedType.includeDbHistory == null
          ? 0
          : selectedType.includeDbHistory;

      if (selectedType.selectedType === "all") {
        claimDataDTO["isProdb"] =
          selectedType.includeTest == null ? 0 : selectedType.includeTest;
      }

      // Running claim logic
      let claimDTOList = [claimDataDTO];

      // Validation before sending data
      if (!selectedType.clientGroupType.label) {
        CustomSwal(
          "info",
          "Please Select Client Group Type",
          navyColor,
          "OK",
          ""
        );
      }
      else if (selectedType.selectedType === "single" && updatedState?.getTestingReportData.policyId == undefined) {
        CustomSwal(
          "info",
          "Policy number does not exist enter correct policy number",
          navyColor,
          "OK",
          ""
        );
      }
      else {
        await sendClaimData(dispatch, claimDTOList);
      }
    },
    [headerLevelData, updatedState, selectedType, dispatch]
  );

  const checkTableScroll = (scenarioId) => {
    let scroll;
    let temp = [];
    updatedState.lineLevelData.map((k, l) => {
      if (scenarioId == k.scenarioId) {
        temp.push(k);
      }
    });
    const uniqueArray = temp.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t.claimSlId === obj.claimSlId)
    );
    if (uniqueArray.length > 1) {
      scroll = "scroll";
    } else {
      scroll = "auto";
    }
    return scroll;
  };

  function checkDisable() {
    let checkCode = true;
    if (
      selectedType.selectedType == "single" &&
      selectedType.policyNumber &&
      selectedType.policyVersion
    ) {
      checkCode = false;
    } else if (selectedType.selectedType == "all") {
      checkCode = false;
    }
    return checkCode;
  }
  function checkDisableColor() {
    let checkCodeColor;
    if (
      selectedType.selectedType == "single" &&
      selectedType.policyNumber &&
      selectedType.policyVersion &&
      selectedType.runAllClicked == true
    ) {
      checkCodeColor = "#EE9157";
    } else if (selectedType.selectedType == "all") {
      if (selectedType.runAllClicked == true) {
        checkCodeColor = "#EE9157";
      } else {
        checkCodeColor = successColor;
      }
    } else if (
      selectedType.selectedType == "single" &&
      selectedType.policyNumber &&
      selectedType.policyVersion &&
      selectedType.runAllClicked == false
    ) {
      checkCodeColor = successColor;
    } else {
      checkCodeColor = "#9CAEA4";
    }
    return checkCodeColor;
  }

  const renderCustomInput = ({ labelText, value }) => (
    <CustomInput
      fullWidth={true}
      labelText={labelText}
      disabled={true}
      variant={"outlined"}
      value={value || ""}
      title={value}
    />
  );

  const updatedResultsData = () => {
    return updatedState.totalClaimsData.map((k) => {
      k.testClaimLines.map((f) => {
        return updatedState.lineLevelData.map((r) => {
          if (r.claimSlId === f.claimSlId) {
            r.policyNumber = f.policyNumber;
            r.policyVersion = f.policyVersion;
            r.challengeCode = f.challengeCode;
            r.refDrgnSlId = f.refDrgnSlId;
            r.reasonCode = f.reasonCode;
            r.refDrgnClaimId = f.refDrgnClaimId;
            r.allowedQuantity = f.allowedQuantity;
            r.rvuPrice = f.rvuPrice;
          }
        });
      });
    });
  };

  const memoizedHeaders = useMemo(() => {
    return tableHeaders.map((header, index) => (
      <th key={index} title={header}>
        <span>{header}</span>
      </th>
    ));
  }, [tableHeaders]);

  function buildRows() {
    const arr = [];
    for (let i = 0; i < headerLevelData.length; i++) {
      arr.push(
        <div key={i}>
          <div className="row">
            <div className="col-sm-6" style={{ marginRight: '50px' }}>
              <label className="scenarioHead1">Scenario ID : </label>
              <span className="scenarioVal">
                {headerLevelData[i].scenarioId}
              </span>
              <label className="scenarioHead"> Scenario Desc : </label>
              <span
                className="scenarioVal scenarioDescription"
                title={headerLevelData[i].scenarioDesc}
              >
                {headerLevelData[i].scenarioDesc}
              </span>
              <label className="scenarioHead">Positive/Negative : </label>
              <span className="scenarioVal">
                {headerLevelData[i].postiveData}
              </span>
            </div>
            <div className="col-sm-2 scenarioRun">
              <CustomButton
                variant={"contained"}
                // #9CAEA4\
                disabled={checkDisable()}
                style={{
                  backgroundColor: checkDisableColor(),
                  color: "white",
                  // margin: 0,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
                onClick={() => {
                  sendClaim(headerLevelData[i].scenarioId);
                }}
                startIcon={
                  <PlayArrowIcon
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      left: "1px",
                      marginRight: "0px",
                    }}
                  />
                }
              >
                Run
              </CustomButton>
            </div>
          </div>
          <div className="sce">
            <div className="testGender">
              {renderCustomInput({
                labelText: "Gender",
                value: headerLevelData[i].gender
              })}
            </div>
            <div className="testClaim">
              {renderCustomInput({
                labelText: "Claim Form Type",
                value: headerLevelData[i].claimFormType
              })}
            </div>
            {renderCustomInput({
              labelText: "Member ID",
              value: headerLevelData[i].memberId
            })}
            <div className="testTin">
              {renderCustomInput({
                labelText: "TIN",
                value: headerLevelData[i].tin
              })}
            </div>
            {renderCustomInput({
              labelText: "NPI",
              value: headerLevelData[i].npi
            })}
            {renderCustomInput({
              labelText: "Taxonomy",
              value: headerLevelData[i].taxonomy
            })}
            {renderCustomInput({
              labelText: "POS",
              value: headerLevelData[i].pos
            })}
            {renderCustomInput({
              labelText: "Zip Code",
              value: headerLevelData[i].zipCode
            })}
            {renderCustomInput({
              labelText: "DOB",
              value: Moment(headerLevelData[i].dob).format("MM-DD-YYYY")
            })}
            {renderCustomInput({
              labelText: "DOS From",
              value: Moment(
                checkHeaderDate(headerLevelData[i].scenarioId, "from")
              ).format("MM-DD-YYYY")
            })}
            {renderCustomInput({
              labelText: "DOS To",
              value: checkHeaderDate(headerLevelData[i].scenarioId, "to")
            })}
            {renderCustomInput({
              labelText: "Cond Code",
              value: headerLevelData[i].conditionCode
            })}
            {renderCustomInput({
              labelText: "Diags Code",
              value: headerLevelData[i].diagsCodes
            })}
            <div className="testBillType">
              {renderCustomInput({
                labelText: "Bill Type",
                value: headerLevelData[i].billType
              })}
            </div>
          </div>
          <>
            <div
              className="table-header"
              style={{
                overflowY: checkTableScroll(headerLevelData[i].scenarioId),
                scrollbarWidth: "thin",
                maxHeight: "150px",
              }}
            >
              <table key={headerLevelData[i]} className="testingReportTable">
                <thead>
                  <tr>{memoizedHeaders}</tr>
                  {updatedResultsData()}
                </thead>
                <tbody>
                  {renderClaimRows(headerLevelData[i], updatedState)}
                </tbody>
              </table>
            </div>
          </>
        </div>
      );
    }
    return arr;
  }

  return <>{buildRows()}</>;
};

export default TestingReportScenario;
