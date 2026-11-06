// Figures for this lesson. Each one explains something; none is decoration.
import { useState } from 'react'
import { listKeys, type SimObject } from './sim'
import { FileGlyph, FolderGlyph } from './S3Lab'
import './figures.css'

/** The cover: a real object address from the S3 User Guide, taken apart. */
export function AddressHero() {
  return (
    <figure className="os-hero">
      <figcaption>一个对象的地址</figcaption>
      <p className="os-hero__url">
        <span className="os-hero__dim">https://</span>
        <span className="os-hero__part is-bucket">
          amzn-s3-demo-bucket
          <small>桶</small>
        </span>
        <span className="os-hero__dim">.s3.us-west-2.amazonaws.com/</span>
        <span className="os-hero__part is-key">
          photos/puppy.jpg
          <small>键</small>
        </span>
      </p>
      <p className="os-hero__q">
        看到 <code>photos/</code> 你会想到文件夹。可它并不存在。
      </p>
    </figure>
  )
}

/** Bucket, key, data, metadata. */
export function ObjectFigure() {
  return (
    <div className="os-object">
      <p className="os-object__bucket">
        <span>桶</span>
        <code>amzn-s3-demo-bucket</code>
      </p>
      <div className="os-object__card">
        <section>
          <h3>键</h3>
          <code>photos/puppy.jpg</code>
          <p>对象在桶内的唯一标识，UTF-8 编码，最长 1024 字节。</p>
        </section>
        <section>
          <h3>数据</h3>
          <code>{'<0 字节 … 50 TB>'}</code>
          <p>对象本身的内容，系统不关心格式。单次 PUT 最多 5 GB。</p>
        </section>
        <section>
          <h3>元数据</h3>
          <code>
            Content-Type: image/jpeg
            <br />
            x-amz-meta-camera: …
          </code>
          <p>系统元数据加用户自定义的键值对。用户元数据上传后不能直接修改。</p>
        </section>
      </div>
    </div>
  )
}

const DOC_KEYS = ['Development/Projects.xls', 'Finance/statement1.pdf', 'Private/taxdocument.pdf', 's3-dg.pdf']
const DOC_OBJECTS: SimObject[] = DOC_KEYS.map((key) => ({ key, body: '', etag: '' }))

/** Tap a folder and see which keys it stands for. */
export function KeyViews() {
  const [open, setOpen] = useState<string | null>(null)
  const { commonPrefixes, contents } = listKeys(DOC_OBJECTS, '', true)
  return (
    <div className="os-views os-views--fig" data-keyviews>
      <section>
        <h3>控制台显示成</h3>
        <p>点一个文件夹试试。</p>
        <ul className="os-tree">
          {commonPrefixes.map((p) => (
            <li key={p}>
              <button type="button" data-folder={p} aria-pressed={open === p} onClick={() => setOpen(open === p ? null : p)}>
                <FolderGlyph />
                {p}
              </button>
            </li>
          ))}
          {contents.map((k) => (
            <li key={k}>
              <FileGlyph />
              {k}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>桶里实际存的</h3>
        <p>就这四个键，没有别的。</p>
        <ol className="os-keys">
          {DOC_KEYS.map((k) => (
            <li key={k} data-hit={open && k.startsWith(open) ? true : undefined}>
              {open && k.startsWith(open) ? (
                <>
                  <mark>{open}</mark>
                  {k.slice(open.length)}
                </>
              ) : (
                k
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

/** Four verbs. */
export function VerbList() {
  const rows = [
    { verb: 'PUT', path: 'PUT /photos/puppy.jpg', body: '上传一个对象；同名键会被整体覆盖。', reply: '200 OK  ETag: "…"' },
    { verb: 'GET', path: 'GET /photos/puppy.jpg', body: '读取对象；HEAD 只取元数据不取内容。', reply: '200 OK  <对象数据>' },
    { verb: 'LIST', path: 'GET /?list-type=2&prefix=photos/', body: '按前缀列出键，就是“打开文件夹”。', reply: '200 OK  <Contents>…' },
    { verb: 'DELETE', path: 'DELETE /photos/puppy.jpg', body: '删除对象；之后的读取不再返回数据。', reply: '204 No Content' },
  ]
  return (
    <ul className="os-verbrows">
      {rows.map((r) => (
        <li key={r.verb}>
          <b>{r.verb}</b>
          <div>
            <p>{r.body}</p>
            <code>{r.path}</code>
            <code className="is-reply">{r.reply}</code>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Count the nines, literally. */
export function NinesFigure() {
  return (
    <div className="os-nines">
      <section data-kind="durability">
        <header>
          <b>耐久度</b>
          <span>数据会不会丢</span>
        </header>
        <p className="os-nines__value" aria-label="99.999999999%">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="os-nine">
              9<small>{i + 1}</small>
            </span>
          ))}
          <em>%</em>
        </p>
      </section>
      <section data-kind="availability">
        <header>
          <b>可用性</b>
          <span>此刻能不能访问</span>
        </header>
        <p className="os-nines__value" aria-label="99.99%">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="os-nine">
              9<small>{i + 1}</small>
            </span>
          ))}
          <em>%</em>
        </p>
      </section>
    </div>
  )
}
