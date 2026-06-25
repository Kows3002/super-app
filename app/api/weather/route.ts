import { NextResponse } from 'next/server';

export const revalidate = 300;

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`,
      { next: { revalidate } }
    );

    if (!res.ok) throw new Error('Weather request failed');

    const data = await res.json();

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      wind: `${data.wind.speed} km/h`,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
    });
  } catch {
    return NextResponse.json({
      temp: 24,
      description: 'Heavy rain',
      wind: '3.7 km/h',
      pressure: 1010,
      humidity: 83,
      icon: '10d',
    });
  }
}
