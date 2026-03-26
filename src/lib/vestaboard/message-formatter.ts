import { BOARD_ROWS, BOARD_COLS } from "./layout";
import { charToCode, BLANK } from "./charset";
import type { BoardState } from "@/types";

/**
 * Convert a multi-line text string into a 6x22 BoardState (array of char codes).
 *
 * - Converts to uppercase (Vestaboard is uppercase only)
 * - Centers each line horizontally
 * - Pads unused rows/cols with blanks
 * - Truncates lines longer than 22 chars
 * - Truncates messages with more than 6 lines
 */
export function formatMessage(text: string): BoardState {
  const lines = text.split("\n").slice(0, BOARD_ROWS);

  const board: BoardState = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    const line = lines[row] ?? "";
    const upper = line.toUpperCase().slice(0, BOARD_COLS);

    // Center the text in the row
    const padding = Math.floor((BOARD_COLS - upper.length) / 2);
    const codes: number[] = [];

    for (let col = 0; col < BOARD_COLS; col++) {
      const charIdx = col - padding;
      if (charIdx >= 0 && charIdx < upper.length) {
        codes.push(charToCode(upper[charIdx]));
      } else {
        codes.push(BLANK);
      }
    }

    board.push(codes);
  }

  return board;
}

/**
 * Convert a ContentItem's lines array into a BoardState.
 * Each element in lines corresponds to one row of the board.
 */
export function formatLines(lines: string[]): BoardState {
  return formatMessage(lines.join("\n"));
}

/**
 * Create an empty (all blank) board state.
 */
export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => BLANK)
  );
}
