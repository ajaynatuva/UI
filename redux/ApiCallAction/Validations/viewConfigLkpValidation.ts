import {
  BO_TYPE_LKP,
  BW_TYPE_LKP,
  MAX_UNITS_TYPES,
  MUE_RATIONALE_LKP,
  SPECS_LKP,
  SUB_SPEC_LKP,
   BILL_TYPE_LKP,
  CCI_LKP,
  CCI_RATIONALE_LKP,
  CONDITION_CODE_LKP,
  MIN_MAX_AGE_LKP,
  MOD_LKP,
  POLICY_CATEGORY_LKP,
  POS_LKP,
  REASON_CODE_LKP,
  REVENUE_CODE_LKP,
  MAX_UNITS_LKP
} from '.././../../pages/LookUps/LookUpConsts';

export function validateLookUps(selectedLKP, lookUpData) {
  let error = false;
  switch (selectedLKP) {
    case SPECS_LKP:
      if (
        lookUpData.specCode == undefined ||
        lookUpData.specDesc == undefined ||
        lookUpData.specDesc == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case SUB_SPEC_LKP:
      if (
        lookUpData.cmsSpecialityCode == undefined ||
        lookUpData.cmsSpecialityCode == '' ||
        lookUpData.miscB == undefined ||
        lookUpData.specCode == undefined ||
        lookUpData.subSpecCode == undefined ||
        lookUpData.subSpecDesc == undefined ||
        lookUpData.subSpecDesc == '' ||
        lookUpData.taxonomyCode == undefined ||
        lookUpData.taxonomyCode == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case MIN_MAX_AGE_LKP:
      if (
        lookUpData.minMaxAgeDesc == undefined ||
        lookUpData.minMaxAgeDesc == '' ||
        lookUpData.ageYears == undefined ||
        lookUpData.ageYears == null ||
        lookUpData.ageYears.length == 0 ||
        lookUpData.ageMonths == undefined ||
        lookUpData.ageMonths == null ||
        lookUpData.ageMonths.length == 0 ||
        lookUpData.ageDays == undefined ||
        lookUpData.ageDays == null ||
        lookUpData.ageDays.length == 0 ||
        (lookUpData.minVsMaxB != 0 && lookUpData.minVsMaxB != 1) ||
        (lookUpData.equalsB != 0 && lookUpData.equalsB != 1)
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case REVENUE_CODE_LKP:
      if (
        lookUpData.revCode == undefined ||
        lookUpData.revCode == '' ||
        lookUpData.revDesc == undefined ||
        lookUpData.revDesc == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case BILL_TYPE_LKP:
      if (
        lookUpData.billType === undefined ||
        lookUpData.billTypeDesc === undefined ||
        lookUpData.billTypeDesc === '' ||
        lookUpData.claimTypeMatch === undefined ||
        lookUpData.claimTypeMatch === '' ||
        lookUpData.claimTypeMatch == null ||
        lookUpData.startDate === undefined ||
        lookUpData.startDate === '' ||
        lookUpData.startDate == null ||
        lookUpData.endDate === undefined ||
        lookUpData.endDate === '' ||
        lookUpData.endDate == null ||
        (lookUpData.inpatientB != 0 && lookUpData.inpatientB != 1)
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case CONDITION_CODE_LKP:
      if (
        lookUpData.condCode == undefined ||
        lookUpData.condCode == '' ||
        lookUpData.condDesc == undefined ||
        lookUpData.condDesc == '' ||
        lookUpData.startDate == undefined ||
        lookUpData.startDate == '' ||
        lookUpData.startDate == null ||
        lookUpData.endDate == undefined ||
        lookUpData.endDate == '' ||
        lookUpData.endDate == null
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case MOD_LKP:
      if (
        lookUpData.cptMod == undefined ||
        lookUpData.cptMod == '' ||
        lookUpData.description == undefined ||
        lookUpData.description == '' ||
        lookUpData.startDate == undefined ||
        lookUpData.startDate == '' ||
        lookUpData.startDate == null ||
        lookUpData.endDate == undefined ||
        lookUpData.endDate == '' ||
        lookUpData.endDate == null ||
        (lookUpData.ambulanceModB != 0 && lookUpData.ambulanceModB != 1) ||
        (lookUpData.isCci != 0 && lookUpData.isCci != 1) ||
        (lookUpData.is_59_group != 0 && lookUpData.is_59_group != 1)
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case POLICY_CATEGORY_LKP:
      if (
        lookUpData.policyCategoryDesc == undefined ||
        lookUpData.policyCategoryDesc == '' ||
        lookUpData.priority == undefined ||
        lookUpData.priority?.length == 0 ||
        lookUpData.lastUpdatedAt == undefined ||
        lookUpData.lastUpdatedAt == '' ||
        lookUpData.lastUpdatedAt == null
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case POS_LKP:
      if (
        lookUpData.posCode == undefined ||
        lookUpData.posCode == '' ||
        lookUpData.posDesc == undefined ||
        lookUpData.posDesc == '' ||
        lookUpData.posName == undefined ||
        lookUpData.posName == '' ||
        (lookUpData.facilityB != 0 && lookUpData.facilityB != 1)
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case REASON_CODE_LKP:
      if (
        lookUpData.reasonCode == undefined ||
        lookUpData.reasonCode == '' ||
        lookUpData.reasonDesc == undefined ||
        lookUpData.reasonDesc == '' ||
        lookUpData.challengeCode == undefined ||
        lookUpData.challengeCode == '' ||
        lookUpData.pcoCode == undefined ||
        lookUpData.pcoCode == '' ||
        lookUpData.hipaaCode == undefined ||
        lookUpData.hipaaCode == '' ||
        lookUpData.hippaDesc == undefined ||
        lookUpData.hippaDesc == '' ||
        (lookUpData.deactivatedb != 0 && lookUpData.deactivatedb != 1) ||
        (lookUpData.customb != 0 && lookUpData.customb != 1)
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case CCI_RATIONALE_LKP:
      if (
        lookUpData.cciRationaleKey == undefined ||
        lookUpData.cciRationaleKey == '' ||
        lookUpData.cmsCciRationale == undefined ||
        lookUpData.cmsCciRationale == '' ||
        lookUpData.cciRationaleDesc == undefined ||
        lookUpData.cciRationaleDesc == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case CCI_LKP:
      if (
        lookUpData.cciKey == undefined ||
        lookUpData.cciKey == '' ||
        lookUpData.cciDesc == undefined ||
        lookUpData.cciDesc == '' ||
        lookUpData.cciNotes == undefined ||
        lookUpData.cciNotes == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case MUE_RATIONALE_LKP:
      if (
        lookUpData.mueRationalKey == undefined ||
        lookUpData.mueRationalKey == '' ||
        lookUpData.description == undefined ||
        lookUpData.description == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case BO_TYPE_LKP:
      if (
        lookUpData.boKey == undefined ||
        lookUpData.boKey == '' ||
        lookUpData.boDesc == undefined ||
        lookUpData.boDesc == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case BW_TYPE_LKP:
      if (
        lookUpData.bwTypeKey == undefined ||
        lookUpData.bwTypeKey == '' ||
        lookUpData.description == undefined ||
        lookUpData.description == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case MAX_UNITS_TYPES:
      if (
        lookUpData.maxUnitsTypeKey == undefined ||
        lookUpData.maxUnitsTypeKey == '' ||
        lookUpData.maxUnitsTypeDesc == undefined ||
        lookUpData.maxUnitsTypeDesc == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
    case MAX_UNITS_LKP:
      if (
        lookUpData.maxUnitsTypeKey == undefined ||
        lookUpData.maxUnitsTypeKey == '' ||
        lookUpData.description == undefined ||
        lookUpData.description == '' ||
        lookUpData.maxUnitsLkpKey == undefined ||
        lookUpData.maxUnitsLkpKey == '' ||
        lookUpData.comments == undefined ||
        lookUpData.comments == ''
      ) {
        error = true;
      } else {
        error = false;
      }
      break;
  }

  return error;
}
