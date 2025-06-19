import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
// import TreeView from "@mui/lab/TreeView";
// import TreeItem from "@mui/lab/TreeItem";
import { ArrowBackIos } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ButtonGroup, Stack, Switch, Typography, styled } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import {
  dangerColor,
  navyColor,
  successColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import Template from "../../components/Template/Template";
import { getAllClaimType } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { AccessForExport } from "../../redux/ApiCallAction/Validations/AccessForExport";
import { saveNewClientSetUp } from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpApis";
import { RESETNEWCLIENT } from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpTypes";
import { RESET_STATE } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  ExportPolicies,
  filterdPolicies,
  filterdReasonData,
  getUsedCategories,
  searchViewPolicy,
  subPolicyData1,
  uploadClaimProcssingIntroduction,
} from "../../redux/ApiCalls/PolicyViewApis/PolicyViewApis";
import { NewClientSetUpState } from "../../redux/reducers/NewClientSetUpReducer/NewClientSetUpReducer";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { PolicyViewState } from "../../redux/reducers/PolicyViewReducer/PolicyViewReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "./policyView.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import {
  getCAT,
  // getMaxAge,
  getMedicalPolicy,
  // getMinAge,
  getProcedureAgeDetails,
  getNPI,
  getReasonCodes,
  getSubPolicy,
  getSubSpeciality,
  getTaxLogic,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";

const PolicyViewExport = () => {
  const dispatch = useDispatch();
  const [medicalKeyValue, setMedicalKeyValue] = React.useState("");
  const [subKeyValue, setSubKeyValue] = React.useState("");
  const [reasonKeyValue, setReasonKeyValue] = React.useState("");
  const [localData, setLocalData] = React.useState([]);
  const [totalMedicalCount, setTotalMedicalCount] = React.useState(Number);
  const [expanded, setExpanded] = React.useState([]);

  const [checked, setChecked] = React.useState(false);
  const [exportedDataDetails, setExportedDataDetails] = React.useState([]);

  const [buttonType, setButtonType] = React.useState("");
  const [expandItems, setExpandedItems] = React.useState([]);

  let allNodes = useRef([]);

  const policyNumberDetails: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const updatedState = useSelector((state: any) => state.newPolicy);

  const policyViewState: PolicyViewState = useSelector(
    (state: any) => state.policyViewReducer
  );
  const todaysDate = new Date();
  const fullDate =
    todaysDate.getFullYear() +
    "-" +
    todaysDate.getMonth() +
    "-" +
    todaysDate.getDate();

  const _ = require("lodash");

  const { state } = useLocation();

  //@ts-ignore
  let newClient: any = state?.newClient;

  const [selectedAllData, setSelectedAllData] = React.useState([]);

  const roleState: UserState = useSelector((state: any) => state.userReducer);

  const newClientFormState: NewClientSetUpState = useSelector(
    (state: any) => state.newClientSetUp
  );
  let Role = JSON.stringify(roleState.roleName);
  let adminIdx = Role.toLocaleLowerCase().search("admin");

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

   const clientAssignmentState: ClientAssignmentState = useSelector(
        (state: any) => state.clientAssignmentTabFieldsRedux
      );

  let checkedNewClientData = [];

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

      const policyIds = newClientFormState.policyIds.length
        ? newClientFormState.policyIds
        : obj;
      await searchViewPolicy(dispatch, policyIds);
      await subPolicyData1(dispatch, policyIds);
      await filterdReasonData(dispatch, policyIds);
      await filterdPolicies(dispatch, policyIds);
    };

    fetchData();
  }, []);

  let obj = [
    {
      categoryFk: null,
      npiLogicFk: null,
      taxonomy: null,
      taxIdLogicFk: null,
      deactivated: null,
      policyId: null,
      type: newClient === "newClient" ? "newClient" : null,
    },
  ];

  const medicalDesc = (key) => {
    let str;
    updatedState.MedicalPolicy.map((k) => {
      if (key === k.medicalPolicyKey) {
        str = k.medicalPolicyTitle;
      }
    });
    return str;
  };

  const subDesc = (key) => {
    let str;
    updatedState.SubPolicy.map((k) => {
      if (key === k.subPolicyKey) {
        str = k.subPolicyTitle;
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

  const claimDesc = (type) => {
    let claim = type.split(",");
    let showDesc = [];
    updatedState.getClaimTypes.map((f, u) => {
      claim.map((k, l) => {
        if (k === f.claimType) {
          showDesc.push(f.claimType + " - " + f.description);
        }
      });
    });
    return showDesc;
  };
  const [showRoot, setShowRoot] = React.useState(false);
  const reset = () => {
    setMedicalKeyValue("");
    setSubKeyValue("");
    setReasonKeyValue("");
    setSelectedAllData([]);
    setExportedDataDetails([]);
    setShowRoot(false);
    localData.forEach((k, l) => {
      if (k.checked == 1) {
        k.checked = 0;
      }
      k.medicalPolicyChild.forEach((f, l) => {
        if (f.checked == 1) {
          f.checked = 0;
        }
        f.subPolicyChild.forEach((p, l) => {
          if (p.checked == 1) {
            p.checked = 0;
          }
          p.reasonPolicyChild.forEach((t, l) => {
            if (t.checked == 1) {
              t.checked = 0;
            }
          });
        });
      });
    });
    setExpandedItems([]);
    allNodes.current = [];
  };

  useEffect(() => {
    let TotalArray = [];

    let medicalSum = [];
    let medicalTotal = 0;

    if (policyViewState?.getMedicalTotalData) {
      policyViewState.getMedicalTotalData.forEach((k) => {
        medicalSum.push(k.count);
      });

      medicalTotal = medicalSum.reduce((total, num) => total + num, 0);
      setTotalMedicalCount(medicalTotal);

      policyViewState.getMedicalTotalData.forEach((j) => {
        TotalArray.push({
          medicalPolicyKey: j.medicalPolicyKeyFk,
          medicalPolCount: j.count,
          categoryFk: j.categoryFk,
          medicalPolicyChild: [],
          checked: 0,
        });
      });
    }

    policyViewState.getFilterdSubPoliciesData?.forEach((key1) => {
      TotalArray.forEach((array1Obj) => {
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

    policyViewState.getFilterReasonData?.forEach((r) => {
      TotalArray.forEach((re) => {
        if (r.medicalPolicyKeyFk === re.medicalPolicyKey) {
          re.medicalPolicyChild.forEach((subKey) => {
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

    policyViewState.getFilerdPoliciesData?.forEach((pol) => {
      TotalArray.forEach((tot) => {
        if (pol.medicalPolicyKeyFk === tot.medicalPolicyKey) {
          tot.medicalPolicyChild.forEach((subTot) => {
            if (subTot.subPolicyKey === pol.subPolicyKeyFk) {
              subTot.subPolicyChild.forEach((reas) => {
                if (reas.reasonCodeFk === pol.reasonCodeFk) {
                  reas.reasonPolicyChild.push({
                    policyId: pol.policyId,
                    policyNumber: pol.policyNumber,
                    policyVersion: pol.policyVersion,
                    taxonomyLogicFk: pol.taxonomyLogicFk,
                    taxLogicFk: pol.taxLogicFk,
                    npiLogicFk: pol.npiLogicFk,
                    checked: 0,
                    medicalPolicyKey: pol.medicalPolicyKeyFk,
                    subPolicyKey: subTot.subPolicyKey,
                    reasonCode: reas.reasonCodeFk,
                    isProdB: pol.isProdB,
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
    if (newClient === "newClient") {
      checkAllTotalParents({ target: { checked: true } });
      setShowRoot(true);
    }
  }, [localData]);

  // useEffect(() => {
  //   setExpanded((oldExpanded) => (oldExpanded.length === 0 ? ["root"] : []));
  //   if (allNodes.current.length > 0) {
  //     allNodes.current = [];
  //   }
  // }, []);
  useEffect(() => {
    // setExpandedItems(["root"]);
  }, []);

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["root"] : ["root"]
    );
  };
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  let stringClaimType: any = "";
  stringClaimType = policyNumberDetails.claimType.map((k, i) => {
    return k.label;
  });

  const checkAllParent = (e, medKey) => {
    if (e.target.checked) {
      localData.forEach((medk, l) => {
        if (medk.medicalPolicyKey == medKey) {
          medk.checked = 1;
        }
        medk.medicalPolicyChild.forEach((f, l) => {
          if (f.medicalPolicyKey == medKey) {
            f.checked = 1;
          }
          f.subPolicyChild.map((res, l) => {
            if (res.medicalPolicyKey == medKey) {
              res.checked = 1;
            }
          });
        });
      });
    } else {
      localData.map((medk, l) => {
        if (medk.medicalPolicyKey == medKey) {
          medk.checked = 0;
        }
        medk.medicalPolicyChild.forEach((f, l) => {
          if (f.medicalPolicyKey == medKey) {
            f.checked = 0;
          }
          f.subPolicyChild.map((res, l) => {
            if (res.medicalPolicyKey == medKey) {
              res.checked = 0;
            }
          });
        });
      });
    }
  };
  const unCheckParentNode = () => {
    localData.forEach((med) => {
      med.medicalPolicyChild.forEach((sub) => {
        sub.subPolicyChild.forEach((res) => {
          if (sub.checked == 1) {
            res.checked = 1;
          } else {
            res.checked = 0;
          }
        });
      });
    });

    localData.map((med) => {
      med.medicalPolicyChild.forEach((sub) => {
        sub.subPolicyChild.forEach((res) => {
          if (med.medicalPolicyKey == sub.medicalPolicyKey) {
            if (
              med.medicalPolicyChild.findIndex((item) => item.checked == 0) ==
              -1
            ) {
              med.checked = 1;
            } else {
              med.checked = 0;
            }
          }
        });
      });
    });

    let checkedData = [];
    localData.map((med) => {
      med.medicalPolicyChild.map((sub) => {
        sub.subPolicyChild.map((res) => {
          res.reasonPolicyChild.map((pol) => {
            if (med.checked == 1 || sub.checked == 1 || res.checked == 1) {
              checkedData.push({
                medicalPolicyKey: med.medicalPolicyKey,
                subpolicyKey: sub.subPolicyKey,
                reasonCode: res.reasonCodeFk,
                policyNumber: pol.policyNumber,
              });
              setChecked(true);
            }
          });
        });
      });
    });
  };
  const unCheckReasonCode = () => {
    localData.forEach((med) => {
      med.medicalPolicyChild.forEach((sub) => {
        sub.subPolicyChild.forEach((res) => {
          if (
            med.medicalPolicyKey == res.medicalPolicyKey &&
            sub.subPolicyKey == res.subPolicyKey
          ) {
            if (
              sub.subPolicyChild.findIndex((item) => item.checked == 0) == -1
            ) {
              sub.checked = 1;
            } else {
              sub.checked = 0;
            }
          }
          if (med.medicalPolicyKey == sub.medicalPolicyKey) {
            if (
              med.medicalPolicyChild.findIndex((item) => item.checked == 0) ==
              -1
            ) {
              med.checked = 1;
            } else {
              med.checked = 0;
            }
          }
        });
      });
    });
  };
  const arrayWithoutDuplicates = allNodes.current
    .flat()
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  const stringArray = arrayWithoutDuplicates.map(String);

  const checkAllTotalParents = (e) => {
    if (e.target.checked) {
      setExpanded([["root"], ...stringArray]);
    } else {
      setExpanded(["root"]);
    }

    localData.forEach((med) => {
      med.checked = e.target.checked ? 1 : 0;
      med.medicalPolicyChild.forEach((sub) => {
        sub.checked = e.target.checked ? 1 : 0;
        sub.subPolicyChild.forEach((rea) => {
          rea.checked = e.target.checked ? 1 : 0;
        });
      });
    });
  };

  async function exportToWord(buttonType) {
    let checkedData = [];
    localData.map((med) => {
      med.medicalPolicyChild.map((sub) => {
        sub.subPolicyChild.map((res) => {
          res.reasonPolicyChild.map((pol) => {
            if (med.checked === 1 || sub.checked === 1 || res.checked === 1) {
              checkedData.push({
                policyNumber: pol.policyNumber,
                medicalPolicyKey: med.medicalPolicyKey,
              });
            }
            if (pol.checked === 1) {
              checkedData.push({
                policyNumber: pol.policyNumber,
                medicalPolicyKey: med.medicalPolicyKey,
              });
            }
          });
        });
      });
    });
    if (checkedData.length > 0) {
      await ExportPolicies(dispatch, checkedData, buttonType);
    } else {
      CustomSwal("info", "Please Select Policy Number", navyColor, "OK", "");
    }
  }

  const navigate = useNavigate();

  function OldPage() {
    if (newClient == "newClient") {
      dispatch({ type: RESETNEWCLIENT });
      navigate("/NewClientSetUp");
    } else {
      navigate("/policyView");
    }
  }

  let newClientSetUp = {
    changesData: [],
    clientAssignmentData: [],
  };

  const [checkNewClientData, setNewClientData] = useState(undefined);

  function checkNewClientPolicy() {
    checkData();
    if (checkedNewClientData.length > 0) {
      setOpenClient(true);
    } else {
      CustomSwal("info", "Please Select Policy Number", navyColor, "OK", "");
    }
  }

  function checkData() {
    localData.map((med) => {
      med.medicalPolicyChild.map((sub) => {
        sub.subPolicyChild.map((res) => {
          res.reasonPolicyChild.map((pol) => {
            if (
              med.checked == 1 ||
              sub.checked == 1 ||
              res.checked == 1 ||
              pol.checked == 1
            ) {
              checkedNewClientData.push({
                policyId: pol.policyId,
                isProdB: pol.isProdB,
              });
              setNewClientData(checkedNewClientData);
            }
          });
        });
      });
    });
  }
  let emailId = localStorage.getItem("emailId");

  async function saveNewCleintSetUp() {
    if (checkNewClientData.length > 0) {
      clientAssignmentState.getActiveClientData.map((n) => {
        checkNewClientData.flatMap((c) => {
          newClientFormState.clientGroupCode.map((k) => {
            if (n.clientGroupId === k.clientGroupId) {
              newClientSetUp.clientAssignmentData.push({
                policyId: c.policyId,
                clientGroupId: n.clientGroupId,
                hp: n.hp === true ? 1 : 0,
                clientStartDate: newClientFormState.clientStartDate,
                clientEndDate: "9999-12-31",
                excludeClientSpecificCodes: true,
              });
            }
          });
        });
      });

      checkNewClientData.map((c) => {
        newClientSetUp.changesData.push({
          jiraId: newClientFormState.jiraId,
          jiraDesc: newClientFormState.jiraDescription,
          policyId: c.policyId,
          isOpenb: 0,
          jiraLink:
            "https://advancedpricing.atlassian.net/browse/" +
            newClientFormState.jiraId,
          userId: emailId,
          updatedOn: "",
        });
      });
      await saveNewClientSetUp(dispatch, newClientSetUp, navigate);
      newClientFormState.policyIds = [];

      setOpenClient(false);
    }
  }

  const policyNumbers = (reason) => {
    return reason.reasonPolicyChild.map((k, l) => {
      return {
        label: k.policyNumber + "." + k.policyVersion,
        value: k.policyId,
        reasonCode: k.reasonCode,
        medicalPolicyKey:
          k.medicalPolicyKey == reason.medicalPolicyKey
            ? k.medicalPolicyKey
            : undefined,
      };
    });
  };

  let style = {
    position: "relative",
    left: "3px",
    bottom: "2px",
  };
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xs");
  const [internalOrExternal, setInternalOrExternal] = React.useState(false);
  const [Import, setImport] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);
  const [openLkp, setOpenLkp] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  const handleToClose = () => {
    setOpenLkp(false);
    setImport(false);
    setInternalOrExternal(false);
    setOpenClient(false);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("uploadfile", selectedFile);
    uploadClaimProcssingIntroduction(dispatch, formData);
    handleToClose();
  };

  const handleExpansionChange = (event, nodeIds) => {
    setExpandedItems((prev) => {
      const collaspedId = prev?.find((val) => !nodeIds.includes(val));
      if (!nodeIds.includes("root")) return [];
      return nodeIds.filter((i) => !i.startsWith(collaspedId));
    });
  };

  return (
    <>
      <Template>
        <CustomPaper
          style={{
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            border: "1px solid #D6D8DA",
            marginRight: "0px",
            backgroundColor: "rgb(214 228 231)",
            marginTop: "5px",
            height: window.innerHeight / 1.18,
          }}
        >
          <div className="row">
            <div className="col-sm-4">
              <h5 className="heading">
                {newClient == "newClient"
                  ? "Client Policy View"
                  : "Policy View Export"}
              </h5>
            </div>
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <div className="innerBtn">
                {newClient != "newClient" ? (
                  <CustomButton
                    variant={"contained"}
                    onClick={() => {
                      reset();
                      handleExpandClick();
                      allNodes.current = [];
                      dispatch({ type: RESET_STATE });
                    }}
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      marginLeft: 4,
                      padding: 4,
                    }}
                  >
                    Reset
                  </CustomButton>
                ) : undefined}
              </div>
              <div className="innerBtn">
                <CustomButton
                  startIcon={newClient != "newClient" ? <ArrowBackIos /> : ""}
                  variant={"contained"}
                  onClick={() => {
                    OldPage();
                  }}
                  style={{
                    backgroundColor:
                      newClient != "newClient" ? navyColor : dangerColor,
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 12,
                    marginLeft: 4,
                    padding: 4,
                  }}
                >
                  {"Back"}
                </CustomButton>
              </div>
              <div className="innerBtn">
                {AccessForExport(localData, adminIdx) &&
                newClient == undefined ? (
                  <CustomButton
                    variant={"contained"}
                    onClick={() => {
                      setOpenLkp(true);
                    }}
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      padding: 4,
                    }}
                    endIcon={<ArrowDownwardIcon />}
                  >
                    Export
                  </CustomButton>
                ) : undefined}

                {newClient == "newClient" ? (
                  <CustomButton
                    variant={"contained"}
                    onClick={() => {
                      checkNewClientPolicy();
                    }}
                    style={{
                      backgroundColor: navyColor,
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      padding: 4,
                    }}
                  >
                    Continue
                  </CustomButton>
                ) : undefined}
              </div>
              <div className="innerBtn">
                {AccessForExport(localData, adminIdx) &&
                newClient == undefined ? (
                  <CustomButton
                    variant={"contained"}
                    onClick={() => {
                      setImport(true);
                    }}
                    style={{
                      backgroundColor: dangerColor,
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: 12,
                      marginLeft: 4,
                      padding: 4,
                    }}
                    endIcon={<ArrowDownwardIcon />}
                  >
                    Import
                  </CustomButton>
                ) : undefined}
              </div>
            </div>
          </div>

          <GridContainer style={{ marginLeft: "2px" }}>
            <GridItem sm={4} md={4} xs={4}>
              <>
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
                    flexGrow: 1,
                    overflowY: "auto",
                    fontSize: "13px",
                    position: "relative",
                    top: "15px",
                  }}
                  // onNodeToggle={handleToggle}
                >
                  <TreeItem
                    itemId="root"
                    label={
                      <>
                        <input
                          type="checkbox"
                          value={""}
                          className="medicalParent"
                          checked={showRoot == true ? true : false}
                          onChange={(e) => {
                            checkAllTotalParents(e);
                            if (e.target.checked) {
                              setShowRoot(e.target.checked);
                            } else {
                              setShowRoot(false);
                            }
                          }}
                        />
                        <span
                          style={{
                            position: "relative",
                            left: "4px",
                            bottom: "2px",
                          }}
                        >
                          {"Medical Policies" + " - " + totalMedicalCount}
                        </span>
                      </>
                    }
                  >
                    {localData?.map((loc, mIdx) => {
                      allNodes.current.push(mIdx);
                      const medId = `${mIdx}`;

                      return (
                        <TreeItem
                          key={medId}
                          itemId={medId}
                          label={
                            <>
                              <input
                                type="checkbox"
                                value={""}
                                className="medicalParent"
                                checked={loc.checked == 1}
                                onChange={(e) => {
                                  checkAllParent(e, loc.medicalPolicyKey);
                                  if (loc.checked == 1) {
                                    setChecked(true);
                                  } else {
                                    setChecked(false);
                                  }
                                }}
                              />
                              <span
                                style={{
                                  position: "relative",
                                  left: "4px",
                                  bottom: "2px",
                                }}
                              >
                                {medicalDesc(loc.medicalPolicyKey) +
                                  "-" +
                                  loc.medicalPolCount}
                              </span>
                            </>
                          }
                          onClick={() => {
                            setMedicalKeyValue(loc.medicalPolicyKey);
                          }}
                        >
                          <>
                            <label className="labels">Sub Policies:</label>
                            {loc.medicalPolicyChild.map((sub, sIdx) => {
                              const subId = `${mIdx}-${sIdx}`;
                              return (
                                <TreeItem
                                  key={subId}
                                  itemId={subId}
                                  label={
                                    <>
                                      <input
                                        type="checkbox"
                                        checked={sub.checked == 1}
                                        onChange={(event) => {
                                          loc.medicalPolicyChild.forEach(
                                            (k, l) => {
                                              if (
                                                loc.medicalPolicyKey ==
                                                  k.medicalPolicyKey &&
                                                k.subPolicyKey ==
                                                  sub.subPolicyKey
                                              ) {
                                                k.checked =
                                                  event.target.checked == true
                                                    ? 1
                                                    : 0;
                                              }
                                            }
                                          );
                                          unCheckParentNode();
                                          if (sub.checked == 1) {
                                            setChecked(true);
                                          } else {
                                            setChecked(false);
                                          }
                                        }}
                                        id="subPolParent"
                                      />
                                      <span
                                        style={{
                                          position: "relative",
                                          left: "4px",
                                          bottom: "2px",
                                        }}
                                      >
                                        {subDesc(sub.subPolicyKey) +
                                          "-" +
                                          sub.SubCount}
                                      </span>
                                    </>
                                  }
                                  onClick={() => {
                                    setSubKeyValue(sub.subPolicyKey);
                                  }}
                                >
                                  <>
                                    <label className="labels">
                                      Reason Code:
                                    </label>
                                    {sub.subPolicyChild.map((rsn, rIdx) => {
                                      const rsnId = `${mIdx}-${sIdx}-${rIdx}`;
                                      return (
                                        <TreeItem
                                          key={rsnId}
                                          itemId={rsnId}
                                          label={
                                            <>
                                              <input
                                                type="checkbox"
                                                checked={rsn.checked == 1}
                                                onChange={(event) => {
                                                  sub.subPolicyChild.forEach(
                                                    (res, l) => {
                                                      if (
                                                        loc.medicalPolicyKey ==
                                                          res.medicalPolicyKey &&
                                                        res.subPolicyKey ==
                                                          sub.subPolicyKey &&
                                                        res.reasonCodeFk ==
                                                          rsn.reasonCodeFk
                                                      ) {
                                                        res.checked =
                                                          event.target
                                                            .checked == true
                                                            ? 1
                                                            : 0;
                                                      }
                                                    }
                                                  );
                                                  unCheckReasonCode();
                                                  if (rsn.checked == 1) {
                                                    setChecked(true);
                                                  } else {
                                                    setChecked(false);
                                                  }
                                                }}
                                              />
                                              <span
                                                style={{
                                                  position: "relative",
                                                  left: "4px",
                                                  bottom: "2px",
                                                }}
                                              >
                                                {reasonDesc(rsn.reasonCodeFk) +
                                                  "-" +
                                                  rsn.reasonCodeCount}
                                              </span>
                                            </>
                                          }
                                          onClick={() => {
                                            setReasonKeyValue(rsn.reasonCodeFk);
                                          }}
                                        >
                                          <>
                                            <label className="labels">
                                              Policies :
                                            </label>
                                            <div
                                              style={{
                                                width: "164px",
                                                position: "relative",
                                                left: "25px",
                                                color: "black",
                                              }}
                                            >
                                              <CustomSelect
                                                isMulti
                                                options={policyNumbers(rsn)}
                                                checkBoxes={true}
                                                onSelect={(e) => {
                                                  setSelectedAllData(e);
                                                  rsn.reasonPolicyChild.forEach(
                                                    (k, l) => {
                                                      k.checked = 0;
                                                      e.map((p) => {
                                                        if (
                                                          k.policyNumber +
                                                            "." +
                                                            k.policyVersion ==
                                                          p.label
                                                        ) {
                                                          k.checked = 1;
                                                        }
                                                      });
                                                    }
                                                  );
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
              </>
            </GridItem>
          </GridContainer>
        </CustomPaper>

        <Dialogbox
          onClose={handleToClose}
          sx={{ height: "500px" }}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          open={openLkp}
          disableBackdropClick={true}
          title={"Internal/External"}
          message={
            <>
              <Stack direction="row" alignItems="center">
                <div className="row">
                  <div className="col-sm-2">
                    <Typography>Internal</Typography>
                  </div>
                  <div className="col-sm-2" id="xyz">
                    <AntSwitch
                      defaultChecked
                      inputProps={{ "aria-label": "ant design" }}
                      value={internalOrExternal}
                      checked={internalOrExternal}
                      onChange={() => {
                        setInternalOrExternal(!internalOrExternal);
                      }}
                    ></AntSwitch>
                  </div>
                  <div className="col-sm-2">
                    <Typography>External</Typography>
                  </div>
                </div>
              </Stack>
              {/* <div className="row" id="upload">
                  {internalOrExternal ?
                    <input
                      type="file"
                      onChange={handleFileChange}
                    /> : ""}
                </div> */}
            </>
          }
          actions={
            <ButtonGroup>
              <CustomButton
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                  marginRight: 10,
                }}
                onClick={() => {
                  internalOrExternal == true
                    ? exportToWord("External")
                    : exportToWord("Internal");
                  handleToClose();
                }}
              >
                Yes
              </CustomButton>
              <CustomButton
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                }}
                onClick={handleToClose}
              >
                No
              </CustomButton>
            </ButtonGroup>
          }
        />

        <Dialogbox
          onClose={handleToClose}
          sx={{ height: "500px" }}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          open={Import}
          disableBackdropClick={true}
          title={"Import Claim Processing Introduction"}
          message={
            <>
              <div className="row" id="upload">
                <input
                  type="file"
                  ref={inputRef}
                  // accept=".docx"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                  }}
                />
              </div>
            </>
          }
          actions={
            <ButtonGroup>
              <CustomButton
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                  marginRight: 10,
                }}
                onClick={() => {
                  handleUpload();
                }}
              >
                Yes
              </CustomButton>
              <CustomButton
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                }}
                onClick={handleToClose}
              >
                No
              </CustomButton>
            </ButtonGroup>
          }
        />

        <Dialogbox
          onClose={handleToClose}
          sx={{ height: "500px" }}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          open={openClient}
          disableBackdropClick={true}
          title={"Confirm"}
          message={"Add the New Client to all the Selected Policies"}
          actions={
            <ButtonGroup>
              <CustomButton
                style={{
                  backgroundColor:
                    newClient == "newClient" ? successColor : navyColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                  marginRight: 10,
                }}
                onClick={() => {
                  saveNewCleintSetUp();
                }}
              >
                {newClient == "newClient" ? "Save" : "Yes"}
              </CustomButton>
              <CustomButton
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                }}
                onClick={handleToClose}
              >
                {newClient == "newClient" ? "Cancel" : "No"}
              </CustomButton>
            </ButtonGroup>
          }
        />
      </Template>
    </>
  );
};

export default PolicyViewExport;
