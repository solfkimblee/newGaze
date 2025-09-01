type PromptsConfig = {
    PROMPT_IMAGE_ANALYSIS: string;
    PROMPT_GAZE_MAIN: string;
    PROMPT_IMAGE_GENERATION: string;
};
export declare function getPrompts(): PromptsConfig;
export declare function updatePrompts(input: Partial<PromptsConfig>): PromptsConfig;
export {};
//# sourceMappingURL=prompts.service.d.ts.map