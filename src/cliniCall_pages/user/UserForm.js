import React, { Component } from "react";
import { Button, Form, FormGroup, Label } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { InputField } from "../../components";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { apiCall } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Select from "react-select";

class UserForm extends Component {
  state = {
    id: "",
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    img: "",
    imgFile: null,
    roles: [],
    role: { value: "", label: "Select Role" },
    organizations: [],
    organization: { value: "", label: "Select Organization" },
    isLoading: false,
    token: this.props.values.userData.token,
  };

  addNew = false;

  getRoles = async () => {
    try {
      let url = "admin/selected_roles";
      const res = await apiCall("get", url, undefined, this.state.token);
      const options = [{ value: "", label: "Select Role" }];
      res.data.data.map((option) => {
        options.push({
          value: option.id,
          label: option.name,
        });
      });
      this.setState({
        roles: options,
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

  getOrganizations = async () => {
    try {
      let url = "admin/organization";
      const res = await apiCall("get", url, undefined, this.state.token);
      const options = [{ value: "", label: "Select Organization" }];
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
    this.getRoles();
  }

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
      if (this.props.data.username !== prevState.username) {
        this.setState({ username: this.props.data.username });
      }
      if (this.props.data.roles !== prevState.roles) {
        const role = this.state.roles.filter(
          (role) => this.props.data.roles[0].id === role.value
        );
        this.setState({ role: role[0] });
      }
      if (this.props.data.image && this.props.data.image !== prevState.image) {
        this.setState({ img: this.props.data.image });
      }
      if (this.props.data.organization !== prevState.organization) {
        const organization = this.state.organizations.filter(
          (org) => this.props.data.organization.id === org.value
        );
        this.setState({ organization: organization[0] });
      }
    }

    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        name: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        img: "",
        imgFile: null,
      });
    }

    if (this.addNew) {
      this.setState({
        id: "",
        name: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        img: "",
        imgFile: null,
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
    if (!this.state.phone.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Phone number is required!",
      });
      return;
    }
    if (!this.state.email.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Email is required!",
      });
      return;
    }

    if (
      this.state.password_confirmation.trim() !== this.state.password.trim()
    ) {
      this.props.addFlashMessage({
        type: "error",
        text: "Password and confirm password should be same!",
      });
      return;
    }
    if (this.props.data) {
      this.updateUser();
    } else {
      this.createUser();
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createUser = async (e) => {
    try {
      if (!this.state.password.trim()) {
        this.props.addFlashMessage({
          type: "error",
          text: "Password is required!",
        });
        return;
      }
      if (!this.state.password_confirmation.trim()) {
        this.props.addFlashMessage({
          type: "error",
          text: "Password confirmation is required!",
        });
        return;
      }
      this.setState({ isLoading: true });
      const form = document.getElementById("form");
      const formData = new FormData(form);
      formData.delete("image");
      this.state.imgFile && formData.append("image", this.state.imgFile);
      let url = `/admin/users`;
      const res = await apiCall("post", url, formData, this.state.token, {
        "content-type": "multipart/form-data",
      });

      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
      });
      this.setState({ isLoading: false });
      this.props.handleSidebar();
      this.props.getData();
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
      this.props.addFlashMessage({
        type: "error",
        text: "Something Went Wrong!",
      });
    }
  };

  updateUser = async (e) => {
    try {
      const form = document.getElementById("form");
      const formData = new FormData(form);
      formData.delete("image");
      this.state.imgFile && formData.append("image", this.state.imgFile);
      let url = `/admin/users/${this.props.data.id}`;
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
      username,
      password,
      password_confirmation,
      img,
      organizations,
      roles,
      role,
      organization,
    } = this.state;
    return (
      <React.Fragment>
        <FlashMessage />
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div
            className={classnames("data-list-sidebar", {
              show: show,
            })}
          >
            <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
              <h4>{data !== null ? "UPDATE USER" : "ADD NEW USER"}</h4>
              <X size={20} onClick={() => handleSidebar(false, true)} />
            </div>
            <PerfectScrollbar
              className="data-list-fields px-2 mt-3"
              options={{ wheelPropagation: false }}
            >
              <Form id="form">
                {img.length ? (
                  <FormGroup className="text-center">
                    <img className="img-fluid" src={img} alt={name} />
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
                  <FormGroup className="text-center">
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
                  </FormGroup>
                )}
                <InputField
                  style={{ marginTop: "15px" }}
                  type="text"
                  placeholder="Name *"
                  value={name}
                  name="name"
                  onChange={this.onChange}
                  label="Name *"
                  required
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
                  type="text"
                  placeholder="Email*"
                  value={email}
                  name="email"
                  onChange={this.onChange}
                  label="Email*"
                />
                <InputField
                  type="password"
                  placeholder="Password*"
                  value={password}
                  name="password"
                  onChange={this.onChange}
                  label="Password*"
                />
                <InputField
                  type="password"
                  placeholder="Confirm Password*"
                  value={password_confirmation}
                  name="password_confirmation"
                  onChange={this.onChange}
                  label="Confirm Password*"
                />
                <Label className="d-block">Role*</Label>
                <FormGroup className={"form-label-group position-relative"}>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={roles[0]}
                    value={role}
                    name="role_id"
                    options={roles}
                    onChange={(e) => {
                      this.setState({ role: e });
                    }}
                  />
                </FormGroup>
                <Label className="d-block">Organization*</Label>
                <FormGroup className={"form-label-group position-relative"}>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    defaultValue={organizations[0]}
                    value={organization}
                    name="organization_id"
                    options={organizations}
                    onChange={(e) => {
                      this.setState({ organization: e });
                    }}
                  />
                </FormGroup>
              </Form>
            </PerfectScrollbar>
            <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
              <Button color="primary" onClick={this.handleSubmit}>
                {data !== null ? "Update" : "Submit"}
              </Button>
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
        )}
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
})(withRouter(UserForm));
// export default UserForm;
