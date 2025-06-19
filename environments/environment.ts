// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  prod: false,
  ipu_data_curation_host:'http://localhost:8002/dataCurationETL',
  ipu_data_crawler_host:'http://localhost:8004/dataCrawler',
  ipu_policy_engine_host:'http://localhost:8012/policyEngine',
  ipu_policy_config_host :'http://localhost:8005/policyConfig',
  ipu_email_host:'http://localhost:8003/ipuEmailService',
  ipu_user_host:'http://localhost:8001/ipuUser',
  

  // ipu_data_crawler_host: '/data-crawler-service/dataCrawler',
  // ipu_policy_config_host: '/ipu-policy-service/policyConfig',
  // ipu_data_curation_host: '/data-curation-service/dataCurationETL',
  // ipu_policy_engine_host: '/ipu-policy-engine-service/policyEngine',
  // ipu_claim_retrieval_service_host:'/ipu-claim-retrieval-service/ipuClaimRetrieval',
  // ipu_claim_processing_service_host: '/ipu-claim-processing-service/ipuClaimProcessing',
  // ipu_user_host:'/ipu-user-service/ipuUser',
  // ipu_email_host: '/ipu-email-service/ipuEmailService',

  isProd:
    !(window.location.href.indexOf('dev') > -1) &&
    !(window.location.href.indexOf('qa') > -1) &&
    !(window.location.href.indexOf('uat') > -1) &&
    !(window.location.href.indexOf('localhost') > -1) &&
    !(window.location.href.indexOf('cm') > -1)
      ? 0
      : 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
