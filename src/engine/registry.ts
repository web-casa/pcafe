// Registry shared by the gallery and the docs generator. The free catalog is
// always present; a Pro catalog is merged in only when a project installs it.

import { freeCatalog, type CatalogEntry, type PropDoc } from '../kit/catalog'

/** Shape of @pcafe/pro/src/catalog.ts. Typed here so the engine never imports Pro code. */
export interface ProCatalogEntry {
  id: string
  component: string
  pack: string
  name: string
  nameEn: string
  role: string
  summary: string
  summaryEn: string
  useWhen: string[]
  avoidWhen: string[]
  limits: string[]
  props: PropDoc[]
  demo: string
  interaction?: string
}

/** A catalog row the gallery can render, from either catalog. */
export interface RegisteredTemplate extends Omit<CatalogEntry, 'deck' | 'example'> {
  deck: string
  /** Pro entries have no inline example in the engine gallery. */
  example?: string
}

export class TemplateRegistry {
  readonly free: readonly CatalogEntry[] = freeCatalog
  readonly pro: readonly ProCatalogEntry[]

  constructor(pro: readonly ProCatalogEntry[] = []) {
    this.pro = pro
  }

  /** Free entries first, then Pro entries; a Pro pack name is its deck key. */
  get all(): RegisteredTemplate[] {
    return [...this.free, ...this.pro.map((entry) => ({ ...entry, deck: entry.pack }))]
  }

  byId(id: string): RegisteredTemplate | undefined {
    return this.all.find((entry) => entry.id === id)
  }
}
