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
import { InputField, DatePicker } from "../../../components";
import { apiCall, sendDateFormat } from "../../../utils";
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

class WebSettings extends React.Component {
  state = {
    id: null,
    name: "",
    value: "",
    webSettings: [],
    is_active: 0,
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getWebSettings = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_web_settings/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          webSettings: res.data.data,
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
    if (!this.state.value.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Value is required!",
      });
      return;
    }
    if (!this.state.id) {
      this.createWebSettings();
    } else {
      this.updateWebSettings();
    }
  };

  createWebSettings = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          value: this.state.value,
          is_active: this.state.is_active ? 1 : 0,
        };
        let url = `auth/doctor_web_setting`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const webSettings = this.state.webSettings;
        webSettings.push(res.data.data);
        this.setState({ webSettings: webSettings, isLoading: false });
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
      this.setState({ isLoading: false });
      console.log(err);
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  updateWebSettings = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          value: this.state.value,
          is_active: this.state.is_active ? 1 : 0,
        };
        let url = `auth/doctor_web_setting/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const updatedArray = [...this.state.webSettings];
        const index = updatedArray.findIndex(
          (websettings) => this.state.id === websettings.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ webSettings: updatedArray, isLoading: false });
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
      this.setState({ isLoading: false });
      console.log(err);
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  deleteWebSettings = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_web_setting`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.webSettings];
        const index = updatedArray.findIndex(
          (web) => this.state.delID === web.id
        );
        updatedArray.splice(index, 1);
        this.setState({ webSettings: updatedArray, isLoading: false });
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
    this.getWebSettings();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        name: "",
        value: "",
        is_active: 0,
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
    const { name, value, webSettings, isDataLoading, isLoading } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Social Links</h2>
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
          {webSettings.length ? (
            webSettings.map((websetting) => {
              return (
                <React.Fragment key={websetting.id}>
                  <Col lg="6" md="6" sm="12">
                    <Card
                      className="text-center"
                      style={{ backgroundColor: "#f3f5fc" }}
                    >
                      <CardBody>
                        <h5>{websetting.name}</h5>
                        <h6 className=" pb-1">{websetting.value}</h6>
                        <Chip
                          className="mx-2"
                          color={
                            websetting.is_active === 1 ? "success" : "danger"
                          }
                          text={
                            websetting.is_active === 1 ? "Active" : "Inactive"
                          }
                        />
                        <div className="card-btns d-flex justify-content-center mt-2">
                          <Button.Ripple
                            className="mx-1"
                            color="primary"
                            onClick={() => {
                              this.toggleModal();
                              this.setState({
                                id: websetting.id,
                                name: websetting.name,
                                value: websetting.value,
                                is_active: websetting.is_active,
                              });
                            }}
                          >
                            Update
                          </Button.Ripple>

                          <Button.Ripple
                            color="primary"
                            className="mx-1 bg-danger"
                            onClick={() => {
                              this.deleteModalToggle();
                              this.setState({ delID: websetting.id });
                            }}
                          >
                            Delete
                          </Button.Ripple>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </React.Fragment>
              );
            })
          ) : isDataLoading ? (
            <div className="text-center rounded py-3 bg-rgba-primary">
              <Spinner color="white" size="sm" />
            </div>
          ) : (
            <Col>
              <div className="text-center rounded py-3 bg-rgba-primary">
                <h5>No Web Setting Added Yet!</h5>
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
            {!this.state.id ? "Add Social Link" : "Update Social Link"}
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
                    type="text"
                    placeholder="Value*"
                    value={value}
                    id="value"
                    name="value"
                    onChange={this.onChange}
                    label="Value*"
                  />
                </Col>
                <Col md="6" sm="6" xs="6" className="mt-1">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      defaultChecked={false}
                      className="switch-danger"
                      name="is_active"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ is_active: 1 });
                        } else {
                          this.setState({ is_active: 0 });
                        }
                      }}
                      checked={this.state.is_active == 1 ? true : false}
                    />
                    <span className="label-text">
                      {this.state.is_active == 1 ? "Active" : "Inactive"}
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
          <ModalBody>Do you really want to delete this Social Link?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteWebSettings}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteWebSettings}>
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
// export default Web Settings;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(WebSettings));
