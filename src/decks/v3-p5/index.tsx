// Components v3 · phase 5 demo: 介绍对象存储 — object storage explained with the card,
// gallery and carousel templates. Facts from AWS docs (S3 User Guide, S3 FAQ, pricing,
// What's New 2020-12-01, block/file/object comparison), Ceph docs (RADOS Gateway) and the
// MinIO GitHub repository. Images are AI-generated decor, decoration only.

import type { DeckDef } from '../../kit'
import {
  AnatomyCard,
  Closing,
  Contrast,
  Cover,
  ExplorerFlip,
  LifecycleRail,
  MeterCards,
  NinesDial,
  ParadigmCards,
  SectionBreak,
  ShelfGallery,
  TabSpec,
  TierLadder,
  VerbCards,
} from '../../kit'
import lake from './assets/decor-lake.webp'
import archive from './assets/decor-archive.webp'
import media from './assets/decor-media.webp'
import web from './assets/decor-web.webp'

const AI = '插图：AI 生成（示意）'

export const deck: DeckDef = {
  title: '介绍对象存储',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="一堂基础课"
          title={['对象存储', '是什么']}
          lead="从“文件放在哪里”讲起：对象存储怎样组织数据、怎样读写、怎样保证不丢，以及该怎么选。"
          facts={[
            { label: '单个对象上限', value: '50 TB', icon: 'box' },
            { label: '键名上限', value: '1024 字节', icon: 'key' },
            { label: '设计耐久度', value: '11 个 9', icon: 'shield' },
          ]}
          numeral="S3"
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'models',
      label: '三种存储',
      build: 'reveal',
      render: () => (
        <ParadigmCards
          kicker="先分清三种"
          title="块、文件、对象：数据怎么组织"
          lead="三种方式没有高下，区别在于数据怎样编址、怎样访问。"
          focus={2}
          cards={[
            { shape: 'blocks', name: '块存储', tagline: '固定大小的块，按地址读写', rows: [{ label: '组织', value: '每块有顺序的块地址' }, { label: '访问', value: '直接读写单个块' }, { label: '常见用途', value: '数据库、虚拟机' }] },
            { shape: 'tree', name: '文件存储', tagline: '目录树里的文件', rows: [{ label: '组织', value: '层级目录树' }, { label: '访问', value: '通用文件协议与权限' }, { label: '常见用途', value: '团队共享文件' }] },
            { shape: 'flat', name: '对象存储', tagline: '扁平空间里的对象', rows: [{ label: '组织', value: '扁平命名空间，唯一标识' }, { label: '访问', value: '网络 API' }, { label: '常见用途', value: '海量非结构化数据' }] },
          ]}
          source="AWS · The difference between block, file and object storage（aws.amazon.com/compare）"
        />
      ),
    },
    {
      id: 'anatomy',
      label: '对象的构成',
      build: 'reveal',
      render: () => (
        <AnatomyCard
          kicker="拆开一个对象"
          title="一个对象由三部分组成"
          lead="桶 + 键（开启版本控制时再加版本号）唯一确定一个对象。"
          label="amzn-s3-demo-bucket"
          parts={[
            { name: '键', sample: ['photos/puppy.jpg'], note: '对象在桶内的唯一标识，UTF-8 编码，最长 1024 字节。' },
            { name: '数据', sample: ['<0 字节 … 50 TB>', '单次 PUT 最多 5 GB'], note: '对象本身的内容，系统不关心格式；单个对象 0 字节到 50 TB。', weight: 2 },
            { name: '元数据', sample: ['Content-Type: image/jpeg', 'x-amz-meta-camera: …'], note: '系统元数据加用户自定义的键值对；用户元数据上传后不能直接修改。' },
          ]}
          source="AWS S3 用户指南 · What is Amazon S3、Naming objects、Working with object metadata；S3 FAQ（2026 年查阅）"
        />
      ),
    },
    {
      id: 'flat',
      label: '没有文件夹',
      build: 'reveal',
      render: () => (
        <ExplorerFlip
          kicker="扁平命名空间"
          title="看起来像文件夹，其实只是键的前缀"
          lead="控制台用前缀和分隔符“/”推断出层级，桶里本身没有子目录。"
          path="s3://admin-created"
          rows={[
            { name: 'Development/', key: 'Development/Projects.xls', size: '1 个对象' },
            { name: 'Finance/', key: 'Finance/statement1.pdf', size: '1 个对象' },
            { name: 'Private/', key: 'Private/taxdocument.pdf', size: '1 个对象' },
            { name: 's3-dg.pdf', key: 's3-dg.pdf', size: '—' },
          ]}
          note="四个对象的完整键名。前缀、分隔符和名字一起计入 1024 字节的键名上限。"
          source="AWS S3 用户指南 · Naming Amazon S3 objects（示例桶 admin-created）"
        />
      ),
    },
    {
      id: 'api',
      label: 'S3 API',
      build: 'reveal',
      render: () => (
        <VerbCards
          kicker="S3 API"
          title="四个 HTTP 动词，覆盖大部分日常操作"
          lead="S3 是 REST 服务，用标准 HTTP 请求创建、读取和删除对象。响应行为示意。"
          cards={[
            { verb: 'PUT', path: 'PUT /photos/puppy.jpg', body: '上传一个对象；同名键会被整体覆盖。', reply: '200 OK  ETag: "…"' },
            { verb: 'GET', path: 'GET /photos/puppy.jpg', body: '读取对象；HEAD 只取元数据不取内容。', reply: '200 OK  <对象数据>' },
            { verb: 'LIST', path: 'GET /?list-type=2&prefix=photos/', body: '按前缀列出键，就是“打开文件夹”。', reply: '200 OK  <Contents>…' },
            { verb: 'DELETE', path: 'DELETE /photos/puppy.jpg', body: '删除对象；之后的读取不再返回数据。', reply: '204 No Content' },
          ]}
          source="AWS S3 用户指南 · Amazon S3 REST API、Working with object metadata；S3 API Reference"
        />
      ),
    },
    {
      id: 'ch2',
      label: '第二部分',
      render: () => (
        <SectionBreak
          kicker="第二部分"
          index={2}
          icon="shield"
          title="写进去之后：一致与不丢"
          lead="对象存储给出的两个承诺：读到的是最新的，存进去的不会丢。"
          contents={['强一致性', '十一个九', '存储类与生命周期']}
        />
      ),
    },
    {
      id: 'consistency',
      label: '强一致性',
      build: 'reveal',
      render: () => (
        <Contrast
          kicker="强一致性"
          before={{ label: '过去', text: '一致性要靠第三方服务或额外设施' }}
          after={{ label: '2020 起', text: '写入成功后，读和列举立即见到新数据' }}
          sub="覆盖写和删除同样适用，不收额外费用，性能不变；跨多个键的原子更新仍需自己实现。"
          source="AWS What's New 2020-12-01；aws.amazon.com/s3/consistency；S3 用户指南 · 一致性模型"
        />
      ),
    },
    {
      id: 'nines',
      label: '耐久度',
      build: 'reveal',
      render: () => (
        <NinesDial
          kicker="耐久度"
          title="“十一个九”是怎么数的"
          lead="耐久度说的是数据不丢的概率，是设计目标；可用性是另一个指标。"
          nines={11}
          caption="设计耐久度（每年）"
          marks={[
            { upto: 4, label: '四个九：RRS', note: '已不推荐的低冗余存储，年均预期丢失 0.01% 的对象。' },
            { upto: 11, label: '十一个九：其余存储类', note: 'Standard、IA、Glacier 等存储类的设计耐久度都是 99.999999999%。' },
          ]}
          source="AWS S3 用户指南 · Comparing the Amazon S3 storage classes；S3 FAQ"
        />
      ),
    },
    {
      id: 'tiers',
      label: '存储类',
      build: 'reveal',
      render: () => (
        <TierLadder
          kicker="存储类"
          title="越往下越冷：取得越慢，存得越久"
          lead="耐久度相同，区别在取回速度、最短计费时长和取回费。"
          ends={['常用', '归档']}
          steps={[
            { name: 'Standard', tag: '默认', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '无' }] },
            { name: 'Standard-IA', tag: '不常访问', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '30 天' }] },
            { name: 'Glacier IR', tag: '季度访问', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '90 天' }] },
            { name: 'Glacier FR', tag: '年度访问', specs: [{ label: '取回', value: '分钟到小时' }, { label: '最短计费', value: '90 天' }] },
            { name: 'Deep Archive', tag: '极少访问', specs: [{ label: '取回', value: '数小时' }, { label: '最短计费', value: '180 天' }] },
          ]}
          source="AWS S3 用户指南 · Comparing the Amazon S3 storage classes（2026 年查阅）"
        />
      ),
    },
    {
      id: 'lifecycle',
      label: '生命周期',
      build: 'reveal',
      render: () => (
        <LifecycleRail
          kicker="生命周期规则"
          title="一条规则，让对象自己往下走"
          lead="下面是一条示意规则；天数可自定，但要满足各存储类的最短计费时长。"
          marker="report.csv"
          stops={[
            { at: '第 0 天', title: 'Standard', body: '上传时默认进入 Standard。' },
            { at: '第 30 天', title: 'Standard-IA', body: '不常访问后转入，毫秒取回，按 GB 收取回费。' },
            { at: '第 120 天', title: 'Glacier FR', body: '归档后不能实时读取，要先发起恢复请求。' },
            { at: '第 365 天', title: '过期删除', body: '到期由规则自动删除，不必再写清理脚本。' },
          ]}
          source="AWS S3 用户指南 · Transitioning objects using S3 Lifecycle、Managing the lifecycle of objects（规则为示意）"
        />
      ),
    },
    {
      id: 'pricing',
      label: '计费维度',
      build: 'reveal',
      render: () => (
        <MeterCards
          kicker="怎么计费"
          title="账单由几块组成"
          lead="按实际用量计费，不需要预先买容量。具体单价因地区和存储类而异。"
          cards={[
            { icon: 'database', name: '存储', unit: 'GB·月', note: '按对象大小、存储类和存放时间计费。' },
            { icon: 'transfer', name: '请求与取回', unit: '按次 / GB', note: '每个请求都计费；IA 和 Glacier 还有按 GB 的取回费。' },
            { icon: 'global', name: '数据传输', unit: 'GB', note: '进出流量计费；从互联网传入通常不收费。' },
            { icon: 'chart', name: '管理与分析', unit: '按功能', note: '启用存储分析、清单等管理功能后另计。' },
          ]}
          source="aws.amazon.com/s3/pricing；S3 用户指南 · Paying for Amazon S3（2026 年查阅）"
        />
      ),
    },
    {
      id: 'uses',
      label: '典型用途',
      build: 'reveal',
      render: () => (
        <ShelfGallery
          kicker="用在哪里"
          title="四类常见用途"
          lead="AWS 文档列出的用途里，挑四类最常见的。"
          items={[
            { image: { src: lake, alt: '许多小方块汇成一片湖面的抽象插图', credit: AI }, title: '数据湖', body: '把大量原始数据集中存放在一处，供后续分析使用。' },
            { image: { src: web, alt: '漂浮的空白浏览器窗口用细线相连的插图', credit: AI }, title: '网站与应用', body: '存放网页、图片和应用素材，对象可通过 URL 访问。' },
            { image: { src: media, alt: '漂浮的空白相框和胶片卷插图', credit: AI }, title: '备份与恢复', body: '开启版本控制后可保留每个版本，误删或覆盖后能恢复。' },
            { image: { src: archive, alt: '高架上排列整齐的封箱插图', credit: AI }, title: '长期归档', body: '冷数据放进 Glacier 类存储类，以较低成本长期保存。' },
          ]}
          source="AWS S3 用户指南 · What is Amazon S3（用途列表、S3 Versioning）"
        />
      ),
    },
    {
      id: 'oss',
      label: '开源方案',
      build: 'reveal',
      render: () => (
        <TabSpec
          kicker="自建"
          title="开源的 S3 兼容实现"
          lead="很多系统实现了 S3 API 的大部分子集，应用基本不用改就能切换。"
          items={[
            {
              tab: 'Ceph RGW',
              name: 'Ceph 对象网关',
              body: 'Ceph 的对象存储接口，构建在 librados 之上，是应用与 Ceph 存储集群之间的 RESTful 网关。',
              specs: [
                { label: 'S3', value: '兼容大部分 S3 RESTful API' },
                { label: 'Swift', value: '兼容大部分 OpenStack Swift API' },
                { label: '底层', value: 'Ceph 存储集群（RADOS）' },
              ],
            },
            {
              tab: 'MinIO',
              name: 'MinIO',
              body: '自称高性能、S3 兼容的对象存储。选型前请先确认它的维护状态。',
              specs: [
                { label: '许可', value: 'GNU AGPLv3' },
                { label: '现状', value: 'GitHub 仓库 2026-04-25 归档' },
                { label: '分发', value: '社区版只提供源码' },
              ],
            },
          ]}
          source="docs.ceph.com · Ceph Object Gateway；github.com/minio/minio（2026 年查阅）"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="S3"
          statement="桶、键、对象，再加一套 HTTP API"
          follow="选型时先问：多久读一次，能等多久，要存多久。"
          takeaways={[
            '对象存储是扁平空间：“文件夹”只是键的前缀。',
            'S3 自 2020 年 12 月起对读写和列举提供强一致性。',
            '存储类耐久度相同，差在取回速度、最短计费时长和取回费。',
          ]}
          refs={['docs.aws.amazon.com/AmazonS3', 'aws.amazon.com/s3/pricing', 'docs.ceph.com/en/latest/radosgw', 'github.com/minio/minio']}
        />
      ),
    },
  ],
}
