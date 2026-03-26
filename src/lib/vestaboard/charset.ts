/**
 * Vestaboard character set and encoding.
 *
 * The FLIP_SEQUENCE defines the physical order that split-flap tiles cycle
 * through. When transitioning from one character to another, the tile must
 * rotate forward through this sequence (wrapping around if needed).
 *
 * Based on official Vestaboard character codes:
 * https://docs.vestaboard.com/docs/charactercodes/
 */

/** Character code for blank/space */
export const BLANK = 0;

/**
 * Map from character code to display character.
 * Codes based on Vestaboard's official encoding.
 */
const CODE_TO_CHAR: Record<number, string> = {
  0: " ", // blank
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
  27: "1",
  28: "2",
  29: "3",
  30: "4",
  31: "5",
  32: "6",
  33: "7",
  34: "8",
  35: "9",
  36: "0",
  37: "!",
  38: "@",
  39: "#",
  40: "$",
  41: "(",
  42: ")",
  44: "-",
  46: "+",
  47: "&",
  48: "=",
  49: ";",
  50: ":",
  52: "'",
  53: '"',
  54: "%",
  55: ",",
  56: ".",
  59: "/",
  60: "?",
  62: "°",
};

/**
 * Reverse map: display character to character code.
 */
const CHAR_TO_CODE: Record<string, number> = {};
for (const [code, char] of Object.entries(CODE_TO_CHAR)) {
  CHAR_TO_CODE[char] = Number(code);
}

/**
 * The ordered flip sequence — the physical order tiles cycle through.
 * This represents the drum order on a real split-flap display.
 */
export const FLIP_SEQUENCE: number[] = [
  0, // blank
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, // A-J
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, // K-T
  21, 22, 23, 24, 25, 26, // U-Z
  27, 28, 29, 30, 31, 32, 33, 34, 35, // 1-9
  36, // 0
  37, 38, 39, 40, 41, 42, // ! @ # $ ( )
  44, // -
  46, // +
  47, 48, 49, 50, // & = ; :
  52, 53, 54, 55, 56, // ' " % , .
  59, 60, // / ?
  62, // °
];

/**
 * Index lookup for fast sequence position calculation.
 */
const SEQUENCE_INDEX: Map<number, number> = new Map();
FLIP_SEQUENCE.forEach((code, index) => {
  SEQUENCE_INDEX.set(code, index);
});

/**
 * Convert a display character to its Vestaboard code.
 * Returns BLANK (0) for unsupported characters.
 */
export function charToCode(char: string): number {
  if (char.length === 0) return BLANK;
  const upper = char.toUpperCase();
  return CHAR_TO_CODE[upper] ?? BLANK;
}

/**
 * Convert a Vestaboard code to its display character.
 * Returns space for unknown codes.
 */
export function codeToChar(code: number): string {
  return CODE_TO_CHAR[code] ?? " ";
}

/**
 * Calculate the forward flip sequence from one character code to another.
 * Returns an array of intermediate codes (excluding the starting code,
 * including the target code).
 *
 * On a real split-flap, the drum only rotates forward, so going from
 * 'Z' to 'A' means cycling through the entire remaining sequence.
 */
export function calculateFlipPath(
  fromCode: number,
  toCode: number
): number[] {
  if (fromCode === toCode) return [];

  const fromIdx = SEQUENCE_INDEX.get(fromCode) ?? 0;
  const toIdx = SEQUENCE_INDEX.get(toCode) ?? 0;

  const steps: number[] = [];
  let i = fromIdx;

  do {
    i = (i + 1) % FLIP_SEQUENCE.length;
    steps.push(FLIP_SEQUENCE[i]);
  } while (FLIP_SEQUENCE[i] !== toCode && steps.length < FLIP_SEQUENCE.length);

  return steps;
}

/**
 * Get all supported display characters.
 */
export function getSupportedChars(): string[] {
  return Object.values(CODE_TO_CHAR);
}
