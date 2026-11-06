# 氛围

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 3 个模板。返回索引：[../templates.md](../templates.md)。

### `Halftone` 半调滤镜图（氛围 · 图片转成网点或抖动）
- 适合：想用图片营造质感，又不想让照片抢走注意力；装饰图和主题色要统一
- 不适合：图片是证据、需要看清细节：用 Screenshot；图很暗或很平：网点会糊成一片
- 上限：kicker 2–8 字；title 1–3 行 × ≤ 8 字；lead ≤ 60 字；facts 0–3 个：value ≤ 6 个字符，label ≤ 12 字；cell 8–24，默认 14；有 facts 时配 build: reveal 逐个出现
- 参考：src/decks/v2-p5 的 `what` 页；docs/zh-CN/components.md#halftone

### `ProgressiveBlur` 渐进模糊大图（氛围 · 整页图片加标题）
- 适合：章节开场、场景引入；图片上半部分有好看的主体
- 不适合：图片主体在下半部分：会被模糊掉；要讲多条要点：用内容模板
- 上限：title 1–2 行 × ≤ 14 字；lead ≤ 56 字；tags 0–3 个，每个 ≤ 8 字；配 tone: dark，backdrop 设为 none；PDF 里模糊会简化
- 参考：src/decks/v2-p5 的 `reef` 页；docs/zh-CN/components.md#progressive-blur

### `TextArc` 环形排字（氛围 · 一句话绕成圆环）
- 适合：有一句可以反复念的短语、口号；编辑感的章节页或印象页
- 不适合：环上的文字需要仔细阅读：放进正文；没有能放在圆心的词或数字
- 上限：title ≤ 2 行 × 8 字；lead ≤ 60 字；points 0–3 条，每条 ≤ 24 字；ring 16–44 个单位（拉丁字符算 1，汉字算 2），用 “ · ” 重复补满一圈；拉丁大写效果最好，汉字沿弧线会侧转；center ≤ 5 个字符，centerLabel ≤ 8 字
- 参考：src/decks/v2-p2 的 `desolation` 页；docs/zh-CN/components.md#text-arc；交互：圆环是一个 build 步骤，出现时转入定位，之后静止
