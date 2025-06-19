import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CategoryOptions.css";
import GridItem from "../../components/Grid/GridItem";
import { getBwTypeData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { CAT_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";

const CategoryTwentyFive = ({ edit, viewMode, showAllErrors }) => {
  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );

  const lkpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const dispatch = useDispatch();

  const bwType = lkpState.getBwTypeData?.map((k) => {
    return { label: k.description, value: k.bwTypeKey };
  });

  useEffect(() => {
    if (lkpState.getBwTypeData.length === 0) {
      getBwTypeData(dispatch);
    }
  }, []);

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
            BW Type Key{" "}
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
              error={showAllErrors ? isFieldInvalid(catState.bwTypeKey) : false}
              options={bwType}
              value={bwType.filter(function (option) {
                return option?.value == catState?.bwTypeKey;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={bwType.filter((option, index) => {
                return catState.bwTypeKey === option.value;
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { bwTypeKey: event.value },
                  });
                } else {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: undefined,
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

export default CategoryTwentyFive;
