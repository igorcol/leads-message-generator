import { SHEET_NAME, sheets, SPREADSHEET_ID } from "./lib/google";
import { AiResponse, generateMessage } from "./lib/openai";

// Função utilitária para pausar o script (evitar limite da API)
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
                    nome: row[0] || 'Lead Sem Nome',
                    categoria: row[2] || '',
                    contato: row[3] || '',
                    dor: row[6] || '',
                    highlight: row[7] || '',
                    obs: row[8] || '',
                };

                // TODO: Adicionar coluna 'MSG_GERADA' na planilha
                const isGenerated = row[14] === 'TRUE'

                if (isGenerated) {
                    continue;
                }

                // Chama a IA
                const aiResponse: AiResponse = await generateMessage(lead);

                // Loga a resposta
                console.log(`--- Resposta da IA para ${lead.nome} ---`);
                console.log(`[ANÁLISE]: ${aiResponse.analise}`);
                console.log(`[OPÇÃO 1]: ${aiResponse.opcao1}`);
                console.log(`-----------------------------------\n`);

                // TODO: Escrever aiResponse.opcao1 e aiResponse.opcao2 de volta na planilha
                // TODO: Escrever 'TRUE' na coluna "MSG_GERADA"

                await sleep(500);
            }

            console.log('--- PROCESSAMENTO DE LEADS CONCLUÍDO ---');
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