import type { ReactNode } from 'react'

const KW = new Set(
  'SELECT FROM WHERE AND OR NOT IN IS NULL AS ON JOIN LEFT INNER GROUP BY ORDER LIMIT INSERT INTO VALUES UPDATE SET DELETE RETURNING CREATE TABLE INDEX EXTENSION USING BEGIN COMMIT ROLLBACK PRIMARY KEY REFERENCES EXPLAIN ANALYZE WITH DESC ASC COUNT DISTINCT HAVING IF EXISTS UNIQUE OLD NEW DEFAULT FOR SHARE TRUE FALSE'.split(' '),
)

/** Light SQL highlighting: keywords, strings, numbers and -- comments. Neutral, no external lexer. */
export function sqlLine(line: string): ReactNode {
  const out: ReactNode[] = []
  const re = /(--.*$)|('[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)|(\s+)|(.)/g
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(line))) {
    const [t] = m
    if (m[1]) out.push(<span key={k++} className="t3-tk-c">{t}</span>)
    else if (m[2]) out.push(<span key={k++} className="t3-tk-s">{t}</span>)
    else if (m[3]) out.push(<span key={k++} className="t3-tk-n">{t}</span>)
    else if (m[4] && KW.has(t)) out.push(<span key={k++} className="t3-tk-k">{t}</span>)
    else out.push(t)
  }
  return out.length ? out : ' '
}

/** Dark code window chrome shared by the code templates. */
export function CodeWindow({ title, className, children }: { title?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`t3-win${className ? ` ${className}` : ''}`}>
      <div className="t3-win__bar" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      {title && <span className="t3-win__title">{title}</span>}
      <div className="t3-win__body">{children}</div>
    </div>
  )
}
