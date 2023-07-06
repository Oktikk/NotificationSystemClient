importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCUvNUz0jAbl7Czpeeh41lz_MNGV0w98MU",
  authDomain: "notificationsystem-ac801.firebaseapp.com",
  projectId: "notificationsystem-ac801",
  storageBucket: "notificationsystem-ac801.appspot.com",
  messagingSenderId: "682465560611",
  appId: "1:682465560611:web:986be723b8ae7c60b10996",
  measurementId: "G-LP6GCE3WD5"
});

const messaging = firebase.messaging();