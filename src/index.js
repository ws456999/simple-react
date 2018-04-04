import React from './react'
import ReactDOM from './react-dom'

console.log(React, 123)
class Title extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {};
    }
    render() {
        return <h1>{this.props.content}</h1>;
    }
}

class Counter extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            num: 1
        }
    }

    onClick() {
        this.setState( { num: this.state.num + 1 } );
    }

    componentDidUpdate() {
        console.log( 'update' );
    }

    componentDidMount() {
        console.log( 'mount' );
    }

    render() {
        return (
            <div onClick={ () => this.onClick()}>
                <Title content="count:" />
                <div><Title content={ this.state.num } /></div>
            </div>
        );
    }
}

ReactDOM.render(
    <Counter />,
    document.getElementById( 'root' )
);
