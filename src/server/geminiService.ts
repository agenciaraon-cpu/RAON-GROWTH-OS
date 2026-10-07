import { GoogleGenAI } from '@google/genai';

export async function generateRaonAiResponse(prompt: string, contextData: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: "Chave GEMINI_API_KEY não configurada no ambiente. Resposta simulada com base nos dados do sistema RAON GROWTH OS.",
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const systemInstruction = `
Você é o RAON AI, o cérebro de inteligência artificial da plataforma RAON GROWTH OS (RAON — Marketing, IA & Tecnologia).
Método: MÉTODO RAON 360° (Diagnóstico → Estratégia → Infraestrutura → Execução → Inteligência).
Você atua como arquiteto de crescimento, estrategista de CRM, analista de tráfego e inteligência de vendas.

Sua comunicação é assertiva, analítica, executiva e focada em resultados (estilo McKinsey + Silicon Valley SaaS).
Responda em Português do Brasil de forma estruturada com bullet points, números, taxas de conversão e recomendações acionáveis.

Abaixo estão os dados reais do tenant atual (clientes, leads, pipeline, campanhas, metas):
${JSON.stringify(contextData, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      text: response.text || "Não foi possível gerar análise no momento.",
    };
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return {
      text: `Erro ao consultar RAON AI: ${error.message || 'Falha na requisição'}. Analisando métricas locais.`,
    };
  }
}
