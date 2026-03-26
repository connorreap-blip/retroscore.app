export type CharCode = number;

/** 6x22 grid of character codes */
export type BoardState = CharCode[][];

export interface TilePosition {
  row: number;
  col: number;
}

export interface TileFlipState {
  position: TilePosition;
  currentCode: CharCode;
  targetCode: CharCode;
  isFlipping: boolean;
  intermediateCode: CharCode;
}

export interface DisplaySettings {
  flipSpeed: number;
  staggerDelay: number;
  rotationInterval: number;
  volume: number;
  isMuted: boolean;
}

export interface ContentItem {
  id: string;
  type: "quote" | "weather" | "custom" | "stats";
  lines: string[];
  attribution?: string;
}
