import { Fragment, jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime'
import { withEmoji } from './render'

export { Fragment }
export const jsxDEV: typeof reactJsxDEV = (type, props, key, isStatic, source, self) =>
  reactJsxDEV(type, withEmoji(type, props as Record<string, unknown>), key, isStatic, source, self)
