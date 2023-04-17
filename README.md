# Auto-greeting bot

A sample application that you can connect to your account on Paxful so it would greet customers when a new trade
is started upon one of your offers.

Use it at your own risk!

## Running App

1. Create an offer on Paxful (if you don't have one yet)
2. Update `.env` file (at very least set `PAXFUL_API_SECRET` and `OFFER_HASHES`)
3. Run `npm i` to install dependencies
4. Deploy the app somewhere OR use `ngrok` (for ngrok howto see below). As a result you should have a publicly
   accessible URL
5. Run `node app.js` to start the application
6. Create webhook for `trade.started` event (scroll to the bottom of
   [Direct access section](https://developers.paxful.com/dashboard/direct-access)). For target URL use one that you
   got in step 5), but append to it `/paxful/webhook` suffix. So if you had `https://example.com`, then when configuring
   webhooks you should set `https://example.com/paxful/webhook`

### Using ngrok

The application by default will be listening on http://localhost:3000, so if you haven't changed the port, then
once you have `ngrok` installed on your machine, you can run the following command to receive a publicly accessible
URL that you can use for registering as a webhook target on paxful.com:

```
ngrok http 3000
```