import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpService } from './http.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NotificationSystemClient';
  notifications : Notification[] = [];

  constructor(private httpService : HttpService, private changeDetection : ChangeDetectorRef) {
  }

  ngOnInit(){
    window.ipcRenderer.on('token-send', (event, token) =>{
      this.sendTokenToDatabase(token);
    })

    window.ipcRenderer.on('notification-received', (event, title, body) =>{
      const notification = new Notification(title, body);
      this.notifications.push(notification);
      this.changeDetection.detectChanges();
    })
  }

  sendTokenToDatabase(token : string){
    this.httpService.connect(token).subscribe({
      next: () => {
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

export class Notification{
  title : string = '';
  body : string = '';

  constructor(title : string, body : string){
    this.title = title;
    this.body = body;
  }
}