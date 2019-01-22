import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import auth from "solid-auth-client";

import { Loader } from "./private-route.style";

type Props = {
  webId?: String,
  redirect: String,
  component: Node,
  loaderComponent: Node
};

class PrivateRoute extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      webId: null,
      checked: false
    };
  }
  componentDidMount() {
    this.getCurrentSession();
  }
  getCurrentSession = async () => {
    const session = await auth.currentSession();

    this.setState({ webId: session && session.webId, checked: true });
  };

  renderRouter = (): React.Element => {
    const { redirect, component: Component, ...rest } = this.props;
    return this.state.webId ? (
      <Route {...rest} component={Component} />
    ) : (
      <Redirect to={redirect} />
    );
  };

  render() {
    return this.state.checked
      ? this.renderRouter()
      : this.props.loaderComponent();
  }
}

PrivateRoute.defaultProps = {
  redirect: "/login",
  loaderComponent: () => (
    <Loader className="auth-loader">We are validating your data...</Loader>
  )
};

export default PrivateRoute;
