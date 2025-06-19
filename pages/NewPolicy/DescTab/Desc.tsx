import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navyColor } from "../../../assets/jss/material-kit-react";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import TextArea from "../../../components/TextArea/TextArea";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { DescriptionTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { DESCRIPTION_TAB_FIELDS } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import {
  getLOB,
  getProductType,
} from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import TextControl from "../../../components/TextArea/TextControl";
import { isFieldInvalid } from "../newPolicyUtils";

const _ = require("lodash");
const Desc = ({ fromViewPolicy, edit,showAllErrors }) => {
  const dispatch = useDispatch();
  const [lob, setLob] = useState([]);
  const [productType, setProductType] = useState([]);
  const checkTextSize = (event, fieldName, expectedLength) => {
    if (event.length > expectedLength) {
      CustomSwal(
        "error",
        "Please check the length of  " +
          fieldName +
          " (more than " +
          expectedLength +
          " characters)",
        navyColor,
        "Ok",
        ""
      );
    }
  };

  useEffect(() => {
    if (updatedState.LOB.length == 0) {
      getLOB(dispatch);
    }
    if (updatedState.ProductType.length == 0) {
      getProductType(dispatch);
    }
  }, []);

  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  useEffect(() => {
    setLob(updatedState.LOB);
    setProductType(updatedState.ProductType);
  }, [updatedState.LOB, updatedState.ProductType]);
  const LotCM = lob?.map((l) => {
    return { label: l.lobTitle, value: l.lobKey };
  });
  const productTypeCM = productType.map((p) => {
    return { label: p.productTitle, value: p.productKey };
  });

  const DescTabFields: DescriptionTabFieldState = useSelector(
    (state: any) => state.DescTabFieldsRedux
  );

  const validateFields: ValidatePolicyState = useSelector(
    (state: any) => state.validatePolicyFieldsRedux
  );

  const showClientGrpDescription = () => {
    let desc = [];
    DescTabFields.productType?.map((k, l) => {
      updatedState.ProductType.map((f, r) => {
        if (f.productKey == k.value) {
          desc.push({ label: f.productTitle, value: f.productKey });
        }
      });
    });
    return desc;
  };
  return (
    <div>
      <CustomPaper
        style={{
          paddingLeft: 12,
          position: "relative",
          right: 20,
          paddingRight: 10,
          paddingTop: 10,
          boxShadow: "none",
          border: "1px solid #D6D8DA",
          marginRight: "0px",
        }}
      >
        <GridContainer
          style={{ marginTop: -20, position: "relative", right: 0 }}
        >
          <GridItem sm={2} md={2} xs={2}>
            <CustomSelect
              isDisabled={!edit ? undefined : fromViewPolicy}
              onSelect={(event) =>
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { lob: event },
                })
              }
              value={DescTabFields.lob}
              options={LotCM}
              labelText={"LOB"}
              showStarIcon={true}
              error={showAllErrors ? isFieldInvalid(DescTabFields.lob): false}
              hoverData={LotCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <CustomSelect
              isMulti
              checkBoxes={true}
              isDisabled={!edit ? undefined : fromViewPolicy}
              onSelect={(event) =>
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { productType: event },
                })
              }
              value={showClientGrpDescription()}
              options={productTypeCM}
              error={showAllErrors ?  isFieldInvalid(DescTabFields.productType) : false}

              labelText={"Client Group Type"}
              showStarIcon={true}
              hoverData={productTypeCM.map((l) => {
                return l.label;
              })}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextControl label={"Notes"} rows={1}
            disabled={!edit ? undefined : fromViewPolicy}
             value={DescTabFields.notes}
             error={showAllErrors ?  isFieldInvalid(DescTabFields.notes ): false}
             onChange={(event)=>{
              checkTextSize(event.target.value, "Notes", 4000);
              if (event.target.value.length > 4000) {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { notes: undefined },
                });
              } else {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { notes: event.target.value },
                });
              }
             }}
             showStarIcon={true}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <TextControl label={"Policy Summary"} rows={2}
            disabled={!edit ? undefined : fromViewPolicy}
            value={DescTabFields.policySummary}
            error={showAllErrors ?  isFieldInvalid(DescTabFields.policySummary ): false}
            onChange={(event)=>{
              checkTextSize(event.target.value, "Policy Summary", 4000);
              if (event.target.value.length > 4000) {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { policySummary: undefined },
                });
              } else {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { policySummary: event.target.value },
                });
              }
             }}
             showStarIcon={true}
             />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <TextControl label={"Policy Explanation"} rows={2}
            disabled={!edit ? undefined : fromViewPolicy}
            value={DescTabFields.policyExplanation}
            error={showAllErrors ?  isFieldInvalid(DescTabFields.policyExplanation ): false}
            onChange={(event)=>{
              checkTextSize(event.target.value, "Policy Explantion", 4000);
              if (event.target.value.length > 4000) {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: undefined,
                });
              } else {
                dispatch({
                  type: DESCRIPTION_TAB_FIELDS,
                  payload: { policyExplanation: event.target.value },
                });
              }
             }}
             showStarIcon={true}
             />
          </GridItem>
          <GridItem sm={12} md={12} xs={12}>
          <TextControl label={"Reference Source Desc"} rows={2}
            disabled={!edit ? undefined : fromViewPolicy}
            value={DescTabFields.referenceSourceDescription}
            onChange={(event)=>{
              dispatch({
                type: DESCRIPTION_TAB_FIELDS,
                payload: { referenceSourceDescription: event.target.value },
              });
             }}
             showStarIcon={true}
             error={showAllErrors ?  isFieldInvalid(DescTabFields.referenceSourceDescription ): false}
             />
          </GridItem>
          <GridItem sm={12} md={12} xs={12}>
          <TextControl label={"Reference Source Title Desc"} rows={2}
            disabled={!edit ? undefined : fromViewPolicy}
            value={DescTabFields.referenceSourceTitleDesc}
            onChange={(event)=>{
              dispatch({
                type: DESCRIPTION_TAB_FIELDS,
                payload: { referenceSourceTitleDesc: event.target.value },
              });
             }}
             showStarIcon={true}
             error={showAllErrors ?  isFieldInvalid(DescTabFields.referenceSourceTitleDesc ): false}
             />
            
          </GridItem>
          <GridItem sm={12} md={12} xs={12}>
          <TextControl label={"Source Indicator"} rows={2}
            disabled={!edit ? undefined : fromViewPolicy}
            value={DescTabFields.sourceIndicator}
            onChange={(event)=>{
              dispatch({
                type: DESCRIPTION_TAB_FIELDS,
                payload: { sourceIndicator: event.target.value },
              });
             }}
             showStarIcon={true}
             error={showAllErrors ?  isFieldInvalid(DescTabFields.sourceIndicator ): false}
             />

          </GridItem>
        </GridContainer>
      </CustomPaper>
    </div>
  );
};
export default Desc;
