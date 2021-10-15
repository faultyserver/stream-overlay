import { Client } from "tmi.js";

const twitchClient = new Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "justinfan255",
    password: "",
  },
  channels: ["amfaulty"],
});

twitchClient.connect().catch(console.error);
twitchClient.on("message", (channel, tags, message, self) => {
  console.log(channel, tags, message, self);
});
