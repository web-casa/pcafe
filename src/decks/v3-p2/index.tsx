// Components v3, phase 2 example deck: an introduction to PostgreSQL that uses the
// ten technical-diagram and code templates. Facts checked 2026-10-30 against
// postgresql.org (docs, versioning policy, release announcements) and postgis.net.
// Query plans, schemas and sample rows are illustrative and marked 示意.

import type { DeckDef } from '../../kit'
import {
  BeamFlow,
  BTreeIndex,
  Closing,
  CodeCallouts,
  Cover,
  IconGrid,
  JsonTree,
  Milestones,
  QueryPlan,
  RequestResponse,
  ResultGrid,
  SchemaEr,
  SessionSequence,
  Statement,
  TupleVersions,
} from '../../kit'

const VERS = 'PostgreSQL Versioning Policy (postgresql.org/support/versioning, 2026-10)'
const HIST = 'PostgreSQL 18 文档 · A Brief History of PostgreSQL (postgresql.org/docs/current/history.html)'

export const deck: DeckDef = {
  title: '认识 PostgreSQL',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="技术分享 · 数据库"
          title={['认识', 'PostgreSQL']}
          lead="从伯克利的研究项目到今天的开源关系数据库：历史、许可、核心机制和版本节奏。"
          facts={[
            { label: '起点', value: '1986' },
            { label: '当前大版本', value: '18' },
            { label: '支持期', value: '5 年' },
          ]}
          numeral="18"
          note="19 已进入候选版阶段"
          hint={<>按 → 翻页</>}
        />
      ),
    },
    {
      id: 'history',
      label: '历史',
      render: () => (
        <Milestones
          kicker="来历"
          title="四十年，三个名字"
          lead="项目由伯克利的 Michael Stonebraker 主持，1994 年加入 SQL 后才走向今天的样子。"
          events={[
            { date: '1986', title: 'POSTGRES 在伯克利开始实现', tag: '研究项目' },
            { date: '1989', title: '第 1 版交给少量外部用户', tag: '版本 1' },
            { date: '1993', title: '伯克利项目在 4.2 版结束', tag: '版本 4.2' },
            { date: '1994', title: 'Andrew Yu 与 Jolly Chen 加入 SQL，改名 Postgres95', tag: 'Postgres95' },
            { date: '1996', title: '更名 PostgreSQL，版本号从 6.0 重新开始', tag: '更名', focus: true },
          ]}
          source={HIST}
        />
      ),
    },
    {
      id: 'license',
      label: '许可',
      render: () => (
        <Statement
          kicker="许可"
          text={['PostgreSQL 许可证：', '宽松的开源许可，', '和 BSD、MIT 相近']}
          marks={['和 BSD、MIT 相近']}
          sub="代码由全球开发组（PGDG）维护，不属于某一家公司。"
          source="PostgreSQL Licence (postgresql.org/about/licence)"
        />
      ),
    },
    {
      id: 'process',
      label: '进程模型',
      build: 'reveal',
      render: () => (
        <BeamFlow
          kicker="架构"
          title="一个连接，一个后端进程"
          lead="客户端先连主进程 postmaster，它为每个连接派生一个独立的后端进程。"
          heads={['客户端', '共享资源']}
          inputs={[
            { label: 'psql', sub: '命令行客户端' },
            { label: 'libpq 应用', sub: 'C 接口库' },
            { label: 'JDBC 等驱动', sub: '同一线路协议' },
          ]}
          hub={{ label: 'postmaster', sub: '按连接派生后端进程' }}
          outputs={[
            { label: '共享缓冲区', sub: '各进程共用的内存' },
            { label: 'WAL 日志', sub: '先写日志再改数据' },
            { label: '数据文件', sub: '表与索引' },
          ]}
          source="PostgreSQL 18 文档 · How Connections Are Established、Write-Ahead Logging (postgresql.org/docs/current)"
          hint={<>按 → 逐列展开</>}
        />
      ),
    },
    {
      id: 'returning',
      label: '请求响应',
      build: 'reveal',
      render: () => (
        <RequestResponse
          kicker="一次往返"
          title="写入的同时拿回改动前后的值"
          lead="PostgreSQL 18 起，RETURNING 可以同时引用 OLD 和 NEW。"
          request={{
            label: '客户端发送',
            file: 'psql',
            lines: ['UPDATE accounts', '   SET balance = balance - 30', ' WHERE id = 7', 'RETURNING old.balance,', '          new.balance;'],
          }}
          via="一次往返"
          response={{
            label: '服务器返回（示意）',
            file: 'result',
            lines: [' balance | balance', '---------+---------', '     100 |      70', '(1 row)', '', 'UPDATE 1'],
          }}
          note="表名和数值是示意；语法见 PostgreSQL 18 发布公告。"
          source="PostgreSQL 18 Released (postgresql.org/about/news, 2025-09-25)"
          hint={<>按 → 看返回</>}
        />
      ),
    },
    {
      id: 'isolation',
      label: '事务',
      build: 'reveal',
      render: () => (
        <SessionSequence
          kicker="ACID · 隔离"
          title="两个会话改同一行：后来者等待"
          lead="默认隔离级别是读已提交。更新已被别的事务锁住的行时，要等对方提交或回滚。"
          lanes={['会话 A', '会话 B']}
          events={[
            { lane: 0, text: 'BEGIN;' },
            { lane: 0, text: 'UPDATE accounts SET ... WHERE id = 7;', note: '持有行锁' },
            { lane: 1, text: 'UPDATE accounts SET ... WHERE id = 7;', note: '等待 A', kind: 'wait' },
            { lane: 0, text: 'COMMIT;', note: '释放行锁' },
            { lane: 1, text: '在 A 提交后的新行上继续更新', note: '继续执行', kind: 'ok' },
          ]}
          source="PostgreSQL 18 文档 · Transaction Isolation, 13.2.1 Read Committed (postgresql.org/docs/current/transaction-iso.html)"
          hint={<>按 → 推进时间</>}
        />
      ),
    },
    {
      id: 'mvcc',
      label: 'MVCC',
      build: 'reveal',
      render: () => (
        <TupleVersions
          kicker="MVCC"
          title="更新不覆盖旧行，而是写出新版本"
          lead="每个行版本带 xmin（创建它的事务）和 xmax（删除它的事务）。读者按自己的快照挑可见的版本。"
          range={[100, 120]}
          axis="事务号（示意）"
          versions={[
            { value: 'balance = 100', xmin: 101, xmax: 108 },
            { value: 'balance = 70', xmin: 108, xmax: 115 },
            { value: 'balance = 55', xmin: 115 },
          ]}
          snapshots={[
            { at: 105, label: '快照 105' },
            { at: 112, label: '快照 112' },
          ]}
          source="PostgreSQL 18 文档 · Concurrency Control、System Columns (postgresql.org/docs/current/mvcc-intro.html)"
          hint={<>按 → 逐个版本</>}
        />
      ),
    },
    {
      id: 'btree',
      label: 'B-tree',
      build: 'reveal',
      render: () => (
        <BTreeIndex
          kicker="索引"
          title="默认索引 B-tree：从根页走到叶子页"
          lead="CREATE INDEX 不指定类型时建的就是 B-tree，适合等值和范围查询。"
          target="42"
          levels={[
            [['30', '60']],
            [['10', '20'], ['40', '50'], ['70', '80']],
            [['3', '8'], ['31', '36'], ['42', '45'], ['61', '66']],
          ]}
          path={[0, 1, 2]}
          notes={['根页：42 落在 30 与 60 之间', '内部页：42 落在 40 与 50 之间', '叶子页：找到 42，取出指向行的指针']}
          leafNote="页和键值是示意，真实页面能容纳数百个键。"
          source="PostgreSQL 18 文档 · Index Types (postgresql.org/docs/current/indexes-types.html)"
          hint={<>按 → 逐层下行</>}
        />
      ),
    },
    {
      id: 'index-types',
      label: '索引类型',
      render: () => (
        <IconGrid
          kicker="索引"
          title="内置六种索引"
          items={[
            { icon: 'layers', title: 'B-tree', body: '默认类型。等值、范围、排序，适合大多数场景。', tag: 'default' },
            { icon: 'search', title: 'Hash', body: '只处理等号比较。', tag: '=' },
            { icon: 'map', title: 'GiST', body: '可扩展框架，常用于几何类型和最近邻排序。', tag: '<->' },
            { icon: 'branch', title: 'SP-GiST', body: '非平衡结构：四叉树、k-d 树、字典树。' },
            { icon: 'file-search', title: 'GIN', body: '倒排索引，适合数组、JSONB 这类多值数据。' },
            { icon: 'database', title: 'BRIN', body: '按块范围存最小最大值，适合与物理顺序相关的超大表。' },
          ]}
          source="PostgreSQL 18 文档 · Index Types (postgresql.org/docs/current/indexes-types.html)"
        />
      ),
    },
    {
      id: 'plan',
      label: '执行计划',
      build: 'reveal',
      render: () => (
        <QueryPlan
          kicker="EXPLAIN"
          title="看优化器怎么执行一条查询"
          lead="EXPLAIN 输出一棵计划树：叶子读数据，上层做连接和排序。下面的计划是示意。"
          sql={['EXPLAIN SELECT c.name, o.total', '  FROM orders o JOIN customers c ON c.id = o.customer_id', " WHERE o.created_at > now() - '7 days'::interval;"]}
          plan={{
            op: 'Hash Join',
            detail: 'o.customer_id = c.id',
            children: [
              { op: 'Index Scan', detail: 'orders_created_at_idx', meta: 'created_at > …', hot: true },
              { op: 'Hash', detail: '构建哈希表', children: [{ op: 'Seq Scan', detail: 'customers' }] },
            ],
          }}
          note="加 ANALYZE 会真正执行查询，并给出每个节点的实际行数和耗时。"
          source="PostgreSQL 18 文档 · Using EXPLAIN (postgresql.org/docs/current/using-explain.html)"
          hint={<>按 → 逐层展开</>}
        />
      ),
    },
    {
      id: 'schema',
      label: '约束',
      build: 'reveal',
      render: () => (
        <SchemaEr
          kicker="一致性"
          title="外键让表之间的引用始终成立"
          lead="REFERENCES 声明外键：插入不存在的客户、删除仍被引用的客户，都会被拒绝。表结构是示意。"
          tables={[
            { name: 'customers', cols: [{ name: 'id', type: 'bigint', key: 'pk' }, { name: 'name', type: 'text' }, { name: 'email', type: 'text' }] },
            {
              name: 'orders',
              cols: [{ name: 'id', type: 'bigint', key: 'pk' }, { name: 'customer_id', type: 'bigint', key: 'fk' }, { name: 'total', type: 'numeric' }, { name: 'created_at', type: 'timestamptz' }],
            },
            { name: 'order_items', drop: 1, cols: [{ name: 'order_id', type: 'bigint', key: 'fk' }, { name: 'sku', type: 'text' }, { name: 'qty', type: 'int' }] },
          ]}
          links={[
            { from: 'orders.customer_id', to: 'customers.id', label: 'N:1' },
            { from: 'order_items.order_id', to: 'orders.id', label: 'N:1' },
          ]}
          source="PostgreSQL 18 文档 · Constraints, 5.5.5 Foreign Keys (postgresql.org/docs/current/ddl-constraints.html)"
          note="外键要求被引用的列上有主键或唯一约束；orders 与 order_items 同理。"
          hint={<>按 → 逐张表</>}
        />
      ),
    },
    {
      id: 'jsonb',
      label: 'JSONB',
      build: 'reveal',
      render: () => (
        <JsonTree
          kicker="JSONB"
          title={['文档存进表里，', '也能按路径查']}
          lead="jsonb 以二进制分解存储，支持 GIN 索引。-> 取出 jsonb，->> 取出文本，@> 判断包含。"
          file="profile (jsonb，示意)"
          doc={[
            { depth: 0, text: '{' },
            { depth: 1, text: '"name": "Ada",', pick: 0 },
            { depth: 1, text: '"city": "Berkeley",' },
            { depth: 1, text: '"tags": [', pick: 1 },
            { depth: 2, text: '"sql", "gis"', pick: 1 },
            { depth: 1, text: '],', pick: 1 },
            { depth: 1, text: '"plan": { "tier": "pro" }', pick: 2 },
            { depth: 0, text: '}' },
          ]}
          queries={[
            { expr: "profile ->> 'name'", result: 'Ada', note: '返回 text' },
            { expr: "profile -> 'tags'", result: '["sql", "gis"]', note: '返回 jsonb' },
            { expr: `profile @> '{"plan":{"tier":"pro"}}'`, result: 'true', note: '包含判断，可走 GIN 索引' },
          ]}
          source="PostgreSQL 18 文档 · JSON Types、JSON Functions and Operators (postgresql.org/docs/current/datatype-json.html)"
          hint={<>按 → 逐条查询</>}
        />
      ),
    },
    {
      id: 'postgis',
      label: '扩展',
      build: 'reveal',
      render: () => (
        <CodeCallouts
          kicker="可扩展性"
          title="一条 CREATE EXTENSION，装上空间数据库"
          lead="扩展可以加入新类型、函数、运算符和索引方法。PostGIS 是其中最常见的例子之一。"
          file="postgis.sql（示意）"
          code={[
            'CREATE EXTENSION postgis;',
            '',
            'CREATE TABLE shops (',
            '  id   bigint PRIMARY KEY,',
            '  geom geography(Point, 4326)',
            ');',
            'CREATE INDEX ON shops USING gist (geom);',
            '',
            'SELECT id FROM shops',
            ' WHERE ST_DWithin(geom, :here, 500);',
          ]}
          notes={[
            { lines: [1], title: '加载扩展', body: '扩展打包好对象，在当前数据库里一次装上。' },
            { lines: [5], title: '新的数据类型', body: 'geography 是 PostGIS 提供的类型，按经纬度存点。' },
            { lines: [7], title: '复用 GiST 索引', body: '空间索引建立在内置的 GiST 框架上。' },
            { lines: [10], title: '空间函数', body: 'ST_DWithin 查找给定距离内的对象，geography 以米计。' },
          ]}
          source="PostgreSQL 18 文档 · CREATE EXTENSION；PostGIS 文档 · ST_DWithin (postgis.net/docs)"
          hint={<>按 → 逐条讲解</>}
        />
      ),
    },
    {
      id: 'support',
      label: '支持周期',
      build: 'reveal',
      render: () => (
        <ResultGrid
          kicker="版本节奏"
          title="每年一个大版本，每个支持五年"
          lead="小版本至少每三个月发布一次，只含修复，升级不需要导出导入。"
          sql={['SELECT version, released, eol', '  FROM supported_versions', ' ORDER BY version DESC;', '-- 数据来自官方版本表']}
          columns={['version', 'released', 'eol', 'minor']}
          rows={[
            ['18', '2025-09-25', '2030-11-14', '18.6'],
            ['17', '2024-09-26', '2029-11-08', '17.11'],
            ['16', '2023-09-14', '2028-11-09', '16.15'],
            ['15', '2022-10-13', '2027-11-11', '15.19'],
            ['14', '2021-09-30', '2026-11-12', '14.24'],
          ]}
          mark={2}
          hot={[4]}
          status="(5 rows) · 14 将于 2026-11-12 停止支持"
          note="表中为截至 2026-10-30 仍受支持的大版本。13 已于 2025-11-13 停止支持。"
          source={VERS}
          hint={<>按 → 看结果</>}
        />
      ),
    },
    {
      id: 'next',
      label: '19',
      render: () => (
        <Statement
          kicker="下一个大版本"
          text={['PostgreSQL 19 RC 1', '已于 2026-10-15 发布，', '正式版计划 11 月 19 日']}
          marks={['正式版计划 11 月 19 日']}
          sub="截至 2026-10-30，当前最新的正式大版本仍是 18。日期以官方公告为准，可能顺延。"
          source="PostgreSQL 19 RC 1 Released (postgresql.org/about/news, 2026-10-15)"
        />
      ),
    },
    {
      id: 'close',
      label: '结束',
      render: () => (
        <Closing
          kicker="小结"
          mark="18"
          statement="开源、可扩展、按年发布"
          follow="升级前先看官方版本表和发布说明。"
          takeaways={[
            '起源于 1986 年的伯克利 POSTGRES 项目，1996 年更名 PostgreSQL，使用类似 BSD 的宽松许可。',
            'MVCC 用行版本让读写互不阻塞，事务、外键和多种索引保证数据正确和查询效率。',
            '每年一个大版本、支持五年，小版本至少每季度一次；19 计划于 2026 年 11 月发布。',
          ]}
          refs={['postgresql.org/docs/current', 'postgresql.org/support/versioning', 'postgresql.org/about/news', 'postgis.net/docs']}
        />
      ),
    },
  ],
}
