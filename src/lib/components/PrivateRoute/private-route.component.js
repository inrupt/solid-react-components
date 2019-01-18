import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import withWebId from "./WithWebId";

type Props = {
  webId?: String,
  redirect: String,
  component: Node
};

class PrivateRoute extends Component<Props> {
  render() {
    const { webId, redirect, component: Component, ...rest } = this.props;
    return webId ? (
      <Route {...rest} component={Component} />
    ) : (
      <Redirect to={redirect} />
    );
  }
}

PrivateRoute.defaultProps = {
  redirect: '/login'
};

export default withWebId(PrivateRoute);
