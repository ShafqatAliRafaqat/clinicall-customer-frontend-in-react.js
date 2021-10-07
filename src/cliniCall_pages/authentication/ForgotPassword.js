import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
} from "reactstrap";
import fgImg from "../../assets/img/pages/forgot-password.png";
import { history } from "../../history";
import "../../assets/scss/pages/authentication.scss";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import {
  apiCall,
  convertPhone,
  phoneValidate,
  emailValidate,
} from "../../utils";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { Umbrella } from "react-feather";

class ForgotPassword extends React.Component {
  state = {
    isEmail: true,
    phone: "",
    email: "",
    isLoading: false,
    successAlert: false,
  };

  recoverPassword = async () => {
    try {
      if (this.state.isEmail && !emailValidate(this.state.email)) {
        this.props.addFlashMessage({
          type: "error",
          text: "Email is invalid!",
        });
        return;
      } else if (!this.state.isEmail && !phoneValidate(this.state.phone)) {
        this.props.addFlashMessage({
          type: "error",
          text: "Phone is invalid!",
        });
        return;
      }
      let url = "admin/organization";
      this.setState({
        isLoading: true,
      });
      let res = null;
      if (this.state.email) {
        res = await apiCall("post", "forget/email", {
          email: this.state.email,
        });
      } else {
        res = await apiCall("post", "get-otp", {
          phone: convertPhone(this.state.phone),
        });
      }

      if (this.state.isEmail) {
        this.setState({ successAlert: true });
      } else {
        history.push("/otp");
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
  render() {
    const { isEmail, email, phone, isLoading } = this.state;
    return (
      <React.Fragment>
        <FlashMessage />
        <Row className="m-0 justify-content-center">
          <Col
            sm="8"
            xl="7"
            lg="10"
            md="8"
            className="d-flex justify-content-center"
          >
            <Card className="bg-authentication rounded-0 mb-0 w-100">
              <Row className="m-0">
                <Col
                  lg="6"
                  className="d-lg-block d-none text-center align-self-center"
                >
                  <img src={fgImg} alt="fgImg" />
                </Col>
                <Col lg="6" md="12" className="p-0">
                  <Card
                    className="rounded-0 mb-0 px-2 py-1 login-tabs-container"
                    style={{ display: "grid", alignContent: "center" }}
                  >
                    <CardHeader className="pb-1">
                      <CardTitle>
                        <h4 className="mb-0">Recover your password</h4>
                      </CardTitle>
                    </CardHeader>
                    <p className="px-2 auth-title">
                      Please enter your{" "}
                      {isEmail ? "email address" : "phone number"} and we'll
                      send you instructions on how to reset your password.
                    </p>

                    <CardBody className="pt-1 pb-0">
                      <Form>
                        <div className="d-flex">
                          <FormGroup className="form-label-group">
                            <Radio
                              label="Email"
                              onChange={(e) => {
                                this.setState({ isEmail: true });
                              }}
                              checked={isEmail}
                              name="emialRadio"
                            />
                          </FormGroup>
                          <FormGroup className="form-label-group mx-auto">
                            <Radio
                              label="Phone"
                              onChange={(e) => {
                                this.setState({ isEmail: false });
                              }}
                              checked={!isEmail}
                              name="phoneRadio"
                            />
                          </FormGroup>
                        </div>
                        {isEmail ? (
                          <FormGroup className="form-label-group">
                            <Input
                              type="text"
                              placeholder="Email*"
                              value={email}
                              onChange={(e) => {
                                this.setState({ email: e.target.value });
                              }}
                              required
                            />
                            <Label>Email*</Label>
                          </FormGroup>
                        ) : (
                          <FormGroup className="form-label-group">
                            <Input
                              type="number"
                              placeholder="Phone*"
                              onChange={(e) => {
                                this.setState({
                                  phone: e.target.value,
                                });
                              }}
                              value={phone}
                              required
                            />
                            <Label>Phone*</Label>
                          </FormGroup>
                        )}
                        <div className="float-md-left d-block mb-1">
                          <Button.Ripple
                            color="primary"
                            outline
                            className="px-75 btn-block"
                            onClick={() => history.goBack()}
                          >
                            Back to Login
                          </Button.Ripple>
                        </div>
                        <div className="float-md-right d-block mb-1">
                          {!isLoading ? (
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="px-75 btn-block"
                              onClick={(e) => {
                                e.preventDefault();
                                this.recoverPassword();
                              }}
                            >
                              Recover Password
                            </Button.Ripple>
                          ) : (
                            <Button color="primary" disabled>
                              <Spinner color="white" size="sm" />
                              <span className="ml-50">Sending...</span>
                            </Button>
                          )}
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <SweetAlert
          success
          title="Password Reset Email Sent"
          show={this.state.successAlert}
          onConfirm={() => history.push("/login")}
        >
          <p className="sweet-alert-text">
            An Email has been sent to your recovery email address{" "}
            <span style={{ fontWeight: "bold" }}>{this.state.email}</span>.
            Please check your email inbox and follow the instructions to reset
            your password.
          </p>
        </SweetAlert>
      </React.Fragment>
    );
  }
}
// export default ForgotPassword;

const mapStateToProps = (state) => {
  return {
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(ForgotPassword);
