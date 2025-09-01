import { getPrompts } from './prompts.service.js'

type OrchestrateInput = {
  chat_history: Array<{ role: 'user' | 'assistant'; content: string }>
  last_user_input: string
}

export async function orchestrate(input: OrchestrateInput) {
  const { PROMPT_GAZE_MAIN } = getPrompts()
  const historySummary = JSON.stringify(input.chat_history).slice(0, 120)
  const user = input.last_user_input || ''

  // Simple rule engine mock to produce structured JSON like the LLM would
  if (/图像|图片|看/.test(user) || /可视化|画像|相貌/.test(user)) {
    return {
      action: 'VISUALIZE',
      responseText:
        '我能感受到一个需要被视觉化呈现的意象。我来为你描绘它的轮廓。',
      image_context:
        'Ethereal, mystical aura, a calm East Asian figure with warm eyes, soft bokeh background, symbolic charm glowing',
      next_ui_component: null
    }
  }

  if (/选|方向|选择|A\.|B\.|C\.|D\./.test(user) || historySummary.length < 40) {
    return {
      action: 'OFFER_CHOICE',
      responseText: '你希望我们接下来重点探索哪个方面？',
      options: ['A. 近期的挑战', 'B. 潜在的机会', 'C. 人际关系', 'D. 内心成长'],
      next_ui_component: 'UI_SingleChoice'
    }
  }

  if (user.length < 6) {
    return {
      action: 'ASK_OPEN',
      responseText: '此刻浮现的第一个念头是什么？请尽量具体。',
      next_ui_component: 'UI_TextInput'
    }
  }

  return {
    action: 'INSIGHT',
    responseText:
      '你的叙述显示能量在回归中心。请在接下来的三天专注一件对你重要的小事。',
    next_ui_component: 'UI_TextInput'
  }
}

