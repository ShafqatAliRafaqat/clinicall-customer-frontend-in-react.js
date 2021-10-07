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
  FormGroup,
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
import Select from "react-select";

class Certificates extends React.Component {
  state = {
    id: null,
    title: "",
    completed_year: new Date(),
    institute: "",
    country: { value: "PAK", label: "Pakistan" },
    countries_options: this.props.countries.countriesOptions,
    Certificates: [],
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getCertificates = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_certifications/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          Certificates: res.data.data,
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
    if (!this.state.institute.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Institute is required!",
      });
      return;
    }
    if (!this.state.completed_year) {
      this.props.addFlashMessage({
        type: "error",
        text: "Completed Year is required!",
      });
      return;
    }
    if (this.state.completed_year > new Date()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Completed year must be from the past!",
      });
      return;
    }

    if (!this.state.id) {
      this.createCertificate();
    } else {
      this.updateCertificate();
    }
  };

  createCertificate = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          title: this.state.title,
          institute: this.state.institute,
          country_code: this.state.country.value,
          completed_year: sendDateFormat(this.state.completed_year),
        };
        let url = `auth/doctor_certification`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const Certificates = [res.data.data, ...this.state.Certificates];
        this.setState({ Certificates: Certificates, isLoading: false });

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

  updateCertificate = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          title: this.state.title,
          institute: this.state.institute,
          country_code: this.state.country.value,
          completed_year: sendDateFormat(this.state.completed_year),
        };
        let url = `auth/doctor_certification/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const updatedArray = [...this.state.Certificates];
        const index = updatedArray.findIndex(
          (Certificate) => this.state.id === Certificate.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ Certificates: updatedArray, isLoading: false });
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

  deleteCertificate = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_certification`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.Certificates];
        const index = updatedArray.findIndex(
          (Certificate) => this.state.delID === Certificate.id
        );
        updatedArray.splice(index, 1);
        this.setState({ Certificates: updatedArray, isLoading: false });
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
    console.log(this.props);
    this.getCertificates();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        title: "",
        completed_year: new Date(),
        institute: "",
        country: { value: "", label: "Select Country" },
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
      completed_year,
      Certificates,
      country,
      countries_options,
      institute,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Certificates</h2>
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
          {Certificates.length ? (
            Certificates.map((certificate) => {
              const countryValue = this.state.countries_options.filter(
                (coun) => coun.value === certificate.country_code.code
              );
              return (
                <React.Fragment key={certificate.id}>
                  <Col lg="6" md="6" sm="12">
                    <Card
                      className="text-center"
                      style={{ backgroundColor: "#f3f5fc" }}
                    >
                      <CardBody>
                        <h5>{certificate.title}</h5>
                        <h6 className=" pb-1">{certificate.institute}</h6>
                        <h6 className=" pb-1">{certificate.completed_year}</h6>
                        <h6 className=" pb-1">
                          {countryValue.length && countryValue[0].label}
                        </h6>
                        <div className="card-btns d-flex justify-content-center mt-2">
                          <Button.Ripple
                            className="mx-1"
                            color="primary"
                            onClick={() => {
                              this.toggleModal();
                              this.setState({
                                id: certificate.id,
                                title: certificate.title,
                                institute: certificate.institute,
                                country: countryValue[0],
                                completed_year: [certificate.completed_year],
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
                              this.setState({ delID: certificate.id });
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
                <h5>No Certificate Added Yet!</h5>
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
            {!this.state.id ? "Add Certificate" : "Update Certificate"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Title*"
                    title="title"
                    value={title}
                    onChange={(e) => {
                      this.setState({ title: e.target.value });
                    }}
                    id="title"
                    placeholder="Title*"
                  />
                </Col>
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Institute*"
                    title="institute"
                    id="institute"
                    value={institute}
                    onChange={(e) => {
                      this.setState({ institute: e.target.value });
                    }}
                    placeholder="Institute*"
                  />
                </Col>
                <Col sm="12">
                  <Label className="d-block">Country*</Label>
                  <FormGroup className={"form-label-group position-relative"}>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      value={country}
                      name="Countries"
                      options={countries_options}
                      onChange={(e) => {
                        this.setState({ country: e });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <Label className="d-block">Completed Year*</Label>
                  <DatePicker
                    value={completed_year}
                    options={{
                      altInput: false,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                    title="completed_year"
                    onChange={(date) => {
                      this.setState({
                        completed_year: date[0],
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
          <ModalBody>Do you really want to delete this Certificate?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteCertificate}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteCertificate}>
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
// export default Certificates;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
    countries: state.countries,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Certificates));
