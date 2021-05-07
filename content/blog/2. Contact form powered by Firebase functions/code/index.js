import * as functions from 'firebase-functions';
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

const privatekey = require('./private-key.json');

// configure a JWT auth client
const jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, [
	'https://www.googleapis.com/auth/spreadsheets',
]);
const spreadsheetId = 'SHEET_ID';
const sheetName = 'Sheet1';
const sheets = google.sheets('v4');

const authorizeAndDoNext = async () => {
	await jwtClient.authorize();
	console.log('Successfully Conected');
};

export const ping = (request, response) => {
	response.send('Hello from the other side');
};

/**
 * Write data to sheet
 * @param data {name,email,message}
 */
export const writeToSheet = async (data) => {
	return await sheets.spreadsheets.values.append({
		auth: jwtClient,
		spreadsheetId: spreadsheetId,
		range: sheetName,
		valueInputOption: 'RAW',
		insertDataOption: 'INSERT_ROWS',
		resource: {
			values: [[data.name, data.email, data.message]],
		},
	});
};

/**
 * The secret sauce.
 */
export const contact = async (request, response) => {
	try {
		await authorizeAndDoNext();
		const result = await writeToSheet(request.body);
		response.status(200).send(result.data);
	} catch (error) {
		console.log('Error', error);
		response.status(400).send(error);
	}
};

app.get('/ping', (req, res) => res.send('Hello from the other side'));
app.post('/contact', contact);

export const api = functions.https.onRequest(app);
