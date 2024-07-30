import { google } from 'googleapis';

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY,
});

export async function fetchGoogleSheetData(sheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1',
    });

    const data = response.data.values;

    if (!data) {
      throw new Error('No data found');
    }

    return data.slice(1).map(row => ({
      id: row[0],
      dateAdded: row[1],
      owner: row[2],
      coOwners: row[3] ? row[3].split(',').map(coOwner => coOwner.trim()) : [],
      series: row[4],
      model: row[5],
      brokenParts: row[6],
    }));
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}

export async function updateGoogleSheetData(sheetId, data) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:G', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: data.map(item => [
          item.id,
          item.dateAdded,
          item.owner,
          item.coOwners.join(', '),
          item.series,
          item.model,
          item.brokenParts,
        ]),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating data in Google Sheets:', error);
    throw error;
  }
}
