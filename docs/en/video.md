# Animated video

Renders the same React scenes to an MP4, frame by frame on a virtual clock. There is no screen recording: on the same machine and Chromium build, a slow run gives the same frames as a fast one.

```bash
npx pcafe video new my-video         # creates src/videos/my-video/index.tsx
npx pcafe video dev my-video         # preview
npx pcafe video check my-video       # typecheck, render, QA; last line is PASS or FAIL
npx pcafe video build my-video       # writes dist/video/my-video.mp4 and .frames.json
```

Files live in `src/videos/<name>/index.tsx`. You are done at `PASS`, after looking at `qa/video/<name>/contact.png` and at full-size frames with `--still` at the moments that matter: mid-animation, end of scene, inside a transition.

`check` needs `ffmpeg` and `ffprobe` on your PATH and Playwright's Chromium (`npx playwright install chromium`), and runs typecheck → render → QA. If the browser is missing on the first run, it prints that install command and exits non-zero. No Python or system fonts are needed: the CJK subsets ship with the repo and `npm run fonts:verify` checks them; `npm run fonts` is maintainer-only. `build` skips QA, so use it after a `check`, not instead of one.

In the preview, Space plays and pauses, ← and → step one frame, and S shows the safe area on a tall video. The preview runs the same clock and scenes as the renderer. It plays slower than real time if a step takes longer than a frame.

For the things the CLI does not do, call the scripts directly:

```bash
node scripts/video-render.mjs my-video --still 1.5,7.25       # PNG stills in qa/video/my-video/
node scripts/video-render.mjs my-video --from 12 --to 18      # a range, dist/video/my-video.part.mp4
node scripts/video-render.mjs my-video --audio track.m4a      # adds a track you have the rights to
node scripts/video-selftest.mjs                               # proves capture is frame-accurate on this machine
```

`check` clears `qa/video/<name>/`, so take stills after it. Run the selftest after upgrading Chromium or Motion; its last line is PASS or FAIL.

## A video

```tsx
import { LineChart } from '../../kit'
import type { VideoDef } from '../../video'

export const video: VideoDef = {
  title: 'Title',
  size: '16:9',          // or '9:16'
  fps: 30,               // default; 24, 25, 30, 50 or 60
  theme: 'amber',
  style: 'mono-studio',
  transition: 'fade',    // cut, fade, push, wipe, rise
  preroll: 1,            // seconds already played at frame 0, so the first frame is not empty
  scenes: [
    {
      id: 'growth',
      duration: 5,
      caption: 'One sentence, burned in.',
      render: () => <LineChart {...props} source="Where it came from" />,
    },
  ],
}
```

`SceneDef`:

| Field | Use |
| --- | --- |
| `duration` | Seconds from this scene's start to the next scene's start |
| `render` | One kit template (16:9), or a portrait scene (9:16) |
| `caption` | A string for the whole scene, or `[{ at, to?, text }]` |
| `steps` | Seconds at which each `data-build` group appears. One entry per group |
| `build` | `reveal` (default) or `focus` |
| `transition`, `transitionTime` | How this scene arrives, default 0.5 s |
| `tone` | `dark`, `accent` or `light`, same rule as slides |
| `source` | Source line on a 9:16 scene. Kit templates show their own |
| `noFacts` | Title card with no fact, so QA does not ask for a source |
| `maxHold`, `minHold` | Longest still (3.5 s) and shortest still before the cut (0.8 s) |

Every fact needs a source on screen, and estimates and illustrations must say so. Same rules as slides. If you cannot find a source, leave the fact out.

A scene with a caption in 16:9 draws the slide at 90% and puts the caption in the band below, through `--u`, so text stays sharp.

## Portrait

Kit templates are 1920×1080 and do not reflow. A slide letterboxed into a tall frame has text too small to read on a phone, so 9:16 scenes use the parts in `src/video/portrait.tsx`:

| Part | Use |
| --- | --- |
| `Tall` | Kicker and title around a scene body |
| `HeroNumber` | One huge counting figure and its sentence |
| `DrawnLine` | Line that draws while a readout follows its head |
| `Waffle` | 100 cells, one per cent, filling year by year |
| `RankBars` | Ranked bars growing in turn |
| `Slides` | Before and after on one axis |
| `TallClose` | Closing card |
| `Count` | A counting number for your own layout |

Each value is computed from `useSceneTime()`, so a part is defined at any frame. For a new part use the helpers in `src/video/anim.ts` and read only from that hook. Don't start Motion or CSS animations inside a portrait part if a pure function can do it.

Text must stay in `PORTRAIT_SAFE` (top 270, right 216, bottom 500, left 60 of 1080×1920). No platform we checked publishes a number for this that we could read, so it is a conservative estimate from community figures. See `plans/research-video.md` in the repository. Check the real app before a paid campaign.

## What QA checks

- ffprobe: H.264 High, yuv420p, BT.709 matrix, primaries, transfer and limited range, exact frame rate, size, frame count and duration, `moov` before `mdat`, audio only if requested
- Blank stretches, a blank first or last frame, freezes, and brightness flashes in transitions, all in the encoded file
- Pacing from frame hashes: nothing stuck past `maxHold`, at least `minHold` on the end state before a cut, a visible change across each cut
- In a browser: caption overflow, more than 2 lines, length (34 characters, 32 on 9:16), reading speed (9 characters per second), text outside the safe area, small text (under 15 px, 24 px on 9:16), a source on every fact scene, build steps matching build groups, nothing left hidden at scene end
- Contact sheet and last frame of each scene in `qa/video/<name>/`

## Audio

No scene plays sound. `--audio file` muxes one track as AAC, 48 kHz stereo, cut to the video's length with a one-second fade out. The place to change this is `encoder()` in `scripts/video-render.mjs`. Voice timing is not synced to scenes; set scene durations to match your track.

`video check` and `video build` render without audio and overwrite the MP4, so do the audio render last. To audit that file, run `node scripts/video-qa.mjs my-video` after it.

## Known limits

- Frames are identical only on the same machine and Chromium build, including when the CPU is throttled. Other machines may raster text differently. Only Linux arm64 was tested.
- `<video>`, canvas animation, SMIL and GIF are not on the virtual clock.
- Not every kit template has been rendered to video, only those in the demos and the selftest.
- 16:9 and 9:16 only, one track of audio, no voice-to-caption sync.
- The portrait safe area is a conservative estimate, not a figure from any platform.
