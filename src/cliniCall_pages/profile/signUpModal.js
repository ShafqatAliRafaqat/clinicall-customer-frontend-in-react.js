import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Spinner,
} from "reactstrap";
import { InputField } from "../../components/inputField";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  apiCall,
  convertPhone,
  phoneValidate,
  emailValidate,
} from "../../utils";

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phone: "",
      name: "",
      isLoading: false,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  patientSignUp = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { email, phone, name } = this.state;
    if (!name) {
      this.setState({ isLoading: false });
      this.props.addFlashMessage({
        type: "error",
        text: "Name is invalid!",
      });
    } else if (!phoneValidate(phone)) {
      this.setState({ isLoading: false });
      this.props.addFlashMessage({
        type: "error",
        text: "Phone is invalid!",
      });
      return;
    } else if (!emailValidate(email)) {
      this.setState({ isLoading: false });
      this.props.addFlashMessage({
        type: "error",
        text: "Email is invalid!",
      });
      return;
    }
    try {
      let res = await apiCall("post", `patient-signup/${this.props.data.id}`, {
        name,
        email,
        phone: convertPhone(phone),
      });
      this.setState({ isLoading: false });
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
    const { modal } = this.props;
    const { email, phone, name, isLoading } = this.state;
    return (
      <Modal
        isOpen={modal}
        toggle={this.props.toggleModal}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={this.props.toggleModal} className="bg-primary">
          Sign Up
        </ModalHeader>
        <ModalBody
          className="modal-dialog-centered justify-content-center"
          style={{ marginTop: "4rem" }}
        >
          <div>
            <p>
              Please register yourself to continue booking your appointment.
            </p>
            <Form>
              <InputField
                type="text"
                placeholder="Name*"
                value={name}
                name="name"
                label="Name*"
                onChange={this.handleChange}
              />
              <InputField
                type="number"
                placeholder="Phone Number*"
                value={phone}
                name="phone"
                label="Phone Number*"
                onChange={this.handleChange}
              />
              <InputField
                type="email"
                placeholder="Email*"
                value={email}
                name="email"
                label="Email*"
                onChange={this.handleChange}
              />
              <div className="text-center d-block mb-1">
                {isLoading ? (
                  <Button.Ripple color="primary">
                    <Spinner />
                  </Button.Ripple>
                ) : (
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="px-75 btn-block"
                    onClick={(e) => this.patientSignUp(e)}
                  >
                    Sign Up
                  </Button.Ripple>
                )}
              </div>
            </Form>
          </div>
        </ModalBody>
        <FlashMessage />
      </Modal>
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
})(withRouter(SignUpModal));
