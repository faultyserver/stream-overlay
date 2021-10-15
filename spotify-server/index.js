import axios from "axios";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { readUserConfig, writeUserConfig } from "./UserConfig.js";
import { CONFIG } from "./config/production.js";

const { HOSTNAME, PORT, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_CALLBACK_HOST } = CONFIG;
const BASE64_SPOTIFY_CREDENTIALS = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  "binary",
).toString("base64");

const app = express();

const [appName] = process.argv.slice(2);

const APP_PATH = "../public";
const USER_CONFIG_PATH = "./config/user_secrets.json";
let userConfig = readUserConfig("./config/user_secrets.json");

app.use(cors());
app.use(morgan("combined"));
app.use(express.static(APP_PATH));

app.get("/auth", function (req, res) {
  const scopes = "user-read-playback-state user-read-currently-playing";
  res.redirect(
    `https://accounts.spotify.com/authorize` +
      `?response_type=code` +
      `&client_id=${SPOTIFY_CLIENT_ID}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&redirect_uri=${encodeURIComponent(SPOTIFY_CALLBACK_HOST)}`,
  );
});

app.get("/oauth/callback", async function (req, res) {
  const { code } = req.query;

  const tokenResponse = await axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_CALLBACK_HOST,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    },
  }).catch((err) => console.log(err));

  userConfig = { ...userConfig, ...tokenResponse.data };
  writeUserConfig("./config/user_secrets.json", userConfig);

  res.type("json");
  res.send(JSON.stringify({ success: true }));
});

app.post("/oauth/refresh", async function (req, res) {
  const tokenResponse = await axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    params: {
      grant_type: "refresh_token",
      refresh_token: userConfig.refresh_token,
    },
    headers: {
      Authorization: `Basic ${BASE64_SPOTIFY_CREDENTIALS}`,
    },
  }).catch((err) => console.log(err));

  userConfig = { ...userConfig, ...tokenResponse.data };
  writeUserConfig("./config/user_secrets.json", userConfig);

  res.type("json");
  res.send(JSON.stringify({ access_token: userConfig.access_token }));
});

app.get("/api/spotify-token", function (req, res) {
  res.type("json");
  res.send(JSON.stringify({ access_token: userConfig.access_token }));
});

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: APP_PATH });
});

app.listen(PORT, HOSTNAME, function () {
  console.log(`App is running at ${HOSTNAME}: ${PORT}`);
});
