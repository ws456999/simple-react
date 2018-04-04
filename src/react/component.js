import { renderComponent } from '../react-dom/diff'

export default class Component {
  constructor(props = {}) {
    this.isReactComponent = true

    this.state = {}
    this.props = props
  }

  setState (stateChange) {
    Object.assign(this.state, stateChange)
    // 这里重新把这个components render一下，反正有diff，不要完全重新渲染的
    renderComponent(this)
  }
}
