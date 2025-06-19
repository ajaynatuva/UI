import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import { getAddOnCodes } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import CustomButton from "../../components/CustomButtons/CustomButton";
import { disabledColor } from "../../assets/jss/material-kit-react";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { CAT_FIELDS ,BILLED_WITH} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";

const CategoryThirtyEight = ({ edit, viewMode,showAllErrors }) => {

  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

      const lkpState:LookUpState = useSelector((state: any) => state.lookupReducer);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (lkpState.addOnCodes.length === 0) {
      getAddOnCodes(dispatch);
    }
  }, []);

  const billed = lkpState.addOnCodes?.map((a) => {
    return { label: a.boDesc, value: a.boKey };
  });

  useEffect(() => {
    if (policyFields.catCode === PolicyConstants.THIRTY_EIGHT) {
      // Check if billedWith is not set and also check the current value before dispatching
      if (catState.billedWith == null) {
        // Make sure billed[0] is not the same as the current billedWith value
        if (billed.length > 0 && catState.billedWith !== billed[0]) {
          dispatch({
            type: BILLED_WITH,
            payload: billed[0],
          });
        }
      }
    }
  }, [policyFields.catCode, dispatch, billed]);
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
            BO Policy Key{" "}
            {
              <StarIcon
                style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
              />
            }
          </small>
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginLeft: -30 }}>
            <CustomSelect
           error={showAllErrors? isFieldInvalid(catState.billedWith?.value): false}
           options={billed}
              value={billed.filter(function (option) {
                return option?.value == catState.billedWith;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={billed.filter((option, index) => {
                if (catState.billedWith == option.value) {
                  return option;
                }
              })}
              onSelect={(event) => {
                // setBilledWith(event);
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { billedWith: event.value },
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <small
            style={{
              fontSize: 13,
              color: "black",
              fontWeight: 400,
              position: "relative",
              top: 28,
            }}
          >
            Policy Category Table
          </small>
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          <CustomButton
            disabled={true}
            variant="contained"
            style={{
              backgroundColor: disabledColor,
              color: "white",
              marginTop: 20,
              fontSize: 12,
              padding: 4,
              textTransform: "capitalize",
            }}
          >
            Link to Table
          </CustomButton>
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default CategoryThirtyEight;
