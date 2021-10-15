import * as React from "react";

import SpotifyAPIClient from "../../spotify-api/SpotifyAPIClient";
import useSpotifyStore, { setSpotifyPlayerState } from "./SpotifyStore";

const SPOTIFY_REFRESH_INTERVAL = 5000;

export default function SpotifyProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let intervalId: number | undefined;
    (async () => {
      const response = await fetch("http://localhost:32556/api/spotify-token");
      const { access_token } = await response.json();
      SpotifyAPIClient.setAuthToken(access_token);

      SpotifyAPIClient.setAuthTokenGetter(async () => {
        const response = await fetch("http://localhost:32556/oauth/refresh", { method: "POST" });
        const { access_token } = await response.json();
        return access_token;
      });

      const getter = async () => {
        const response = await SpotifyAPIClient.getPlayerState();
        setSpotifyPlayerState(response);
      };

      getter();
      intervalId = window.setInterval(getter, SPOTIFY_REFRESH_INTERVAL);
    })();

    return () => window.clearInterval(intervalId);
  }, []);

  React.useEffect(() => {}, []);

  return <>{children}</>;
}
