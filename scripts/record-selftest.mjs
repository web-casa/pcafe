#!/usr/bin/env node
/**
 * Self-test for Phase 5A browser PiP deck recording helpers & offline build compliance.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Node 22+ runs strip-types natively on pure TS files; verify record-lib directly.
const libUrl = new URL('../src/deck/features/record-lib.ts', import.meta.url)
const {
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
} = await import(libUrl.href)

// 1. MIME selection priority: MP4 H.264 -> VP9 -> VP8 -> WebM -> fallback
{
  const mp4 = pickRecorderMimeType((m) => m.includes('avc1'), true)
  assert.equal(mp4?.ext, 'mp4')
  assert.match(mp4?.label ?? '', /MP4/)

  const vp9 = pickRecorderMimeType((m) => m.includes('vp9'), true)
  assert.equal(vp9?.ext, 'webm')
  assert.equal(vp9?.mimeType, 'video/webm;codecs=vp9,opus')

  const fallback = pickRecorderMimeType(() => false, true)
  assert.equal(fallback?.ext, 'webm')
  assert.equal(fallback?.mimeType, '')

  const none = pickRecorderMimeType(() => true, false)
  assert.equal(none, null)
}

// 2. Time & byte formatting
{
  assert.equal(formatRecordTime(0), '00:00')
  assert.equal(formatRecordTime(-5), '00:00')
  assert.equal(formatRecordTime(65), '01:05')
  assert.equal(formatRecordTime(3661), '01:01:01')

  assert.equal(formatRecordBytes(0), '0 B')
  assert.equal(formatRecordBytes(512), '512 B')
  assert.equal(formatRecordBytes(1536), '1.5 KB')
  assert.equal(formatRecordBytes(5 * 1024 * 1024), '5.0 MB')
  assert.equal(formatRecordBytes(1.5 * 1024 * 1024 * 1024), '1.50 GB')
}

// 3. Filename sanitization & collision-resistant timestamp
{
  const fixedDate = new Date(2026, 10, 25, 9, 5, 7) // 2026-11-25 09:05:07 local
  const name = buildRecordingFilename('Q4/战略: 汇报*<最终版>?', 'mp4', fixedDate)
  assert.equal(name, 'Q4-战略-汇报-最终版-20261125-090507.mp4')
  assert.ok(!/[<>:"/\\|?*\x00-\x1f]/.test(name))

  const empty = buildRecordingFilename('///   ...', 'webm', fixedDate)
  assert.equal(empty, 'pcafe-recording-20261125-090507.webm')
}

// 4. PiP clamping within viewport bounds
{
  const clampedHigh = clampPipPosition({ x: 9999, y: 9999 }, PIP_SIZES.md, { width: 1280, height: 720 }, 20)
  assert.deepEqual(clampedHigh, { x: 1280 - PIP_SIZES.md - 20, y: 720 - PIP_SIZES.md - 20 })

  const clampedLow = clampPipPosition({ x: -100, y: -50 }, PIP_SIZES.lg, { width: 1280, height: 720 }, 20)
  assert.deepEqual(clampedLow, { x: 20, y: 20 })

  // Tiny viewport narrower than bubble + margins must not overflow right edge
  const clampedTiny = clampPipPosition({ x: 999, y: 999 }, PIP_SIZES.lg, { width: 200, height: 200 }, 20)
  assert.deepEqual(clampedTiny, { x: 0, y: 0 })
}

// 5. Support detection across desktop / iOS Safari / file://
{
  const desktop = resolveRecordingSupport({
    hasMediaRecorder: true,
    hasGetDisplayMedia: true,
    hasGetUserMedia: true,
    isSecureContext: true,
    protocol: 'https:',
  })
  assert.equal(desktop.supported, true)
  assert.equal(desktop.canUseCamera, true)

  const iosSafari = resolveRecordingSupport({
    hasMediaRecorder: true,
    hasGetDisplayMedia: false,
    hasGetUserMedia: true,
    isSecureContext: true,
    protocol: 'https:',
  })
  assert.equal(iosSafari.supported, false)
  assert.match(iosSafari.reasonZh ?? '', /iOS Safari/)

  const fileCtx = resolveRecordingSupport({
    hasMediaRecorder: true,
    hasGetDisplayMedia: false,
    hasGetUserMedia: false,
    isSecureContext: false,
    protocol: 'file:',
  })
  assert.equal(fileCtx.supported, false)
  assert.match(fileCtx.reasonZh ?? '', /file:\/\//)
}

// 6. Pro + Enterprise internal preview unlock & explicit host disable semantics
{
  assert.equal(isRecordingUnlocked(false, {}), false)
  assert.equal(isRecordingUnlocked(true, {}), true)
  assert.equal(isRecordingUnlocked(false, { __PCAFE_RECORD_ALLOWED__: true }), true)
  assert.equal(isRecordingUnlocked(false, { __PCAFE_RECORD_ALLOWED__: 'true' }), false)
  // Host disable flag must override even a Pro-built bundle (e.g. external /s/* share or viewer preview)
  assert.equal(isRecordingUnlocked(true, { __PCAFE_RECORD_DISABLED__: true }), false)
  assert.equal(
    isRecordingUnlocked(true, { __PCAFE_RECORD_ALLOWED__: true, __PCAFE_RECORD_DISABLED__: true }),
    false,
  )
  assert.equal(shouldAutoOpenRecorder({}), false)
  assert.equal(shouldAutoOpenRecorder({ __PCAFE_RECORD_AUTO_OPEN__: true }), true)
  assert.equal(
    shouldAutoOpenRecorder({ __PCAFE_RECORD_AUTO_OPEN__: true, __PCAFE_RECORD_DISABLED__: true }),
    false,
  )
}

// 7. Memory safety thresholds & zero remote URLs in record.tsx / record.css
{
  assert.ok(RECORD_TIMESLICE_MS >= 1000 && RECORD_TIMESLICE_MS <= 5000)
  assert.ok(RECORD_WARN_BYTES < RECORD_MAX_BYTES)
  const recSource = readFileSync(resolve(import.meta.dirname, '../src/deck/features/record.tsx'), 'utf8')
  const cssSource = readFileSync(resolve(import.meta.dirname, '../src/styles/p5/record.css'), 'utf8')
  assert.ok(!/https?:\/\//i.test(recSource), 'record.tsx must not hardcode remote URLs (use CREDIT_URL)')
  assert.ok(!/https?:\/\//i.test(cssSource), 'record.css must not reference remote URLs')
  assert.match(cssSource, /@media print/)
}

console.log('record-selftest: PASS')
