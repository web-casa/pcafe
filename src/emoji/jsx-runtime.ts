// Every template goes through this, so emoji in any string become images from the bundled set.
import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime'
import { withEmoji } from './render'

export { Fragment }
export const jsx: typeof reactJsx = (type, props, key) => reactJsx(type, withEmoji(type, props as Record<string, unknown>), key)
export const jsxs: typeof reactJsxs = (type, props, key) => reactJsxs(type, withEmoji(type, props as Record<string, unknown>), key)
