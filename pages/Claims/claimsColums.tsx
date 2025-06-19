import { navyColor } from "../../assets/jss/material-kit-react";
import { AllowedRevenueCode, ConditionCode, DxClmLevel, IpuChgCode, 
  ItemizedBillLineID, LineLevelPos, POSBillType, RevCode, admitDx, allowedMod1, allowedMod2, 
  allowedMod3, allowedMod4, allowedProcedureCode, allowedQuantity, allowedUnits, billingProviderId, 
  billingProviderPostalCode, claimId, clientCode, clientGroup, clmFormType, dosFrom, dosTo, dxCode1, 
  dxCode2, dxCode3, dxCode4, extDx, ipuChallengeAmount, ipuClmType, lineAllowedAmount, lineLevelNpi, 
  lineLevelTaxnomy, medPolicy, policy, principalDx, processedDate, reasonCode, refClmId, refSlId, renderingProviderNpi, 
  renderingTaxnomy, rvuPrice, slId, socProviderId, socProviderPostalCode, subQuantity, submittedChargeAmt, submittedCpt, 
  submittedMod1, submittedMod2, submittedMod3, submittedMod4, taxIdentifier } from "./ClaimHeaderNames";

export const headerNames = ["Clm ID"];

export const claimColumns = [
  {
    field: "drgnClaimId",
    headerName: claimId,
    minWidth: 100,
    headerTooltip: "Claim ID",
  },
  {
    field: "itemizedBillLineId",
    headerName: ItemizedBillLineID,
    minWidth: 100,
    headerTooltip: "Itemized Bill Line ID",
  },
  {
    field: "ipuClaimLineId",
    headerName: slId,
    minWidth: 100,
    headerTooltip: "Service Line ID",
  },
  {
    field: "refDrgnClaimSlId",
    headerName: refSlId,
    minWidth: 100,
    headerTooltip: "Reference Service Line ID",
  },
  {
    field: "refDrgnClaimId",
    headerName: refClmId,
    minWidth: 100,
    headerTooltip: "Reference Claim ID",
  },
  {
    field: "medicalPolicy",
    headerName: medPolicy,
    minWidth: 120,
    headerTooltip: "Medical Policy",
  },
  {
    field: "policyNumber",
    headerName: policy,
    minWidth: 100,
    headerTooltip: "Policy.Version",
  },
  {
    field: "submittedProcedureCode",
    headerName: submittedCpt,
    minWidth: 100,
    headerTooltip: "Submitted CPT Code",
  },
  {
    field: "submitted_modifier_1",
    headerName: submittedMod1,
    minWidth: 90,
    headerTooltip: "Submitted Mod 1",
  },
  {
    field: "submitted_modifier_2",
    headerName: submittedMod2,
    minWidth: 90,
    headerTooltip: "Submitted Mod 2",
  },
  {
    field: "submitted_modifier_3",
    headerName: submittedMod3,
    minWidth: 90,
    headerTooltip: "Submitted Mod 3",
  },
  {
    field: "submitted_modifier_4",
    headerName: submittedMod4,
    minWidth: 90,
    headerTooltip: "Submitted Mod 4",
  },
  {
    field: "principalDiags",
    headerName: principalDx,
    minWidth: 90,
    headerTooltip: "Principal Dx",
  },
  {
    field: "diagnosisCodes",
    headerName: DxClmLevel,
    minWidth: 90,
    headerTooltip: "Diagnosis Claim Level",
  },
  {
    field: "admittingDiags",
    headerName: admitDx,
    minWidth: 90,
    headerTooltip: "Admitting Dx",
  },
  {
    field: "externalCauseOfInjuryDiags",
    headerName: extDx,
    minWidth: 90,
    headerTooltip: "External Cause of Injury Diagnosis",
  },
  {
    field: "dx_code_1",
    headerName: dxCode1,
    minWidth: 100,
    headerTooltip: "Dx Code 1",
  },
  {
    field: "dx_code_2",
    headerName: dxCode2,
    minWidth: 100,
    headerTooltip: "Dx Code 2",
  },
  {
    field: "dx_code_3",
    headerName: dxCode3,
    minWidth: 100,
    headerTooltip: "Dx Code 3",
  },
  {
    field: "dx_code_4",
    headerName: dxCode4,
    minWidth: 100,
    headerTooltip: "Dx Code 4",
  },
  {
    field: "reasonCode",
    headerName: reasonCode,
    minWidth: 120,
    headerTooltip: "Reason Code",
  },
  {
    field: "ipuChallengeCode",
    headerName: IpuChgCode,
    minWidth: 120,
    headerTooltip: "IPU Challenge Code",
  },
  {
    field: "posOrBillType",
    headerName: POSBillType,
    minWidth: 100,
    headerTooltip: "POS/Bill Type",
  },
  {
    field: "placeOfService",
    headerName: LineLevelPos,
    minWidth: 90,
    headerTooltip: "Line Level POS",
  },
  {
    field: "conditionCodes",
    headerName: ConditionCode,
    minWidth: 100,
    headerTooltip: "Condition Code",
  },
  {
    field: "clmFormType",
    headerName: clmFormType,
    minWidth: 100,
    headerTooltip: "Claim Form Type",
  },
  {
    field: "ipuClmType",
    headerName: ipuClmType,
    minWidth: 100,
    headerTooltip: "IPU Claim Type",
  },
  {
    field: "dosFrom",
    headerName: dosFrom,
    minWidth: 100,
    headerTooltip: "DOS From",
  },
  {
    field: "dosTo",
    headerName: dosTo,
    minWidth: 100,
    headerTooltip: "DOS To",
  },
  {
    field: "rvuPrice",
    headerName: rvuPrice,
    minWidth: 100,
    headerTooltip: "RVU Price",
  },
  {
    field: "ipuChallengeAmt",
    headerName: ipuChallengeAmount,
    minWidth: 120,
    headerTooltip: "IPU Challenge Amount",
    cellStyle: { textAlign: "right" },
  },
  {
    field: "socProviderId",
    headerName: socProviderId,
    minWidth: 100,
    headerTooltip: "SOC Provider Id",
  },
  {
    field: "socPostalCode",
    headerName: socProviderPostalCode,
    minWidth: 100,
    headerTooltip: "SOC Provider Postal Code",
  },
  {
    field: "submittedChargeAmount",
    headerName: submittedChargeAmt,
    minWidth: 90,
    headerTooltip: "Submitted Charge Amount",
    cellStyle: { textAlign: "right" },
  },
  {
    field: "billingProviderId",
    headerName: billingProviderId,
    minWidth: 90,
    headerTooltip: "Billing Provider Id",
  },
  {
    field: "billingPostalCode",
    headerName: billingProviderPostalCode,
    minWidth: 90,
    headerTooltip: "Billing Provider Postal Code",
  },
  {
    field: "renderingProviderNpi",
    headerName: renderingProviderNpi,
    minWidth: 90,
    headerTooltip: "Rendering Provider NPI",
  },
  {
    field: "renderingProviderNpiLineLevel",
    headerName: lineLevelNpi,
    minWidth: 90,
    headerTooltip: "Line Level NPI",
  },
  {
    field: "renderingTaxonomy",
    headerName: renderingTaxnomy,
    minWidth: 90,
    headerTooltip: "Rendering Taxonomy",
  },
  {
    field: "lineLevelTaxonomy",
    headerName: lineLevelTaxnomy,
    minWidth: 90,
    headerTooltip: "Line Level Taxonomy",
  },
  {
    field: "taxIdentifier",
    headerName: taxIdentifier,
    minWidth: 90,
    headerTooltip: "Tax Identifier",
  },
  {
    field: "revenueCode",
    headerName: RevCode,
    minWidth: 90,
    headerTooltip: "Revenue Code",
  },
  {
    field: "payerAllowedRevenueCode",
    headerName: AllowedRevenueCode,
    minWidth: 90,
    headerTooltip: "Allowed Revenue Code",
  },
  {
    field: "clientCode",
    headerName: clientCode,
    minWidth: 90,
    headerTooltip: "Client code",
  },
  {
    field: "clientGroup",
    headerName: clientGroup,
    minWidth: 90,
    headerTooltip: "Client Group",
  },
  {
    field: "processedOn",
    headerName: processedDate,
    minWidth: 90,
    headerTooltip: "Processed Date",
  },
  {
    field: "submittedUnits",
    headerName: subQuantity,
    minWidth: 90,
    headerTooltip: "Submitted Quantity",
  },
  {
    field: "allowedQuantity",
    headerName: allowedQuantity,
    minWidth: 90,
    headerTooltip: "Payer Allowed Quantity",
  },
  {
    field: "payerAllowedProcedureCode",
    headerName: allowedProcedureCode,
    minWidth: 90,
    headerTooltip: "Payer Allowed Procedure Code",
  },
  {
    field: "payerAllowedModifier1",
    headerName: allowedMod1,
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 1",
  },
  {
    field: "payerAllowedModifier2",
    headerName: allowedMod2,
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 2",
  },
  {
    field: "payerAllowedModifier3",
    headerName: allowedMod3,
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 3",
  },
  {
    field: "payerAllowedModifier4",
    headerName: allowedMod4,
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 4",
  },
  {
    field: "payerAllowedAmount",
    headerName: lineAllowedAmount,
    minWidth: 90,
    headerTooltip: "Payer Allowed Line Amt",
  },

  {
    field: "payerAllowedUnits",
    headerName: allowedUnits,
    minWidth: 90,
    headerTooltip: "Payer Allowed Units",
  },
];

