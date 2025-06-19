import { ButtonGroup, InputAdornment, makeStyles } from "@material-ui/core";
import { MoreHoriz } from "@mui/icons-material";
import { Stack } from "@mui/material";
import Moment from "moment";
import {startTransition, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  black,
  dangerColor,
  navyColor,
} from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../../components/Dialog/DialogBox";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import AgGrids from "../../../components/TableGrid/AgGrids";
// import {
//   ENFORCE_BEFORE_CAT,
//   ENFO_CAT_CHECK,
//   ENFO_CAT_DESC,
//   MAX_AGE_ID_CHECK,
//   MAX__AGE_DESC,
//   MIN_AGE_DESC,
//   MIN_AGE_ID_CHECK,
//   PROCEDURE_MAX_AGE,
//   PROCEDURE_MIN_AGE,
// } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { LookUpState } from "../../../redux/reducers/LookUpReducer/LookUpReducer";
// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import {
  CMSColumns,
  EnforceBeforeCatLKPColumns,
  IgnoreModifierColumns,
  ProcedureMaxAgeColumns,
  ProcedureMinAgeColumns,
} from "../Columns";
import { PolicyConstants } from "../PolicyConst";
import { fetchLookupData, getAllowCmsNcciModifiers, getIgnoreModifier } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { CLAIM_TYPE_LINK_LKP } from "../../LookUps/LookUpConsts";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { DetailsTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/DetailsTabFieldsReducer";
import { DETAILS_TAB_FIELDS } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getCatDesc, isFieldInvalid, minMaxAgeDesc,setCheckboxValues, updatePrevDescriptionsForDetailsTab } from "../newPolicyUtils";
import { ValidatePolicyState } from "../../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import {
  getCAT,
  getCPTLink,
  getGender,
  // getMaxAge,
  getProcedureAgeDetails,
  getNPI,
  getPOSLINK,
  getRevenueCodeClaimLink,
  getSubSpeciality,
  getTaxLogic,
} from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { StringMethod } from "../../../redux/ApiCallAction/Validations/StringValidation";
const _ = require("lodash");

