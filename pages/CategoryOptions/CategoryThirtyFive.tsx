import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { MetaDataLoaderState } from "../../redux/reducers/MetaLoaderReducer/MetaDataLoaderReducer";
import "./CategoryOptions.css";
import {
  getMaxUnitsLkpData,
  getModIntractionLkpData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { CAT_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";

const CategoryThirtyFive = ({ edit, viewMode,showAllErrors }) => {

  const updatedState1: MetaDataLoaderState = useSelector(
    (state: any) => state.metaDataLoader
  );
  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const validateFields: ValidatePolicyState = useSelector(
    (state: any) => state.validatePolicyFieldsRedux
  );


  const dispatch = useDispatch();

  useEffect(() => {
    if (updatedState1.maxUnitsLkpData.length == 0) {
      getMaxUnitsLkpData(dispatch);
    }
    if (updatedState1.ModInteractionLkpData.length == 0) {
      getModIntractionLkpData(dispatch);
    }
  }, []);

  const MaxUnitsLinkLkp = updatedState1.maxUnitsLkpData?.map((k) => {
    return { label: k.description, value: k.maxUnitsLkpKey };
  });

  const ModIntractionLkp = updatedState1.ModInteractionLkpData?.map((k) => {
    return { label: k.mitDesc, value: k.mitKey };
  });

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
            Max Units Type{" "}
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
             error={showAllErrors? isFieldInvalid(catState.maxUnitsType): false}
              options={MaxUnitsLinkLkp}
              value={MaxUnitsLinkLkp.filter(function (option) {
                return option?.value == catState.maxUnitsType;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={MaxUnitsLinkLkp.filter((option, index) => {
                if (catState.maxUnitsType == option.value) {
                  return option;
                }
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { maxUnitsType: event.value },
                  });
                }
              }}
            />
          </div>
        </GridItem>
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
            Modifier Interaction Type{" "}
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
              error={showAllErrors? isFieldInvalid(catState.modIntractionType): false}
              options={ModIntractionLkp}
              value={ModIntractionLkp.filter(function (option) {
                return option?.value == catState.modIntractionType;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={ModIntractionLkp.filter((option, index) => {
                if (catState.modIntractionType == option.value) {
                  return option;
                }
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { modIntractionType: event.value },
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
export default CategoryThirtyFive;
