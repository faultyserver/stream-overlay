import { ApiClient } from "twitch";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import { DirectConnectionAdapter, EventSubListener } from "twitch-eventsub";

const clientId = "b138eemzacv03igu3v2oghh5ynnwhz";
const clientSecret = "f8028did8rt1bopt9fkteexo2zfeqh";

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubListener(
  apiClient,
  new DirectConnectionAdapter({
    hostName: "example.com",
    sslCert: {
      key: "aaaaaaaaaaaaaaa",
      cert: "bbbbbbbbbbbbbbb",
    },
  }),
  "thisShouldBeARandomlyGeneratedFixedString",
);
await listener.listen();
