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
            // Using the non-SPA redirect here to clear the state when the user is not logged in
            // This helps with making sure state is fully clean on login, and addresses an issue with
            // the react-router-dom v5 upgrade, which didn't like using <Redirect> here
            window.location.href = '/login';
            return null;
          default:
            return <Component {...this.props} />;
        }
      }
    }
  );
