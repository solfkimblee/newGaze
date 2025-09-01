const SESSIONS = new Map<string, { paid: boolean }>()

export async function triggerPaywall(_body: any) {
  const sessionId = `sess_${Math.random().toString(36).slice(2, 10)}`
  SESSIONS.set(sessionId, { paid: false })
  // In real life, return payment link. Here, return session id and fake link
  return { sessionId, paymentUrl: `/api/paywall/mockpay/${sessionId}` }
}

export async function checkPayment(sessionId: string) {
  const s = SESSIONS.get(sessionId) || { paid: false }
  return { sessionId, paid: s.paid }
}

// Helper for tests to mark as paid
export function markPaid(sessionId: string) {
  const s = SESSIONS.get(sessionId)
  if (s) {
    s.paid = true
    SESSIONS.set(sessionId, s)
  }
}

