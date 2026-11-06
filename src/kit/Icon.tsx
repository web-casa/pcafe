import { createContext, useContext, type ReactNode } from 'react'
import { ICONS, type IconName } from './icon-set'

/**
 * The six Solar icon series. A deck picks one (DeckDef.iconStyle) and every
 * icon follows it; a single icon can still override with `variant`.
 */
export const ICON_STYLES = ['line-duotone', 'bold-duotone', 'linear', 'outline', 'broken', 'bold'] as const
export type IconStyle = (typeof ICON_STYLES)[number]

export const ICON_STYLE_LABELS: Record<IconStyle, string> = {
  'line-duotone': 'Line Duotone',
  'bold-duotone': 'Bold Duotone',
  linear: 'Linear',
  outline: 'Outline',
  broken: 'Broken',
  bold: 'Bold',
}

const WEIGHT = {
  'line-duotone': 'LineDuotone',
  'bold-duotone': 'BoldDuotone',
  linear: 'Linear',
  outline: 'Outline',
  broken: 'Broken',
  bold: 'Bold',
} as const

export const DEFAULT_ICON_STYLE: IconStyle = 'line-duotone'

const IconStyleContext = createContext<IconStyle>(DEFAULT_ICON_STYLE)
export const useIconStyle = () => useContext(IconStyleContext)

export function IconStyleProvider({ value = DEFAULT_ICON_STYLE, children }: { value?: IconStyle; children: ReactNode }) {
  return <IconStyleContext.Provider value={value}>{children}</IconStyleContext.Provider>
}

export interface IconProps {
  name: IconName
  /** Size in design units (1920-wide canvas). Defaults to 48. */
  size?: number
  /**
   * ink: neutral (secondary layer at reduced opacity).
   * accent: the duotone layer turns accent — use on the one focal icon of a slide.
   * mute: quiet grey, for decoration.
   */
  tone?: 'ink' | 'accent' | 'mute'
  /** Override the deck's icon series for this icon only. */
  variant?: IconStyle
  /** Accessible label. Omit for decorative icons (the default). */
  label?: string
  className?: string
}

export function Icon({ name, size = 48, tone = 'ink', variant, label, className }: IconProps) {
  const deckStyle = useIconStyle()
  const Glyph = ICONS[name]
  if (!Glyph) return null
  return <Glyph weight={WEIGHT[variant ?? deckStyle]} size={`calc(${size} * var(--u))`} className={`icon is-${tone}${className ? ` ${className}` : ''}`} alt={label} />
}

export type { IconName }
