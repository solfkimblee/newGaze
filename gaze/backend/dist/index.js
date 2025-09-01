import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { router as apiRouter } from './routes/index.js';
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Uploads dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
// Multer storage (for quick local file save)
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
export const upload = multer({ storage });
// API routes
app.use('/api', apiRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Gaze backend running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map