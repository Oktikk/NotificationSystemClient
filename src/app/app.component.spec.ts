import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent, Notification } from './app.component';

describe('AppComponent', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [HttpClientTestingModule],
        })
    );

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'NotificationSystemClient'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('NotificationSystemClient');
    });

    it('should delete a notification when calling deleteNotification method', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        const notifications: Notification[] = [
          new Notification('Notification 1', 'Body 1'),
          new Notification('Notification 2', 'Body 2')
        ];
        app.notifications = notifications;
        const length = notifications.length;
        const event = {} as Event;
        const index = 0;
        const notification = notifications[index];

        app.deleteNotification(event, index);

        expect(app.notifications.length).toBe(length - 1);
        expect(app.notifications).not.toContain(notification);
      });
});
