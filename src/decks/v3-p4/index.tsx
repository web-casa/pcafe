// Components v3 · phase 4 (AI and model visuals): a factual briefing on DeepSeek-V4.1-Flash.
// Specs and benchmarks: the official Hugging Face model card. Prices, names and peak hours:
// the DeepSeek API docs (checked 2026-10-30). Token chips, expert picks and attention masks are illustrations.

import type { DeckDef } from '../../kit'
import { AliasRoute, AttentionMask, ContextWindow, Cover, EffortDial, ModelSpecCard, MoeRouter, PeakClock, Recap, ScoreMatrix, TokenPriceGrid, TokenStream } from '../../kit'

const HF = 'DeepSeek-V4.1-Flash 模型卡，Hugging Face（huggingface.co/deepseek-ai，2026）'
const PRICE = 'DeepSeek API 文档 · 模型与价格（api-docs.deepseek.com，2026-10-30 查阅）'
const NEWS = 'DeepSeek API 文档 · 新闻（api-docs.deepseek.com，2026-10-17）'
const MODELS = ['Opus-5.0', 'GPT-5.6 Sol', 'K3', 'GLM-5.3', 'V4-Pro', 'V4.1-Flash']

export const deck: DeckDef = {
  title: 'DeepSeek-V4.1-Flash',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="模型简报 · DeepSeek"
          title={['DeepSeek', 'V4.1-Flash']}
          lead="2026 年 9 月 10 日首发，10 月 17 日更新为 1017 版。这份简报按官方模型卡和 API 文档，看它的结构、成绩和价格。"
          facts={[
            { label: '总参数', value: '552B' },
            { label: '上下文', value: '1M tokens' },
            { label: '许可', value: 'MIT' },
          ]}
          numeral="4.1"
          note={['资料截至', '2026-10-30']}
        />
      ),
    },
    {
      id: 'alias',
      label: '名称',
      build: 'reveal',
      render: () => (
        <AliasRoute
          kicker="先核对名字"
          title="三个 API 名，同一个模型"
          lead="官方名称是 DeepSeek-V4.1-Flash，API 里叫 deepseek-flash。两个 V4-Flash 旧名仍可调用，但已转到新版本，按 Flash 价计费。"
          sources={[
            { name: 'deepseek-flash', tag: '当前' },
            { name: 'deepseek-v4-flash', tag: '旧名', legacy: true },
            { name: 'deepseek-v4-flash-vision-exp', tag: '旧名', legacy: true },
          ]}
          target={{ label: '实际提供服务的版本', name: 'DeepSeek-V4.1-Flash-1017', note: '调用方式与之前相同，旧名对应的模型已退役' }}
          source={`${PRICE}；${NEWS}`}
        />
      ),
    },
    {
      id: 'spec',
      label: '规格',
      build: 'reveal',
      render: () => (
        <ModelSpecCard
          kicker="规格"
          title="大模型，小激活"
          lead="总参数 552B，但每个 token 只用其中一小部分：预填充时激活 8B，解码时 16B。"
          name="DeepSeek-V4.1-Flash"
          tag="deepseek-ai · 开放权重"
          chips={['文本 + 图像输入', '工具调用', '思考模式', 'MIT 许可']}
          params={{ total: 552, active: 16, unit: 'B', activeLabel: '解码时激活' }}
          specs={[
            { label: '层数', value: '40 层：20 层编码 + 20 层解码' },
            { label: '专家', value: '1 个共享 + 384 个路由专家' },
            { label: '注意力', value: '压缩稀疏注意力 CSA2' },
            { label: '预训练', value: '45T tokens 多模态数据' },
            { label: '后训练', value: 'SFT → 强化学习 → 在线蒸馏' },
            { label: '许可', value: 'MIT，覆盖代码与权重' },
          ]}
          source={HF}
        />
      ),
    },
    {
      id: 'moe',
      label: '专家路由',
      build: 'reveal',
      render: () => (
        <MoeRouter
          kicker="混合专家"
          title="每个 token 只走 6 个专家"
          lead="每个 MoE 层有 384 个路由专家和 1 个共享专家。路由器为每个 token 挑 6 个，共享专家每次都参与。"
          experts={384}
          cols={32}
          shared={1}
          routes={[
            { token: '函数', picks: [17, 58, 140, 201, 266, 349], note: '第 1 个 token' },
            { token: '边界', picks: [5, 92, 133, 188, 300, 371], note: '换一组专家' },
            { token: '条件', picks: [40, 77, 159, 230, 255, 322], note: '每层都重新选' },
          ]}
          caption="384 个路由专家，每个 token 激活 6 个。亮格位置为示意"
          source={HF}
        />
      ),
    },
    {
      id: 'attention',
      label: '稀疏注意力',
      build: 'reveal',
      render: () => (
        <AttentionMask
          kicker="注意力"
          title="不是每个词都要看全部"
          lead="稀疏注意力让每个 query 只读一部分 key，长上下文的显存和算力随之下降。左图是通用示意，不是 CSA2 的真实模式。"
          size={12}
          window={3}
          stride={4}
          modes={[
            { label: '全注意力', kind: 'full', note: '每个 query 读全部 key，开销随长度平方增长' },
            { label: '因果', kind: 'causal', note: '生成时只读前面的 token，少一半' },
            { label: '局部窗口', kind: 'window', note: '只读最近的几个 token' },
            { label: '稀疏（CSA2）', kind: 'sparse', note: '每层可设 Full、Reindex 或 Reuse 模式；KV 缓存约 890 字节/token，为 V4-Flash 的 1/4' },
          ]}
          source={HF}
        />
      ),
    },
    {
      id: 'context',
      label: '上下文',
      build: 'reveal',
      render: () => (
        <ContextWindow
          kicker="上下文"
          title="1M 窗口，单次最多输出 384K"
          lead="稀疏注意力先在 64K 长度上训练，预训练进行到 34T tokens 时把上下文扩展到 1M。"
          total={1000}
          totalLabel="1M tokens"
          ticks={[
            { value: 0, label: '0' },
            { value: 250, label: '250K' },
            { value: 500, label: '500K' },
            { value: 750, label: '750K' },
            { value: 1000, label: '1M' },
          ]}
          spans={[
            { value: 64, label: '64K', note: '稀疏注意力的训练长度' },
            { value: 384, label: '384K', note: 'API 单次最大输出' },
            { value: 1000, label: '1M', note: 'API 上下文长度上限' },
          ]}
          source={`${HF}；${PRICE}`}
        />
      ),
    },
    {
      id: 'tokens',
      label: '计费单位',
      build: 'reveal',
      render: () => (
        <TokenStream
          kicker="计费单位"
          title="按 token 计价，分三种"
          lead="同一次请求里，命中缓存的输入、未命中的输入和模型输出各有单价。下面的切分只是示意。"
          label="示意：切分方式仅作演示"
          groups={[
            ['你是', '一名', '代码', '审查', '助手', '。'],
            ['请', '检查', '这段', '函数', '的', '边界', '条件', '？'],
            ['第', '12', '行', '缺少', '空', '值', '判断', '。'],
          ]}
          notes={['重复的前缀：可命中缓存', '新输入：按未命中价', '模型输出：单独计价']}
          source={PRICE}
        />
      ),
    },
    {
      id: 'effort',
      label: '推理强度',
      build: 'reveal',
      render: () => (
        <EffortDial
          kicker="推理强度"
          title="想多久，可以调"
          lead="API 默认开启思考模式，也可以关闭。思考强度可在 1 到 100 之间设定。"
          param="reasoning_effort"
          min={1}
          max={100}
          stops={[
            { value: 1, label: '最低档', note: '可调范围的下限；官方没有公布各档的具体表现' },
            { value: 100, label: '最高档', note: '官方指令模型评测都在这一档完成，temperature 1.0' },
          ]}
          source={`${HF}；${PRICE}`}
        />
      ),
    },
    {
      id: 'lead',
      label: '领先项',
      build: 'reveal',
      render: () => (
        <ScoreMatrix
          kicker="成绩 · 智能体"
          title="智能体与编程任务排在前面"
          lead="官方对比表里，这六项 V4.1-Flash 都是最高分。均为 DeepSeek 自测，最高推理强度。"
          models={MODELS}
          focus={5}
          rows={[
            { name: 'Terminal-Bench 2.1', metric: 'Pass@1', values: [89.1, 88.8, 88.3, 88.2, 87.9, 90.6] },
            { name: 'DeepSWE v1.1', metric: 'Resolved', values: [74.0, 73.0, 67.5, 66.9, 62.7, 74.2] },
            { name: 'CyberGym', metric: 'Pass@1', values: [null, 84.5, 80.0, 84.5, 83.3, 88.1] },
            { name: 'AutomationBench', metric: 'Pass@1', values: [50.3, 45.8, 46.7, 48.8, 43.2, 54.8] },
            { name: 'HLE w/ tools', metric: 'Pass@1', values: [63.6, null, 59.8, 62.5, 60.0, 63.9] },
            { name: "Agent's Last Exam", metric: 'Pass@1', values: [28.6, 26.7, 27.6, 28.5, 25.7, 31.8] },
          ]}
          source={`${HF}。— 为未报告`}
        />
      ),
    },
    {
      id: 'trail',
      label: '落后项',
      build: 'reveal',
      render: () => (
        <ScoreMatrix
          kicker="成绩 · 差距"
          title="知识问答和更难的终端任务还有差距"
          lead="同一张表里，这几项 V4.1-Flash 落后于最强的对手，但多数高于自家 V4-Pro。"
          models={MODELS}
          focus={5}
          rows={[
            { name: 'GPQA Diamond', metric: 'Pass@1', values: [93.4, 94.1, 92.9, 88.1, 92.4, 90.9] },
            { name: 'HLE', metric: 'Pass@1', values: [56.3, 44.5, 43.5, null, null, 36.8] },
            { name: 'Terminal-Bench 3.0', metric: 'Pass@1', values: [43.3, 34.4, 17.7, 28.3, 11.8, 30.0] },
            { name: 'Terminal-Bench 4.0', metric: 'Pass@1', values: [51.8, 39.9, 12.6, 37.9, 12.4, 31.2] },
            { name: 'ProgramBench', metric: 'Almost@1', values: [37.0, 23.0, 17.5, 19.0, 15.5, 20.3] },
            { name: 'ExploitGym', metric: 'Pass@1', values: [22.1, 33.7, null, 15.0, 5.4, 15.3] },
          ]}
          source={`${HF}。HLE 中 GLM-5.3 与 V4-Pro 只有纯文本子集成绩，不可直接比较，记为 —`}
        />
      ),
    },
    {
      id: 'price',
      label: '价格',
      build: 'reveal',
      render: () => (
        <TokenPriceGrid
          kicker="价格"
          title="Flash 各项单价比 V4-Pro 低七成以上"
          lead="缓存命中的输入最便宜，闲时 0.003 美元每百万 tokens。高峰时段所有单价翻倍。"
          columns={['Flash 闲时', 'Flash 高峰', 'V4-Pro 闲时', 'V4-Pro 高峰']}
          focus={0}
          unit="美元 / 百万 tokens"
          rows={[
            { label: '输入', note: '命中缓存', values: [0.003, 0.006, 0.022, 0.044] },
            { label: '输入', note: '未命中缓存', values: [0.15, 0.3, 0.66, 1.32] },
            { label: '输出', values: [0.6, 1.2, 1.98, 3.96] },
          ]}
          source={PRICE}
        />
      ),
    },
    {
      id: 'peak',
      label: '高峰时段',
      build: 'reveal',
      render: () => (
        <PeakClock
          kicker="高峰时段"
          title="每天两段高峰"
          lead="价格分闲时和高峰两档。错开高峰调用，同样的请求便宜一半。"
          windows={[
            { from: 1, to: 4 },
            { from: 6, to: 10 },
          ]}
          zone="UTC"
          onLabel="高峰价"
          offLabel="闲时价"
          notes={[
            { title: '高峰时段', body: 'UTC 01:00–04:00、06:00–10:00，即北京时间 09:00–12:00、14:00–18:00' },
            { title: '只在工作日', body: '周一至周五，中国法定节假日除外；其余时间都按闲时价' },
            { title: '差价', body: 'Flash 与 V4-Pro 的高峰价都是闲时价的 2 倍' },
          ]}
          source={PRICE}
        />
      ),
    },
    {
      id: 'recap',
      label: '小结',
      render: () => (
        <Recap
          kicker="小结"
          title="记住四件事"
          points={[
            { title: '一个名字', body: 'API 名 deepseek-flash，当前由 V4.1-Flash-1017 提供服务。' },
            { title: '稀疏结构', body: '552B 总参数，每个 token 用 6 个路由专家，解码时激活 16B。' },
            { title: '强在智能体', body: 'Terminal-Bench 2.1 为 90.6，DeepSWE v1.1 为 74.2，官方表中最高。' },
            { title: '看准时段', body: '闲时输出 0.6 美元每百万 tokens，工作日高峰翻倍。' },
          ]}
          source={`${HF}；${PRICE}`}
        />
      ),
    },
  ],
}
