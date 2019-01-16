import React, { Component } from "react";
import auth from "solid-auth-client";
// In-house Components
import LoginFormUi from "./provider-login.ui";
// Utils
import { SolidError } from "@utils";
// Entities
import { Provider } from "@entities";

type Props = {
  providers: Array<Provider>,
  callback: String,
  className: String,
  selectPlaceholder: String,
  inputPlaholder: String,
  formButtonText: String,
  toggleButton: String,
  onError: (error: Error) => void
};

export default class LoginComponent extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      idp: null,
      withWebId: false,
      error: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset error state after user choose provider
    if (prevProps.idp !== '' && prevProps.idp !== this.props.idp) {
      this.setState({ error: null });
    }
  }

  goLogin = async (e: Event) => {
    try {
      e.preventDefault();

      const { idp } = this.state;
      const { callback } = this.props;

      if (!idp) {
        //@TODO: better error handling will be here
        throw new SolidError("Solid Provider is required", "idp");
      }

      const session = await auth.login(idp, {
        callback,
        storage: localStorage
      });

      if (session) {
        return this.setState({ session });
      }
      //@TODO: better error handling will be here
      throw new SolidError(
        "Something is wrong, please try again...",
        "unknow"
      );
    } catch (error) {
      // Error callback for custom error handling
      if (this.props.onError) {
        this.props.onError(error);
      }
      // Show form error messsage when idp is null
      if (error.name === 'idp') {
        this.setState({error});
      }
    }
  };

  onProviderSelect = ($event: Event) => {
    this.setState({ idp: $event.value || "" });
  };

  optionToggle = () =>
    this.setState({ withWebId: !this.state.withWebId, idp: "" });

  onChangeInput = (e: Event) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <LoginFormUi
        {...this.props}
        error={this.state.error}
        withWebId={this.state.withWebId}
        onSubmit={this.goLogin}
        optionToggle={this.optionToggle}
        onChangeInput={this.onChangeInput}
        onSelectChange={this.onProviderSelect}
      />
    );
  }
}

LoginComponent.defaultProps = {
  selectPlaceholder: "Select ID Provider",
  inputPlaholder: "ID Provider",
  formButtonText: "Log In",
  toggleButton: "Log in with WebID",
  providers: [
    {
      label: "Inrupt",
      image: "/img/inrupt_logo.png",
      value: "https://inrupt.net/auth",
      registerLink: "https://inrupt.net/register",
      description: "This is a prototype implementation of a Solid server"
    },
    {
      label: "Solid Community",
      image: "/img/Solid.png",
      value: "https://solid.community",
      registerLink: "https://solid.community/register",
      description: "This is a prototype implementation of a Solid server"
    }
  ]
};
