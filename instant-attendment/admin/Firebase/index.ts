import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: 'AIzaSyBYKfthwH9bxa6J0DmhXbxkV8s6v5pxCpE',
    authDomain: 'instant-service-9a6ca.firebaseapp.com',
    projectId: 'instant-service-9a6ca',
    storageBucket: 'instant-service-9a6ca.appspot.com',
    messagingSenderId: '448064199753',
    appId: '1:448064199753:web:2838ad69db62544decf398',
    measurementId: 'G-YVTNJTHQ74'
}

const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const db = getFirestore(app)
