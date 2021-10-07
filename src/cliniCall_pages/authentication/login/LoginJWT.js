import React from "react";
import { Link } from "react-router-dom";
import { CardBody, FormGroup, Form, Button, Spinner } from "reactstrap";
import { Lock, User } from "react-feather";
import { login } from "../../../redux/actions/auth/loginActions";
import { connect } from "react-redux";
import { InputField } from "../../../components";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import { getCountries } from "../../../redux/actions/countries";
import { getCities } from "../../../redux/actions/cities";
import FlashMessage from "../../../components/flashMessageList";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    remember: false,
    isLoading: false,
    messagetext: "",
    messageType: "success",
    source: "BOP",
  };

  handleLogin = async (e) => {
    e.preventDefault();
    if (!this.state.username.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Username is required!",
      });
      return;
    }
    if (
      !this.state.password.trim() ||
      this.state.password.trim().length < 6 ||
      this.state.password.trim().length > 20
    ) {
      this.props.addFlashMessage({
        type: "error",
        text: "Password is required and must be between 6-20 characters!",
      });
      return;
    }
    this.setState({ isLoading: true });
    const err = await this.props.login({ ...this.state });
    this.props.getCountries();
    this.props.getCities();
    if (err) {
      this.props.addFlashMessage({
        type: "error",
        text: err,
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        <CardBody className="pt-1">
          <Form onSubmit={this.handleLogin}>
            <InputField
              type="text"
              placeholder="Username*"
              value={this.state.username}
              onChange={(e) =>
                this.setState({
                  username: e.target.value,
                })
              }
              // required
              icon={User}
              label="Username*"
            />
            <InputField
              type="password"
              placeholder="Password*"
              value={this.state.password}
              onChange={(e) =>
                this.setState({
                  password: e.target.value,
                })
              }
              // required
              icon={Lock}
              label="Password*"
            />
            <FormGroup className="d-flex justify-content-between align-items-center">
              {/* <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Remember me"
                  defaultChecked={false}
                  onChange={this.handleRemember}
                /> */}
              <div className="float-right">
                <Link to="/forgot-password"> Forgot Password ? </Link>
              </div>
            </FormGroup>
            <div className="text-right">
              {/* <Button.Ripple
                  color="primary"
                  outline
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Register
                </Button.Ripple> */}
              {!this.state.isLoading ? (
                <Button.Ripple color="primary" type="submit">
                  Login
                </Button.Ripple>
              ) : (
                <Button color="primary">
                  <Spinner />
                </Button>
              )}
            </div>
          </Form>
        </CardBody>

        <FlashMessage />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  login,
  addFlashMessage,
  getCountries,
  getCities,
})(withRouter(Login));
