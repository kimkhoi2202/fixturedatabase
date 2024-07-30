import { NextResponse } from 'next/server';
import { updateGoogleSheetData } from '@/utils/fetchData';

export async function POST(request) {
  const { sheetId, data } = await request.json();
  const spreadsheetId = sheetId || process.env.NEXT_PUBLIC_SHEET_ID;
  
  try {
    await updateGoogleSheetData(spreadsheetId, data);
    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}
