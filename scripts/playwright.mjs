// One launch path for every QA script: find a cached Chromium, fall back to
// Playwright's own resolution, and give one clear instruction when it is absent.
import { chromium } from 'playwright'

export async function launchChromium(options = {}) {
  const attempts = []
  if (options.executablePath) attempts.push(options)
  attempts.push({ ...options, executablePath: undefined })
  let last
  for (const attempt of attempts) {
    try {
      return await chromium.launch(attempt)
    } catch (error) {
      last = error
    }
  }
  const message = String(last?.message ?? last)
  if (/executable doesn't exist|browserType\.launch|failed to launch|enoent|not found|playwright install/i.test(message)) {
    console.error('Playwright Chromium is not installed. Run: npx playwright install chromium')
    process.exit(1)
  }
  throw last
}