// export const DoctorReviewColumns=[
//   {
//     field: "code",
//     headerName: "Code",
//     minWidth: 100,
//     headerTooltip: "Code",
//   },
//   {
//     field: "m",
//     headerName: "M",
//     minWidth: 100,
//     headerTooltip: "M",
//   },
//   {
//     field: "r",
//     headerName: "R",
//     minWidth: 100,
//     headerTooltip: "R",
//   },
//   {
//     field: "description",
//     headerName: "Description",
//     minWidth: 100,
//     headerTooltip: "Description",
//   },
//   {
//     field: "quantity",
//     headerName: "Quantity",
//     minWidth: 100,
//     headerTooltip: "Quantity",
//   },
//   {
//     field: "unit",
//     headerName: "Unit $",
//     minWidth: 100,
//     headerTooltip: "UNIT Amount",
//   },
//   {
//     field: "total",
//     headerName: "Total $",
//     minWidth: 100,
//     headerTooltip: "Total Amount",
//   },
//   {
//     field: "q",
//     headerName: "Q",
//     minWidth: 100,
//     headerTooltip: "Q",
//   },
//   {
//     field: "f",
//     headerName: "F",
//     minWidth: 100,
//     headerTooltip: "F",
//   },
//   {
//     field: "Challenge",
//     headerName: "Challenge",
//     minWidth: 100,
//     headerTooltip: "Challenge",
//   },
//   {
//     field: "Chal",
//     headerName: "Chal $",
//     minWidth: 100,
//     headerTooltip: "Chal",
//   },
//   {
//     field: "ol",
//     headerName: "Ol",
//     minWidth: 100,
//     headerTooltip: "Ol",
//   },
// ];

export const getpolicyData = [
  // {
  //   field: "itemizedBillLineId",
  //   headerName: "Id",
  //   minWidth: 100,
  //   headerTooltip: "Id",
  // },

  {
    field: "code",
    headerName: "Code",
    minWidth: 100,
    headerTooltip: "Code",
  },

  {
    field: "description",
    headerName: "Description",
    minWidth: 200,
    headerTooltip: "Description",
  },

  {
    field: "quantity",
    headerName: "Qty",
    minWidth: 50,
    headerTooltip: "Qty",
  },

  {
    field: "chargeAmount",
    headerName: "Total $",
    minWidth: 60,
    headerTooltip: "Total $",
  },

  {
    field: "challengeCode",
    headerName: "Challenge Code",
    minWidth: 50,
    headerTooltip: "Challenge Code",
  },

  {
    field: "challengeAmount",
    headerName: "Challenge $",
    minWidth: 100,
    headerTooltip: "Challenge $",
  },
];
