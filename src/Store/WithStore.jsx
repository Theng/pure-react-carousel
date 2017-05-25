import React from 'react';
import equal from 'equals';

export default function WithStore(WrappedComponent, mapStateToProps = () => ({})) {
  class Wrapper extends React.Component {
    static propTypes = {
      children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node,
      ]),
    }

    static defaultProps = {
      children: null,
    }

    static contextTypes = {
      store: React.PropTypes.object,
    }

    constructor(props, context) {
      super(props, context);
      this.state = {
        stateProps: mapStateToProps(context.store.getState()),
      };
    }

    componentDidMount() {
      // this.context.store.subscribe(() => this.forceUpdate());
      this.context.store.subscribe(() => this.updateStateProps());
    }

    shouldComponentUpdate(nextProps, nextState) {
      // Note: If we do go back to this.forceUpdate(), shouldComponentUpdate() is not called.
      return !equal(nextState, this.state) || !equal(nextProps, this.props);
    }

    updateStateProps() {
      this.setState({
        stateProps: mapStateToProps(this.context.store.getState()),
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state.stateProps}
          store={{
            setState: this.context.store.setState,
          }}
        >{this.props.children}</WrappedComponent>);
    }
  }

  return Wrapper;
}
