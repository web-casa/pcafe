import type { CSSProperties } from 'react'
import { architectures, stack } from './content'

/** Card-sized micro-graphics. Pure CSS/DOM so they stay crisp at any --u. */

export function MiniCode() {
  return (
    <div className="mini-code" aria-hidden>
      <span className="k">Types:</span>
      <span>deb</span>
      <span className="k">Suites:</span>
      <b>aurora</b>
      <span className="k">Components:</span>
      <span>main</span>
    </div>
  )
}

export function MiniStack() {
  return (
    <div className="mini-stack" aria-hidden>
      {stack
        .filter((r) => ['Linux 内核', 'GCC', 'Python'].includes(r.name))
        .map((row) => (
          <div className="mini-stack__row" key={row.name}>
            <span className="mini-stack__name">{row.name.replace(' 内核', '')}</span>
            <span className="mini-stack__old">{row.old}</span>
            <span className="mini-stack__arrow" />
            <span className="mini-stack__new">{row.next}</span>
          </div>
        ))}
    </div>
  )
}

export function MiniArch() {
  return (
    <div className="mini-arch" aria-hidden>
      {architectures.map((a, i) => (
        <span key={a.name} className={a.name === 'riscv64' ? 'is-new' : undefined} style={{ '--i': i } as CSSProperties}>
          {a.name}
        </span>
      ))}
    </div>
  )
}

export function MiniBits() {
  return (
    <div className="mini-bits" aria-hidden>
      <div className="mini-bits__cells">
        {Array.from({ length: 64 }, (_, i) => (
          <span key={i} className={i >= 32 ? 'hi' : undefined} style={{ '--i': i - 32 } as CSSProperties} />
        ))}
      </div>
      <div className="mini-bits__scale">
        <span>0</span>
        <span className="mini-bits__mid">32</span>
        <span>64 bit</span>
      </div>
    </div>
  )
}

export function MiniTmp() {
  return (
    <div className="mini-tmp" aria-hidden>
      <div className="mini-tmp__track">
        <span className="mini-tmp__used" />
        <span className="mini-tmp__cap" />
      </div>
      <div className="mini-tmp__scale">
        <span>RAM</span>
        <span className="mini-tmp__cap-label">上限 50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}
