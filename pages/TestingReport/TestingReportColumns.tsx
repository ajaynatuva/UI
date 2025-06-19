export const HistoricColumns = [
  {
    field: "drgnPatientId",
    headerName: "Patient Id",
    minWidth: 100,
    headerTooltip: "Patient Id",
    // rowGroup: true,
    // editable: true
  },
  {
    field: "drgClaimId",
    headerName: "Clm ID",
    minWidth: 100,
    headerTooltip: "Claim ID",
    // rowGroup: true,
    // editable: true
  },
  {
    field: "drgClaimSlId",
    headerName: "Clm SL ID",
    minWidth: 100,
    headerTooltip: "Claim SL ID",
    // rowGroup: true,
    // editable: true
  },
  {
    field: "procedureCode",
    headerName: "Procedure Code",
    minWidth: 100,
    headerTooltip: "Procedure Code",
  },
  {
    field: "payerAllowedProcedureCode",
    headerName: "Payer Allowed Procedure Code",
    minWidth: 100,
    headerTooltip: "Payer Allowed Procedure Code",
  },
  // {
  //   field: "ipuClaimLineId",
  //   headerName: "Ipu ClaimLine ID",
  //   minWidth: 100,
  //   headerTooltip: "Ipu ClaimLine ID",
  // },

  // {
  //   field: "refDrgnClaimId",
  //   headerName: "Ref. Clm ID",
  //   minWidth: 100,
  //   headerTooltip: "Refrence Dragon Claim ID",
  // },

  {
    field: "modifier1",
    headerName: "Mod 1",
    minWidth: 90,
    headerTooltip: "Mod 1",
  },
  {
    field: "payerAllowedModifier1",
    headerName: "Payer Allowed Mod 1",
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 1",
  },
  {
    field: "modifier2",
    headerName: "Mod 2",
    minWidth: 90,
    headerTooltip: "Mod 2",
  },
  {
    field: "payerAllowedModifier2",
    headerName: "Payer Allowed Mod 2",
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 2",
  },
  {
    field: "modifier3",
    headerName: "Mod 3",
    minWidth: 90,
    headerTooltip: "Mod 3",
  },
  {
    field: "payerAllowedModifier3",
    headerName: "Payer Allowed Mod 3",
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 3",
  },
  {
    field: "modifier4",
    headerName: "Mod 4",
    minWidth: 90,
    headerTooltip: "Mod 4",
  },
  {
    field: "payerAllowedModifier4",
    headerName: "Payer Allowed Mod 4",
    minWidth: 90,
    headerTooltip: "Payer Allowed Mod 4",
  },
  {
    field: "dxCode1",
    headerName: "Dx Code 1",
    minWidth: 100,
    headerTooltip: "Dx Code 1",
  },
  {
    field: "dxCode2",
    headerName: "Dx Code 2",
    minWidth: 100,
    headerTooltip: "Dx Code 2",
  },
  {
    field: "dxCode3",
    headerName: "Dx Code 3",
    minWidth: 100,
    headerTooltip: "Dx Code 3",
  },
  {
    field: "dxCode4",
    headerName: "Dx Code 4",
    minWidth: 100,
    headerTooltip: "Dx Code 4",
  },
  // {
  //   field: "reasonCode",
  //   headerName: "RSN code",
  //   minWidth: 120,
  //   headerTooltip: "Reason Code",
  //   cellRenderer: (cell) => {
  //     return (
  //       <span title={cell.value}>{cell.value}</span>
  //     );
  //   },
  // },
  // {
  //   field: "ipuChallengeCode",
  //   headerName: "IPU CHG",
  //   minWidth: 120,
  //   headerTooltip: "IPU Challenge Code",
  // },
  {
    field: "posOrTypeOfBill",
    headerName: "POS/Bill TYP",
    minWidth: 100,
    headerTooltip: "POS/Bill TYP",
  },
  {
    field: "lineLevelPos",
    headerName: "Line Level POS",
    minWidth: 100,
    headerTooltip: "Line Level POS",
  },
  {
    field: "condCode",
    headerName: "Condition Codes",
    minWidth: 100,
    headerTooltip: "Condition Codes",
  },
  {
    field: "clmFormType",
    headerName: "CLM Form TYP",
    minWidth: 100,
    headerTooltip: "CLM Form TYPE",
  },
  // {
  //   field: "ipuClmType",
  //   headerName: "IPU CLM TYP",
  //   minWidth: 100,
  //   headerTooltip: "IPU CLAIM TYPE",
  // },
  {
    field: "dosFrom",
    headerName: "Dos From",
    minWidth: 100,
    headerTooltip: "DOS From",
    cellRenderer: (data) => {
      return data.value ? new Date(data.value).toLocaleDateString() : "";
    },
  },

  {
    field: "dosTo",
    headerName: "Dos To",
    minWidth: 100,
    headerTooltip: "DOS To",
    cellRenderer: (data) => {
      return data.value ? new Date(data.value).toLocaleDateString() : "";
    },
  },
  // {
  //   field: "ipuChallengeAmt",
  //   headerName: "IPU Challenge Amt",
  //   minWidth: 120,
  //   headerTooltip: "IPU Challenge Amount",
  //   cellStyle: { textAlign: 'right' }
  // },
  // {
  //   field: "drgnChallengeQty",
  //   headerName: "Challenge QTY",
  //   minWidth: 90,
  //   headerTooltip: "Challenge Quantity",
  // },
  // {
  //   field: "drgnChallengeAmt",
  //   headerName: "CHG amt",
  //   minWidth: 100,
  //   headerTooltip: "Challenge Amount",
  // },
  {
    field: "totalChargeAmount",
    headerName: "Charge Amt",
    minWidth: 90,
    headerTooltip: "Charge Amount",
    cellStyle: { textAlign: "right" },
  },
  {
    field: "payerAllowedAmount",
    headerName: "Payer Allowed Amt",
    minWidth: 90,
    headerTooltip: "Payer Allowed Amount",
    cellStyle: { textAlign: "right" },
  },
  {
    field: "billingProviderId",
    headerName: "Bill Prov Id",
    minWidth: 90,
    headerTooltip: "Billing Provider Id",
  },
  {
    field: "renderingProviderNpi",
    headerName: "Rend NPI",
    minWidth: 90,
    headerTooltip: "Rendering Provider NPI",
  },
  {
    field: "lineLevelNpi",
    headerName: "Line Level NPI",
    minWidth: 90,
    headerTooltip: "Line Level NPI",
  },
  {
    field: "renderingTaxonomy",
    headerName: "Rend Taxonomy",
    minWidth: 90,
    headerTooltip: "Rend Taxonomy",
  },
  {
    field: "lineLevelTaxonomy",
    headerName: "Line Level Taxonomy",
    minWidth: 90,
    headerTooltip: "Line Level Taxonomy",
  },
  {
    field: "taxIdentifier",
    headerName: "Tax Identifier",
    minWidth: 90,
    headerTooltip: "Tax Identifier",
  },
  {
    field: "revenueCode",
    headerName: "Revenue Code",
    minWidth: 100,
    headerTooltip: "Revenue Code",
  },
  {
    field: "payerAllowedRevenueCode",
    headerName: "Allowed Rev Code",
    minWidth: 100,
    headerTooltip: "Allowed Rev Code",
  },
  {
    field: "quantity",
    headerName: "Quantity",
    minWidth: 100,
    headerTooltip: "Quantity",
  },
  {
    field: "payerAllowedUnits",
    headerName: "Payer Allowed Units",
    minWidth: 100,
    headerTooltip: "Payer Allowed Units",
  },
  {
    field: "allowedQuantity",
    headerName: "Allowed Quantity",
    minWidth: 100,
    headerTooltip: "Allowed Quantity",
  },
];

export const clientgroupColumns = [
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "ClientCode",
    checkboxSelection: true,
  },
  {
    field: "clientGroupName",
    headerName: "Client Group Name",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Group Name",
  },
  {
    field: "clientGroupId",
    headerName: "Client Group Id",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "clientGroupId",
    hide: true,
  },
];
