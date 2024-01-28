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
    accessToken: {
      secretKey:
        '&%#*gbD&*rcH*TAc9BA(sdugA&*Sct*^AS%578yr7A%SRc7AUSc(&GVcb(ACSS',
      expiresIn: '300s',
    },
    refreshToken: {
      secretKey:
        '(ASGf7b8n(ACa9hA_)Sd9UGBCSY9du0ADNU98aycn9yuHAIDUhcAIUHC*Ayd(A&cy9ycdY%^4f6%',
      expiresIn: '30d',
      expiresInMs: 30 * 24 * 60 * 60 * 1000,
    },
  },
  cors: {
    origin: [''],
  },
};
