declare const require: any;
export const environment = {
  production: true,
  api_endpoint: 'http://65.2.162.230:8080/',
  restapi_endpoint: 'http://rest-admin@test:103.233.25.218:8080/',
  version: require('../../package.json').version,
  appBaseUrl: 'http://65.2.162.230:8080/dbox'
};
