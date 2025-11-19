import { GoogleGenAI } from "@google/genai";
import { AdAspectRatio } from "../types";

// Initialize the Gemini client
// The API key is obtained from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Imagen 3 model.
 * @param prompt The detailed prompt for the image.
 * @param aspectRatio The desired aspect ratio.
 * @returns A promise that resolves to the base64 image data URL.
 */
export const generateAdImage = async (
  prompt: string, 
  aspectRatio: AdAspectRatio
): Promise<string> => {
  try {
    // Map our internal enum to the string expected by the API config if strictly needed, 
    // but the enum values '1:1', '16:9' etc match the API requirements.
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image;

    if (!generatedImage || !generatedImage.imageBytes) {
      throw new Error("No image generated");
    }

    const base64ImageBytes = generatedImage.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Constructs a prompt optimized for banner ads.
 */
export const constructAdPrompt = (
  productName: string, 
  description: string, 
  styleModifier: string
): string => {
  return `Professional product advertisement banner for "${productName}". 
  Product Description: ${description}. 
  Style: ${styleModifier}.
  Requirements: High resolution, award-winning commercial photography, centered composition suitable for text overlay, professional lighting, photorealistic, 8k.
  The image should leave some negative space for ad copy.`;
};