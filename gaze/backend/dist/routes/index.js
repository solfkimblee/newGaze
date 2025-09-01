import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { handleImageUpload } from '../services/upload.service.js';
import { getPrompts, updatePrompts } from '../services/prompts.service.js';
import { triggerPaywall, checkPayment, markPaid } from '../services/paywall.service.js';
import { analyzeImage } from '../services/analysis.service.js';
import { orchestrate } from '../services/orchestrator.service.js';
import { generateImage } from '../services/imagegen.service.js';
export const router = Router();
// Health
router.get('/health', (_req, res) => res.json({ ok: true }));
// Upload
router.post('/upload', upload.single('image'), async (req, res) => {
    const result = await handleImageUpload(req);
    res.json(result);
});
// Paywall
router.post('/paywall/trigger', async (req, res) => {
    const session = await triggerPaywall(req.body);
    res.json(session);
});
router.get('/paywall/status/:sessionId', async (req, res) => {
    const status = await checkPayment(req.params.sessionId);
    res.json(status);
});
router.post('/paywall/mockpay/:sessionId', async (req, res) => {
    markPaid(req.params.sessionId);
    res.json({ ok: true, sessionId: req.params.sessionId });
});
// Prompts config
router.get('/prompts', (_req, res) => res.json(getPrompts()));
router.post('/prompts', (req, res) => res.json(updatePrompts(req.body)));
// Analysis
router.post('/analyze', async (req, res) => {
    const { imageUrl } = req.body;
    const report = await analyzeImage(imageUrl);
    res.json({ report });
});
// Orchestration
router.post('/orchestrate', async (req, res) => {
    const { chat_history, last_user_input } = req.body;
    const result = await orchestrate({ chat_history, last_user_input });
    res.json(result);
});
// Image generation
router.post('/generate', async (req, res) => {
    const { image_context } = req.body;
    const { url } = await generateImage(image_context);
    res.json({ url });
});
//# sourceMappingURL=index.js.map