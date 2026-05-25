const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export const openAIService = {
  async analyzeImage(base64Image: string): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  'Eres un asistente experto en soporte técnico IT, telecomunicaciones, redes e infraestructura. Analiza la imagen del problema técnico y proporciona un diagnóstico preliminar, posibles causas y soluciones sugeridas. Responde en español, claro y conciso.',
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analiza esta imagen de un problema técnico y dame un diagnóstico:',
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 500,
          }),
        }
      );
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No se pudo analizar la imagen.';
    } catch (error) {
      console.error('Error analyzing image:', error);
      return 'Error al conectar con el servicio de IA.';
    }
  },

  async generateReport(context: string): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Eres un asistente que genera reportes técnicos profesionales en español. Sé conciso y estructurado.',
              },
              {
                role: 'user',
                content: `Genera un reporte técnico profesional basado en: ${context}`,
              },
            ],
            max_tokens: 800,
          }),
        }
      );
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Error generando reporte.';
    } catch (error) {
      console.error('Error generating report:', error);
      return 'Error al generar el reporte.';
    }
  },

  async chatAssistant(message: string, history: { role: string; content: string }[] = []) {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Eres un asistente técnico experto en IT, telecomunicaciones, redes, cámaras, infraestructura y electricidad tecnológica. Responde en español de forma clara y útil.',
              },
              ...history,
              { role: 'user', content: message },
            ],
            max_tokens: 600,
          }),
        }
      );
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';
    } catch (error) {
      console.error('Error in chat:', error);
      return 'Error de conexión con el asistente.';
    }
  },

  async suggestFix(problemDescription: string): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Eres un técnico especializado en soporte IT. Dada una descripción del problema, sugiere la solución más probable paso a paso. Responde en español.',
              },
              {
                role: 'user',
                content: `Problema técnico: ${problemDescription}. ¿Cuál es la solución?`,
              },
            ],
            max_tokens: 500,
          }),
        }
      );
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No se pudo generar una sugerencia.';
    } catch (error) {
      console.error('Error suggesting fix:', error);
      return 'Error al generar sugerencia.';
    }
  },
};
