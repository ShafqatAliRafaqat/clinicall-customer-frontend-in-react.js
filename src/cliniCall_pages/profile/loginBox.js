import React from "react"
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button, Form } from "reactstrap"
import { InputField } from '../../components/inputField'
import SignUpModal from './signUpModal'
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class LatestPhotos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      modal: false
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  submitLogin = (e) => {
    e.preventDefault();
    const { phone, password } = this.state;
    if (!phone.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Username is required!",
      });
      return;
    }
    if (
      !password.trim() ||
      password.trim().length < 6 ||
      password.trim().length > 20
    ) {
      this.props.addFlashMessage({
        type: "error",
        text: "Password is required and must be between 6-20 characters!",
      });
      return;
    }
    console.log(phone, password);
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
  }
  render() {
    const { phone, password, modal } = this.state;
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
                <Col>
                  <InputField
                    type="text"
                    placeholder="username*"
                    value={phone}
                    name="phone"
                    label="Username*"
                    onChange={this.handleChange}
                  />
                  <InputField
                    type="password"
                    placeholder="Password*"
                    value={password}
                    name="password"
                    label="Password*"
                    onChange={this.handleChange}
                  />
                  <div className="text-center d-block mb-1">
                    <p className='font-small-3'>Don't have an account? <span onClick={this.toggleModal} className="text-primary cursor-pointer">Sign up</span></p>
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="px-75 btn-block"
                      onClick={(e) => this.submitLogin(e)}
                    >
                      Login
                    </Button.Ripple>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
        <FlashMessage />
        <SignUpModal modal={modal} toggleModal={this.toggleModal} />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(LatestPhotos));