import create from "zustand";

import type { PlayerState } from "../../spotify-api/APITypes";

type SpotifyStoreState = {
  playerState: PlayerState | undefined;
};

const useSpotifyStore = create<SpotifyStoreState>(() => ({
  playerState: undefined,
}));
export default useSpotifyStore;

export function setSpotifyPlayerState(playerState: PlayerState | undefined) {
  useSpotifyStore.setState({ playerState });
}
