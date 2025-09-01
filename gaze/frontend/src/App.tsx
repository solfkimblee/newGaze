import { useEffect, useRef, useState } from 'react'
import Studio from './Studio'
import ReactMarkdown from 'react-markdown'

// Types
type ChatMessage = { role: 'assistant' | 'user'; content: string }

type UIComponentKey =
  | 'UI_TextDisplay'
  | 'UI_ImageUpload'
  | 'UI_Paywall'
  | 'UI_TextInput'
  | 'UI_SingleChoice'
  | 'UI_ImageDisplay'

type OrchestrateResponse =
  | {
      action: 'INSIGHT' | 'ASK_OPEN'
      responseText: string
      next_ui_component: 'UI_TextInput' | null
    }
  | {
      action: 'OFFER_CHOICE'
      responseText: string
      options: string[]
      next_ui_component: 'UI_SingleChoice'
    }
  | {
      action: 'VISUALIZE'
      responseText: string
      image_context: string
      next_ui_component: null
    }

// API Client
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function uploadImage(file: File): Promise<{ url: string }>{
  const form = new FormData()
  form.append('image', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { url: data.file.url as string }
}

// Components
function UI_TextDisplay({ text }: { text: string }) {
  return (
    <div className="card prose prose-invert">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}

function UI_ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <div className="card">
      <div className="text-sm mb-2">请上传一张图片（面相/手相/氛围）</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const { url } = await uploadImage(file)
          onUploaded(url)
        }}
        className="block w-full text-sm text-neutral-300 file:button file:px-3 file:py-1.5 file:rounded-md file:bg-neutral-800 file:border-neutral-700 file:text-neutral-200"
      />
    </div>
  )
}

function UI_Paywall({ onPaid }: { onPaid: (sessionId: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function createAndPoll() {
    try {
      setLoading(true)
      setError(null)
      const { sessionId } = await api<{ sessionId: string }>(
        '/paywall/trigger',
        { method: 'POST', body: JSON.stringify({ product: 'gaze-report' }) }
      )
      setSession(sessionId)
      // Auto-complete payment in mock
      await api(`/paywall/mockpay/${sessionId}`, { method: 'POST' })
      // Poll status
      const start = Date.now()
      while (Date.now() - start < 5000) {
        const { paid } = await api<{ paid: boolean }>(
          `/paywall/status/${sessionId}`
        )
        if (paid) {
          onPaid(sessionId)
          return
        }
        await new Promise((r) => setTimeout(r, 300))
      }
      setError('支付确认超时，请重试')
    } catch (e: any) {
      setError(e.message || '支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-3">
      <div>Gaze 正在解析您的命运矩阵，请付费解锁完整报告。</div>
      <button className="button" onClick={createAndPoll} disabled={loading}>
        {loading ? '处理中…' : '支付解锁 (Mock)'}
      </button>
      {session && (
        <div className="text-xs text-neutral-400">会话: {session}</div>
      )}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}

function UI_TextInput({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="card space-y-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入你的想法..."
        className="input"
      />
      <div>
        <button
          className="button"
          onClick={() => {
            if (value.trim()) onSubmit(value.trim())
            setValue('')
          }}
        >
          发送
        </button>
      </div>
    </div>
  )
}

function UI_SingleChoice({
  options,
  onSelect,
}: {
  options: string[]
  onSelect: (v: string) => void
}) {
  return (
    <div className="card space-y-2">
      {options.map((opt) => (
        <button key={opt} className="button w-full" onClick={() => onSelect(opt)}>
          {opt}
        </button>
      ))}
    </div>
  )
}

function UI_ImageDisplay({ url }: { url: string }) {
  return (
    <div className="card p-2">
      <img src={url} alt="visualization" className="w-full rounded-lg" />
    </div>
  )
}

// App State Machine
export default function App() {
  const [state, setState] = useState<
    | 'ONBOARD'
    | 'PAYWALL'
    | 'ANALYZE'
    | 'LOOP'
    | 'VISUALIZE'
  >('ONBOARD')

  const [chat, setChat] = useState<ChatMessage[]>([])
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [pendingUI, setPendingUI] = useState<UIComponentKey | null>(null)
  const [options, setOptions] = useState<string[] | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showStudio, setShowStudio] = useState(false)

  // Onboarding greeting
  useEffect(() => {
    if (state === 'ONBOARD') {
      setChat([
        {
          role: 'assistant',
          content: '欢迎来到 Gaze，让我洞悉你的未来。请先上传一张图片。',
        },
      ])
      setPendingUI('UI_ImageUpload')
    }
  }, [state])

  // State transitions
  async function handleUploaded(url: string) {
    setUploadedUrl(url)
    setPendingUI('UI_Paywall')
    setState('PAYWALL')
  }

  async function handlePaid() {
    setState('ANALYZE')
    setLoading(true)
    const { report } = await api<{ report: string }>(
      '/analyze',
      { method: 'POST', body: JSON.stringify({ imageUrl: uploadedUrl }) }
    )
    setAnalysis(report)
    setChat((c) => [...c, { role: 'assistant', content: report }])
    setLoading(false)
    setState('LOOP')
    setPendingUI('UI_TextInput')
  }

  async function runOrchestrator(lastInput: string) {
    const body = {
      chat_history: chat,
      last_user_input: lastInput,
    }
    const resp = await api<OrchestrateResponse>(
      '/orchestrate',
      { method: 'POST', body: JSON.stringify(body) }
    )

    setChat((c) => [...c, { role: 'assistant', content: resp.responseText }])

    if (resp.action === 'OFFER_CHOICE') {
      setOptions(resp.options)
      setPendingUI('UI_SingleChoice')
    } else if (resp.action === 'VISUALIZE') {
      setState('VISUALIZE')
      setPendingUI(null)
      const { url } = await api<{ url: string }>(
        '/generate',
        { method: 'POST', body: JSON.stringify({ image_context: resp.image_context }) }
      )
      setImageUrl(url)
      setState('LOOP')
      setPendingUI('UI_TextInput')
    } else {
      setPendingUI(resp.next_ui_component)
    }
  }

  function handleUserInput(value: string) {
    setChat((c) => [...c, { role: 'user', content: value }])
    runOrchestrator(value)
  }

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gaze · 多模态算命</h1>
        <button className="button" onClick={() => setShowStudio((s) => !s)}>
          {showStudio ? '返回' : 'AI Studio'}
        </button>
      </div>

      {showStudio ? (
        <Studio />
      ) : (
        <>
          {/* Chat transcript */}
          <div className="space-y-3">
            {chat.map((m, idx) => (
              <UI_TextDisplay key={idx} text={(m.role === 'assistant' ? 'Gaze: ' : '你: ') + m.content} />
            ))}
            {imageUrl && <UI_ImageDisplay url={imageUrl} />}
          </div>

          {/* Active input component */}
          {loading && <div className="text-sm text-neutral-400">正在分析图片…</div>}
          {pendingUI === 'UI_ImageUpload' && <UI_ImageUpload onUploaded={handleUploaded} />}
          {pendingUI === 'UI_Paywall' && <UI_Paywall onPaid={handlePaid} />}
          {pendingUI === 'UI_TextInput' && <UI_TextInput onSubmit={handleUserInput} />}
          {pendingUI === 'UI_SingleChoice' && options && (
            <UI_SingleChoice options={options} onSelect={handleUserInput} />
          )}
        </>
      )}
    </div>
  )
}
