import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { navyColor } from "../../assets/jss/material-kit-react";
import { useMemo } from "react";

// getting comma separted refdrgnclaimid and refdrgnclaimslid
export const commaSeparatedId = (refList = [], property) => {
  let result = [];
  if (Array.isArray(refList)) {
    refList.forEach((ref) => {
      if (ref[property] !== undefined) {
        result.push(ref[property]);
      }
    });
  }
  return result.toString();
};

// Reference Template
export const referenceTemplate =
  "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%20IPU%2FData%20Curation%2FReference%20Templates%2FTesting%20Report%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";

//  logic for testing report for export
const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

// getting testing report data
export const claimLinesDetails = (updatedState) => {
  const recommendationMap = new Map();
  const testClaimLines = [];
  const finalClaimLinesMap = new Map();

  let status = "";

  // Step 1: Build recommendationMap and testClaimLines
  updatedState.totalClaimsData?.forEach((t) => {
    status = t.claimStatus;
    t.testClaimLines?.forEach((ts) => {
      ts.ipuRecommendationsList?.forEach((rec) => {
        if (!recommendationMap.has(ts.drgClaimSlId)) {
          recommendationMap.set(ts.drgClaimSlId, []);
        }
        recommendationMap.get(ts.drgClaimSlId).push(rec);
        testClaimLines.push(ts);
      });
    });
  });

  // Step 2: Build editedClaimLines using recommendationMap

  const editedClaimLines = Array.from(recommendationMap.entries()).flatMap(
    ([drgClaimSlId, recommendations]) => {
      const testClaimLine = testClaimLines.find(
        (k) => k.drgClaimSlId === drgClaimSlId
      );
      if (!testClaimLine) return []; // Skip if no matching test claim line found
      return recommendations.map((t) => ({
        policyId: t.policyId,
        recommendedMod1: t.modifier1,
        recommendedMod2: t.modifier2,
        recommendedMod3: t.modifier3,
        recommendedMod4: t.modifier4,
        recommendedPercent: t.percent,
        policyNumber: t.policyNumber,
        policyVersion: t.policyVersion,
        challengeCode: t.challengeCodeId,
        refDrgnSlId: commaSeparatedId(
          t.ipuRecommendationReferencesList,
          "drgnClaimSlId"
        ),
        reasonCode: t.reasonCode,
        refDrgnClaimId: commaSeparatedId(
          t.ipuRecommendationReferencesList,
          "drgnClaimid"
        ),
        allowedQuantity: t.units,
        cptFrom: testClaimLine.cptFrom,
        claimSlId: testClaimLine.drgClaimSlId,
        quantity: testClaimLine.submittedUnits,
        mod1: testClaimLine.submittedModifier1,
        mod2: testClaimLine.submittedModifier2,
        mod3: testClaimLine.submittedModifier3,
        mod4: testClaimLine.submittedModifier4,
        dx1: testClaimLine.dxCode1,
        dx2: testClaimLine.dxCode2,
        dx3: testClaimLine.dxCode3,
        dx4: testClaimLine.dxCode4,
        dosFrom: testClaimLine.dosFrom,
        dosTo: testClaimLine.dosTo,
        revenueCode: testClaimLine.revenueCode,
        payerAllowedRevenueCode: testClaimLine.payerAllowedRevenueCode,
        totalChargeAmount: testClaimLine.submittedChargeAmount,
        payerAllowedProcedureCode: testClaimLine.payerAllowedProcedureCode,
        payerAllowedUnits: testClaimLine.payerAllowedUnits,
        payerAllowedModifier1: testClaimLine.payerAllowedModifier1,
        payerAllowedModifier2: testClaimLine.payerAllowedModifier2,
        payerAllowedModifier3: testClaimLine.payerAllowedModifier3,
        payerAllowedModifier4: testClaimLine.payerAllowedModifier4,
        payerAllowedAmount: testClaimLine.payerAllowedAmount,
        pos: testClaimLine.pos,
        rvuPrice: testClaimLine.rvuPrice,
        renderingProviderNpi: testClaimLine.renderingProviderNpi,
        renderingTaxonomy: testClaimLine.renderingTaxonomy,
        claimStatus: status,
      }));
    }
  );

  // Step 3: Merge lineLevelData with editedClaimLines
  updatedState.lineLevelData.forEach((r) => {
    const matches = editedClaimLines.filter((k) => k.claimSlId === r.claimSlId);
    if (matches.length > 0) {
      matches.forEach((match, index) => {
        finalClaimLinesMap.set(`${r.claimSlId}_${index}`, {
          ...r,
          ...match,
          challengeCode: match.challengeCode || "",
          reasonCode: match.reasonCode || "",
          policyNumber: match.policyNumber || "",
          refDrgnSlId: match.refDrgnSlId || "",
          refDrgnClaimId: match.refDrgnClaimId || "",
        });
      });
    } else {
      finalClaimLinesMap.set(r.claimSlId, r);
    }
  });

  // Step 4: Return sorted finalClaimLines
  return Array.from(finalClaimLinesMap.values())
    .flat()
    .sort((a, b) => a.claimSlId - b.claimSlId);
};

