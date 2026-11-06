# 参与贡献：模板、风格与 QA

写演示时不改模板。这份文档写给想给 PCafe 本身加东西的人：新模板、新风格、新配色、新图标。改完都要跑一遍完整检查。

## 原则

- 只有当某类内容反复出现、现有模板都放不下时，才新增模板。能用现有模板拆页、换角度解决的，不加。
- 模板说明（适合、避免、内容上限、props、示例）只写在 `src/kit/catalog.ts` 一处。`docs/*/components.md` 和 `skills/pcafe/references/` 都由它生成，不要手改。
- 不写死颜色：强调色一律用 `var(--accent)`、`var(--accent-ink)`、`var(--accent-wash)`、`var(--accent-soft)`，半透明写 `rgb(var(--accent-rgb) / 0.16)`，否则换配色时不会跟着变。
- 不引用远程资源，不放真实品牌名、Logo、真实公司数据。示例内容保持中性。

## 新增模板

1. 在 `src/kit/` 新建组件，props 继承 `SlideBase`，并用 `SlideHead` / `SlideFoot` 保持统一的头尾样式。
2. 样式写进 `src/styles/` 下对应的样式表，只使用 `u` 单位（`24u` 是设计稿上的 24px）和 `:root` 里的颜色变量。内联 `style` 不经过 `u` 换算，只能放无单位的数值或 CSS 变量。最小字号 17u。
3. 要支持逐条展开时，在每一项的最外层加 `data-build`（`Reveal` 上写 `build`）；几个元素要同时出现时给它们相同的值，比如 `data-build={row}`。同一个数字在相邻两页出现时，可以给它们加同一个 `data-morph`（或在 `Numeral` 上传 `morph`），翻页时会连起来过渡。
4. 在 `src/kit/index.ts` 导出组件，在 `src/kit/catalog.ts` 登记：写清适合、避免、内容上限、props 和示例。风格专属模板在“适合”里写明风格。
5. 在某份示例演示里加一页来演示它，`demo` 指向这一页的 id，`deck` 写这份示例演示的名字。
6. 想支持 `tone: 'dark'` / `'accent'`，要在深色和强调色下都检查过，并更新 [guide.md 第 13 节](guide.md#tone) 的列表。
7. 运行 `npx pcafe docs` 重新生成参考文档，再运行 `npx pcafe check <示例演示名>`。

## 新增风格

风格只改标题和大数字的字体、圆角系数、底色和装饰，不改正文字号和间距，这样每个模板的内容上限在所有风格下都有效。

1. 参照已有的风格预设（例如 `src/kit/styles/bento.ts`）新建一个 `StylePreset`：`label`、`note`（一句话：长什么样、适合什么场合）、`radius`、`paper`，整份默认深色的再加 `tone: 'dark'`。
2. 在 `src/kit/theme.ts` 的 `STYLES` 里登记，样式放进 `src/styles/` 下对应的样式表。
3. 打开 `#/kit/styles`，确认每个模板在新风格下都没有破版；默认深色的风格要逐个检查深色下的可读性。
4. 加一份用这种风格的示例演示，运行 `npx pcafe docs` 和 `npx pcafe check`。

## 新增配色

在 `src/kit/theme.ts` 的 `THEMES` 里加一项，每个字段都要填：`accent`、`ink`、`wash`、`rgb`、`soft`（用在深色背景上）和一组 `paper`（底色、卡片、分隔线往强调色方向偏一点）。在 `#/kit` 用“强调色”切换器把所有模板过一遍。

<a id="add-icon"></a>

## 新增图标

精选集里没有合适的图标时，到 [solar-icons.vercel.app](https://solar-icons.vercel.app) 找名字，在 `src/kit/icon-set.ts` 对应分组里加一行 `name: XxxIcon`（从 `@solar-icons/react/dynamic` 导入），类型检查和图标索引会自动更新。名字要说清它画的是什么：Solar 的 `ScaleIcon` 是体重秤，所以登记为 `weight-scale`，而不是 `scale`。

## QA 规则

`npx pcafe check` 依次运行类型检查、构建和自动 QA，最后一行是 `PASS` 或 `FAIL (n)`。自动 QA 在 1920×1080、1366×768、2560×1440、1440×900 四种窗口下逐页检查：

- 文字是否超出安全区、互相重叠、被容器裁切
- 字号是否小于 17u，字体是否加载
- 是否有外部网络请求
- 翻页键是否被拦截，逐条展开、总览、Bento 详情能否正常进出
- 模板库页面能否正常打开，`catalog.ts` 的 `demo` 是否指向存在的页面
- 页面下半部分是否偏空（只出 WARN）

报错的修法见 [guide.md 第 8 节](guide.md#qa-fixes)。截图存在 `qa/`，结果写在 `qa/report.json`。

QA 抓不到的也要看：逐页打开 `qa/slide-NN-1920x1080.png`，手绘圈、高亮、箭头这类装饰件放大 2 倍检查，位置要对准，强调的内容要和文字一致。

## 重新生成文档

```bash
npx pcafe docs
```

改了 `src/kit/catalog.ts`、风格预设或配色之后都要运行。它会重新生成各语言的 `docs/*/components.md` 和 `skills/pcafe/references/` 下的模板表、风格表。

## 提交前

- `npx pcafe check` 对受影响的示例演示输出 `PASS`
- 截图逐页看过
- `npx pcafe docs` 已运行，生成的文件一起提交
- 新增的第三方字体、图标、代码已写进 `THIRD_PARTY_LICENSES.md`
