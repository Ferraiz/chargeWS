const WebSocket = require('ws');
const messages = require('./messages');
const { from, of } = require('rxjs');
const { delay, concatMap } = require('rxjs/operators');

const baseUrl = process.env.BASE_WS_URL || 'ws://localhost:3100/chargers/';
const chargerId = process.env.CHARGE_ID || 'c1234';
const ws = new WebSocket(baseUrl + chargerId);

let subscription = null;

ws.on('open', function open() {
  console.log(`[${chargerId}] Connected to the server`);
  
  subscriiption = from(messages[chargerId])
    .pipe(
      concatMap((message) => of(message).pipe(delay(2000)))
    )
    .subscribe(
      (message) => {
        console.log(`[${chargerId}] Sending message ${JSON.stringify(message)} to ${baseUrl+chargerId}`);
        ws.send(JSON.stringify(message), (err) => {
          if (err) {
            console.error(`[${chargerId}] Error sending message ${JSON.stringify(message)} to ${baseUrl+chargerId}: `, err);
            ws.terminate();
          }
        });
      }
    )
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


