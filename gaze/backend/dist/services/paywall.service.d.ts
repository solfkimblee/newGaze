export declare function triggerPaywall(_body: any): Promise<{
    sessionId: string;
    paymentUrl: string;
}>;
export declare function checkPayment(sessionId: string): Promise<{
    sessionId: string;
    paid: boolean;
}>;
export declare function markPaid(sessionId: string): void;
//# sourceMappingURL=paywall.service.d.ts.map