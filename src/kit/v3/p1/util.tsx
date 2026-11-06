import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'

/** A button drawn on the slide (not clickable): a call to action or a command. */
export interface D1Action {
  /** ≤ 10 字. */
  label: string
  /** 'primary' = filled accent, 'ghost' = outline, 'code' = monospace command chip. Default 'primary' for the first, 'ghost' after. */
  kind?: 'primary' | 'ghost' | 'code'
  icon?: IconName
}

export function D1Buttons({ actions, className = '' }: { actions?: D1Action[]; className?: string }) {
  if (!actions?.length) return null
  return (
    <div className={`d1-btns ${className}`}>
      {actions.map((a, i) => {
        const kind = a.kind ?? (i === 0 ? 'primary' : 'ghost')
        return (
          <span key={i} className={`d1-btn d1-btn--${kind}`}>
            {kind === 'code' && <span className="d1-btn__prompt" aria-hidden>$</span>}
            <span>{a.label}</span>
            {a.icon ? <Icon name={a.icon} size={26} /> : kind === 'primary' ? <span className="d1-btn__arrow" aria-hidden>→</span> : null}
          </span>
        )
      })}
    </div>
  )
}
