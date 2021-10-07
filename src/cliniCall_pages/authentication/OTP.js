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
} from "reactstrap";
import fgImg from "../../assets/img/pages/forgot-password.png";
import { history } from "../../history";
import "../../assets/scss/pages/authentication.scss";
import { InputField } from "../../components";
// import OtpInput from "react-otp-input";

class OTP extends React.Component {
  state = {
    username: "",
    password: "",
  };

  handleChange = (otp) => this.setState({ otp });

  render() {
    const { username, password } = this.state;
    return (
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
                <Card className="rounded-0 mb-0 px-2 py-1">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Login</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title" style={{ fontSize: "0.7rem" }}>
                    A temporary password has been sent to your Phone Number.
                    Login here with that password.
                  </p>
                  <CardBody className="pt-1 pb-0">
                    <Form>
                      {/* <FormGroup className="form-label-group">
                        <OtpInput
                          value={this.state.otp}
                          onChange={this.handleChange}
                          numInputs={6}
                          shouldAutoFocus={true}
                          containerStyle="justify-content-between"
                          inputStyle={{ width: "3em", height: "3em" }}
                        />
                      </FormGroup> */}
                      <InputField
                        type="text"
                        placeholder="username*"
                        value={username}
                        name="username"
                        onChange={(e) => {
                          this.setState({ username: e.target.value });
                        }}
                        label="Username*"
                      />
                      <InputField
                        type="text"
                        placeholder="Password*"
                        value={password}
                        name="password"
                        onChange={(e) => {
                          this.setState({ password: e.target.value });
                        }}
                        label="Password*"
                      />
                      {/* <div className="float-md-left d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          outline
                          className="px-75 btn-block"
                          // onClick={() => history.push("/login/dr-ikrama")}
                        >
                          Resend
                        </Button.Ripple>
                      </div> */}
                      <div className="text-center d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="px-75 btn-block"
                          onClick={(e) => {
                            e.preventDefault();
                            history.push("");
                          }}
                        >
                          Login
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default OTP;
