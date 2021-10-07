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
import { MEDICINES_TYPE } from "../../../configs/constants";
import Toggle from "react-toggle";
import Chip from "../../../components/@vuexy/chips/ChipComponent";

class Medicines extends React.Component {
  state = {
    id: null,
    medicine_id: null,
    medicine_name: "",
    description: "",
    is_active: 0,
    medicines: [],
    medicine_option_list: [],
    medicineOptions: [{ value: "", label: "Select Medicine" }],
    modal: false,
    deleteModal: false,
    delID: null,
    token: this.props.userData.token,
    isDataLoading: false,
    isLoading: false,
  };

  getMedicines = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `admin/medicine`;
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
          medicine_option_list: res.data.data,
          medicineOptions: options,
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

  getDoctorMedicines = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_medicines/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);

        this.setState({
          medicines: res.data.data,
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
    if (!this.state.medicine_name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is required!",
      });
      return;
    }
    if (!this.state.medicineType.value.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Medicine type is required!",
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
      this.createMedicine();
    } else {
      this.updateMedicine();
    }
  };

  createMedicine = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          medicine_id: this.state.medicine_id,
          medicine_name: this.state.medicine_name,
          description: this.state.description || "",
          type: this.state.medicineType.value,
          is_active: this.state.is_active,
        };
        let url = `auth/doctor_medicine`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const medicines = [res.data.data, ...this.state.medicines];
        this.setState({ medicines: medicines });

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

  updateMedicine = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let data = {
          doctor_id: params.id,
          medicine_id: this.state.medicine_id,
          medicine_name: this.state.medicine_name,
          description: this.state.description || "",
          type: this.state.medicineType.value,
          is_active: this.state.is_active,
        };

        let url = `auth/doctor_medicine/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        const updatedArray = [...this.state.medicines];
        const index = updatedArray.findIndex(
          (medicine) => this.state.id === medicine.id
        );
        updatedArray[index] = res.data.data;
        this.setState({ medicines: updatedArray });

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

  deleteMedicine = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_medicine`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.setState({ isLoading: false });

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.medicines];
        const index = updatedArray.findIndex(
          (medicine) => this.state.delID === medicine.id
        );
        updatedArray.splice(index, 1);
        this.setState({ medicines: updatedArray });

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
    this.getDoctorMedicines();
    this.getMedicines();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        medicine_name: "",
        medicineType: MEDICINES_TYPE[0],
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
      medicine_name,
      description,
      medicineType,
      medicines,
      medicineOptions,
      is_active,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Medicines</h2>
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
          {medicines.length ? (
            medicines.map((medicine) => (
              <React.Fragment key={medicine.id}>
                <Col lg="6" md="6" sm="12">
                  <Card
                    className="text-center"
                    style={{ backgroundColor: "#f3f5fc" }}
                  >
                    <CardBody>
                      <h5>{medicine.medicine_name}</h5>
                      <h6 className=" pb-1">{Capitalize(medicine.type)}</h6>
                      <Chip
                        className="mx-2"
                        color={medicine.is_active === 1 ? "success" : "danger"}
                        text={medicine.is_active === 1 ? "Active" : "Inactive"}
                      />
                      <h6 className="pb-1" style={{ minHeight: "90px" }}>
                        {medicine.description}
                      </h6>

                      <div className="card-btns d-flex justify-content-center mt-2">
                        <Button.Ripple
                          className="mx-1"
                          color="primary"
                          onClick={() => {
                            this.toggleModal();

                            const medicineType = MEDICINES_TYPE.filter(
                              (type) => medicine.type === type.value
                            );
                            this.setState({
                              id: medicine.id,
                              medicine_name: medicine.medicine_name,
                              medicineType: medicineType[0],
                              description: medicine.description,
                              is_active: medicine.is_active,
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
                            this.setState({ delID: medicine.id });
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
                <h5>No Medicine Added Yet!</h5>
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
            {!this.state.id ? "Add Medicine" : "Update Medicine"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <Label className="d-block">Medicine Name*</Label>
                  <Autocomplete
                    suggestions={medicineOptions}
                    className="form-control"
                    filterKey="label"
                    suggestionLimit={4}
                    value={medicine_name}
                    onChange={(e) => {
                      console.log(e.target);
                      this.setState({ medicine_name: e.target.value });
                    }}
                    onSuggestionClick={(e, v) => {
                      const selectedMedicine = this.state.medicine_option_list.filter(
                        (medicine) => medicine.id == v.value
                      );
                      const medicineType = MEDICINES_TYPE.filter(
                        (type) => selectedMedicine[0].type === type.value
                      );

                      this.setState({
                        medicine_id: v.value,
                        medicine_name: selectedMedicine[0].name,
                        medicineType: medicineType[0],
                        description: selectedMedicine[0].description,
                        is_active: selectedMedicine[0].is_active,
                      });
                    }}
                    placeholder="Medicine Name*"
                  />
                </Col>
                <Col sm="12">
                  <Label className="d-block">Medicine Type*</Label>
                  <Select
                    value={medicineType}
                    name="medicineType"
                    placeholder="Medicine Type"
                    label="Medicine type"
                    options={MEDICINES_TYPE || []}
                    onChange={(e) => {
                      this.setState({ medicineType: e });
                    }}
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
          <ModalBody>Do you really want to delete this Medicine?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteMedicine}>
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
// export default Medicines;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Medicines));
