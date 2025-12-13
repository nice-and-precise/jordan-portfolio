import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSiteSettings } from "./settings";

let genAI: GoogleGenerativeAI | null = null;

async function getClient() {
    if (genAI) return genAI;

    const settings = await getSiteSettings();
    if (!settings.googleApiKey) {
        throw new Error("Missing API Key. Go to Settings > Global to configure.");
    }

    genAI = new GoogleGenerativeAI(settings.googleApiKey);
    return genAI;
}

export async function generateContent(prompt: string, context: string = "", tone: string = "Professional") {
    const client = await getClient();

    // Priority list: Flash (Fast) -> Pro (Quality) -> 1.0 Pro (Legacy)
    // Priority list: Gemini 3 (Preview) -> Gemini 2.5 (Pro/Flash) -> Gemini 2.0 -> Legacy
    const modelsToTry = [
        "gemini-3-pro-preview",
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash"
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Gemini: Attempting with model ${modelName}...`);
            const model = client.getGenerativeModel({ model: modelName });

            const fullPrompt = `
                You are an expert copywriter and portfolio editor.
                Context: ${context}
                Tone: ${tone}
                Task: ${prompt}
                
                Return only the improved text. Keep it concise and impactful.
            `;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.warn(`Gemini: Failed with ${modelName}`, errorMessage);
            lastError = e instanceof Error ? e : new Error(errorMessage);
            // Continue to next model
        }
    }

    // If we get here, all models failed
    throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown"}`);
}

export async function generateVisionContent(prompt: string, imageBase64: string, mimeType: string = "image/jpeg") {
    const client = await getClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" }); // Flash is good for vision

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType
                }
            }
        ]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        throw error;
    }
}

export async function generateImagePrompt(description: string) {
    try {
        const client = await getClient();
        const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });

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
