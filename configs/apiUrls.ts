import { environment } from '../environments/environment';

export const policyConfigUrl = environment.ipu_policy_config_host;
export const dataCurationETL = environment.ipu_data_curation_host;
export const dataCrawler = environment.ipu_data_crawler_host;
export const policyengine = environment.ipu_policy_engine_host;
export const ipuUser = environment.ipu_user_host;
export const emailUrl = environment.ipu_email_host;

export const sharePointUrls = {
  // "https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%5FIPU%5FLOCAL%2FData%5FCuration%2FReference%20Templates%2FCCI%20Deviations%20Template&viewid=303e0f89%2D1795%2D4fa7%2Dafed%2D13c5bb4162a5";

  baseUrl:
    'https://advancedpricing.sharepoint.com/sites/AMPSIPU/Shared%20Documents/Forms/AllItems.aspx',
  referencePath: (env) =>
    `?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%5FIPU%5F${env}%2FData%5FCuration%2FReference%20Templates%2FCCI%20Deviations%20Template`,
  prodPath:
    '?newTargetListUrl=%2Fsites%2FAMPSIPU%2FShared%20Documents&viewpath=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FAMPSIPU%2FShared%20Documents%2FAMPS%20IPU%2FData%20Curation%2FReference%20Templates%2FCCI%20Deviations%20Template',
};

