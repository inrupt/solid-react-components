import React from "react";
import auth from "solid-auth-client";

/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */
export default function withWebId(Component) {
  return class WithWebID extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        webId: null
      };
    }
    componentDidMount() {
      auth.trackSession(session => {
        if (session) {
          this.setState({ webId: session.webId });
        }
      });
    }
    render() {
      return <Component webId={this.state.webId} {...this.props} />;
    }
  };
}
