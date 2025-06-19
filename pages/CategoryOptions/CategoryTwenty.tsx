import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import { getChangeModifier } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import {
  CAT_FIELDS,
  CHANGE_MODIFIER_KEY,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";

const CategoryTwenty = ({ edit, viewMode, showAllErrors }) => {
  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const lkpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (lkpState.getChangeModifier.length == 0) {
      getChangeModifier(dispatch);
    }
  }, []);

  const changeModifierLkp = lkpState.getChangeModifier?.map((k: any) => {
    return { label: k.description, value: k.changeModifierKey };
  });

  useEffect(() => {
    if (policyFields.catCode === PolicyConstants.TWENTY) {
      // Only dispatch if changeModifierKey is not set
      if (!catState.changeModifierKey && changeModifierLkp.length > 0) {
        dispatch({
          type: CHANGE_MODIFIER_KEY,
          payload: changeModifierLkp[0],
        });
      }
    }
  }, [catState.changeModifierKey, policyFields.catCode]);

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
            Change Modifier Logic
            {
              <StarIcon
                style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
              />
            }
          </small>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div className="changeModifier">
            <CustomSelect
              error={
                showAllErrors
                  ? isFieldInvalid(catState.changeModifierKey)
                  : false
              }
              options={changeModifierLkp}
              value={changeModifierLkp.filter(function (option) {
                return option?.value == catState?.changeModifierKey;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={changeModifierLkp.filter((option) => {
                return catState?.changeModifierKey === option?.value;
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { changeModifierKey: event.value },
                  });
                } else {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { changeModifierKey: null },
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
export default CategoryTwenty;
