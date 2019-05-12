import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


// Replace this with your own config details
var config = {
  apiKey: "AIzaSyC1WA_TpfTgEMgKEiCCbcsRZ6OoEFPp75Y",
  authDomain: "fir-b8723.firebaseapp.com",
  databaseURL: "https://fir-b8723.firebaseio.com",
  projectId: "fir-b8723",
  storageBucket: "fir-b8723.appspot.com",
  messagingSenderId: "283441624933",
  appId: "1:283441624933:web:06f39427cdf83429"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase 