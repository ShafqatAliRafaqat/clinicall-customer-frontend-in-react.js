import React from "react";
import {
  Button,
  Form,
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Plus } from "react-feather";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { InputField } from "../../../components";
import { apiCall } from "../../../utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import query from "query-string";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Chip from "../../../components/@vuexy/chips/ChipComponent";

class Assistants extends React.Component {
  state = {
    id: null,
    name: "",
    phone: "",
    email: "",
    assistants: [],
    status: 0,
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getAssistants = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_assistant/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          assistants: res.data.data,
        });
      }
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        return;
      }
      console.log(err);
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  submit = () => {
    if (!this.state.name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is required!",
      });
      return;
    }
    if (!this.state.phone.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Phone is required!",
      });
      return;
    }
    if (!this.state.email.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Email is required!",
      });
      return;
    }
    if (!this.state.id) {
      this.createAssistants();
    } else {
      this.updateAssistants();
    }
  };

  createAssistants = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          phone: this.state.phone,
          email: this.state.email,
          status: this.state.status ? 1 : 0,
        };
        let url = `auth/doctor_assistants`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });
        const assistants = this.state.assistants;
        assistants.push(res.data.data);
        this.setState({ assistants: assistants });
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        this.toggleModal();
      }
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        return;
      }
      console.log(err);
      this.setState({ isLoading: false });
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  updateAssistants = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          phone: this.state.phone,
          email: this.state.email,
          status: this.state.status ? 1 : 0,
        };
        let url = `auth/doctor_assistants/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const updatedArray = [...this.state.assistants];
        const index = updatedArray.findIndex(
          (assistant) => this.state.id === assistant.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ assistants: updatedArray });

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        this.toggleModal();
      }
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        return;
      }
      console.log(err);
      this.setState({ isLoading: false });
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  deleteAssistant = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_assistants`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.assistants];
        const index = updatedArray.findIndex(
          (assistant) => this.state.delID === assistant.id
        );
        updatedArray.splice(index, 1);
        this.setState({ assistants: updatedArray, isLoading: false });
        this.deleteModalToggle();
      }
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        return;
      }
      this.setState({ isLoading: false });
      console.log(err);
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  componentDidMount() {
    this.getAssistants();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        name: "",
        phone: "",
        email: "",
        status: 0,
      }));
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  deleteModalToggle = () => {
    this.setState((prevState) => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    const {
      name,
      phone,
      email,
      assistants,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Assistants</h2>
          <div className="icon-section text-right mb-2">
            <div
              className={`avatar avatar-stats p-50 m-0 bg-rgba-primary`}
              onClick={this.toggleModal}
            >
              <div className="avatar-content">
                <Plus className="primary" size={22} />
              </div>
            </div>
          </div>
        </div>
        <Row>
          {assistants.length ? (
            assistants.map((assistant) => (
              <React.Fragment key={assistant.id}>
                <Col lg="6" md="6" sm="12">
                  <Card
                    className="text-center"
                    style={{ backgroundColor: "#f3f5fc" }}
                  >
                    <CardBody>
                      <h5>{assistant.name}</h5>
                      <h6 className=" pb-1">{assistant.phone}</h6>
                      <h6 className="pb-1">{assistant.email}</h6>
                      <Chip
                        className="m-0"
                        color={assistant.status === 1 ? "success" : "danger"}
                        text={assistant.status === 1 ? "Active" : "Inactive"}
                      />
                      <div className="card-btns d-flex justify-content-center mt-2">
                        <Button.Ripple
                          className="mx-1"
                          color="primary"
                          onClick={() => {
                            this.toggleModal();
                            this.setState({
                              id: assistant.id,
                              name: assistant.name,
                              phone: assistant.phone,
                              email: assistant.email,
                              status: assistant.status,
                            });
                          }}
                        >
                          Update
                        </Button.Ripple>
                        <Button.Ripple
                          color="danger"
                          className="mx-1"
                          onClick={() => {
                            this.deleteModalToggle();
                            this.setState({ delID: assistant.id });
                          }}
                        >
                          Delete
                        </Button.Ripple>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </React.Fragment>
            ))
          ) : isDataLoading ? (
            <div className="text-center rounded py-3 bg-rgba-primary">
              <Spinner color="white" size="sm" />
            </div>
          ) : (
            <Col>
              <div className="text-center rounded py-3 bg-rgba-primary">
                <h5>No Assistant Added Yet!</h5>
              </div>
            </Col>
          )}
        </Row>
        <FlashMessage />
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
            {!this.state.id ? "Add Assistant" : "Update Assistant"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Name *"
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    id="name"
                    placeholder="Name *"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="number"
                    placeholder="Phone*"
                    value={phone}
                    id="phone"
                    name="phone"
                    onChange={this.onChange}
                    label="Phone*"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="email"
                    placeholder="Email *"
                    value={email}
                    id="email"
                    name="email"
                    onChange={this.onChange}
                    label="Email *"
                  />
                </Col>
                <Col md="6" sm="6" xs="6" className="mt-1">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      defaultChecked={false}
                      className="switch-danger"
                      name="status"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ status: 1 });
                        } else {
                          this.setState({ status: 0 });
                        }
                      }}
                      checked={this.state.status === 1 ? true : false}
                    />
                    <span className="label-text">
                      {this.state.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </label>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="primary" onClick={this.submit}>
                Submit
              </Button>
            ) : (
              <Button color="primary" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Uploading...</span>
              </Button>
            )}
            {/* <Button.Ripple
              className="mr-1"
              color="primary"
              onClick={this.submit}
            >
              Save
            </Button.Ripple> */}
            <Button.Ripple color="danger" outline onClick={this.toggleModal}>
              Cancel
            </Button.Ripple>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.deleteModal}
          toggle={this.deleteModalToggle}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.deleteModalToggle} className="bg-danger">
            Confirm
          </ModalHeader>
          <ModalBody>Do you really want to delete this Assistant?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteAssistant}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteAssistant}>
              Confirm
            </Button> */}
            <Button color="secondary" onClick={this.deleteModalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
// export default Assistants;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Assistants));
