export default {
  firebaseConfig: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  },
  jwt: {
    secretKey: '&%#*gbD&*rcH*TAc9BA(sdugA&*Sct*^AS%578yr7A%SRc7AUSc(&GVcb(ACSS',
    expiresIn: '300s',
  },
};
