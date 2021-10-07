import React, { Component } from "react";
import { Button, Row, Col, FormGroup, Label } from "reactstrap";
import { X, Plus } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { InputField, Icon } from "../../components";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { apiCall } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Select from "react-select";

// import * as Icon from "@fortawesome/free-solid-svg-icons";

class PermissionForm extends Component {
  state = {
    id: "",
    title: "",
    permission_code: "",
    description: "",
    url: "",
    type: "allow",
    is_active: 1,
    isLoading: false,
    token: this.props.values.userData.token,
    parent_id: "",
    parent: { value: "", label: "Select Parent Permission" },
    parent_permissions: [],
    permissionsOptions: [],
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.title !== prevState.title) {
        this.setState({ title: this.props.data.title });
      }
      if (this.props.data.permission_code !== prevState.permission_code) {
        this.setState({ permission_code: this.props.data.permission_code });
      }
      if (this.props.data.description !== prevState.description) {
        this.setState({ description: this.props.data.description });
      }
      if (this.props.data.url !== prevState.url) {
        this.setState({ url: this.props.data.url });
      }
      if (this.props.data.type !== prevState.type) {
        this.setState({ type: this.props.data.type });
      }
      if (this.props.data.is_active !== prevState.is_active) {
        this.setState({ is_active: this.props.data.is_active });
      }
      if (this.props.data.parent_id !== prevState.parent_id) {
        this.setState({ parent_id: this.props.data.parent_id });
        if (this.props.data.parent_id) {
          const parent = this.state.parent_permissions.filter(
            (permission) => permission.id === this.props.data.parent_id
          );
          this.setState({
            parent: { value: parent[0].id, label: parent[0].title },
          });
        } else {
          this.setState({
            parent: { value: null, label: "Select Parent Permission" },
          });
        }
      }
    }

    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        title: "",
        permission_code: "",
        description: "",
        url: "",
        type: "",
        is_active: 0,
        parent_id: "",
        parent: { value: null, label: "Select Parent Permission" },
      });
    }

    if (this.addNew) {
      this.setState({
        id: "",
        title: "",
        permission_code: "",
        description: "",
        url: "",
        type: "",
        is_active: 0,
        parent_id: "",
        parent: { value: null, label: "Select Parent Permission" },
      });
    }
    this.addNew = false;
  }

  handleSubmit = () => {
    if (!this.state.title.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Title is required!",
      });
      return;
    }
    if (!this.state.permission_code.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "Permission Code is required!",
      });
      return;
    }
    if (!this.state.url.trim()) {
      this.props.addFlashMessage({
        type: "error",
        text: "URL is required!",
      });
      return;
    }
    if (this.props.data) {
      this.updatePermission();
    } else {
      this.createPermission();
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.getPermissions();
  }

  getPermissions = async () => {
    try {
      let url = "admin/parent_permissions";
      const res = await apiCall("get", url, undefined, this.state.token);
      const options = [{ value: "", label: "Select Parent Permission" }];
      res.data.data.map((option) => {
        options.push({
          value: option.id,
          label: option.title,
        });
      });
      this.setState({
        parent_permissions: res.data.data,
        permissionsOptions: options,
      });
    } catch (err) {
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
    }
  };

  createPermission = async (e) => {
    try {
      // this.setState({ isLoading: true });
      const parent_id = this.state.parent_permissions.filter(
        (per) => per.title === this.state.parent
      );
      const dataUpload = {
        title: this.state.title,
        permission_code: this.state.permission_code,
        description: this.state.description,
        url: this.state.url,
        type: this.state.type,
        is_active: this.state.is_active,
        parent_id: this.state.parent.value,
      };
      let url = `/admin/permissions`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: "Permission Created Successfully!",
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
      this.props.addFlashMessage({
        type: "error",
        text: "Something Went Wrong!",
      });
    }
  };

  updatePermission = async (e) => {
    try {
      const dataUpload = {
        title: this.state.title,
        permission_code: this.state.permission_code,
        description: this.state.description,
        url: this.state.url,
        type: this.state.type,
        is_active: this.state.is_active,
        parent_id: this.state.parent.value,
      };
      console.log("dataUpload", dataUpload);
      let url = `/admin/permissions/${this.props.data.id}`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: "Permission Updated Successfully!",
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
      title,
      permission_code,
      description,
      url,
      iconOptions,
      icon,
      permissionsOptions,
      parent,
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
            <div className="data-list-sidebar-header pt-1 px-2 d-flex justify-content-between primary-bg sidebar-hdr-clr">
              <Plus size={20} />
              <h4 className="sidebar-hdr-clr">
                {data !== null ? "UPDATE PERMISSION" : "ADD NEW PERMISSION"}
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
                placeholder="Title *"
                value={title}
                name="title"
                onChange={this.onChange}
                label="Title *"
                maxLength={50}
                required
              />
              <InputField
                type="text"
                placeholder="Permission Code *"
                value={permission_code}
                name="permission_code"
                onChange={this.onChange}
                label="Permission Code *"
                required
                maxLength={50}
              />
              <InputField
                type="text"
                placeholder="Description"
                value={description}
                name="description"
                onChange={this.onChange}
                label="Description"
                maxLength={500}
              />
              <InputField
                type="text"
                placeholder="URL *"
                value={url}
                name="url"
                onChange={this.onChange}
                label="URL *"
                required
                maxLength={150}
              />
              <Label className="d-block">Parent Permission*</Label>
              <FormGroup className={"form-label-group position-relative"}>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={permissionsOptions[0]}
                  value={parent}
                  name="Parent"
                  options={permissionsOptions}
                  onChange={(e) => {
                    this.setState({ parent: e });
                  }}
                />
              </FormGroup>

              <Row>
                <Col md="6" sm="6" xs="6">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      defaultChecked={this.state.is_active}
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
                      defaultChecked={this.state.type}
                      className="switch-danger"
                      onChange={(check) => {
                        if (check.target.checked) {
                          this.setState({ type: "allow" });
                        } else {
                          this.setState({ type: "disallow" });
                        }
                      }}
                      checked={this.state.type === "allow"}
                    />
                    <span className="label-text">
                      {this.state.type === "allow" ? "Allow" : "Disallow"}
                    </span>
                  </label>
                </Col>
              </Row>
            </PerfectScrollbar>
            <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
              <Button
                color="primary"
                onClick={() => this.handleSubmit(this.state)}
              >
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
})(withRouter(PermissionForm));
// export default PermissionForm;
