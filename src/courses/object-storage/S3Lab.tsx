// The "try the real thing" step: send requests to a pretend bucket and watch both what is stored
// (a flat list of keys) and what a console infers from it (folders).
import { useMemo, useRef, useState, type ReactElement } from 'react'
import { Rich } from '../../course/blocks'
import type { LabContext, LabTask } from '../../course/types'
import { byteLength, listKeys, send, requestLine, fakeEtag, type SimObject, type SimRequest, type SimResponse, type Verb } from './sim'
import './figures.css'

const SEED = ['Development/Projects.xls', 'Finance/statement1.pdf', 'Private/taxdocument.pdf', 's3-dg.pdf']
const seedObjects = (): SimObject[] => SEED.map((key) => ({ key, body: `（${key} 的内容）`, etag: fakeEtag(key) }))

const VERBS: { verb: Verb; note: string }[] = [
  { verb: 'PUT', note: '上传' },
  { verb: 'GET', note: '读取' },
  { verb: 'LIST', note: '列举' },
  { verb: 'DELETE', note: '删除' },
]

const PUPPY = 'photos/puppy.jpg'

/** What a response means, in one sentence. Written for the common cases; silent otherwise. */
function explain(res: SimResponse, req: SimRequest): string | null {
  if (req.verb === 'GET' && res.status === 404) {
    if (req.key.endsWith('/')) return `桶里没有键正好等于 ${req.key} 的对象。“文件夹”不是对象，想看里面有什么要用 LIST。`
    return `桶里没有这个键。GET 要的是完整键，只差一个字符也算不存在。`
  }
  if (req.verb === 'PUT' && res.overwrote) return '同名键被整体覆盖：旧内容没了，ETag 也变了。'
  if (req.verb === 'PUT' && !res.existed && req.key.includes('/')) return '你只写了一个对象。看下面：“文件夹”是从键名推断出来的，没人创建过它。'
  if (req.verb === 'PUT') return '写成功了。这之后的读取和列举都会立刻看到它。'
  if (req.verb === 'DELETE' && res.existed) return '对象没了。如果这是某个前缀下的最后一个键，“文件夹”也就消失了。'
  if (req.verb === 'DELETE') return '这个键本来就不存在，这个模拟器同样返回 204。'
  if (req.verb === 'LIST' && res.commonPrefixes?.length) return '带 delimiter 时，更深的键被折叠进 CommonPrefixes，这就是“文件夹”。'
  if (req.verb === 'LIST') return '“打开文件夹”就是这个请求：按前缀列出键。'
  return null
}

