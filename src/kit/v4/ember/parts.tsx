import { useEffect, useState, type ReactNode } from 'react'

export function Dot({ children }: { children: ReactNode }) {
  return <span className="eb-dot">{children}</span>
}

export interface EmberAskProps {
  /** Grey text shown while the box is empty, ≤ 20 字. */
  placeholder: string
  /** 2–5 example requests typed in and erased in turn, each ≤ 26 字. */
  prompts?: string[]
  /** 1–3 toggle chips under the text, e.g. "＋ 附件", each ≤ 6 字. */
  chips?: string[]
  /** 1–3 model names; clicking the picker cycles them, each ≤ 10 个字符. */
  models?: string[]
  /** Smaller box for closing slides. */
  compact?: boolean
  /** Accessible name for the send button. Default "发送". */
  sendLabel?: string
}

/** A prompt box: example requests type themselves in and out, chips toggle, the model picker cycles and the send button fires the next request. */
export function EmberAsk({ placeholder, prompts = [], chips = [], models = [], compact, sendLabel = '发送' }: EmberAskProps) {
  const [k, setK] = useState(0)
  const [n, setN] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [on, setOn] = useState<number[]>([])
  const [m, setM] = useState(0)
  const [sent, setSent] = useState(0)
  const text = prompts.length ? prompts[k % prompts.length] : ''
  useEffect(() => {
    if (!text) return
    const full = n >= text.length
    const wait = dir === 1 ? (n === 0 ? 900 : full ? 2400 : 75) : n === 0 ? 300 : 24
    const t = window.setTimeout(() => {
      if (dir === 1) {
        if (full) setDir(-1)
        else setN(n + 1)
      } else if (n === 0) {
        setDir(1)
        setK(k + 1)
      } else setN(n - 1)
    }, wait)
    return () => window.clearTimeout(t)
  }, [n, dir, k, text])
  const send = () => {
    setSent((s) => s + 1)
    setN(0)
    setDir(1)
    setK((x) => x + 1)
  }
  return (
    <div className={`eb-ask${compact ? ' is-compact' : ''}`}>
      <p className="eb-ask__in">
        {n ? text.slice(0, n) : <span className="is-ph">{placeholder}</span>}
        <i className="eb-caret" aria-hidden="true" />
      </p>
      <div className="eb-ask__bar">
        {chips.slice(0, 3).map((c, i) => (
          <button
            type="button"
            key={c}
            className={on.includes(i) ? 'is-on' : undefined}
            aria-pressed={on.includes(i)}
            onClick={() => setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}
          >
            {c}
          </button>
        ))}
        {models.length > 0 && (
          <button type="button" className="eb-ask__model" onClick={() => setM((x) => (x + 1) % models.length)}>
            <span key={m}>{models[m]}</span> ▾
          </button>
        )}
        <button type="button" className="eb-ask__send" aria-label={sendLabel} onClick={send}>
          <i key={sent} className={sent ? 'is-ping' : undefined} aria-hidden="true" />↑
        </button>
      </div>
    </div>
  )
}
