import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSiteSettings } from "./settings";

let genAI: GoogleGenerativeAI | null = null;

async function getClient() {
    if (genAI) return genAI;

    const settings = await getSiteSettings();
    if (!settings.googleApiKey) {
        throw new Error("Gemini API Key not found in Global Settings.");
    }

    genAI = new GoogleGenerativeAI(settings.googleApiKey);
    return genAI;
}

export async function generateContent(prompt: string, context: string = "", tone: string = "Professional") {
    try {
        const client = await getClient();
        const model = client.getGenerativeModel({ model: "gemini-pro" });

        const fullPrompt = `
            You are an expert copywriter and portfolio editor.
            Context: ${context}
            Tone: ${tone}
            Task: ${prompt}
            
            Keep the output concise and ready to use.
            Return ONLY the refined text, no explanations.
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

export async function generateImagePrompt(description: string) {
    try {
        const client = await getClient();
        const model = client.getGenerativeModel({ model: "gemini-pro" });

        const fullPrompt = `
            You are a visual prompt engineer. Create a high-quality, descriptive prompt for an AI image generator based on this idea: "${description}".
            The image should be: Futuristic, high-tech, abstract, neon lighting, dark background, 8k resolution.
            Return ONLY the prompt string.
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}