export function S3Lab({ ctx }: { ctx: LabContext }) {
  const [objects, setObjects] = useState<SimObject[]>(seedObjects)
  const [req, setReq] = useState<SimRequest>({ verb: 'PUT', key: PUPPY, body: '小狗照片·第一版', prefix: 'photos/', delimiter: true })
  const [res, setRes] = useState<{ res: SimResponse; req: SimRequest } | null>(null)
  const [cwd, setCwd] = useState('')
  const overwrote = useRef(false)
  const sendRef = useRef<HTMLButtonElement>(null)
  const outRef = useRef<HTMLDivElement>(null)
  const bytes = byteLength(req.key)
  const tooLong = bytes > 1024
  const noKey = req.verb !== 'LIST' && !req.key.trim()

  const fire = (r: SimRequest, setFolder = true) => {
    const out = send(objects, r)
    setObjects(out.objects)
    setRes({ res: out.res, req: r })
    if (r.verb === 'PUT' && out.res.overwrote && r.key === PUPPY) overwrote.current = true
    if (r.verb === 'PUT' && r.key === PUPPY) ctx.complete('put')
    if (r.verb === 'GET' && r.key === 'photos/' && out.res.status === 404) ctx.complete('folder')
    if (r.verb === 'GET' && r.key === PUPPY && out.res.status === 200 && overwrote.current) ctx.complete('overwrite')
    if (r.verb === 'LIST' && r.prefix === 'photos/') ctx.complete('list')
    if (r.verb === 'DELETE' && r.key === PUPPY && out.res.existed) ctx.complete('delete')
    if (setFolder && r.verb === 'LIST') setCwd(r.prefix)
    // On a phone the response sits below the fold.
    requestAnimationFrame(() => outRef.current?.scrollIntoView({ block: 'nearest' }))
  }

  /** Fill in a task and bring the send button to hand: on a phone the task list and the form are a screen apart. */
  const fill = (t: LabTask) => {
    setReq((r) => ({ ...r, ...presetFor(t) }))
    sendRef.current?.focus({ preventScroll: true })
    sendRef.current?.scrollIntoView({ block: 'center' })
  }

  const presetFor = (t: LabTask): Partial<SimRequest> => {
    const has = objects.some((o) => o.key === PUPPY)
    switch (t.id) {
      case 'put':
        return { verb: 'PUT', key: PUPPY, body: '小狗照片·第一版' }
      case 'folder':
        return { verb: 'GET', key: 'photos/' }
      case 'overwrite':
        if (!has) return { verb: 'PUT', key: PUPPY, body: '小狗照片·第一版' }
        return overwrote.current ? { verb: 'GET', key: PUPPY } : { verb: 'PUT', key: PUPPY, body: '小狗照片·第二版' }
      case 'list':
        return { verb: 'LIST', prefix: 'photos/', delimiter: true }
      case 'delete':
        return has ? { verb: 'DELETE', key: PUPPY } : { verb: 'PUT', key: PUPPY, body: '小狗照片·第一版' }
      default:
        return {}
    }
  }

  const here = useMemo(() => listKeys(objects, cwd, true), [objects, cwd])
  const crumbs = cwd.split('/').filter(Boolean)

  return (
    <div className="os-lab">
      <div className="os-lab__col">
        {ctx.tasks((t): ReactElement | null => (
          <button type="button" className="c-btn c-btn--ghost os-fill" data-fill onClick={() => fill(t)}>
            填入这一步
          </button>
        ))}
      </div>
      <div className="os-lab__col">
        <form
          className="os-composer"
          onSubmit={(e) => {
            e.preventDefault()
            if (!tooLong && !noKey) fire(req)
          }}
        >
          <div className="os-verbs" role="group" aria-label="请求方法">
            {VERBS.map((v) => (
              <button type="button" key={v.verb} data-verb={v.verb} aria-pressed={req.verb === v.verb} onClick={() => setReq((r) => ({ ...r, verb: v.verb }))}>
                <b>{v.verb}</b>
                <span>{v.note}</span>
              </button>
            ))}
          </div>
          {req.verb === 'LIST' ? (
            <div className="os-fields">
              <label>
                <span>prefix（前缀）</span>
                <input data-prefix value={req.prefix} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={(e) => setReq((r) => ({ ...r, prefix: e.target.value }))} />
              </label>
              <label className="os-check">
                <input type="checkbox" data-delimiter checked={req.delimiter} onChange={(e) => setReq((r) => ({ ...r, delimiter: e.target.checked }))} />
                <span>delimiter=/（把更深的键折叠成“文件夹”）</span>
              </label>
            </div>
          ) : (
            <div className="os-fields">
              <label>
                <span>
                  键
                  <em data-too-long={tooLong || undefined}>{bytes} / 1024 字节</em>
                </span>
                <input data-key value={req.key} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={(e) => setReq((r) => ({ ...r, key: e.target.value }))} />
              </label>
              {req.verb === 'PUT' && (
                <label>
                  <span>内容</span>
                  <input data-body value={req.body} autoComplete="off" onChange={(e) => setReq((r) => ({ ...r, body: e.target.value }))} />
                </label>
              )}
            </div>
          )}
          <code className="os-line" data-line>
            {requestLine(req)}
          </code>
          <button type="submit" className="c-btn c-btn--primary os-send" data-send ref={sendRef} aria-disabled={tooLong || noKey}>
            发送请求
          </button>
          {tooLong && <p className="os-warn">键超过 1024 字节，超过了上限。</p>}
          {noKey && <p className="os-warn">先写一个键。</p>}
        </form>
        <div className="os-response" role="status" data-response data-status={res?.res.status} ref={outRef}>
          {res ? (
            <>
              <p className="os-response__head" data-ok={res.res.status < 300 || undefined}>
                <b>
                  {res.res.status} {res.res.text}
                </b>
                <code>{res.res.line}</code>
              </p>
              <dl className="os-response__body">
                {res.res.code && (
                  <div>
                    <dt>错误码</dt>
                    <dd>{res.res.code}</dd>
                  </div>
                )}
                {res.res.etag && (
                  <div>
                    <dt>ETag（模拟值）</dt>
                    <dd>{res.res.etag}</dd>
                  </div>
                )}
                {res.res.body !== undefined && (
                  <div>
                    <dt>对象内容</dt>
                    <dd>{res.res.body}</dd>
                  </div>
                )}
                {res.res.contents && (
                  <div>
                    <dt>Contents</dt>
                    <dd>{res.res.contents.join('\n') || '（无）'}</dd>
                  </div>
                )}
                {res.res.commonPrefixes && (
                  <div>
                    <dt>CommonPrefixes</dt>
                    <dd>{res.res.commonPrefixes.join('\n') || '（无）'}</dd>
                  </div>
                )}
              </dl>
              {explain(res.res, res.req) && (
                <p className="os-response__note">
                  <Rich text={explain(res.res, res.req)!} />
                </p>
              )}
            </>
          ) : (
            <p className="os-response__empty">响应会显示在这里。</p>
          )}
        </div>
        {res && ctx.active && (
          <button type="button" className="c-btn c-btn--ghost os-next" data-next onClick={() => fill(ctx.active!)}>
            <span>
              下一步：
              <Rich text={ctx.active.text} />
            </span>
          </button>
        )}
        <div className="os-views">
          <section data-flat>
            <h2>桶里实际存的</h2>
            <p>一张扁平的键列表，按字节排序。</p>
            <ol className="os-keys">
              {objects.map((o) => (
                <li key={o.key} data-key-row={o.key} data-hit={(cwd && o.key.startsWith(cwd)) || undefined}>
                  {cwd && o.key.startsWith(cwd) ? (
                    <>
                      <mark>{cwd}</mark>
                      {o.key.slice(cwd.length)}
                    </>
                  ) : (
                    o.key
                  )}
                </li>
              ))}
            </ol>
          </section>
          <section data-tree>
            <h2>控制台显示成</h2>
            <p>同一批键，用 prefix 和 / 推断出的层级。</p>
            <div className="os-crumbs">
              <button type="button" data-crumb="" onClick={() => fire({ ...req, verb: 'LIST', prefix: '', delimiter: true })}>
                桶
              </button>
              {crumbs.map((c, i) => {
                const prefix = `${crumbs.slice(0, i + 1).join('/')}/`
                return (
                  <button type="button" key={prefix} data-crumb={prefix} onClick={() => fire({ ...req, verb: 'LIST', prefix, delimiter: true })}>
                    {c}/
                  </button>
                )
              })}
            </div>
            <ul className="os-tree">
              {here.commonPrefixes.map((p) => (
                <li key={p}>
                  <button type="button" data-folder={p} onClick={() => fire({ ...req, verb: 'LIST', prefix: p, delimiter: true })}>
                    <FolderGlyph />
                    {p.slice(cwd.length)}
                  </button>
                </li>
              ))}
              {here.contents.map((k) => (
                <li key={k} data-file={k}>
                  <FileGlyph />
                  {k.slice(cwd.length)}
                </li>
              ))}
              {!here.commonPrefixes.length && !here.contents.length && <li className="os-tree__empty">这个前缀下已经没有键了，所以这个“文件夹”也不存在了。</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export const FolderGlyph = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

export const FileGlyph = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <path d="M6 3h8l4 4v14H6zM14 3v4h4" />
  </svg>
)
