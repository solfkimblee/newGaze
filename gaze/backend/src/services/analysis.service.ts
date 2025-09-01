import { getPrompts } from './prompts.service.js'

export async function analyzeImage(imageUrl: string): Promise<string> {
  const { PROMPT_IMAGE_ANALYSIS } = getPrompts()
  // Construct final prompt with variable injection
  const finalPrompt = PROMPT_IMAGE_ANALYSIS.replace('{user_image}', imageUrl)
  // Mock multimodal call. In production, send image + finalPrompt to a VLM.
  const report = `## Gaze 初步解读\n\n- 图像线索: ${imageUrl}\n- 事业与财富: 即将迎来阶段性突破，但需把握关键节点。\n- 爱情与关系: 温柔与理性并存，沟通将带来连结。\n- 近期运势: 势能回升，留意直觉给你的指引。\n\n> 已注入变量的 Prompt 片段:\n\n${finalPrompt.slice(0, 200)}...`
  return report
}

