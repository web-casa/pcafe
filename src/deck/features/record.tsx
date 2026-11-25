import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pro } from 'virtual:pcafe-licence'
import { CREDIT_URL } from '../../engine/attribution'
import { hotkeyOk } from './ink'
import {
  PIP_SIZES,
  RECORD_MAX_BYTES,
  RECORD_TIMESLICE_MS,
  RECORD_WARN_BYTES,
  buildRecordingFilename,
  clampPipPosition,
  formatRecordBytes,
  formatRecordTime,
  isRecordingUnlocked,
  pickRecorderMimeType,
  resolveRecordingSupport,
  shouldAutoOpenRecorder,
  type PipPoint,
  type PipSizeKey,
} from './record-lib'

type RecordStatus = 'idle' | 'starting' | 'recording' | 'paused'

interface SavedClip {
  url: string
  filename: string
  bytes: number
  note?: string
}

const SIZE_ORDER: PipSizeKey[] = ['sm', 'md', 'lg']

function stopStream(stream: MediaStream | null) {
  if (!stream) return
  for (const track of stream.getTracks()) {
    try {
      track.stop()
    } catch {
      // ignore already-stopped track errors
    }
  }
}

async function acquireDisplayStream(): Promise<MediaStream> {
  const md = navigator.mediaDevices
  const richConstraints = {
    video: { displaySurface: 'browser' } as MediaTrackConstraints,
    audio: true,
    preferCurrentTab: true,
    selfBrowserSurface: 'include',
  } as DisplayMediaStreamOptions
  try {
    return await md.getDisplayMedia(richConstraints)
  } catch (err) {
    // Only retry with simpler constraints for TypeError / OverconstrainedError;
    // preserve NotAllowedError / AbortError when the user cancels the picker.
    if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'AbortError')) {
      throw err
    }
    try {
      return await md.getDisplayMedia({ video: true, audio: true })
    } catch (err2) {
      if (err2 instanceof DOMException && (err2.name === 'NotAllowedError' || err2.name === 'AbortError')) {
        throw err2
      }
      return await md.getDisplayMedia({ video: true })
    }
  }
}

function defaultPipPos(size: number): PipPoint {
  if (typeof window === 'undefined') return { x: 24, y: 24 }
  return clampPipPosition(
    { x: window.innerWidth - size - 28, y: window.innerHeight - size - 78 },
    size,
    { width: window.innerWidth, height: window.innerHeight },
  )
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  window.setTimeout(() => a.remove(), 100)
}

function describeMediaError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return '权限被拒绝或已取消选择。请在浏览器提示中允许屏幕/麦克风/摄像头权限后重试。'
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return '未检测到可用的摄像头或麦克风设备，可关闭对应开关后仅录制画面。'
    }
    if (err.name === 'NotReadableError') {
      return '设备正被其他应用占用，请关闭占用程序或切换录制选项后重试。'
    }
    if (err.name === 'AbortError') {
      return '录制启动已取消。'
    }
  }
  return err instanceof Error && err.message ? err.message : '启动录制失败，请重试。'
}

/**
 * Phase 5A: Browser Picture-in-Picture deck recorder (local export only, zero remote calls).
 * Hotkey: Shift+R opens setup panel; active recording shows a minimal pulsing REC HUD +
 * draggable circular webcam bubble + live mic level meter.
 */
