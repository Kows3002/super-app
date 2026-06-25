import { NextResponse, type NextRequest } from 'next/server';

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const apiKey = process.env.OMDB_KEY || process.env.NEXT_PUBLIC_OMDB_KEY;
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const id = searchParams.get('id');

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OMDb API key' }, { status: 500 });
  }

  if (!search && !id) {
    return NextResponse.json({ error: 'Missing movie search or id' }, { status: 400 });
  }

  const url = id
    ? `https://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=${apiKey}`
    : `https://www.omdbapi.com/?s=${encodeURIComponent(search ?? '')}&type=movie&apikey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate } });

  if (!res.ok) {
    return NextResponse.json({ error: 'Movie request failed' }, { status: 502 });
  }

  return NextResponse.json(await res.json());
}
