import * as fireabase from 'firebase/app';
import 'firebase/firestore';

// copy your firebase config & paste to config.json
const firebaseConfig = require('./config.json');
fireabase.initializeApp(firebaseConfig);


export const firestore = fireabase.firestore();
export default fireabase;
