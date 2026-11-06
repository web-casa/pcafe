// Roll-up banner: object storage on one stand, 85 × 200 cm. Facts and sources as in src/decks/v3-p5 (AWS docs).
// Everything that matters sits in the visible 2000 mm. The bottom 150 mm rolls into the cassette and carries
// only the ground colour. Ask your printer for the real hidden height and set hiddenBottomMm.
import { AnatomyCard, NinesDial, TierLadder, VerbCards } from '../../kit'
import { Bleed, definePrint, Heading, Kicker, Kit, Sources, Spring, Stack, Text, Title, Tone } from '../../print'

export const print = definePrint({
  title: '对象存储',
  format: 'rollup',
  preset: 'rollup-85x200',
  theme: 'violet',
  style: 'poster',
  tone: 'light',
  emojiStyle: 'noto',
  viewing: { distanceM: 3, readM: 1.5, nearM: 0.8 },
  render: () => (
    <Stack grow gap={44}>
      <Bleed top={0} height={452} fill="accent" />
      <Tone tone="accent">
        <Stack gap={10}>
          <Title lines={['OBJECT STORAGE']} latin fit />
          <Title lines={['对象存储']} fit />
          <Text scale={2.2} strong>把文件变成对象：一个键，一份数据，一组元数据。</Text>
        </Stack>
      </Tone>
      <Stack gap={8}>
        <Kit part=".v35nine__row" label="十一个九" dw={1520} pad={4}>
          <NinesDial kicker="" title="" nines={11} caption="设计耐久度（每年）" marks={[]} />
        </Kit>
        <Text scale={1.6}>十一个九：设计耐久度（每年）。这是设计目标，Standard、IA、Glacier 等存储类都按它设计。</Text>
      </Stack>
      <Stack gap={8}>
        <Heading scale={2.6}>📦 一个对象，三个部分</Heading>
        <Kit part=".v35ana" label="对象的构成" dw={1300} dh={836}>
          <AnatomyCard
            kicker=""
            title=""
            label="amzn-s3-demo-bucket"
            parts={[
              { name: '键', sample: ['photos/puppy.jpg'], note: '桶内唯一，UTF-8，最长 1024 字节。' },
              { name: '数据', sample: ['<0 字节 … 50 TB>', '单次 PUT 最多 5 GB'], note: '系统不关心格式。单个对象 0 字节到 50 TB。', weight: 2 },
              { name: '元数据', sample: ['Content-Type: image/jpeg', 'x-amz-meta-camera: …'], note: '系统元数据加自定义键值对。' },
            ]}
          />
        </Kit>
      </Stack>
      <Stack gap={8}>
        <Heading scale={2.6}>🔑 四个动词，覆盖日常操作</Heading>
        <Kit part=".v35verb" label="四个动词" dw={1300} dh={700}>
          <VerbCards
            kicker=""
            title=""
            cards={[
              { verb: 'PUT', path: 'PUT /puppy.jpg', body: '上传；同名键整体覆盖。', reply: '200 OK  ETag' },
              { verb: 'GET', path: 'GET /puppy.jpg', body: '读取；HEAD 只取元数据。', reply: '200 OK  <数据>' },
              { verb: 'LIST', path: 'GET /?list-type=2', body: '按前缀列出键。', reply: '200 OK  <键列表>' },
              { verb: 'DELETE', path: 'DELETE /puppy.jpg', body: '删除；之后不再返回数据。', reply: '204 No Content' },
            ]}
          />
        </Kit>
      </Stack>
      <Stack gap={8}>
        <Heading scale={2.6}>越往下越冷，取得越慢</Heading>
        <Kit part=".v35tier" label="存储类" dw={1300} dh={910}>
          <TierLadder
            kicker=""
            title=""
            ends={['常用', '归档']}
            steps={[
              { name: 'Standard', tag: '默认', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '无' }] },
              { name: 'Standard-IA', tag: '不常访问', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '30 天' }] },
              { name: 'Glacier IR', tag: '季度访问', specs: [{ label: '取回', value: '毫秒级' }, { label: '最短计费', value: '90 天' }] },
              { name: 'Glacier FR', tag: '年度访问', specs: [{ label: '取回', value: '分钟到小时' }, { label: '最短计费', value: '90 天' }] },
              { name: 'Deep Archive', tag: '极少访问', specs: [{ label: '取回', value: '数小时' }, { label: '最短计费', value: '180 天' }] },
            ]}
          />
        </Kit>
      </Stack>
      <Spring />
      <Stack gap={3}>
        <Kicker tier="fine">以 Amazon S3 为例</Kicker>
        <Sources>来源：AWS S3 用户指南 · What is Amazon S3、Naming objects、Working with object metadata、Amazon S3 REST API、Comparing the Amazon S3 storage classes；S3 FAQ（2026 年查阅）。响应行为为示意。</Sources>
      </Stack>
    </Stack>
  ),
})
