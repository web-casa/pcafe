# 收尾

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 19 个模板。返回索引：[../templates.md](../templates.md)。

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

### `FolioContact` 作品轨问答预约（收尾 · 常见问题与预约）
- 适合：作品集或服务介绍的最后一页；想把顾虑和预约放在一起
- 不适合：要一个完整的月历：用 BookingClose；只是留联系方式：用 Closing
- 上限：kicker ≤ 20 个字符；title ≤ 8 字，sub ≤ 10 字；faqs 3–4 条：q ≤ 16 字，a ≤ 48 字；card.name ≤ 8 字，note ≤ 14 字，status ≤ 8 字，day ≤ 14 字，slots 3–6 个 × ≤ 5 个字符，cta ≤ 8 字，mail ≤ 26 个字符；frames 1–2 张；foot ≤ 24 字
- 参考：src/decks/sig-folio 的 `contact` 页；docs/zh-CN/components.md#folio-contact；交互：点击：展开问题；点时间格，按钮上的时间随之更新

### `DiptychContact` 对页需求单（收尾 · 选项式联系）
- 适合：作品集或服务介绍的最后一页；想让对方几秒钟说清需求
- 不适合：要约具体时间：用 FolioContact 或 BookingClose；只留联系方式：用 Closing
- 上限：title 1–2 行 × ≤ 8 字；groups 2–3 组：label ≤ 10 字，options 2–5 个 × ≤ 6 字；cta ≤ 6 字；note ≤ 24 字；shots 1–3 张
- 参考：src/decks/sig-diptych 的 `contact` 页；docs/zh-CN/components.md#diptych-contact；交互：点击胶囊选择，按钮上的计数弹跳更新

### `MarkerClose` 记号笔收尾（收尾 · 联系方式）
- 适合：个人主页或作品集的最后一页；只想留一个联系方式
- 不适合：要预约时间：用 FolioContact；要收集需求：用 DiptychContact
- 上限：say ≤ 2 行 × 12 字；mail ≤ 24 个字符；copied ≤ 6 字；links 2–4 个 × ≤ 10 个字符
- 参考：src/decks/sig-marker 的 `close` 页；docs/zh-CN/components.md#marker-close；交互：悬停邮箱划出下划线；点击复制并提示

### `AlbumClose` 相册收尾（收尾 · 号召与照片堆）
- 适合：消费产品演示的最后一页；想留一个可以玩一下的小动作
- 不适合：要留联系方式：用 MarkerClose；要收集需求：用 DiptychContact
- 上限：hand ≤ 16 字；title 2 行 × ≤ 8 字；grad ≤ 4 字；lead ≤ 40 字；ctas 每个 ≤ 8 字；note ≤ 24 字；prints 3–8 张
- 参考：src/decks/sig-album 的 `close` 页；docs/zh-CN/components.md#album-close；交互：点击照片堆：最上面一张飞出插回底部，计数更新；悬停时照片摆正

### `SlateConnect` 立体看板集成（收尾 · 集成与号召）
- 适合：讲产品能接入哪些现有工具；SaaS 演示的最后一页号召试用
- 不适合：要列出几十个真实集成：用清单类模板；需要讲接入步骤：用 SlateSteps
- 上限：title 2 行 × ≤ 10 字，可嵌图标块；lead ≤ 50 字；ctas 各 ≤ 8 字；note ≤ 30 字；tools 6–8 个：name ≤ 4 字，mark 1–3 个字符；请用通用类别名，不要写真实品牌
- 参考：src/decks/sig-slate 的 `connect` 页；docs/zh-CN/components.md#slate-connect；交互：光点沿辐条流向中心；悬停工具点亮它的辐条

### `EmberClose` 暗场收尾（收尾 · 号召与提问框）
- 适合：AI 产品演示的最后一页；想让观众带着“现在就去问它一句”离开
- 不适合：需要列出联系方式或二维码：用联系类模板；亮色风格的演示：用 SlateConnect
- 上限：title 2 行 × ≤ 9 字；lead ≤ 36 字；ctas 各 ≤ 8 字；note ≤ 30 字；image 宜用中心留空的光环图
- 参考：src/decks/sig-ember 的 `close` 页；docs/zh-CN/components.md#ember-close；交互：光环缓慢呼吸；提问框自动打字；按钮悬停发出主色光

### `DuskClose` 霞光面板收尾（收尾 · 号召与安装命令）
- 适合：开发者产品演示的最后一页；想让观众带走一行能直接运行的命令
- 不适合：非技术受众：用 SlateConnect 或 EmberClose；需要联系方式或二维码：用联系类模板
- 上限：title 2 行 × ≤ 10 字；lead ≤ 30 字；ctas 各 ≤ 6 字；command ≤ 30 个字符；output 2–4 行 × ≤ 36 个字符
- 参考：src/decks/sig-dusk 的 `close` 页；docs/zh-CN/components.md#dusk-close；交互：点“复制”把命令放进剪贴板；输出逐行打印

### `AgencyBook` 电光蓝预约收尾（收尾 · 预约一次沟通）
- 适合：机构提案、销售演示的最后一页；希望听众当场约下一次沟通
- 不适合：只要一句结束语：用 Closing；线上发布、没有预约环节：用 DuskClose
- 上限：tag ≤ 8 字；title 2–3 行 × ≤ 9 字；lead ≤ 44 字；heading ≤ 12 字；days 4–5 天 [星期, 日期]；slots 3–6 个；cta ≤ 4 字；note ≤ 24 字；contacts 0–4 条：label ≤ 6 字，value ≤ 16 个字符；这一页在 deck 里请设 tone: 'dark'
- 参考：src/decks/sig-agency 的 `book` 页；docs/zh-CN/components.md#agency-book；交互：点日期和时间段选中，按钮文字随之更新；点按钮变成已预约对勾；时间段依次弹出；按钮箭头悬停前移

### `DirectChat` 私信邀约（收尾 · 邀请对方联系或合作）
- 适合：作品集、个人介绍、服务提案的最后一页；想让听众看到“联系我”之后会发生什么
- 不适合：AI 助手的对话演示：用 ChatDemo；只要联系方式：用 Closing
- 上限：messages 3–5 条 × ≤ 40 字；offer 可选：title ≤ 10 字，note ≤ 18 字，price ≤ 10 个字符；after 是插在第几条之后（从 0 数）；quick 2–4 个：label ≤ 5 字，reply ≤ 30 字；status ≤ 12 字；placeholder ≤ 8 字
- 参考：src/decks/mockui 的 `dm` 页；docs/zh-CN/components.md#direct-chat；交互：对话依次出现；点快捷回复会发出消息，出现三个跳点后收到回答；报价卡悬停浮起
