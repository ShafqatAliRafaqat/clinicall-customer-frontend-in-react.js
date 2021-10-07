import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Spinner,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import { InputField } from "../../components/inputField";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SignUpModal from "./signUpModal";
import {
  apiCall,
  convertPhone,
  phoneValidate,
  emailValidate,
} from "../../utils";
import SweetAlert from "react-bootstrap-sweetalert";

const ForgetPassword = (props) => {
  const { forgetPassword, isloading, email, password, phone } = props;
  if (forgetPassword.step === 1) {
    return (
      <div>
        <p className="px-2 auth-title">
          Please enter your{" "}
          {forgetPassword.isEmail ? "email address" : "phone number"} and we'll
          send you instructions on how to reset your password.
        </p>
        <Form>
          <div className="d-flex ml-2">
            <FormGroup className="form-label-group">
              <Radio
                label="Email"
                onChange={props.toggleEmail}
                checked={forgetPassword.isEmail}
                name="emialRadio"
              />
            </FormGroup>
            <FormGroup className="form-label-group mx-auto">
              <Radio
                label="Phone"
                onChange={props.toggleEmail}
                checked={!forgetPassword.isEmail}
                name="phoneRadio"
              />
            </FormGroup>
          </div>
          {forgetPassword.isEmail ? (
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder="Email*"
                value={email}
                name="email"
                onChange={(e) => props.handleChange(e)}
                required
              />
              <Label>Email*</Label>
            </FormGroup>
          ) : (
            <FormGroup className="form-label-group">
              <Input
                type="number"
                placeholder="Phone*"
                name="phone"
                onChange={(e) => props.handleChange(e)}
                value={phone}
                required
              />
              <Label>Phone*</Label>
            </FormGroup>
          )}
          <div className="text-center d-block mb-1">
            {isloading ? (
              <Button.Ripple color="primary">
                <Spinner />
              </Button.Ripple>
            ) : (
              <React.Fragment>
                <Button.Ripple
                  color="dangers"
                  className="px-75 btn-block text-center"
                  onClick={(e) => props.goBack(e)}
                >
                  Back
                </Button.Ripple>
                <Button.Ripple
                  color="primary"
                  className="px-75 btn-block text-center"
                  onClick={(e) => props.recoverPassword(e)}
                >
                  Continue
                </Button.Ripple>
              </React.Fragment>
            )}
          </div>
        </Form>
      </div>
    );
  } else if (forgetPassword.step === 2) {
    return (
      <div>
        <p>
          A temporary password is sent on your phone, please enter it to login
          to your account
        </p>
        <Form>
          <InputField
            type="text"
            placeholder="password*"
            value={password}
            name="password"
            label="password*"
            onChange={(e) => props.handleChange(e)}
          />
          {isloading ? (
            <Button.Ripple color="primary">
              <Spinner />
            </Button.Ripple>
          ) : (
            <Button.Ripple color="primary" className="px-75 btn-block">
              Login
            </Button.Ripple>
          )}
        </Form>
      </div>
    );
  }
};

class AuthenticationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forgetPassword: { condition: false, step: 1, isEmail: true },
      isUser: false,
      authenticate: false,
      isloading: false,
      phone: "",
      password: "",
      email: "",
      signUpModal: false,
      successAlert: false,
    };
  }

  toggleEmail = () => {
    const { forgetPassword } = this.state;
    forgetPassword.isEmail = !forgetPassword.isEmail;
    this.setState({ forgetPassword });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modal !== prevState.modal) {
      return { modal: nextProps.modal };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modal !== this.props.modal) {
      this.setState({ isUser: false, authenticate: false });
      let forgetPassword = { condition: false, step: 1, isEmail: true };
      this.setState({ forgetPassword });
    }
  }
  authenticateUser = async (e) => {
    e.preventDefault();
    const { phone } = this.state;
    if (!phone) {
      this.props.addFlashMessage({
        type: "error",
        text: "please enter a valid phone number",
      });
      return;
    }
    this.setState({ isloading: true });
    try {
      let res = await apiCall("post", `username-verify/${this.props.data.id}`, {
        username: phone,
      });
      if (res.data.message === "NOT_FOUND") {
        this.props.toggleModal();
        this.togglesignUpModal();
        this.setState({ isloading: false });
        return;
      }
      this.setState({ isUser: true, authenticate: true, isloading: false });
    } catch (err) {
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
      this.setState({
        isLoading: false,
      });
    }
  };

  handleForPass = () => {
    const { forgetPassword } = this.state;
    forgetPassword.condition = true;
    this.setState({ forgetPassword });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  togglesignUpModal = () => {
    this.setState({ signUpModal: !this.state.signUpModal });
  };
  recoverPassword = async (e) => {
    const { forgetPassword, email, phone } = this.state;
    e.preventDefault();
    try {
      if (forgetPassword.isEmail && !emailValidate(email)) {
        this.props.addFlashMessage({
          type: "error",
          text: "Email is invalid!",
        });
        return;
      } else if (!forgetPassword.isEmail && !phoneValidate(phone)) {
        this.props.addFlashMessage({
          type: "error",
          text: "Phone is invalid!",
        });
        return;
      }
      this.setState({
        isLoading: true,
      });
      let res = null;
      if (email) {
        res = await apiCall("post", "forget/email", {
          email: email,
        });
      } else {
        res = await apiCall("post", "get-otp", {
          phone: convertPhone(phone),
        });
      }
      if (forgetPassword.isEmail) {
        this.setState({ successAlert: true });
      } else {
        const { forgetPassword } = this.state;
        forgetPassword.condition = false;
        this.setState({ forgetPassword });
      }
    } catch (err) {
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
      this.setState({
        isLoading: false,
      });
    }
  };

  goBack = () => {
    const { forgetPassword } = this.state;
    forgetPassword.condition = false;
    this.setState({ forgetPassword });
  };

  handleLogin = (e) => {};

  render() {
    const { modal, data } = this.props;
    const {
      isUser,
      authenticate,
      isloading,
      forgetPassword,
      phone,
      password,
      signUpModal,
      email,
      successAlert,
    } = this.state;
    return (
      <React.Fragment>
        <Modal
          isOpen={modal}
          toggle={this.props.toggleModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.props.toggleModal} className="bg-primary">
            {forgetPassword.condition
              ? "Recover your password"
              : "Book Appointment"}
          </ModalHeader>
          <ModalBody className="modal-dialog-centered justify-content-center mt-2">
            {forgetPassword.condition ? (
              <ForgetPassword
                email={email}
                password={password}
                phone={phone}
                forgetPassword={forgetPassword}
                toggleEmail={this.toggleEmail}
                handleChange={this.handleChange}
                isloading={isloading}
                recoverPassword={this.recoverPassword}
                goBack={this.goBack}
              />
            ) : (
              <div>
                <p>
                  We are about to confirm your booking with {data.full_name}.
                  Please provide your mobile number to complete the booking.
                </p>
                <Form>
                  <InputField
                    type="text"
                    placeholder="username*"
                    value={phone}
                    name="phone"
                    label="Username*"
                    onChange={this.handleChange}
                    disabled={isUser && authenticate ? true : false}
                  />
                  {isUser && authenticate && (
                    <React.Fragment>
                      <InputField
                        type="password"
                        placeholder="Password*"
                        value={password}
                        name="password"
                        label="Password*"
                        onChange={this.handleChange}
                      />
                      <Row>
                        <Col xs="6">
                          <p
                            className="forgetPassword"
                            onClick={this.handleForPass}
                          >
                            Forgot password?
                          </p>
                        </Col>
                      </Row>
                      <div className="text-center d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          className="px-75 btn-block"
                          onClick={(e) => this.authenticateUser(e)}
                        >
                          Login
                        </Button.Ripple>
                      </div>
                    </React.Fragment>
                  )}
                  {!isUser && !authenticate && (
                    <div className="text-center d-block mb-1">
                      {isloading ? (
                        <Button.Ripple color="primary">
                          <Spinner />
                        </Button.Ripple>
                      ) : (
                        <Button.Ripple
                          color="primary"
                          className="px-75 btn-block"
                          onClick={(e) => this.authenticateUser(e)}
                        >
                          Continue
                        </Button.Ripple>
                      )}
                    </div>
                  )}
                </Form>
              </div>
            )}
          </ModalBody>
          <FlashMessage />
          <SweetAlert
            success
            title="Password Reset Email Sent"
            show={successAlert}
            onConfirm={() => {
              this.props.toggleModal();
              this.setState({ successAlert: false });
            }}
          >
            <p className="sweet-alert-text">
              An Email has been sent to your recovery email address{" "}
              <span style={{ fontWeight: "bold" }}>{this.state.email}</span>.
              Please check your email inbox and follow the instructions to reset
              your password.
            </p>
          </SweetAlert>
        </Modal>
        <SignUpModal
          modal={signUpModal}
          toggleModal={this.togglesignUpModal}
          data={data}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(AuthenticationModal));
