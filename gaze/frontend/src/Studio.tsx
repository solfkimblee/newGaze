import { useEffect, useState } from 'react'
import { api } from './api'

type PromptsConfig = {
  PROMPT_IMAGE_ANALYSIS: string
  PROMPT_GAZE_MAIN: string
  PROMPT_IMAGE_GENERATION: string
}

export default function Studio() {
  const [data, setData] = useState<PromptsConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api<PromptsConfig>('/prompts')
        setData(res)
      } catch (e: any) {
        setError(e.message || '加载失败')
      }
    })()
  }, [])

  async function save() {
    if (!data) return
    try {
      setSaving(true)
      setError(null)
      const res = await api<PromptsConfig>('/prompts', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      setData(res)
    } catch (e: any) {
      setError(e.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">AI Studio · Prompt 配置</h2>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {!data ? (
        <div className="text-sm text-neutral-400">加载中…</div>
      ) : (
        <div className="space-y-4">
          <section className="card space-y-2">
            <div className="text-sm font-medium">PROMPT_IMAGE_ANALYSIS</div>
            <textarea
              className="input min-h-40 h-40"
              value={data.PROMPT_IMAGE_ANALYSIS}
              onChange={(e) =>
                setData({ ...data, PROMPT_IMAGE_ANALYSIS: e.target.value })
              }
            />
          </section>
          <section className="card space-y-2">
            <div className="text-sm font-medium">PROMPT_GAZE_MAIN</div>
            <textarea
              className="input min-h-40 h-40"
              value={data.PROMPT_GAZE_MAIN}
              onChange={(e) =>
                setData({ ...data, PROMPT_GAZE_MAIN: e.target.value })
              }
            />
          </section>
          <section className="card space-y-2">
            <div className="text-sm font-medium">PROMPT_IMAGE_GENERATION</div>
            <textarea
              className="input min-h-40 h-40"
              value={data.PROMPT_IMAGE_GENERATION}
              onChange={(e) =>
                setData({ ...data, PROMPT_IMAGE_GENERATION: e.target.value })
              }
            />
          </section>
          <div>
            <button className="button" onClick={save} disabled={saving}>
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

