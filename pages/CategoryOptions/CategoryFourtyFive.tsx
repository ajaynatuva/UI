import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import { fetchLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { MODIFIER_PAY_PERCENTAGE } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import { modifierPayPercentageColumns } from "./Columns";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { CAT_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";

const CategoryFourtyFive = ({ edit, viewMode, showAllErrors}) => {
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const validateFields: ValidatePolicyState = useSelector(
    (state: any) => state.validatePolicyFieldsRedux
  );

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (updatedState.getModifierPayPercentage.length === 0) {
      let lkpName = MODIFIER_PAY_PERCENTAGE;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);

  const [modifierPayPercentageData, setModifierPayPercentageData] = useState(
    []
  );
  const _ = require("lodash");

  const [numberOfRows, setNumberOfRows] = useState(0);
  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  useEffect(() => {
    let modifierPayPercentageData = updatedState.getModifierPayPercentage.map(
      (k) => {
        return {
          id: k.id,
          mppKeyFk: k.mppKeyFk,
          modifier: k.modifier,
          allowedPercentage: k.allowedPercentage,
          preOp: k.preOp,
          intraOp: k.intraOp,
          postOp: k.postOp,
        };
      }
    );
    setModifierPayPercentageData(modifierPayPercentageData);
    setNumberOfRows(
      updatedState.getModifierPayPercentage
        ? updatedState.getModifierPayPercentage.length
        : 0
    );
  }, [updatedState.getModifierPayPercentage]);

  const mprStandardMultipleProcedureOptions = [
    { value: 1, label: "Modifier Pay Percentage" },
  ];
  return (
    <div>
      <GridContainer>
        <GridItem sm={1} md={1} xs={1} />
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
            MP Indicators: 2 & 3
          </small>
        </GridItem>
        <GridItem sm={2} md={2} xs={2} />
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
            Modifier Pay Percentage Logic{" "}
            {
              <StarIcon
                style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
              />
            }
          </small>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div className="modifierPayPercentage">
            <CustomSelect
             error={showAllErrors ? isFieldInvalid(catState.modifierPayPercentage): false}
              options={mprStandardMultipleProcedureOptions}
              value={mprStandardMultipleProcedureOptions.filter(function (
                option
              ) {
                return option.value == catState.modifierPayPercentage;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={mprStandardMultipleProcedureOptions.filter(
                (option, index) => {
                  if (catState.modifierPayPercentage == option.value) {
                    return option;
                  }
                }
              )}
              onSelect={(event) => {
                if (event != null) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { modifierPayPercentage: event.value },
                  });
                }
              }}
            />
          </div>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div className="modifierPayPercentage">
            <CustomSelect
              options={mprStandardMultipleProcedureOptions}
              error={showAllErrors ? isFieldInvalid(catState.modifierPayPercentage): false}
              value={mprStandardMultipleProcedureOptions.filter(function (
                option
              ) {
                return option.value === catState.modifierPayPercentage;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={mprStandardMultipleProcedureOptions.filter(
                (option, index) => {
                  if (catState.modifierPayPercentage === option.value) {
                    return option;
                  }
                }
              )}
              onSelect={(event) => {
                if (event != null) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { modifierPayPercentage: event.value },
                  });
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem sm={1} md={1} xs={1} />
        <GridItem sm={4} md={4} xs={4} />
        {catState.modifierPayPercentage ? (
          <GridItem sm={6} md={6} xs={6}>
            {
              <div
                style={{
                  height: "280px",
                }}
              >
                <AgGrids
                  columnDefs={modifierPayPercentageColumns}
                  onFilterChanged={onFilterChanged}
                  rowData={modifierPayPercentageData}
                />
                {modifierPayPercentageData.length > 0 ? (
                  <small
                    style={{
                      position: "relative",
                      fontSize: "12px",
                      top: "7px",
                    }}
                  >
                    Number of rows : {numberOfRows}
                  </small>
                ) : undefined}
              </div>
            }
          </GridItem>
        ) : undefined}
      </GridContainer>
    </div>
  );
};

export default CategoryFourtyFive;
