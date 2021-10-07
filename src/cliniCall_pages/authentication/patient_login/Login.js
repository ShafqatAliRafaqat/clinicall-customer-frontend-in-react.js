import React from "react";
import { Card, CardHeader, CardTitle, Row, Col, Button } from "reactstrap";
import loginImg from "../../../assets/img/clincall_illustration_image.png";
import logo from "../../../assets/img/logo.png";
import "../../../assets/scss/pages/authentication.scss";
import LoginJWT from "./LoginJWT";

class PatientLogin extends React.Component {
  state = {
    activeTab: "1",
  };
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="6" className=" text-center align-self-center px-1 py-0">
                <Col className=" text-left align-self-left px-1 py-0">
                  <img src={logo} alt="logo" width={60} height={40} />
                </Col>
                <Row className="m-0 mt-4">
                  <Col className=" text-center align-self-center px-1 py-0">
                    <h5>Welcome to CliniCALL</h5>
                  </Col>
                  <Col className=" text-center align-self-center px-1 py-0">
                    <img src={loginImg} alt="loginImg" />
                  </Col>
                  <Col className=" text-center align-self-center px-1 py-0">
                    <Button.Ripple color="primary" className="mt-4">
                      Login As Doctor
                    </Button.Ripple>
                  </Col>
                </Row>
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card
                  className="rounded-0 mb-0 px-2 login-tabs-container"
                  style={{ display: "grid", alignContent: "center" }}
                >
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0"> Login </h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Welcome back, please login to your account.
                  </p>
                  {/* <Nav tabs className="px-2">
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "1"
                                })}
                                onClick={() => {
                                  this.toggle("1")
                                }}
                              >
                                JWT
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "2"
                                })}
                                onClick={() => {
                                  this.toggle("2")
                                }}
                              >
                                Firebase
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={classnames({
                                  active: this.state.activeTab === "3"
                                })}
                                onClick={() => {
                                  this.toggle("3")
                                }}
                              >
                                Auth0
                              </NavLink>
                            </NavItem>
                          </Nav> */}
                  {/* <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1"> */}
                  <LoginJWT /> {/* </TabPane> */}
                  {/* <TabPane tabId="2">
                              <LoginFirebase />
                            </TabPane>
                            <TabPane tabId="3">
                              <LoginAuth0 />
                            </TabPane> */}
                  {/* </TabContent> */}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default PatientLogin;
