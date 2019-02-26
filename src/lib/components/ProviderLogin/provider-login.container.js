import React, { Component } from "react";
import auth from "solid-auth-client";
// In-house Components
import LoginForm from "./children/Form";
// Utils
import { SolidError } from "@utils";
// Entities
import { Provider } from "@entities";

import SolidImg from "../../../assets/solid_logo.png";
import InruptImg from "../../../assets/inrupt_logo.png";

type Props = {
  providers: Array<Provider>,
  callbackUri: String,
  className: String,
  selectPlaceholder: String,
  inputPlaholder: String,
  formButtonText: String,
  btnTxtWebId: String,
  btnTxtProvider: String,
  onError: (error: Error) => void
};

export default class LoginComponent extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      idp: null,
      withWebId: true,
      error: null
    };
  }

  isWebIdValid = webId => {
    const regex = new RegExp(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      "i",
      "g"
    );
    return regex.test(webId);
  };

  componentDidUpdate(prevProps, prevState) {
    // Reset error state after user choose provider
    if (prevProps.idp !== "" && prevProps.idp !== this.props.idp) {
      this.setState({ error: null });
    }
  }

  goLogin = async (e: Event) => {
    try {
      e.preventDefault();

      const { idp, withWebId } = this.state;
      const { callbackUri } = this.props;

      if (!idp) {
        const errorMessage = withWebId
          ? "Valid WebID is required"
          : "Solid Provider is required";
        //@TODO: better error handling will be here
        throw new SolidError(errorMessage, "idp");
      }

      if (idp && withWebId && !this.isWebIdValid(idp)) {
        throw new SolidError("WeibID is not valid", "idp");
      }

      const session = await auth.login(idp, {
        callbackUri,
        storage: localStorage
      });

      if (session) {
        return this.setState({ session });
      }
      //@TODO: better error handling will be here
      throw new SolidError("Something is wrong, please try again...", "unknow");
    } catch (error) {
      // Error callback for custom error handling
      if (this.props.onError) {
        this.props.onError(error);
      }
      // Show form error messsage when idp is null
      if (error.name === "idp") {
        this.setState({ error });
      }
    }
  };

  onProviderSelect = ($event: Event) => {
    const idp = $event && $event.value;
    this.setState({ idp: idp || "", error: !idp });
  };

  optionToggle = () =>
    this.setState({ withWebId: !this.state.withWebId, idp: "", error: null });

  onChangeInput = (e: Event) => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.isWebIdValid(e.target.value)) {
      this.setState({ error: null });
    }
  };

  render() {
    return (
      <LoginForm
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
  inputPlaholder: "WebID",
  formButtonText: "Log In",
  btnTxtWebId: "Log In with WebId",
  btnTxtProvider: "Log In with Provider",
  providers: [
    {
      label: "Inrupt",
      image: InruptImg,
      value: "https://inrupt.net/auth",
      registerLink: "https://inrupt.net/register",
      description: "This is a prototype implementation of a Solid server"
    },
    {
      label: "Solid Community",
      image: SolidImg,
      value: "https://solid.community",
      registerLink: "https://solid.community/register",
      description: "This is a prototype implementation of a Solid server"
    }
  ]
};
