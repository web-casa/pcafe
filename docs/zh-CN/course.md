# 互动课程

一个离线 HTML 文件就是一节自学课：简短的讲解，每个答案都有解释的练习，还可以加一个模拟实验。不需要服务器，也不需要账号。

```bash
npx pcafe course new s3-basics       # 生成 src/courses/s3-basics/index.tsx
npx pcafe course dev s3-basics       # 预览
npx pcafe course check s3-basics     # 类型检查、构建、QA，最后一行是 PASS 或 FAIL
npx pcafe course build s3-basics     # 输出 dist/course/s3-basics.html
```

文件放在 `src/courses/<name>/index.tsx`。写完要跑到 `PASS`，并看过 `qa/course/<name>/desktop/` 和 `qa/course/<name>/phone/` 里的截图。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次运行类型检查 → 构建 → QA。首次运行若没装浏览器，会打印这条安装命令并以非零状态退出。检查和构建都不再需要 Python 或系统字体：CJK 子集随仓库提交，`npm run fonts:verify` 负责校验；`npm run fonts` 只给维护者重新生成子集。`build` 不跑 QA，所以要在 `check` 之后用，不能代替它。

QA 的刷新测试至少需要四道不是闪卡的题，起始模板正好四道，删题时要注意。`course new` 会把 `id` 设成课程名。`id` 是保存学习进度用的键，课程改动大到旧进度没有意义时，要换一个。

## 一门课

`CourseDef` 只有数据，绘制、判分和保存进度都由引擎完成。

| 字段 | 用途 |
| --- | --- |
| `id` | 存储键。课程改动大到旧进度没有意义时，就改它 |
| `title`、`lead` | 封面文字。`lead` 是一句话 |
| `lang`、`theme`、`iconStyle`、`look` | `zh` 或 `en`；配色；图标系列；`editorial` 或 `formal` |
| `minutes` | `[下限, 上限]`，你的估算。封面上会标明是估算 |
| `objectives` | 学完能做的 3–5 件事 |
| `hero` | 封面插图，必须能说明内容 |
| `concepts` | `{ key: { label, review } }`。`review` 是答错后送学习者回去的步骤 id。每个概念至少要有一道练习 |
| `sources` | `{ key: { org, title, url?, note? } }`。各步骤引用这里的 key |
| `sections` | `{ id, title, steps }` |

每一步是下面三种之一：

| `kind` | 字段 | 计分 |
| --- | --- | --- |
| `read` | `id`、`title`、`blocks`、`cites`、`illustrative?` | 否 |
| `practice` | `id`、`concept`、`exercise`、`cites`、`pretest?` | 是，`pretest` 和闪卡除外 |
| `lab` | `id`、`concept`、`title`、`lead`、`simulation`、`tasks`、`render`、`solve`、`cites` | 否 |

`pretest` 是开场题，学习者多半会答错。它会揭晓答案并给出解释，但不计分。

## 练习

| `type` | 字段 | 规则 |
| --- | --- | --- |
| `single` | `prompt`、`options`、`given?` | 只有一个正确项，3–6 个选项 |
| `multi` | `prompt`、`options`、`given?` | 至少一对一错，3–6 个选项 |
| `truefalse` | `statement`、`answer`、`why` | |
| `order` | `prompt`、`items`、`ends?`、`why` | `items` 按正确顺序写，3–6 项，引擎会打乱。用上下按钮，不用拖动 |
| `match` | `prompt`、`pairs`、`decoys?` | 3–5 对 `left`、`right`、`why`。先点空位，再点选项 |
| `cloze` | `prompt`、`text`、`why`、`mono?` | 空格写成 `{{答案\|别名}}`。不区分大小写，忽略首尾空格和全角半角 |
| `flashcards` | `prompt`、`cards` | 至少 2 张。学习者自评，永不计分。标为“没想起来”的卡片会回到重做轮 |

`single` 和 `multi` 的每个选项都有 `text`、`correct?` 和自己的 `why`，对错都要写，两个选项不能共用一条。`given` 是一组 `{ label, value }`，替学习者先答好前几步，做成渐隐的例题。

算分只看第一次作答，之后不会覆盖，也不能当场重答。结果页按概念汇报，并提供两种回合：重做轮只练答错的题；复习轮最多 8 道计分题，优先挑仍然答错的。任何一步都可以跳过，也可以从目录打开。

## 内容上限

