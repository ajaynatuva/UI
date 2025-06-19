export const environment = {
    prod:true ,
    ipu_data_crawler_host:'/data-crawler-service/dataCrawler',
    ipu_policy_config_host:'/ipu-policy-service/policyConfig',
    ipu_data_curation_host:'/data-curation-service/dataCurationETL',
    ipu_policy_engine_host:'/ipu-policy-engine-service/policyEngine',
    ipu_email_host: '/ipu-email-service/ipuEmailService',


    isProd: !(window.location.href.indexOf("dev") > -1) &&
    !(window.location.href.indexOf("qa") > -1) &&
    !(window.location.href.indexOf("uat") > -1) &&
    !(window.location.href.indexOf("localhost") > -1) &&
    !(window.location.href.indexOf("cm") > -1)?0:1
};
