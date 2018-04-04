import { Component } from '../react'
import { setAttribute } from './dom'

export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode)

  if (container && ret.parentNode !== container ) {
    container.appendChild(ret)
  }

  return ret
}

function diffNode(dom, vnode) {
  let out = dom

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''

  if (typeof vnode === 'number') vnode = String(vnode)

  // diff text node
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) dom.textContent = vnode
    } else {
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }

    return out
  }

  // 如果是组件的话
  if (typeof vnode.tag === 'function')
    return diffComponent(dom, vnode)

  // 如果两边tag不一样的话
  if (!dom || dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
    out = document.createElement(vnode.tag)

    if (dom) {
      [...dom.childNodes].map(out.appendChild)

      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }

  }

  // 递归对比children
  if (
    (vnode.children && vnode.children.length > 0) ||
    (out.childNodes && out.childNodes.length > 0)
  ) {
    diffChildren(out, vnode.children)
  }

  diffAttributes(out, vnode)

  return out
}

function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes
  const children = []

  const keyed = {}

  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i]
      const key = child.key
      if (key) {
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length

    for (let i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i]
      const key = vchild.key
      let child

      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j]

          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined

            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++
            break
          }
        }
      }

      child = diffNode(child, vchild)

      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          dom.insertBefore(child, f)
        }
      }
    }
  }
}

function diffComponent(dom, vnode) {
  let c = dom && dom._component
  let oldDom = dom

  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs)
    dom = c.base
  } else {
    if (c) {
      unmountComponent(c)
      oldDom = null
    }

    // 创建了一个新的组件
    c = createComponent(vnode.tag, vnode.attrs)

    setComponentProps(c, vnode.attrs)
    dom = c.base

    if (oldDom && dom !== oldDom) {
      oldDom._component = null
      removeNode(oldDom)
    }
  }

  return dom
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount()
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props, context)
  }

  component.props = props

  renderComponent(component)
}

export function renderComponent(component) {
  let base

  const renderer = component.render()

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate()
  }

  base = diffNode(component.base, renderer)

  component.base = base
  base._component = component

  if (component.componentDidUpdate) {
    component.componentDidUpdate()
  }
}

function createComponent(component, props) {
  let inst

  if (component.prototype && component.prototype.render) {
    inst = new component(props)
  } else {
    inst = new Component(props)
    inst.constructor = component
    inst.render = function() {
      return this.constructor(props)
    }
  }

  return inst
}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount()
  removeNode(component.base)
}

function isSameNodeType() {
  return true
}

function diffAttributes(dom, vnode) {
  const old = dom.attributes
  const attrs = vnode.attrs

  for (let name in old) {
    if (!(name in attrs)) {
      setAttribute(dom, name, undefined)
    }
  }

  for (let name in attrs) {
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name])
    }
  }
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}
