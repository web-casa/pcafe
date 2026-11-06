import type { CSSProperties, ReactNode } from 'react'
import { architectures, packageFlow, stack, type CardId } from './content'

const style = (vars: Record<string, string | number>) => vars as CSSProperties

/* ── 01 Release & lifecycle ─────────────────────────────────────────────── */

// Axis starts just before the release so the three milestones spread evenly.
const T0 = Date.UTC(2025, 6, 1)
const T1 = Date.UTC(2031, 0, 1)
const at = (y: number, m: number, d: number) => ((Date.UTC(y, m - 1, d) - T0) / (T1 - T0)) * 100

function ReleaseVisual() {
  const release = at(2025, 8, 9)
  const handover = at(2028, 8, 9)
  const end = at(2030, 6, 30)
  return (
    <div className="dv-release">
      <section>
        <header className="dv-label">
          <span>支持周期</span>
          <span>安全团队 3 年 + LTS 约 2 年</span>
        </header>
        <div className="dv-life" aria-label="支持周期：2025 年 8 月发布，2028 年 8 月交接 LTS，2030 年 6 月结束">
          <div className="dv-life__years" aria-hidden>
            {[2026, 2027, 2028, 2029, 2030, 2031].map((y) => (
              <span key={y} style={style({ '--x': `${at(y, 1, 1)}%` })}>
                {y}
              </span>
            ))}
          </div>
          <div className="dv-life__rail" aria-hidden>
            <span className="dv-life__seg is-security" style={style({ '--a': `${release}%`, '--b': `${handover}%` })} />
            <span className="dv-life__seg is-lts" style={style({ '--a': `${handover}%`, '--b': `${end}%` })} />
            {[release, handover, end].map((x) => (
              <i key={x} className="dv-life__pin" style={style({ '--x': `${x}%` })} />
            ))}
          </div>
          <div className="dv-life__labels" aria-hidden>
            <div style={style({ '--x': `${release}%` })}>
              <b>2025.08.09 – 2028.08.09</b>
              <span>Lumen 安全团队维护</span>
            </div>
            <div className="is-lts" style={style({ '--x': `${handover}%` })}>
              <b>至 2030.06.30</b>
              <span>LTS 团队接手 · 计划日期</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <header className="dv-label">
          <span>软件包</span>
          <span>与 Lumen 12 相比</span>
        </header>
        <dl className="dv-flow">
          {packageFlow.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                <sup>+</sup>
              </dd>
            </div>
          ))}
          <div className="is-total">
            <dt>软件包总数</dt>
            <dd>
              69,830<sup>+</sup>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

/* ── 02 APT / deb822 ────────────────────────────────────────────────────── */

function CodePanel({ label, path, tone, children }: { label: string; path: string; tone: 'old' | 'new'; children: ReactNode }) {
  return (
    <figure className={`dv-code is-${tone}`}>
      <figcaption>
        <span className="dv-code__tag">{label}</span>
        <span className="dv-code__path">{path}</span>
      </figcaption>
      <pre>{children}</pre>
    </figure>
  )
}

function AptVisual() {
  return (
    <div className="dv-apt">
      <CodePanel label="之前" path="/etc/apt/sources.list" tone="old">
        <span className="t-k">deb</span> https://repo.example.org/lumen birch main non-free-firmware{'\n'}
        <span className="t-k">deb</span> https://security.example.org/lumen birch-security main non-free-firmware
      </CodePanel>
      <CodePanel label="之后" path="/etc/apt/sources.list.d/lumen.sources" tone="new">
        <span className="t-k">Types:</span> deb{'\n'}
        <span className="t-k">URIs:</span> https://repo.example.org/lumen{'\n'}
        <span className="t-k">Suites:</span> <b>aurora</b> <b>aurora-updates</b>
        {'\n'}
        <span className="t-k">Components:</span> main non-free-firmware{'\n'}
        <span className="t-k">Signed-By:</span> /usr/share/keyrings/lumen-archive-keyring.gpg{'\n'}
        {'\n'}
        <span className="t-k">Types:</span> deb{'\n'}
        <span className="t-k">URIs:</span> https://security.example.org/lumen{'\n'}
        <span className="t-k">Suites:</span> <b>aurora-security</b>
        {'\n'}
        <span className="t-k">Components:</span> main non-free-firmware{'\n'}
        <span className="t-k">Signed-By:</span> /usr/share/keyrings/lumen-archive-keyring.gpg
      </CodePanel>
    </div>
  )
}

function AptAside() {
  return (
    <div className="dv-cmd is-stacked">
      <code>
        <span className="t-prompt">#</span> apt modernize-sources
      </code>
      <span>把现有配置自动转换为 deb822</span>
    </div>
  )
}

/* ── 03 Software stack ──────────────────────────────────────────────────── */

