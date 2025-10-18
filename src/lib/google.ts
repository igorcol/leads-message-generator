import 'dotenv/config';
import path from 'path';
import { google } from 'googleapis';

// Caminho para o arquivo de credenciais e permissões
const KEY_FILE_PATH = path.join(process.cwd(), 'google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Autenticando
const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES
})

// * Sheets autenticado
export const sheets = google.sheets({ version: 'v4', auth })

// Ecporta variaveis de ambiente que o script principal usa
export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
export const SHEET_NAME = process.env.GOOGLE_SHEET_NAME;

if (!SPREADSHEET_ID || !SHEET_NAME) {
    throw new Error(
        'Variáveis de ambiente GOOGLE_SHEET_ID ou GOOGLE_SHEET_NAME não definidas. Verifique seu .env'
    );
}