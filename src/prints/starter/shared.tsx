// A kit template on a print layout. Swap it for any template in src/kit; the tested part selectors are in docs/en/print.md.
import { StepTrack } from '../../kit'
import { Kit } from '../../print'

const STEPS = [
  { title: '第一步', body: '说明写在这里。' },
  { title: '第二步', body: '说明写在这里。' },
  { title: '第三步', body: '说明写在这里。' },
]

/** `narrow` lays the steps out on a tall canvas, for a tri-fold panel or a long image. */
export function Steps({ narrow }: { narrow?: boolean }) {
  return (
    <Kit part=".steps__list" label="三个步骤" dw={narrow ? 620 : 1300} dh={narrow ? 1200 : 700}>
      <StepTrack kicker="" title="" steps={STEPS} />
    </Kit>
  )
}
