import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import StarIcon from "@mui/icons-material/Star";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { CAT_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { isFieldInvalid } from "../NewPolicy/newPolicyUtils";

const CategoryFourtyNine = ({ edit, viewMode, showAllErrors }) => {
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );

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
  const _ = require("lodash");

  const modifierPriorityOptions = [
    { value: 1, label: "Modifier Priority Lookup" },
  ];

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
            Apply Modifier Priority{" "}
            {
              <StarIcon
                style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
              />
            }
          </small>
        </GridItem>
        <GridItem sm={4} md={4} xs={4}>
          <div className="modifierPriority">
            <CustomSelect
              error={showAllErrors? isFieldInvalid(catState.modifierPriority): false}
              options={modifierPriorityOptions}
              value={modifierPriorityOptions.filter(function (option) {
                return option?.value == catState.modifierPriority?.value;
              })}
              isDisabled={!edit ? undefined : viewMode}
              catTitle={modifierPriorityOptions?.filter((option, index) => {
                if (catState.modifierPriority?.value === option?.value) {
                  return option;
                }
              })}
              onSelect={(event) => {
                if (event) {
                  dispatch({
                    type: CAT_FIELDS,
                    payload: { modifierPriority: event }
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
export default CategoryFourtyNine;
