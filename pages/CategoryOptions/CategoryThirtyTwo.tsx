import StarIcon from "@mui/icons-material/Star";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import RadioButton from "../../components/RadioButton/RadioButton";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import "./CategoryOptions.css";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import {
  CAT_FIELDS,
  CAT_RESET,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";

const CategoryThirtyTwo = ({ edit, viewMode, showAllErrors }) => {
  const [frequency, setFrequency] = React.useState("");

  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  // const validateFields: ValidatePolicyState = useSelector(
  //   (state: any) => state.validatePolicyFieldsRedux
  // );

  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  let durationDropdown = [
    { value: "D", label: "Day(s)" },
    { value: "M", label: "Month(s) - 28 days" },
    { value: "Y", label: "Year(s) - 365 days" },
  ];

  const durationData = durationDropdown?.map((f) => {
    return { label: f.label, value: f.value };
  });
  const dispatch = useDispatch();

  // let durationValue = formState?.duration?.replace(/[a-zA-Z]/g, "");

  function displayDuration() {
    let data = [];
    durationData?.map((d) => {
      if (catState?.durationDropdown?.value === d?.value) {
        data.push({
          label: d.label,
          value: d.value,
        });
      }
    });
    if (catState.frequency !== PolicyConstants.ROLL_DURATION) {
      data = null;
    }
    return data;
  }

  useEffect(() => {
    if (policyFields.catCode === PolicyConstants.THIRTY_TWO) {
      if (!catState.frequency && !catState.units && !catState?.duration) {
        dispatch({
          type: CAT_RESET,
        });
      }
      if (!catState.frequency) {
        dispatch({
          type: CAT_FIELDS,
          payload: { frequency: PolicyConstants.ROLL_DURATION },
        });
      }
    }
  }, [
    catState?.duration,
    catState.frequency,
    catState.units,
    dispatch,
    policyFields.catCode,
  ]);

  function showDurationValue() {
    if ( catState.frequency !==null && catState.frequency !== PolicyConstants.ROLL_DURATION) {
      return "NA";
    } else {
      return catState?.duration?.replace(/[a-zA-Z]/g, "");
    }
  }

  function disableDurationFiled() {
    if (viewMode) {
      return true;
    }
    if (
      catState.frequency === PolicyConstants.CALENDER_MONTH ||
      catState.frequency === PolicyConstants.CALENDER_YEAR
    ) {
      return true;
    }
  }
  return (
    <div>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 30 }}>
            <span>
              Units{" "}
              {
                <StarIcon
                  style={{
                    position: "relative",
                    bottom: "4px",
                    fontSize: "7px",
                  }}
                />
              }
            </span>
          </div>
        </GridItem>
        <div style={{ marginTop: 15, marginLeft: 25 }}>
          <CustomInput
            fullWidth={true}
            error={showAllErrors ? isFieldInvalid(catState.units) : false}
            onKeyPress={(e) => StringMethod(e)}
            value={catState.units}
            disabled={!edit ? undefined : viewMode}
            onChange={(event) => {
              dispatch({
                type: CAT_FIELDS,
                payload: { units: event.target.value },
              });
            }}
            type={"text"}
            variant={"outlined"}
          />
        </div>
      </GridContainer>
      <GridContainer>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 15 }}>
            <span>
              Frequency{" "}
              {
                <StarIcon
                  style={{
                    position: "relative",
                    bottom: "4px",
                    fontSize: "7px",
                  }}
                />
              }
            </span>
          </div>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div style={{ marginTop: 15 }}>
            <RadioButton
              label={"Rolling Duration"}
              checked={catState.frequency === PolicyConstants.ROLL_DURATION}
              disabled={!edit ? undefined : viewMode}
              value={frequency}
              onChange={(e) => {
                if (e.target.checked) {
                  setFrequency(PolicyConstants.ROLL_DURATION);
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { frequency: PolicyConstants.ROLL_DURATION },
                  });
                }
              }}
            />
            <RadioButton
              label={"Calendar Month"}
              checked={catState.frequency === PolicyConstants.CALENDER_MONTH}
              disabled={!edit ? undefined : viewMode}
              value={frequency}
              onChange={(e) => {
                if (e.target.checked) {
                  setFrequency(PolicyConstants.CALENDER_MONTH);
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { frequency: PolicyConstants.CALENDER_MONTH },
                  });
                }
              }}
            />
            <RadioButton
              label={"Calendar Year"}
              checked={catState.frequency === PolicyConstants.CALENDER_YEAR}
              disabled={!edit ? undefined : viewMode}
              value={frequency}
              onChange={(e) => {
                if (e.target.checked) {
                  setFrequency(PolicyConstants.CALENDER_YEAR);
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { frequency: PolicyConstants.CALENDER_YEAR },
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
            <span>Duration</span>
          </div>
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          <div style={{ marginTop: 1, marginLeft: 10 }}>
            <CustomInput
              fullWidth={true}
              error={
                showAllErrors
                  ? isFieldInvalid(
                      catState.frequency === PolicyConstants.ROLL_DURATION
                        ? catState?.duration
                        : false
                    )
                  : false
              }
              disabled={disableDurationFiled()}
              value={showDurationValue()}
              onChange={(event) => {
                dispatch({
                  type: CAT_FIELDS,
                  payload: { duration: event.target.value },
                });
              }}
              type={"text"}
              variant={"outlined"}
              style={
                catState.frequency !== PolicyConstants.ROLL_DURATION
                  ? {
                      backgroundColor: "#f2f2f2",
                      cursor: "not-allowed",
                      height: "30px",
                    }
                  : {
                      backgroundColor: "#ffffff",
                    }
              }
            />
          </div>
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          {/* <div style={{ marginTop: 1, marginLeft: 25 }}> */}
          <CustomSelect
            options={durationData}
            error={
              showAllErrors
                ? isFieldInvalid(
                    catState.frequency === PolicyConstants.ROLL_DURATION
                      ? catState?.durationDropdown.value
                      : false
                  )
                : false
            }
            isDisabled={disableDurationFiled()}
            value={displayDuration()}
            onSelect={(event) => {
              dispatch({
                type: CAT_FIELDS,
                payload: { durationDropdown: event },
              });
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default CategoryThirtyTwo;
