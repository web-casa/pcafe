# 收尾

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 10 个模板。返回索引：[../templates.md](../templates.md)。

### `Closing` 结论（收尾 · 最后一页）
- 适合：整份演示的最后一页
- 不适合：结论超过一句：先把它写短；没有参考资料时不要伪造链接，省略 refs
- 上限：statement ≤ 20 字；follow ≤ 28 字；takeaways 正好 3 条，每条 20–46 字；最后一行只剩一两个字时改写句子；refs 2–5 条，不带协议头；refs 就是这一页的出处，没有单独的 source
- 参考：src/decks/release 的 `closing` 页；docs/zh-CN/components.md#closing

### `ContactPanel` 联系卡（收尾 · 下一步怎么找到你）
- 适合：演示最后一页，给出明确的下一步；销售、合作、招募的收尾
- 不适合：没有真实可用的联系方式：用 Closing；需要放二维码：用 Thanks
- 上限：title ≤ 2 行 × 10 字；lead ≤ 50 字；checks 2–3 条，每条 ≤ 18 字；fields 2–4 项：label ≤ 8 字，value ≤ 28 个字符，只写真实地址；action ≤ 14 字
- 参考：src/decks/launch 的 `contact` 页；docs/zh-CN/components.md#contact-panel

### `Thanks` 致谢与提问（收尾 · 谢谢 + 提问 + 联系方式）
- 适合：演讲结束，进入问答；需要留下多种联系方式
- 不适合：想把下一步行动讲清楚：用 ContactPanel；没有真实联系方式
- 上限：title ≤ 2 行 × 8 字；prompt ≤ 40 字；contacts 2–4 条：label ≤ 6 字，value ≤ 32 个字符；qr 必须是真实二维码
- 参考：src/decks/studio 的 `thanks` 页；docs/zh-CN/components.md#thanks

### `RepeatClosing` 重复字结束页（收尾 · 最后一页）
- 适合：等宽黑风格的结束页；谢谢、提问、下一期预告
- 不适合：要列联系方式：用 ContactPanel 或 Thanks
- 上限：word ≤ 12 个西文字符；title ≤ 2 行 × 10 字；sub ≤ 40 字；chat：name ≤ 8 字，text ≤ 16 字
- 参考：src/decks/mono 的 `closing` 页；docs/zh-CN/components.md#repeat-closing

### `PixelClosing` 像素字结束页（收尾 · 最后一页）
- 适合：贴纸风格的结束页；有一个明确的下一步动作
- 不适合：正式场合：用 Closing
- 上限：big ≤ 10 个西文字符；action ≤ 10 字；sub ≤ 40 字；contacts 0–3 条：label ≤ 6 字，value ≤ 24 字符
- 参考：src/decks/sticker 的 `closing` 页；docs/zh-CN/components.md#pixel-closing

### `CtaBlock` 行动号召区块（收尾 · 下一步做什么）
- 适合：讲完之后告诉听众怎么开始、去哪里、敲什么命令；有一个明确的地址或命令
- 不适合：只想总结观点：用 Closing 或 Recap；步骤超过 4 个：用 StepTrack
- 上限：title 1–2 行，每行 ≤ 10 字；lead ≤ 50 字；command ≤ 44 个字符；commandLabel ≤ 10 字；actions 1–3 个，label ≤ 10 字；steps 2–4 个：title ≤ 10 字，body ≤ 30 字
- 参考：src/decks/v3-p1 的 `start` 页；docs/zh-CN/components.md#cta-block；交互：build 模式下每按一次 → 出现一个步骤

### `StepGrid` 下一步拼格（收尾 · 大标题块加三块步骤）
- 适合：结尾的下一步、行动计划；三件事有先后
- 不适合：步骤超过 3 个：用 Roadmap；只是总结要点：用 Closing
- 上限：steps 正好 3 个；when ≤ 8 字，title ≤ 10 字，body ≤ 40 字，meta ≤ 16 字符；title ≤ 2 行 × 8 字
- 参考：src/decks/sig-neo 的 `steps` 页；docs/zh-CN/components.md#step-grid；交互：按 → 逐块亮起

### `BookingClose` 预约收尾（收尾 · 预约一次沟通）
- 适合：最后一页，邀请对方约一次沟通；想让收尾页有一个能动手的小互动
- 不适合：只留联系方式：用 ContactPanel 或 Closing；需要二维码：用 Thanks
- 上限：badge ≤ 14 字；title ≤ 2 行 × 6 字；lead ≤ 36 字；contacts 2 个：value ≤ 20 个字符，label ≤ 6 字；card.days 14–21 天，slots 3 个 × ≤ 5 个字符
- 参考：src/decks/sig-atelier 的 `book` 页；docs/zh-CN/components.md#booking-close；交互：点击：日期和时段可以选中

### `MonographClose` 三行收尾（收尾 · 联系方式）
- 适合：最后一页，一句话邀请合作；想用大字收尾
- 不适合：需要多个联系人或二维码：用 ContactPanel 或 Thanks；没有合适的图：用 Closing
- 上限：title 正好 3 行 × ≤ 5 字；contacts 2–3 个：value ≤ 20 个字符，label ≤ 8 字；cta ≤ 10 字
- 参考：src/decks/sig-monograph 的 `close` 页；docs/zh-CN/components.md#monograph-close

### `WallClose` 照片墙收尾（收尾 · 行动号召）
- 适合：最后一页，用大量成果给人“已经很多人在用”的感觉；作品、头像、海报这类适合成墙的图
- 不适合：图片少于 6 张：用 PhotoClosing；要留联系方式：用 ContactPanel
- 上限：title ≤ 2 行 × 10 字；lead ≤ 30 字；ctas 每个 ≤ 8 字；note ≤ 20 字；images 6–10 张竖图
- 参考：src/decks/sig-nocturne 的 `close` 页；docs/zh-CN/components.md#wall-close；交互：照片墙持续上下滚动
