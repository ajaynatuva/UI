import { useEffect, useRef } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllClaimType,
  getProcedureAgeDetails,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import { RESET_STATE } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import "./policyView.css";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CustomButton from "../../components/CustomButtons/CustomButton";
import {
  filterdPolicies,
  filterdReasonData,
  getUsedCategories,
  searchViewPolicy,
  subPolicyData1,
} from "../../redux/ApiCalls/PolicyViewApis/PolicyViewApis";
import { PolicyViewState } from "../../redux/reducers/PolicyViewReducer/PolicyViewReducer";
import {
  black,
  dangerColor,
  navyColor,
} from "../../assets/jss/material-kit-react";
import Template from "../../components/Template/Template";
import Slide from "@mui/material/Slide/Slide";
import { useNavigate } from "react-router-dom";
import { ExitToApp, MoreHoriz } from "@mui/icons-material";
import { AccessForExport } from "../../redux/ApiCallAction/Validations/AccessForExport";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  getCAT,
  // getMaxAge,
  getMedicalPolicy,
  // getMinAge,
  getNPI,
  getReasonCodes,
  getSubPolicy,
  getSubSpeciality,
  getTaxLogic,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { getPolicyById } from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { DescriptionTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { DetailsTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DetailsTabFieldsReducer";
import CustomInput from "../../components/CustomInput/CustomInput";
import { InputAdornment } from "@material-ui/core";
const intialSearchData = {
  medicalPolicy: undefined,
  subPolicy: undefined,
  category: undefined,
  reasonCode: undefined,
};
const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PolicyDisplay = () => {
  const dispatch = useDispatch();
  const [subPolChild, setSubChild] = React.useState(false);
  const [CatValue, setShowCatValue] = React.useState(null);
  const [showReasonPolchild, setShowReasonPolchild] = React.useState(false);
  const [medicalKeyValue, setMedicalKeyValue] = React.useState("");
  const [showSubChildDetails, setShowSubChildDetails] = React.useState(false);
  const [showReasonChildDetails, setShowReasonChildDetails] =
    React.useState(false);
  const [subKeyValue, setSubKeyValue] = React.useState("");
  const [showPolChild, setShowPolChild] = React.useState(false);
  const [showPolChildDetails, setShowPolChildDetails] = React.useState(false);
  const [showTotalPolDetails, setShowTotalPolDetails] = React.useState(false);
  const [showTotalPolChildDetails, setShowTotalChildPolDetails] =
    React.useState(false);
  const [reasonKeyValue, setReasonKeyValue] = React.useState("");
  const [localData, setLocalData] = React.useState([]);
  const [totalMedicalCount, setTotalMedicalCount] = React.useState(Number);
  const [npiValue, setNpiValue] = React.useState(null);
  const [taxonomyValue, setTaxonomyValue] = React.useState(undefined);
  const [deactivatedVal, setDeactivatedVal] = React.useState(null);
  const [customVal, setCustomVal] = React.useState(null);
  const [claimVal, setClaimVal] = React.useState([]);

  const [billingTaxIdVal, setBillingTaxIdVal] = React.useState(null);
  const [expanded, setExpanded] = React.useState([]);
  const [expandItems, setExpandedItems] = React.useState([]);

  const [checked, setChecked] = React.useState(false);

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  const descTabFields: DescriptionTabFieldState = useSelector(
    (state: any) => state.DescTabFieldsRedux
  );
  const detailsTabFields: DetailsTabFieldState = useSelector(
    (state: any) => state.DetailsTabFieldsRedux
  );
  const updatedState = useSelector((state: any) => state.newPolicy);

  const policyViewState: PolicyViewState = useSelector(
    (state: any) => state.policyViewReducer
  );

  const npiCM = updatedState.npi.map((n) => {
    return { label: n.description, value: n.npiLinkLkpKey };
  });

  const taxLogicCM = updatedState.taxLogic?.map((a) => {
    return { label: a.description, value: a.taxLinkLkpKey };
  });
  const taxonomyCM = updatedState.subSpeciality?.map((a) => {
    return { label: a.description, value: a.taxonomyLinkLkpKey };
  });

  const roleState: UserState = useSelector((state: any) => state.userReducer);

  let Role = JSON.stringify(roleState.roleName);
  let adminIdx = Role.toLocaleLowerCase().search("admin");

  const _ = require("lodash");
  function handleClaimType(e) {
    let claimData = e?.map((data) => {
      data.id = data.value;
      return data;
    });
    claimData.sort();
    setClaimVal(claimData);
  }
  useEffect(() => {
    const fetchData = async () => {
      if (!updatedState.MedicalPolicy.length) await getMedicalPolicy(dispatch);
      if (!updatedState.SubPolicy.length) await getSubPolicy(dispatch);
      if (!updatedState.RSN.length) await getReasonCodes(dispatch);
      if (!updatedState.CAT.length) await getCAT(dispatch);
      if (!updatedState.getClaimTypes.length) await getAllClaimType(dispatch);
      if (!updatedState.taxLogic.length) await getTaxLogic(dispatch);
      if (!updatedState.subSpeciality.length) await getSubSpeciality(dispatch);
      if (!updatedState.npi.length) await getNPI(dispatch);
      if (!policyViewState.getUsedCat.length) await getUsedCategories(dispatch);
      if (!updatedState.minAge.length) await getProcedureAgeDetails(dispatch);
      // if (!updatedState.maxAge.length) await getMaxAge(dispatch);
      searchViewPolicy(dispatch, obj);
      subPolicyData1(dispatch, obj);
      filterdReasonData(dispatch, obj);
      filterdPolicies(dispatch, obj);
    };

    fetchData();
  }, [dispatch]);
  let obj = [
    {
      categoryFk: null,
      npiLogicFk: null,
      taxonomy: null,
      taxIdLogicFk: null,
      deactivated: null,
      policyId: null,
      type: null,
    },
  ];

  function searchView() {
    let med = {
      categoryFk: CatValue,
      npiLogicFk: npiValue,
      taxonomy: taxonomyValue,
      taxIdLogicFk: billingTaxIdVal,
      deactivated: deactivatedVal,
      customVal:customVal,
      claimVal:claimVal
    };
    Object.entries(med).forEach(
      ([key, val]) => (obj[0][key] = val?.toString() || null)
    );
    searchViewPolicy(dispatch, obj);
    subPolicyData1(dispatch, obj);
    filterdPolicies(dispatch, obj);
    filterdReasonData(dispatch, obj);
  }

  const categoryOptions = policyViewState.getUsedCat.map((k, i) => {
    return { label: k.categoryFk, value: k.categoryFk, count: k.categoryCount };
  });
  const categoryDesc = (key) => {
    let catDesc: any = [];
    key.map((o, i) => {
      updatedState.CAT.map((k, i) => {
        if (o.value === k.policyCategoryLkpId) {
          catDesc.push({
            label: k.policyCategoryDesc + " - " + o.count,
            value: o?.value,
          });
        }
      });
    });
    return catDesc;
  };
  const medicalDesc = (key) => {
    let str;
    updatedState.MedicalPolicy.map((k) => {
      if (key === k.medicalPolicyKey) {
        str = k.medicalPolicyDesc;
      }
    });
    return str;
  };

  const categoryDesc1 = (key) => {
    let str;
    updatedState.CAT.map((k) => {
      if (key === k.policyCategoryLkpId) {
        str = k.policyCategoryDesc;
      }
    });
    return str;
  };

  const procedureMinAge = (key) => {
    let str;
    updatedState.minAge?.forEach((k) => {
      if (key === k.minMaxAgeLkpId) {
        str = k.minMaxAgeDesc;
      }
    });
    return str;
  };
  const procedureMaxAge = (key) => {
    let str;
    updatedState.maxAge?.forEach((k) => {
      if (key === k.minMaxAgeLkpId) {
        str = k.minMaxAgeDesc;
      }
    });
    return str;
  };


  const subDesc = (key) => {
    let str;
    updatedState.SubPolicy.map((k) => {
      if (key === k.subPolicyKey) {
        str = k.subPolicyDesc;
      }
    });
    return str;
  };

  const reasonDesc = (key) => {
    let str;
    updatedState.RSN.map((k) => {
      if (key === k.reasonCode) {
        str = k.reasonDesc;
      }
    });
    return str;
  };

  const reset = () => {
    medPoliReset();
    setShowReasonChildDetails(false);
    setShowTotalChildPolDetails(false);
    setShowTotalPolDetails(false);

    setMedicalKeyValue("");
    setSubKeyValue("");
    setReasonKeyValue("");
    setShowCatValue(null);
    setNpiValue(null);
    setTaxonomyValue(null);
    setBillingTaxIdVal(null);
    setChecked(false);
    setDeactivatedVal(null);
    setExpandedItems([]);
  };
  const medPoliReset = () => {
    setShowTotalPolDetails(false);
    setShowTotalChildPolDetails(false);
    setShowPolChild(false);
    setShowPolChildDetails(false);
    setShowReasonPolchild(false);
    setShowReasonChildDetails(false);
    setSubChild(false);
    setShowSubChildDetails(false);
    setSubKeyValue("");
    setMedicalKeyValue("");
    setReasonKeyValue("");
  };

  const medicalPolReset = () => {
    setSubChild(true);
    setShowReasonPolchild(false);
    setShowPolChild(false);
    setShowTotalPolDetails(false);
    setChecked(false);
    setReasonKeyValue("");
    setSubKeyValue("");
  };
  const subPolicyReset = () => {
    setShowReasonPolchild(true);
    setSubChild(false);
    setShowPolChild(false);
    setShowTotalPolDetails(false);
    setChecked(false);
    setReasonKeyValue("");
  };
  const reasonPolReset = () => {
    setShowPolChild(true);
    setShowReasonPolchild(false);
    setShowTotalPolDetails(false);
    setSubChild(false);
    setChecked(false);
  };
  let counter = 1;
  let TotalArray = [];

  useEffect(() => {
    let medicalSum = [];
    let medicalTotal = 0;
    policyViewState.getMedicalTotalData?.forEach((k, i) => {
      medicalSum.push(k.count);
    });
    for (let i = 0; i < medicalSum.length; i += 1) {
      medicalTotal += medicalSum[i];
    }
    setTotalMedicalCount(medicalTotal);

    policyViewState.getMedicalTotalData?.forEach((j, i) => {
      return TotalArray.push({
        medicalPolicyKey: j.medicalPolicyKeyFk,
        medicalPolCount: j.count,
        categoryFk: j.categoryFk,
        medicalPolicyChild: [],
        checked: 0,
      });
    });
    policyViewState.getFilterdSubPoliciesData.forEach((key1, o) => {
      TotalArray.forEach((array1Obj, l) => {
        if (key1.medicalPolicyKeyFk === array1Obj.medicalPolicyKey) {
          array1Obj.medicalPolicyChild.push({
            subPolicyKey: key1.subPolicyKeyFk,
            SubCount: key1.count,
            medicalPolicyKey: key1.medicalPolicyKeyFk,
            subPolicyChild: [],
            checked: 0,
          });
        }
      });
    });

    policyViewState.getFilterReasonData.forEach((r, o) => {
      TotalArray.forEach((re, l) => {
        if (r.medicalPolicyKeyFk === re.medicalPolicyKey) {
          re.medicalPolicyChild?.forEach((subKey, subVal) => {
            if (subKey.subPolicyKey === r.subPolicyKeyFk) {
              subKey.subPolicyChild.push({
                reasonCodeFk: r.reasonCodeFk,
                reasonCodeCount: r.count,
                reasonPolicyChild: [],
                medicalPolicyKey: subKey.medicalPolicyKey,
                subPolicyKey: subKey.subPolicyKey,
                checked: 0,
              });
            }
          });
        }
      });
    });

    policyViewState.getFilerdPoliciesData.forEach((pol) => {
      TotalArray.forEach((tot) => {
        if (pol.medicalPolicyKeyFk === tot.medicalPolicyKey) {
          tot.medicalPolicyChild?.forEach((subTot) => {
            if (subTot.subPolicyKey == pol.subPolicyKeyFk) {
              subTot.subPolicyChild.forEach((reas) => {
                if (reas.reasonCodeFk == pol.reasonCodeFk) {
                  reas.reasonPolicyChild.push({
                    policyId: pol.policyId,
                    policyNumber: pol.policyNumber,
                    policyVersion: pol.policyVersion,
                    taxonomyLogicFk: pol.taxonomyLogicFk,
                    taxLogicFk: pol.taxLogicFk,
                    npiLogicFk: pol.npiLogicFk,
                    checked: 0,
                  });
                }
              });
            }
          });
        }
      });
    });
    setLocalData(TotalArray);
  }, [policyViewState]);

  useEffect(() => {
    let filterArray = [];
    if (
      npiValue ||
      CatValue ||
      taxonomyValue ||
      billingTaxIdVal ||
      deactivatedVal
    ) {
      policyViewState.getMedicalTotalData?.forEach((j, i) => {
        return filterArray.push({
          medicalPolicyKey: j.medicalPolicyKeyFk,
          medicalPolCount: j.count,
          subPolicyKeyFk: j.subPolicyKeyFk,
          categoryFk: j.categoryFk,
          medicalPolicyChild: [],
        });
      });
      policyViewState.getFilterdSubPoliciesData.forEach((key1, o) => {
        filterArray.forEach((array1Obj, l) => {
          if (array1Obj.medicalPolicyKey == key1.medicalPolicyKeyFk) {
            array1Obj.medicalPolicyChild.push({
              subPolicyKey: key1.subPolicyKeyFk,
              SubCount: key1.count,
              medKey: key1.medicalPolicyKeyFk,
              subPolicyChild: [],
            });
          }
        });
      });
      policyViewState.getFilterReasonData.forEach((r, o) => {
        filterArray.forEach((re, l) => {
          if (r.medicalPolicyKeyFk === re.medicalPolicyKey) {
            re.medicalPolicyChild?.forEach((subKey, subVal) => {
              if (subKey.subPolicyKey === r.subPolicyKeyFk) {
                subKey.subPolicyChild.push({
                  reasonCodeFk: r.reasonCodeFk,
                  reasonCodeCount: r.count,
                  reasonPolicyChild: [],
                });
              }
            });
          }
        });
      });
      policyViewState.getFilerdPoliciesData.forEach((pol) => {
        filterArray.forEach((tot) => {
          if (pol.medicalPolicyKeyFk === tot.medicalPolicyKey) {
            tot.medicalPolicyChild?.forEach((subTot) => {
              if (subTot.subPolicyKey == pol.subPolicyKeyFk) {
                subTot.subPolicyChild.forEach((reas) => {
                  if (reas.reasonCodeFk == pol.reasonCodeFk) {
                    reas.reasonPolicyChild.push({
                      policyId: pol.policyId,
                      policyNumber: pol.policyNumber,
                      policyVersion: pol.policyVersion,
                      taxonomyLogicFk: pol.taxonomyLogicFk,
                      taxLogicFk: pol.taxLogicFk,
                      npiLogicFk: pol.npiLogicFk,
                    });
                  }
                });
              }
            });
          }
        });
      });
      setLocalData(filterArray);
    }
  }, [policyViewState]);

  useEffect(() => {
    setExpandedItems(["root"]);
  }, []);

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["root"] : ["root"]
    );
  };

  let stringClaimType: any = "";
  stringClaimType = policyFields.claimType.map((k, i) => {
    return k.label;
  });
  const claimTypeOptions = updatedState.getClaimTypes?.map((p) => {
    return { label: p.claimType + "-" + p.description, value: p.claimType };
  });
  const showClaimTypeValues  = claimVal?.map((p) => {
    return { label: p.label.charAt(0), value: p.value };
  });
  const subPolChildMethod = () => {
    let code = [];
    localData.map((medPol) => {
      if (medPol.medicalPolicyKey == medicalKeyValue) {
        medPol.medicalPolicyChild.map((f) => {
          code.push({ subPolKey: f.subPolicyKey, subCount: f.SubCount });
        });
      }
    });
    return code;
  };
  const reasonPolChildMethod = () => {
    let reasonCodes = [];
    localData.map((medPol) => {
      if (medPol.medicalPolicyKey == medicalKeyValue) {
        medPol.medicalPolicyChild.map((f) => {
          if (f.subPolicyKey == subKeyValue) {
            f.subPolicyChild.map((l) => {
              reasonCodes.push({
                reasonCodeKey: l.reasonCodeFk,
                reasonCount: l.reasonCodeCount,
              });
            });
          }
        });
      }
    });
    return reasonCodes;
  };
  const policyNumberChild = () => {
    let polices = [];
    localData.map((medPol) => {
      if (medPol.medicalPolicyKey == medicalKeyValue) {
        medPol.medicalPolicyChild.map((f) => {
          if (f.subPolicyKey == subKeyValue) {
            f.subPolicyChild.map((pol) => {
              if (pol.reasonCodeFk == reasonKeyValue) {
                pol.reasonPolicyChild.map((po1) => {
                  polices.push({
                    policyId: po1.policyId,
                    policyNumber: po1.policyNumber,
                    policyVersion: po1.policyVersion,
                  });
                });
              }
            });
          }
        });
      }
    });
    return polices;
  };

  const navigate = useNavigate();

  function NewPage() {
    navigate("/policyViewExport");
  }
  const medAndSubsummary =
    "This content will be available only in the Policy Export";
  const handleExpansionChange = (event, nodeIds) => {
    setExpandedItems(nodeIds);
  };

  const renderCustomInput = (
    label: string,
    color: string = "black",
    iconSize: number = 15,
    onIconClick?: () => void
  ) => {
    return (
      <CustomInput
        labelText={label}
        variant="outlined"
        style={{width:'100%'}}
        endAdornment={
          <InputAdornment position="end">
            <MoreHoriz
              style={{ cursor: "pointer", fontSize: iconSize, color }}
              onClick={onIconClick}
            />
          </InputAdornment>
        }
      />
    );
  };
  return (
    <>
      <Template>
        {/* <div className="mainBox"> */}
        <CustomPaper
          style={{
            // paddingLeft: 15,
            // paddingRight: 25,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            border: "1px solid #D6D8DA",
            marginRight: "10px",
            backgroundColor: "rgb(214 228 231)",
            marginTop: "5px",
            height: window.innerHeight / 1.15,
          }}
        >
          <div className="row">
            <div className="col-sm-4">
              <h5 className="heading">Policy View</h5>
            </div>
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <div className="innerBtn">
                <CustomButton
                  variant={"contained"}
                  onClick={() => {
                    searchView();
                  }}
                  style={{
                    backgroundColor: navyColor,
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 12,
                    padding: 4,
                  }}
                >
                  Search
                </CustomButton>
              </div>
              <div className="innerBtn">
                <CustomButton
                  variant={"contained"}
                  onClick={() => {
                    reset();
                    handleExpandClick();
                    dispatch({ type: RESET_STATE });
                    // searchView();
                    searchViewPolicy(dispatch, obj);
                    subPolicyData1(dispatch, obj);
                    filterdPolicies(dispatch, obj);
                    filterdReasonData(dispatch, obj);
                  }}
                  style={{
                    backgroundColor: dangerColor,
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 12,
                    marginLeft: 4,
                    padding: 4,
                  }}
                >
                  Reset
                </CustomButton>
              </div>
              <div className="innerBtn">
                {AccessForExport(localData, adminIdx) ? (
                  <CustomButton
                    variant={"contained"}
                    onClick={() => {
                      NewPage();
                    }}
                    style={{
                      backgroundColor: "#1b7fbf",
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      marginLeft: 4,
                      padding: 4,
                    }}
                    endIcon={<ExitToApp />}
                  >
                    Export
                  </CustomButton>
                ) : undefined}
              </div>
            </div>
          </div>
          <div className="row" style={{ marginLeft: "3px" }}>
            <div className="col-sm-2">
              <CustomSelect
                options={categoryDesc(categoryOptions)}
                labelText={"Category"}
                styles={{ fontWeight: 500 }}
                onSelect={(event) => {
                  setShowCatValue(event?.value);
                }}
                value={categoryDesc(categoryOptions).filter((k, i) => {
                  return k.value == CatValue;
                })}
              />
            </div>
            <div className="col-sm-2">
              <CustomSelect
                options={npiCM}
                labelText={"Rendering Provider NPI"}
                onSelect={(event) => {
                  setNpiValue(event?.value);
                  if (event == null) {
                    medPoliReset();
                  }
                  if (event != null) {
                    medPoliReset();
                  }
                }}
                value={npiCM.filter((k, i) => {
                  return k.value == npiValue;
                })}
              />
            </div>
            <div className="col-sm-2">
              <CustomSelect
                options={taxLogicCM}
                labelText={"Billing Provider ID"}
                onSelect={(event) => {
                  setBillingTaxIdVal(event?.value);
                  if (event == null) {
                    let code = {
                      catKey: null,
                    };
                    medPoliReset();
                  }
                  if (event != null) {
                    medPoliReset();
                  }
                }}
                value={taxLogicCM.filter((k, i) => {
                  return k.value == billingTaxIdVal;
                })}
              />
            </div>
            <div className="col-sm-2">
              <CustomSelect
                options={taxonomyCM}
                labelText={"Rendering Taxonomy"}
                onSelect={(event) => {
                  setTaxonomyValue(event?.value);
                  if (event == null) {
                    medPoliReset();
                  }
                  if (event != null) {
                    medPoliReset();
                  }
                }}
                value={taxonomyCM.filter((k, i) => {
                  return k.value == taxonomyValue;
                })}
              />
            </div>
            <div className="col-sm-1">
              <div style={{ position: "relative", top: "25px" }}>
                <CustomCheckBox
                  label={<span style={{ fontSize: "12px" }}>Custom</span>}
                  checked={customVal == 1 ? true : false}
                  onChange={(event) => {
                    setCustomVal(event.target.checked ? 1 : null)
                  }}
                />
              </div>
            </div>
            <div className="col-sm-1">
              <div style={{ position: "relative", top: "25px" }}>
                <CustomCheckBox
                  label={<span style={{ fontSize: "12px" }}>Deactivated</span>}
                  checked={deactivatedVal == 1 ? true : false}
                  onChange={(event) => {
                    setDeactivatedVal(event.target.checked ? 1 : null);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginLeft: "6px" }}>
            <div className="col-sm-2">
              {renderCustomInput("Client Group", "black", 15, () => {})}
            </div>
            <div className="col-sm-2">
              {renderCustomInput("Medical Policy", "black", 15, () => {})}
            </div>
            <div className="col-sm-2">
              {renderCustomInput("Sub Policy", "black", 15, () => {})}
            </div>
            <div className="col-sm-2">
              <CustomSelect
                labelText={"Claim Type"}
                styles={{ fontWeight: 500 }}
                isMulti
                checkBoxes={true}
                onSelect={(event) => {
                  handleClaimType(event);
                }}
                value={showClaimTypeValues}
                options={claimTypeOptions}
              />
            </div>
          </div>
          <div className="row" style={{ marginLeft: "3px" }}>
            <div className="col-sm-4">
              <SimpleTreeView
                aria-label="file system navigator"
                expandedItems={expandItems}
                onExpandedItemsChange={handleExpansionChange}
                slots={{
                  expandIcon: ArrowRightIcon,
                  collapseIcon: ArrowDropDownIcon,
                }}
                sx={{
                  height: 500,
                  // flexGrow: 1,
                  overflowY: "auto",
                  position: "relative",
                  top: "15px",
                  marginLeft: "5px",
                }}
              >
                <TreeItem
                  itemId="root"
                  label={"Medical Policies" + " - " + totalMedicalCount}
                  onClick={() => {
                    medPoliReset();
                  }}
                >
                  {localData?.map((loc) => {
                    counter = counter + 1;
                    return (
                      <TreeItem
                        itemId={counter.toString()}
                        label={
                          medicalDesc(loc.medicalPolicyKey) +
                          "-" +
                          loc.medicalPolCount
                        }
                        style={{
                          color:
                            medicalKeyValue == loc.medicalPolicyKey
                              ? "#E42F07"
                              : "",
                        }}
                        onClick={() => {
                          medicalPolReset();
                          setMedicalKeyValue(loc.medicalPolicyKey);
                        }}
                      >
                        <>
                          <label className="labels">Sub Policies:</label>
                          {loc.medicalPolicyChild.map((sub) => {
                            counter = counter + 1;
                            return (
                              <TreeItem
                                itemId={counter.toString()}
                                label={
                                  subDesc(sub.subPolicyKey) + "-" + sub.SubCount
                                }
                                style={{
                                  color:
                                    subKeyValue == sub.subPolicyKey
                                      ? "#E42F07"
                                      : "",
                                }}
                                onClick={() => {
                                  subPolicyReset();
                                  setSubKeyValue(sub.subPolicyKey);
                                  // subPolClicked(sub.subPolicyKey)
                                }}
                              >
                                <>
                                  <label className="labels">Reason Code:</label>
                                  {sub.subPolicyChild.map((c) => {
                                    counter = counter + 1;
                                    return (
                                      <TreeItem
                                        itemId={counter.toString()}
                                        label={
                                          reasonDesc(c.reasonCodeFk) +
                                          "-" +
                                          c.reasonCodeCount
                                        }
                                        style={{
                                          color:
                                            reasonKeyValue == c.reasonCodeFk
                                              ? "#E42F07"
                                              : "",
                                        }}
                                        onClick={() => {
                                          reasonPolReset();
                                          setReasonKeyValue(c.reasonCodeFk);
                                        }}
                                      >
                                        <>
                                          <label className="labels">
                                            Policies :
                                          </label>
                                          <div
                                            style={{
                                              width: "194px",
                                              position: "relative",
                                              left: "25px",
                                              color: "black",
                                            }}
                                          >
                                            <CustomSelect
                                              options={c.reasonPolicyChild.map(
                                                (pol) => {
                                                  return {
                                                    label:
                                                      pol.policyNumber +
                                                      "." +
                                                      pol.policyVersion,
                                                    value: pol.policyId,
                                                  };
                                                }
                                              )}
                                              styles={{ color: "black" }}
                                              onSelect={(event) => {
                                                if (event != null) {
                                                  getPolicyById(
                                                    dispatch,
                                                    event?.value
                                                  );
                                                }
                                                setShowReasonPolchild(false);
                                                setShowPolChild(false);
                                                setSubChild(false);
                                                setShowTotalPolDetails(true);
                                                setChecked(true);
                                              }}
                                            />
                                          </div>
                                        </>
                                      </TreeItem>
                                    );
                                  })}
                                </>
                              </TreeItem>
                            );
                          })}
                        </>
                      </TreeItem>
                    );
                  })}
                </TreeItem>
              </SimpleTreeView>
            </div>
            <div className="col-sm-8">
              {/* <div className="col-sm-4"></div> */}
              {medicalKeyValue ? (
                <h6
                  className="col-sm-4"
                  style={{
                    marginLeft: "16px",
                    textDecoration: "underLine",
                    color: navyColor,
                  }}
                >
                  Selected Details
                </h6>
              ) : undefined}
              <div style={{ marginLeft: "16px" }}>
                {subPolChild || showSubChildDetails ? (
                  <>
                    <h6>
                      Medical Policy :
                      <span className="RightchildData">
                        {medicalDesc(medicalKeyValue)}
                      </span>
                    </h6>
                    <h6>
                      Medical Policy Summary :
                      <div
                        className="RightchildData"
                        style={{ maxHeight: "100px", overflowY: "scroll" }}
                      >
                        {medAndSubsummary}
                        {/* {medicalPolicySum(medicalKeyValue)} */}
                      </div>
                    </h6>
                    {/* <span className="RightchildData">
                          {medicalPolicySum(medicalKeyValue)}
                        </span>*/}

                    <span>SubPolicies:</span>
                    {subPolChildMethod().map((f, i) => (
                      <li id="desc2">{subDesc(f.subPolKey)}</li>
                    ))}
                  </>
                ) : undefined}
                {showReasonPolchild || showReasonChildDetails ? (
                  <>
                    <h6>
                      Sub Policy :
                      <span className="RightchildData">
                        {subDesc(subKeyValue)}
                      </span>
                    </h6>
                    <h6>
                      {" "}
                      Sub Policy Summary :
                      <div
                        className="RightchildData"
                        style={{ maxHeight: "100px", overflowY: "scroll" }}
                      >
                        {medAndSubsummary}
                        {/* {subPolicySum(subKeyValue)} */}
                      </div>
                    </h6>
                    <span>Reason Policies :</span>
                    {reasonPolChildMethod().map((f) => (
                      <li id="desc2">{reasonDesc(f.reasonCodeKey)}</li>
                    ))}
                  </>
                ) : undefined}

                {showPolChild || showPolChildDetails ? (
                  <>
                    <h6>
                      Reason Code :
                      <span className="RightchildData">
                        {reasonDesc(reasonKeyValue)}
                      </span>
                    </h6>
                    <h6> Policy Numbers :</h6>
                    <div className="desc1">
                      {policyNumberChild().map((polN) => (
                        <li id="desc2">
                          {polN.policyNumber + "." + polN.policyVersion}
                        </li>
                      ))}
                    </div>
                  </>
                ) : undefined}
              </div>
              <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <div style={{ marginLeft: "16px" }}>
                  {showTotalPolDetails || showTotalPolChildDetails ? (
                    <>
                      <ul className="info-list">
                        <li>
                          <b>Medical Policy</b>{" "}
                          {medicalDesc(policyFields.medicalPolicyCode)}
                        </li>
                        <li>
                          <b> Sub Policy</b>{" "}
                          {subDesc(policyFields.subPolicyCode)}{" "}
                        </li>
                        <li>
                          <b> Reason Code </b>{" "}
                          {policyFields.reasonCode +
                            " - " +
                            reasonDesc(policyFields.reasonCode)}{" "}
                        </li>
                        <li>
                          <b>Policy Number </b> {policyFields.policyNumber}{" "}
                        </li>
                      </ul>
                      <h6
                        style={{
                          textDecoration: "underLine",
                          color: "#0F9A16",
                          marginLeft: "6px",
                        }}
                      >
                        Policy Details:
                      </h6>
                      <div
                        // className="col-sm-8"
                        style={{
                          marginLeft: "10px",
                          maxHeight: "380px",
                          overflowY: "auto",
                        }}
                      >
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Medical Policy Summary"
                            >
                              Medical Policy Summary
                            </th>
                            <td className="wrap" title={medAndSubsummary}>
                              {medAndSubsummary}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Medical Policy Summary"
                            >
                              Sub Policy Summary
                            </th>
                            <td className="wrap" title={medAndSubsummary}>
                              {medAndSubsummary}
                            </td>
                          </tr>
                          {/* <tr>
                              <th className="tabledHead" title="Medical Policy">
                                Medical Policy
                              </th>
                              <td
                                className="wrap"
                                title={medicalDesc(
                                  policyNumberDetails.medicalPolicy
                                )}
                              >
                                {medicalDesc(policyNumberDetails.medicalPolicy)}
                              </td>
                            </tr>
                            <tr>
                              <th className="tabledHead" title="Sub Policy">
                                Sub Policy
                              </th>
                              <td
                                className="wrap"
                                title={subDesc(policyNumberDetails.subPolicy)}
                              >
                                {subDesc(policyNumberDetails.subPolicy)}
                              </td>
                            </tr>
                            <tr>
                              <th className="tabledHead" title="Reason Code">
                                Reason Code
                              </th>
                              <td
                                className="wrap"
                                title={reasonDesc(policyNumberDetails.reason)}
                              >
                                {policyNumberDetails.reason +" - "+reasonDesc(policyNumberDetails.reason)}
                              </td>
                            </tr> */}
                          <tr>
                            <th className="tabledHead" title="Category">
                              Category
                            </th>
                            <td
                              className="wrap"
                              title={categoryDesc1(policyFields.catCode)}
                            >
                              {categoryDesc1(policyFields.catCode)}
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">Reference</th>
                            <td className="wrap" title={policyFields.reference}>
                              {descTabFields.referenceSourceDescription}
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">Claim Type</th>
                            <td className="wrap">
                              {stringClaimType.join(",")}
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">NPI</th>
                            <td
                              className="wrap"
                              title={detailsTabFields.npi?.label}
                            >
                              {detailsTabFields.npi?.label}
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">Deactivated</th>
                            <td className="wrap">{policyFields.deactivated}</td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Rendering Prov Taxonomy"
                            >
                              Rend Prov Taxonomy
                            </th>
                            <td
                              className="wrap"
                              title={detailsTabFields.taxonomy?.label}
                            >
                              {detailsTabFields.taxonomy?.label}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Billing Provider Tax ID"
                            >
                              Billing Provider Tax ID
                            </th>
                            <td
                              className="wrap"
                              title={detailsTabFields.taxId?.label}
                            >
                              {detailsTabFields.taxId?.label}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Procedure Min Age"
                            >
                              Procedure Min Age
                            </th>
                            <td
                              className="wrap"
                              title={procedureMinAge(
                                detailsTabFields.procedureMinAge
                              )}
                            >
                              {procedureMinAge(
                                detailsTabFields.procedureMinAge
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Procedure Max Age"
                            >
                              Procedure Max Age
                            </th>
                            <td
                              className="wrap"
                              title={procedureMaxAge(
                                detailsTabFields.procedureMaxAge
                              )}
                            >
                              {procedureMaxAge(
                                detailsTabFields.procedureMaxAge
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th
                              className="tabledHead"
                              title="Priority in Category"
                            >
                              Priority in Category
                            </th>
                            <td
                              className="wrap"
                              title={detailsTabFields.priority}
                            >
                              {detailsTabFields.priority}
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">Notes</th>
                            <td
                            // className="wrap"

                            // title={policyNumberDetails.notes}
                            >
                              <div
                                style={{
                                  maxHeight: "80px",
                                  overflowY: "auto",
                                  textAlign: "left",
                                }}
                              >
                                {descTabFields.notes}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th className="tabledHead">Description</th>
                            <td>
                              <div
                                style={{
                                  maxHeight: "80px",
                                  overflowY: "auto",
                                  textAlign: "left",
                                }}
                              >
                                {policyFields.policyDescription}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </>
                  ) : undefined}
                </div>
              </Slide>
            </div>
          </div>
          {/* </div> */}
        </CustomPaper>
        {/* </div> */}
      </Template>
    </>
  );
};

export default PolicyDisplay;
