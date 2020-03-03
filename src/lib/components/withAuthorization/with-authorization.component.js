import React from 'react';
import { withWebId } from '@solid/react';

export const withAuthorization = (Component, Loader) =>
  withWebId(
    class WithAuthorization extends React.Component {
      render() {
        const { webId } = this.props;
        switch (webId) {
          case undefined:
            return Loader || null;
          case null:
            window.location.href = '/login';
            return null;
          default:
            return <Component {...this.props} />;
        }
      }
    }
  );
