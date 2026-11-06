import { useEffect, useRef, useState } from 'react'
import { hotkeyOk } from './ink'

type Row = [keys: string[], action: string]
type Group = { title: string; rows: Row[] }

export const DECK_KEYS: Group[] = [
  {
    title: '翻页',
    rows: [
      [['→', 'Space', 'PageDown'], '下一步'],
      [['←', 'PageUp'], '上一步'],
      [['Home', 'End'], '第一页 / 最后一页'],
      [['G'], '总览全部页面'],
      [['P'], '自动播放 / 暂停'],
      [['F'], '全屏'],
    ],
  },
  {
    title: '讲解',
    rows: [
      [['L'], '激光笔'],
      [['D'], '画笔，C 清除'],
      [['Z'], '局部放大'],
      [['S'], '打开演讲者视图'],
    ],
  },
  {
    title: '观众屏幕',
    rows: [
      [['B'], '黑屏 / 恢复'],
      [['W'], '白屏 / 恢复'],
      [['H'], '冻结画面 / 解除'],
      [['?'], '快捷键说明'],
      [['Esc'], '关闭'],
    ],
  },
]

export const PRESENTER_KEYS: Group[] = [
  {
    title: '翻页（同步到放映窗口）',
    rows: [
      [['→', 'Space', 'PageDown'], '下一步'],
      [['←', 'PageUp'], '上一步'],
      [['Home', 'End'], '第一页 / 最后一页'],
    ],
  },
  {
    title: '观众屏幕',
    rows: [
      [['B'], '黑屏 / 恢复'],
      [['W'], '白屏 / 恢复'],
      [['H'], '冻结画面 / 解除，解除后跟上当前页'],
    ],
  },
  {
    title: '本窗口',
    rows: [
      [['?'], '快捷键说明'],
      [['Esc'], '关闭'],
    ],
  },
]

/** `?` opens a list of every key; `?` or Esc closes it. */
export function KeyHelp({ groups, disabled = false }: { groups: Group[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const shown = useRef(false)
  shown.current = open

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(() => {
    if (disabled) return
    // Capture phase, so Esc closes this before the laser, pen or zoom see it.
    const onKey = (e: KeyboardEvent) => {
      if (!hotkeyOk(e)) return
      if (e.key === '?') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && shown.current) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [disabled])

  if (!open) return null
  return (
    <div className="key-help" role="dialog" aria-label="快捷键" onClick={() => setOpen(false)}>
      <div className="key-help__box" onClick={(e) => e.stopPropagation()}>
        <div className="key-help__head">
          <b>快捷键</b>
          <span>
            <kbd>?</kbd> / <kbd>Esc</kbd> 关闭
          </span>
        </div>
        <div className="key-help__cols">
          {groups.map((g) => (
            <section key={g.title}>
              <h3>{g.title}</h3>
              <dl>
                {g.rows.map(([keys, action]) => (
                  <div key={action}>
                    <dt>
                      {keys.map((k) => (
                        <kbd key={k}>{k}</kbd>
                      ))}
                    </dt>
                    <dd>{action}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
