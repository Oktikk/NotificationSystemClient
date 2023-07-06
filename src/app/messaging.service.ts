import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject<any>(null);

  constructor(private angularFireMessaging:AngularFireMessaging) { }

  requestPermission(){
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service worker registered:", registration);
          this.angularFireMessaging.requestToken.subscribe((token) =>{
            console.log(token);
          },(err)=>{
            console.log("TUTAJ JEST BŁĄD: ", err);
          })
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }

  receiveMessaging(){
    this.angularFireMessaging.messages.subscribe((payload)=>{
      console.log("New message", payload);
      this.currentMessage.next(payload);
    })
  }
}
