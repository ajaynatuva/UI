import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import RadioButton from "../../components/RadioButton/RadioButton";
import { useLocation } from "react-router-dom";
import { CAT_FIELDS }  from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";

const CategoryTwelve = ({ edit, viewMode,showAllErrors }) => {
  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (policyFields.catCode === PolicyConstants.TWELVE) {
      if (
        catState.lineOrHeaderOrPrincipal === "" ||
        catState.lineOrHeaderOrPrincipal == null
      ) {
        dispatch({
          type: CAT_FIELDS,
          payload: 1,
        });
      }
    }
  }, [catState.lineOrHeaderOrPrincipal, dispatch, policyFields.catCode]);

  return (
    <div>
      <GridContainer>
        <GridItem sm={6} md={6} xs={6}>
          <div style={{ marginTop: 7 }}>
            <RadioButton
              label={"Header Level Diagnosis"}
              checked={catState.lineOrHeaderOrPrincipal === 1}
              disabled={viewMode}
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { lineOrHeaderOrPrincipal: 1 },
                  });
                }
              }}
            />
            <RadioButton
              label={"Line Level Diagnosis"}
              checked={catState.lineOrHeaderOrPrincipal === 2}
              disabled={viewMode}
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { lineOrHeaderOrPrincipal: 2 },
                  });
                }
              }}
            />
            <RadioButton
              label={"Principal Diagnosis"}
              checked={catState.lineOrHeaderOrPrincipal === 3}
              disabled={viewMode}
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { lineOrHeaderOrPrincipal: 3 },
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
export default CategoryTwelve;
