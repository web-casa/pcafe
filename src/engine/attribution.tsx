// Attribution required by the PCafe licence (CPAL-1.0, Exhibit B): works made
// with the free edition show "Made with PCafe" linked to https://p.cafe. Holders
// of a PCafe Pro licence may switch it off with `attribution: false`.
import { pro } from 'virtual:pcafe-licence'

export const CREDIT_URL = 'https://p.cafe'

let warned = false

/** Whether the credit shows. `optOut` is the work's `attribution: false`; it only counts with Pro installed. */
export function creditOn(optOut?: boolean): boolean {
  if (optOut !== false) return true
  if (pro) return false
  if (!warned) {
    warned = true
    console.warn('[pcafe] attribution: false needs PCafe Pro (see LICENSE, Exhibit B). The "Made with PCafe" credit stays on.')
  }
  return true
}

const isZh = () => (typeof document !== 'undefined' ? document.documentElement.lang : '').toLowerCase().startsWith('zh')

export const creditText = (lang?: string) => ((lang ?? (isZh() ? 'zh' : 'en')).toLowerCase().startsWith('zh') ? '由 PCafe 制作' : 'Made with PCafe')

/**
 * The credit link. Followed on purpose (no rel=nofollow). `withUrl` adds " · p.cafe"
 * for output that cannot be clicked (print, images, video).
 */
export function Credit({ className, lang, withUrl = false }: { className?: string; lang?: string; withUrl?: boolean }) {
  return (
    <a className={className ? `pcafe-credit ${className}` : 'pcafe-credit'} href={CREDIT_URL} target="_blank" rel="noopener" data-pcafe-credit="">
      {creditText(lang)}
      {withUrl && <span className="pcafe-credit__url"> · p.cafe</span>}
    </a>
  )
}
