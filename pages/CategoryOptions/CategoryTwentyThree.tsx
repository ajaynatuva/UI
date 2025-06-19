import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import GridItem from "../../components/Grid/GridItem";

import RadioButton from "../../components/RadioButton/RadioButton";
import { getCci } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { CAT_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";

const CategoryTwentyThree = ({ edit, viewMode,showAllErrors }) => {
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );


  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  const lkpState:LookUpState = useSelector((state: any) => state.lookupReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (lkpState.ptpCci.length === 0) {
      getCci(dispatch);
    }
  }, [lkpState.ptpCci.length, dispatch]);
   
  const ptpcci = lkpState.ptpCci?.map((p: any) => {
    return { label: p.cciDesc, value: p.cciKey };
  });

  const [exclusiveType, setExclusiveType] = useState("");
  const [denyType, setDenyType] = useState("");
  const [byPassMod, setByPassMod] = useState("");

  useEffect(() => {
    setDenyType("columnii");
    setExclusiveType("yes");
    setByPassMod("both");
  }, [updatedState]);

  useEffect(() => {
    if (policyFields.catCode === PolicyConstants.TWENTY_THREE) {
      if (catState.byPassMod === "" || catState.byPassMod == null) {
        dispatch({
          type: CAT_FIELDS,
          payload: { byPassMod: 3 },
        });
      }
      if (
        catState.mutuallyExclusive === "" ||
        catState.mutuallyExclusive == null
      ) {
        dispatch({
          type: CAT_FIELDS,
          payload: { mutuallyExclusive: 1 },
        });
      }
      if (catState.denyType === "" || catState.denyType == null) {
        dispatch({
          type: CAT_FIELDS,
          payload: { denyType: 2 },
        });
      }
    }
  }, [
    catState.byPassMod,
    catState.mutuallyExclusive,
    catState.denyType,
    dispatch,
    policyFields.catCode,
  ]);

  return (
    <div>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <small
            style={{
              fontSize: 13,
              color: "black",
              fontWeight: 400,
              position: "relative",
              top: 15,
            }}
          >
            CCI Key{" "}
            {
              <StarIcon
                style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
              />
            }
          </small>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div className="catkey">
            <CustomSelect
              error={showAllErrors ? isFieldInvalid(catState.ccikey) : false}
              options={ptpcci}
              value={ptpcci.filter(function (option) {
                return option.value == catState.ccikey;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={ptpcci.filter((option, index) => {
                if (catState.ccikey == option.value) {
                  return true;
                }
                return false;
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { ccikey: event.value },
                  });
                } else {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: null
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 15 }}>
            <span>Bypass Modifier</span>
          </div>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div style={{ marginTop: 15 }}>
            <RadioButton
              label={"Yes"}
              checked={byPassMod === "yes"}
              disabled={true}
              value="yes"
              onChange={(e) => {
                if (e.target.checked) {
                  setByPassMod("yes");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { byPassMod: 1 },
                  });
                }
              }}
            />
            <RadioButton
              label={"No"}
              disabled={true}
              checked={byPassMod === "no"}
              value="no"
              onChange={(e) => {
                if (e.target.checked) {
                  setByPassMod("no");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { byPassMod: 2 },
                  });
                }
              }}
            />
            <RadioButton
              label={"Both"}
              checked={byPassMod === "both"}
              value="both"
              onChange={(e) => {
                if (e.target.checked) {
                  setByPassMod("both");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { byPassMod: 3 },
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 15 }}>
            <span>Mutually Exclusive</span>
          </div>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div style={{ marginTop: 15 }}>
            <RadioButton
              label={"Yes"}
              disabled={viewMode}
              checked={
                catState.mutuallyExclusive == null ||
                catState.mutuallyExclusive === ""
                  ? exclusiveType === "yes"
                  : catState.mutuallyExclusive === 1
              }
              value={"yes"}
              onChange={(e) => {
                if (e.target.checked) {
                  setExclusiveType("yes");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { mutuallyExclusive: 1 },
                  });
                }
              }}
            />
            <RadioButton
              label={"No"}
              disabled={viewMode}
              value={"no"}
              checked={
                catState.mutuallyExclusive == null ||
                catState.mutuallyExclusive === ""
                  ? exclusiveType === "no"
                  : catState.mutuallyExclusive === 2
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setExclusiveType("no");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { mutuallyExclusive: 2 },
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 15 }}>
            <span>Deny</span>
          </div>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div style={{ marginTop: 15 }}>
            <RadioButton
              label={"COLUMN I"}
              disabled={true}
              checked={denyType === "columni"}
              value={"columni"}
              onChange={(e) => {
                if (e.target.checked) {
                  setDenyType("columni");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { denyType: 1 },
                  });
                }
              }}
            />
            <RadioButton
              label={"COLUMN II"}
              checked={denyType === "columnii"}
              value={"columnii"}
              onChange={(e) => {
                if (e.target.checked) {
                  setDenyType("columnii");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { deny: 2 },
                  });
                }
              }}
            />
            <RadioButton
              label={"High $"}
              checked={denyType === "high"}
              value={"high"}
              disabled={true}
              onChange={(e) => {
                if (e.target.checked) {
                  setDenyType("high");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { deny: 3 },
                  });
                }
              }}
            />
            <RadioButton
              label={"Low $"}
              checked={denyType === "low"}
              value={"low"}
              disabled={true}
              onChange={(e) => {
                if (e.target.checked) {
                  setDenyType("low");
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { deny: 4 },
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default CategoryTwentyThree;
