# 印刷和长图

海报、易拉宝、A4 三折页和信息长图。尺寸按实物来定：一份源文件产出带出血和裁切标记的 PDF、PNG，以及一个可以离线预览的 HTML 文件。

```bash
npx pcafe print new my-poster       # 新建 src/prints/my-poster/
npx pcafe print dev my-poster       # 预览
npx pcafe print check my-poster     # 类型检查、导出、QA；最后一行是 PASS 或 FAIL
npx pcafe print build my-poster     # 写出 dist/print/my-poster.html 和 dist/print/my-poster/
```

模板里每种格式一个文件：在 `index.tsx` 里保留要用的那一行导出，删掉其他文件。完成的标准是 `PASS`，并且按原尺寸看过每张 PNG，看过 `qa/print/<name>/` 里的参考线图（标出安全区、折线和隐藏区）。每个数字的依据和出处见 [`plans/research-print.md`](../../plans/research-print.md)。

## 选预设

| 成品 | `format` | `preset` |
| --- | --- | --- |
| 海报 | `poster` | `poster-a3`、`poster-a2`、`poster-a1`、`poster-50x70` |
| 易拉宝 | `rollup` | `rollup-80x200`、`rollup-60x160`、`rollup-85x200` |
| A4 三折页 | `trifold` | `trifold-a4` |
| 信息长图 | `long` | `long-1080`、`long-750` |

```tsx
export const print = definePrint({
  title: '月球海报',
  format: 'poster',
  preset: 'poster-50x70',
  theme: 'cobalt',
  style: 'editorial',
  viewing: { distanceM: 3, readM: 1.2, nearM: 0.6 },
  render: () => (
    <Stack grow gap={12}>
      <Title lines={['一张海报', '只说一件事']} mark={[1]} fit />
      <Kit part=".race__board" label="排名" dw={780} dh={760}>
        <RankingRace kicker="" title="" periods={YEARS} items={ITEMS} show={7} />
      </Kit>
      <Sources>来源：机构、标题、年份。</Sources>
    </Stack>
  ),
})
```

## 规则

- **先说在哪里看。** 海报和易拉宝的最小字号由 `viewing` 决定：`distanceM` 对应标题，`readM` 对应正文，`nearM` 对应出处。放不下就删字，不要缩字号。
- **每个事实的出处都印在成品上。** 长图的出处写在每一段上，因为切片可能被单独发出去。
- **虚构内容必须写 `sample`。** 每一页都会印上标注。
- **易拉宝：** 向印厂问清楚实际隐藏高度，写进 `hiddenBottomMm` 和 `topBarMm`。默认的 150 mm 只是偏保守的取值，不是哪家印厂的规格，不同支架差别很大。
- **三折页：** 外面从左到右依次是内折页、封底、封面，内折页窄 3 mm，文字要避开折线。宽度请和印厂模板核对。
- **长图：** `slices: ['wechat', 'xhs']` 会同时切片，切口都在段与段之间。某一段比一张切片还高时，QA 不通过。
- **Emoji：** 印刷默认用 `noto`，始终是矢量。`fluent` 也够清晰，但文件会大很多。

## 使用组件

`Kit` 显示模板里的一个部分，不带幻灯片外框。`dw` 和 `dh` 是排版用的幻灯片尺寸，含外框边距（横向 144u，纵向 236u）；`dw` 小于 1000 时改成单栏。这些选择器测试过：`.x2-sf__board`、`.x2-od__row`、`.x2-tm__wordbox`、`.x2-ta__art`、`.v35nine__row`、`.v35ana`、`.v35verb`、`.v35tier`、`.line`、`.sarea`、`.race__board`、`.miles`、`.steps__list`、`.metrics`、`.claims`、`.glow`、`.cluster`。

## 产物

| 文件 | 用途 |
| --- | --- |
| `<name>-print.pdf` | 成品尺寸加出血，外加 8 mm 放裁切标记 |
| `<name>-bleed.pdf` | 正好是成品尺寸加出血，给自己加标记的印厂 |
| `<name>-proof.pdf` | 成品尺寸，用于屏幕查看；易拉宝只显示可见区域 |
| `<name>.png` | 成品预览；三折页是 `-outside` 和 `-inside` 两张 |
| `<name>.pdf`、`<name>.png`、`slices/` | 长图 |

## QA 检查什么

安全区、溢出、重叠、PDF 页面框是否精确、字体是否嵌入、按声明距离计算的物理字号、图片分辨率、对比度、文字是否跨折线、易拉宝隐藏区里有没有内容、切片是否切断段落、数字有没有出处，以及页面就绪后文字是否还在变化。`node scripts/print-selftest.mjs` 会验证每条规则确实能报错。

## 已知限制

- **颜色：** 浏览器只能输出 RGB，文件不是 PDF/X，也没有输出意图。请印厂用自己的配置转 CMYK，并把黑色文字映射成 100 K。高饱和的蓝和紫偏色最明显，包括 `cobalt` 和 `violet` 配色；颜色重要时请先打样。
- **字体：** 以 Type 3 形式嵌入，部分印前检查工具会给出警告。
- **没有上机验证：** 这些文件都没有经过真实印刷机或 RIP。大批量印刷前，请和印厂确认尺寸、出血和隐藏高度。
- **平台限制：** 公众号和小红书的长图数字来自第三方资料，不是平台官方规格。
- **观看距离：** QA 只按你声明的距离计算。
