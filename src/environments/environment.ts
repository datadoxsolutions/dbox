// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
declare const require: any;
export const environment = {
  production: true,
  api_endpoint: 'http://65.2.162.230:8080/',
  restapi_endpoint: 'http://rest-admin@test:103.233.25.218:8080/',
  version: require('../../package.json').version,
  appBaseUrl: 'http://65.2.162.230:8080/dbox'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
