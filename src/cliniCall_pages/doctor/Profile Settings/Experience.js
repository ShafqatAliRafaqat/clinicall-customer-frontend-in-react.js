import React from "react";
import {
  Button,
  Form,
  Label,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "reactstrap";
import { Plus, Check } from "react-feather";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { InputField, DatePicker, TextareaField } from "../../../components";
import { apiCall, sendDateFormat } from "../../../utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";
import query from "query-string";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";

class Experiences extends React.Component {
  state = {
    id: null,
    description: "",
    year_from: new Date(),
    year_to: new Date(),
    designation: "",
    institute: "",
    is_current: 0,
    experiences: [],
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getExperiences = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_experiences/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);

        this.setState({
          experiences: res.data.data,
          isDataLoading: false,
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
    if (!this.state.designation.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Designation is required!",
      });
      return;
    }

    if (!this.state.institute.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Institute is required!",
      });
      return;
    }
    if (this.state.description && this.state.description.length > 100) {
      this.props.addFlashMessage({
        type: "error",
        text: "Description length exceeds the limit!",
      });
      return;
    }
    if (this.state.is_current !== 1 && !this.state.year_to) {
      this.props.addFlashMessage({
        type: "error",
        text: "`Year to` date is required!",
      });
      return;
    }
    if (!this.state.year_from) {
      this.props.addFlashMessage({
        type: "error",
        text: "`Year from` date is required!",
      });
      return;
    }
    if (this.state.year_from > new Date()) {
      this.props.addFlashMessage({
        type: "error",
        text: "`Year from` date must be from the past!",
      });
      return;
    }

    if (!this.state.id) {
      this.createExperience();
    } else {
      this.updateExperience();
    }
  };

  createExperience = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          designation: this.state.designation,
          institute: this.state.institute,
          description: this.state.description,
          year_from: sendDateFormat(this.state.year_from),
          year_to: null,
          is_current: this.state.is_current,
        };
        if (this.state.is_current !== 1)
          data = { ...data, year_to: sendDateFormat(this.state.year_to) };
        let url = `auth/doctor_experience`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const experiences = [res.data.data, ...this.state.experiences];
        this.setState({ experiences: experiences });

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
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  updateExperience = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          designation: this.state.designation,
          institute: this.state.institute,
          description: this.state.description,
          year_from: sendDateFormat(this.state.year_from),
          year_to: null,
          is_current: this.state.is_current,
        };
        if (this.state.is_current !== 1)
          data = { ...data, year_to: sendDateFormat(this.state.year_to) };

        let url = `auth/doctor_experience/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const updatedArray = [...this.state.experiences];
        const index = updatedArray.findIndex(
          (experience) => this.state.id === experience.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ experiences: updatedArray });

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

  deleteExperience = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_experience`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.experiences];
        const index = updatedArray.findIndex(
          (experience) => this.state.delID === experience.id
        );
        updatedArray.splice(index, 1);
        this.setState({ experiences: updatedArray });

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
    this.getExperiences();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        description: "",
        year_from: new Date(),
        year_to: new Date(),
        designation: "",
        institute: "",
        is_current: 0,
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
      designation,
      institute,
      description,
      year_from,
      year_to,
      experiences,
      is_current,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Experiences</h2>
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
          {experiences.length ? (
            experiences.map((experience) => (
              <React.Fragment key={experience.id}>
                <Col lg="6" md="6" sm="12">
                  <Card
                    className="text-center"
                    style={{ backgroundColor: "#f3f5fc" }}
                  >
                    <CardBody>
                      <h5>{experience.designation}</h5>
                      <h6 className=" pb-1">{experience.institute}</h6>
                      <h6 className="pb-1">
                        {experience.year_from} to{" "}
                        {experience.year_to ? experience.year_to : "Present"}
                      </h6>
                      <h6 className="pb-1" style={{ minHeight: "90px" }}>
                        {experience.description}
                      </h6>
                      <div className="card-btns d-flex justify-content-center mt-2">
                        <Button.Ripple
                          className="mx-1"
                          color="primary"
                          onClick={() => {
                            this.toggleModal();
                            this.setState({
                              id: experience.id,
                              designation: experience.designation,
                              institute: experience.institute,
                              description: experience.description,
                              year_from: sendDateFormat(experience.year_from),
                              year_to: experience.year_to
                                ? sendDateFormat(experience.year_to)
                                : new Date(),
                              is_current: experience.is_current,
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
                            this.setState({ delID: experience.id });
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
                <h5>No Experience Added Yet!</h5>
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
          <ModalHeader className="bg-primary" toggle={this.toggleModal}>
            {!this.state.id ? "Add Experience" : "Update Experience"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Designation*"
                    name="designation"
                    value={designation}
                    onChange={(e) => {
                      this.setState({ designation: e.target.value });
                    }}
                    placeholder="Designation*"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Institute*"
                    name="institute"
                    id="institute"
                    value={institute}
                    onChange={(e) => {
                      this.setState({ institute: e.target.value });
                    }}
                    placeholder="Institute*"
                  />
                </Col>
                <Col sm="12">
                  <TextareaField
                    label="Description"
                    placeholder="Description"
                    name="description"
                    value={description || ""}
                    id="description"
                    length={100}
                    onChange={(e) => {
                      this.setState({ description: e.target.value });
                    }}
                  />
                </Col>
                <Col lg="3" md="3">
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    label="Present"
                    size={10}
                    style={{ width: "auto" }}
                    checked={is_current === 1}
                    onChange={(e) => {
                      if (e.target.checked) this.setState({ is_current: 1 });
                      else this.setState({ is_current: 0 });
                    }}
                  />
                </Col>
                <Col lg="12" md="12" sm="12">
                  <Row className="mx-2">
                    <Col lg={is_current !== 1 ? "6" : "12"}>
                      <Label className="d-block">Date From*</Label>
                      <DatePicker
                        value={year_from}
                        options={{
                          altInput: false,
                          altFormat: "F j, Y",
                          dateFormat: "Y-m-d",
                        }}
                        name="year"
                        onChange={(date) => {
                          this.setState({
                            year_from: date[0],
                          });
                        }}
                      />
                    </Col>
                    {is_current !== 1 && (
                      <Col lg="6">
                        <Label className="d-block">Date to*</Label>
                        <DatePicker
                          value={year_to}
                          options={{
                            altInput: false,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                          }}
                          name="year"
                          onChange={(date) => {
                            this.setState({
                              year_to: date[0],
                            });
                          }}
                        />
                      </Col>
                    )}
                  </Row>
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
          <ModalBody>Do you really want to delete this Experience?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteExperience}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteExperience}>
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
// export default Experiences;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Experiences));
