import { Fragment, type ReactNode } from 'react'
import type { Text } from '../../shared'

/** Renders `text` (one line per array item) with every `marks` substring wrapped by `wrap`. */
export function Marked({ text, marks = [], wrap }: { text: Text; marks?: string[]; wrap: (s: string, k: number) => ReactNode }) {
  const lines = typeof text === 'string' ? [text] : text
  const split = (line: string): ReactNode[] => {
    const hit = marks.filter((m) => m && line.includes(m)).sort((a, b) => line.indexOf(a) - line.indexOf(b))[0]
    if (!hit) return [line]
    const at = line.indexOf(hit)
    return [line.slice(0, at), wrap(hit, at), ...split(line.slice(at + hit.length))]
  }
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {split(l).map((n, j) => (
            <Fragment key={j}>{n}</Fragment>
          ))}
        </Fragment>
      ))}
    </>
  )
}