export const convertToSheet = (groupedData, keys) => {
  return XLSX.utils.json_to_sheet(
    Object.values(groupedData)
      .flat()
      .map((obj) => {
        const result = {};
        keys.forEach((key) => {
          result[key] = obj[key];
        });
        return result;
      })
  );
};

export const exportToCSV = (
  historicdata,
  fileName,
  updatedState,
  selectedType,
  totaltestingreportdata,
  clientGroup,
  clientGroupType
) => {
  let claimData = claimLinesDetails(updatedState);

  let dataresult = [];
  updatedState.claimHeaderData.forEach((p, l) => {
    claimData.map((k, l) => {
      if (p.scenarioId === k.scenarioId) {
        dataresult.push({
          "Claim SL ID": k.claimSlId,
          "Scenario ID": k.scenarioId,
          "Scenario Desc": p.scenarioDesc,
          Positive: p.postiveData,
          "Claim Form Type": p.claimFormType,
          "Member ID": p.memberId,
          DOB: p.dob,
          Gender: p.gender,
          "CPT From": k.cptFrom,
          "Allowed Procedure Code": k.payerAllowedProcedureCode,
          Qty: k.quantity,
          "Allowed Units": k.payerAllowedUnits,
          "Mod 1": k.mod1,
          "Allowed Mod 1": k.payerAllowedModifier1,
          "Mod 2": k.mod2,
          "Allowed Mod 2": k.payerAllowedModifier2,
          "Mod 3": k.mod3,
          "Allowed Mod 3": k.payerAllowedModifier3,
          "Mod 4": k.mod4,
          "Allowed Mod 4": k.payerAllowedModifier4,
          "Dx 1": k.dx1,
          "Dx 2": k.dx2,
          "Dx 3": k.dx3,
          "Dx 4": k.dx4,
          "DOS From": k.dosFrom,
          "DOS To": k.dosTo,
          POS: p.pos,
          "Zip Code": p.zipCode,
          "Line Level POS": k.lineLevelPos,
          NPI: p.npi,
          "Line Level NPI": k.lineLevelNpi,
          TIN: p.tin,
          Taxonomy: p.taxonomy,
          "Line Level Taxonomy": k.lineLevelTaxonomy,
          "Condition Code": p.conditionCode,
          "Bill Type": p.billType,
          "Rev Code": k.revenueCode,
          "Allowed Rev Code": k.payerAllowedRevenueCode,
          "Diag Codes": p.diagsCodes,
          "Total Charge Amount": k.totalChargeAmount,
          "Payer Allowed Amount": k.payerAllowedAmount,
          "RVU Price": k.rvuPrice,
          "Allowed Qty": k.allowedQuantity,
          "Recommended Percent": k.recommendedPercent,
          "Challenge Code": k.challengeCode ? k.challengeCode : "",
          "Reason Code": k.reasonCode ? k.reasonCode : "",
          "Policy Number": k.policyNumber ? k.policyNumber : "",
          "Policy Version": k.policyVersion,
          "Ref Drgn SL ID": k.refDrgnSlId ? k.refDrgnSlId : "",
          "Ref Drg Claim ID": k.refDrgnClaimId ? k.refDrgnClaimId : "",
          "Claim Status": k.claimStatus,
          "Rec Mod1": k.recommendedMod1,
          "Rec Mod2": k.recommendedMod2,
          "Rec Mod3": k.recommendedMod3,
          "Rec Mod4": k.recommendedMod4,
        });
      }
    });
  });

  let historicSheetData = [];

  historicdata.forEach((h, i) => {
    historicSheetData.push({
      "Drgn Patient ID": h.drgnPatientId,
      "Drgn Claim ID": h.drgClaimId,
      "Drgn SL ID": h.drgClaimSlId,
      "Procedure Code": h.procedureCode,
      "Payer Allowed Proc Code": h.payerAllowedProcedureCode,
      "Mod 1": h.modifier1,
      "Payer Allowed Mod 1": h.payerAllowedModifier1,
      "Mod 2": h.modifier2,
      "Payer Allowed Mod 2": h.payerAllowedModifier2,
      "Mod 3": h.modifier3,
      "Payer Allowed Mod 3": h.payerAllowedModifier3,
      "Mod 4": h.modifier4,
      "Payer Allowed Mod 4": h.payerAllowedModifier4,
      "Dx Code 1": h.dxCode1,
      "Dx Code 2": h.dxCode2,
      "Dx Code 3": h.dxCode3,
      "Dx Code 4": h.dxCode4,
      "POS or Type of Bill": h.posOrTypeOfBill,
      "Line Level POS": h.lineLevelPos,
      "Cond Code": h.condCode,
      "Claim Form Type": h.claimFormType,
      "DOS From": h.dosFrom,
      "DOS To": h.dosTo,
      "Total Charge Amount": h.totalChargeAmount,
      "Payer Allowed Amount": h.payerAllowedAmount,
      "Billing Provider ID": h.billingProviderId,
      "Rendering Provider NPI": h.renderingProviderNpi,
      "Line Level NPI": h.lineLevelNpi,
      "Rendering Taxonomy": h.renderingTaxonomy,
      "Line Level Taxonomy": h.lineLevelTaxonomy,
      "Tax Identifier": h.taxIdentifier,
      "Revenue Code": h.revenueCode,
      "Allowed Rev Code": h.payerAllowedRevenueCode,
      Quantity: h.quantity,
      "Payer Allowed Units": h.payerAllowedUnits,
      "Allowed Quantity": h.allowedQuantity,
    });
  });
  const groupedData = dataresult.reduce((acc, obj) => {
    const key = obj["Claim SL ID"];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  // Get the unique keys (column names)
  const keys = Array.from(
    new Set(
      Object.values(groupedData)
        .flat()
        .map((obj) => Object.keys(obj))
        .flat()
    )
  );

  if (selectedType == "single") {
    const ws1 = convertToSheet(groupedData, keys);
    // Merge cells based on the 'claimSlId'  starting from the second row
    let currentRow = 1;
    Object.values(groupedData).forEach((group: any[]) => {
      const start = currentRow;
      const end = start + group.length - 1;

      for (let colIndex = 0; colIndex < 41; colIndex++) {
        ws1["!merges"] = ws1["!merges"] || [];
        ws1["!merges"].push({
          s: { r: start, c: colIndex },
          e: { r: end, c: colIndex },
        });
      }

      currentRow = end + 1;
    });

    const ws2 = XLSX.utils.json_to_sheet(historicSheetData);

    const z = {
      "Policy Number": totaltestingreportdata.policyNumber,
      "Policy Version": totaltestingreportdata.policyVersion,
      "Claim Type": totaltestingreportdata.claimType,
      "Procedure Min Age": totaltestingreportdata.minAgeFk?.minMaxAgeDesc,
      "Procedure Max Age": totaltestingreportdata.maxAgeFk?.minMaxAgeDesc,
      Prod: totaltestingreportdata.isProdb,
      Deactivated: totaltestingreportdata.deactivated,
      Disabled: totaltestingreportdata.disabled,
      "Client Group ID": clientGroup,
      "Client Group Type": clientGroupType.label,
    };

    let sheet3 = [z];
    const ws3 = XLSX.utils.json_to_sheet(sheet3);
    const wb = {
      Sheets: {
        "Procedures Data": ws1,
        "Historic Data": ws2,
        "Policies Data": ws3,
      },
      SheetNames: ["Procedures Data", "Historic Data", "Policies Data"],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  } else {
    const ws1 = convertToSheet(groupedData, keys);

    // Merge cells based on the 'claimSlId'starting from the second row
    let currentRow = 1;
    Object.values(groupedData).forEach((group: any[]) => {
      const start = currentRow;
      const end = start + group.length - 1;

      for (let colIndex = 0; colIndex < 41; colIndex++) {
        ws1["!merges"] = ws1["!merges"] || [];
        ws1["!merges"].push({
          s: { r: start, c: colIndex },
          e: { r: end, c: colIndex },
        });
      }

      currentRow = end + 1;
    });

    const ws2 = XLSX.utils.json_to_sheet(historicSheetData);
    const z = {
      "Client Group ID": clientGroup,
      "Client Group Type": clientGroupType.label,
    };
    let sheet3 = [z];
    const ws3 = XLSX.utils.json_to_sheet(sheet3);
    const wb = {
      Sheets: {
        "Procedures Data": ws1,
        "Historic Data": ws2,
        "Policies Data": ws3,
      },
      SheetNames: ["Procedures Data", "Historic Data", "Policies Data"],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
};

// validation  for testing report upload file

// validation for check date of birth
export const checkDateDob = (dob, idx) => {
  let checkErrorDetails = false;

  if (dob.includes("NaN")) {
    checkErrorDetails = true;

    CustomSwal(
      "error",
      "Invalid Date format at Row " + (idx + 1),
      navyColor,
      "OK",
      ""
    );
  }
  return checkErrorDetails;
};

// validation for dos
export const checkDatesDos = (dos, dosTo, idx, lines) => {
  let checkErrorDetails = false;

  if (dos.includes("NaN") || dosTo.includes("NaN")) {
    checkErrorDetails = true;

    CustomSwal(
      "error",
      "Invalid Date format at Row " + (idx + 1),
      navyColor,
      "OK",
      lines
    );
  }
  return checkErrorDetails;
};

// validation for Claim Lines
export const checkNullForClaimLines = (data, idx) => {
  let checkErrorDetails = false;

  const fieldsToCheck = [
    { field: "cptFrom", message: "CPT Code" },
    { field: "claimSlId", message: "Claim SL Id" },
    { field: "claimFormType", message: "Claim Form Type" },
    { field: "memberId", message: "MemberId" },
    { field: "scenarioId", message: "Scenario Id" },
    { field: "dob", message: "DOB" },
    { field: "gender", message: "Gender" },
    { field: "dosFrom", message: "DOS From" },
    { field: "dosTo", message: "DOS To" },
    { field: "tin", message: "TIN" },
    { field: "taxonomy", message: "Taxonomy" },
    { field: "diagsCodes", message: "Diags Codes" },
    { field: "qty", message: "Quantity" },
  ];

  fieldsToCheck.forEach(({ field, message }) => {
    if (data[field] == null || data[field] === undefined) {
      checkErrorDetails = true;
      CustomSwal(
        "error",
        `Please enter ${message} at Row ${idx + 1}`,
        navyColor,
        "OK",
        "Claim Lines"
      );
      return checkErrorDetails;
    }
  });

  // Additional specific checks
  if (data.pos != null && data.claimFormType === "U") {
    checkErrorDetails = true;
    CustomSwal(
      "error",
      `Please change Claim Type to H for Row ${idx + 1}`,
      navyColor,
      "OK",
      "Claim Lines"
    );
    return checkErrorDetails;
  }

  if (data.billType != null && data.claimFormType === "H") {
    checkErrorDetails = true;
    CustomSwal(
      "error",
      `Please change Claim Type to U for Row ${idx + 1}`,
      navyColor,
      "OK",
      "Claim Lines"
    );
    return checkErrorDetails;
  }

  if (data.pos == null && data.claimFormType === "H") {
    checkErrorDetails = true;
    CustomSwal(
      "error",
      `Please enter POS at Row ${idx + 1}`,
      navyColor,
      "OK",
      "Claim Lines"
    );
    return checkErrorDetails;
  }

  if (data.billType == null && data.claimFormType === "U") {
    checkErrorDetails = true;
    CustomSwal(
      "error",
      `Please enter Bill Type at Row ${idx + 1}`,
      navyColor,
      "OK",
      "Claim Lines"
    );
    return checkErrorDetails;
  }

  return checkErrorDetails;
};

// validation for History Lines
export const checkNullForHistoryLines = (data, idx) => {
  let checkErrorDetails = false;

  const fieldsToCheck = [
    { field: "drgnPatientId", message: "Patient Id" },
    { field: "drgClaimId", message: "Dragon ClaimId" },
    { field: "drgClaimSlId", message: "Drg Claim SL Id" },
    { field: "procedureCode", message: "Procedure Code" },
    { field: "posOrTypeOfBill", message: "POS Or Bill Type" },
    { field: "clmFormType", message: "Claim Form Type" },
    { field: "dosFrom", message: "DOS From" },
    { field: "dosTo", message: "DOS To" },
    { field: "billingProviderId", message: "Billing Provider Id" },
    { field: "renderingProviderNpi", message: "Rendering Provider NPI" },
    { field: "renderingTaxonomy", message: "Rendering Taxonomy" },
    { field: "taxIdentifier", message: "Tax Identifier" },
  ];

  fieldsToCheck.forEach(({ field, message }) => {
    if (data[field] == null) {
      checkErrorDetails = true;
      CustomSwal(
        "error",
        `Please enter ${message} at Row ${idx + 1}`,
        navyColor,
        "OK",
        "History Lines"
      );
    }
  });
  return checkErrorDetails;
};

// setting correct date when file upload

export const convertCellDate = (
  ws: any,
  columnIndex: number,
  rowIndex: number
) => {
  const cellAddress: any = { c: columnIndex, r: rowIndex };
  const cellRef: string = XLSX.utils.encode_cell(cellAddress);
  const cell: any = ws[cellRef];

  if (cell) {
    let value: any = cell.w;
    const parsedDate: Date = new Date(value);
    let convertedDate =
      parsedDate.getMonth() +
      1 +
      "/" +
      parsedDate.getDate() +
      "/" +
      parsedDate.getFullYear();
    cell.v = convertedDate;
  }
};
// appending claim sheet values
export const claimDataObject = (d) => ({
  claimSlId: d[0],
  scenarioId: d[1],
  scenarioDesc: d[2],
  postiveData: d[3],
  claimFormType: d[4],
  memberId: d[5],
  dob: d[6],
  gender: d[7],
  cptFrom: d[8],
  payerAllowedProcedureCode: d[9],
  qty: d[10],
  payerAllowedUnits: d[11],
  mod1: d[12],
  payerAllowedModifier1: d[13],
  mod2: d[14],
  payerAllowedModifier2: d[15],
  mod3: d[16],
  payerAllowedModifier3: d[17],
  mod4: d[18],
  payerAllowedModifier4: d[19],
  dx1: d[20],
  dx2: d[21],
  dx3: d[22],
  dx4: d[23],
  dosFrom: d[24],
  dosTo: d[25],
  pos: d[26],
  zipCode: d[27],
  lineLevelPos: d[28],
  npi: d[29],
  lineLevelNpi: d[30],
  tin: d[31],
  taxonomy: d[32],
  lineLevelTaxonomy: d[33],
  conditionCode: d[34],
  billType: d[35],
  revenueCode: d[36],
  payerAllowedRevenueCode: d[37],
  diagsCodes: d[38],
  totalChargeAmount: d[39],
  payerAllowedAmount: d[40],
});
// appending history sheet values
export const claimHistoryDataObject = (d) => ({
  drgnPatientId: d[0],
  drgClaimId: d[1],
  drgClaimSlId: d[2],
  // ipuClaimLineId: d[1],
  // refDrgnClaimId: d[2],
  procedureCode: d[3],
  payerAllowedProcedureCode: d[4],
  modifier1: d[5],
  payerAllowedModifier1: d[6],
  modifier2: d[7],
  payerAllowedModifier2: d[8],
  modifier3: d[9],
  payerAllowedModifier3: d[10],
  modifier4: d[11],
  payerAllowedModifier4: d[12],
  dxCode1: d[13],
  dxCode2: d[14],
  dxCode3: d[15],
  dxCode4: d[16],
  // reasonCode: d[12],
  // ipuChallengeCode: d[13],
  posOrTypeOfBill: d[17],
  pos: d[18],
  condCode: d[19],
  clmFormType: d[20],
  // ipuClmType: d[16],
  dosFrom: d[21],
  dosTo: d[22],
  // ipuChallengeAmt: d[20],
  // drgnChallengeQty: d[21],
  totalChargeAmount: d[23],
  payerAllowedAmount: d[24],
  billingProviderId: d[25],
  renderingProviderNpi: d[26],
  lineLevelNpi: d[27],
  renderingTaxonomy: d[28],
  lineLevelTaxonomy: d[29],
  taxIdentifier: d[30],
  revenueCode: d[31],
  payerAllowedRevenueCode: d[32],
  quantity: d[33],
  payerAllowedUnits: d[34],
  allowedQuantity: d[35],
});


export const checkHeight = () => {
  let height;
  if (window.screen.height > 900) {
    height = "630px";
  } else if (window.screen.height > 600) {
    height = "490px";
  }
  return height;
};

export const checkScroll = (updatedState) => {
  let scroll;
  if (window.screen.height > 900) {
    if (updatedState.claimHeaderData.length >= 3) {
      scroll = "scroll";
    } else {
      scroll = "hidden";
    }
  } else if (window.screen.height > 600) {
    if (updatedState.claimHeaderData.length > 2) {
      scroll = "scroll";
    } else {
      scroll = "hidden";
    }
  }
  return scroll;
};

export const checkImportBtn = (selectedType, policy, version) => {
  let btn = true;
  if (selectedType == "single") {
    if (policy.length > 0 && version.length > 0) {
      btn = false;
    } else {
      btn = true;
    }
  } else if (selectedType == "all") {
    btn = false;
  }
  return btn;
};

//// testing report table logic

// headers for table
export const tableHeaders = [
  "Claim SL ID",
  "PROCS Code",
  "Allowed PROCS Code",
  "Qty",
  "Allowed Units",
  "Mod 1",
  "Allowed Mod 1",
  "Mod 2",
  "Allowed Mod 2",
  "Mod 3",
  "Allowed Mod 3",
  "Mod 4",
  "Allowed Mod 4",
  "DOS From",
  "DOS To",
  "Dx 1",
  "Dx 2",
  "Dx 3",
  "Dx 4",
  "Revenue Code",
  "Allowed Rev Code",
  "Total Charge Amount",
  "RVU Price",
  "Payer Allowed Amount",
  "Line Level POS",
  "Line Level NPI",
  "Line Level Taxonomy",
  "Allowed Qty",
  "Rec Mod1",
  "Rec Mod2",
  "Rec Mod3",
  "Rec Mod4",
  "Rec Per",
  "Challenge Code",
  "Reason Code",
  "Policy#",
  "Version",
  "Ref Claim ID",
  "Ref Sl ID",
];

// table data cells
const renderTableDataCells = (k, rowspan) => {
  const keys = [
    "claimSlId",
    "cptFrom",
    "payerAllowedProcedureCode",
    "quantity",
    "payerAllowedUnits",
    "mod1",
    "payerAllowedModifier1",
    "mod2",
    "payerAllowedModifier2",
    "mod3",
    "payerAllowedModifier3",
    "mod4",
    "payerAllowedModifier4",
    "dosFrom",
    "dosTo",
    "dx1",
    "dx2",
    "dx3",
    "dx4",
    "revenueCode",
    "payerAllowedRevenueCode",
    "totalChargeAmount",
    "rvuPrice",
    "payerAllowedAmount",
    "lineLevelPos",
    "lineLevelNpi",
    "lineLevelTaxonomy",
    // "allowedQuantity",
    // "recommendedMod1",
    // "recommendedMod2",
    // "recommendedMod3",
    // "recomendedMod4",
    // "recommendedPercent",
    // "challengeCode",
    // "reasonCode",
    // "policyNumber",
    // "policyVersion",
    // "refDrgnClaimId",
    // "refDrgnSlId",
  ];

  return keys.map((key) => (
    <td key={key} rowSpan={rowspan}>
      {k[key]}
    </td>
  ));
};

// addition table cells
const AdditionalTableDataCells = (k) => {
  const keys = [
    "allowedQuantity",
    "recommendedMod1",
    "recommendedMod2",
    "recommendedMod3",
    "recomendedMod4",
    "recommendedPercent",
    "challengeCode",
    "reasonCode",
    "policyNumber",
    "policyVersion",
    "refDrgnClaimId",
    "refDrgnSlId",
  ];

  return keys.map((key) => <td key={key}>{k[key]}</td>);
};

// checking key value are equal or not
const areFieldsEqual = (obj1, obj2, keys) => {
  return keys.every((key) => obj1[key] === obj2[key]);
};

export const renderClaimRows = (headerLevelData, updatedState) => {
  const relevantKeys = [
    "claimSlId",
    "cptFrom",
    "payerAllowedProcedureCode",
    "quantity",
    "payerAllowedUnits",
    "mod1",
    "payerAllowedModifier1",
    "mod2",
    "payerAllowedModifier2",
    "mod3",
    "payerAllowedModifier3",
    "mod4",
    "payerAllowedModifier4",
    "dosFrom",
    "dosTo",
    "dx1",
    "dx2",
    "dx3",
    "dx4",
    "revenueCode",
    "payerAllowedRevenueCode",
    "totalChargeAmount",
    "rvuPrice",
    "payerAllowedAmount",
    "lineLevelPos",
    "lineLevelNpi",
    "lineLevelTaxonomy",
  ];

  const claimLines = claimLinesDetails(updatedState);

  // Precompute rowspans outside the JSX rendering
  const precomputedRowspans = claimLines.reduce((acc, line) => {
    const key = relevantKeys.map((k) => line[k]).join("-"); // Unique key based on relevant keys
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const claimLinesWithRowspan = claimLines.map((line) => ({
    ...line,
    rowspan:
      precomputedRowspans[relevantKeys.map((k) => line[k]).join("-")] || 1,
  }));

  return claimLinesWithRowspan
    .map((k, index) => {
      const rowspan = k.rowspan;

      if (headerLevelData.scenarioId === k.scenarioId) {
        const isFirstRow = index === 0;
        const isDifferentFromPreviousRow =
          index > 0 && !areFieldsEqual(k, claimLines[index - 1], relevantKeys);
        const rowStyle = rowspan > 1 ? { backgroundColor: "#d7dbdd" } : {};

        return (
          <tr key={k.claimSlId} style={rowStyle}>
            {(isFirstRow || isDifferentFromPreviousRow) &&
              renderTableDataCells(k, rowspan)}
            {/* Always render additional keys if available */}
            {AdditionalTableDataCells(k)}
          </tr>
        );
      }
      return null;
    })
    .filter(Boolean);
};
