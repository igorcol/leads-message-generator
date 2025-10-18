import { SHEET_NAME, sheets, SPREADSHEET_ID } from "./lib/google";


// * ---- MAIN FUNCTION ---- * //
async function main() {
    console.log('MPA-ENGINE STATUS: [ONLINE]. Iniciando leitura de dados...');

    try {
        // -- SOLICITAÇÃO DE DADOS
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: SHEET_NAME
        });

        const rows = response.data.values;

        if (rows && rows.length > 0) {
            console.log('DADOS RECEBIDOS. Amostra da primeira linha:');
            console.log(rows[0]) // Cabeçalhos

            console.log('\n--- INÍCIO DA LEITURA DOS LEADS ---');

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];

                // TODO: AJUSTAR ORDEM DAS COLUNAS
                const lead = {
                    nome: row[0],
                    categoria: row[2],
                    contato: row[3],
                    dor: row[6],
                    highlight: row[7],
                    obs: row[8],
                };

                console.log(`[LEAD #${i}]: ${lead.nome} | Dor: ${lead.dor || '--'}`);
            }

            console.log('--- FIM DA LEITURA ---');
        }
        else {
            console.log('Nenhum dado encontrado na planilha.');
        }
    }
    catch (err) {
        console.error('ERRO AO ACESSAR A PLANILHA. Verifique suas permissões.', err);
    }
}


main();