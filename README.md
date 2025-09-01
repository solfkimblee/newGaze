Gaze - 多模态算命应用

快速开始

- 后端（Express + TypeScript）已在 `gaze/backend/`，前端（Vite React + TS）在 `gaze/frontend/`。
- 运行服务：

```
cd /workspace
# 后端（已编译版本）
node gaze/backend/dist/index.js
# 或开发模式
cd gaze/backend && npm run dev

# 前端
cd /workspace/gaze/frontend && npm run dev
```

访问前端：`http://localhost:5173/`。前端已配置代理 `/api` 指向 `http://localhost:4000`。

功能概览

- 状态机：Onboarding → Paywall → Analyze → Interactive Loop → Visualize（可回到 Loop）。
- 组件：UI_ImageUpload、UI_Paywall、UI_TextInput、UI_SingleChoice、UI_TextDisplay（Markdown）、UI_ImageDisplay。
- 核心 Prompt：在前端 AI Studio 页面编辑，后端实时生效。

主要 API

- POST `/api/upload` 表单字段 `image`，返回 `{ file: { url } }`。
- POST `/api/paywall/trigger` → 返回 `sessionId`；POST `/api/paywall/mockpay/:id`；GET `/api/paywall/status/:id`。
- POST `/api/analyze` `{ imageUrl }` → 返回 `{ report }`。
- POST `/api/orchestrate` `{ chat_history, last_user_input }` → 返回 JSON 指令（INSIGHT/ASK_OPEN/OFFER_CHOICE/VISUALIZE）。
- POST `/api/generate` `{ image_context }` → 返回 `{ url }`（占位图）。

提示

- 本示例使用 mock 支付、mock 多模态与图片生成，便于快速集成真实服务。