export function RecordStudio({
  title,
  overview,
  triggerCount = 0,
  onRecordingChange,
}: {
  title: string
  overview: boolean
  triggerCount?: number
  onRecordingChange?: (active: boolean) => void
}) {
  const unlocked = useMemo(() => isRecordingUnlocked(pro), [])
  const support = useMemo(() => resolveRecordingSupport(), [])
  const detectedFormat = useMemo(() => pickRecorderMimeType(), [])

  const [panelOpen, setPanelOpen] = useState(() => unlocked && shouldAutoOpenRecorder())
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [hudCompact, setHudCompact] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [liveNotice, setLiveNotice] = useState<string | null>(null)
  const [saved, setSaved] = useState<SavedClip | null>(null)

  // Setup preferences
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [mirrored, setMirrored] = useState(true)
  const [pipSizeKey, setPipSizeKey] = useState<PipSizeKey>('md')
  const [cameraVisible, setCameraVisible] = useState(false)
  const [micMuted, setMicMuted] = useState(false)
  const [hasMicTrack, setHasMicTrack] = useState(false)

  // Live metrics
  const [elapsedSec, setElapsedSec] = useState(0)
  const [recordedBytes, setRecordedBytes] = useState(0)
  const [micLevel, setMicLevel] = useState(0)

  // Draggable PiP bubble coordinates (in viewport px)
  const pipSize = PIP_SIZES[pipSizeKey]
  const [pipPos, setPipPos] = useState<PipPoint>(() => defaultPipPos(PIP_SIZES.md))

  // Media & lifecycle refs (strictly cleaned up on cancel, stop & unmount)
  const disposedRef = useRef(false)
  const startSeqRef = useRef(0)
  const statusRef = useRef<RecordStatus>('idle')
  const displayStreamRef = useRef<MediaStream | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const meterRafRef = useRef<number>(0)
  const chunksRef = useRef<Blob[]>([])
  const bytesRef = useRef<number>(0)
  const startedAtMsRef = useRef<number>(0)
  const pausedTotalMsRef = useRef<number>(0)
  const pauseBeganMsRef = useRef<number>(0)
  const savedUrlRef = useRef<string | null>(null)
  const autoStopNoteRef = useRef<string | undefined>(undefined)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)
  const lastTriggerRef = useRef(triggerCount)

  const setStatusSync = useCallback((next: RecordStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const active = status === 'recording' || status === 'paused'

  useEffect(() => {
    onRecordingChange?.(active)
  }, [active, onRecordingChange])

  // Close setup dialog if overview opens (stay out of the way like KeyHelp).
  useEffect(() => {
    if (overview && statusRef.current === 'idle') {
      setPanelOpen(false)
    }
  }, [overview])

  // Sync camera stream to <video> whenever visible or stream changes.
  useEffect(() => {
    const el = videoElRef.current
    const stream = cameraStreamRef.current
    if (!el || !cameraVisible || !stream) return
    if (el.srcObject !== stream) {
      el.srcObject = stream
      el.play().catch(() => {})
    }
  }, [cameraVisible, status])

  // Re-clamp PiP bubble on window resize or size change.
  useEffect(() => {
    const clampNow = () => {
      setPipPos((p) =>
        clampPipPosition(p, pipSize, { width: window.innerWidth, height: window.innerHeight }),
      )
    }
    clampNow()
    window.addEventListener('resize', clampNow)
    return () => window.removeEventListener('resize', clampNow)
  }, [pipSize])

  const cleanupAudioMeter = useCallback(() => {
    if (meterRafRef.current) {
      cancelAnimationFrame(meterRafRef.current)
      meterRafRef.current = 0
    }
    setMicLevel(0)
    const ctx = audioCtxRef.current
    audioCtxRef.current = null
    if (ctx && ctx.state !== 'closed') {
      ctx.close().catch(() => {})
    }
  }, [])

  const stopCameraTracks = useCallback(() => {
    stopStream(cameraStreamRef.current)
    cameraStreamRef.current = null
    setCameraVisible(false)
    if (videoElRef.current) {
      videoElRef.current.srcObject = null
    }
  }, [])

  const cleanupAllStreams = useCallback(() => {
    cleanupAudioMeter()
    stopStream(displayStreamRef.current)
    displayStreamRef.current = null
    stopStream(micStreamRef.current)
    micStreamRef.current = null
    setHasMicTrack(false)
    stopCameraTracks()
  }, [cleanupAudioMeter, stopCameraTracks])

  // Unmount cleanup (hardware LEDs off, in-flight starts cancelled, blobs revoked).
  useEffect(() => {
    disposedRef.current = false
    return () => {
      disposedRef.current = true
      startSeqRef.current += 1
      const rec = recorderRef.current
      recorderRef.current = null
      if (rec && rec.state !== 'inactive') {
        try {
          rec.onstop = null
          rec.ondataavailable = null
          rec.stop()
        } catch {
          // ignore
        }
      }
      cleanupAllStreams()
      if (savedUrlRef.current) {
        URL.revokeObjectURL(savedUrlRef.current)
        savedUrlRef.current = null
      }
    }
  }, [cleanupAllStreams])

  // Warn before accidental tab close while recording.
  useEffect(() => {
    if (!active) return
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [active])

  // Wall-clock elapsed timer (accurate even if background tab throttles intervals).
  useEffect(() => {
    if (status !== 'recording') return
    const syncElapsed = () => {
      const ms = Math.max(0, Date.now() - startedAtMsRef.current - pausedTotalMsRef.current)
      setElapsedSec(Math.floor(ms / 1000))
    }
    syncElapsed()
    const id = window.setInterval(syncElapsed, 500)
    return () => window.clearInterval(id)
  }, [status])

  // Respond to Controls toolbar Record button clicks.
  useEffect(() => {
    if (triggerCount === lastTriggerRef.current) return
    lastTriggerRef.current = triggerCount
    if (statusRef.current === 'idle') {
      setPanelOpen((o) => !o)
    } else if (statusRef.current === 'recording' || statusRef.current === 'paused') {
      setHudCompact(false)
    }
  }, [triggerCount])

  // Hotkey: Shift+R toggles panel (when idle) or expands HUD (when recording); Esc closes idle panel.
  useEffect(() => {
    if (overview) return
    const onKey = (e: KeyboardEvent) => {
      if (!hotkeyOk(e)) return
      if (e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        if (statusRef.current === 'idle') {
          setPanelOpen((o) => !o)
        } else if (statusRef.current === 'recording' || statusRef.current === 'paused') {
          setHudCompact(false)
        }
      } else if (e.key === 'Escape' && statusRef.current === 'idle') {
        setPanelOpen((open) => {
          if (open) e.preventDefault()
          return false
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview])

  const closeIdlePanel = useCallback(() => {
    if (statusRef.current === 'starting') {
      // Cancel any in-flight permission/startup sequence cleanly.
      startSeqRef.current += 1
      setStatusSync('idle')
    }
    setPanelOpen(false)
  }, [setStatusSync])

  const toggleCameraPreview = useCallback(async () => {
    setError(null)
    if (cameraStreamRef.current) {
      stopCameraTracks()
      return
    }
    if (!support.canUseCamera) {
      setError('当前浏览器不支持摄像头预览。')
      return
    }
    const seq = ++startSeqRef.current
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      })
      if (disposedRef.current || startSeqRef.current !== seq) {
        stopStream(stream)
        return
      }
      cameraStreamRef.current = stream
      setCameraOn(true)
      setCameraVisible(true)
    } catch (err) {
      if (!disposedRef.current) {
        setError(describeMediaError(err))
      }
    }
  }, [stopCameraTracks, support.canUseCamera])

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current
    if (!rec) {
      cleanupAllStreams()
      setStatusSync('idle')
      return
    }
    if (rec.state !== 'inactive') {
      try {
        rec.stop()
      } catch {
        cleanupAllStreams()
        setStatusSync('idle')
      }
    }
  }, [cleanupAllStreams, setStatusSync])

  const startRecording = useCallback(async () => {
    if (!unlocked || !support.supported || !detectedFormat) return
    if (statusRef.current !== 'idle') return

    // Synchronous atomic guard against double-start races
    const seq = ++startSeqRef.current
    setStatusSync('starting')
    setError(null)
    setLiveNotice(null)
    autoStopNoteRef.current = undefined

    // Clear previous saved clip so a new empty/failed run never resurfaces stale data
    if (savedUrlRef.current) {
      URL.revokeObjectURL(savedUrlRef.current)
      savedUrlRef.current = null
    }
    setSaved(null)

    let displayStream: MediaStream | null = null
    let micStream: MediaStream | null = null
    let freshCamStream: MediaStream | null = null
    let localAudioCtx: AudioContext | null = null

    const isAborted = () => disposedRef.current || startSeqRef.current !== seq

    try {
      // 1. Create & warm up AudioContext AND request display capture FIRST inside the
      //    user gesture (critical for Firefox & Safari transient activation + audio policy).
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        try {
          localAudioCtx = new AudioCtx()
          if (localAudioCtx.state === 'suspended') {
            localAudioCtx.resume().catch(() => {})
          }
        } catch {
          localAudioCtx = null
        }
      }

      displayStream = await acquireDisplayStream()
      if (isAborted()) {
        stopStream(displayStream)
        localAudioCtx?.close().catch(() => {})
        return
      }

      const displayVideoTrack = displayStream.getVideoTracks()[0]
      if (!displayVideoTrack || displayVideoTrack.readyState === 'ended') {
        throw new Error('未获取到有效的屏幕视频轨道，请重试并选择要录制的标签页或窗口。')
      }

      const notices: string[] = []

      // 2. Optional camera bubble (reuse existing preview stream if active; degrade gracefully on failure)
      if (cameraOn && !cameraStreamRef.current && support.canUseCamera) {
        try {
          freshCamStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
            audio: false,
          })
          if (isAborted()) {
            stopStream(freshCamStream)
            stopStream(displayStream)
            localAudioCtx?.close().catch(() => {})
            return
          }
          cameraStreamRef.current = freshCamStream
          setCameraVisible(true)
        } catch {
          notices.push('摄像头未授权，已仅录制画面')
        }
      } else if (!cameraOn && cameraStreamRef.current) {
        stopCameraTracks()
      }

      // 3. Optional microphone stream (degrade gracefully if denied/unavailable)
      if (micOn && support.canUseCamera) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
            video: false,
          })
          if (isAborted()) {
            stopStream(micStream)
            stopStream(freshCamStream)
            stopStream(displayStream)
            localAudioCtx?.close().catch(() => {})
            return
          }
        } catch {
          notices.push('麦克风不可用，已继续录制')
        }
      }

      // Guard against the user clicking browser's "Stop sharing" while camera/mic dialogs were open.
      if ((displayVideoTrack.readyState as MediaStreamTrackState) === 'ended') {
        throw new Error('屏幕共享已提前结束，请重新开始录制。')
      }

      // 4. Build final recorded MediaStream (mix tab audio + mic audio only if AudioContext is running)
      const combinedTracks: MediaStreamTrack[] = [displayVideoTrack]
      const displayAudioTracks = displayStream
        .getAudioTracks()
        .filter((t) => t.readyState !== 'ended')
      const micAudioTrack =
        micStream?.getAudioTracks().find((t) => t.readyState !== 'ended') ?? null

      if (localAudioCtx && (micAudioTrack || displayAudioTracks.length > 0)) {
        if (localAudioCtx.state === 'suspended') {
          await localAudioCtx.resume().catch(() => {})
          if (isAborted()) {
            stopStream(micStream)
            stopStream(freshCamStream)
            stopStream(displayStream)
            localAudioCtx.close().catch(() => {})
            return
          }
        }

        if (localAudioCtx.state === 'running') {
          audioCtxRef.current = localAudioCtx
          const shouldMix = Boolean(micAudioTrack && displayAudioTracks.length > 0)
          const dest = shouldMix ? localAudioCtx.createMediaStreamDestination() : null

          if (micAudioTrack) {
            const micSource = localAudioCtx.createMediaStreamSource(
              new MediaStream([micAudioTrack]),
            )
            const analyser = localAudioCtx.createAnalyser()
            analyser.fftSize = 256
            micSource.connect(analyser)
            if (dest) micSource.connect(dest)

            const bins = new Uint8Array(analyser.frequencyBinCount)
            let lastSample = 0
            const pollLevel = (now: number) => {
              if (disposedRef.current) return
              if (now - lastSample > 65) {
                lastSample = now
                analyser.getByteTimeDomainData(bins)
                let sumSq = 0
                for (let i = 0; i < bins.length; i++) {
                  const v = (bins[i] - 128) / 128
                  sumSq += v * v
                }
                const rms = Math.sqrt(sumSq / bins.length)
                setMicLevel(
                  micAudioTrack.enabled && micAudioTrack.readyState === 'live'
                    ? Math.min(1, rms * 3.8)
                    : 0,
                )
              }
              meterRafRef.current = requestAnimationFrame(pollLevel)
            }
            meterRafRef.current = requestAnimationFrame(pollLevel)
          }

          if (dest && displayAudioTracks.length > 0) {
            const dispSource = localAudioCtx.createMediaStreamSource(
              new MediaStream(displayAudioTracks),
            )
            dispSource.connect(dest)
            const mixedTrack = dest.stream.getAudioTracks()[0]
            if (mixedTrack) combinedTracks.push(mixedTrack)
          } else if (micAudioTrack) {
            combinedTracks.push(micAudioTrack)
          } else if (displayAudioTracks[0]) {
            combinedTracks.push(displayAudioTracks[0])
          }
        } else {
          // AudioContext remained suspended (e.g. strict Safari autoplay policy) —
          // fall back to raw track instead of routing through a silent destination!
          localAudioCtx.close().catch(() => {})
          localAudioCtx = null
          if (micAudioTrack) combinedTracks.push(micAudioTrack)
          else if (displayAudioTracks[0]) combinedTracks.push(displayAudioTracks[0])
        }
      } else {
        localAudioCtx?.close().catch(() => {})
        localAudioCtx = null
        if (micAudioTrack) combinedTracks.push(micAudioTrack)
        else if (displayAudioTracks[0]) combinedTracks.push(displayAudioTracks[0])
      }

      const finalStream = new MediaStream(combinedTracks)
      const options: MediaRecorderOptions = detectedFormat.mimeType
        ? { mimeType: detectedFormat.mimeType, videoBitsPerSecond: 4_500_000 }
        : { videoBitsPerSecond: 4_500_000 }

      const recorder = new MediaRecorder(finalStream, options)
      displayStreamRef.current = displayStream
      micStreamRef.current = micStream
      recorderRef.current = recorder
      chunksRef.current = []
      bytesRef.current = 0
      startedAtMsRef.current = Date.now()
      pausedTotalMsRef.current = 0
      pauseBeganMsRef.current = 0
      setElapsedSec(0)
      setRecordedBytes(0)
      setMicMuted(false)
      setHasMicTrack(Boolean(micAudioTrack))
      if (notices.length) setLiveNotice(notices.join('；'))

      if (micAudioTrack) {
        micAudioTrack.addEventListener(
          'ended',
          () => {
            if (!disposedRef.current) {
              setHasMicTrack(false)
              setMicLevel(0)
              setLiveNotice('麦克风已断开，画面录制继续中')
            }
          },
          { once: true },
        )
      }

      recorder.ondataavailable = (ev) => {
        if (!ev.data || ev.data.size === 0) return
        chunksRef.current.push(ev.data)
        bytesRef.current += ev.data.size
        setRecordedBytes(bytesRef.current)
        if (bytesRef.current >= RECORD_MAX_BYTES && recorder.state !== 'inactive') {
          autoStopNoteRef.current = '已达到单次录制内存安全上限（800 MB），已自动停止并保存。'
          try {
            recorder.stop()
          } catch {
            // ignore
          }
        }
      }

      recorder.onerror = () => {
        if (!disposedRef.current) {
          setError('录制过程发生编码错误，已尝试保存已录制片段。')
        }
        stopRecording()
      }

      recorder.onstop = () => {
        const chunks = chunksRef.current
        chunksRef.current = []
        recorderRef.current = null
        const mime = recorder.mimeType || detectedFormat.mimeType || 'video/webm'
        const ext: 'mp4' | 'webm' = mime.toLowerCase().includes('mp4') ? 'mp4' : 'webm'
        cleanupAllStreams()
        if (disposedRef.current) return
        setStatusSync('idle')
        setHudCompact(false)
        setLiveNotice(null)

        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: mime })
          if (savedUrlRef.current) {
            URL.revokeObjectURL(savedUrlRef.current)
          }
          const url = URL.createObjectURL(blob)
          savedUrlRef.current = url
          const filename = buildRecordingFilename(title, ext)
          triggerDownload(url, filename)
          setSaved({
            url,
            filename,
            bytes: blob.size,
            note: autoStopNoteRef.current,
          })
        } else {
          setError('录制时间过短或未捕获到视频数据，未生成文件。')
          setPanelOpen(true)
        }
      }

      // If user clicks browser's native "Stop sharing" button, finish and save gracefully.
      displayVideoTrack.addEventListener(
        'ended',
        () => {
          if (recorder.state !== 'inactive') {
            try {
              recorder.stop()
            } catch {
              // ignore
            }
          }
        },
        { once: true },
      )

      recorder.start(RECORD_TIMESLICE_MS)
      setPanelOpen(false)
      setStatusSync('recording')
    } catch (err) {
      stopStream(displayStream)
      stopStream(micStream)
      if (freshCamStream) {
        stopStream(freshCamStream)
        if (cameraStreamRef.current === freshCamStream) {
          cameraStreamRef.current = null
          setCameraVisible(false)
        }
      }
      if (localAudioCtx && localAudioCtx !== audioCtxRef.current) {
        localAudioCtx.close().catch(() => {})
      }
      cleanupAudioMeter()
      if (!disposedRef.current) {
        setStatusSync('idle')
        setError(describeMediaError(err))
      }
    }
  }, [
    cameraOn,
    cleanupAllStreams,
    cleanupAudioMeter,
    detectedFormat,
    micOn,
    setStatusSync,
    stopCameraTracks,
    stopRecording,
    support.canUseCamera,
    support.supported,
    title,
    unlocked,
  ])

  const togglePause = useCallback(() => {
    const rec = recorderRef.current
    if (!rec) return
    if (rec.state === 'recording' && typeof rec.pause === 'function') {
      rec.pause()
      pauseBeganMsRef.current = Date.now()
      setStatusSync('paused')
    } else if (rec.state === 'paused' && typeof rec.resume === 'function') {
      rec.resume()
      if (pauseBeganMsRef.current > 0) {
        pausedTotalMsRef.current += Math.max(0, Date.now() - pauseBeganMsRef.current)
        pauseBeganMsRef.current = 0
      }
      setStatusSync('recording')
    }
  }, [setStatusSync])

  const toggleMicMute = useCallback(() => {
    const track = micStreamRef.current?.getAudioTracks()[0]
    if (!track) return
    track.enabled = !track.enabled
    setMicMuted(!track.enabled)
  }, [])

  // Privacy-first: turning camera off stops the hardware tracks immediately (LED off!).
  const toggleLiveCamera = useCallback(async () => {
    if (cameraVisible || cameraStreamRef.current) {
      stopCameraTracks()
      return
    }
    if (!support.canUseCamera) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      })
      if (disposedRef.current || statusRef.current === 'idle') {
        stopStream(stream)
        return
      }
      cameraStreamRef.current = stream
      setCameraVisible(true)
    } catch {
      if (!disposedRef.current) {
        setLiveNotice('无法开启摄像头（权限未允许或设备被占用）')
      }
    }
  }, [cameraVisible, stopCameraTracks, support.canUseCamera])

  const cyclePipSize = useCallback(() => {
    setPipSizeKey((cur) => SIZE_ORDER[(SIZE_ORDER.indexOf(cur) + 1) % SIZE_ORDER.length])
  }, [])

  const dismissSaved = useCallback(() => {
    if (savedUrlRef.current) {
      URL.revokeObjectURL(savedUrlRef.current)
      savedUrlRef.current = null
    }
    setSaved(null)
  }, [])

  // Pointer drag handlers for circular PiP bubble
  const onPipPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { dx: e.clientX - pipPos.x, dy: e.clientY - pipPos.y }
  }

  const onPipPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    setPipPos(
      clampPipPosition(
        { x: e.clientX - dragRef.current.dx, y: e.clientY - dragRef.current.dy },
        pipSize,
        { width: window.innerWidth, height: window.innerHeight },
      ),
    )
  }

  const onPipPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const canPause =
    typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.prototype.pause === 'function'
  const nearLimit = recordedBytes >= RECORD_WARN_BYTES

  return (
    <>
      {/* Draggable circular webcam PiP bubble */}
      {cameraVisible && cameraStreamRef.current && (
        <div
          className="rec-pip"
          style={{
            left: `${pipPos.x}px`,
            top: `${pipPos.y}px`,
            width: `${pipSize}px`,
            height: `${pipSize}px`,
          }}
          onPointerDown={onPipPointerDown}
          onPointerMove={onPipPointerMove}
          onPointerUp={onPipPointerUp}
          onPointerCancel={onPipPointerUp}
          onDoubleClick={cyclePipSize}
          aria-label="摄像头画中画（拖拽移动，双击调整尺寸）"
        >
          <video
            ref={videoElRef}
            className={`rec-pip__video${mirrored ? ' is-mirrored' : ''}`}
            autoPlay
            muted
            playsInline
          />
          <div className="rec-pip__tools">
            <button type="button" onClick={cyclePipSize} title="切换尺寸">
              {pipSizeKey.toUpperCase()}
            </button>
            <button type="button" onClick={() => setMirrored((m) => !m)} title="镜像翻转">
              镜像
            </button>
            <button type="button" onClick={stopCameraTracks} title="关闭摄像头">
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Active recording floating HUD (no aria-live on ticking timer to avoid SR spam) */}
      {active && (
        <div
          className={`rec-hud${hudCompact ? ' rec-hud--compact' : ''}`}
          role="region"
          aria-label="录制状态栏"
        >
          <span className={`rec-dot${status === 'paused' ? ' rec-dot--paused' : ''}`} />
          <span className="rec-timer">{formatRecordTime(elapsedSec)}</span>
          {!hudCompact && (
            <>
              {hasMicTrack && (
                <span className="rec-meter" aria-label={micMuted ? '麦克风已静音' : '麦克风音量'}>
                  {[0.18, 0.34, 0.52, 0.72, 0.9].map((threshold, idx) => {
                    const activeBar = !micMuted && micLevel >= threshold * 0.65
                    const h = activeBar ? Math.min(14, 4 + Math.round(micLevel * 12) + idx) : 3
                    return <i key={idx} style={{ height: `${h}px`, opacity: activeBar ? 1 : 0.25 }} />
                  })}
                </span>
              )}
              <span className={`rec-size${nearLimit ? ' rec-size--warn' : ''}`}>
                {formatRecordBytes(recordedBytes)}
              </span>
              {liveNotice && <span className="rec-hud__note">{liveNotice}</span>}
              {canPause && (
                <button type="button" className="rec-hud__btn" onClick={togglePause}>
                  {status === 'paused' ? '继续' : '暂停'}
                </button>
              )}
              {support.canUseCamera && (
                <button type="button" className="rec-hud__btn" onClick={toggleLiveCamera}>
                  {cameraVisible ? '关镜头' : '开镜头'}
                </button>
              )}
              {hasMicTrack && (
                <button
                  type="button"
                  className={`rec-hud__btn${micMuted ? ' rec-hud__btn--muted' : ''}`}
                  onClick={toggleMicMute}
                >
                  {micMuted ? '已静音' : '静音'}
                </button>
              )}
              <button
                type="button"
                className="rec-hud__btn"
                onClick={() => setHudCompact(true)}
                title="收起状态条（Shift+R 展开）"
              >
                收起
              </button>
            </>
          )}
          {hudCompact && (
            <button type="button" className="rec-hud__btn" onClick={() => setHudCompact(false)}>
              展开
            </button>
          )}
          <button type="button" className="rec-hud__btn rec-hud__btn--stop" onClick={stopRecording}>
            停止保存
          </button>
        </div>
      )}

      {/* Setup / Pro Upgrade modal */}
      {panelOpen && !active && (
        <div
          className="rec-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="画中画录课"
          onClick={closeIdlePanel}
        >
          <div className="rec-panel" onClick={(e) => e.stopPropagation()}>
            <div className="rec-panel__head">
              <div className="rec-panel__title">
                <span>画中画录课</span>
                <span className={`rec-panel__badge${unlocked ? '' : ' rec-panel__badge--pro'}`}>
                  {unlocked ? '本地导出' : 'Pro'}
                </span>
              </div>
              <button
                type="button"
                className="rec-panel__close"
                aria-label="关闭"
                onClick={closeIdlePanel}
              >
                ×
              </button>
            </div>

            {!unlocked ? (
              <>
                <p className="rec-panel__desc">
                  浏览器内一键录制演讲画面、可拖拽圆形摄像头画中画与麦克风配音，直接导出本地视频文件，零上传更私密。
                </p>
                <ul className="rec-pro-list">
                  <li>可拖拽圆形摄像头浮层（支持开关摄像头仅录麦与 3 档尺寸）</li>
                  <li>完整保留 PCafe 动效、激光笔（L）、画笔批注（D）与局部放大（Z）</li>
                  <li>自动选择 MP4 (H.264) / WebM (VP9)，录制结束即时下载到本地</li>
                </ul>
                <div className="rec-panel__actions">
                  <button type="button" className="rec-btn" onClick={closeIdlePanel}>
                    稍后再说
                  </button>
                  <a
                    className="rec-btn rec-btn--light"
                    href={CREDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    了解 PCafe Pro
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="rec-panel__desc">
                  完全在本地浏览器完成录制与封装，不会上传任何音视频数据。开始后请选择「当前标签页」以完整录制幻灯片与画中画镜头。
                </p>

                {!support.supported && (
                  <p className="rec-panel__notice">{support.reasonZh}</p>
                )}
                {error && <p className="rec-panel__error">{error}</p>}

                <div className="rec-panel__rows">
                  <div className="rec-row">
                    <div className="rec-row__label">
                      <strong>摄像头画中画</strong>
                      <span>可拖拽圆形浮层，关闭则仅录屏幕与麦克风</span>
                    </div>
                    <button
                      type="button"
                      className="rec-toggle"
                      aria-label="开关摄像头画中画"
                      aria-pressed={cameraOn}
                      disabled={!support.canUseCamera}
                      onClick={() => {
                        const next = !cameraOn
                        setCameraOn(next)
                        if (!next && cameraStreamRef.current) stopCameraTracks()
                      }}
                    />
                  </div>

                  <div className="rec-row">
                    <div className="rec-row__label">
                      <strong>麦克风讲解</strong>
                      <span>录制实时人声并显示电平，自动与标签页音频混音</span>
                    </div>
                    <button
                      type="button"
                      className="rec-toggle"
                      aria-label="开关麦克风讲解"
                      aria-pressed={micOn}
                      disabled={!support.canUseCamera}
                      onClick={() => setMicOn((v) => !v)}
                    />
                  </div>

                  {cameraOn && (
                    <>
                      <div className="rec-row">
                        <div className="rec-row__label">
                          <strong>画中画尺寸</strong>
                          <span>录制过程中也可双击浮层快速切换</span>
                        </div>
                        <div className="rec-sizes">
                          {SIZE_ORDER.map((k) => (
                            <button
                              key={k}
                              type="button"
                              className={pipSizeKey === k ? 'is-active' : undefined}
                              onClick={() => setPipSizeKey(k)}
                            >
                              {k === 'sm' ? '小' : k === 'md' ? '中' : '大'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rec-row">
                        <div className="rec-row__label">
                          <strong>摄像头镜像</strong>
                          <span>自拍视角左右镜像翻转</span>
                        </div>
                        <button
                          type="button"
                          className="rec-toggle"
                          aria-label="开关摄像头镜像"
                          aria-pressed={mirrored}
                          onClick={() => setMirrored((v) => !v)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="rec-panel__meta">
                  <span>导出格式：{detectedFormat?.label ?? '不支持'}</span>
                  <span>快捷键：Shift + R</span>
                </div>

                <div className="rec-panel__actions">
                  {cameraOn && support.canUseCamera && (
                    <button
                      type="button"
                      className="rec-btn"
                      onClick={toggleCameraPreview}
                      disabled={status === 'starting'}
                    >
                      {cameraVisible ? '关闭镜头预览' : '预览摄像头'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="rec-btn rec-btn--primary"
                    disabled={!support.supported || status === 'starting'}
                    onClick={startRecording}
                  >
                    {status === 'starting' ? '请求权限中…' : '开始录制'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post-recording saved toast with direct re-download */}
      {saved && !active && (
        <div className="rec-saved" role="status" aria-live="polite">
          <span>
            {saved.note
              ? saved.note
              : `录制已保存（${formatRecordBytes(saved.bytes)}）`}
          </span>
          <a href={saved.url} download={saved.filename}>
            重新下载
          </a>
          <button type="button" onClick={dismissSaved}>
            关闭
          </button>
        </div>
      )}
    </>
  )
}
