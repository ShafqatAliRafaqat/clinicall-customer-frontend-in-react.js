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
  Button,
  Label,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import resetImg from "../../assets/img/pages/reset-password.png";
import "../../assets/scss/pages/authentication.scss";
import { InputField } from "../../components";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import { apiCall } from "../../utils";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";

class ResetPassword extends React.Component {
  state = {
    password: "",
    password_confirmation: "",
    isLoading: false,
  };

  resetPassword = async () => {
    try {
      const params = this.props.location.pathname.split("/");
      if (this.state.password !== this.state.password_confirmation) {
        this.props.addFlashMessage({
          type: "error",
          text: "Password doesn't match!",
        });
        return;
      }
      if (this.state.password.length < 6) {
        this.props.addFlashMessage({
          type: "error",
          text: "Password should contain more than 6 characters!",
        });
        return;
      }
      let url = `restpassword/${params[2]}/${params[3]}`;
      this.setState({
        isLoading: true,
      });
      let res = await apiCall("post", url, {
        password: this.state.password,
      });
      window.location.replace("/login");
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
    const { password_confirmation, password, isLoading } = this.state;
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
                  className="d-lg-block d-none text-center align-self-center px-5"
                >
                  <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
                </Col>
                <Col lg="6" md="12" className="p-0">
                  <Card className="rounded-0 mb-0 px-2 py-50">
                    <CardHeader className="pb-1 pt-1">
                      <CardTitle>
                        <h4 className="mb-0">Reset Password</h4>
                      </CardTitle>
                    </CardHeader>
                    <p className="px-2 auth-title">
                      Please enter your new password to continue.
                    </p>
                    <CardBody className="pt-1">
                      <Form>
                        <InputField
                          type="password"
                          placeholder="Password*"
                          value={password}
                          name="password"
                          onChange={(e) => {
                            this.setState({ password: e.target.value });
                          }}
                          label="Password*"
                        />
                        <InputField
                          type="password"
                          placeholder="Confirm Password*"
                          value={password_confirmation}
                          name="password_confirmation"
                          onChange={(e) => {
                            this.setState({
                              password_confirmation: e.target.value,
                            });
                          }}
                          label="Confirm Password*"
                        />
                        <div className="text-center">
                          {/* <Button.Ripple
                          block
                          className="btn-block"
                          color="primary"
                          outline
                          onClick={(e) => {
                            e.preventDefault();
                            history.push("login/dr");
                          }}
                        >
                          Go Back to Login
                        </Button.Ripple> */}
                          {!isLoading ? (
                            <Button.Ripple
                              block
                              color="primary"
                              type="submit"
                              className="btn-block mt-1 mt-sm-0"
                              onClick={(e) => {
                                e.preventDefault();
                                this.resetPassword();
                              }}
                            >
                              Reset
                            </Button.Ripple>
                          ) : (
                            <Button color="primary" disabled>
                              <Spinner color="white" size="sm" />
                              <span className="ml-50">Resetting...</span>
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
      </React.Fragment>
    );
  }
}
// export default withRouter(ResetPassword);

const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(ResetPassword));
