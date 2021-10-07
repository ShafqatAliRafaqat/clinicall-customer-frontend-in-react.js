import React from "react";
import {
  Alert,
  Button,
  Media,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import { apiCall, Capitalize, sendDateFormat } from "../../../../utils";
import { Avatar } from "@material-ui/core";
import query from "query-string";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addFlashMessage } from "../../../../redux/actions/flashMessages";
import FlashMessage from "../../../../components/flashMessageList";
import Spinner from "../../../../components/@vuexy/spinner/Loading-spinner";
import { InputField, TextareaField } from "../../../../components";
import { GENDERS, TITLES } from "../../../../configs/constants";
import Select from "react-select";
import DatePicker from "react-flatpickr";
import "react-toggle/style.css";
// import "../../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Toggle from "react-toggle";

class Basic extends React.Component {
  state = {
    visible: true,
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
    image: "",
    imgFile: null,
    banner: "",
    bannerFile: null,
    organizations: [{ value: "", label: "Select Organization" }],
    organization: null,
    isLoading: false,
    isDataLoading: true,
    token: this.props.userData.token,
    title: TITLES[0],
    gender: GENDERS[0],
    readOnly: true,
  };

  componentDidMount() {
    if (this.props.userData.actor === "DOCTOR")
      this.setState({ readOnly: false });
    this.getBasicInfo();
    // this.getOrganizations();
  }

