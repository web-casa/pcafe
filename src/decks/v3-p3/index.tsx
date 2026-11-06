// Components v3 · phase 3 (network, geo and glow): a neutral introduction to Cloudflare.
// Facts come from cloudflare.com, blog.cloudflare.com, developers.cloudflare.com and the
// company's investor release; each slide names its source. Diagrams marked 示意 are illustrations.

import type { DeckDef } from '../../kit'
import { ArcGlobe, BigStat, GlobeCover, IconGrid, OutageBoard, PopGrid, ReachRings, Recap, RequestJourney, ServerRack, ShieldLayers, SpikeChart, StatRow, TraceTimeline } from '../../kit'

const NET = 'Cloudflare 官网 Network 页，cloudflare.com/network（2026 年 10 月访问）'
const ABOUT = 'Cloudflare 官网 About 页，cloudflare.com/about-overview（2026 年 10 月访问）'
const ARCH = 'Cloudflare 开发者文档《安全参考架构》，developers.cloudflare.com（指标截至 2024 年 6 月）'
const DDOS = 'Cloudflare 博客《2025 年第四季度 DDoS 威胁报告》，blog.cloudflare.com，2026-02-05'
const OUTAGE = 'Cloudflare 博客《2025 年 11 月 18 日故障说明》，blog.cloudflare.com，2025-11-18'
const IR = 'Cloudflare 2025 年第四季度及全年财报新闻稿，cloudflare.net，2026-02-10'

