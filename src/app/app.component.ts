import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { v4 as uuid} from 'uuid';


import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NotificationSystemClient';
  message: any;
  clients : any;
  constructor(private httpService : HttpService) {
  }

  ngOnInit(){
    const guid = uuid();
    this.httpService.connect(guid).subscribe({
      next: (v) => {
        this.changeTrayIcon(true);
        console.log(guid)
      },
      error: (e) => {
        this.changeTrayIcon(false);
        console.log(e)
      }
    });

    


    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .then(function(registration) {
          console.log('Registration successful, scope is:', registration.scope);


          const messaging = getMessaging();
          getToken(messaging, 
          { vapidKey: environment.firebase.vapidKey}).then(
            (currentToken) => {
            if (currentToken) {
              console.log("Hurraaa!!! we got the token.....");
              console.log(currentToken);
            } else {
              console.log('No registration token available. Request permission to generate one.');
              }  
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });



        }).catch(function(err) {
          console.log('Service worker registration failed, error:', err);
        });
    }
    
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }

  // requestPermission() {
  //   const messaging = getMessaging();
  //   getToken(messaging, 
  //    { vapidKey: environment.firebase.vapidKey}).then(
  //      (currentToken) => {
  //        if (currentToken) {
  //          console.log("Hurraaa!!! we got the token.....");
  //          console.log(currentToken);
  //        } else {
  //          console.log('No registration token available. Request permission to generate one.');
  //        }
  //    }).catch((err) => {
  //       console.log('An error occurred while retrieving token. ', err);
  //   });
  // }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.message=payload;
  //   });
  // }

  changeTrayIcon(success : boolean){
    window.ipcRenderer.send('change-tray-icon', success);
  }
}