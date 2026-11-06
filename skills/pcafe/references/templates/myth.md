# 辟谣

> 由 `npm run docs` 从 `src/kit/catalog.ts` 和 `src/kit/theme.ts` 生成，请勿手改。

共 1 个模板。返回索引：[../templates.md](../templates.md)。

### `ClaimCards` 说法核查（辟谣 · 逐条给结论）
- 适合：澄清行业里流传的误解；对一组主张逐条给出证据等级
- 不适合：只有一两条：写进别的页面的 lead；结论没有出处：这一页的全部价值在于依据
- 上限：claims 正好 4 或 6 条（2 × 2 或 3 × 2）；claim ≤ 22 字，按人们通常的说法写，模板自动加引号；verdict 五选一：false 错误、unsupported 缺乏依据、disputed 存在争议、partial 部分有依据、supported 有依据；note ≤ 36 字，写最关键的一条证据；tag ≤ 16 个字符，用英文主题词
- 参考：src/decks/geo 的 `claims` 页；docs/zh-CN/components.md#claim-cards；交互：印章依次盖下；错误说法随后被一条强调色横线划掉。悬停卡片会抬起。
