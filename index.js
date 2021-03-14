const WebSocket = require('ws');
const messages = require('./messages');
const { from } = require('rxjs');
const { delay } = require('rxjs/operators');

const baseUrl = process.env.BASE_WS_URL || 'ws://localhost:3100/';
const chargerId = process.env.BASE_WS_URL || 'c1234';
const ws = new WebSocket(baseUrl + chargerId);

let subscription = null;

ws.on('open', function open() {
  subscriiption = from(messages[chargerId])
    .pipe(delay(2000))
    .subscribe((message) => {
      console.log(`[${chargerId}] Sending message ${JSON.stringify(message)} to ${baseUrl+chargerId}`);
      ws.send(JSON.stringify(message), (err) => {
        console.error(`[${chargerId}] Error sending message ${JSON.stringify(message)} to ${baseUrl+chargerId}: `, err);
      });
    })
});

ws.on('error', (error) => {
  console.error(`[${chargerId}] Websocket error: `, error);
  if (subscription) {
    subscription.unsubscribe();
  }
});

ws.on('close', () => {
  if (subscription) {
    subscription.unsubscribe();
  }
});


