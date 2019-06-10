import React, { Component } from 'react';
import { withWebId } from '@solid/react';
import { Redirect, Route } from 'react-router-dom';

import { Loader } from './private-route.style';

type Props = {
  webId: String | null,
  redirect?: String,
  component: Node,
  loaderComponent?: Node
};

export class PrivateRoute extends Component<Props> {
  renderRouter = (): React.Element => {
    const { webId, redirect, component: RenderComponent, ...rest } = this.props;
    return webId ? (
      <Route {...rest} component={RenderComponent} />
    ) : (
      <Redirect to={redirect} />
    );
  };

  render() {
    const { webId, loaderComponent } = this.props;
    return webId === null || webId === undefined
      ? loaderComponent()
      : this.renderRouter();
  }
}

PrivateRoute.defaultProps = {
  redirect: '/login',
  loaderComponent: () => (
    <Loader className="auth-loader">We are validating your data...</Loader>
  )
};

export default withWebId(PrivateRoute);
