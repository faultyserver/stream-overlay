export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Album {
  albumType: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  type: "album";
  uri: string;
}

export interface Artist {
  externalUrls: object;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface PlayerItem {
  album: Album;
  artists: Artist[];
  availableMarkets: string[];
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  externalIds: object;
  externalUrls: object;
  href: string;
  id: string;
  name: string;
  popularity: number;
  previewUrl: string;
  trackNumber: number;
  type: "track" | "episode";
  uri: string;
}

export interface Device {
  id: string;
  isActive: boolean;
  isRestricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface PlayerState {
  timestamp: number;
  device: Device;
  progressMs: number;
  isPlaying: boolean;
  currentlyPlayingType: "track" | "episode";
  item?: PlayerItem;
  shuffleState: boolean;
  repeatState: "off" | "on" | "one";
  context: object;
}
