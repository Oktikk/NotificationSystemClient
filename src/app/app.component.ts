import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpService } from './http.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NotificationSystemClient';
  notifications : any[] = [];
  constructor(private httpService : HttpService, private changeDetection : ChangeDetectorRef) {
  }

  ngOnInit(){
    window.ipcRenderer.on('get-fcm-token', (event, token) =>{
      this.sendTokenToDatabase(token);
    })
    window.ipcRenderer.on('notification-recieved', (event, notification) =>{
      this.notifications.push(notification);
      this.changeDetection.detectChanges();
    })
  }

  sendTokenToDatabase(token : string){
    this.httpService.connect(token).subscribe({
      next: (v) => {
        this.changeTrayIcon(true);
      },
      error: (e) => {
        this.changeTrayIcon(false);
        console.log(e)
      }
    });
  }

  changeTrayIcon(success : boolean){
    window.ipcRenderer.send('change-tray-icon', success);
  }

  deleteNotification(event, index){
    this.notifications.splice(index, 1);
    this.changeDetection.detectChanges();
  }
}