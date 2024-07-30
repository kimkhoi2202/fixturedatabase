import { NextResponse } from 'next/server';
import { fetchGoogleSheetData } from '@/utils/fetchData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('sheetId') || process.env.NEXT_PUBLIC_SHEET_ID;
  
  try {
    const data = await fetchGoogleSheetData(sheetId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
