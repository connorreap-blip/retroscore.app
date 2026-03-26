import type { ContentItem } from "@/types";

/**
 * Format weather data into a 6-line display for the Vestaboard grid.
 * This is a placeholder implementation — wire up to a real weather API
 * by adding a key to .env.local and using the /api/weather route.
 */
export function formatWeatherContent(data: {
  location: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: string;
}): ContentItem {
  return {
    id: `weather-${Date.now()}`,
    type: "weather",
    lines: [
      ` WEATHER  ${data.location.toUpperCase().slice(0, 11)}`,
      ` ${data.temp}F  ${data.condition.toUpperCase().slice(0, 15)}`,
      ` HIGH ${data.high}F  LOW ${data.low}F`,
      ` HUMIDITY ${data.humidity}%`,
      ` WIND ${data.wind.toUpperCase()}`,
      "",
    ],
  };
}

/**
 * Fetch weather data from the API proxy.
 * Returns null if the fetch fails (graceful degradation).
 */
export async function fetchWeather(
  lat: number,
  lon: number
): Promise<ContentItem | null> {
  try {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) return null;
    const data = await res.json();
    return formatWeatherContent(data);
  } catch {
    return null;
  }
}
