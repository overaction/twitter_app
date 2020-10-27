import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: 'AIzaSyApNZk0szV5LQSN50Kfnww2r7ZY0UH9068',
    authDomain: 'twitter-clone-a9244.firebaseapp.com',
    databaseURL: 'https://twitter-clone-a9244.firebaseio.com',
    projectId: 'twitter-clone-a9244',
    storageBucket: 'twitter-clone-a9244.appspot.com',
    messagingSenderId: '827746365789',
    appId: '1:827746365789:web:5d90ec10e732c1300538b4',
};

export default firebase.initializeApp(firebaseConfig);