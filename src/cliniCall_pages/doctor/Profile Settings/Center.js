import React from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
import { Plus } from "react-feather";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { InputField, LocationSearchInput } from "../../../components";
import { apiCall } from "../../../utils";
import { Geocode } from "../../../configs/constants";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addFlashMessage } from "../../../redux/actions/flashMessages";
import FlashMessage from "../../../components/flashMessageList";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import query from "query-string";
import { Map, TileLayer, Marker } from "react-leaflet";
import Toggle from "react-toggle";
import Select from "react-select";
import Chip from "../../../components/@vuexy/chips/ChipComponent";

class Center extends React.Component {
  state = {
    id: null,
    name: "",
    address: "",
    mapSelected: false,
    country: { value: "PAK", label: "Pakistan" },
    city: { value: "", label: "Select City" },
    is_active: 0,
    is_primary: 0,
    countries_options: this.props.countries.countriesOptions,
    cities_options: this.props.cities.citiesOptions,
    centers: [],
    modal: false,
    isLoading: false,
    isDataLoading: false,
    deleteModal: false,
    mapModal: false,
    delID: null,
    token: this.props.userData.token,
    map: {
      hasLocation: true,
      center: {
        lat: 31.4796509,
        lng: 74.28036929999999,
      },
      marker: {
        lat: 31.4796509,
        lng: 74.28036929999999,
      },
      zoom: 13,
      draggable: true,
    },
  };

  refmarker = React.createRef();
  mapRef = React.createRef();

  toggleDraggable = () => {
    this.setState({
      map: { ...this.state.map, draggable: !this.state.draggable },
    });
  };

  handleClick = () => {
    const map = this.mapRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
  };

  updatePosition = () => {
    const marker = this.refmarker.current;
    console.log(marker.leafletElement);
    if (marker != null) {
      this.setState({
        map: {
          ...this.state.map,
          marker: marker.leafletElement.getLatLng(),
        },
      });
    }
  };

  handleLocationFound = (e) => {
    this.setState({
      map: {
        ...this.state.map,
        hasLocation: true,
        marker: e.latlng,
      },
    });
  };

  getCenters = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctor_centers/${params.id}`;
        this.setState({ isDataLoading: true });
        const res = await apiCall("get", url, undefined, this.state.token);
        this.setState({ isDataLoading: false });

        this.setState({
          centers: res.data.data,
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
    if (!this.state.name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is required!",
      });
      return;
    }
    if (!this.state.address.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Address is required!",
      });
      return;
    }
    if (!this.state.mapSelected) {
      this.props.addFlashMessage({
        type: "error",
        text: "Please select location from map!",
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
    if (!this.state.city.value) {
      this.props.addFlashMessage({
        type: "error",
        text: "City is required!",
      });
      return;
    }

    if (!this.state.id) {
      this.createCenter();
    } else {
      this.updateCenter();
    }
  };

  createCenter = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          address: this.state.address,
          country_code: this.state.country.value,
          city_id: this.state.city.value,
          ...this.state.map.marker,
          is_active: this.state.is_active,
          is_primary: this.state.is_primary,
        };
        let url = `auth/doctor_center`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        const centers = [res.data.data, ...this.state.centers];
        this.setState({
          centers: centers,
          mapSelected: false,
          isLoading: false,
        });

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

  updateCenter = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = {
          doctor_id: params.id,
          name: this.state.name,
          address: this.state.address,
          country_code: this.state.country.value,
          city_id: this.state.city.value,
          ...this.state.map.marker,
          is_active: this.state.is_active,
          is_primary: this.state.is_primary,
        };
        let url = `auth/doctor_center/${this.state.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);

        const updatedArray = [...this.state.centers];
        const index = updatedArray.findIndex(
          (Center) => this.state.id === Center.id
        );
        updatedArray[index] = res.data.data;
        this.setState({
          centers: updatedArray,
          mapSelected: false,
          isLoading: false,
        });

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

