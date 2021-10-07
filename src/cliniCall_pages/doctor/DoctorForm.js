import React, { Component } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  InputGroupAddon,
  Input,
  InputGroup,
} from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { InputField, TextareaField } from "../../components";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { apiCall } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import Select from "react-select";
import Toggle from "react-toggle";
import DatePicker from "react-flatpickr";
import { GENDERS, TITLES } from "../../configs/constants";
import { sendDateFormat } from "../../utils";

class DoctorForm extends Component {
  state = {
    id: "",
    full_name: "",
    phone: "",
    email: "",
    pmdc: "",
    url: "",
    about: "",
    practice_start_year: new Date(),
    speciality: "",
    is_active: 0,
    img: "",
    imgFile: null,
    banner: "",
    bannerFile: null,
    organizations: [{ value: "", label: "Select Organization" }],
    organization: { value: "", label: "Select Organization" },
    isLoading: false,
    token: this.props.values.userData.token,
    title: TITLES[0],
    gender: GENDERS[0],
  };

  addNew = false;

  getOrganizations = async () => {
    try {
      let url = "admin/organization";
      const res = await apiCall("get", url, undefined, this.state.token);
      const options = [...this.state.organizations];
      res.data.data.map((option) => {
        options.push({
          value: option.id,
          label: option.name,
        });
      });
      this.setState({
        organizations: options,
      });
    } catch (err) {
      if (err.response) {
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
        return;
      }
      this.props.addFlashMessage({
        type: "error",
        text: "Something went wrong!",
      });
    }
  };

