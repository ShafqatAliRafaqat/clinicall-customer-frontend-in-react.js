import React from "react";
import {
  Button,
  Form,
  Label,
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

class Awards extends React.Component {
  state = {
    id: null,
    name: "",
    year: new Date(),
    description: "",
    awards: [],
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getAwards = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_awards/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          awards: res.data.data,
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
      this.setState({ isDataLoading: false });
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
        text: "Title is required!",
      });
      return;
    }
    if (!this.state.description.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Description is required!",
      });
      return;
    }
    if (!this.state.year) {
      this.props.addFlashMessage({
        type: "error",
        text: "Date is required!",
      });
      return;
    }
    if (this.state.year > new Date()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Date must be from the past!",
      });
      return;
    }

    if (!this.state.id) {
      this.createAward();
    } else {
      this.updateAward();
    }
  };

  createAward = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          description: this.state.description,
          year: sendDateFormat(this.state.year),
        };
        let url = `auth/doctor_award`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const awards = [res.data.data, ...this.state.awards];
        this.setState({ awards: awards, isLoading: false });
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

  updateAward = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          description: this.state.description,
          year: sendDateFormat(this.state.year),
        };
        let url = `auth/doctor_award/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);

        const updatedArray = [...this.state.awards];
        const index = updatedArray.findIndex(
          (award) => this.state.id === award.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ awards: updatedArray, isLoading: false });
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

  deleteAward = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_award`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.awards];
        const index = updatedArray.findIndex(
          (award) => this.state.delID === award.id
        );
        updatedArray.splice(index, 1);
        this.setState({ awards: updatedArray, isLoading: false });
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
    this.getAwards();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        name: "",
        year: new Date(),
        description: "",
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

  render() {
    const {
      name,
      description,
      year,
      awards,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Awards</h2>
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
          {awards.length ? (
            awards.map((award) => (
              <React.Fragment key={award.id}>
                <Col lg="6" md="6" sm="12">
                  <Card
                    className="text-center"
                    style={{ backgroundColor: "#f3f5fc" }}
                  >
                    <CardBody>
                      <h5>{award.name}</h5>
                      <h6 className=" pb-1">{award.year}</h6>
                      <h6 className="pb-1">{award.description}</h6>
                      <div className="card-btns d-flex justify-content-center mt-2">
                        <Button.Ripple
                          className="mx-1"
                          color="primary"
                          onClick={() => {
                            this.toggleModal();
                            this.setState({
                              id: award.id,
                              name: award.name,
                              description: award.description,
                              year: [award.year],
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
                            this.setState({ delID: award.id });
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
                <h5>No Award Added Yet!</h5>
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
            {!this.state.id ? "Add Award" : "Update Award"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Title*"
                    name="title"
                    value={name}
                    onChange={(e) => {
                      this.setState({ name: e.target.value });
                    }}
                    id="title"
                    placeholder="Title*"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="textarea"
                    label="Description*"
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => {
                      this.setState({ description: e.target.value });
                    }}
                    rows="3"
                    placeholder="Description*"
                  />
                </Col>
                <Col sm="12">
                  <Label className="d-block">Year*</Label>
                  <DatePicker
                    value={year}
                    options={{
                      altInput: false,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                    name="year"
                    onChange={(date) => {
                      this.setState({
                        year: date[0],
                      });
                    }}
                  />
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
          <ModalBody>Do you really want to delete this Award?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteAward}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteAward}>
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
// export default Awards;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Awards));
