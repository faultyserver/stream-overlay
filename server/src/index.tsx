import { ApiClient } from "twitch";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import { EventSubListener } from "twitch-eventsub";
import {NgrokAdapter} from 'twitch-eventsub-ngrok';
import {connect} from 'ngrok';

const clientId = "b138eemzacv03igu3v2oghh5ynnwhz";
const clientSecret = "f8028did8rt1bopt9fkteexo2zfeqh";
const accessToken = 'vurlvrvwmoy05ffmrlalh4p3yxgte9';
const USER_ID = "107608091";

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

async function getListener() {
  const listener = new EventSubListener(apiClient, new NgrokAdapter(), 'testinglocallydontmindme');
  console.log("about to listen")
  await listener.listen();
  return listener;
}


async function main() {
  const LISTENER = await getListener();

  console.log("listening");

  LISTENER.subscribeToChannelPredictionBeginEvents(USER_ID, (e) => {
    console.log(e);
  })

  console.log("subscribed")
}

connect({ addr: 3000 }).then(url => url.replace(/^https?:\/\/|\/$/, ''));

// main();
