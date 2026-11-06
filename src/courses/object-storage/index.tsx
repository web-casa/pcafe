// 《对象存储入门》. Teaches what src/decks/v3-p5 states, checked again against AWS documents on
// 2026-10-31. Scenarios marked 虚构 are illustrations; the simulator says that it is one.
import { Bullets, Compare, Facts, Figure, Ladder, Lead, Note, P, SlideFigure, Timeline, Worked, type CourseDef } from '../../course'
import { ParadigmCards } from '../../kit'
import { AddressHero, KeyViews, NinesFigure, ObjectFigure, VerbList } from './figures'
import { S3Lab } from './S3Lab'

const READ = '2026-10-31 查阅'
const GUIDE = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide'
const API = 'https://docs.aws.amazon.com/AmazonS3/latest/API'

export const course: CourseDef = {
  id: 'object-storage',
  title: '对象存储入门',
  lead: '从“文件放在哪里”讲起：对象存储怎样组织数据、怎样读写、怎样保证不丢，以及该怎么选。',
  lang: 'zh',
  theme: 'cobalt',
  iconStyle: 'line-duotone',
  look: 'editorial',
  minutes: [12, 15],
  objectives: [
    '说清块、文件、对象三种存储的区别',
    '解释为什么“文件夹”只是键的前缀',
    '用 PUT、GET、LIST、DELETE 读写对象，看懂返回码',
    '分清耐久度和可用性，知道写入后读到的是什么',
    '用三个问题给一批数据选存储类',
  ],
  hero: <AddressHero />,
  concepts: {
    models: { label: '三种存储', review: 'r-models' },
    anatomy: { label: '对象的构成', review: 'r-anatomy' },
    flat: { label: '扁平命名空间', review: 'r-flat' },
    api: { label: 'HTTP API', review: 'r-api' },
    promises: { label: '一致性与耐久度', review: 'r-consistency' },
    classes: { label: '选存储类', review: 'r-classes' },
  },
  sources: {
    compare: { org: 'AWS', title: 'The difference between block, file and object storage', url: 'https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/', note: READ },
    welcome: { org: 'AWS S3 用户指南', title: 'What is Amazon S3?（对象、键、版本、一致性模型）', url: `${GUIDE}/Welcome.html`, note: READ },
    keys: { org: 'AWS S3 用户指南', title: 'Naming Amazon S3 objects（键名、前缀、示例桶 admin-created）', url: `${GUIDE}/object-keys.html`, note: READ },
    meta: { org: 'AWS S3 用户指南', title: 'Working with object metadata', url: `${GUIDE}/UsingMetadata.html`, note: READ },
    faq: { org: 'AWS', title: 'Amazon S3 FAQs（对象 50 TB 上限、单次 PUT 5 GB、分段上传建议）', url: 'https://aws.amazon.com/s3/faqs/', note: READ },
    put: { org: 'AWS S3 API Reference', title: 'PutObject', url: `${API}/API_PutObject.html`, note: READ },
    get: { org: 'AWS S3 API Reference', title: 'GetObject（NoSuchKey 404、InvalidObjectState 403）', url: `${API}/API_GetObject.html`, note: READ },
    list: { org: 'AWS S3 API Reference', title: 'ListObjectsV2（prefix、delimiter、CommonPrefixes）', url: `${API}/API_ListObjectsV2.html`, note: READ },
    del: { org: 'AWS S3 API Reference', title: 'DeleteObject（204 No Content）', url: `${API}/API_DeleteObject.html`, note: READ },
    whatsnew: { org: 'AWS', title: "What's New 2020-12-01：Amazon S3 now delivers strong read-after-write consistency", url: 'https://aws.amazon.com/about-aws/whats-new/2020/12/amazon-s3-now-delivers-strong-read-after-write-consistency-automatically-for-all-applications/', note: READ },
    durability: { org: 'AWS S3 用户指南', title: 'Data protection in Amazon S3（耐久度与可用性设计指标）', url: `${GUIDE}/DataDurability.html`, note: READ },
    classes: { org: 'AWS S3 用户指南', title: 'Understanding and managing Amazon S3 storage classes（对比表）', url: `${GUIDE}/storage-class-intro.html`, note: READ },
    lifecycle: { org: 'AWS S3 用户指南', title: 'Transitioning objects using Amazon S3 Lifecycle', url: `${GUIDE}/lifecycle-transition-general-considerations.html`, note: READ },
  },
  sections: [
    {
      id: 'guess',
      title: '先猜一猜',
      steps: [
        {
          kind: 'practice',
          id: 'p-guess',
          concept: 'flat',
          pretest: true,
          cites: ['keys'],
          exercise: {
            type: 'single',
            prompt: '把一张照片上传到对象存储，键写成 `photos/puppy.jpg`。桶里多了什么？',
            options: [
              { text: '一个 `photos` 文件夹，里面有一个文件', why: '这是最常见的直觉，接下来会拆穿它：S3 的桶里没有子目录。' },
              { text: '一个对象，它的完整名字就是 `photos/puppy.jpg`', correct: true, why: '桶是扁平的。斜杠只是键名里的一个字符，“文件夹”是工具按前缀推断出来的。' },
              { text: '两个对象：`photos` 和 `puppy.jpg`', why: '键只有一个，不会被斜杠拆开。整串 `photos/puppy.jpg` 才是这个对象的标识。' },
            ],
          },
        },
      ],
    },
    {
      id: 'models',
      title: '三种存储',
      steps: [
        {
          kind: 'read',
          id: 'r-models',
          title: '存储分三种，差在怎么组织数据',
          cites: ['compare'],
          blocks: [
            <Lead>三种方式没有高下，区别在于数据怎样编址、怎样访问。</Lead>,
            <SlideFigure
              alt="三张卡片对比块存储、文件存储、对象存储的组织方式、访问方式和常见用途"
              narrow={
                <Compare
                  columns={[
                    { name: '块存储', tagline: '固定大小的块，按地址读写', rows: [{ label: '访问', value: '直接读写单个块' }, { label: '常见用途', value: '数据库、虚拟机' }] },
                    { name: '文件存储', tagline: '目录树里的文件', rows: [{ label: '访问', value: '通用文件协议与权限' }, { label: '常见用途', value: '团队共享文件' }] },
                    { name: '对象存储', tagline: '扁平空间里的对象', focus: true, rows: [{ label: '访问', value: '网络 API' }, { label: '常见用途', value: '海量非结构化数据' }] },
                  ]}
                />
              }
            >
              <ParadigmCards
                kicker="先分清三种"
                title="块、文件、对象：数据怎么组织"
                focus={2}
                cards={[
                  { shape: 'blocks', name: '块存储', tagline: '固定大小的块，按地址读写', rows: [{ label: '组织', value: '每块有顺序的块地址' }, { label: '访问', value: '直接读写单个块' }, { label: '常见用途', value: '数据库、虚拟机' }] },
                  { shape: 'tree', name: '文件存储', tagline: '目录树里的文件', rows: [{ label: '组织', value: '层级目录树' }, { label: '访问', value: '通用文件协议与权限' }, { label: '常见用途', value: '团队共享文件' }] },
                  { shape: 'flat', name: '对象存储', tagline: '扁平空间里的对象', rows: [{ label: '组织', value: '扁平命名空间，唯一标识' }, { label: '访问', value: '网络 API' }, { label: '常见用途', value: '海量非结构化数据' }] },
                ]}
                source="AWS · The difference between block, file and object storage"
              />
            </SlideFigure>,
            <P>对象存储靠网络 API 访问，所以现有程序通常要写新代码才能用上它。</P>,
          ],
        },
        {
          kind: 'practice',
          id: 'p-models',
          concept: 'models',
          cites: ['compare'],
          exercise: {
            type: 'match',
            prompt: '每个场景最适合哪种存储？',
            pairs: [
              { left: '虚拟机或数据库引擎要快速读写', right: '块存储', why: '块存储可以直接读写单个块，适合需要快速读写的数据库和虚拟机。' },
              { left: '异地团队共同编辑同一批文档', right: '文件存储', why: '文件存储是层级目录树，提供共享访问，适合团队协作。' },
              { left: '海量图片和原始数据，由程序存取', right: '对象存储', why: '对象存储适合大量非结构化数据，通过 API 访问。' },
            ],
          },
        },
      ],
    },
    {
      id: 'anatomy',
      title: '拆开一个对象',
      steps: [
        {
          kind: 'read',
          id: 'r-anatomy',
          title: '一个对象由三部分组成',
          cites: ['welcome', 'keys', 'meta', 'faq'],
          blocks: [
            <Lead>桶 + 键（开启版本控制时再加版本号）唯一确定一个对象。</Lead>,
            <ObjectFigure />,
            <Facts
              items={[
                { value: '1024', label: '键名上限（字节）' },
                { value: '50 TB', label: '单个对象上限' },
                { value: '5 GB', label: '单次 PUT 上限' },
              ]}
            />,
          ],
        },
        {
          kind: 'practice',
          id: 'p-identify',
          concept: 'anatomy',
          cites: ['welcome'],
          exercise: {
            type: 'cloze',
            prompt: '不看上一页，补全这句话。',
            text: '{{桶|bucket}} + {{键|key|键名|对象键}}（开启版本控制时再加{{版本号|版本 id|版本id|version id|versionid}}）唯一确定一个对象。',
            why: '可以把 S3 看成一张映射表：从“桶 + 键 + 版本”到对象本身。',
          },
        },
        {
          kind: 'practice',
          id: 'p-meta',
          concept: 'anatomy',
          cites: ['meta', 'put'],
          exercise: {
            type: 'truefalse',
            statement: '用户自定义元数据在上传之后可以直接修改。',
            answer: false,
            why: '不能直接改。要改只能重新写入：复制对象时设置新的元数据，或把整个对象重新 PUT 一次。',
          },
        },
        {
          kind: 'practice',
          id: 'p-limit',
          concept: 'anatomy',
          cites: ['faq'],
          exercise: {
            type: 'single',
            prompt: '单个对象最大 50 TB。那么一个 20 GB 的视频，能用一次 PUT 传上去吗？',
            options: [
              { text: '能，它没超过 50 TB', why: '50 TB 是对象大小的上限。单次 PUT 的上限另算，只有 5 GB。' },
              { text: '不能，单次 PUT 最多 5 GB，要走分段上传', correct: true, why: '单次 PUT 上限是 5 GB。AWS 建议超过 100 MB 的对象就用分段上传。' },
              { text: '不能，S3 不接受超过 5 GB 的对象', why: '对象最大可到 50 TB。5 GB 只是一次 PUT 能带的大小。' },
            ],
          },
        },
      ],
    },
    {
      id: 'flat',
      title: '没有文件夹',
      steps: [
        {
          kind: 'read',
          id: 'r-flat',
          title: '看起来像文件夹，其实只是键的前缀',
          cites: ['keys'],
          blocks: [
            <Lead>桶里没有子目录。控制台看到前缀和分隔符 `/`，才把它们画成文件夹。</Lead>,
            <Figure caption="示例桶 admin-created，来自 AWS 用户指南">
              <KeyViews />
            </Figure>,
            <Note label="一个细节">控制台的“创建文件夹”确实会写入一个对象：0 字节，键以 `/` 结尾。它是普通对象，不是目录。</Note>,
          ],
        },
        {
          kind: 'practice',
          id: 'p-flat',
          concept: 'flat',
          cites: ['keys'],
          exercise: {
            type: 'multi',
            prompt: '还是那个桶，只有上一页的四个键。哪些说法成立？',
            options: [
              { text: '桶里有 4 个对象', correct: true, why: '四个键就是四个对象，显示出来的三个文件夹不是对象。' },
              { text: '`Finance/` 是桶里的一个子目录', why: 'S3 的数据模型没有子桶或子目录。`Finance/` 只是键名的前缀。' },
              { text: '`Development/` 这 12 个字节计入键名的 1024 字节上限', correct: true, why: '前缀、分隔符和名字都在键名里，一起计入上限。' },
              { text: '`s3-dg.pdf` 显示在最外层，是因为它的键里没有斜杠', correct: true, why: '控制台靠前缀和分隔符推断层级，没有前缀的键就留在根层。' },
            ],
          },
        },
      ],
    },
    {
      id: 'api',
      title: '动手读写',
      steps: [
        {
          kind: 'read',
          id: 'r-api',
          title: '四个请求，覆盖大部分日常操作',
          cites: ['welcome', 'put', 'get', 'list', 'del'],
          blocks: [
            <Lead>S3 是 REST 服务，用标准 HTTP 请求创建、读取和删除对象。</Lead>,
            <VerbList />,
          ],
        },
        {
          kind: 'lab',
          id: 'lab-s3',
          title: '给一个模拟的桶发请求',
          concept: 'api',
          simulation: '这个页面在你的浏览器里模拟 S3 的一小部分行为，不连接任何真实服务。ETag 是模拟值。',
          lead: '照着任务做，也可以自己乱试。盯着下面两栏：一栏是真实存的键，一栏是控制台画出来的样子。',
          cites: ['keys', 'put', 'get', 'list', 'del', 'welcome'],
          tasks: [
            { id: 'put', text: '上传一个对象：PUT `photos/puppy.jpg`', why: '你只写了一个对象，`photos/` 文件夹却自己出现了。它是从键名推断出来的。' },
            { id: 'folder', text: '试着读这个“文件夹”：GET `photos/`', why: '404 NoSuchKey。桶里没有键正好等于 `photos/` 的对象，文件夹不是对象。' },
            { id: 'overwrite', text: '换内容再 PUT 同一个键，然后 GET 它', why: '同名键被整体覆盖。写成功之后再读，读到的就是新内容。' },
            { id: 'list', text: '打开文件夹：LIST，prefix 写 `photos/`', why: '“打开文件夹”就是按前缀列举键。点左边的文件夹，发的也是这个请求。' },
            { id: 'delete', text: '删掉这个对象：DELETE `photos/puppy.jpg`', why: '返回 204。这个前缀下没有键了，文件夹也跟着消失，没有东西要单独删。' },
          ],
          solve: [
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { expect: '[data-response][data-status="200"]' },
            { expect: '[data-tree] [data-folder="photos/"]' },
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { expect: '[data-response][data-status="404"]' },
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { expect: '[data-response][data-status="200"]' },
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { expect: '[data-response][data-status="200"]' },
            { click: '[data-fill]' },
            { click: '[data-send]' },
            { expect: '[data-response][data-status="204"]' },
          ],
          render: (ctx) => <S3Lab ctx={ctx} />,
        },
        {
          kind: 'practice',
          id: 'p-after-lab',
          concept: 'flat',
          cites: ['keys'],
          exercise: {
            type: 'single',
            prompt: '键都是直接 PUT 写入的。你 DELETE 了 `photos/` 前缀下最后一个对象，控制台里的 `photos/` 会怎样？',
            options: [
              { text: '消失了，因为再没有键能推断出它', correct: true, why: '文件夹是从键名推断的。没有以 `photos/` 开头的键，就没有这个文件夹。' },
              { text: '还在，但里面是空的', why: '只有用控制台“创建文件夹”留下 0 字节对象时才会这样。这里没有那个对象。' },
              { text: '还在，要再单独删除文件夹', why: '没有东西可删：桶里从来没有过一个叫 `photos/` 的对象。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-api',
          concept: 'api',
          cites: ['list', 'get', 'del'],
          exercise: {
            type: 'cloze',
            prompt: '补全这三个请求：列出前缀下的键，读一个对象，再删掉它。',
            mono: true,
            text: 'GET /?list-type=2&prefix={{photos/}}\n{{GET}} /photos/puppy.jpg      → 200 OK\nDELETE /photos/puppy.jpg   → {{204|204 no content}}',
            why: '“打开文件夹”就是按前缀 LIST。GET 要用完整键。删除成功返回 204 No Content。',
          },
        },
      ],
    },
    {
      id: 'promises',
      title: '写进去之后',
      steps: [
        {
          kind: 'read',
          id: 'r-consistency',
          title: '读到的就是最新的',
          cites: ['whatsnew', 'welcome'],
          blocks: [
            <Lead>2020 年 12 月起，S3 对读写和列举提供强一致性，不加钱，性能也不变。</Lead>,
            <Bullets items={['写入新对象后立刻 LIST：新对象就在列表里', '覆盖之后立刻读：返回新数据', '删除之后立刻读：不再返回数据']} />,
            <Note label="但是">更新以键为单位，没法原子地同时改两个键。两个 PUT 同时写一个键，时间戳最新的赢。</Note>,
          ],
        },
        {
          kind: 'practice',
          id: 'p-consistency',
          concept: 'promises',
          cites: ['welcome'],
          exercise: {
            type: 'single',
            prompt: '进程 A 用 PUT 覆盖 `report.csv` 并收到了成功响应。接着进程 B 发起 GET。B 读到什么？',
            options: [
              { text: 'A 刚写入的新数据', correct: true, why: '成功的 PUT 响应之后发起的读取，一定返回这次写入的数据。' },
              { text: '可能是旧的，要等一会儿才一致', why: '这是 2020 年之前要操心的事。现在写成功后再读，读到的就是新数据。' },
              { text: '一段写了一半的数据', why: '单个键的更新是原子的：读到旧的或新的，不会读到半截。' },
            ],
          },
        },
        {
          kind: 'read',
          id: 'r-nines',
          title: '“十一个九”是怎么数的',
          cites: ['durability', 'classes'],
          blocks: [
            <Lead>耐久度和可用性是两个指标，都是 S3 Standard 按年计的设计目标。</Lead>,
            <NinesFigure />,
            <P>Standard-IA、Glacier 等存储类的设计耐久度也是 11 个 9。例外是已不推荐的低冗余存储（RRS），只有 99.99%。</P>,
          ],
        },
        {
          kind: 'practice',
          id: 'p-nines',
          concept: 'promises',
          cites: ['durability', 'classes'],
          exercise: {
            type: 'single',
            prompt: '关于 S3 Standard 的设计指标，哪个说法对？',
            options: [
              { text: '每年 99.999999999% 的时间都能访问', why: '这把耐久度当成了可用性。Standard 的设计可用性是 99.99%。' },
              { text: '数据不丢是 11 个 9，能访问是 99.99%', correct: true, why: '耐久度说的是数据不丢，可用性说的是能不能访问，要分开看。' },
              { text: '存储类越便宜，耐久度越低', why: 'Standard、IA、Glacier 这些存储类都是 11 个 9，差别在取回速度和费用。' },
            ],
          },
        },
      ],
    },
    {
      id: 'classes',
      title: '选存储类',
      steps: [
        {
          kind: 'read',
          id: 'r-classes',
          title: '越往下越冷：取得越慢，存得越久',
          cites: ['classes'],
          blocks: [
            <Lead>耐久度相同，区别在取回速度、最短计费时长和取回费。Standard 以外的这几类都按 GB 收取回费。</Lead>,
            <Ladder
              ends={['常用', '归档']}
              rows={[
                { name: 'Standard', tag: '频繁访问，默认', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '无' }] },
                { name: 'Standard-IA', tag: '约每月一次', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '30 天' }] },
                { name: 'Glacier Instant Retrieval', tag: '约每季度一次', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '90 天' }] },
                { name: 'Glacier Flexible Retrieval', tag: '约每年一次', specs: [{ label: '取回', value: '分钟到小时' }, { label: '最短计费', value: '90 天' }] },
                { name: 'Glacier Deep Archive', tag: '不到每年一次', specs: [{ label: '取回', value: '数小时' }, { label: '最短计费', value: '180 天' }] },
              ]}
            />,
          ],
        },
        {
          kind: 'read',
          id: 'r-worked',
          title: '照着想一遍：怎么选',
          cites: ['classes'],
          blocks: [
            <Worked
              scenario="**虚构场景：**一批合规备份。几乎不会读，真要读可以等几小时，至少留一年。"
              showLabel="想好了，看推理"
              steps={[
                { ask: '多久读一次？', answer: '不到一年一次。Standard 和 IA 都是为更频繁的访问设计的，先排除。' },
                { ask: '能等多久？', answer: '可以等几小时。那么 Flexible Retrieval 和 Deep Archive 都够用。' },
                { ask: '要存多久？', answer: '至少一年，超过 Deep Archive 180 天的最短计费时长，不用担心提前删除的费用。' },
              ]}
              conclusion="**选 S3 Glacier Deep Archive。** 三个问题的答案都指向它：读得最少，等得起，存得久。"
            />,
          ],
        },
        {
          kind: 'practice',
          id: 'p-faded',
          concept: 'classes',
          cites: ['classes'],
          exercise: {
            type: 'single',
            prompt: '**虚构场景：**一个素材库，每季度用一次，打开时要立刻出图，至少存三个月。前两问已答好，选哪个？',
            given: [
              { label: '多久读一次？', value: '大约每季度一次' },
              { label: '能等多久？', value: '等不了，要毫秒级' },
            ],
            options: [
              { text: 'S3 Glacier Instant Retrieval', correct: true, why: '它就是为每季度访问一次、又要毫秒取回的数据设计的。最短计费 90 天也正好。' },
              { text: 'S3 Glacier Flexible Retrieval', why: '取回要分钟到小时，还得先恢复，等不了。' },
              { text: 'S3 Glacier Deep Archive', why: '取回要数小时，最短计费 180 天，两点都不合适。' },
              { text: 'S3 Standard', why: '速度够，但它是为频繁访问设计的。每季度才用一次，这里还有更合适的选择。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-order',
          concept: 'classes',
          cites: ['classes', 'lifecycle'],
          exercise: {
            type: 'order',
            prompt: '按最短计费时长排序，从短到长。',
            ends: ['最短', '最长'],
            items: ['S3 Standard', 'S3 Standard-IA', 'S3 Glacier Flexible Retrieval', 'S3 Glacier Deep Archive'],
            why: '依次是无、30 天、90 天、180 天。提前删除或转走的对象，剩余时长仍要付费。',
          },
        },
        {
          kind: 'read',
          id: 'r-lifecycle',
          title: '一条规则，让对象自己往下走',
          cites: ['lifecycle', 'get'],
          blocks: [
            <Figure caption="report.csv 上的一条规则。天数是示意，可以自定，但要满足各存储类的最短计费时长" illustrative>
              <Timeline
                stops={[
                  { at: '第 0 天', title: 'Standard', body: '上传时默认进入 Standard。' },
                  { at: '第 30 天', title: 'Standard-IA', body: '不常访问后转入，仍是毫秒取回。' },
                  { at: '第 120 天', title: 'Glacier Flexible Retrieval', body: '归档，不能再实时读取。' },
                  { at: '第 365 天', title: '过期删除', body: '由规则自动删除，不用写清理脚本。' },
                ]}
              />
            </Figure>,
            <P>归档后的对象要先发起恢复请求，生成临时副本才能读。直接 GET 会返回 `InvalidObjectState`。</P>,
          ],
        },
      ],
    },
    {
      id: 'review',
      title: '混合回顾',
      steps: [
        {
          kind: 'practice',
          id: 'f-cards',
          concept: 'flat',
          cites: ['keys', 'welcome', 'list', 'durability', 'classes'],
          exercise: {
            type: 'flashcards',
            prompt: '先在心里说出答案，再翻面。没想起来的，结果页可以再来一遍。',
            cards: [
              { front: '什么能唯一确定一个对象？', back: '桶 + 键，开启版本控制时再加版本号。' },
              { front: '“文件夹”到底是什么？', back: '键名的前缀。控制台用前缀和 `/` 推断出来的。' },
              { front: '打开一个“文件夹”，实际发的是什么请求？', back: 'LIST，带上 prefix，通常还有 delimiter。' },
              { front: '对一个已存在的键再 PUT 一次，会怎样？', back: '旧对象被整体覆盖。写成功后读到的是新数据。' },
              { front: '耐久度和可用性有什么区别？', back: '耐久度是数据不丢，可用性是能不能访问。Standard 分别是 11 个 9 和 99.99%。' },
              { front: '选存储类时问哪三个问题？', back: '多久读一次，能等多久，要存多久。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-mix-list',
          concept: 'api',
          cites: ['list', 'get'],
          exercise: {
            type: 'single',
            prompt: '程序要显示 `uploads/2026/` 下面**一层**有什么。哪个请求对？',
            options: [
              { text: '`GET /uploads/2026/`', why: 'GET 要的是完整键。没有键正好等于它时，返回 404 NoSuchKey。' },
              { text: '`GET /?list-type=2&prefix=uploads/2026/`', why: '能列出来，但不带 delimiter 会把更深层的键也全列出，不是“一层”。' },
              { text: '`GET /?list-type=2&prefix=uploads/2026/&delimiter=/`', correct: true, why: 'prefix 限定范围，delimiter 把更深的键折叠进 CommonPrefixes，正好一层。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-mix-status',
          concept: 'api',
          cites: ['put', 'get', 'del'],
          exercise: {
            type: 'match',
            prompt: '这些情况分别返回什么？',
            pairs: [
              { left: 'PUT 成功', right: '`200 OK`', why: '成功的 PUT 返回 200，响应头里带 ETag。' },
              { left: 'DELETE 成功', right: '`204 No Content`', why: 'DELETE 成功返回 204，没有响应体。' },
              { left: 'GET 一个不存在的键', right: '`404 NoSuchKey`', why: '键不存在就是 404，这正是 GET `photos/` 时你看到的。' },
              { left: 'GET 还在归档里的 Deep Archive 对象', right: '`403 InvalidObjectState`', why: '归档对象要先恢复，否则 GET 返回 403 InvalidObjectState。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-mix-classes',
          concept: 'classes',
          cites: ['classes'],
          exercise: {
            type: 'multi',
            prompt: 'Standard、Standard-IA、Glacier 这几个存储类，真正的差别在哪？',
            options: [
              { text: '取回速度', correct: true, why: '从毫秒级到数小时不等。' },
              { text: '最短计费时长', correct: true, why: '从没有到 180 天不等，提前删除仍要付费。' },
              { text: '有没有按 GB 收的取回费', correct: true, why: 'Standard 没有，IA 和 Glacier 这几类都有。' },
              { text: '设计耐久度', why: '这几个都是 11 个 9，耐久度不是选择它们的依据。' },
            ],
          },
        },
      ],
    },
  ],
}