const Props = ({ edit, fromViewPolicy,showAllErrors }) => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState([]);
  const [minAge, setMinAge] = useState([]);
  const [maxAge, setMaxAge] = useState([]);
  const [createDate, setCreateDate] = useState(null);
  const [taxLogic, setTaxLogic] = useState([]);
  const [subSpeciality, setSubSpeciality] = useState([]);
  const [category, setCategory] = useState([]);
  const [npi, setNpi] = useState([]);
  const [posLink, setPosLink] = useState([]);
  const [revenueCodeClaimLink, setRevenueCodeClaimLink] = useState([]);
  const [cptLink, setCptLink] = useState([]);

  const [ignoreMod, setIgnoreMod] = useState(true);

  const [asMod, setASMod] = useState(true);
  const [proprows, setpropRows] = useState([]);
  const [selectedLkp, setSelectedLkp] = useState("");
  const [ignoreModifier59, setIgnoreModifier59] = useState([]);
  const [allowCmsNcciModifiers, setAllowCmsNcciModifiers] = useState([]);
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState("");
  const [showGridPopUp, setShowGridPopUp] = useState(false);
  const [showCrossClaimPopUp, setShowCrossClaimPopUp] = useState(false);
  const [showReferZeroPopUp, setShowReferZeroPopUp] = useState(false);

  const lookupState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const handleToClose = () => {
    setShowGridPopUp(false);
    setShowCrossClaimPopUp(false);
    setShowReferZeroPopUp(false);
  };

  const fullWidth = true;
  const maxWidth = "md";
  const [selectedLkpColumns, setselectedLkpColumns] = useState([]);
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    message: null,
    actions: null,
  });
  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const stateActionsMap = [
    { key: "gender", action: getGender },
    { key: "minAge", action: getProcedureAgeDetails },
    { key: "taxLogic", action: getTaxLogic },
    { key: "subSpeciality", action: getSubSpeciality },
    { key: "CAT", action: getCAT },
    { key: "npi", action: getNPI },
    { key: "posLink", action: getPOSLINK },
    // { key: "maxAge", action: getMaxAge },
    { key: "ignoreModifier", action: getIgnoreModifier },
    { key: "allowCmsNcciModifiers", action: getAllowCmsNcciModifiers },
    { key: "revenueCodeClaimLink", action: getRevenueCodeClaimLink },
    {
      key: "claimTypeLinkLkp",
      action: (dispatch) => {
        const lkpName = CLAIM_TYPE_LINK_LKP;
        fetchLookupData(dispatch, lkpName);
      },
    },
    { key: "cptLink", action: getCPTLink },
  ];

  useEffect(() => {
    stateActionsMap.forEach(({ key, action }) => {
      if (!updatedState[key] || updatedState[key].length === 0) {
        action(dispatch);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    setGender(updatedState.gender);
    setMinAge(updatedState.minAge);
    setMaxAge(updatedState.maxAge);
    setTaxLogic(updatedState.taxLogic);
    setSubSpeciality(updatedState.subSpeciality);
    setCategory(updatedState.CAT);
    setIgnoreModifier59(updatedState.ignoreModifier);
    setAllowCmsNcciModifiers(updatedState.allowCmsNcciModifiers);
    setNpi(updatedState.npi);
    setPosLink(updatedState.posLink);
    setCptLink(updatedState.cptLink);
    setRevenueCodeClaimLink(updatedState.revenueCodeClaimLink);
    setCreateDate(createDate);
  }, [
    createDate,
    updatedState.CAT,
    updatedState.allowCmsNcciModifiers,
    updatedState.cptLink,
    updatedState.gender,
    updatedState.ignoreModifier,
    updatedState.maxAge,
    updatedState.minAge,
    updatedState.npi,
    updatedState.posLink,
    updatedState.revenueCodeClaimLink,
    updatedState.subSpeciality,
    updatedState.taxLogic,
  ]);



  

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const DetailsTabFields: DetailsTabFieldState = useSelector(
    (state: any) => state.DetailsTabFieldsRedux
  );

  const validateFields: ValidatePolicyState = useSelector(
    (state: any) => state.validatePolicyFieldsRedux
  );

  const handleSelectevent = (field: string, value: any) => {
    dispatch({
      type: DETAILS_TAB_FIELDS,
      payload: { ...DetailsTabFields, [field]: value },
    });
  };

  const lkpGridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "15px",
      float: "right",
      right: "75px",
      display: "inline",
    }),
    []
  );


  const genderCM = gender?.map((l) => {
    return { label: l.genderDesc, value: l.genderCode };
  });
  const minAgeCM = minAge?.map((a) => {
    return { label: a.minMaxAgeDesc, value: a.minMaxAgeLkpId };
  });
  const maxAgeCM = maxAge?.map((a) => {
    return { label: a.minMaxAgeDesc, value: a.minMaxAgeLkpId };
  });
  const taxLogicCM = taxLogic?.map((a) => {
    return { label: a.description, value: a.taxLinkLkpKey };
  });
  const subSpecCM = subSpeciality?.map((a) => {
    return { label: a.description, value: a.taxonomyLinkLkpKey };
  });
  const catCM = category?.map((a) => {
    return { label: a.policyCategoryDesc, value: a.policyCategoryLkpId };
  });
  const npiCM = npi.map((n) => {
    return { label: n.description, value: n.npiLinkLkpKey };
  });
  const posCM = posLink.map((p) => {
    return { label: p.description, value: p.posLinkLkpKey };
  });
  const revenueCodeClmCM = revenueCodeClaimLink.map((r) => {
    return { label: r.description, value: r.revenueCodeClaimLinkKey };
  });
  const claimTypeLinkLkp = updatedState.claimTypeLinkLkp?.map((r) => {
    return { label: r.description, value: r.claimTypeLinkLkpKey };
  });

  const cptCM = cptLink.map((c) => {
    return { label: c.description, value: c.cptLinkLkpKey };
  });

  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const useStyles = makeStyles((theme) => ({
    DesktopDatePicker: {
      border: "1px solid red",
      backgroundColor: dangerColor,
    },
  }));


  const memoizedDetailsTabFields = useMemo(
    () => DetailsTabFields,
    [
      DetailsTabFields.enforceBeforeCategory,
      DetailsTabFields.procedureMinAge,
      DetailsTabFields.procedureMaxAge,
    ]
  );

    const memoizedUpdatedState = useMemo(
      () => updatedState,
      [
        updatedState.CAT.length,
        updatedState.maxAge.length,
        updatedState.minAge.length,
      ]
    );
  
    useEffect(() => {
      updatePrevDescriptionsForDetailsTab(
        memoizedDetailsTabFields,
        memoizedUpdatedState,
        dispatch,
        selectedLkp
      );
    }, [dispatch, memoizedDetailsTabFields, memoizedUpdatedState, selectedLkp]);


  useEffect(() => {
    if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
      let col = Object.assign({}, selectedLkpColumns);
      col = EnforceBeforeCatLKPColumns;
      setselectedLkpColumns(col);
      const enforcebeforecategory = category.map((sp, i) => {
        return {
          id: i,
          priority: sp.priority,
          policyCategoryLkpId: sp.policyCategoryLkpId,
          policyCategoryDesc: sp.policyCategoryDesc,
          lastUpdatedAt: Moment(sp.lastUpdatedAt).format("MM-DD-YYYY hh:mm:ss"),
        };
      });
      setpropRows(enforcebeforecategory);
    }

    if (selectedLkp == PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
      let col = Object.assign({}, selectedLkpColumns);
      col = ProcedureMinAgeColumns;
      setselectedLkpColumns(col);
      const minage = minAge.map((sp, i) => {
        return {
          id: i,
          minMaxAgeLkpId: sp.minMaxAgeLkpId,
          minMaxAgeDesc: sp.minMaxAgeDesc,
          ageYears: sp.ageYears,
          ageMonths: sp.ageMonths,
          ageDays: sp.ageDays,
          equalsB: sp.equalsB,
          minVsMaxB: sp.minVsMaxB,
        };
      });
      setpropRows(minage);
    }
    if (selectedLkp == PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
      let col = Object.assign({}, selectedLkpColumns);
      col = ProcedureMaxAgeColumns;
      setselectedLkpColumns(col);
      const maxage = maxAge.map((sp, i) => {
        return {
          id: i,
          minMaxAgeLkpId: sp.minMaxAgeLkpId,
          minMaxAgeDesc: sp.minMaxAgeDesc,
          ageYears: sp.ageYears,
          ageMonths: sp.ageMonths,
          ageDays: sp.ageDays,
          equalsB: sp.equalsB,
          minVsMaxB: sp.minVsMaxB,
        };
      });
      setpropRows(maxage);
    }

    if (selectedLkp == PolicyConstants.IGNORE_MOD) {
      let col = Object.assign({}, selectedLkpColumns);
      col = IgnoreModifierColumns;
      setselectedLkpColumns(col);
      const ignoreModifier = ignoreModifier59.map((sp, i) => {
        return {
          id: i,
          cptMod: sp.cptMod,
          description: sp.description,
        };
      });
      setpropRows(ignoreModifier);
    }

    if (selectedLkp == PolicyConstants.ALLOW_CMS_NCCI_MOD) {
      let col = Object.assign({}, selectedLkpColumns);
      col = CMSColumns;
      setselectedLkpColumns(col);
      const CMS = allowCmsNcciModifiers.map((sp, i) => {
        return {
          id: i,
          cptMod: sp.cptMod,
          description: sp.description,
        };
      });
      setpropRows(CMS);
    }
  }, [selectedLkp]);

  useEffect(() => {
    if (!DetailsTabFields.referenceClaimType) {
      dispatch({
        type: DETAILS_TAB_FIELDS,
        payload: { referenceClaimType: 0 },
      });
    }
    if (!DetailsTabFields.referZeroChargeLine) {
      dispatch({
        type: DETAILS_TAB_FIELDS,
        payload: { referZeroChargeLine: 0 },
      });
    }
  }, [dispatch]);


  const onSelectionChanged = async (event) => {
    if (!edit) {
      if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
        let a = event.api.getSelectedRows();
        setSelectedCheckboxValue(a);
      }
    }
    if (!edit) {
      if (selectedLkp == PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
        let a = event.api.getSelectedRows();
        setSelectedCheckboxValue(a);
      }
    }
    if (!edit) {
      if (selectedLkp == PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
        let a = event.api.getSelectedRows();
        setSelectedCheckboxValue(a);
      }
    }
  };

  const onGridReady = (data) => {
    data.api.forEachLeafNode((s) => {
      if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
        if (s.data?.id === DetailsTabFields.enfoCatCheck) {
          s.setSelected(true);
        }
      }
      if (selectedLkp == PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
        if (s.data?.id === DetailsTabFields.procedureMinAgeIdCheck) {
          s.setSelected(true);
        }
      }
      if (selectedLkp == PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
        if (s.data?.id === DetailsTabFields.procedureMaxAgeIdCheck) {
          s.setSelected(true);
        }
      }
    });
  };

  // const clearDialogValues = () => {
  //   if (fromViewPolicy) {
  //     if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
  //       dispatch({
  //         type: ENFO_CAT_DESC,
  //         payload: formState.temporaryEnfocatDesc,
  //       });
  //       dispatch({
  //         type: ENFORCE_BEFORE_CAT,
  //         payload: formState.tmpEnforceBeforeCatCode,
  //       });
  //       dispatch({
  //         type: ENFO_CAT_CHECK,
  //         payload: formState.temporaryEnfoCatCheck,
  //       });
  //       // dispatch({ type: ENFORCE_BEFORE_CAT, payload: formState.tmpCatCode });
  //     }

  //     if (selectedLkp == PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
  //       dispatch({
  //         type: MIN_AGE_DESC,
  //         payload: formState.temporaryMinAgeDesc,
  //       });
  //       dispatch({
  //         type: PROCEDURE_MIN_AGE,
  //         payload: formState.tmpProcedureMinAgeCode,
  //       });
  //       dispatch({
  //         type: MIN_AGE_ID_CHECK,
  //         payload: formState.temporaryMinAgeIdCheck,
  //       });
  //     }
  //     if (selectedLkp == PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
  //       dispatch({
  //         type: MAX__AGE_DESC,
  //         payload: formState.tempoararyMaxAgeDesc,
  //       });
  //       dispatch({
  //         type: PROCEDURE_MAX_AGE,
  //         payload: formState.tmpProcedureMaxAgeCode,
  //       });

  //       dispatch({
  //         type: MAX_AGE_ID_CHECK,
  //         payload: formState.temporaryMaxAgeIdCheck,
  //       });
  //     }
  //   }
  // };
  // eslint-disable-next-line no-restricted-globals
  const paths = location.pathname.replaceAll("/", "");

  useEffect(() => {
    if (paths == PolicyConstants.VIEW_POLICY) {
      setIgnoreMod(true);
    }
    if (
      paths == PolicyConstants.EDIT_POLICY ||
      paths == PolicyConstants.NEW_POLICY
    ) {
      if (DetailsTabFields.ncciModifierB == 0) {
        setIgnoreMod(true);
      }
      if (DetailsTabFields.ncciModifierB == 1) {
        setIgnoreMod(false);
      }
    }
  }, [DetailsTabFields?.ncciModifierB]);

  useEffect(() => {
    if (paths == PolicyConstants.VIEW_POLICY) {
      setASMod(true);
    }
    if (
      paths == PolicyConstants.EDIT_POLICY ||
      paths == PolicyConstants.NEW_POLICY
    ) {
      setASMod(false);
    }
  }, [DetailsTabFields]);

  function showPopUpTitle() {
    if (showGridPopUp) return selectedLkp;
    if (showCrossClaimPopUp) return "Refer Cross Claim Form Type";
    if (showReferZeroPopUp) return "Reference Zero Billed/Allowed";
  }
  function openPopUp() {
    if (showGridPopUp) return showGridPopUp;
    if (showCrossClaimPopUp) return showCrossClaimPopUp;
    if (showReferZeroPopUp) return showReferZeroPopUp;
  }
  function showContentInPopUP() {
    if (showGridPopUp)
      return (
        <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
          <AgGrids
            rowData={proprows}
            columnDefs={selectedLkpColumns}
            rowSelection={"single"}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            gridIconStyle={lkpGridIconStyle}
          />
        </div>
      );
    if (showCrossClaimPopUp)
      return (
        <div>
          <p>
            If Set (Checked) - Claim Types A, F, P will reference claim types I,
            O, S for historical references
          </p>
          <p>
            If Not Set (Unchecked - Default) A, F, P will reference only A, F
            and P. It will not reference I, O, S
          </p>
        </div>
      );
    if (showReferZeroPopUp)
      return (
        <div>
          <p>
            If Set (Checked) - Consider the lines with zero charges as Reference
            (Billed Amount for TPA and Allowed Amount for HP)
          </p>
          <p>
            If Not Set (Unchecked - Default) - Do not consider the lines with
            zero charges as Reference (Billed Amount for TPA and Allowed Amount
            for HP)
          </p>
        </div>
      );
  }

  return (
    <div>
      <CustomPaper
        style={{
          paddingLeft: 12,
          position: "relative",
          right: 20,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 12,
          boxShadow: "none",
          border: "1px solid #D6D8DA",
          marginRight: "0px",
        }}
      >
        <GridContainer>
          <GridItem sm={4} md={4} xs={4}>
            <Stack component="form" noValidate spacing={2} direction={"row"}>
              <CustomInput
                disabled={true}
                error={showAllErrors ? isFieldInvalid(DetailsTabFields.createdDate): false}
                id="date"
                labelText={"Created Date"}
                type="date"
                variant={"outlined"}
                value={
                  fromViewPolicy
                    ? DetailsTabFields.createdDate
                      ? Moment(DetailsTabFields.createdDate).format(
                          "YYYY-MM-DD"
                        )
                      : null
                    : ""
                }
                onChange={(event) => {
                  dispatch({
                    type: DETAILS_TAB_FIELDS,
                    payload: { createdDate: event.target.value },
                  });
                  // setCreateDate(event.target.value);
                }}
                InputProps={{
                  style: {
                    height: 24,
                    width: "100%",
                  },
                }}
              />
              {policyFields.custom == true ? (
                <CustomInput
                  disabled={true}
                  labelText={"Cloned Policy.Version"}
                  variant={"outlined"}
                  value={
                    policyFields.clonedPolicyId &&
                    policyFields.clonedPolicyId !== null
                      ? policyFields.clonedPolVer
                      : ""
                  }
                />
              ) : undefined}
            </Stack>
          </GridItem>

          <GridItem sm={4} md={4} xs={4}>
            <CustomInput
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.enforceBeforeCategory): false}
              fullWidth={true}
              labelText={"Enforce Before Category"}
              showStarIcon={true}
              variant={"outlined"}
              value={getCatDesc(DetailsTabFields.enforceBeforeCategory,updatedState.CAT)}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setShowGridPopUp(true);
                    // setOpenLkp(true);
                    setSelectedLkp(PolicyConstants.ENFORCE_BEFORE_CAT_LKP);
                  }}
                >
                  <MoreHoriz
                    style={{
                      cursor: "pointer",
                      fontSize: 15,
                      color: black,
                    }}
                  />
                </InputAdornment>
              }
            />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <div style={{ position: "absolute", top: "13px" }}>
              <CustomCheckBox
                checked={DetailsTabFields.ncciModifierB == 1}
                value={DetailsTabFields.ncciModifierB}
                size="small"
                className="checkboxes"
                disabled={!edit ? undefined : fromViewPolicy}
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      position: "relative",
                      bottom: "2.5px",
                    }}
                  >
                    Apply CMS NCCI Modifiers
                  </span>
                }
                onChange={(event) => {
                  if (!event.target.checked) {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { Modifier59GroupB: 0 },
                    });
                  } else {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { ncciModifierB: 0 },
                    });
                  }
                  dispatch({
                    type: DETAILS_TAB_FIELDS,
                    payload: { ncciModifierB: event.target.checked },
                  });
                }}
              />
              <p
                onClick={() => {
                  // setOpenLkp(true);
                  setShowGridPopUp(true);
                  setSelectedLkp(PolicyConstants.ALLOW_CMS_NCCI_MOD);
                }}
              >
                <MoreHoriz
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    color: "white",
                    position: "absolute",
                    backgroundColor: "gray",
                    left: 180,
                    bottom: 27,
                    borderRadius: 4,
                    height: 13,
                  }}
                />
              </p>
            </div>
          </GridItem>
          <GridItem sm={2} md={2} xs={2} />
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.gender): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { gender: event },
                })
              }
              value={DetailsTabFields.gender}
              options={genderCM}
              hoverData={genderCM.map((l) => {
                return l.label;
              })}
              labelText={"Gender"}
              showStarIcon={true}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomInput
              maxLength={3}
              disabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.priority): false}
              value={DetailsTabFields.priority}
              onChange={(event) => {
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { priority: event.target.value },
                });
              }}
              onKeyPress={(e) => StringMethod(e)}
              type={"text"}
              fullWidth={true}
              labelText={"Priority in Category"}
              showStarIcon={true}
              variant={"outlined"}
            />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <div style={{ position: "absolute", bottom: "20px" }}>
              <CustomCheckBox
                disabled={ignoreMod}
                checked={DetailsTabFields.Modifier59GroupB == 1}
                value={DetailsTabFields.Modifier59GroupB}
                size="small"
                className="checkboxes"
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      position: "relative",
                      bottom: "2.5px",
                    }}
                  >
                    Apply Modifier 59 Group
                  </span>
                }
                onChange={(event) => {
                  dispatch({
                    type: DETAILS_TAB_FIELDS,
                    payload: { Modifier59GroupB: event.target.checked },
                  });
                }}
              />
              <p
                onClick={() => {
                  // setOpenLkp(true);
                  setShowGridPopUp(true);
                  setSelectedLkp(PolicyConstants.IGNORE_MOD);
                }}
              >
                <MoreHoriz
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    color: "white",
                    position: "absolute",
                    backgroundColor: "gray",
                    left: 180,
                    bottom: 27,
                    borderRadius: 4,
                    height: 13,
                  }}
                />
              </p>
            </div>
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomInput
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.procedureMinAge): false}
              fullWidth={true}
              labelText={"Procedure Min Age"}
              showStarIcon={true}
              variant={"outlined"}
              value={minMaxAgeDesc(
                DetailsTabFields.procedureMinAge,
                updatedState.minAge
              )
            }
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    // setOpenLkp(true);
                    setShowGridPopUp(true);
                    setSelectedLkp(PolicyConstants.PROCEDURE_MIN_AGE_LKP);
                  }}
                >
                  <MoreHoriz
                    style={{
                      cursor: "pointer",
                      fontSize: 15,
                      color: black,
                    }}
                  />
                </InputAdornment>
              }
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomInput
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.procedureMaxAge): false}
              fullWidth={true}
              labelText={"Procedure Max Age"}
              showStarIcon={true}
              variant={"outlined"}
              value={minMaxAgeDesc(
                DetailsTabFields.procedureMaxAge,
                updatedState.maxAge
              )}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setShowGridPopUp(true);
                    setSelectedLkp(PolicyConstants.PROCEDURE_MAX_AGE_LKP);
                  }}
                >
                  <MoreHoriz
                    style={{
                      cursor: "pointer",
                      fontSize: 15,
                      color: black,
                    }}
                  />
                </InputAdornment>
              }
            />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <div
              style={{ position: "absolute", bottom: "55px", float: "left" }}
            >
              <CustomCheckBox
                disabled={asMod}
                checked={DetailsTabFields.ASGroupB == 1}
                value={DetailsTabFields.ASGroupB}
                size="small"
                className="checkboxes"
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      position: "relative",
                      bottom: "2.5px",
                    }}
                  >
                    Apply AS,80,81 & 82 Logic
                  </span>
                }
                onChange={(event) => {
                  dispatch({
                    type: DETAILS_TAB_FIELDS,
                    payload: { ASGroupB: event.target.checked },
                  });
                }}
              />
            </div>
          </GridItem>

          {/* <GridItem sm={4} md={4} xs={4} /> */}
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.npi): false}
              onSelect={(event) =>
                dispatch({ type: DETAILS_TAB_FIELDS, payload: { npi: event } })
              }
              value={DetailsTabFields.npi}
              options={npiCM}
              labelText={"Rendering Provider NPI"}
              showStarIcon={true}
              hoverData={npiCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.taxId): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { taxId: event },
                })
              }
              value={DetailsTabFields.taxId}
              options={taxLogicCM}
              labelText={"Billing Provider Tax ID"}
              showStarIcon={true}
              hoverData={taxLogicCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>

          <GridItem sm={2} md={2} xs={2}>
            <div
              style={{ position: "absolute", bottom: "80px", float: "left" }}
            >
              <CustomCheckBox
                disabled={asMod}
                checked={DetailsTabFields.tc26ModB == 1}
                value={DetailsTabFields.tc26ModB}
                size="small"
                className="checkboxes"
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      position: "relative",
                      bottom: "2.5px",
                    }}
                  >
                    Apply TC/26 Logic
                  </span>
                }
                onChange={(event) => {
                  dispatch({
                    type: DETAILS_TAB_FIELDS,
                    payload: { tc26ModB: event.target.checked },
                  });
                }}
              />
            </div>
          </GridItem>
          {/* <GridItem sm={4} md={4} xs={4} /> */}
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.taxonomy): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { taxonomy: event },
                })
              }
              value={DetailsTabFields.taxonomy}
              options={subSpecCM}
              labelText={"Rendering Provider Taxonomy"}
              showStarIcon={true}
              hoverData={subSpecCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.posLink): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { posLink: event },
                })
              }
              value={DetailsTabFields.posLink}
              options={posCM}
              labelText={"POS Link"}
              showStarIcon={true}
              hoverData={posCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <div className="crossHeight"></div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="newlab">Cross Claim Form Link</span>
              <p
                onClick={() => {
                  // setopenRefTypeLkp(true);
                  setShowCrossClaimPopUp(true);
                }}
                style={{ margin: 0, marginLeft: "8px" }} // Optional: Add margin to create space between text and icon
              >
                <MoreHoriz
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    color: "white",
                    backgroundColor: "gray",
                    borderRadius: 4,
                  }}
                />
              </p>
              <div className="crossradio">
                <RadioButton
                  disabled={edit}
                  label={"Yes"}
                  checked={
                    DetailsTabFields.referenceClaimType === 1
                      ? true
                      : false
                  }
                  onChange={(event) => {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { referenceClaimType: 1 },
                    });
                  }}
                />
                <RadioButton
                  disabled={edit}
                  label={"No"}
                  checked={
                    DetailsTabFields.referenceClaimType === 0
                      ? true
                      : false
                  }
                  onChange={(event) => {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { referenceClaimType: 0 },
                    });
                  }}
                />
              </div>
            </div>
          </GridItem>
          {/* <GridItem sm={4} md={4} xs={4} /> */}
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.revenueCodeClaimLink): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { revenueCodeClaimLink: event },
                })
              }
              value={DetailsTabFields.revenueCodeClaimLink}
              options={revenueCodeClmCM}
              labelText={"Revenue Code Claim Link"}
              showStarIcon={true}
              hoverData={revenueCodeClmCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.claimTypeLink): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { claimTypeLink: event },
                })
              }
              value={DetailsTabFields.claimTypeLink}
              options={claimTypeLinkLkp}
              labelText={"Claim Type Link"}
              showStarIcon={true}
              hoverData={claimTypeLinkLkp.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={4} md={4} xs={4}>
            <div className="ReferLines"></div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="newlab">Reference Zero Billed/Allowed</span>
              <p
                onClick={() => {
                  // setopenRefLinesCharges(true);
                  setShowReferZeroPopUp(true);
                }}
                style={{ margin: 0, marginLeft: "8px" }} // Optional: Add margin to create space between text and icon
              >
                <MoreHoriz
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    color: "white",
                    backgroundColor: "gray",
                    borderRadius: 4,
                  }}
                />
              </p>
              <div className="crossradio">
                <RadioButton
                  disabled={edit}
                  label={"Yes"}
                  checked={
                    DetailsTabFields.referZeroChargeLine === 1 ? true : false
                  }
                  onChange={(event) => {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { referZeroChargeLine: 1 },
                    });
                  }}
                />
                <RadioButton
                  disabled={edit}
                  label={"No"}
                  checked={
                    DetailsTabFields.referZeroChargeLine === 0 ? true : false
                  }
                  onChange={(event) => {
                    dispatch({
                      type: DETAILS_TAB_FIELDS,
                      payload: { referZeroChargeLine: 0 },
                    });
                  }}
                />
              </div>
            </div>
          </GridItem>
          {/* <GridItem sm={4} md={4} xs={4} /> */}
          <GridItem sm={4} md={4} xs={4}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              error={showAllErrors ? isFieldInvalid(DetailsTabFields.cptLink): false}
              onSelect={(event) =>
                dispatch({
                  type: DETAILS_TAB_FIELDS,
                  payload: { cptLink: event },
                })
              }
              value={DetailsTabFields.cptLink}
              options={cptCM}
              labelText={"CPT Link"}
              showStarIcon={true}
              hoverData={cptCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
        </GridContainer>
      </CustomPaper>

      {showGridPopUp || showCrossClaimPopUp || showReferZeroPopUp ? (
        <Dialogbox
          fullWidth={showGridPopUp?fullWidth:false}
          maxWidth={showGridPopUp ? "md" : "sm"}
          disableBackdropClick={true}
          open={openPopUp()}
          title={showPopUpTitle()}
          message={showContentInPopUP()}
          onClose={handleToClose}
          actions={
            showGridPopUp ? (
              <>
                <ButtonGroup style={{ marginTop: "-50px" }}>
                  {!edit &&
                  !(selectedLkp == PolicyConstants.IGNORE_MOD) &&
                  !(selectedLkp == PolicyConstants.ALLOW_CMS_NCCI_MOD) ? (
                    <CustomButton
                      variant={"contained"}
                      onClick={() => {
                        handleToClose();
                        setCheckboxValues(
                          selectedCheckboxValue,
                          selectedLkp,
                          edit,
                          validateFields,
                          dispatch
                        );
                      }}
                      onChange={(event) => {}}
                      style={{
                        backgroundColor: navyColor,
                        color: "white",
                        margin: 10,
                        padding: 4,
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      Yes
                    </CustomButton>
                  ) : undefined}
                  {!edit &&
                  !(selectedLkp == PolicyConstants.IGNORE_MOD) &&
                  !(selectedLkp == PolicyConstants.ALLOW_CMS_NCCI_MOD) ? (
                    <CustomButton
                      onClick={() => {
                        handleToClose();
                        // clearDialogValues();
                      }}
                      variant={"contained"}
                      style={{
                        backgroundColor: dangerColor,
                        color: "white",
                        margin: 10,
                        padding: 4,
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      No
                    </CustomButton>
                  ) : undefined}
                </ButtonGroup>
              </>
            ) : undefined
          }
        />
      ) : undefined}
    
    </div>
  );
};
export default Props;
