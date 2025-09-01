import path from 'path';
import { fileURLToPath } from 'url';
export async function handleImageUpload(req) {
    const file = req.file;
    if (!file) {
        return { ok: false, error: 'No file uploaded' };
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rel = path.relative(path.join(__dirname, '..'), file.path);
    const url = `/uploads/${path.basename(file.path)}`;
    return { ok: true, file: { path: rel, url, filename: file.filename } };
}
//# sourceMappingURL=upload.service.js.map