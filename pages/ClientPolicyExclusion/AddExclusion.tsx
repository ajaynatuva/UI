import { ButtonGroup, InputAdornment } from "@material-ui/core";
import { MoreHoriz } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import {
  dangerColor,
  navyColor,
  black,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import {
  getClientgroupData,
  getClientPolicyData,
  getPolicyExclusionData,
  postclientExclusionData,
} from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import {
  CLIENT_GROUP_VALUE,
  POLICY_VALUE,
} from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsTypes";
import "../ClientPolicyExclusion/AddExclusion.css";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { getCAT, getMedicalPolicy, getSubPolicy } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";

const AddExclusion = () => {
  const [openLkp, setOpenLkp] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [selectedLkp, setSelectedLkp] = React.useState("");
  const [selectedLkpColumns, setselectedLkpColumns] = React.useState([]);
  const [ExclusionData, setExclusionData] = React.useState([]);
  const [clientGroupId, setClientGroupId] = React.useState([]);
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState("");
  const [selectedPolicyValue, setSelectedPolicyValue] = useState([]);
  const [clientGroupId1, setClientGroupId1] = React.useState([]);

  const _ = require("lodash");

  const updatedState = useSelector((state: any) => state.clientPolicy);
  const newPolicystate = useSelector((state: any) => state.newPolicy);

  const fullWidth = true;
  const maxWidth = "md";

  const handleToClose = () => {
    setOpen(false);
    setOpenLkp(false);
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

  const policyColumnsLKP = [
    {
      field: "id",
      headerName: "Policy#",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "PolicyNumber",
      checkboxSelection: true,
    },
    {
      field: "policyId",
      headerName: "PolicyId",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "PolicyId",
    },
    {
      field: "policyDesc",
      headerName: "Policy Desc",
      minWidth: 112,
      headerTooltip: "PolicyDesc",
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
    },
    {
      field: "medicalPolicy",
      headerName: "Medical Policy",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "medicalPolicy",
    },
    {
      field: "subPolicy",
      headerName: "Sub Policy",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "subPolicy",
    },
    {
      field: "reasonCode",
      headerName: "Reason Code",
      minWidth: 112,
      headerTooltip: "reasonCode",
    },
    {
      field: "Category",
      headerName: "Category",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "Category",
    },
  ];

  const clientgroupColumns = [
    {
      field: "clientCode",
      headerName: "Client Code",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "ClientCode",
      checkboxSelection: true,
    },
    {
      field: "clientGroupName",
      headerName: "Client Group Name",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "Client Group Name",
    },
    {
      field: "clientGroupId",
      headerName: "Client Group Id",
      minWidth: 112,
      flex: 1,
      filter: true,
      sortable: true,
      resizable: false,
      headerTooltip: "clientGroupId",
      hide: true,
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (updatedState.getPolicyExclusion.length == 0) {
      getPolicyExclusionData(dispatch);
    }
    if (updatedState.getClientExclusion.length == 0) {
      getClientgroupData(dispatch);
    }
    if (newPolicystate.MedicalPolicy.length == 0) {
      getMedicalPolicy(dispatch);
    }
    if (newPolicystate.SubPolicy.length == 0) {
      getSubPolicy(dispatch);
    }
    if (updatedState.getclientPolicyExclusion.length == 0) {
      getClientPolicyData(dispatch);
    }
    if (newPolicystate.CAT.length == 0) {
      getCAT(dispatch);
    }
  }, []);

  const medicalDesc = (key) => {
    let str;
    newPolicystate.MedicalPolicy.map((k) => {
      if (key === k.medicalPolicyKey) {
        str = k.medicalPolicyTitle;
      }
    });

    return str;
  };
  const subDesc = (key) => {
    let str;
    newPolicystate.SubPolicy.map((k) => {
      if (key === k.subPolicyKey) {
        str = k.subPolicyTitle;
      }
    });
    return str;
  };
  const catDesc = (key) => {
    let str;
    newPolicystate.CAT.map((k) => {
      if (key == k.policyCategoryLkpId) {
        str = k.policyCategoryDesc;
      }
    });
    return str;
  };

  useEffect(() => {
    if (selectedLkp == "Policy Look up") {
      let col = Object.assign({}, selectedLkpColumns);
      col = policyColumnsLKP;
      setselectedLkpColumns(col);
      let PolicyLkp = updatedState.getPolicyExclusion.map((k, i) => {
        return {
          id:
            k.policyNumber || k.policyVersion
              ? k.policyNumber + "." + k.policyVersion
              : "",
          policyId: k.policyId,
          policyDesc: k.policyDesc,
          medicalPolicy: medicalDesc(k.medicalPolicyKeyFk),
          subPolicy: subDesc(k.subPolicyKeyFk),
          reasonCode: k.reasonCodeFk,
          Category: catDesc(k.categoryFk),
        };
      });
      setRows(PolicyLkp);
    }
    if (selectedLkp == "Exclude client group") {
      let col = Object.assign({}, selectedLkpColumns);
      col = clientgroupColumns;
      setselectedLkpColumns(col);

      let clientExclusion = updatedState.getClientExclusion.map((k) => {
        return {
          clientCode: k.clientCode,
          clientGroupId: k.clientGroupId,
          clientGroupName: k.clientGroupName,
        };
      });
      setRows(clientExclusion);
    }
  }, [selectedLkp]);

  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();

    if (selectedLkp == "Policy Look up") {
      let a = event.api.getSelectedRows();
      setExclusionData(a);
      setSelectedCheckboxValue(a);
    }
    if (selectedLkp == "Exclude client group") {
      let a = event.api.getSelectedRows();
      setClientGroupId1(a);
      setSelectedCheckboxValue(a);
    }
  };

  const setCheckboxValues = () => {
    if (selectedLkp == "Policy Look up") {
      let policyValue = [];
      let a = _.cloneDeep(selectedCheckboxValue);
      for (let i = 0; i < a.length; i++) {
        policyValue.push(a[i].id);
      }
      dispatch({ type: POLICY_VALUE, payload: policyValue });
      setSelectedPolicyValue(policyValue);
    }
    if (selectedLkp == "Exclude client group") {
      let a = _.cloneDeep(selectedCheckboxValue);
      let clientValue = [];
      for (let i = 0; i < a.length; i++) {
        clientValue.push(a[i].clientGroupId);
      }
      dispatch({ type: CLIENT_GROUP_VALUE, payload: clientValue });
      setClientGroupId(clientValue);
    }
  };
  const onGridReady = (data) => {
    data.api.forEachLeafNode((s) => {
      if (selectedLkp == "Policy Look up") {
        for (let i = 0; i < selectedPolicyValue.length; i++) {
          if (s.data?.id == selectedPolicyValue[i]) {
            s.setSelected(true);
          }
        }
      } else if (selectedLkp == "Exclude client group") {
        for (let i = 0; i < clientGroupId.length; i++) {
          if (s.data?.clientGroupId === clientGroupId[i]) {
            s.setSelected(true);
          }
        }
      }
    });
  };

  function handleClick() {
    navigate("/ClientgroupExclusions");
  }

  var d = require("lodash");

  function savedata(dispatch, ExclusionData, clientGroupId1) {
    let result1 = [];
    let result2 = [];
    let result3 = [];

    clientGroupId1.map((k, i) => {
      ExclusionData.map((f, i) => {
        result1.push(f.policyId);
        result2.push(k.clientGroupId);
      });
    });

    let newArray;
    for (let i = 0; i < result1.length; i++) {
      newArray = {
        policyId: result1[i],
        clientGroupId: result2[i],
      };
      result3.push(newArray);
    }

    let match = [];
    let match1 = [];

    match = updatedState.getclientPolicyExclusion.map((t) => {
      return {
        policyId: t.policyId,
        clientGroupId: t.clientGroupId,
      };
    });
    match1 = d.differenceWith(result3, match, function (o1, o2) {
      return (
        o1["policyId"] === o2["policyId"] &&
        o1["clientGroupId"] === o2["clientGroupId"]
      );
    });
    if (match1.length > 0) {
      postclientExclusionData(dispatch, match1);
      handleClick();
    } else {
      CustomSwal("info", "Selected Data Already Exists", navyColor, "Ok", "");
    }
  }
  const navigate = useNavigate();

  return (
    <Template>
      <GridContainer>
        <GridItem sm={10} md={10} xs={10}>
          <CustomHeader labelText={"Add Client Exclusion"} />
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          {ExclusionData.length > 0 && clientGroupId.length > 0 ? (
            <CustomButton
              type="reset"
              variant={"contained"}
              onClick={() => {
                savedata(dispatch, ExclusionData, clientGroupId1);
              }}
              style={{
                backgroundColor: navyColor,
                color: "white",
                textTransform: "capitalize",
                fontSize: 12,
                padding: 4,
                float: "right",
              }}
            >
              Save
            </CustomButton>
          ) : undefined}
          <CustomButton
            type="reset"
            variant={"contained"}
            onClick={() => {
                handleClick()              }}
            style={{
              backgroundColor: navyColor,
              color: "white",
              textTransform: "capitalize",
              fontSize: 12,
              padding: 4,
              float: "right",
              marginRight: 10,
            }}
          >
            Back
          </CustomButton>
        </GridItem>
      </GridContainer>
      <CustomPaper
        style={{
          boxShadow: "none",
          border: "1px solid #D6D8DA",
          marginTop: "5px",
        }}
      >
        <div>
          <GridContainer>
            <GridItem sm={3} md={3} xs={3}>
              <div className="pol">
                <CustomInput
                  fullWidth={true}
                  labelText={"Policy#"}
                  variant={"outlined"}
                  value={selectedPolicyValue}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={() => {
                        setOpenLkp(true);
                        setSelectedLkp("Policy Look up");
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
              </div>
            </GridItem>
            <GridItem sm={3} md={3} xs={3}>
              <CustomInput
                fullWidth={true}
                labelText={"Client Group"}
                variant={"outlined"}
                value={clientGroupId}
                endAdornment={
                  <InputAdornment
                    position="end"
                    onClick={() => {
                      setOpenLkp(true);
                      setSelectedLkp("Exclude client group");
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
          </GridContainer>
        </div>
      </CustomPaper>

      <Dialogbox
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        disableBackdropClick={true}
        open={openLkp}
        onClose={handleToClose}
        title={selectedLkp}
        message={
          <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
            <AgGrids
              rowData={rows}
              columnDefs={selectedLkpColumns}
              rowSelection={"multiple"}
              onSelectionChanged={onSelectionChanged}
              onGridReady={onGridReady}
              gridIconStyle={lkpGridIconStyle}
            />
          </div>
        }
        actions={
          <ButtonGroup style={{ marginTop: "-50px" }}>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                handleToClose();
                setCheckboxValues();
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
            <CustomButton
              onClick={() => {
                handleToClose();
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
          </ButtonGroup>
        }
      />
    </Template>
  );
};
export default AddExclusion;
