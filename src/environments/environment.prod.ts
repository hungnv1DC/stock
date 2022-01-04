// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: '/api',
  envName: 'PROD',
  host: 'https://fakestoreapi.com',
  firebase: {
    apiKey: 'AIzaSyBewBx3sI8UKfBE9Y1vCdMJ85F-fqDMswQ',
    authDomain: 'angular-stock-1740f.firebaseapp.com',
    projectId: 'angular-stock-1740f',
    storageBucket: 'angular-stock-1740f.appspot.com',
    messagingSenderId: '728871156809',
    appId: '1:728871156809:web:148a31ba00dfef47125398',
    measurementId: 'G-DG38P3DP4V'
  }
};
