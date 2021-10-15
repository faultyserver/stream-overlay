import HTTPUtils, { setAuth, HTTPResponse } from "./HTTPUtils";
import * as player from "./routes/player";

const RETRY_LIMIT = 3;

class SpotifyAPIClient {
  getAuthToken: () => Promise<string> = async () => {
    throw "No Token Getter was specified for SpotifyAPIClient";
  };

  /**
   * Directly set the access token for future requests.
   */
  setAuthToken(token: string) {
    setAuth(token);
  }

  /**
   * Set a method for requesting new access tokens when whatever current token
   * expires (when API requests return a 401 Unauthorized).
   */
  setAuthTokenGetter(getAuthToken: () => Promise<string>) {
    this.getAuthToken = getAuthToken;
  }

  private async _refreshToken() {
    setAuth(await this.getAuthToken());
  }

  /**
   * A wrapper for all API requests that takes care of refreshing the access token
   * when calls to the API start failing.
   */
  private async request<T>(
    action: () => Promise<HTTPResponse<T>>,
    depth: number = 0,
  ): Promise<T | undefined> {
    try {
      const response = await action();
      return response.json;
    } catch (response) {
      switch (response.status) {
        case 401:
          await this._refreshToken();
          if (depth < RETRY_LIMIT) {
            this.request(action, depth + 1);
          }
          break;
        case 429:
          console.log("Got rate limited:", response);
      }
    }
  }

  async getCurrentlyPlaying() {
    return this.request(player.getCurrentlyPlaying);
  }

  async getPlayerState() {
    return this.request(player.getPlayerState);
  }
}

export default new SpotifyAPIClient();
