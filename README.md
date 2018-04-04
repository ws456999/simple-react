## simple-mvvm
A project to explain how react works

简单实现了react

```js
class Title extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {};
    }
    render() {
        return <h1>{this.props.content}</h1>;
    }
}

ReactDOM.render(
    <Title  content="title"/>,
    document.getElementById( 'root' )
);
```