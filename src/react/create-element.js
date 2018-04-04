import Component from './component'

export default function crreateElement (tag, attrs, ...children) {
  attrs = attrs || {}
  return {
    tag,
    attrs,
    children,
    key: attrs.key || null
  }
}