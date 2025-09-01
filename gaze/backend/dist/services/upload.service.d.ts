import type { Request } from 'express';
export declare function handleImageUpload(req: Request): Promise<{
    ok: boolean;
    error: string;
    file?: never;
} | {
    ok: boolean;
    file: {
        path: string;
        url: string;
        filename: string;
    };
    error?: never;
}>;
//# sourceMappingURL=upload.service.d.ts.map