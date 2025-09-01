import { getPrompts } from './prompts.service.js';
export async function generateImage(image_context) {
    const { PROMPT_IMAGE_GENERATION } = getPrompts();
    const prompt = PROMPT_IMAGE_GENERATION.replace('{image_context}', image_context);
    // In production, call diffusion API with the prompt.
    // Here, return a placeholder image URL with the prompt embedded as a data URL for demo.
    const url = `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 50))}/768/512`;
    return { url };
}
//# sourceMappingURL=imagegen.service.js.map