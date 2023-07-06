import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  message: any;

  constructor() { }

  requestPermission(){
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service worker registered:", registration);
          const messaging = getMessaging();
          getToken(messaging, 
          { vapidKey: environment.firebase.vapidKey}).then(
            (currentToken) => {
            if (currentToken) {
              console.log("Got token: ");
              console.log(currentToken);
            } else {
              console.log('No registration token available. Request permission to generate one.');
              }  
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });


        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }

  receiveMessaging(){
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }
}
