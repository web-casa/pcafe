// Wording hints for audience-facing copy: stock AI phrases, vague attribution, empty closers.
// Hints only. They never fail a check; a phrase that is accurate in context can stay.
// Sources (all MIT): the first Chinese rules adapt oil-tone's tone_lint.py ((c) 2026 oil-oil); the
// nominalisation rules adapt shuorenhua's hard_metrics.py ((c) 2026 MrGeDiao); the English staging rules
// follow blader/humanizer's pattern list, itself drawn from Wikipedia's "Signs of AI writing".
//
//   node scripts/copy-lint.mjs <file or dir> ...   print hints for .ts/.tsx/.json/.md files
//   node scripts/copy-lint.mjs --self-test
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

/** [id, pattern, hint]. Ids are stable so tools can filter on them. */
export const RULES = [
  ['zh.buzzword', /赋能|撬动|抓手|沉淀价值|价值落地/, 'Say what it does or what changes instead of the buzzword.'],
  ['zh.lead-in', /原因很简单|真正重要的是|真正的关键是|这不仅仅?是|从更大的角度看/, 'Drop the lead-in unless it carries the argument; state the fact or judgement.'],
  ['zh.era-opener', /(?:在当今|在当前).{0,16}(?:时代|背景|环境)下/, 'Cut the scene-setting unless it adds information.'],
  ['zh.trend-opener', /随着.{0,16}(?:不断|持续)(?:发展|演变|变化)/, 'Keep the trend only if it is tied to what follows.'],
  ['zh.filler', /值得注意的是|需要指出的是|毋庸置疑|不可否认的是?/, 'Remove stock lead-ins that do no qualifying or contrasting.'],
  ['zh.milestone', /(?:标志着|代表着).{0,24}(?:重要|关键)(?:一步|时刻|转折点)/, 'Name the confirmed action, change or result instead.'],
  ['zh.foundation', /为.{1,24}奠定(?:了)?(?:坚实的?)?基础/, 'Say which concrete condition or result follows.'],
  ['zh.importance', /(?:彰显|凸显|体现)(?:了)?.{0,20}(?:重要性|意义|价值)/, 'Check the material supports this claim of importance.'],
  ['zh.vague-source', /(?:业内|行业|专家|观察者)(?:普遍)?(?:认为|指出|表示)/, 'Name the source (and put it in source), or cut the attribution.'],
  ['zh.vague-users', /(?:很多|不少|部分)用户(?:认为|指出|表示|反馈)/, 'Back user claims with a named source, or cut them.'],
  ['zh.vague-study', /(?:有|相关|多项|大量)研究(?:均)?(?:表明|显示|指出)/, 'Name the study in source; never add a source the material lacks.'],
  ['zh.empty-tail', /从而确保|进而体现|进一步彰显|反映了更深层次/, 'Check the closing clause has a real cause or support.'],
  ['zh.despite', /尽管.{0,24}(?:挑战|困难).{0,24}(?:仍|依然|未来)/, 'State the confirmed limit, result or next step directly.'],
  ['zh.upbeat-ending', /未来可期|迈出(?:了)?(?:至关重要|重要|关键)的一步|开启(?:了)?(?:全新|新的?)篇章/, 'Replace the generic upbeat ending with a concrete result or next step.'],
  ['zh.chat-residue', /当然可以|这是一个(?:非常|很)?好的问题|你说得(?:完全)?正确|希望这对(?:你|您)有帮助|如需更多(?:信息|帮助).{0,8}(?:请)?(?:随时)?(?:告诉我|联系我)/, 'Remove chat leftovers from published copy.'],
  ['zh.double-hedge', /(?:可能|或许|也许|在一定程度上|在某种程度上).{0,8}(?:可能|或许|也许|在一定程度上|在某种程度上)/, 'Keep one hedge that matches how certain the fact is.'],
  ['zh.nominalized', /进行(?:了|一次|一场|着)?[^。，！？\n]{0,10}(?:调整|优化|升级|分析|讨论|沟通|梳理|复盘|迭代|探索|尝试|思考|规划|布局|评估|排查|验证)|完成了?对[^。，！？\n]{0,16}的[^。，！？\n]{0,8}工作|起到了?[^。，！？\n]{0,12}的?作用|开展[^。，！？\n]{0,10}(?:工作|建设|研究|合作)/, 'Use the verb itself: "调整了重试策略", not "进行了重试策略的调整".'],
  ['zh.halfwidth-punct', /[\u4e00-\u9fff][,;!?](?=\s|[\u4e00-\u9fff]|$)|[\u4e00-\u9fff]: ?[\u4e00-\u9fff]/, 'Use full-width punctuation in Chinese text (，；！？：).'],
  ['en.not-x-but-y', /\b(?:it(?:'s| is)|this is|that(?:'s| is)) not (?:just|only|merely) (?:a |an |about )?[\w -]{1,30}[,;—–-]+ ?(?:it(?:'s| is)|but)\b/i, 'State the point directly instead of staging a reveal.'],
  ['en.run-up', /\b(?:here'?s the thing|let'?s dive in|let'?s break it down|at its core|the bottom line is|honestly\?)/i, 'Drop the run-up and state the point.'],
  ['en.closer', /\b(?:let that sink in|and that'?s the real win|the future (?:looks|is) bright|only time will tell)\b/i, 'Remove the one-line closer, or replace it with a concrete result.'],
  ['en.inflated-verb', /\b(?:serves as a|boasts (?:a|an)|stands as a)\b/i, 'Use "is" or "has".'],
  ['en.limits-disclaimer', /\b(?:while (?:specific )?details are limited|as of my (?:last|knowledge)|based on available information)\b/i, 'State what the source shows, or remove the sentence.'],
  ['en.era-opener', /\bin today['’]s (?:fast-paced|digital|ever-changing|rapidly evolving)\b|\bin an era of\b/i, 'Cut the scene-setting unless it adds information.'],
  ['en.buzzword', /\b(?:delve|leverage[sd]?|seamless(?:ly)?|unlock(?:s|ed)? the|elevate[sd]?|game[- ]changer|cutting[- ]edge|supercharge[sd]?)\b/i, 'Say what it does or what changes instead of the buzzword.'],
  ['en.filler', /\bit(?:['’]s| is) (?:worth noting|important to note)\b|\bneedless to say\b/i, 'Remove stock lead-ins that do no qualifying or contrasting.'],
  ['en.vague-source', /\b(?:studies|research|experts|analysts) (?:show|shows|suggest|suggests|say|agree)\b/i, 'Name the source (and put it in source), or cut the attribution.'],
  ['en.testament', /\ba testament to\b|\bpaves? the way\b|\bmarks? a (?:new|pivotal|significant) (?:era|chapter|milestone)\b/i, 'Name the concrete result instead.'],
  ['en.chat-residue', /\bI hope this helps\b|\bgreat question\b|\bcertainly!|\blet me know if\b/i, 'Remove chat leftovers from published copy.'],
]

const EXT = new Set(['.ts', '.tsx', '.json', '.md'])
const SKIP_DIR = new Set(['node_modules', 'assets', 'dist', 'qa'])

/** Audience-visible text on a line: quoted strings and JSX text, without comments. */
function segments(line, ext) {
  if (ext === '.md') return [line.replace(/`[^`]*`/g, ' ')]
  const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')
  const out = []
  for (const m of code.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) out.push((m[1] ?? m[2] ?? m[3]).replace(/\\(.)/g, '$1'))
  for (const m of code.matchAll(/>([^<>{}]+)</g)) out.push(m[1])
  if (ext === '.tsx' && /^\s*[^\s<>{}()=;:,'"`][^<>{}=;]*$/.test(code) && !/^\s*(?:import|export|const|let|return|if|for|type|interface)\b/.test(code)) out.push(code)
  return out.filter((s) => /[\p{L}]/u.test(s))
}

export function lintText(text, ext = '.md') {
  const hits = []
  let inBlock = false
  text.split('\n').forEach((line, i) => {
    if (ext !== '.md') {
      if (inBlock) { if (line.includes('*/')) inBlock = false; return }
      if (/^\s*\/\*/.test(line) && !line.includes('*/')) { inBlock = true; return }
    }
    for (const seg of segments(line, ext)) {
      for (const [id, re, hint] of RULES) {
        const m = seg.match(re)
        // A phrase in quotes is being mentioned ("avoid “赋能”"), not used.
        if (m && /[“「"'‘]/.test(seg[m.index - 1] ?? '') && /[”」"'’]/.test(seg[m.index + m[0].length] ?? '')) continue
        if (m) hits.push({ id, line: i + 1, phrase: m[0], text: seg.trim().slice(0, 60), hint })
      }
    }
  })
  return hits
}

function files(path) {
  const st = statSync(path)
  if (st.isFile()) return EXT.has(extname(path)) ? [path] : []
  return readdirSync(path).flatMap((f) => (SKIP_DIR.has(f) ? [] : files(join(path, f))))
}

/** Hints for every source file under the given paths. */
export function copyLint(paths, root = process.cwd()) {
  return paths.flatMap(files).flatMap((f) =>
    lintText(readFileSync(f, 'utf8'), extname(f)).map((h) => ({ ...h, file: relative(root, f) })),
  )
}

export function printHints(hints) {
  for (const h of hints) console.log(`hint  ${h.code ?? `copy.${h.id}`}  ${h.file}:${h.line}  "${h.text}"\n      ${h.hint}`)
  if (hints.length) console.log(`note: ${hints.length} hint${hints.length > 1 ? 's' : ''} on wording or structure (not failures; keep what is accurate)`)
}

function selfTest() {
  const bad = [
    'title: "在当今快速变化的时代下，团队需要保持敏捷。"',
    "body: '随着人工智能技术的不断发展，工具越来越多。'",
    '<p>值得注意的是，这项功能已经发布。</p>',
    "lead: '这标志着产品迈出了重要一步。'",
    "lead: '这次更新为后续增长奠定了坚实的基础。'",
    "body: '这体现了自动化的重要性。'",
    "body: '业内普遍认为，这种方案更可靠。'",
    "body: '有研究表明，这种方案更可靠。'",
    "body: '产品完成升级，未来可期。'",
    "body: '这项政策可能在一定程度上或许会影响结果。'",
    "title: 'In today\\'s fast-paced world, teams must adapt.'",
    "body: 'Studies show that this approach works.'",
    "body: 'This is a testament to the team.'",
    '<p>We leverage AI to delve into data.</p>',
    "body: '本周我们进行了重试策略的调整。'",
    "body: '团队完成了对配置文件的检查工作。'",
    "body: '这个模块起到了关键作用。'",
    "body: '先装好依赖,再运行检查。'",
    "body: 'It is not just a tool, it is a shift.'",
    'body: "Here\'s the thing: it depends."',
    "body: 'The library serves as a bridge.'",
    "body: 'Let that sink in.'",
  ].join('\n')
  const good = [
    "title: '2025 年 3 月接口升级后，旧版客户端无法继续登录。'",
    "body: '清华大学发布的报告显示，样本中的响应时间缩短了 12%。'",
    "body: '这项政策可能影响结果。'",
    "body: 'The 2025 Ember review shows solar at 8.7% of global power.'",
    "// 值得注意的是 this is a code comment, not copy",
    "const unlockTheDoor = leverage(1)",
    "body: '本周我们调整了重试策略，重复请求从每天 24 次降到了 7 次。'",
    "body: '对象存储按键（key）读写，键可以写成 photos/2026/a.jpg。'",
    "body: '版本 v1.8.0 起支持离线模式：先下载，再打开。'",
    "body: 'API: GET /v1/items?limit=20'",
    "body: '这不是教程，是一份速查表。'",
    "body: 'Solar was 8.7% of global power in 2025, not 1.1% as in 2015.'",
    "body: 'The engine renders each frame; the result is a real MP4.'",
    "title: '中文 English, 混排'",
  ].join('\n')
  const badLines = new Set(lintText(bad, '.tsx').map((h) => h.line))
  const goodHits = lintText(good, '.tsx')
  const missed = bad.split('\n').map((_, i) => i + 1).filter((n) => !badLines.has(n))
  if (missed.length || goodHits.length) {
    console.log(`FAIL  copy lint self-test: missed lines ${missed.join(', ') || 'none'}; false hits ${JSON.stringify(goodHits)}`)
    return 1
  }
  console.log('PASS  copy lint self-test')
  return 0
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  if (args[0] === '--self-test') process.exit(selfTest())
  if (!args.length) { console.error('usage: node scripts/copy-lint.mjs <file or dir> ... | --self-test'); process.exit(2) }
  const hints = copyLint(args)
  printHints(hints)
  if (!hints.length) console.log('no wording hints')
}
