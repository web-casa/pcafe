export interface RecorderFormat {
  mimeType: string
  ext: 'mp4' | 'webm'
  label: string
}

export interface PipPoint {
  x: number
  y: number
}

export interface PipBounds {
  width: number
  height: number
}

export type PipSizeKey = 'sm' | 'md' | 'lg'

export const PIP_SIZES: Record<PipSizeKey, number> = {
  sm: 144,
  md: 196,
  lg: 256,
}

export const RECORD_TIMESLICE_MS = 2000
export const RECORD_WARN_BYTES = 400 * 1024 * 1024 // 400 MiB soft warning
export const RECORD_MAX_BYTES = 800 * 1024 * 1024 // 800 MiB safety ceiling (keeps final Blob well within tab RAM)

export const RECORD_MIME_CANDIDATES: readonly RecorderFormat[] = [
  { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4', label: 'MP4 (H.264)' },
  { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4', label: 'MP4 (H.264)' },
  { mimeType: 'video/mp4', ext: 'mp4', label: 'MP4' },
  { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm', label: 'WebM (VP9)' },
  { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm', label: 'WebM (VP8)' },
  { mimeType: 'video/webm', ext: 'webm', label: 'WebM' },
]

/**
 * Picks the best container/codec supported by MediaRecorder, preferring MP4/H.264
 * when available and falling back cleanly to VP9/VP8/generic WebM.
 */
export function pickRecorderMimeType(
  isTypeSupported?: (mimeType: string) => boolean,
  hasMediaRecorder = typeof MediaRecorder !== 'undefined',
): RecorderFormat | null {
  if (!hasMediaRecorder) return null
  const check =
    isTypeSupported ??
    (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function'
      ? (m: string) => MediaRecorder.isTypeSupported(m)
      : undefined)
  if (check) {
    for (const candidate of RECORD_MIME_CANDIDATES) {
      try {
        if (check(candidate.mimeType)) return candidate
      } catch {
        // Ignore browser quirks throwing on unknown codec strings.
      }
    }
  }
  return { mimeType: '', ext: 'webm', label: 'WebM' }
}

/** Formats elapsed recording seconds as MM:SS or HH:MM:SS. */
export function formatRecordTime(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.floor(totalSeconds) : 0
  const hrs = Math.floor(safe / 3600)
  const mins = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  const mm = String(mins).padStart(2, '0')
  const ss = String(secs).padStart(2, '0')
  return hrs > 0 ? `${String(hrs).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`
}

/** Formats byte counts into compact human-readable strings (e.g. 12.4 MB). */
export function formatRecordBytes(bytes: number): string {
  const safe = Number.isFinite(bytes) && bytes > 0 ? bytes : 0
  if (safe < 1024) return `${Math.round(safe)} B`
  if (safe < 1024 * 1024) return `${(safe / 1024).toFixed(1)} KB`
  if (safe < 1024 * 1024 * 1024) return `${(safe / (1024 * 1024)).toFixed(1)} MB`
  return `${(safe / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/** Builds a safe, collision-resistant local download filename for a recording. */
export function buildRecordingFilename(
  title: string,
  ext: 'mp4' | 'webm',
  now: Date = new Date(),
): string {
  const cleaned = (title || '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 60)
  const base = cleaned || 'pcafe-recording'
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `${base}-${stamp}.${ext}`
}

/** Keeps the circular PiP bubble within viewport/stage bounds with a margin. */
export function clampPipPosition(
  pos: PipPoint,
  size: number,
  bounds: PipBounds,
  margin = 20,
): PipPoint {
  const w = Number.isFinite(bounds.width) && bounds.width > 0 ? bounds.width : size + margin * 2
  const h = Number.isFinite(bounds.height) && bounds.height > 0 ? bounds.height : size + margin * 2
  const effMarginX = w >= size + margin * 2 ? margin : Math.max(0, Math.floor((w - size) / 2))
  const effMarginY = h >= size + margin * 2 ? margin : Math.max(0, Math.floor((h - size) / 2))
  const maxX = Math.max(effMarginX, w - size - effMarginX)
  const maxY = Math.max(effMarginY, h - size - effMarginY)
  return {
    x: Math.min(maxX, Math.max(effMarginX, Number.isFinite(pos.x) ? pos.x : maxX)),
    y: Math.min(maxY, Math.max(effMarginY, Number.isFinite(pos.y) ? pos.y : maxY)),
  }
}

export interface RecordingSupportEnv {
  hasMediaRecorder: boolean
  hasGetDisplayMedia: boolean
  hasGetUserMedia: boolean
  isSecureContext: boolean
  protocol: string
}

export interface RecordingSupportResult {
  supported: boolean
  canUseCamera: boolean
  reasonZh?: string
  reasonEn?: string
}

export function resolveRecordingSupport(env?: Partial<RecordingSupportEnv>): RecordingSupportResult {
  const win = typeof window !== 'undefined' ? window : undefined
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  const hasMediaRecorder = env?.hasMediaRecorder ?? typeof MediaRecorder !== 'undefined'
  const hasGetDisplayMedia =
    env?.hasGetDisplayMedia ?? Boolean(nav?.mediaDevices && typeof nav.mediaDevices.getDisplayMedia === 'function')
  const hasGetUserMedia =
    env?.hasGetUserMedia ?? Boolean(nav?.mediaDevices && typeof nav.mediaDevices.getUserMedia === 'function')
  const isSecureContext = env?.isSecureContext ?? (win ? Boolean(win.isSecureContext) : true)
  const protocol = env?.protocol ?? (win?.location?.protocol ?? '')

  if (!hasMediaRecorder) {
    return {
      supported: false,
      canUseCamera: hasGetUserMedia,
      reasonZh: '当前浏览器不支持 MediaRecorder 录制，请使用桌面版 Chrome / Edge / Firefox 或新版 Safari。',
      reasonEn: 'MediaRecorder is not supported in this browser. Use desktop Chrome, Edge, Firefox, or a recent Safari.',
    }
  }
  if (!hasGetDisplayMedia) {
    const fileHintZh =
      protocol === 'file:' || !isSecureContext
        ? '当前页面处于受限上下文（如 file:// 或非 HTTPS），浏览器禁用了屏幕采集。请通过 npx pcafe dev / HTTPS 打开，或使用桌面版 Chrome / Edge。'
        : '当前浏览器不支持标签页/屏幕采集（如 iOS Safari），请在桌面版 Chrome / Edge / Firefox 中使用录课功能。'
    const fileHintEn =
      protocol === 'file:' || !isSecureContext
        ? 'Screen capture is disabled in this context (file:// or non-HTTPS). Open via HTTPS or npx pcafe dev in desktop Chrome/Edge.'
        : 'Tab/screen capture is unavailable in this browser (e.g. iOS Safari). Use desktop Chrome, Edge, or Firefox.'
    return {
      supported: false,
      canUseCamera: hasGetUserMedia,
      reasonZh: fileHintZh,
      reasonEn: fileHintEn,
    }
  }
  return {
    supported: true,
    canUseCamera: hasGetUserMedia,
  }
}

interface PcafeRecordGlobals {
  __PCAFE_RECORD_ALLOWED__?: unknown
  __PCAFE_RECORD_DISABLED__?: unknown
  __PCAFE_RECORD_AUTO_OPEN__?: unknown
}

/**
 * Recording is unlocked when built with a valid PCafe Pro licence, OR when explicitly
 * enabled by a trusted Enterprise Vault internal preview host (`editor+` signed token).
 * When hosted in an explicit no-record context (external `/s/*` share or `viewer` preview),
 * `__PCAFE_RECORD_DISABLED__ === true` takes precedence even for Pro-built bundles.
 */
export function isRecordingUnlocked(proFlag: boolean, g: PcafeRecordGlobals = globalThis as PcafeRecordGlobals): boolean {
  if (g.__PCAFE_RECORD_DISABLED__ === true) return false
  return Boolean(proFlag) || g.__PCAFE_RECORD_ALLOWED__ === true
}

export function shouldAutoOpenRecorder(g: PcafeRecordGlobals = globalThis as PcafeRecordGlobals): boolean {
  if (g.__PCAFE_RECORD_DISABLED__ === true) return false
  return g.__PCAFE_RECORD_AUTO_OPEN__ === true
}
