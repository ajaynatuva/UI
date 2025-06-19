import { lazy, Suspense } from "react";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import "../NewPolicy.css";
import { PolicyConstants } from "../PolicyConst";
import { useSelector } from "react-redux";
import ClassicLoader from "../../../components/Spinner/ClassicLoader";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";

const CategoryFourtyFive = lazy(
  () => import("../../CategoryOptions/CategoryFourtyFive")
);
// const CategoryFourtySix = lazy(
//   () => import("../CategoryOptions/CategoryFourtySix")
// );
const CategoryTwenty = lazy(() => import("../../CategoryOptions/CategoryTwenty"));
const CategoryTwelve = lazy(() => import("../../CategoryOptions/CategoryTwelve"));
const CategoryThirtyFive = lazy(
  () => import("../../CategoryOptions/CategoryThirtyFive")
);
const CategoryThirtyEight = lazy(
  () => import("../../CategoryOptions/CategoryThirtyEight")
);
const CategoryTwentyFive = lazy(
  () => import("../../CategoryOptions/CategoryTwentyFive")
);
const CategoryTwentyThree = lazy(
  () => import("../../CategoryOptions/CategoryTwentyThree")
);
const CategoryFourtyNine = lazy(
  () => import("../../CategoryOptions/CategoryFourtyNine")
);
const CategoryThirtyTwo = lazy(
  () => import("../../CategoryOptions/CategoryThirtyTwo")
);

const CatOpt = ({ edit, viewMode,showAllErrors }) => {
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const policyFields: NewPolicyFormFieldState = useSelector(
      (state: any) => state.policyFieldsRedux
    );
  const showCategories = () => {
    switch (policyFields.catCode) {
      case PolicyConstants.TWENTY_THREE:
        return <CategoryTwentyThree edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors} />;
      case PolicyConstants.THIRTY_FIVE:
        return <CategoryThirtyFive edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.THIRTY_EIGHT:
        return <CategoryThirtyEight edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors} />;
      case PolicyConstants.FOURTY_FIVE:
        return <CategoryFourtyFive edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.TWENTY_FIVE:
        return <CategoryTwentyFive edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.TWELVE:
        return <CategoryTwelve edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.TWENTY:
        return <CategoryTwenty edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.FOURTY_SIX:
        // reusing the same code for 46 CAT as there are no logic changes needed
        return <CategoryFourtyFive edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors}/>;
      case PolicyConstants.FOURTY_NINE:
        return <CategoryFourtyNine edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors} />;
      case PolicyConstants.THIRTY_TWO:
        return <CategoryThirtyTwo edit={edit} viewMode={viewMode} showAllErrors = {showAllErrors} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <CustomPaper
        style={{
          paddingLeft: 10,
          position: "relative",
          right: 20,
          paddingRight: 0,
          paddingTop: 10,
          paddingBottom: 6,
          boxShadow: "none",
          height: "380px",
          border: [
            PolicyConstants.THIRTY_TWO,
            PolicyConstants.TWENTY_THREE,
            PolicyConstants.THIRTY_EIGHT,
            PolicyConstants.TWELVE,
            PolicyConstants.TWENTY_FIVE,
            PolicyConstants.TWENTY,
            PolicyConstants.FOURTY_FIVE,
            PolicyConstants.FOURTY_SIX,
            PolicyConstants.FOURTY_NINE,
          ].includes(policyFields.catCode)
            ? "1px solid #D6D8DA"
            : "",
        }}
      >
        <Suspense fallback={<ClassicLoader/>}>
          {showCategories()}
        </Suspense>
      </CustomPaper>
    </div>
  );
};

export default CatOpt;
