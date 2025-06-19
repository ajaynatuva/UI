// import { VALIDATE_NEW_POLICY } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants";




// export function NewPolicyValidation(validateFields,dispatch){
//     const requiredFields = [
//         // policy fields
//     //   "catCode",
//     //   "reasonCode",
//     //   "medicalPolicyCode",
//     //   "subPolicyCode",
//       "reference",
//     //   "claimType",
//     //   "policyDescription",
    
//       // Description tab fields
      
    
//     ];
//     let errors = {};
//     requiredFields.forEach((key) => {
//       const value = validateFields[key];
//       const isInvalid =
//         !value ||
//         (Array.isArray(value) &&
//           (value.length === 0 || value.every((item) => !item.value))) ||
//         (typeof value === "object" && !Array.isArray(value) && !value?.value);
//       if (isInvalid) errors[key] = true;
//     });
  
//     if (Object.keys(errors).length > 0) {
//       dispatch({ type: VALIDATE_NEW_POLICY, payload: { errors } });
//       // fillRequiredFields("not_exists");
//     }
    
//   }