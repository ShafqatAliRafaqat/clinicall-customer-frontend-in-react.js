import React, { Component } from "react";
import { Button, FormGroup, Spinner, Label } from "reactstrap";
import { X, Plus } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { InputField } from "../../components";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { apiCall, emailValidate, phoneValidate } from "../../utils";
// import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import Select from "react-select";
import "../../assets/scss/plugins/forms/react-select/_react-select.scss";

class PatientForm extends Component {
  state = {
    id: "",
    name: "",
    phone: "",
    country: { value: "PAK", label: "Pakistan" },
    city: { value: "", label: "Select City" },
    city_id: "",
    countries: this.props.countries.countries,
    countriesOptions: this.props.countries.countriesOptions,
    cities: this.props.cities.cities,
    citiesOptions: this.props.cities.citiesOptions,
    doctor_max_discount: "",
    isLoading: false,
    token: this.props.values.userData.token,
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (this.props.data.phone !== prevState.phone) {
        this.setState({ phone: this.props.data.phone });
      }
      if (this.props.data.email !== prevState.email) {
        this.setState({ email: this.props.data.email });
      }
      if (this.props.data.country_code !== prevState.country_code) {
        this.setState({
          country_code: this.props.data.country_code.code,
          country: {
            value: this.props.data.country_code.name,
            label: this.props.data.country_code.name,
          },
        });
      }
      if (this.props.data.city_id !== prevState.city_id) {
        this.setState({
          city_id: this.props.data.city_id.id,
          city: {
            value: this.props.data.city_id.name,
            label: this.props.data.city_id.name,
          },
        });
      }
      if (
        this.props.data.doctor_max_discount !== prevState.doctor_max_discount
      ) {
        this.setState({
          doctor_max_discount: this.props.data.doctor_max_discount,
        });
      }
    }

    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        name: "",
        phone: "",
        email: "",
        country_code: "",
        city_id: null,
        city: "",
        country: "",
        doctor_max_discount: "",
      });
    }

    if (this.addNew) {
      this.setState({
        id: "",
        name: "",
        phone: "",
        email: "",
        country_code: "",
        city_id: null,
        city: "",
        country: "",
        doctor_max_discount: "",
      });
    }
    this.addNew = false;
  }

  handleSubmit = () => {
    if (!this.state.name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is required!",
      });
      return;
    }

    if (!phoneValidate(this.state.phone)) {
      this.props.addFlashMessage({
        type: "error",
        text: "Phone Number is invalid or exceeds the limit of 11 digits!",
      });
      return;
    }
    if (!emailValidate(this.state.email)) {
      this.props.addFlashMessage({
        type: "error",
        text: "Email is invalid!",
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
    if (this.props.data) {
      this.updateOrganiztion();
    } else {
      this.createOrganiztion();
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createOrganiztion = async (e) => {
    try {
      this.setState({ isLoading: true });

      const dataUpload = {
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        doctor_max_discount: this.state.doctor_max_discount,
        country_code: this.state.country.value,
        city_id: this.state.city.value,
      };

      let url = `/admin/organization`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: "Organization Created Successfully!",
      });
      this.setState({ isLoading: false });
      this.props.handleSidebar();
      this.props.created(res.data.data);
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        this.setState({ isLoading: false });
        return;
      }
      console.log(err);
      this.setState({ isLoading: false });

      this.props.addFlashMessage({
        type: "error",
        text: "Something Went Wrong!",
      });
    }
  };

  updateOrganiztion = async (e) => {
    try {
      this.setState({ isLoading: true });
      const country = this.state.countries.filter(
        (con) => con.name === this.state.country.value
      );
      const city = this.state.cities.filter(
        (cit) => cit.name === this.state.city.value
      );
      const dataUpload = {
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        doctor_max_discount: this.state.doctor_max_discount,
        country_code: country[0].code,
        city_id: city[0].id,
      };

      let url = `/admin/organization/${this.props.data.id}`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: "Organization Updated Successfully!",
      });
      this.setState({ isLoading: false });
      this.props.updated(res.data.data, this.props.data.id);
      this.props.handleSidebar(false, true);
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        this.setState({ isLoading: false });
        return;
      }
      this.props.addFlashMessage({
        type: "error",
        text: "Something Went Wrong!",
      });
    }
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      name,
      phone,
      email,
      doctor_max_discount,
      country,
      countriesOptions,
      city,
      citiesOptions,
      isLoading,
    } = this.state;
    return (
      <React.Fragment>
        <FlashMessage />
        <div
          className={classnames("data-list-sidebar", {
            show: show,
          })}
        >
          <div className="data-list-sidebar-header pt-1 px-2 d-flex justify-content-between primary-bg sidebar-hdr-clr">
            <Plus size={20} />
            <h4 className="sidebar-hdr-clr">
              {data !== null ? "UPDATE ORGANIZATION" : "ADD NEW ORGANIZATION"}
            </h4>
            <X size={20} onClick={() => handleSidebar(false, true)} />
          </div>
          <PerfectScrollbar
            className="data-list-fields px-2 mt-3"
            options={{ wheelPropagation: false }}
          >
            <InputField
              style={{ marginTop: "15px" }}
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={this.onChange}
              label="Name"
              required
            />
            <InputField
              type="number"
              placeholder="Phone"
              value={phone}
              name="phone"
              onChange={this.onChange}
              label="Phone"
              required
            />
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={this.onChange}
              label="Email"
              required
            />
            <Label className="d-block">Country*</Label>
            <FormGroup className={"form-label-group position-relative"}>
              <Select
                className="React"
                classNamePrefix="select"
                defaultValue={{ value: "Pakistan", label: "Pakistan" }}
                value={country}
                name="Countries"
                options={countriesOptions}
                onChange={(e) => {
                  this.setState({ country: e });
                }}
              />
            </FormGroup>
            <Label className="d-block">City*</Label>
            <FormGroup className={"form-label-group position-relative"}>
              <Select
                className="React"
                classNamePrefix="select"
                defaultValue={citiesOptions[0]}
                value={city}
                name="City"
                options={citiesOptions}
                onChange={(e) => {
                  this.setState({ city: e });
                }}
              />
            </FormGroup>
            <InputField
              type="number"
              placeholder="Doctor Discount"
              value={doctor_max_discount}
              name="doctor_max_discount"
              onChange={this.onChange}
              label="Doctor Discount"
              required
            />
          </PerfectScrollbar>
          <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
            {!isLoading ? (
              <Button
                color="primary"
                onClick={() => this.handleSubmit(this.state)}
              >
                {data !== null ? "Update" : "Submit"}
              </Button>
            ) : (
              <Button color="primary" disabled>
                <Spinner color="white" size="sm" />
                <span className="ml-50">
                  {data !== null ? "Updating..." : "Creating..."}
                </span>
              </Button>
            )}
            <Button
              className="ml-1"
              color="danger"
              outline
              disabled={isLoading}
              onClick={() => handleSidebar(false, true)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
    flashMessages: state.flashMessages,
    countries: state.countries,
    cities: state.cities,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(PatientForm));
// export default PatientForm;
