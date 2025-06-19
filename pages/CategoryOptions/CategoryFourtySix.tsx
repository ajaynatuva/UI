// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CustomSelect from "../../components/CustomSelect/CustomSelect";
// import GridContainer from "../../components/Grid/GridContainer";
// import GridItem from "../../components/Grid/GridItem";
// import { MODIFIER_PAY_PERCENTAGE } from "../../redux/actions/NewPolicyFormActionTypes";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyFormReducer";
// import { NewPolicyState } from "../../redux/reducers/NewPolicyReducer";
// import "./CategoryOptions.css";
// import AgGrids from "../../components/TableGrid/AgGrids";
// import { modifierPayPercentageColumns } from "./Columns";
// import { fetchLookupData } from "../../redux/actions/LookupsActions";
// import StarIcon from "@mui/icons-material/Star";

// const CategoryFourtySix = ({ edit, viewMode }) => {
//   const formState: NewPolicyFormState = useSelector(
//     (state: any) => state.newPolicyForm
//   );
//   const updatedState: NewPolicyState = useSelector(
//     (state: any) => state.newPolicy
//   );

//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (updatedState.getModifierPayPercentage.length === 0) {
//       let lkpName = MODIFIER_PAY_PERCENTAGE;
//       fetchLookupData(dispatch, lkpName);
//     }
//   }, []);

//   const [modifierPayPercentageData, setModifierPayPercentageData] = useState(
//     []
//   );

//   const [numberOfRows, setNumberOfRows] = useState(0);
//   const onFilterChanged = (params) => {
//     setNumberOfRows(params.api.getDisplayedRowCount());
//   };
//   // const [showGrid, setShowGrid] = useState(null);

//   useEffect(() => {
//     let modifierPayPercentageData = updatedState.getModifierPayPercentage.map(
//       (k) => {
//         return {
//           id: k.id,
//           mppKeyFk: k.mppKeyFk,
//           modifier: k.modifier,
//           allowedPercentage: k.allowedPercentage,
//           preOp: k.preOp,
//           intraOp: k.intraOp,
//           postOp: k.postOp,
//         };
//       }
//     );
//     setModifierPayPercentageData(modifierPayPercentageData);
//     setNumberOfRows(
//       updatedState.getModifierPayPercentage
//         ? updatedState.getModifierPayPercentage.length
//         : 0
//     );
//   }, [updatedState.getModifierPayPercentage]);

//   const mprStandardMultipleProcedureOptions = [
//     { value: 1, label: "Modifier Pay Percentage" },
//   ];
//   return (
//     <div>
//       <GridContainer>
//         <GridItem sm={1} md={1} xs={1} />
//         <GridItem sm={3} md={3} xs={3}>
//           <small
//             style={{
//               fontSize: 13,
//               color: "black",
//               fontWeight: 400,
//               position: "relative",
//               top: 15,
//             }}
//           >
//             MP Indicators: 2 & 3
//           </small>
//         </GridItem>
//         <GridItem sm={1} md={1} xs={2} />
//         <GridItem sm={2} md={2} xs={2}>
//           <small
//             style={{
//               fontSize: 13,
//               color: "black",
//               fontWeight: 400,
//               position: "relative",
//               top: 15,
//             }}
//           >
//             Modifier Pay Percentage Logic
//             {
//               <StarIcon
//                 style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
//               />
//             }
//           </small>
//         </GridItem>
//         <GridItem sm={4} md={4} xs={4}>
//           <div className="modifierPayPercentage">
//             <CustomSelect
//               error={formState.errors?.modifierPayPercentage}
//               options={mprStandardMultipleProcedureOptions}
//               value={mprStandardMultipleProcedureOptions.filter(function (
//                 option
//               ) {
//                 return option.value === formState.modifierPayPercentage;
//               })}
//               isDisabled={!edit ? undefined : viewMode}
//               catTitle={mprStandardMultipleProcedureOptions.filter(
//                 (option, index) => {
//                   if (formState.modifierPayPercentage === option.value) {
//                     return option;
//                   }
//                 }
//               )}
//               onSelect={(event) => {
//                 if (event != null) {
//                   // setShowGrid(event.value);
//                   dispatch({
//                     type: MODIFIER_PAY_PERCENTAGE,
//                     payload: event.value,
//                   });
//                 } else {
//                   // setShowGrid(null);
//                   dispatch({
//                     type: MODIFIER_PAY_PERCENTAGE,
//                     payload: null,
//                   });
//                 }
//               }}
//             />
//           </div>
//         </GridItem>
//       </GridContainer>
//       <GridContainer>
//         <GridItem sm={1} md={1} xs={1} />
//         <GridItem sm={4} md={4} xs={4} />
//         {formState.modifierPayPercentage ? (
//           <GridItem sm={6} md={6} xs={6}>
//             {
//               <div
//                 style={{
//                   height: "280px",
//                 }}
//               >
//                 <AgGrids
//                   columnDefs={modifierPayPercentageColumns}
//                   onFilterChanged={onFilterChanged}
//                   rowData={modifierPayPercentageData}
//                 />
//                 {modifierPayPercentageData.length > 0 ? (
//                   <small
//                     style={{
//                       position: "relative",
//                       fontSize: "12px",
//                       top: "7px",
//                     }}
//                   >
//                     Number of rows : {numberOfRows}
//                   </small>
//                 ) : undefined}
//               </div>
//             }
//           </GridItem>
//         ) : undefined}
//       </GridContainer>
//     </div>
//   );
// };

// export default CategoryFourtySix;
