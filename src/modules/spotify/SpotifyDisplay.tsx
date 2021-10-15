import * as React from "react";
import useSpotifyStore from "./SpotifyStore";

import styles from "./SpotifyDisplay.mod.css";
import { PlayerItem } from "../../spotify-api/APITypes";

function getArtists(track: PlayerItem) {
  const { artists } = track;
  return artists.map((artist) => artist.name).join(", ");
}

export default function SpotifyDisplay() {
  const state = useSpotifyStore((state) => state.playerState);
  const track = state?.item;

  if (track == null) return <h1>Not Playing</h1>;

  return (
    <div className={styles.container}>
      <img className={styles.artwork} src={track.album.images[0].url} />
      <div className={styles.info}>
        <div className={styles.trackName}>{track.name}</div>
        <div className={styles.artistName}>{getArtists(track)}</div>
      </div>
    </div>
  );
}