  deleteCenter = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const data = { ids: [this.state.delID] };
        let url = `auth/delete_doctor_center`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, data, this.state.token);
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        const updatedArray = [...this.state.centers];
        const index = updatedArray.findIndex(
          (Center) => this.state.delID === Center.id
        );
        updatedArray.splice(index, 1);
        this.setState({ centers: updatedArray, isLoading: false });
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
    this.getCenters();
  }

  toggleModal = () => {
    if (this.state.modal)
      this.setState((prevState) => ({
        id: null,
        name: "",
        address: "",
        mapSelected: false,
        country: { value: "PAK", label: "Pakistan" },
        city: { value: "", label: "Select City" },
        is_active: 0,
        is_primary: 0,
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

  mapModalToggle = () => {
    if (this.state.mapModal)
      Geocode.fromLatLng(
        this.state.map.marker.lat,
        this.state.map.marker.lng
      ).then(
        (response) => {
          console.log(response);
          const address = response.results[0].formatted_address;
          this.setState({ address: address });
        },
        (error) => {
          console.error(error);
        }
      );
    this.setState((prevState) => ({
      mapSelected: true,
      mapModal: !prevState.mapModal,
    }));
  };

  handleMapSearch = (address, latLng) => {
    this.setState({
      address: address,
      map: { ...this.state.map, marker: { ...latLng } },
    });
  };

  render() {
    const {
      name,
      centers,
      address,
      country,
      city,
      countries_options,
      cities_options,
      isDataLoading,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between">
          <h2>Centers</h2>
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
          {centers.length ? (
            centers.map((center) => {
              const countryValue = this.state.countries_options.filter(
                (coun) => coun.value === center.country_code.code
              );
              const cityValue = this.state.cities_options.filter(
                (city) => city.value === center.city_id.id
              );
              return (
                <React.Fragment key={center.id}>
                  <Col lg="6" md="6" sm="12">
                    <Card
                      className="text-center"
                      style={{ backgroundColor: "#f3f5fc" }}
                    >
                      <CardBody>
                        <h5>{center.name}</h5>
                        <h6 className=" pb-1">{center.address}</h6>
                        <Chip
                          className="mx-2"
                          color={center.is_active === 1 ? "success" : "danger"}
                          text={center.is_active === 1 ? "Active" : "Inactive"}
                        />
                        <Chip
                          className="mx-2"
                          color={center.is_primary === 1 ? "success" : "danger"}
                          text={
                            center.is_primary === 1 ? "Primary" : "Secondary"
                          }
                        />
                        <br />
                        <a
                          href={`https://www.google.com/maps?q=${center.lat},${center.lng}`}
                          target="_blank"
                        >
                          View on map
                        </a>
                        <div className="card-btns d-flex justify-content-center mt-2">
                          <Button.Ripple
                            className="mx-1"
                            color="primary"
                            onClick={() => {
                              this.toggleModal();
                              this.setState({
                                id: center.id,
                                name: center.name,
                                address: center.address,
                                country: countryValue[0],
                                city: cityValue[0],
                                map: {
                                  ...this.state.map,
                                  marker: { lat: center.lat, lng: center.lng },
                                  center: { lat: center.lat, lng: center.lng },
                                },
                                is_active: center.is_active,
                                is_primary: center.is_primary,
                                mapSelected: true,
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
                              this.setState({ delID: center.id });
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
                <h5>No Center Added Yet!</h5>
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
            {!this.state.id ? "Add Center" : "Update Center"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="mt-2">
                <Col sm="12">
                  <InputField
                    type="text"
                    label="Name*"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      this.setState({ name: e.target.value });
                    }}
                    id="name"
                    placeholder="Name*"
                  />
                </Col>
                <Col sm="9" lg="9" md="9">
                  <InputField
                    type="text"
                    label="Address*"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => {
                      this.setState({ address: e.target.value });
                    }}
                    placeholder="Address*"
                  />
                </Col>
                <Col sm="3" lg="3" md="3" className="pl-0">
                  <Button.Ripple
                    className="d-flex"
                    color="primary"
                    onClick={this.mapModalToggle}
                  >
                    Location*
                  </Button.Ripple>
                </Col>
                <Col sm="6">
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
                <Col sm="6">
                  <Label className="d-block">City*</Label>
                  <FormGroup className={"form-label-group position-relative"}>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      value={city}
                      name="Cities"
                      options={cities_options}
                      onChange={(e) => {
                        this.setState({ city: e });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md="6" sm="6" xs="6">
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
                      checked={this.state.is_active === 1}
                    />
                    <span className="label-text">
                      {this.state.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </label>
                </Col>
                <Col md="6" sm="6" xs="6">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      className="switch-danger"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ is_primary: 1 });
                        } else {
                          this.setState({ is_primary: 0 });
                        }
                      }}
                      checked={this.state.is_primary === 1}
                    />
                    <span className="label-text">
                      {this.state.is_primary === 1 ? "Primary" : "Secondary"}
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
          <ModalBody>Do you really want to delete this Center?</ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button color="danger" onClick={this.deleteCenter}>
                Confirm
              </Button>
            ) : (
              <Button color="danger" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">Deleting...</span>
              </Button>
            )}
            {/* <Button color="danger" onClick={this.deleteCenter}>
              Confirm
            </Button> */}
            <Button color="secondary" onClick={this.deleteModalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.mapModal} className="modal-dialog-centered">
          <ModalHeader className="bg-primary">Select Location</ModalHeader>
          <ModalBody>
            <div className=" row mx-0">
              <LocationSearchInput handleSearch={this.handleMapSearch} />
            </div>
            <Map
              center={this.state.map.marker}
              zoom={this.state.map.zoom}
              style={{ height: "50vh" }}
              onLocationfound={this.handleLocationFound}
              onClick={this.handleClick}
              ref={this.mapRef}
              length={4}
            >
              <TileLayer
                // attribution='&ampcopy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                draggable={this.state.map.draggable}
                onDragend={this.updatePosition}
                position={this.state.map.marker}
                ref={this.refmarker}
              ></Marker>
            </Map>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.mapModalToggle}>
              Done
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
// export default centers;

const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
    countries: state.countries,
    cities: state.cities,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Center));
