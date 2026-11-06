import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { creditOn, creditText } from '../engine/attribution'
import { inWindow, partsOf, readingSeconds } from './time'
import { useAgenda, useData, useParts, useRuntime } from './runtime'
import type { TickerItem } from './types'
import type { FeedSnapshot } from './feed'

const WEEK_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const p2 = (n: number) => String(n).padStart(2, '0')

function Clock() {
  const rt = useRuntime()
  const cfg = rt.def.clock === false ? null : rt.def.clock ?? {}
  // Second-level updates only when the screen asks for seconds: each repaint has a cost over days.
  const p = useParts(cfg?.seconds ? 'second' : 'minute')
  if (!cfg) return null
  const en = rt.def.lang === 'en'
  return (
    <div className="scr-clock" data-minutes={p.minutes} data-date={p.date}>
      {cfg.date === false ? null : <span className="scr-date">{`${p2(p.mo)}.${p2(p.d)} ${(en ? WEEK_EN : WEEK_ZH)[p.dow]}`}</span>}
      <span className="scr-time">{`${p2(p.h)}:${p2(p.mi)}${cfg.seconds ? `:${p2(p.s)}` : ''}`}</span>
    </div>
  )
}

const offFeed = () => () => {}

function FeedNotice() {
  const rt = useRuntime()
  const feed = rt.feed
  const snap = useSyncExternalStore(feed ? feed.subscribe : offFeed, feed ? feed.getSnapshot : () => null) as FeedSnapshot<unknown> | null
  if (!snap || snap.status === 'live' || snap.status === 'builtin') return null
  const when = snap.fetchedAt === null ? null : partsOf(snap.fetchedAt, rt.def.timezone)
  const text = when ? `数据已过期 · 最后更新 ${p2(when.h)}:${p2(when.mi)}` : '未连接数据源 · 显示内置内容'
  return <div className="scr-feed" data-status={snap.status}>{text}</div>
}

function Ticker() {
  const rt = useRuntime()
  const cfg = rt.def.ticker
  const agenda = useAgenda()
  const data = useData<never>()
  const parts = useParts('minute')
  const items = useMemo<TickerItem[]>(() => {
    if (!cfg) return []
    const all = typeof cfg.items === 'function' ? cfg.items({ agenda, data }) : cfg.items
    return all.filter((i) => inWindow(i.when, parts))
  }, [cfg, agenda, data, parts])
  const [pos, setPos] = useState(0)
  const item = items.length ? items[pos % items.length] : null
  const seconds = item ? Math.max(cfg?.seconds ?? 0, readingSeconds(item.text)) : 0

  // Paged, not a crawl: research §4. Timed from the shared tick, so it adds no timer of its own.
  useEffect(() => {
    if (!items.length) return
    const ends = rt.clock.mono() + seconds * 1000
    return rt.subscribeTick(() => {
      if (rt.clock.mono() >= ends) setPos((p) => p + 1)
    })
  }, [rt, seconds, pos, items.length])

  if (!cfg || !item) return null
  return (
    <div className="scr-ticker" data-seconds={seconds}>
      {cfg.label ? <span className="scr-ticker__label">{cfg.label}</span> : null}
      <span key={`${pos}:${item.text}`} className="scr-ticker__text">{item.text}</span>
    </div>
  )
}

export function Chrome() {
  const rt = useRuntime()
  return (
    <div className="scr-chrome">
      <div className="scr-top">
        <div className="scr-name" data-tier="fine">
          {rt.def.title}
          {creditOn(rt.def.attribution) && <span className="scr-credit" data-pcafe-credit="">{`${creditText(rt.def.lang ?? 'zh')} · p.cafe`}</span>}
        </div>
        <FeedNotice />
        {rt.def.sample ? <div className="scr-sample">{rt.def.sample}</div> : null}
      </div>
      <div className="scr-band">
        {rt.def.ticker ? <Ticker /> : null}
        <Clock />
      </div>
    </div>
  )
}

/** Nothing else can be shown: every scene is out of its hours or resting after an error. */
export function HoldingCard() {
  const rt = useRuntime()
  return (
    <section className="sc sc-idle" data-idle="1">
      <h1 className="sc-title">{rt.def.title}</h1>
    </section>
  )
}

/** Press I. Never visible unless an operator asks. */
export function StatusPanel({ scene, changes }: { scene: string | null; changes: number }) {
  const rt = useRuntime()
  const p = useParts('second')
  const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
  const up = Math.round((performance.now() - rt.bootAt) / 60000)
  const snap = rt.feed?.getSnapshot()
  return (
    <aside className="scr-status" data-status-panel="1">
      <b>{rt.def.title}</b>
      <div>{`时钟 ${p.date} ${p2(p.h)}:${p2(p.mi)}:${p2(p.s)} ${rt.def.timezone ?? '设备时区'}`}</div>
      <div>{`运行 ${up} 分钟 · 场景 ${scene ?? '无'} · 已切换 ${changes} 次`}</div>
      <div>{`唤醒锁 ${rt.wake.state}${mem ? ` · JS 堆 ${Math.round(mem.usedJSHeapSize / 1048576)} MB` : ''}`}</div>
      {snap ? <div>{`数据 ${snap.status} · 轮询 ${snap.polls} 次 · 失败 ${snap.fails} 次`}</div> : null}
      <div className="scr-status__log">
        {rt.log.entries.length === 0 ? '没有错误记录' : rt.log.entries.slice(-8).map((e, i) => <div key={i}>{`${new Date(e.at).toLocaleTimeString()} ${e.kind} ${e.scene ?? ''} ${e.message}`}</div>)}
      </div>
      <div>F 全屏 · 空格 暂停 · N 下一个 · P 上一个 · R 重载 · I 关闭</div>
    </aside>
  )
}
