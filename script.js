import { GoogleGenAI } from "https://esm.run/@google/genai";

// Configuración de credenciales de la API de Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6Ikh7JBT-eaB70LCpOYSdP3FAfAKeR0EzGQSppSomCDgQ";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Prompt maestro que redefine el comportamiento profesional del asistente
const SYSTEM_INSTRUCTIONS = `
Actúa como Kanso, un Consultor Senior y Experto Global en Gestión Integral de Redes Sociales, Estrategia de Contenidos y Marketing Digital. 
Tu estilo visual y tono lingüístico hereda la filosofía Japandi: es sumamente limpio, elegante, profesional, claro, breve pero de altísimo valor estratégico.

Tus competencias abarcan:
1. Creación de Calendarios editoriales y parrillas de contenido equilibradas.
2. Escritura persuasiva (Copywriting) adaptada a cada canal (LinkedIn formal, Instagram visual/emocional, TikTok dinámico, hilos tácticos para X).
3. Estructuración analítica: recomendaciones de hashtags estratégicos, llamadas a la acción (CTA) efectivas y tácticas de engagement.
4. Gestión de comunidades y atención al cliente, incluyendo protocolos de control de crisis de reputación online.

Cuando el usuario te pregunte o pida ayuda:
- Analiza su intención y responde con soluciones ordenadas, usando negritas limpias para facilitar el escaneo visual.
- Si te pide un copy, proporciónalo formateado listo para copiar.
- Evita los textos excesivamente largos, las introducciones redundantes o las despedidas mecánicas. Ve directo a la excelencia.
`;

// Inicialización de escuchas de eventos de la interfaz
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const input = document.getElementById('userInput');
    const messageText = input.value.trim();
    
    if (messageText === '') return;

    // Pintar mensaje del usuario
    appendMessage(messageText, 'user');
    input.value = '';

    // Crear indicador visual de espera
    const typingId = appendMessage("Kanso está analizando la estrategia...", 'bot');

    try {
        // Ejecución de la llamada a la SDK de Gemini usando Inteligencia de Producción
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `${SYSTEM_INSTRUCTIONS}\n\nSolicitud actual del usuario:\n"${messageText}"`,
        });

        // Remover indicador de espera
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        // Imprimir respuesta del especialista
        if (response && response.text) {
            appendMessage(response.text, 'bot');
        } else {
            appendMessage("Lo siento, experimenté un problema al estructurar la estrategia de contenido.", 'bot');
        }

    } catch (error) {
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        
        appendMessage(`Error operativo: ${error.message}. Asegúrate de que las peticiones se estén realizando desde el despliegue activo en Vercel.`, 'bot');
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const uniqueId = 'msg-' + Math.random().toString(36).substr(2, 9); 
    
    messageDiv.id = uniqueId;
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll suave hacia el último mensaje enviado o recibido
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
    
    return uniqueId;
}