  getBasicInfo = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        let url = `auth/doctors/${params.id}`;
        this.setState({
          isDataLoading: true,
        });
        const res = await apiCall("get", url, undefined, this.state.token);
        res.data.data.organization
          ? this.setState({
              ...res.data.data,
              img: res.data.data.image,
              banner: res.data.data.banner,
              title: { value: res.data.data.title, label: res.data.data.title },
              gender: {
                value: res.data.data.gender,
                label: Capitalize(res.data.data.gender),
              },
              organization: {
                value: res.data.data.organization.id,
                label: Capitalize(res.data.data.organization.name),
              },
              isDataLoading: false,
            })
          : this.setState({
              ...res.data.data,
              img: res.data.data.image,
              banner: res.data.data.banner,
              title: { value: res.data.data.title, label: res.data.data.title },
              gender: {
                value: res.data.data.gender,
                label: Capitalize(res.data.data.gender),
              },
              organization: { value: "", label: "Select Organization" },
              isDataLoading: false,
            });
      } else {
        this.props.history.push("/404");
      }
    } catch (err) {
      console.log(err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

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
  dismissAlert = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
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
    if (!this.state.practice_start_year.length) {
      this.props.addFlashMessage({
        type: "error",
        text: "Practice Start Year is Required!",
      });
      return;
    }
    this.updateDoctor();
  };

  updateDoctor = async (e) => {
    try {
      const params = query.parse(this.props.location.search);
      if (params && params.id) {
        const form = document.getElementById("form");
        const formData = new FormData(form);
        const status = this.state.is_active ? 1 : 0;
        formData.append("is_active", status);
        formData.delete("image");
        this.state.imgFile && formData.append("image", this.state.imgFile);
        formData.delete("banner");
        this.state.bannerFile &&
          formData.append("banner", this.state.bannerFile);
        formData.append(
          "practice_start_year",
          sendDateFormat(this.state.practice_start_year[0])
        );
        formData.append("about", !this.state.about ? "" : this.state.about);
        let url = `/auth/doctors/${params.id}`;
        this.setState({ isLoading: true });
        const res = await apiCall("post", url, formData, this.state.token, {
          "content-type": "multipart/form-data",
        });

        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
        this.setState({ isLoading: false });
        this.props.handleSidebar(false, true);
        this.props.getData();
      }
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

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    let {
      image,
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
      about,
      practice_start_year,
      organization,
      gender,
      is_active,
      isDataLoading,
      isLoading,
      readOnly,
    } = this.state;
    return (
      <React.Fragment>
        <Media>
          <Row className="mx-0 w-100 justify-content-between">
            {/* <Col lg="6" md="6" > */}
            <Media className="mr-1" left href="#">
              <Avatar
                style={{
                  width: "65px",
                  height: "65px",
                }}
                className=" my-0"
                src={img}
                alt=""
              />
            </Media>
            {!readOnly && (
              <Media className="mt-25" body>
                <div className="d-flex flex-sm-row flex-column justify-content-start px-0">
                  <Button.Ripple
                    tag="label"
                    className="mr-50 cursor-pointer"
                    color="primary"
                    outline
                  >
                    Upload Photo
                    <Input
                      type="file"
                      name="file"
                      id="uploadImg"
                      hidden
                      onChange={(e) => {
                        this.setState({
                          img: URL.createObjectURL(e.target.files[0]),
                          imgFile: e.target.files[0],
                        });
                      }}
                    />
                  </Button.Ripple>
                  {/* <Button.Ripple color="flat-danger">Remove</Button.Ripple> */}
                </div>
                <p className="text-muted mt-50">
                  <small>Allowed JPG, GIF or PNG. Max size of 800kB</small>
                </p>
              </Media>
            )}
            {/* </Col> */}
            <Col lg="6" md="6">
              <Media className="mt-25" body>
                <div className="d-flex flex-sm-row flex-column justify-content-start px-0">
                  {banner ? (
                    <img src={banner} alt="" width="200" height="75" />
                  ) : null}
                  {!readOnly && (
                    <Media className="mt-25" body>
                      <Button.Ripple
                        tag="label"
                        className="mr-50 cursor-pointer"
                        color="primary"
                        outline
                      >
                        Upload banner
                        <Input
                          type="file"
                          name="banner"
                          id="uploadImg"
                          hidden
                          onChange={(e) => {
                            this.setState({
                              banner: URL.createObjectURL(e.target.files[0]),
                              bannerFile: e.target.files[0],
                            });
                          }}
                        />
                      </Button.Ripple>

                      {/* <Button.Ripple color="flat-danger">Remove</Button.Ripple> */}
                      <p className="text-muted mt-50">
                        <small>
                          Allowed JPG, GIF or PNG. Max size of 800kB
                        </small>
                      </p>
                    </Media>
                  )}
                </div>
              </Media>
            </Col>
          </Row>
        </Media>
        <Form className="mt-2" id="form">
          <Row>
            {!isDataLoading ? (
              <React.Fragment>
                <Col sm="6" md="6" lg="6">
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
                    isDisabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="Name *"
                    id="full_name"
                    name="full_name"
                    value={full_name}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="PMDC *"
                    name="pmdc"
                    id="pmdc"
                    value={pmdc}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="Speciality *"
                    name="speciality"
                    id="speciality"
                    value={speciality}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="Email *"
                    name="email"
                    type="email"
                    id="email"
                    value={email}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="Phone *"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <InputField
                    label="URL *"
                    name="url"
                    id="url"
                    value={url}
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
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
                      this.setState({ practice_start_year: date });
                    }}
                    disabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
                  <Select
                    className="React"
                    classNamePrefix="select Title"
                    defaultValue={GENDERS[0]}
                    value={gender}
                    name="gender"
                    options={GENDERS}
                    onChange={(e) => {
                      this.setState({ gender: e });
                    }}
                    isDisabled={readOnly}
                  />
                </Col>
                <Col sm="6" md="6" lg="6">
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
                    isDisabled={true}
                  />
                </Col>
                <Col sm="12">
                  <TextareaField
                    label="About"
                    placeholder="About"
                    name="about"
                    value={about || ""}
                    id="about"
                    onChange={this.onChange}
                    disabled={readOnly}
                  />
                </Col>
                <Col md="6" sm="6" xs="6" className="mb-1">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      className="switch-danger"
                      name="is_active"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ is_active: 1 });
                        } else {
                          this.setState({ is_active: 0 });
                        }
                      }}
                      disabled={readOnly}
                      checked={this.state.is_active === 1 ? true : false}
                    />
                    <span className="label-text">
                      {this.state.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </label>
                </Col>
                {!readOnly && (
                  <Col
                    className="d-flex justify-content-start flex-wrap"
                    sm="12"
                  >
                    {!isLoading ? (
                      <Button color="primary" onClick={this.handleSubmit}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button color="primary" disabled>
                        <span className="ml-50">Updating...</span>
                      </Button>
                    )}
                  </Col>
                )}
              </React.Fragment>
            ) : (
              <Spinner />
            )}
          </Row>
        </Form>
        <FlashMessage />
      </React.Fragment>
    );
  }
}
// export default withRouter(Basic);
const mapStateToProps = (state) => {
  return {
    userData: state.auth.login.userData,
    flashMessages: state.flashMessages,
  };
};
export default connect(mapStateToProps, {
  addFlashMessage,
})(withRouter(Basic));
