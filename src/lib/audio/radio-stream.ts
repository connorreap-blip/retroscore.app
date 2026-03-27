/**
 * Radio stream integration for MLB team radio broadcasts.
 *
 * v2: Use the Radio Browser API (already integrated in this project)
 * to search for team radio affiliates, then pipe through the
 * existing Web Audio engine.
 *
 * For now, this module exports the interface only.
 */

export interface RadioStreamConfig {
  teamId: number;
  stationUrl: string;
  stationName: string;
}

export function getTeamRadioUrl(_teamId: number): string | null {
  // v2: search Radio Browser API for team affiliate
  return null;
}