按字符计算，每个字符都算 1，英文字母也一样。行内的 `*` 和 `` ` `` 不算。超出就 FAIL。

| 字段 | 上限 |
| --- | --- |
| 步骤 `title`（read、lab） | 26 |
| `prompt` | 90 |
| `statement` | 70 |
| 选项 `text` | 70 |
| 所有 `why` | 10–110 |
| 闪卡 `front`、`back` | 90 |
| 任务 `text` | 44 |
| 讲解步骤的 `blocks` | 6 |

`src/course/types.ts` 还要求这些，但 QA 不检查：章节 `title` ≤ 16，课程 `lead` ≤ 60，概念 `label` ≤ 12，每条目标 ≤ 40，配对和实验任务的 `why` ≤ 90。

## 讲解步骤可用的版块

`Lead`、`P`、`Bullets`、`Note`、`Code`、`Figure`（`illustrative` 标明是示意）、`Facts`（2–4 个数字）、`Compare`（2–3 列）、`Ladder`（3–6 行）、`Timeline`（3–5 站）、`Worked`（每条理由点开才显示）和 `SlideFigure`（一张 kit 幻灯片，必须提供手机用的 `narrow` 版本）。从 `../../course` 引入。像起始模板那样，给 `blocks` 里的每个元素写 React `key`。

## 实验

`render` 会收到已完成的任务、`complete` 函数和任务清单。`simulation` 是说明“这是模拟”的那句话，和实验一起显示，必填。`solve` 是一段由 `{ click }`、`{ fill: [选择器, 文字] }` 和 `{ expect }` 组成的脚本，让 QA 能用鼠标、手指和键盘把实验走一遍。

QA 的手机测试还会按 `[data-fill]` 和 `[data-send]`，并查找 `[data-response]`，所以实验没有这些属性就会 FAIL。可以参考 `src/courses/object-storage/S3Lab.tsx`。

## 规则

- 一步只讲一个想法。放不下就拆成两步。
- 先写练习，再写练习需要的讲解。
- 每条 `why` 都要说明这个答案为什么对，或者它代表哪种错误。这套设计依据的研究显示，只判对错的反馈帮助很小（见代码仓库的 `plans/research-course.md`）。
- 事实必须有出处。练习和实验必须引用来源；讲解步骤要么引用来源，要么写 `illustrative: true`，表示没有陈述外部事实。查不到出处的事实不要写。虚构的场景要标明是虚构。
- 课程内容里不放照片和装饰图，它们会分散新手的注意力。`Figure` 用来说明内容。
- 不用积分、连续打卡、计时器和记忆留存百分比。不要声称一门课能带来学习提升，这一点没有测量过。

## QA 检查什么

QA 在 Chromium 里不靠人工把整节课走完：1440 px 宽用鼠标、390 px 宽用触屏，各走一遍全对和一遍全错，再只用键盘走一遍。还会走重做轮和复习轮、刷新后继续、存储被禁用、写满和损坏的情况、目录抽屉，以及每一步的深链接。

每一屏检查：横向滚动、只有一个 `h1`、控件有名称、点击目标不小于 24×24 px、文字不小于 11 px、对比度、图片有 `alt`、没有网络请求。每次作答后检查：判定正确、有文字和图标而不是只靠颜色、读屏软件能读到的状态区域、每个选项都有解释、显示引用的来源。结果页检查：数字加得起来，打印时保留表格和错题。`src/course/validate.ts` 里的所有规则在这里也会 FAIL：上面的上限、缺 `cites`、未知概念、没有练习的概念、没有计分题、来源列表为空。

结果在 `qa/course/<name>/report.json`。

## 已知限制

- 答案就写在 HTML 文件里，谁都能读到。课程只用于自学，不能用于考试。
- 进度只存在 `localStorage`，也就是这台设备的这个浏览器里。移动或重命名文件、清理浏览器数据、关闭隐私窗口都会丢失进度。页面上会说明这一点，打印结果页是唯一能长期保留的记录。这个文件也发不了提醒。
- 只测过 Chromium。没有跑过 Safari 和 Firefox，也没有用真实的读屏软件测试：QA 检查的是角色、名称和实时区域的文字，不是读出来的效果。
- 还没有真实的学习者用过。研究说明的是设计为什么这样做，这里没有任何东西证明一节课能产生那些效果。
- 封面上的时间是根据内容量的估算，没有人实际计时。
