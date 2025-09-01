type OrchestrateInput = {
    chat_history: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    last_user_input: string;
};
export declare function orchestrate(input: OrchestrateInput): Promise<{
    action: string;
    responseText: string;
    image_context: string;
    next_ui_component: null;
    options?: never;
} | {
    action: string;
    responseText: string;
    options: string[];
    next_ui_component: string;
    image_context?: never;
} | {
    action: string;
    responseText: string;
    next_ui_component: string;
    image_context?: never;
    options?: never;
}>;
export {};
//# sourceMappingURL=orchestrator.service.d.ts.map