import moment from 'moment';
import { PolicyConstants } from '../../../pages/NewPolicy/PolicyConst';
import {
  BILL_TYPE_FIELDS,
  CAT_FIELDS,
  CONDITION_CODE_FIELDS,
  DESCRIPTION_TAB_FIELDS,
  DETAILS_TAB_FIELDS,
  // NEW_POLICY_VALIDATION,
  POLICY_FIELDS,
  VALIDATE_NEW_POLICY,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { batch } from 'react-redux';
import { batchDispatch } from '../../ApiCallAction/ApiCallAction';

export function processPolicyDetails(dispatch, response) {
  if (!response) return;

  const claimTypes = formatArray(response?.claimType);
  const productTypes = formatArray(response?.productTypeFk);
  const policyCategoryId = response?.policyCategoryLkpIdFk?.policyCategoryLkpId;

  const mappedValues = mapPolicyCategoryValues(policyCategoryId, response);

  const newPolicyFields = getNewPolicyFields(response);
  const descPolicyFields = getDescPolicyFields(response, productTypes);
  const detailsPolicyFields = getDetailsPolicyFields(response);
  const categoryPolicyFields = getCategoryPolicyFields(response, mappedValues);
  // const changesTab = getChangesTab(response);
  const billTypeTab = getBillTypeTab(response);
  const conditionCodeTab = getConditionCodeTab(response);
  const actions = [
    { type: POLICY_FIELDS, payload: newPolicyFields },
    { type: DESCRIPTION_TAB_FIELDS, payload: descPolicyFields },
    { type: DETAILS_TAB_FIELDS, payload: detailsPolicyFields },
    { type: CAT_FIELDS, payload: categoryPolicyFields },
    { type: CONDITION_CODE_FIELDS, payload: conditionCodeTab },
    { type: BILL_TYPE_FIELDS, payload: billTypeTab },
  ];
  // batch(() => {
  //   batchTabActions.forEach((action) => dispatch(action));
  // });
      batchDispatch(dispatch,actions);
  
  return response;
}

function getNewPolicyFields(response) {
  return {
    policyId: response?.policyId || 0,
    policyNumber: response?.policyNumber ,
    version: response?.policyVersion ,
    custom: response?.custom,
    clonedPolicyId: response?.clonedPolicyId ,
    clonedPolVer: response?.clonedPolVer ,
    catCode: response?.policyCategoryLkpIdFk?.policyCategoryLkpId ,
    catCodeCheck: response?.catCodeCheck ,
    reasonCode: response?.reasonCodeFk?.reasonCode ,
    reasonCodeCheck: response?.reasonCodeCheck ,
    medicalCodeCheck: response?.medicalCodeCheck ,
    medicalPolicyCode:
      response?.medicalPolicyKeyFK?.medicalPolicyKey ,
    subCodeCheck: response?.subCodeCheck ,
    subPolicyCode: response?.subPolicyKeyFK?.subPolicyKey ,
    reference: response?.reference || '',
    claimType: formatArray(response?.claimType) || [],
    prod: response?.isProdb || 0,
    deactivated: response?.deactivated || 0,
    disabled: response?.disabled || 0,
    policyDescription: response?.policyDesc || '',
  };
}

function getDescPolicyFields(response, productTypes) {
  return {
    productType: productTypes,
    lob: createLabelValue(response?.lobFk?.lobTitle, response?.lobFk?.lobKey),
    notes: response?.notes || '',
    policySummary: response?.summary || '',
    policyExplanation: response?.explanation || '',
    referenceSourceDescription: response?.refSourceDesc || '',
    referenceSourceTitleDesc: response?.refSourceTitle || '',
    sourceIndicator: response?.sourceIndicator || '',
  };
}

function getDetailsPolicyFields(response) {
  return {
    createdDate: response?.createdDate,
    gender: createLabelValue(
      response?.genderCode?.genderDesc,
      response?.genderCode?.genderCode
    ),
    npi: createLabelValue(
      response?.npiLogicFk?.description,
      response?.npiLogicFk?.npiLinkLkpKey
    ),
    taxonomy: createLabelValue(
      response?.taxonomyLogicFk?.description,
      response?.taxonomyLogicFk?.taxonomyLinkLkpKey
    ),
    revenueCodeClaimLink: createLabelValue(
      response?.revenueCodeClaimLinkFk?.description,
      response?.revenueCodeClaimLinkFk?.revenueCodeClaimLinkKey
    ),
    cptLink: createLabelValue(
      response?.cptLinkFk?.description,
      response?.cptLinkFk?.cptLinkLkpKey
    ),
    enforceBeforeCategory: response?.enforceBeforeCategory,
    enforceCategoryDesc: response?.enforceCategoryDesc,
    enfoCatCheck: response?.enfoCatCheck,
    priority: response?.priority,
    procedureMinAge: response?.minAgeFk?.minMaxAgeLkpId ,
    procedureMaxAge: response?.maxAgeFk?.minMaxAgeLkpId ,
    taxId: createLabelValue(
      response?.taxLogicFk?.description,
      response?.taxLogicFk?.taxLinkLkpKey
    ),
    posLink: createLabelValue(
      response?.posLinkFk?.description,
      response?.posLinkFk?.posLinkLkpKey
    ),
    claimTypeLink: createLabelValue(
      response?.claimTypeLinkFk?.description,
      response?.claimTypeLinkFk?.claimTypeLinkLkpKey
    ),
    ncciModifierB: response?.ncciB || 0,
    Modifier59GroupB: response?.group59B || 0,
    ASGroupB: response?.asGroupB || 0,
    tc26ModB: response?.tc26ModB || 0,
    referZeroChargeLine: response?.referZeroChargeLine,
    referenceClaimType: response?.referenceClaimType,
  };
}

function getCategoryPolicyFields(response, mappedValues) {
  return {
    // ranking: response?.co3Value,
    // payment: response?.co4Value,
    duration: shouldClearDuration(response) ? '' : response?.co2Value,
    frequency: shouldClearDuration(response) ? response?.co2Value : 'RD',
    durationDropdown: shouldClearDuration(response)
      ? undefined
      : createLabelValue(
          response?.co2Value?.replace(/[0-9]/g, ''),
          response?.co2Value?.replace(/[0-9]/g, '')
        ),
    modIntractionType: response?.modIntractionType,
    byPassMod: response?.byPassMod,
    ...mappedValues,
  };
}

function getBillTypeTab(response) {
  return {
    billTypeLink: createLabelValue(
      response?.billTypeLinkFk?.billTypeCode +
        ' - ' +
        response?.billTypeLinkFk?.billTypeLinkDesc,
      response?.billTypeLinkFk?.billTypeLinkKey
    ),
    billTypeAction: createLabelValue(
      response?.billTypeActionFk?.policyBillTypeActionCode,
      response?.billTypeActionFk?.policyBillTypeActionKey
    ),
  };
}

function getConditionCodeTab(response) {
  return {
    conditionCodeAction: createLabelValue(
      response?.conditionCodeActionFk?.conditionCode,
      response?.conditionCodeActionFk?.condCodeKey
    ),
    conditionTabTableData: response?.conditionTabTableData || [],
    postConditionTypeData: response?.postConditionTypeData || null,
  };
}

function shouldClearDuration(response) {
  return (
    response?.policyCategoryLkpIdFk?.policyCategoryLkpId === 32 &&
    (response?.co2Value === 'CM' || response?.co2Value === 'CY')
  );
}
function formatArray(stringValue) {
  return stringValue
    ? stringValue.split(',').map((item) => ({ label: item, value: item }))
    : [];
}

function createLabelValue(label, value) {
  return label !== undefined && value !== undefined && value !== null
    ? { label, value }
    : {};
}
function mapPolicyCategoryValues(categoryId, data) {
  const mappings = {
    [PolicyConstants.TWENTY_THREE]: { ccikey: data?.co1Value },
    [PolicyConstants.THIRTY_EIGHT]: { billedWith: data?.co1Value },
    [PolicyConstants.TWELVE]: { selectedType: data?.co1Value },
    [PolicyConstants.TWENTY_FIVE]: { bwTypeKey: data?.co1Value },
    [PolicyConstants.TWENTY]: { changeModifierKey: data?.co1Value },
    [PolicyConstants.THIRTY_FIVE]: { maxUnitsType: data?.co1Value },
    [PolicyConstants.FOURTY_FIVE]: { modifierPayPercentage: data?.co1Value },
    [PolicyConstants.FOURTY_SIX]: { modifierPayPercentage: data?.co1Value },
    [PolicyConstants.THIRTY_TWO]: { units: data?.co1Value },
    [PolicyConstants.FOURTY_NINE]: { modifierPriority: data?.co1Value },
  };
  return mappings[categoryId] || {};
}

export function mapAndSort(arr) {
  return (
    arr
      ?.map((c) => c.value)
      .sort()
      .join(',') || ''
  );
}
function createdDateForNewPolicy(formState, edit) {
  let date = null;
  if (formState.policyFields?.custom === 1 || !edit) {
    date = null;
  } else {
    date = formState.detailsTabFields.createdDate;
  }
  return date;
}

export function createPolicyObject(
  allStates,
  claimTypeMerge,
  clientgroupType,
  edit,
  policyCreateState,
  forClientTabPolicyId
) {
  const updatedDate = moment(new Date()).format('YYYY-MM-DD');
  return {
    //policyFields
    claimType: claimTypeMerge,
    createdBy: 'string',
    policyCategoryLkpId: allStates.policyFields.catCode,
    policyId: edit ? allStates.policyFields.policyId : '',
    policyNumber: edit ? allStates.policyFields.policyNumber : '',
    policyVersion: edit
      ? allStates.policyFields.version
        ? allStates.policyFields.version
        : 0
      : 0,
    custom: allStates.policyFields?.custom ? 1 : 0,
    clonedPolicyId: allStates.policyFields.clonedPolicyId
      ? allStates.policyFields.clonedPolicyId
      : '',
    forClientTabPolicyId: edit ? '' : forClientTabPolicyId,
    createdDate: createdDateForNewPolicy(allStates, edit),
    deactivated: allStates.policyFields.deactivated ? 1 : 0,
    disabled: allStates.policyFields.disabled ? 1 : 0,
    isProdb: allStates.policyFields.prod ? 1 : 0,
    reasonCodeFk: allStates.policyFields.reasonCode,
    medicalPolicyKey: allStates.policyFields.medicalPolicyCode,
    subPolicyKey: allStates.policyFields.subPolicyCode,
    policyDesc: allStates.policyFields.policyDescription,
    reference: allStates.policyFields.reference,

    //descTabFields
    notes: allStates.descTabFields.notes,
    explanation: allStates.descTabFields.policyExplanation,
    lobFk: allStates.descTabFields.lob?.value,
    productTypeFk: clientgroupType,
    refSourceDesc: allStates.descTabFields.referenceSourceDescription,
    refSourceTitle: allStates.descTabFields.referenceSourceTitleDesc,
    sourceIndicator: allStates.descTabFields.sourceIndicator,
    summary: allStates.descTabFields.policySummary,

    //detailTabFields
    ncciB: allStates.detailsTabFields.ncciB ? 1 : 0,
    group59B: allStates.detailsTabFields.group59B ? 1 : 0,
    asGroupB: allStates.detailsTabFields.asGroupB ? 1 : 0,
    referenceClaimType: allStates.detailsTabFields.referenceClaimType,
    referZeroChargeLine: allStates.detailsTabFields.referZeroChargeLine,
    tc26ModB: allStates.detailsTabFields.tc26ModB ? 1 : 0,
    enforceBeforeCategory: allStates.detailsTabFields.enforceBeforeCategory,
    genderCode: allStates.detailsTabFields.gender?.value,
    maxAgeFk: allStates.detailsTabFields.procedureMaxAge,
    minAgeFk: allStates.detailsTabFields.procedureMinAge,
    npiLogicFk: allStates.detailsTabFields.npi?.value,
    posLinkFk: allStates.detailsTabFields.posLink?.value,
    cptLinkFk: allStates.detailsTabFields.cptLink?.value,
    revenueCodeClaimLinkFk:
      allStates.detailsTabFields.revenueCodeClaimLink?.value,
    priority: allStates.detailsTabFields.priority,
    taxonomyLogicFk: allStates.detailsTabFields.taxonomy?.value,
    taxLogicFk: allStates.detailsTabFields.taxId?.value,
    claimTypeLinkFk: allStates.detailsTabFields.claimTypeLink?.value,

    //catTabFields
    co1Value: getCciOrAddoN(allStates),
    co2Value: getCol2(allStates),
    co3Value:
      allStates.policyFields.catCode === PolicyConstants.TWENTY_THREE
        ? allStates.catTabFields.mutuallyExclusive
        : getCol3(allStates),
    co4Value:
      allStates.policyFields.catCode === PolicyConstants.TWENTY_THREE
        ? allStates.catTabFields.denyType
        : getCol4(allStates),
    updatedBy: '',
    updatedOn: updatedDate,
    //billTabFields
    billTypeLinkFk:
      allStates.billTypeTabFields.billTypeLink === '' ||
      allStates.billTypeTabFields.billTypeLink === undefined
        ? 0
        : allStates.billTypeTabFields.billTypeLink?.value,
    billTypeActionFk:
      allStates.billTypeTabFields.billTypeAction === '' ||
      allStates.billTypeTabFields.billTypeAction === undefined
        ? 0
        : allStates.billTypeTabFields.billTypeAction?.value,
    //conditionTabFields
    conditionCodeActionFk:
      allStates.conditonTabFields.conditionCodeAction === undefined
        ? 0
        : allStates.conditonTabFields.conditionCodeAction?.value,
    addAllActiveClients: edit ? '' : policyCreateState.addAllActiveClients,

    //TaxonomyListData
    taxonomyList:allStates.taxonomyList
  };
}

function getCciOrAddoN(formState,) {
  switch (formState.policyFields.catCode) {
    case PolicyConstants.TWENTY_THREE:
      return formState.catTabFields.ccikey;
    case PolicyConstants.THIRTY_EIGHT:
      return formState.catTabFields.billedWith;
    case PolicyConstants.TWELVE:
      return formState.catTabFields.lineOrHeaderOrPrincipal;
    case PolicyConstants.TWENTY_FIVE:
      return formState.catTabFields.bwTypeKey === '' ||
        formState.catTabFields.bwTypeKey == null
        ? 1
        : formState.catTabFields.bwTypeKey;
    case PolicyConstants.THIRTY_FIVE:
      return formState.catTabFields.maxUnitsType;
    case PolicyConstants.TWENTY:
      return formState.catTabFields.changeModifierKey;
    case PolicyConstants.FOURTY_FIVE:
    case PolicyConstants.FOURTY_SIX:
      return formState.catTabFields.modifierPayPercentage;
      case PolicyConstants.FOURTY_NINE:
        return formState.catTabFields.modifierPriority;
    case PolicyConstants.THIRTY_TWO:
      return formState.catTabFields.units;
    default:
      return null;
  }
}

function getCol2(formState) {
  switch (formState.policyFields.catCode) {
    case PolicyConstants.TWENTY_THREE:
      return formState.catTabFields.byPassMod;
    case PolicyConstants.THIRTY_FIVE:
      return formState.catTabFields.modIntractionType;
    case PolicyConstants.THIRTY_TWO:
      return formState.catTabFields.frequency === PolicyConstants.ROLL_DURATION
        ? formState?.catTabFields.duration?.replace(/[a-zA-Z]/g, '') +
            formState?.catTabFields.durationDropdown?.value
        : formState.catTabFields.frequency;
    default:
      return null;
  }
}

function getCol3(formState) {
  switch (formState.policyFields.catCode) {
    case PolicyConstants.TWENTY_THREE:
      return formState.catTabFields.mutuallyExclusive;
    case PolicyConstants.THIRTY_TWO:
      return null;
    default:
      return null;
  }
}
function getCol4(formState) {
  switch (formState.policyFields.catCode) {
    case PolicyConstants.TWENTY_THREE:
      return formState.catTabFields.denyType;
    case PolicyConstants.THIRTY_TWO:
      return null;
    default:
      return null;
  }
}
