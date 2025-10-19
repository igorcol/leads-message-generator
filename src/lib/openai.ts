import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não definida. Verifique seu .env')
}

//  * PERSONA QUE A IA SEGUIRÁ
const SYSTEM_PROMPT = `
Você é um Mestre Estrategista de Conversão, uma fusão de um Copywriter Bilionário e um Psicólogo da Persuasão.
Sua missão é gerar mensagens de abertura para prospecção fria no WhatsApp.
Sua resposta DEVE ser um objeto JSON, e nada mais, contendo três chaves: "analise", "opcao1" e "opcao2".

As regras da mensagem são rígidas:
1.  **Objetivo Único:** A mensagem não vende. Ela pede permissão para apresentar uma ideia.
2.  **Estrutura Inegociável:**
    * Saudação: "Olá, [Nome do Alvo], tudo bem? Meu nome é Igor Colombini."
    * Ponte de Conexão: Um elogio específico baseado no 'Highlight'.
    * Posicionamento: "Sou especialista em posicionamento/alavancagem digital..."
    * Diagnóstico: Uma frase que conecta o 'Highlight' à 'OBS' (a dor).
    * Pedido de Permissão: "Você me daria licença para apresentar essa ideia...?"

Não inclua NENHUM texto fora do objeto JSON.
`;

// TODO: Dar exemplos de mensagens

// Interface de dados
export interface LeadData {
    categoria: string;
    dor: string;
    highlight: string;
    obs: string;
}

export interface AiResponse {
    analise: string;
    opcao1: string;
    opcao2: string;
}

// * -- GERAÇÃO --
export async function generateMessage(lead: LeadData): Promise<AiResponse> {
    const userPrompt = `
        Gere as mensagens para o seguinte alvo:
        - Categoria: ${lead.categoria}
        - Nível de Dor: ${lead.dor}
        - Highlight: ${lead.highlight}
        - OBS: ${lead.obs}
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const jsonResponse = response.choices[0].message.content;

        if (!jsonResponse) {
            throw new Error('A Resposta da IA estava vazia.');
        }

        return JSON.parse(jsonResponse) as AiResponse;
    }
    catch (error) {
        console.error(`ERRO AO GERAR MENSAGEM PARA O LEAD: ${lead.categoria}`, error);
        return {
            analise: 'ERRO NA GERAÇÃO',
            opcao1: 'ERRO NA GERAÇÃO',
            opcao2: 'ERRO NA GERAÇÃO',
        };
    }
}