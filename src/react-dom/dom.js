/**
 * 设置dom的attr
 *
 * @export
 * @param {any} dom
 * @param {any} name
 * @param {any} value
 */
export function setAttribute (dom, name, value) {
  if (name === 'className') name = 'class'

  // 这里是event handler
  if (/on\w+/.test(name)) {
    name = name.toLowerCase()
    dom[name] = value || ''
  }
  // 如果是样式内容的话
  else if ( name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object' ) {
      for (let cssName in value) {
        dom.style[cssName] = typeof value[cssName] === 'number' ? `${value[cssName]}px` : value[cssName]
      }
    }
  }
  // 如果是自定义特定属性
  else {
    if (name in dom) {
      dom[name] = value || ''
    }
    if (value) {
      dom.setAttribute(name, value)
    } else {
      dom.removeAttribute(name, value)
    }
  }
}