  componentDidMount() {
    this.getOrganizations();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.full_name !== prevState.full_name) {
        this.setState({ full_name: this.props.data.full_name });
      }
      if (this.props.data.phone !== prevState.phone) {
        this.setState({ phone: this.props.data.phone });
      }
      if (this.props.data.email !== prevState.email) {
        this.setState({ email: this.props.data.email });
      }
      if (this.props.data.username !== prevState.username) {
        this.setState({ username: this.props.data.username });
      }
      if (this.props.data.speciality !== prevState.speciality) {
        this.setState({ speciality: this.props.data.speciality });
      }
      if (this.props.data.url !== prevState.url) {
        this.setState({ url: this.props.data.url });
      }
      if (this.props.data.pmdc !== prevState.pmdc) {
        this.setState({ pmdc: this.props.data.pmdc });
      }
      if (this.props.data.about !== prevState.about) {
        this.setState({ about: this.props.data.about });
      }
      if (this.props.data.organization !== prevState.organization) {
        const organization = this.state.organizations.filter((org) => {
          return this.props.data.organization.id === org.value;
        });
        this.setState({ organization: organization[0] });
      }
      if (this.props.data.gender !== prevState.gender) {
        const gender = GENDERS.filter(
          (gen) => this.props.data.gender === gen.value
        );
        this.setState({ gender: gender[0] });
      }
      if (this.props.data.title !== prevState.title) {
        const title = TITLES.filter(
          (titl) => this.props.data.title === titl.value
        );
        this.setState({ title: title[0] });
      }
      if (this.props.data.is_active !== prevState.is_active) {
        this.setState({ is_active: this.props.data.is_active });
      }
      if (this.props.data.image && this.props.data.image !== prevState.image) {
        this.setState({ img: this.props.data.image });
      }
      if (
        this.props.data.banner &&
        this.props.data.banner !== prevState.banner
      ) {
        this.setState({ banner: this.props.data.banner });
      }
    }

    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        full_name: "",
        phone: "",
        email: "",
        pmdc: "",
        url: "",
        about: "",
        practice_start_year: new Date(),
        speciality: "",
        is_active: 0,
        img: "",
        imgFile: null,
        organization: { value: "", label: "Select Organization" },
        gender: GENDERS[0],
        title: TITLES[0],
      });
    }

    if (this.addNew) {
      this.setState({
        id: "",
        full_name: "",
        phone: "",
        email: "",
        pmdc: "",
        url: "",
        about: "",
        practice_start_year: new Date(),
        speciality: "",
        is_active: 0,
        img: "",
        imgFile: null,
        organization: { value: "", label: "Select Organization" },
        gender: GENDERS[0],
        title: TITLES[0],
      });
    }
    this.addNew = false;
  }

  handleSubmit = () => {
    if (!this.state.title.value) {
      this.props.addFlashMessage({
        type: "error",
        text: "Title is Required!",
      });
      return;
    }
    if (!this.state.full_name.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Name is Required!",
      });
      return;
    }
    if (!this.state.pmdc.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "PMDC Number is Required!",
      });
      return;
    }
    if (!this.state.speciality.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Speciality is Required!",
      });
      return;
    }
    if (!this.state.phone.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Phone number is Required!",
      });
      return;
    }
    if (!this.state.email.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Email is Required!",
      });
      return;
    }
    if (!this.state.url.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "URL is Required!",
      });
      return;
    }
    if (!this.state.gender.value) {
      this.props.addFlashMessage({
        type: "error",
        text: "Gender is Required!",
      });
      return;
    }
    if (!this.state.practice_start_year) {
      this.props.addFlashMessage({
        type: "error",
        text: "Practice Start Year is Required!",
      });
      return;
    }
    if (this.props.data) {
      this.updateDoctor();
    } else {
      this.createDoctor();
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createDoctor = async (e) => {
    try {
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const status = this.state.is_active ? 1 : 0;
      formData.append("is_active", status);
      formData.delete("image");
      this.state.imgFile && formData.set("image", this.state.imgFile);
      formData.delete("banner");
      this.state.bannerFile && formData.append("banner", this.state.bannerFile);
      formData.append(
        "practice_start_year",
        sendDateFormat(this.state.practice_start_year)
      );
      formData.append("about", this.state.about);
      this.setState({ isLoading: true });

      let url = `/auth/doctors`;
      const res = await apiCall("post", url, formData, this.state.token, {
        "content-type": "multipart/form-data",
      });

      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
      });
      this.setState({ isLoading: false });
      this.props.updated(res.data.data, this.props.data.id);
      this.props.handleSidebar(false, true);
    } catch (err) {
      this.setState({ isLoading: false });
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
        text: "Something Went Wrong!",
      });
    }
  };

  updateDoctor = async (e) => {
    try {
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const status = this.state.is_active ? 1 : 0;
      formData.append("is_active", status);
      formData.delete("image");
      this.state.imgFile && formData.set("image", this.state.imgFile);
      formData.delete("banner");
      this.state.bannerFile && formData.append("banner", this.state.bannerFile);
      formData.append(
        "practice_start_year",
        sendDateFormat(this.state.practice_start_year)
      );
      formData.append("about", this.state.about);
      this.setState({ isLoading: true });
      let url = `/auth/doctors/${this.props.data.id}`;
      const res = await apiCall("post", url, formData, this.state.token, {
        "content-type": "multipart/form-data",
      });

      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
      });
      this.setState({ isLoading: false });
      this.props.updated(res.data.data, this.props.data.id);
      this.props.handleSidebar(false, true);
    } catch (err) {
      this.setState({ isLoading: false });
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
        text: "Something Went Wrong!",
      });
    }
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      full_name,
      phone,
      email,
      img,
      banner,
      organizations,
      speciality,
      title,
      url,
      pmdc,
      practice_start_year,
      organization,
      gender,
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
          <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
            <h4>{data !== null ? "UPDATE DOCTOR" : "ADD NEW DOCTOR"}</h4>
            <X size={20} onClick={() => handleSidebar(false, true)} />
          </div>
          <PerfectScrollbar
            className="data-list-fields px-2 mt-3"
            options={{ wheelPropagation: false }}
          >
            <Form id="form">
              {img.length ? (
                <FormGroup className="text-center">
                  <img className="img-fluid" src={img} alt="" />
                  <div className="d-flex flex-wrap justify-content-between mt-2">
                    <label
                      className="btn btn-flat-primary"
                      htmlFor="update-image"
                      color="primary"
                    >
                      Upload Image
                      <input
                        type="file"
                        id="update-image"
                        hidden
                        name="image"
                        onChange={(e) => {
                          this.setState({
                            img: URL.createObjectURL(e.target.files[0]),
                            imgFile: e.target.files[0],
                          });
                        }}
                      />
                    </label>
                    {/* <Button
                        color="flat-danger"
                        onClick={() => this.setState({ img: "" })}
                      >
                        Remove Image
                      </Button> */}
                  </div>
                </FormGroup>
              ) : (
                <label
                  className="btn btn-primary"
                  htmlFor="upload-image"
                  color="primary"
                >
                  Upload Image
                  <input
                    type="file"
                    id="upload-image"
                    name="image"
                    hidden
                    onChange={(e) => {
                      this.setState({
                        img: URL.createObjectURL(e.target.files[0]),
                        imgFile: e.target.files[0],
                      });
                    }}
                  />
                </label>
              )}
              <br className="my-3" />
              {banner.length ? (
                <FormGroup className="text-center">
                  <img className="img-fluid" src={banner} alt="" />
                  <div className="d-flex flex-wrap justify-content-between mt-2">
                    <label
                      className="btn btn-flat-primary"
                      htmlFor="update-banner"
                      color="primary"
                    >
                      Upload Banner
                      <input
                        type="file"
                        id="update-banner"
                        hidden
                        name="banner"
                        onChange={(e) => {
                          this.setState({
                            banner: URL.createObjectURL(e.target.files[0]),
                            bannerFile: e.target.files[0],
                          });
                        }}
                      />
                    </label>
                  </div>
                </FormGroup>
              ) : (
                <label
                  className="btn btn-primary my-2"
                  htmlFor="upload-banner"
                  color="primary"
                >
                  Upload Banner
                  <input
                    type="file"
                    id="upload-banner"
                    name="banner"
                    hidden
                    onChange={(e) => {
                      this.setState({
                        banner: URL.createObjectURL(e.target.files[0]),
                        bannerFile: e.target.files[0],
                      });
                    }}
                  />
                </label>
              )}
              <Label className="d-block" style={{ marginTop: "15px" }}>
                Title*
              </Label>
              <FormGroup className={"form-label-group position-relative"}>
                <Select
                  className="React"
                  classNamePrefix="select Title"
                  defaultValue={TITLES[0]}
                  value={title}
                  name="title"
                  options={TITLES}
                  onChange={(e) => {
                    this.setState({ title: e });
                  }}
                />
              </FormGroup>
              <InputField
                type="text"
                placeholder="Name *"
                value={full_name}
                name="full_name"
                onChange={this.onChange}
                label="Name *"
                required
              />
              <InputField
                type="text"
                placeholder="PMDC*"
                value={pmdc}
                name="pmdc"
                onChange={this.onChange}
                label="PMDC*"
              />
              <InputField
                type="text"
                placeholder="Speciality*"
                value={speciality}
                name="speciality"
                onChange={this.onChange}
                label="Speciality*"
              />
              <InputField
                type="text"
                placeholder="Phone*"
                value={phone}
                name="phone"
                onChange={this.onChange}
                label="Phone*"
              />
              <InputField
                type="email"
                placeholder="Email*"
                value={email}
                name="email"
                onChange={this.onChange}
                label="Email*"
              />
              <Label className="d-block">URL*</Label>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    https://www.clinicall.com/login/
                  </InputGroupAddon>
                  <Input
                    type="text"
                    placeholder="URL*"
                    value={url}
                    name="url"
                    onChange={this.onChange}
                    label="URL*"
                  />
                </InputGroup>
              </FormGroup>
              <Label className="d-block">Gender*</Label>
              <FormGroup className={"form-label-group position-relative"}>
                <Select
                  className="React"
                  classNamePrefix="select Gender"
                  defaultValue={GENDERS[0]}
                  value={gender}
                  name="gender"
                  options={GENDERS}
                  onChange={(e) => {
                    this.setState({ gender: e });
                  }}
                />
              </FormGroup>
              <Label className="d-block">Organization*</Label>
              <FormGroup className={"form-label-group position-relative"}>
                <Select
                  className="React"
                  classNamePrefix="select Organization"
                  defaultValue={organizations[0]}
                  value={organization}
                  name="organization_id"
                  options={organizations}
                  onChange={(e) => {
                    this.setState({ organization: e });
                  }}
                />
              </FormGroup>
              <Row>
                <Col md="12" sm="12" xs="12">
                  <Label className="d-block">Practice Start Year*</Label>
                  <DatePicker
                    className="form-control"
                    value={practice_start_year}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                    // name="practice_start_year"
                    onChange={(date) => {
                      console.log("practice_start_year", date);
                      this.setState({ practice_start_year: date[0] });
                    }}
                  />
                </Col>
              </Row>
              <TextareaField
                label="About"
                placeholder="About"
                name="about"
                onChange={this.onChange}
                value={this.state.about || ""}
              />
              <Row>
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
                      checked={this.state.is_active === 1 ? true : false}
                    />
                    <span className="label-text">
                      {this.state.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </label>
                </Col>
              </Row>
            </Form>
          </PerfectScrollbar>
          <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
            {!isLoading ? (
              <Button color="primary" onClick={this.handleSubmit}>
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
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(DoctorForm));
// export default DoctorForm;
