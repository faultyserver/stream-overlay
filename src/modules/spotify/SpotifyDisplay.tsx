import * as React from "react";
import { animated, useTransition, config } from "react-spring";

import useSpotifyStore from "./SpotifyStore";

import styles from "./SpotifyDisplay.mod.css";
import type { PlayerItem } from "../../spotify-api/APITypes";

function getArtists(track: PlayerItem) {
  const { artists } = track;
  return artists.map((artist) => artist.name).join(", ");
}

export default function SpotifyDisplay() {
  const state = useSpotifyStore((state) => state.playerState);
  const track = state?.item;

  const transition = useTransition(track, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 20 },
    trail: 100,
    config: config.slow,
  });

  if (track == null) return <h1>Not Playing</h1>;

  return (
    <div className={styles.positioner}>
      {transition(({ opacity, y }, item) => (
        <animated.div key={item!.id} className={styles.container} style={{ opacity, y }}>
          <img className={styles.artwork} src={item!.album.images[0].url} />
          <div className={styles.info}>
            <div className={styles.trackName}>{item!.name}</div>
            <div className={styles.artistName}>{getArtists(item!)}</div>
          </div>
        </animated.div>
      ))}
    </div>
  );
}
