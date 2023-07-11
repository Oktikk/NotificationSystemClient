const { ipcRenderer } = require('electron')
const {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} = require('electron-push-receiver/src/constants')

ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('service successfully started', token);
  ipcRenderer.send('send-fcm-token', token);
})

ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error)
})

ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token)
})

ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
  if (serverNotificationPayload.notification.body) {
    let notification = new Notification(serverNotificationPayload.notification.title, {
      body: serverNotificationPayload.notification.body
    })

    let notif = {
      title: notification.title,
      body: notification.body
    }

    ipcRenderer.send('got-notification', notif);

    notification.onclick = () => {
      console.log('Notification clicked')
    }
  } else {
    console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
  }
})


const senderId = '682465560611'
console.log('starting service and registering a client')
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId)