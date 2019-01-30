import React from "react";
import { withWebId } from "@solid/react";
import { Redirect } from "react-router-dom";

export const withAuthorization = (Component, Loader) =>
  withWebId(
    class WithAuthorization extends React.Component {
      render() {
        switch (this.props.webId) {
          case undefined:
            return Loader || null;
          case null:
            return <Redirect to={"/login"} />;
          default:
            return <Component {...this.props} />;
        }
      }
    }
  );