export const apiUrl = {
  // crawler service
  getCrawlerClass: '/lookUp/getCrawlerClassLookUp',
  getFrequency: '/lookUp/getFrequencyLookup',
  getConfig: '/crawlerConfig/getAllConfig',
  saveConfig: '/crawlerConfig/saveConfig',
  updateConfig: '/crawlerConfig/updateConfig',
  runCrawler: '/crawler/crawl',

  // user service
  updatePassword: '/users/updatePassword',
  userById: '/users/getUserById/',
  getUser: '/users/searchUser',
  removeNonExistingUser: '/users/updateNonExistingUser',
  getRoles: '/users/getRoles',
  getAllUser: '/users/getAllUsers',
  saveUser: '/users/saveUser',
  updateUser: '/users/updateUser',
  checkUser: '/users/validateUser',
  validateOtp: '/users/validate-otp',
  validateUserEmailId: '/users/validateEmail',
  ResendOtp: '/users/Resend-otp',
  // forgotPasswordResendOtp: '/users/forgot-password-resend-otp',
  getRoleByUser: '/users/getUserByRole',
  getRoleById: '/users/getRolesData',

  generateRbrvsReport1: '/dragonManual/generateRBRVSReport1',
  generateRbrvsReport2: '/dragonManual/generateRBRVSReport2',
  generateVaccinationCodes: '/dragonManual/generateVaccinationCodes',
  getTotalNumberOfRowsFromSource:
    '/search/getTotalNumberOfReferrentialDataRows',
  production: false,
  getChallengeCode: '/policy/challengeCode',
  searchClaim: '/searchClaim/searchClaimData',
  claimRunStatus: '/searchClaim/getClaimRunStatus',
  sendclaimdata: '/policy/runPoliciesOnTestClaim',
  refreshChallengeCache: '/policy/refreshChallengeCodeCache',
  refreshPolicyCache: '/policy/refreshPolicyCache',
  getMfsQuarter: '/mfs/Quarter',

  saveCustomPolicyData: '/newPolicy/saveCustomPolicyTabsData',

  searchPolicy: '/searchPolicy/policyData',
  getPolicyById: '/newPolicy/policy',
  getMedicalpolicy: '/newPolicy/medicalpolicy',
  getSubPolicy: '/newPolicy/subpolicies',
  getMedicalData: '/newPolicy/Medical',
  getProcs: '/procedures/procedures',
  getDiagnosis: '/Diagnosis/Totaldata',
  postDiagnosis: '/Diagnosis/postDiagnosis',
  editDiagnosis: '/Diagnosis/updateDiagnosis',
  updateHeaderLevelPdx: '/Diagnosis/update',
  deleteDiagnosis: '/Diagnosis/deleteDiagnosis',
  updateHeaderLevelPdxRow: '/Diagnosis/UpdateHeaderLevelPdxRow',
  getActionValue: '/Diagnosis/getActionName',

  getAction: '/procedures/action',
  getChanges: '/Changes/changes',
  getChangesId: '/Changes/GetChanges',
  getProps: '/newPolicy/properties',
  createDescription: '/newPolicy/desc',
  createChanges: '/Changes/savechanges',
  customChanges: '/Changes/saveCustomChanges',

  createProps: '/newPolicy/uploadprop',
  createProperties: '/newPolicy/prop',
  createnewPolicy: '/newPolicy/postNewPolicy',
  getLob: '/newPolicy/lob',
  getProductType: '/newPolicy/producttype',
  getproductData: '/newPolicy/product',
  getProcsById: '/procedures/procedureId',
  getClmLinkLkp: '/procedures/clmLinkLkp',
  getPoliyCptActionLkp: '/procedures/policyCptActionLkp',
  getValid: '/newPolicy/policyValidation',
  getChangesById: '/Changes/GetChangesById',
  testReport: '/newPolicy/policyNumber',
  getDxExcelData: '/Diagnosis/dxExportId',
  createTargetUrl: '/procedures/stagetotarget',
  updateNewPolicy: '/newPolicy/updateNewPolicies',
  updateChanges: '/Changes/updateChanges',
  createProcs: '/procedures/upload',
  saveDaiagnosis: '/Diagnosis/upload',
  postConfiguration: '/configvalidation/generateconfigreport',
  generateconfigreport: '/configvalidation/generateconfigreport',
  generateConfigValidationReportForSingleRule:
    '/configvalidation/generatereport',

  getProceduresData: '/procedures/searchProceduresData',

  //curation service

  // Target Load

  loadDataToTarget: '/targetLoad/loadDataToTarget',

  // loadCCIDataToTarget: '/cci/loadCCIToTarget', // not using
  // loadMaxUnitsDataToTarget: '/maxunits/loadMaxUnitsToTarget', // not using
  // loadIcdMasterAndDetailTarget: '/icd/loadIcdMasterAndDetailToTarget', // not using
  // loadIcdDetailTarget: '/icd/loadIcdDetailToTarget', // not using
  // HcpcsDetailTarget: '/loadHCPCSDetailToTarget', // not using
  // loadHcpcsDataToTarget: '/hcpcs/loadHCPCSMasterAndDetailToTarget', // not using
  // CptMasterAndDetailTarget: '/cpt/loadCptMasterAndDetailToTarget', // not using
  // icd10CmTarget: '/dragonManual/targetLoadICDCMd  ', // not using
  // rbRvsTargetLoad: '/dragonManual/targetLoadRBRVS ', // not using
  // icd10PCSTarget: '/dragonManual/targetLoadICDPCSd', // not using
  // loadMFSDataintoTarget: '/mfs', // not using
  // mfsTarget: '/loadMFSToTarget', // not using
  // loadMFSDateBIndedDataintoTarget: '/loadMFSDateBindedToTarget', // not using
  // loadAdhocintoTarget: '/adhoc', // not using
  // adhocTarget: '/loadAdhocToTarget', // not using
  // loadAddonDataintoTarget: '/addoncodes', // not using
  // loadOCEDataintoTarget: '/oce', // not using
  // addonTarget: '/loadADDONCODESToTarget', // not using
  // apcTarget: '/loadAPCToTarget', // not using
  // capcTarget: '/loadCAPCToTarget', // not using
  // hcpcsTarget: '/loadHCPCSToTarget', // not using
  // apcDateBindedDataIntoTarget: '/loadAPCDateBindedToTarget', // not using
  // capcDateBindedDataIntoTarget: '/loadCAPCDateBindedToTarget', // not using
  // hcpcsDateBindedDataIntoTarget: '/loadHCPCSDateBindedToTarget', // not using
  // loadGPCIDataIntoTarget: '/gpci', // not using
  // GPCITarget: '/loadGPCIToTarget', // not using
  // GPCIDateBindedTarget: '/loadGPCIDateBindedToTarget', // not using
  // loadZipDataIntoTarget: '/zipLoader', // not using
  // Zip5Target: '/loadZip5ToTarget', // not using
  // Zip9Target: '/loadZip9ToTarget', // not using
  // Zip5DateBindedTarget: '/loadZip5DateBindedToTarget', // not using
  // Zip9DateBindedTarget: '/loadZip9DateBindedToTarget', // not using
  // loadCptSameOrSimiliarCodes: '/cptSameOrSimilarCodes', // not using
  // loadCptSameOrSimCodeDataToTarget: '/loadCptSameOrSimCodes', // not using
  //  bwPairsTarget: '/loadBwPairsToTarget',// not using
  // loadBwPairsDataIntoTarget: '/bwPairs', // not using
  // loadModifierInteractionDataIntoTarget: '/modifierInteraction', // not using
  // ModifierInteractionTarget: '/loadModifierInteractionToTarget', // not using

  // Group Task and My Task
  groupTask: '/tasks/groupTask',
  TotalData: '/tasks/Totaldata',
  Delta: '/tasks/deltaTask',
  update: '/tasks/update',
  updateMyTask: '/tasks/updateMyTask',
  updateTaskStatus: '/tasks/updatetaskstatus',
  errorStatus: '/tasks/completedTask',
  myTask: '/tasks/email',
  getQuarter: '/lookUp/getQuarterName',
  getBwType: '/lookUp/BwLkp',

  
  uploadLookup: '/lookUp/upload',
  uploadManualFile: '/manual/uploadFile',
  uploadPolicyReportFile: '/Report/uploadData',
  getLastQuater: '/lookUp/sourceValue',
  getMaxUnitsLkpData: '/lookUp/getMaxUnitsLkp',
  getModifierIntractionLkpData: '/lookUp/getModifierIntractionLkp',
  getMaiLkpData: '/lookUp/getMaiLkp',
  getMueLkpData: '/lookUp/getMueLkp',
  getStates: '/lookUp/states',
  modiferPayPercentageKey: '/lookUp/getModifierPayPercent',

  // get referential data
  getReferentialDataDetails: '/referentialData/getReferentialDataDetails',
  exportReferentialDataDetails: '/referentialData/ExportReferentialDataDetails',
  viewClientSpecficCodesData:
    '/clientspecificcodes/clientSpecificCodesReferentialData',

  // versions
  getCurationVersion: '/lookUp/getCurationPOMVersion',
  getCrawlerVersion: '/lookUp/getCrawlerPOMVersion',
  getConfigVersion: '/lookUp/getConfigPOMVersion',
  getEngineVersion: '/policy/getEnginePOMVersion',
  getEmailVersion: '/email/getEmailPOMVersion',
  getUserVersion: '/users/getUserPOMVersion',




  //// policy service

   // look ups
   getLookUpData: '/lookUp/getLookUpData',
   postLookUpdata: '/lookUp/postLookUpData',

  //Rbrvs report componet
  uploadRBRVS: '/dragonManual/uploadRBRVS',
  uploadICD10CMD: '/dragonManual/uploadICD10CM',
  uploadICD10PCS: '/dragonManual/uploadICD10PCS',
  uploadVaccinationCodes: '/dragonManual/uploadVaccinationCodes',

  // new policy 
  getByDragonClaimId: '/policy/getitemizedBillLine',
  getPolicyClaim: '/policy/getPolicyClaim',
  getReferenceClaim: '/policy/getPolicyReferenceClaim',
  getReferenceDragonClaimId: '/policy/getReferenceitemizedBillLine',
  lobData: '/newPolicy/Lob',
  DetailsData: '/newPolicy/DetailsData',
  reasonTree: '/newPolicy/reasonCodeCount',
  policyIdFromReasonCode: '/newPolicy/policyId',
  getAddOnCodes: '/newPolicy/addOnCodes',
  getChangeModifier: '/newPolicy/changeModifier',
  getClaimType: '/newPolicy/claimType',
  getGender: '/newPolicy/gender',
  getNpi: '/newPolicy/npilink',
  getPosLink: '/newPolicy/posLink',
  getCptLink: '/newPolicy/cptLink',
  getRevenueCodeClaimLink: '/newPolicy/revenueCodeClaimLink',
  getTaxlink: '/newPolicy/taxlink',
  getPropSubSpec: '/newPolicy/taxonomy',

  // search componet
  searchClaimDataSize: '/searchClaim/searchClaimDataSize',

  // policy Display component
  filterSubPol: '/policyView/filterSubPol',
  filterReason: '/policyView/filterReason',
  filterdPolicies: '/policyView/filterPolicies',
  ExportPolicyView: '/policyView/exportPolicyData',
  uploadPolicyView: '/policyView/uploadFile',
  subPolicyTotal: '/policyView/subPolicyData',
  reasonTotal: '/policyView/reasonCodeData',
  policyTotalData: '/policyView/totalPolicyData',
  usedCat: '/policyView/categoryData',
  policyViewData: '/policyView/policyViewData',
  medicalTotal: '/policyView/medical',
  subTotal: '/policyView',

  // client policy exclusions
  policyExclusion: '/clientPolicyExclusion/policyExclusion',
  clientExclusion: '/clientPolicyExclusion/clientExclusion',
  clientPolicyExcluison: '/clientPolicyExclusion/clientPolicyData',
  postClientPolicyExclusion: '/clientPolicyExclusion/saveExclusion',
  deleteClientPolicyExclusion: '/clientPolicyExclusion/deleteExclusion',

  //new client set up
  saveNewClientSetUpData: '/clientAssignment/saveNewClientData',
  getTotalClientAssignmentData: '/clientAssignment/clientAssignmentData',
  getClientAssignmentPolicyIds: '/clientAssignment/clientAssignmentPolicyIds',

  // Bill Type tab
  getBillTypeKey: '/BillType/getBillTypeLinkLkp',
  getPolicyBillType: '/BillType/BillTypeData',
  getSourceBillTypeLkpData: '/BillType/getBillTypeLookUpData',
  postBillTypeData: '/BillType/postBillType',
  deleteBillTypeData: '/BillType/deleteData',
  updateBillTypeFk: '/BillType/updatebilltypefk',
  totalPolicyBillType: '/BillType/totalbilltypedata',
  getPolicyBillTypeActionLkp: '/BillType/getpolicybilltypeactionlkp',
  updateBillTypeAction: '/BillType/updatebilltypeaction',
  saveBillType: '/BillType/upload',

  // condition tab
  getConditionTypeData: '/condition/actionLookUp',
  getPolicyConditionType: '/condition/conditionTypeData',
  postConditionTypeData: '/condition/postConditionType',
  deleteConditionTypeData: '/condition/deleteData',

  // client assignment tab
  postClientAssignmentData: '/clientAssignment/postClientAssignment',
  editClientAssignmentData: '/clientAssignment/editClientAssignment',
  deleteClientAssignmentData: '/clientAssignment/deleteClientAssignment',
  activeClients: '/clientAssignment/getActiveClientGroups',
  activeClientsNotHp: '/clientAssignment/getActiveClientGroupsNotHp',
  clientAssignmet: '/clientAssignment/getClientAssignmentData',

  // taxonomy tab
  getTaxonomy: '/taxonomy/taxonomyData',
  deleteTaxonomy: '/taxonomy/delete',
  disableTaxonomy: '/taxonomy/disable',
  saveTaxonomy: '/taxonomy/save',
  uploadTaxonomy: '/taxonomy/upload',
  TargetTaxonomy: '/taxonomy/stagetotarget',

  // tax id tab
  getTaxIdDetails: '/taxId/getTaxIdByPolicyId',
  uploadTaxIdFile: '/taxId/uploadTaxIdDataToStage',
  saveTaxId: '/taxId/saveTaxIdDetails',
  DeactivateTaxIdData: '/taxId/deleteTaxIdById',
  TargetTaxIdData: '/taxId/saveTaxIdDataToTarget',

  // npi tab
  getNPIDetails: '/npi/getNpiByPolicyId',
  saveNPI: '/npi/saveNpiDetails',
  DeactivateNPIData: '/npi/deleteNpiById',
  uploadNPIFile: '/npi/uploadNpiDataToStage',
  TargetNPIData: '/npi/saveNpiDataToTarget',

  updateDiagHeaders : '/Diagnosis/updateDiagHeaders',
};
