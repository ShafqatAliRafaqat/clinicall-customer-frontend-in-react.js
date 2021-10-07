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
import { TextareaField, Autocomplete, Select } from "../../../components";
import { apiCall, sendDateFormat, Capitalize } from "../../../utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";
import query from "query-string";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import Toggle from "react-toggle";
import Chip from "../../../components/@vuexy/chips/ChipComponent";

class Treatments extends React.Component {
  state = {
    id: null,
    treatment_id: null,
    treatment_name: "",
    description: "",
    is_active: 0,
    treatments: [],
    treatment_option_list: [],
    treatmentOptions: [{ value: "", label: "Select Treatment" }],
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getTreatments = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `admin/treatment`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        const options = [];
        res.data.data.map((option) => {
          options.push({
            value: option.id,
            label: option.name,
          });
        });
        this.setState({
          treatment_option_list: res.data.data,
          treatmentOptions: options,
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

  getDoctorTreatments = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_treatments/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);

        this.setState({
          treatments: res.data.data,
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
    if (!this.state.treatment_name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is required!",
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

    if (!this.state.id) {
      this.createTreatment();
    } else {
      this.updateTreatment();
    }
  };

  createTreatment = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          treatment_id: this.state.treatment_id,
          treatment_name: this.state.treatment_name,
          description: this.state.description || "",
          is_active: this.state.is_active,
        };
        let url = `auth/doctor_treatment`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const treatments = [res.data.data, ...this.state.treatments];
        this.setState({ treatments: treatments });

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

  updateTreatment = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          treatment_id: this.state.treatment_id,
          treatment_name: this.state.treatment_name,
          description: this.state.description || "",
          is_active: this.state.is_active,
        };

        let url = `auth/doctor_treatment/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const updatedArray = [...this.state.treatments];
        const index = updatedArray.findIndex(
          (treatment) => this.state.id === treatment.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ treatments: updatedArray });

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

  deleteTreatment = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_treatment`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.treatments];
        const index = updatedArray.findIndex(
          (treatment) => this.state.delID === treatment.id
        );
        updatedArray.splice(index, 1);
        this.setState({ treatments: updatedArray });

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
    this.getDoctorTreatments();
    this.getTreatments();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        treatment_name: "",
        description: "",
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

  render() {
    const {
      treatment_name,
      description,
      treatments,
      treatmentOptions,
      is_active,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Treatments</h2>
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
          {treatments.length ? (
            treatments.map((treatment) => (
              <React.Fragment key={treatment.id}>
                <Col lg="6" md="6" sm="12">
                  <Card
                    className="text-center"
                    style={{ backgroundColor: "#f3f5fc" }}
                  >
                    <CardBody>
                      <h5>{treatment.treatment_name}</h5>
                      <Chip
                        className="mx-2"
                        color={treatment.is_active === 1 ? "success" : "danger"}
                        text={treatment.is_active === 1 ? "Active" : "Inactive"}
                      />
                      <h6 className="pb-1" style={{ minHeight: "90px" }}>
                        {treatment.description}
                      </h6>

                      <div className="card-btns d-flex justify-content-center mt-2">
                        <Button.Ripple
                          className="mx-1"
                          color="primary"
                          onClick={() => {
                            this.toggleModal();

                            this.setState({
                              id: treatment.id,
                              treatment_name: treatment.treatment_name,
                              description: treatment.description,
                              is_active: treatment.is_active,
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
                            this.setState({ delID: treatment.id });
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
                <h5>No Treatment Added Yet!</h5>
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
            {!this.state.id ? "Add Treatment" : "Update Treatment"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <Label className="d-block">Treatment Name*</Label>
                  <Autocomplete
                    suggestions={treatmentOptions}
                    className="form-control"
                    filterKey="label"
                    suggestionLimit={4}
                    value={treatment_name}
                    onChange={(e) => {
                      console.log(e.target);
                      this.setState({ treatment_name: e.target.value });
                    }}
                    onSuggestionClick={(e, v) => {
                      const selectedTreatment = this.state.treatment_option_list.filter(
                        (treatment) => treatment.id == v.value
                      );

                      this.setState({
                        treatment_id: v.value,
                        treatment_name: selectedTreatment[0].name,
                        description: selectedTreatment[0].description,
                        is_active: selectedTreatment[0].is_active,
                      });
                    }}
                    placeholder="Treatment Name*"
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
                <Col sm="12">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      className="switch-danger"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ is_active: 1 });
                        } else {
                          this.setState({ is_active: 0 });
                        }
                      }}
                      checked={is_active === 1}
                    />
                    <span className="label-text">
                      {is_active === 1 ? "Active" : "Inactive"}
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
          <ModalBody>Do you really want to delete this Treatment?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteTreatment}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            <Button color="secondary" onClick={this.deleteModalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
// export default Treatments;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Treatments));
