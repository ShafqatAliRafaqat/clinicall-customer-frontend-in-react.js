import React from "react";
import {
  Button,
  Form,
  Label,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Plus } from "react-feather";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { InputField, DatePicker, Select } from "../../../components";
import { apiCall, sendDateFormat } from "../../../utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import query from "query-string";

class Qualifications extends React.Component {
  state = {
    id: null,
    start_year: new Date(),
    end_year: new Date(),
    title: "",
    university: "",
    qualifications: [],
    countriesOptions: this.props.countries.countriesOptions,
    country: { value: "PAK", label: "Pakistan" },
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getQualifications = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_qualifications/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          qualifications: res.data.data,
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
      this.setState({ isDataLoading: false });
      console.log(err);
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  submit = () => {
    if (!this.state.title.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Title is required!",
      });
      return;
    }
    if (!this.state.university.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "University is required!",
      });
      return;
    }
    if (!this.state.country.value.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Country is required!",
      });
      return;
    }
    if (!this.state.start_year) {
      this.props.addFlashMessage({
        type: "error",
        text: "`Start Year` date is required!",
      });
      return;
    }
    if (!this.state.end_year) {
      this.props.addFlashMessage({
        type: "error",
        text: "`End Year` date is required!",
      });
      return;
    }
    if (this.state.start_year >= new Date()) {
      this.props.addFlashMessage({
        type: "error",
        text: "`Start Year` date must be from the past!",
      });
      return;
    }
    if (this.state.end_year >= new Date()) {
      this.props.addFlashMessage({
        type: "error",
        text: "`End Year` date must be from the past!",
      });
      return;
    }

    if (!this.state.id) {
      this.createQualification();
    } else {
      this.updateQualification();
    }
  };

  createQualification = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          title: this.state.title,
          university: this.state.university,
          country_code: this.state.country.value,
          start_year: sendDateFormat(this.state.start_year),
          end_year: null,
        };
        if (this.state.is_current !== 1)
          data = { ...data, end_year: sendDateFormat(this.state.end_year) };
        let url = `auth/doctor_qualification`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);

        const qualifications = [res.data.data, ...this.state.qualifications];
        this.setState({ qualifications: qualifications, isLoading: false });

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

  updateQualification = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          title: this.state.title,
          university: this.state.university,
          country_code: this.state.country.value,
          start_year: sendDateFormat(this.state.start_year),
          end_year: null,
        };
        if (this.state.is_current !== 1)
          data = { ...data, end_year: sendDateFormat(this.state.end_year) };

        let url = `auth/doctor_qualification/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);

        const updatedArray = [...this.state.qualifications];
        const index = updatedArray.findIndex(
          (qualification) => this.state.id === qualification.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ qualifications: updatedArray, isLoading: false });

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

  deleteQualification = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_qualification`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.qualifications];
        const index = updatedArray.findIndex(
          (qualification) => this.state.delID === qualification.id
        );
        updatedArray.splice(index, 1);
        this.setState({ qualifications: updatedArray, isLoading: false });
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
    this.getQualifications();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        start_year: new Date(),
        end_year: new Date(),
        title: "",
        university: "",
        countriesOptions: this.props.countries.countriesOptions,
        country: { value: "PAK", label: "Pakistan" },
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
      title,
      university,
      start_year,
      country,
      end_year,
      countriesOptions,
      qualifications,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Qualifications</h2>
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
          {qualifications.length ? (
            qualifications.map((qualification) => {
              const coun = countriesOptions.find(
                (country) => country.value === qualification.country_code.code
              );
              return (
                <React.Fragment key={qualification.id}>
                  <Col lg="6" md="6" sm="12">
                    <Card
                      className="text-center"
                      style={{ backgroundColor: "#f3f5fc" }}
                    >
                      <CardBody>
                        <h5>{qualification.title}</h5>
                        <h6 className=" pb-1">{qualification.university}</h6>
                        <h6 className="pb-1">
                          {qualification.start_year} to {qualification.end_year}
                        </h6>
                        <h6 className="pb-1" style={{ minHeight: "90px" }}>
                          {coun.label}
                        </h6>
                        <div className="card-btns d-flex justify-content-center mt-2">
                          <Button.Ripple
                            className="mx-1"
                            color="primary"
                            onClick={() => {
                              this.toggleModal();
                              this.setState({
                                id: qualification.id,
                                title: qualification.title,
                                university: qualification.university,
                                country: coun,
                                start_year: sendDateFormat(
                                  qualification.start_year
                                ),
                                end_year: sendDateFormat(
                                  qualification.end_year
                                ),
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
                              this.setState({ delID: qualification.id });
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
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
            {!this.state.id ? "Add Qualification" : "Update Qualification"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Title*"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      this.setState({ title: e.target.value });
                    }}
                    placeholder="Title*"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="text"
                    label="University*"
                    name="university"
                    id="university"
                    value={university}
                    onChange={(e) => {
                      this.setState({ university: e.target.value });
                    }}
                    placeholder="University*"
                  />
                </Col>
                <Col sm="12">
                  <Label className="d-block">Country*</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={countriesOptions[0]}
                    value={country}
                    name="Country"
                    options={countriesOptions}
                    onChange={(e) => {
                      this.setState({ country: e });
                    }}
                  />
                </Col>
                <Col sm="12"></Col>
                <Row className="mx-0">
                  <Col lg="6">
                    <Label className="d-block">Date From*</Label>
                    <DatePicker
                      value={start_year}
                      options={{
                        altInput: false,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      name="year"
                      onChange={(date) => {
                        this.setState({
                          start_year: date[0],
                        });
                      }}
                    />
                  </Col>
                  <Col lg="6">
                    <Label className="d-block">Date to*</Label>
                    <DatePicker
                      value={end_year}
                      options={{
                        altInput: false,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      name="year"
                      onChange={(date) => {
                        this.setState({
                          end_year: date[0],
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            {" "}
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
          <ModalBody>
            Do you really want to delete this Qualification?
          </ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteQualification}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteQualification}>
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
// export default Qualifications;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
    countries: state.countries,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Qualifications));
