import HTTPUtils from "../HTTPUtils";
import Endpoints from "../Endpoints";

import type { PlayerItem, PlayerState } from "../APITypes";

interface CurrentlyPlaying {
  context: object;
  actions: object;
  timestamp: number;
  progressMs: number;
  currentlyPlayingType: "track" | "episode";
  item: PlayerItem;
}

export async function getCurrentlyPlaying() {
  return await HTTPUtils.get<CurrentlyPlaying>(Endpoints.CURRENTLY_PLAYING);
}

export async function getPlayerState() {
  return await HTTPUtils.get<PlayerState>(Endpoints.PLAYER_STATE);
}
