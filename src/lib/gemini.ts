import { GoogleGenerativeAI } from '@google/generative-ai'

// API key configurada directamente
const genAI = new GoogleGenerativeAI('AIzaSyCZfhYJplVMa5PFqvvfMz0w2f7J6IOGcE0')

export interface ChatContext {
  currentMood: {
    score: number;
    type: string;
    notes?: string;
  };
  recentMoods?: Array<{
    score: number;
    type: string;
    date: string;
  }>;
}

export async function generateEmotionalResponse(
  context: ChatContext,
  userMessage?: string
): Promise<string> {
  console.log('Usando API key directa de Gemini 2.5 Flash')
  console.log('API Key (primeros 10 chars):', 'AIzaSyCZfh'.substring(0, 10))

  const systemPrompt = `Eres un amigo cercano y de confianza, empático y compasivo. Tu objetivo es ayudar a tu amigo a entender y procesar sus emociones de manera saludable, como lo haría un buen amigo.

Contexto emocional actual de tu amigo:
- Estado de ánimo: ${context.currentMood.type} (${context.currentMood.score}/10)
- Notas: ${context.currentMood.notes || 'Sin notas adicionales'}

${context.recentMoods && context.recentMoods.length > 0 ? 
  `Historial reciente de tu amigo:
${context.recentMoods.map(mood => `- ${mood.type} (${mood.score}/10) el ${mood.date}`).join('\n')}` : 
  'Sin historial reciente'}

Responde de manera:
1. Como un amigo cercano, con un tono cálido y personal.
2. Empática y validante.
3. Breve y directa (máximo 150 palabras).
4. Centrada en el bienestar emocional.
5. Sin dar consejos médicos o psicológicos profesionales.
6. Evita repetir frases o estructuras de inicio en tus respuestas.
7. Usa expresiones naturales y variadas como lo haría un amigo real.
8. En español`

  try {
    // Usar Gemini 2.5 Flash - el modelo más reciente y potente
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    let fullPrompt = systemPrompt
    
    if (userMessage) {
      fullPrompt += `\n\nMensaje del usuario: ${userMessage}`
    }

    console.log('Enviando prompt a Gemini 2.5 Flash...')
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    console.log('Respuesta recibida de Gemini 2.5 Flash:', text)
    return text || 'Lo siento, no pude generar una respuesta en este momento.'
  } catch (error) {
    console.error('Error calling Gemini:', error)
    throw error // Propagar el error para verlo claramente
  }
}