function StackVisual() {
  const half = Math.ceil(stack.length / 2)
  return (
    <div className="dv-stack">
      {[stack.slice(0, half), stack.slice(half)].map((col, c) => (
        <dl className="dv-stack__col" key={c}>
          <div className="dv-stack__head" aria-hidden>
            <span>组件</span>
            <span>12</span>
            <span />
            <span>13</span>
          </div>
          {col.map((row, i) => (
            <div className="dv-stack__row" key={row.name} style={style({ '--i': c * half + i })}>
              <dt>{row.name}</dt>
              <dd className="old">{row.old}</dd>
              <dd className="arrow" aria-label="升级到" />
              <dd className="new">{row.next}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  )
}

/* ── 04 riscv64 & architectures ─────────────────────────────────────────── */

function RiscvVisual() {
  return (
    <div className="dv-arch">
      <ul className="dv-arch__grid">
        {architectures.map((a) => (
          <li key={a.name} className={a.name === 'riscv64' ? 'is-new' : a.name === 'armel' ? 'is-last' : undefined}>
            <span className="dv-arch__bits">{a.bits}-bit</span>
            <span className="dv-arch__name">{a.name}</span>
            {a.note && <span className="dv-arch__note">{a.note}</span>}
          </li>
        ))}
        <li className="is-reduced">
          <span className="dv-arch__bits">32-bit</span>
          <span className="dv-arch__name">i386</span>
          <span className="dv-arch__note">非官方架构</span>
        </li>
      </ul>
      <dl className="dv-notes">
        <div>
          <dt>i386</dt>
          <dd>不再提供官方内核与安装器，只作为 amd64 系统上的部分 32 位用户空间保留。</dd>
        </div>
        <div>
          <dt>armel</dt>
          <dd>aurora 是最后一个支持 armel 的版本，内核仅支持少数早期单板机。</dd>
        </div>
      </dl>
    </div>
  )
}

/* ── 05 64-bit time_t ───────────────────────────────────────────────────── */

function BitStrip({ bits, label, limit }: { bits: number; label: string; limit: string }) {
  return (
    <figure className={`dv-strip is-${bits}`}>
      <figcaption>
        <b>{label}</b>
        <span>{limit}</span>
      </figcaption>
      <div className="dv-strip__cells" aria-hidden>
        {Array.from({ length: bits }, (_, i) => (
          <span key={i} style={style({ '--i': i })} />
        ))}
      </div>
    </figure>
  )
}

function Y2038Visual() {
  return (
    <div className="dv-bits">
      <BitStrip bits={32} label="32 位 time_t" limit="溢出于 2038-01-19 03:14:07 UTC" />
      <BitStrip bits={64} label="64 位 time_t" limit="上限约在 2920 亿年之后" />
      <dl className="dv-notes">
        <div>
          <dt>armel / armhf</dt>
          <dd>大量库改变了 ABI 但没有改 soname。第三方软件需要重新编译，并检查是否存在静默的数据丢失。</dd>
        </div>
        <div>
          <dt>last / lastb / lastlog</dt>
          <dd>旧日志格式无法记录 2038 年后的时间，三条命令已被替换为 wtmpdb、lastlog2 与 lslogins --failed。</dd>
        </div>
      </dl>
    </div>
  )
}

/* ── 06 /tmp on tmpfs ───────────────────────────────────────────────────── */

function TmpfsVisual() {
  return (
    <div className="dv-tmp">
      <figure className="dv-mem">
        <figcaption>
          <span>内存</span>
          <span>上限 50%，写入时才占用 · 填充量为示意</span>
        </figcaption>
        <div className="dv-mem__bar" aria-hidden>
          <span className="dv-mem__used" />
          <span className="dv-mem__cap" />
        </div>
        <div className="dv-mem__scale" aria-hidden>
          <span>0</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </figure>
      <table className="dv-clean">
        <thead>
          <tr>
            <th>目录</th>
            <th>未使用多久后删除</th>
            <th>重启后</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>/tmp</td>
            <td>10 天</td>
            <td>清空</td>
          </tr>
          <tr>
            <td>/var/tmp</td>
            <td>30 天</td>
            <td>保留</td>
          </tr>
        </tbody>
      </table>
      <p className="dv-fine">自动清理只对新安装生效；从 birch 升级的系统会生成 /etc/tmpfiles.d/tmp.conf 保留旧行为。</p>
      <div className="dv-cmd is-pair">
        <code>
          <span className="t-prompt">#</span> systemctl mask tmp.mount
        </code>
        <span>重启后恢复为普通目录</span>
      </div>
    </div>
  )
}

/** Optional element at the foot of the copy column, in place of a figure. */
export const detailAsides: Partial<Record<CardId, () => ReactNode>> = {
  apt: AptAside,
}

export const detailVisuals: Record<CardId, () => ReactNode> = {
  release: ReleaseVisual,
  apt: AptVisual,
  stack: StackVisual,
  riscv: RiscvVisual,
  y2038: Y2038Visual,
  tmpfs: TmpfsVisual,
}
