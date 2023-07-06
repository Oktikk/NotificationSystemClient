import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { v4 as uuid} from 'uuid';
import { MessagingService } from './messaging.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NotificationSystemClient';
  message: any;
  clients : any;
  constructor(private httpService : HttpService, private messagingService : MessagingService) {
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


    this.messagingService.requestPermission();
    this.messagingService.receiveMessaging();
  }

  changeTrayIcon(success : boolean){
    window.ipcRenderer.send('change-tray-icon', success);
  }
}