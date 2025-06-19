import moment from "moment-timezone";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { black } from "../../assets/jss/material-kit-react";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import "./Claims.css";
import {
  Dialog,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { Search } from "@mui/icons-material";
import DialogBoxWithOutBorder from "../../components/Dialog/DialogBoxWithOutBorder";
import {
  getRefernceClaim,
  getReferncePolicyClaim,
  searchRefClaimData,
} from "../../redux/ApiCalls/ClaimApis/ClaimApis";
import { ClaimState } from "../../redux/reducers/ClaimsReducer/ClaimReducer";
import Draggable from "react-draggable";
import CloseIcon from "@material-ui/icons/Close";
import { DraggableData, DraggableEvent } from "react-draggable";
import { GET_DRGN_CLAIM_REVIW_DATA } from "../../redux/ApiCalls/ClaimApis/ClaimApiType";

const intial = {
  clientGroupCode: "",
  clientId: "",
  clientGroupId: "",
  claimNumber: "",
  clientCode: "",
  gender: "",
  patientId: "",
  npi: "",
  dob: "",
  taxonomy: "",
  taxIdentifier: "",
  billingProvId: "",
  posBillType: "",
  claimType: "",
  conditionCode: "",
  DrgnId: "",
  DiagsCode: "",
  allowedAmount: "",
  clientGroupType: "",
  socProviderId: "",
  socPostalCode: "",
  billingPostalCode: "",
};

const ClaimView = (openDRSData) => {
  const dispatch = useDispatch();

  const [reference, setReference] = useState(false);
  const [openDRS, setOpenDRS] = React.useState(false);
  const[openChildModal,setOpenChildModal] = React.useState(false);
  const [claimIdData, setclaimIdData] = useState([]);
  const [totalChargeSum, setTotalChargeSum] = useState(Number);
  const [totalChallengeSum, setTotalChallengeSum] = useState(Number);
  const [PolicyClaimData, setPolicyClaimData] = useState(intial);
  const [filterClaimViewData, setFilterClaimViewData] = React.useState([]);
  const [filterClaimRefData, setFilterClaimRefData] = React.useState([]);
  const [openDRS1, setOpenDRS1] = React.useState(false);
  const [RefPolicyClaimData, setRefPolicyClaimData] = useState(intial);
  const [RefClaimIdData, setRefClaimIdData] = useState([]);
  const [ReftotalChargeSum, setRefTotalChargeSum] = useState(Number);
  const [ReftotalChallengeSum, setRefTotalChallengeSum] = useState(Number);
  const [ReferenceDrgnClaimid, setReferenceDrgnClaimId] = useState(null);

  const claimState: ClaimState = useSelector(
    (state: any) => state.claimReducer
  );

  const updatedState = useSelector((state: any) => state.newPolicy);

  const getRefData = async (refClaimId) => {
    let obj = {
      drgnClaimId: refClaimId,
    };
    setReferenceDrgnClaimId(refClaimId);

    if (refClaimId != null) {
      getRefernceClaim(dispatch, refClaimId);
      getReferncePolicyClaim(dispatch, refClaimId);
      setReference(true);
      await searchRefClaimData(dispatch, obj);
    }
  };

  const _ = require("lodash");

  function ShowRowsAfterRowSpan(item) {
    let arr = [];
    arr.push(
      <>
        <td>{item.allowedProcedureCode}</td>
        <td>{item.quantity}</td>
        <td>{item.allowedQuantity}</td>
        <td>{item.allowedUnits}</td>
        <td>{item.chargeAmount}</td>
        <td>{item.lineAllowed$}</td>
        <td>{item.reasonCode}</td>
        <td>{item.rvuPrice}</td>
        <td>{item.challengeAmount}</td>
        <td>{item.occurDate}</td>
        <td>{item.dosTo}</td>
        <td>{item.lineLevelPos}</td>
        <td>{item.lineLevelTaxnomy}</td>
        <td>{item.lineLevelNpi}</td>
        <td className="refDrgnClaimSlId" title={item.RefSlId}>
          {item.RefSlId}
        </td>
        <td
          className="refDrgnClaimId"
          title={item.RefClmId}
          style={{ cursor: "pointer" }}
        >
          <span
            onDoubleClick={() => {
              getRefData(item.RefClmId);
            }}
          >
            {item.RefClmId}
          </span>
        </td>
        <td>{item.dxCode1}</td>
        <td>{item.dxCode2}</td>
        <td>{item.dxCode3}</td>
        <td>{item.dxCode4}</td>
        <td>{item.mod1}</td>
        <td>{item.allowedMod1}</td>
        <td>{item.mod2}</td>
        <td>{item.allowedMod2}</td>
        <td>{item.mod3}</td>
        <td>{item.allowedMod3}</td>
        <td>{item.mod4}</td>
        <td>{item.allowedMod4}</td>
        <td>{item.recModifier1}</td>
        <td>{item.recModifier2}</td>
        <td>{item.recModifier3}</td>
        <td>{item.recModifier4}</td>
        <td>{item.recPercent}</td>
      </>
    );
    return arr;
  }
  type Position = {
    xRate: number;
    yRate: number;
  };
  const [currentPosition, setCurrentPosition] = useState<Position>({
    xRate: 150,
    yRate: 150,
  });

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    setCurrentPosition({ xRate: data.lastX, yRate: data.lastY });
  };

  function getRefRvuPrice(ReferenceClaimid, itemizedBilllineId) {
    let result = null;
    updatedState.claims.some((current) => {
      if (
        current.drgnClaimId === ReferenceClaimid &&
        current.itemizedBillLineId === itemizedBilllineId
      ) {
        result = current.rvuPrice;
        return true;
      }
      return false;
    });
    return result;
  }

  function getRvuPrice(id, itemizedBilllineId) {
    let result = null;
    updatedState.claims.some((current) => {
      if (
        current.drgnClaimId === id &&
        current.itemizedBillLineId === itemizedBilllineId
      ) {
        result = current.rvuPrice;
        return true;
      }
      return false;
    });
    return result;
  }

  const getChallengeCodeById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.id == id);
    if (d != undefined) {
      code = d.code;
    }
    return code;
  };

  useEffect(() => {
    // claim view Data
    if (openDRSData.onSelectionClicked == true) {
      setOpenDRS(true);
      let obj = _.cloneDeep(intial);
      claimState.getPolicyClaim.map((p) => {
        obj.clientGroupCode = p.clientGroupCode;
        obj.clientId = p.clientId;
        obj.clientGroupId = p.clientGroupId;
        obj.claimNumber = p.claimNumber;
        obj.clientCode = p.clientCode;
        obj.gender = p.sex;
        obj.patientId = p.patientId;
        obj.npi = p.renderingProviderNpi;
        obj.taxonomy = p.taxonomyCode;
        obj.taxIdentifier = p.taxIdentifier;
        obj.billingProvId = p.billingProviderId;
        obj.posBillType = p.posbillType;
        obj.claimType = p.claimType;
        obj.conditionCode = p.conditionCode;
        obj.dob = moment(p.dateOfBirth).format("MM-DD-YYYY");
        obj.DrgnId = openDRSData.drgnId;
        obj.DiagsCode = p.diagsCode;
        obj.allowedAmount = p.allowedAmount;
        obj.clientGroupType = p.clientGroupType;
        obj.socProviderId = p.socProviderId;
        obj.billingPostalCode = p.billingPostalCode;
        obj.socPostalCode = p.socPostalCode;
        setPolicyClaimData(obj);
      });
    }
  }, [claimState.getPolicyClaim]);

  useEffect(() => {
    // claim view Data
    if (openDRSData.onSelectionClicked == true) {
      let claimData = [];
      claimState.getDrgnClaimReviewData?.forEach((d) => {
        claimData.push({
          id: d.micId,
          acdmId: d.acdmId,
          claimId: d.claimId,
          description: d.iblDescription,
          allowedQuantity: d.allowedQuantity,
          quantity: d.submittedQuantity,
          challengeAmount: d.challengeAmount,
          chargeAmount: d.submittedAmount,
          code: d.procedureCode,
          occurDate: d.occurDate
            ? moment(d.occurDate).format("MM-DD-YYYY")
            : "",
          dosTo: d.dosTo
          ? moment(d.dosTo).format("MM-DD-YYYY")
          : "",
          reasonCode: d.reasonCode,
          mbrDescription: d.mbrDescription,
          itemizedBillLineId: d.itemizedBilllineId,
          name: d.micName,
          type: d.mbrType,
          dxCode1: d.dxCode1,
          dxCode2: d.dxCode2,
          dxCode3: d.dxCode3,
          dxCode4: d.dxCode4,
          mod1: d.submittedMod1,
          mod2: d.submittedMod2,
          mod3: d.submittedMod3,
          mod4: d.submittedMod4,
          allowedMod1: d.payerAllowedMod1,
          allowedMod2: d.payerAllowedMod2,
          allowedMod3: d.payerAllowedMod3,
          allowedMod4: d.payerAllowedMod4,
          allowedUnits: d.payerAllowedUnits,
          lineAllowed$: d.payerAllowedAmount,
          lineLevelPos: d.lineLevelPos,
          lineLevelTaxnomy: d.lineLevelTaxnomy,
          lineLevelNpi: d.lineLevelNpi,
          RefSlId: d.refSlId,
          RefClmId: d.refClaimId,
          allowedProcedureCode: d.payerAllowedProcedureCode,
          recModifier1: d.recModifier1,
          recModifier2: d.recModifier2,
          recModifier3: d.recModifier3,
          recModifier4: d.recModifier4,
          recPercent: d.recPercent,
          rvuPrice: getRvuPrice(openDRSData.drgnId, d.itemizedBilllineId),
        });
      });
      let chargeAmount = [];
      let challengeAmount = [];
      let sumOfChargeAmt = 0;
      let sumOfChallengeAmt = 0;
      claimData.map((e) => {
        chargeAmount.push(+e.chargeAmount);
        challengeAmount.push(+e.challengeAmount);
      });
      for (let i = 0; i < chargeAmount.length; i += 1) {
        sumOfChargeAmt += chargeAmount[i];
      }
      for (let i = 0; i < challengeAmount.length; i += 1) {
        sumOfChallengeAmt += challengeAmount[i];
      }
      setTotalChargeSum(sumOfChargeAmt);
      setTotalChallengeSum(sumOfChallengeAmt);
      setclaimIdData(
        claimData.sort((a, b) => a.itemizedBillLineId - b.itemizedBillLineId)
      );
      setFilterClaimViewData(claimData);
    }
  }, [claimState.getDrgnClaimReviewData]);

  useEffect(() => {
    // Ref claim view Data
    if (reference == true) {
      let obj = _.cloneDeep(intial);
      claimState.getRefDrgnClaimReviewData.map((p) => {
        obj.clientGroupCode = p.clientGroupCode;
        obj.clientId = p.clientId;
        obj.clientGroupId = p.clientGroupId;
        obj.claimNumber = p.claimNumber;
        obj.clientCode = p.clientCode;
        obj.gender = p.sex;
        obj.patientId = p.patientId;
        obj.npi = p.renderingProviderNpi;
        obj.taxonomy = p.taxonomyCode;
        obj.taxIdentifier = p.taxIdentifier;
        obj.billingProvId = p.billingProviderId;
        obj.posBillType = p.posbillType;
        obj.claimType = p.claimType;
        obj.RconditionCode = p.conditionCode;
        obj.dob = moment(p.dateOfBirth).format("MM-DD-YYYY");
        obj.DrgnId = ReferenceDrgnClaimid;
        obj.DiagsCode = p.diagsCode;
        obj.allowedAmount = p.allowedAmount;
        obj.clientGroupType = p.clientGroupType;
        obj.socProviderId = p.socProviderId;
        obj.billingPostalCode = p.billingPostalCode;
        obj.socPostalCode = p.socPostalCode;
        setRefPolicyClaimData(obj);
        setOpenDRS1(true);
      });
    }
  }, [claimState.getRefDrgnClaimReviewData]);

  useEffect(() => {
    // Ref claim view Data
    if (reference == true) {
      let RefclaimData = [];
      claimState.getReferencePolicyClaim.forEach((d) => {
        RefclaimData.push({
          id: d.micId,
          acdmId: d.acdmId,
          claimId: d.claimId,
          description: d.iblDescription,
          quantity: d.submittedQuantity,
          allowedQuantity: d.allowedQuantity,
          challengeAmount: d.challengeAmount,
          chargeAmount: d.submittedAmount,
          code: d.procedureCode,
          occurDate: d.occurDate
            ? moment(d.occurDate).format("MM-DD-YYYY")
            : "",
          dosTo: d.dosTo
            ? moment(d.dosTo).format("MM-DD-YYYY")
            : "",
          reasonCode: d.reasonCode,
          mbrDescription: d.mbrDescription,
          itemizedBillLineId: d.itemizedBilllineId,
          name: d.micName,
          type: d.mbrType,
          dxCode1: d.dxCode1,
          dxCode2: d.dxCode2,
          dxCode3: d.dxCode3,
          dxCode4: d.dxCode4,
          mod1: d.submittedMod1,
          mod2: d.submittedMod2,
          mod3: d.submittedMod3,
          mod4: d.submittedMod4,
          allowedMod1: d.payerAllowedMod1,
          allowedMod2: d.payerAllowedMod2,
          allowedMod3: d.payerAllowedMod3,
          allowedMod4: d.payerAllowedMod4,
          allowedUnits: d.payerAllowedUnits,
          lineAllowed$: d.payerAllowedAmount,
          lineLevelPos: d.lineLevelPos,
          lineLevelTaxnomy: d.lineLevelTaxnomy,
          lineLevelNpi: d.lineLevelNpi,
          RefSlId: d.refSlId,
          RefClmId: d.refClaimId,
          allowedProcedureCode: d.payerAllowedProcedureCode,
          rvuPrice: getRefRvuPrice(ReferenceDrgnClaimid, d.itemizedBilllineId),
        });
      });

      let chargeAmount = [];
      let challengeAmount = [];
      let sumOfChargeAmt = 0;
      let sumOfChallengeAmt = 0;
      RefclaimData.map((e) => {
        chargeAmount.push(+e.chargeAmount);
        challengeAmount.push(+e.challengeAmount);
      });

      for (let i = 0; i < chargeAmount.length; i += 1) {
        sumOfChargeAmt += chargeAmount[i];
      }
      for (let i = 0; i < challengeAmount.length; i += 1) {
        sumOfChallengeAmt += challengeAmount[i];
      }
      setRefTotalChargeSum(sumOfChargeAmt);
      setRefTotalChallengeSum(sumOfChallengeAmt);
      setRefClaimIdData(RefclaimData);
      setOpenDRS1(true);
      setFilterClaimRefData(
        RefclaimData.sort((a, b) => a.itemizedBillLineId - b.itemizedBillLineId)
      );
    }
  }, [claimState.getReferencePolicyClaim]);

  function filterLinesData(id) {
    if (id.length == 4 || id.length == 5) {
      let matchedItemLinesData = filterClaimViewData.filter(
        (obj) => obj.code === id
      );
      if (matchedItemLinesData.length > 0) {
        setFilterClaimViewData(matchedItemLinesData);
      }
    }
    if (id.length == 0) {
      setFilterClaimViewData(claimIdData);
    }
  }

  function filterLinesData1(id) {
    if (id.length == 4 || id.length == 5) {
      let matchedItemLinesData1 = filterClaimRefData.filter(
        (obj) => obj.code === id
      );
      if (matchedItemLinesData1.length > 0) {
        setFilterClaimRefData(matchedItemLinesData1);
      }
    }
    if (id.length == 0) {
      setFilterClaimRefData(RefClaimIdData);
    }
  }

  function filteredData(id) {
    if (!openDRS1) {
      filterLinesData(id);
    }
  }

  const handleToCloseClaimReferenceViewPopUp = () => {
    setOpenDRS1(false);
    setRefClaimIdData([]);
    setReference(false);
    setFilterClaimRefData([]);
    setRefPolicyClaimData(intial);
    setRefTotalChargeSum(0);
    setRefTotalChallengeSum(0);
    setRefClaimIdData([]);
  };

  const handleToCloseClaimsViewPopUp = () => {
    setOpenDRS(false);
    setFilterClaimViewData([]);
    setclaimIdData([]);
    setPolicyClaimData(intial);
    setTotalChargeSum(0);
    setTotalChallengeSum(0);
    setclaimIdData([]);
    dispatch({ type: GET_DRGN_CLAIM_REVIW_DATA, payload: [] });
  };


  function ChildModal(
    claimdata,
    RefClaimdata,
    chargeAmountData,
    ChallengeAmountData,
    Type
  ) {
    return (
      <>
        <CustomPaper
          style={{
            boxShadow: "none",
            marginTop: "0px",
          }}
        >
          <GridContainer
            style={{
              borderBottom: "1px solid #E0E3E5",
              width: "100%",
              color: "black",
              backgroundColor: "lightGrey",
              paddingTop: "5px",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            <GridItem sm={3} md={3} xs={3}>
              <ul>
                <li>
                  <span className="labels">Client : </span>
                  <span className="patientIdGender1">
                    {claimdata.clientCode}
                  </span>
                </li>
                <li>
                  <span className="labels">Group : </span>
                  <span className="patientIdGender1">
                    {claimdata.clientGroupCode}
                  </span>
                </li>
                <li>
                  <span className="labels">Client Group Type : </span>
                  <span className="patientIdGender1">
                    {claimdata.clientGroupType}
                  </span>
                </li>
                <li>
                  <span className="labels">Number : </span>
                  <span className="patientIdGender1">
                    {claimdata.claimNumber}
                  </span>
                </li>
                <li>
                  <span className="labels">POS/Bill Type : </span>
                  <span className="patientIdGender1">
                    {claimdata.posBillType}
                  </span>
                </li>
              </ul>
            </GridItem>
            <GridItem sm={3} md={3} xs={3}>
              <ul>
                <li>
                  <span className="labels">SOC Id : </span>
                  <span className="patientIdGender1">
                    {claimdata.socProviderId}
                  </span>
                </li>
                <li>
                  <span className="labels"> SOC Postal Code : </span>
                  <span className="patientIdGender">
                    {claimdata.socPostalCode}
                  </span>
                </li>
                <li>
                  <span className="labels"> Billing ProvId : </span>
                  <span className="patientIdGender">
                    {claimdata.billingProvId}
                  </span>
                </li>
                <li>
                  <span className="labels"> Billing Postal Code : </span>
                  <span className="patientIdGender">
                    {claimdata.billingPostalCode}
                  </span>
                </li>
                <li>
                  <span className="labels"> NPI : </span>
                  <span className="patientIdGender">{claimdata.npi}</span>
                </li>
              </ul>
            </GridItem>
            <GridItem sm={3} md={3} xs={3}>
              <ul>
                <li>
                  <span className="labels"> Tax Identifier : </span>
                  <span className="patientIdGender">
                    {claimdata.taxIdentifier}
                  </span>
                </li>
                <li>
                  <span className="labels">Rend Taxonomy : </span>
                  <span className="patientIdGender">{claimdata.taxonomy}</span>
                </li>
                <li>
                  <span className="labels">Diagnosis Codes : </span>
                  <span className="diagsCodes" title={claimdata.DiagsCode}>
                    {claimdata.DiagsCode}
                  </span>
                </li>
                <li>
                  <span className="labels">Condition Codes : </span>
                  <span className="patientIdGender1">
                    {claimdata.conditionCode}
                  </span>
                </li>
                <li>
                  <span className="labels">Clm Form Type : </span>
                  <span className="patientIdGender1">
                    {claimdata.claimType}
                  </span>
                </li>
              </ul>
            </GridItem>
            <GridItem sm={3} md={3} xs={3}>
              <ul>
                <li>
                  <span className="labels"> Patient Id : </span>
                  <span className="patientIdGender1">
                    {claimdata.patientId}
                  </span>
                </li>
                <li>
                  <span className="labels">Gender : </span>
                  <span className="patientIdGender1">{claimdata.gender}</span>
                </li>
                <li>
                  <span className="labels">DOB : </span>
                  <span className="patientIdGender1">{claimdata.dob}</span>
                </li>
                <li>
                  <span className="labels">IPU Clm Type : </span>
                  <span className="patientIdGender1">
                    {claimdata.claimType ? openDRSData.ipuClaimType : ""}
                  </span>
                </li>
              </ul>
            </GridItem>
          </GridContainer>
        </CustomPaper>
        <h6 className="claimTitle">
          {claimdata.DrgnId.length > 10
            ? claimdata.DrgnId.split(",")[0]
            : claimdata.DrgnId}
          - {Type}
        </h6>

        <div className="row">
          <CustomInput
            type={"text"}
            variant={"outlined"}
            id="myInput"
            className="refCode"
            placeholder="Search Code"
            onChange={(e) => {
              if (reference) {
                filterLinesData1(e.target.value.toUpperCase());
              } else {
                filteredData(e.target.value.toUpperCase());
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <Search
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    color: black,
                  }}
                />
              </InputAdornment>
            }
          />
        </div>
        <div
          className="row"
          style={{ maxWidth: "100%", maxHeight: "500px", overflow: "auto",scrollbarWidth: "thin"}}
        >
          <table className = "claimViewTable">
            <tr>
              <th title="Service Line ID">
                <span className="claimViewThClass">SL ID</span>
              </th>
              <th title="CPT Code">
                <span className="claimViewThClass">CPT Code</span>
              </th>
              <th title="">
                <span className="claimViewThClass">Description</span>
              </th>
              <th title="Allowed Procedure Code">
                <span className="claimViewThClass">Allowed Procedure Code</span>
              </th>
              <th title="Quantity">
                <span className="claimViewThClassSmall">Qty</span>
              </th>
              <th title="Allowed Quantity">
                <span className="claimViewThClass">Allowed Qty</span>
              </th>
              <th title="Allowed Units">
                <span className="claimViewThClass">Allowed Units</span>
              </th>
              <th title="Total Charge $...">
                <span className="claimViewThClass">
                  Total Charge{" "}
                  <span style={{ color: "yellow" }}>
                    {"$" + "" + chargeAmountData}
                  </span>
                </span>
              </th>
              <th title="Allowed Line Amt $">
                <span className="claimViewThClass"> Allowed Line Amt $</span>
              </th>
              <th title="Reason Code">
                <span className="claimViewThClassSmall"> Reason Code</span>
              </th>
              <th title="RVU Price">
                <span className="claimViewThClassSmall"> RVU Price</span>
              </th>
              <th title="Challenge Amt $">
                <span className="claimViewThClass">
                  Challenge Amt ${" "}
                  <span style={{ color: "yellow" }}>
                    {"$" + "" + ChallengeAmountData}
                  </span>
                </span>
              </th>
              <th title="DOS From">
                <span className="claimViewThClass"> DOS From</span>
              </th>
              <th title="DOS To">
                <span className="claimViewThClass"> DOS To</span>
              </th>
              <th title="Line Level Pos">
                <span className="claimViewThClass"> Line Level POS</span>
              </th>
              <th title="Line Level Taxonomy">
                <span className="claimViewThClass"> Line Level Taxonomy</span>
              </th>
              <th title="Line Level NPI">
                <span className="claimViewThClass"> Line Level NPI</span>
              </th>
              <th title="Reference Service Line ID">
                <span className="claimViewThClass"> Ref SL ID</span>
              </th>
              <th title="Reference Claim ID">
                <span className="claimViewThClass"> Ref Clm ID</span>
              </th>
              <th title="Dx 1">
                <span className="claimViewThClass"> Dx 1</span>
              </th>
              <th title="Dx 2">
                <span className="claimViewThClass"> Dx 2</span>
              </th>
              <th title="Dx 3">
                <span className="claimViewThClass"> Dx 3</span>
              </th>
              <th title="Dx 4">
                <span className="claimViewThClass"> Dx 4</span>
              </th>
              <th title="Submitted Mod 1">
                <span className="claimViewThClass"> Mod 1</span>
              </th>
              <th title="Payer Allowed Mod 1">
                <span className="claimViewThClass"> Allowed Mod1</span>
              </th>
              <th title="Submitted Mod 2">
                <span className="claimViewThClass"> Mod 2</span>
              </th>
              <th title="Payer Allowed Mod 2">
                <span className="claimViewThClass"> Allowed Mod2</span>
              </th>
              <th title="Submitted Mod 3">
                <span className="claimViewThClass"> Mod 3</span>
              </th>
              <th title="Payer Allowed Mod 3">
                <span className="claimViewThClass"> Allowed Mod 3</span>
              </th>
              <th title="Submitted Mod 4">
                <span className="claimViewThClass"> Mod 4</span>
              </th>
              <th title="Payer Allowed Mod 4">
                <span className="claimViewThClass"> Allowed Mod 4</span>
              </th>
              <th title="Recommended Mod 1">
                <span className="claimViewThClass"> Rec Mod 1</span>
              </th>
              <th title="Recommended Mod 2">
                <span className="claimViewThClass"> Rec Mod 2</span>
              </th>
              <th title="Recommended Mod 3">
                <span className="claimViewThClass"> Rec Mod 3</span>
              </th>
              <th title="Recommended Mod 4">
                <span className="claimViewThClass"> Rec Mod 4</span>
              </th>
              <th title="Recommended Percentage">
                <span className="claimViewThClass"> Rec Percentage</span>
              </th>
            </tr>
            <tbody>
              {RefClaimdata.map((item, index) => {
                const rowspan = RefClaimdata.filter(
                  (obj) =>
                    obj.itemizedBillLineId === item.itemizedBillLineId &&
                    obj.code === item.code &&
                    (item.description === null || obj.description === item.description)
                  ).length;

                if (
                  index === 0 ||
                  item.itemizedBillLineId !==
                    RefClaimdata[index - 1].itemizedBillLineId ||
                  item.code !== RefClaimdata[index - 1].code ||
                  item.description !== RefClaimdata[index - 1].description
                ) {
                  return (
                    <>
                      <tr>
                        <td colSpan={36} className="clmName">
                          {item.name}
                        </td>
                      </tr>
                      <tr
                        key={index}
                        style={{
                          background: item.type === "IPU" ? "#BCF9E4" : "",
                        }}
                      >
                        <td rowSpan={rowspan}>{item.itemizedBillLineId}</td>
                        <td rowSpan={rowspan}>{item.code}</td>
                        <td title={item.description} rowSpan={rowspan}>
                          <span className="claimViewDesc">
                            {item.description}
                          </span>
                        </td>
                        {ShowRowsAfterRowSpan(item)}
                      </tr>
                    </>
                  );
                } else {
                  return (
                    <>
                      <tr
                        key={index}
                        style={{
                          background: item.type === "IPU" ? "#BCF9E4" : "",
                        }}
                      >
                        {ShowRowsAfterRowSpan(item)}
                      </tr>
                    </>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  const fullWidth = true;
  const maxWidth = "xl";
  let ViewType = "Claim View";
  let ReferenceViewType = "Reference Claim View";

  return (
    <>
      {filterClaimViewData.length>0 ? (<DialogBoxWithOutBorder
        fullWidth={claimIdData.length > 0 ? fullWidth : undefined}
        maxWidth={maxWidth}
        open={openDRS}
        showIcon={true}
        onClose={handleToCloseClaimsViewPopUp}
        disableBackdropClick={true}
        message={
            ChildModal(
                PolicyClaimData,
                filterClaimViewData,
                totalChargeSum,
                totalChallengeSum,
                ViewType
              )
        }
      />):undefined}
      <Draggable
        position={{
          x: currentPosition.xRate,
          y: currentPosition.yRate,
        }}
        onDrag={onDrag}
      >
        <Dialog
          open={openDRS1}
          onClose={handleToCloseClaimReferenceViewPopUp}
          maxWidth={maxWidth}
          disableBackdropClick={true}
          fullWidth={claimIdData.length > 0 ? fullWidth : undefined}
        >
          <DialogTitle>
            <IconButton
              style={{
                height: "2px",
                float: "right",
                marginRight: "-21px",
                marginTop: "-10px",
              }}
              onClick={handleToCloseClaimReferenceViewPopUp}
            >
              <CloseIcon />
            </IconButton>
            <DialogContentText>
              {openDRS1 && reference
                ? ChildModal(
                    RefPolicyClaimData,
                    filterClaimRefData,
                    ReftotalChargeSum,
                    ReftotalChallengeSum,
                    ReferenceViewType
                  )
                : undefined}
            </DialogContentText>
          </DialogTitle>
        </Dialog>
      </Draggable>
    </>
  );
};

export default ClaimView;
