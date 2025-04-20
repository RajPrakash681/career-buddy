import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_qHqrHjIlmP-6HEe1vkJ_JN0OKZMBdIo",
  authDomain: "careerbuddy-12263.firebaseapp.com",
  projectId: "careerbuddy-12263",
  storageBucket: "careerbuddy-12263.firebasestorage.app",
  messagingSenderId: "49794092682",
  appId: "1:49794092682:web:22b728444da441b49d6773",
  measurementId: "G-S1FN6C7MWL"
};

export const app = initializeApp(firebaseConfig);

// Initialize analytics only if supported and not blocked
export const analytics = (async () => {
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) {
      return getAnalytics(app);
    }
    console.log('Analytics not supported in this environment');
  } catch (e) {
    console.log('Analytics blocked or failed to load');
  }
  return null;
})();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
