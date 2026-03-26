import { NextResponse } from "next/server";

/**
 * Weather API proxy route.
 * Keeps the API key server-side. Set WEATHER_API_KEY in .env.local
 * to enable weather support (uses OpenWeatherMap).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key not configured" },
      { status: 503 }
    );
  }

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Weather fetch failed" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      location: data.name ?? "UNKNOWN",
      temp: Math.round(data.main?.temp ?? 0),
      condition: data.weather?.[0]?.main ?? "CLEAR",
      high: Math.round(data.main?.temp_max ?? 0),
      low: Math.round(data.main?.temp_min ?? 0),
      humidity: data.main?.humidity ?? 0,
      wind: `${Math.round(data.wind?.speed ?? 0)} MPH`,
    });
  } catch {
    return NextResponse.json(
      { error: "Weather service unavailable" },
      { status: 502 }
    );
  }
}
