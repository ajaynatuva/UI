import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  dangerColor,
  navyColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import {
  DeleteclientExclusionData,
  getClientgroupData,
  getClientPolicyData,
} from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { getMedicalPolicy, getSubPolicy } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";

const ClientgroupExclusions = () => {
  const updatedState = useSelector((state: any) => state.clientPolicy);
  const roleState = useSelector((state: any) => state.userReducer);

  const newPolicystate = useSelector((state: any) => state.newPolicy);
  const [clientExclusionData, setClientExclusionData] = React.useState([]);
  const [PolicyExclusionData, setPolicyExclusionData] = React.useState([]);

  let roles = roleState.roleName;
  let role = JSON.stringify(roles);
  let adminIdx = role.toLocaleLowerCase().search("admin");

  const exclusionColumns = [
    {
      field: "id",
      headerName: "Policy.Version",
      headerTooltip: "Policy.Version",
      checkboxSelection: adminIdx > 0 ? true : false,
    },
    {
      field: "ClientGroupName",
      headerName: "Client Group Name",
      headerTooltip: "Client Group Name",
    },
    {
      field: "clientGroupId",
      headerName: "Client Group ID",
      headerTooltip: "Client Group ID",
    },
    {
      field: "ClientCode",
      headerName: "Client Code",
      headerTooltip: "Client Code",
    },
    {
      field: "medicalPolicy",
      headerName: "Medical Policy",
      headerTooltip: "Medical Policy",
    },
    {
      field: "subPolicy",
      headerName: "Sub Policy",
      headerTooltip: "Sub Policy",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (newPolicystate.MedicalPolicy.length == 0) {
      getMedicalPolicy(dispatch);
    }
    if (newPolicystate.SubPolicy.length == 0) {
      getSubPolicy(dispatch);
    }
  }, []);

  useEffect(() => {
    if (updatedState.getclientPolicyExclusion.length == 0) {
      getClientPolicyData(dispatch);
    }

    if (updatedState.getClientExclusion.length == 0) {
      getClientgroupData(dispatch);
    }
  }, []);

  function GetClientGroupName(id) {
    let clientGroupName = "";
    const d = updatedState.getClientExclusion?.find(
      (a) => a.clientGroupId === id
    );
    if (d != undefined) {
      clientGroupName = d.clientGroupName;
    }
    return clientGroupName;
  }

  function GetClientCode(id) {
    let clientCode = "";
    const d = updatedState.getClientExclusion?.find(
      (a) => a.clientGroupId === id
    );
    if (d != undefined) {
      clientCode = d.clientCode;
    }
    return clientCode;
  }

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
  useEffect(() => {
    let clientData = updatedState.getclientPolicyExclusion.map((k) => {
      return {
        id:
          k.policyNumber || k.policyVersion
            ? k.policyNumber + "." + k.policyVersion
            : "",
        ClientGroupName: GetClientGroupName(k.clientGroupId),
        clientGroupId: k.clientGroupId,
        ClientCode: GetClientCode(k.clientGroupId),
        policyId: k.policyId,
        medicalPolicy: medicalDesc(k.medicalPolicyKeyFk),
        subPolicy: subDesc(k.subPolicyKeyFk),
      };
    });
    setClientExclusionData(clientData);
  }, [updatedState]);

  const navigate = useNavigate();

  function handleClick() {
    navigate("/AddExclusion");
  }

  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();

    setPolicyExclusionData(a);
  };

  function DeleteData(dispatch, PolicyExclusionData) {
    if (PolicyExclusionData.length > 0) {
      DeleteclientExclusionData(dispatch, PolicyExclusionData);
      setPolicyExclusionData([]);
    } else {
      CustomSwal("error","Please select at least one policy Id",navyColor,"Ok","")
    }
  }

  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "67px",
      float: "right",
      right: "180px",
      display: "inline",
    }),
    []
  );
  return (
    <Template>
      <div>
        <div>
          <GridContainer>
            <GridItem sm={10} md={10} xs={10}>
              <CustomHeader labelText={"Client Policy Exclusion"} />
            </GridItem>
            {adminIdx > 0?<GridItem sm={2} md={2} xs={2}>
                <CustomButton
                  type="reset"
                  variant={"contained"}
                  onClick={handleClick}
                  style={{
                    backgroundColor: dangerColor,
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 12,
                    padding: 4,
                    float: "right",
                  }}
                >
                  Add
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    DeleteData(dispatch, PolicyExclusionData);
                  }}
                  variant={"contained"}
                  style={{
                    backgroundColor: navyColor,
                    marginRight: 10,
                    float: "right",
                    color: "white",
                    fontSize: 12,
                    padding: 4,
                    textTransform: "capitalize",
                  }}
                >
                  Delete
                </CustomButton>
            </GridItem>:undefined}
          </GridContainer>
        </div>
      </div>
      <div>
        <div style={{}}>
          {clientExclusionData.length > 0 ? (
            <GridContainer>
              <GridItem sm={12} xs={12} md={12}>
                <div
                  style={{
                    overflowX: "hidden",
                    height: window.innerHeight / 1.28,
                  }}
                >
                  <AgGrids
                    rowData={clientExclusionData}
                    columnDefs={exclusionColumns}
                    gridIconStyle={gridIconStyle}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                  />
                </div>
              </GridItem>
            </GridContainer>
          ) : (
            <span style={{}}>No data found</span>
          )}
        </div>
      </div>
    </Template>
  );
};
export default ClientgroupExclusions;
