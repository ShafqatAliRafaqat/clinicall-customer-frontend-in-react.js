import React, { Component } from "react";
import { Button, Row, Col, FormGroup, Label } from "reactstrap";
import { X, Plus } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { InputField } from "../../components";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { apiCall } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import { MEDICINES_TYPE } from "../../configs/constants";
import Select from "react-select";

class MedicineForm extends Component {
  state = {
    id: "",
    name: "",
    description: "",
    is_active: 0,
    type: MEDICINES_TYPE[0],
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
      if (this.props.data.description !== prevState.description) {
        this.setState({ description: this.props.data.description });
      }
      if (this.props.data.type !== prevState.type) {
        const type = MEDICINES_TYPE.filter(
          (typ) => this.props.data.type === typ.value
        );
        this.setState({ type: type[0] });
      }
      if (this.props.data.is_active !== prevState.is_active) {
        this.setState({ is_active: this.props.data.is_active });
      }
    }

    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        name: "",
        description: "",
        type: MEDICINES_TYPE[0],
        is_active: 0,
      });
    }

    if (this.addNew) {
      this.setState({
        id: "",
        name: "",
        description: "",
        type: MEDICINES_TYPE[0],
        is_active: 0,
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
    if (!this.state.type.value) {
      this.props.addFlashMessage({
        type: "error",
        text: "Type is Required!",
      });
      return;
    }
    if (this.props.data) {
      this.updateMedicine();
    } else {
      this.createMedicine();
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createMedicine = async (e) => {
    try {
      this.setState({ isLoading: true });
      const dataUpload = {
        name: this.state.name,
        description: this.state.description,
        type: this.state.type.value,
        is_active: this.state.is_active ? 1 : 0,
      };
      let url = `/admin/medicine`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: res.data.message,
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
      this.props.addFlashMessage({
        type: "error",
        text: "Something Went Wrong!",
      });
    }
  };

  updateMedicine = async (e) => {
    try {
      const dataUpload = {
        name: this.state.name,
        description: this.state.description,
        type: this.state.type.value,
        is_active: this.state.is_active,
      };

      let url = `/admin/medicine/${this.props.data.id}`;
      const res = await apiCall("post", url, dataUpload, this.state.token);

      this.props.addFlashMessage({
        type: "success",
        text: "Medicine Updated Successfully!",
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
    let { name, description, is_active, type } = this.state;
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
                {data !== null ? "UPDATE MEDICINE" : "ADD NEW MEDICINE"}
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
                placeholder="Name *"
                value={name}
                name="name"
                onChange={this.onChange}
                label="Name *"
                required
              />
              <InputField
                type="text"
                placeholder="Description"
                value={description}
                name="description"
                onChange={this.onChange}
                label="Description"
              />
              <Label className="d-block">Medicine Type*</Label>
              <FormGroup className={"form-label-group position-relative"}>
                <Select
                  className="React"
                  classNamePrefix="select"
                  defaultValue={MEDICINES_TYPE[0]}
                  value={type}
                  name="Type"
                  options={MEDICINES_TYPE}
                  onChange={(e) => {
                    this.setState({ type: e });
                  }}
                />
              </FormGroup>
              <Row>
                <Col md="6" sm="6" xs="6">
                  <label className="react-toggle-wrapper w-25">
                    <Toggle
                      defaultChecked={false}
                      className="switch-danger"
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
})(withRouter(MedicineForm));
// export default MedicineForm;