export const deck: DeckDef = {
  title: 'Cloudflare 是做什么的',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'mono-studio',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <GlobeCover
          kicker="公司介绍 · 网络基础设施"
          title={['Cloudflare', '是做什么的']}
          lead="把网站、应用和企业网络放在自己的全球网络后面：加速、防攻击、校验身份，也能在边缘运行代码。"
          facts={[
            { value: '348', label: '个城市有数据中心' },
            { value: '2009', label: '年成立' },
            { value: 'NET', label: '纽交所代码' },
          ]}
          center={[10, 25]}
          arcs={[
            { from: [-74, 40.7], to: [-0.1, 51.5] },
            { from: [-0.1, 51.5], to: [55.3, 25.2] },
            { from: [8.7, 50.1], to: [28, -26.2] },
            { from: [-46.6, -23.5], to: [3.4, 6.5] },
            { from: [55.3, 25.2], to: [72.9, 19.1] },
          ]}
          source={`${NET}；${ABOUT}`}
        />
      ),
    },
    {
      id: 'products',
      label: '产品',
      render: () => (
        <IconGrid
          kicker="做什么"
          title="六类主要产品"
          items={[
            { icon: 'global', title: 'CDN', tag: 'Cache', body: '把网站内容缓存在离用户近的数据中心，减少回源。' },
            { icon: 'routing', title: 'DNS 与 1.1.1.1', tag: 'DNS', body: '为域名提供权威 DNS，另有面向公众的递归解析服务 1.1.1.1。' },
            { icon: 'shield', title: 'DDoS 防护', tag: 'L3–L7', body: '在网络层和应用层识别并丢弃攻击流量，不让它到达源站。' },
            { icon: 'lock', title: 'Zero Trust', tag: 'Access', body: '员工访问内部应用时逐次校验身份和设备，替代传统 VPN。' },
            { icon: 'code', title: 'Workers', tag: 'Serverless', body: '开发者把代码部署到 Cloudflare 网络上运行，不用管服务器。' },
            { icon: 'database', title: 'R2', tag: 'Storage', body: '与 S3 接口兼容的对象存储，官方定价不收出站流量费。' },
          ]}
          source="Cloudflare 官网各产品页，cloudflare.com（2026 年 10 月访问）"
        />
      ),
    },
    {
      id: 'history',
      label: '历程',
      build: 'reveal',
      render: () => (
        <TraceTimeline
          kicker="历程"
          title="从防垃圾邮件到开发者平台"
          events={[
            { date: '2009', title: '公司成立', note: 'Matthew Prince、Michelle Zatlyn、Lee Holloway 创办' },
            { date: '2010.09', title: '公开上线', note: '在 TechCrunch Disrupt 上发布' },
            { date: '2017.09', title: '发布 Workers', note: '在边缘网络上运行 JavaScript' },
            { date: '2018.04', title: '推出 1.1.1.1', note: '面向公众的 DNS 解析服务' },
            { date: '2019.09', title: '纽交所上市', note: '9 月 13 日上市，代码 NET' },
            { date: '2021.09', title: '发布 R2', note: '对象存储，2022 年正式可用' },
          ]}
          source="cloudflare.com/our-story；cloudflare.com/about-overview；blog.cloudflare.com（Workers 2017-09-29、1.1.1.1 2018-04-01、R2 2021-09-28 发布文）"
        />
      ),
    },
    {
      id: 'pop',
      label: '分布',
      build: 'reveal',
      render: () => (
        <PopGrid
          kicker="网络规模"
          title="348 个城市，按地区数"
          lead="一个点代表一个有 Cloudflare 数据中心的城市。官网另一处写的是“335 个城市、125 个以上国家”，口径不同。"
          groups={[
            { name: '亚洲', count: 71 },
            { name: '拉美与加勒比', count: 64 },
            { name: '欧洲', count: 57 },
            { name: '北美', count: 54 },
            { name: '中国大陆', count: 36 },
            { name: '非洲', count: 33 },
            { name: '中东', count: 19 },
            { name: '大洋洲', count: 14 },
          ]}
          totalLabel="个城市（官网列表）"
          source={`${NET}；${ABOUT}`}
        />
      ),
    },
    {
      id: 'reach',
      label: '距离',
      render: () => (
        <ReachRings
          kicker="网络规模"
          title="离用户有多近"
          lead="Cloudflare 用网络延迟描述覆盖范围，而不是地理距离。"
          center="用户"
          rings={[
            { label: '20 ms', value: '多数', text: '多数联网用户到最近数据中心的延迟在 20 毫秒以内' },
            { label: '50 ms', value: '95%', text: '全球约 95% 的联网人口在 50 毫秒以内' },
          ]}
          source={NET}
        />
      ),
    },
    {
      id: 'arc',
      label: '就近',
      build: 'reveal',
      render: () => (
        <ArcGlobe
          kicker="怎么工作 · 示意"
          title="源站只有一个，副本在各地"
          lead="示意：源站放在一处，各地数据中心缓存它的内容，用户由最近的数据中心响应。城市仅作举例。"
          hub={{ name: '源站', lon: -77.5, lat: 39, note: '示意位置' }}
          center={[-25, 22]}
          places={[
            { name: '伦敦', lon: -0.1, lat: 51.5, note: '欧洲' },
            { name: '法兰克福', lon: 8.7, lat: 50.1, note: '欧洲' },
            { name: '圣保罗', lon: -46.6, lat: -23.5, note: '拉美' },
            { name: '墨西哥城', lon: -99.1, lat: 19.4, note: '北美' },
            { name: '拉各斯', lon: 3.4, lat: 6.5, note: '非洲' },
            { name: '约翰内斯堡', lon: 28, lat: -26.2, note: '非洲' },
          ]}
          listTitle="缓存所在城市（举例）"
          source={NET}
        />
      ),
    },
    {
      id: 'journey',
      label: '请求',
      build: 'reveal',
      render: () => (
        <RequestJourney
          kicker="怎么工作"
          title="一个请求经过哪几站"
          lead="简化示意：开启代理的域名，访问请求先到 Cloudflare，再决定是否回源。"
          hops={[
            { icon: 'routing', tag: 'DNS', name: 'DNS 解析', note: '返回 Cloudflare 的 Anycast 地址，而不是源站 IP' },
            { icon: 'global', tag: 'Anycast', name: '最近的数据中心', note: '各数据中心广播同一段地址，路由选最近的一处' },
            { icon: 'shield', tag: 'WAF', name: '安全检查', note: '自定义规则、限速、托管规则依次执行' },
            { icon: 'database', tag: 'Cache', name: '缓存', note: '缓存规则在安全检查之后生效，命中即返回' },
            { icon: 'server', tag: 'Origin', name: '源站', note: '没有命中缓存的请求才转发到源站' },
          ]}
          source="Cloudflare 开发者文档《How Cloudflare works》《规则引擎阶段列表》，developers.cloudflare.com（2026 年 10 月访问）"
        />
      ),
    },
    {
      id: 'rack',
      label: '服务器',
      build: 'reveal',
      render: () => (
        <ServerRack
          kicker="怎么工作"
          title="每台服务器都跑全部服务"
          label="ONE SERVER · 示意"
          units={[
            { name: 'DNS', tag: 'dns' },
            { name: 'DDoS 防护', tag: 'l3-l7' },
            { name: 'WAF', tag: 'waf' },
            { name: 'CDN 缓存', tag: 'cache' },
            { name: 'Zero Trust', tag: 'access' },
            { name: 'Workers', tag: 'workers' },
          ]}
          points={['每个数据中心的每台服务器都运行全部产品，不按产品分机房。', '一个请求只检查一遍，所有安全产品在同一轮里完成。', '每个数据中心都广播整段 Cloudflare 地址，流量就近进入。']}
          source={ARCH}
        />
      ),
    },
    {
      id: 'shield',
      label: '防护',
      build: 'reveal',
      render: () => (
        <ShieldLayers
          kicker="安全"
          title="从外到内的几层过滤"
          lead="HTTP 请求按固定顺序经过各个安全阶段，前一层拦下的流量不会进入后一层。"
          core="源站"
          layers={[
            { name: '网络层 DDoS 防护', tag: 'L3/4', note: '在数据包层面识别并丢弃攻击流量' },
            { name: 'HTTP DDoS 防护', tag: 'L7', note: '针对应用层的洪水请求' },
            { name: 'WAF 自定义与限速', tag: 'Custom', note: '用户自己写的规则和速率限制' },
            { name: 'WAF 托管规则', tag: 'Managed', note: 'Cloudflare 维护的已知漏洞规则集' },
            { name: '机器人防护', tag: 'Bot', note: '识别自动化流量（Super Bot Fight Mode）' },
          ]}
          source="Cloudflare 开发者文档《规则引擎阶段列表》，developers.cloudflare.com（2026 年 10 月访问）"
        />
      ),
    },
    {
      id: 'spike',
      label: '攻击量',
      render: () => (
        <SpikeChart
          kicker="安全"
          title="DDoS 攻击一年翻了一倍多"
          lead="2025 年 Cloudflare 拦截的 DDoS 攻击达 4,710 万次，比 2024 年增长 121%。"
          x={['2023', '2024', '2025']}
          values={[14.0, 21.3, 47.1]}
          unit=" 百万次"
          decimals={1}
          callouts={[{ at: 1, text: '约 2,130 万次（由增幅反推）' }]}
          note="2023、2024 年数值由报告给出的增幅（+236%、+121%）反推，为估算；2025 年为报告原值。"
          source={DDOS}
        />
      ),
    },
    {
      id: 'record',
      label: '最大攻击',
      render: () => (
        <BigStat
          kicker="安全"
          title={['最大的一次', '只持续了 35 秒']}
          figure="31.4"
          caption="Tbps：2025 年第四季度记录的最大一次 DDoS 攻击峰值"
          support={[
            { value: '7.3 Tbps', label: '2025 年 5 月的攻击，45 秒内送出 37.4 TB' },
            { value: '477', label: '吸收那次 7.3 Tbps 攻击的数据中心数' },
          ]}
          source={`${DDOS}；Cloudflare 博客，2025-06-19`}
        />
      ),
    },
    {
      id: 'outage',
      label: '故障',
      build: 'reveal',
      render: () => (
        <OutageBoard
          kicker="可靠性"
          title="2025 年 11 月 18 日的故障"
          lead="一次数据库权限变更让机器人管理的特征文件翻倍，超出代理软件上限，返回 5xx。官方说明不是攻击。"
          from="11:00"
          to="17:30"
          ticks={['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']}
          zone="UTC"
          events={[
            { at: '14:30', label: '核心流量恢复' },
            { at: '17:06', label: '全部恢复' },
          ]}
          rows={[
            { name: '核心 CDN 与安全', note: '返回 HTTP 5xx', spans: [{ from: '11:28', to: '14:30', state: 'down' }, { from: '14:30', to: '17:06', state: 'degraded' }] },
            { name: 'Workers KV', note: '前端网关依赖核心代理', spans: [{ from: '11:28', to: '13:05', state: 'down' }, { from: '13:05', to: '14:30', state: 'degraded' }] },
            { name: 'Access', note: '多数用户认证失败', spans: [{ from: '11:28', to: '13:05', state: 'down' }, { from: '13:05', to: '14:30', state: 'degraded' }] },
            { name: '控制台', note: '多数用户无法登录', spans: [{ from: '11:30', to: '13:10', state: 'degraded' }, { from: '14:40', to: '15:30', state: 'degraded' }] },
          ]}
          source={OUTAGE}
        />
      ),
    },
    {
      id: 'business',
      label: '经营',
      render: () => (
        <StatRow
          kicker="经营"
          title="2025 财年的几个数"
          stats={[
            { value: '21.7亿', label: 'FY2025 营收', note: '2,167.9 百万美元，同比增长 29.8%' },
            { value: '+33.6%', label: 'Q4 营收增速', note: '第四季度营收 614.5 百万美元' },
            { value: '1.15亿', label: 'HTTP 请求/秒', note: '官网所写的平均每秒 HTTP 请求数' },
            { value: '125+', label: '国家', note: '官网：数据从 125 个以上国家的城市提供' },
          ]}
          source={`${IR}；${ABOUT}`}
        />
      ),
    },
    {
      id: 'recap',
      label: '小结',
      render: () => (
        <Recap
          kicker="小结"
          title="记住三件事"
          points={[
            { title: '一张网，多种产品', body: 'CDN、DNS、DDoS 防护、Zero Trust 和开发者平台跑在同一批服务器上。' },
            { title: '规模按城市算', body: '官网列出 348 个城市，覆盖 125 个以上国家。' },
            { title: '攻击和故障都公开', body: '季度 DDoS 报告和故障复盘都发在官方博客上，可以查到原文。' },
          ]}
          source={`${NET}；${DDOS}；${OUTAGE}`}
        />
      ),
    },
  ],
}
