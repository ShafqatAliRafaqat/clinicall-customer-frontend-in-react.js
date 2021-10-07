import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import { Check, Lock } from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from "../../redux/actions/data-list";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { apiCall } from "../../utils";
import Loader from "../../components/@vuexy/spinner/Loading-spinner";
import { withRouter } from "react-router-dom";
import query from "query-string";

class AssignPermissions extends Component {
  state = {
    isLoading: false,
    data: [],
    token: this.props.values.userData.token,
    isUpdating: false,
    isUpdated: false,
    roleData: {},
  };

  getPermissions = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params.id) {
        let url = `admin/roles?id=${params.id}`;
        this.setState({
          isLoading: true,
        });
        const res = await apiCall("get", url, undefined, this.state.token);
        const allPermissions = await apiCall(
          "get",
          "admin/parent_permissions",
          undefined,
          this.state.token
        );
        let data = [...allPermissions.data.data];
        data.map((d, index) => {
          let dataa = [...data];
          dataa[index] = { ...d, type: "disallow" };
          dataa[index].child_permission.map((child) => {
            child = { ...child, type: "disallow" };
          });
          data = dataa;
        });
        data.map((per, index) => {
          res.data.data[0].permissions.map((allowed) => {
            let array = [...data];
            if (per.id === allowed.id) {
              array[index] = { ...per, type: "allow" };
              array[index].child_permission.map((child, childIndex) => {
                let childArray = [...array[index].child_permission];
                allowed.child_permission.map((allowedChild, index) => {
                  if (allowedChild.type === "allow")
                    childArray[childIndex] = { ...allowedChild, type: "allow" };
                });
              });
            }
            data = array;
          });
        });
        this.setState({
          data: data,
          isLoading: false,
          roleData: res.data.data[0],
        });
      }
    } catch (err) {
      console.log(err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });
      else
        this.props.addFlashMessage({
          type: "error",
          text: "Something went wrong!",
        });
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.getPermissions();
  }

  handleUpdate = async () => {
    try {
      const params = query.parse(this.props.location.search);
      if (params.id) {
        let url = "admin/create_role_permissions";
        this.setState({
          isUpdating: true,
        });

        const uploadIDs = [];
        this.state.data.map((permission) => {
          if (permission.type === "allow") {
            uploadIDs.push(permission.id);
            if (permission.child_permission.length) {
              permission.child_permission.map((child) => {
                if (child.type === "allow") uploadIDs.push(child.id);
              });
            }
          }
        });
        const res = await apiCall(
          "post",
          url,
          { role_id: params.id, permission_ids: uploadIDs },
          this.state.token
        );
        this.setState({
          isUpdating: false,
          isUpdated: false,
        });
        this.props.addFlashMessage({
          type: "success",
          text: res.data.message,
        });
      }
    } catch (err) {
      console.log(err);
      if (err.response)
        this.props.addFlashMessage({
          type: "error",
          text: err.response.data.message,
        });

      this.setState({
        isUpdating: false,
      });
    }
  };

  render() {
    let { isLoading, data, isUpdating, isUpdated, roleData } = this.state;
    return (
      <React.Fragment>
        <FlashMessage />
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Breadcrumbs
              breadCrumbTitle={`${roleData.name} Permissions`}
              breadCrumbParent="Roles"
              breadCrumbParentLink="/roles"
              breadCrumbActive="Assign Permissions"
            />
            <Card>
              <CardHeader className="border-bottom pb-1 mx-2 px-0">
                <CardTitle>
                  <Lock size={18} />
                  <span className="align-middle ml-50">Manage Permissions</span>
                </CardTitle>
                {!isUpdating ? (
                  <Button
                    color="primary"
                    className="text-right"
                    onClick={this.handleUpdate}
                    disabled={!isUpdated}
                  >
                    Update
                  </Button>
                ) : (
                  <Button color="primary" disabled className="text-right">
                    <Spinner color="white" size="sm" />
                    <span className="ml-50">{isUpdating && "Updating..."}</span>
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                <div style={{ overflowY: "auto", height: "60vh" }}>
                  {data.map((permission, index) => {
                    const check = permission.child_permission.filter(
                      (child) => child.type === "disallow"
                    );
                    if (
                      permission.child_permission.length &&
                      check.length !== permission.child_permission.length
                    ) {
                    }
                    return (
                      <div
                        key={permission.id}
                        style={{
                          padding: "8px",
                          backgroundColor: "#f2f2f2",
                          marginBottom: "10px",
                        }}
                        className="rounded mx-2"
                      >
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label={permission.title}
                          size={10}
                          checked={
                            permission.type === "allow" &&
                            (!permission.child_permission.length ||
                              check.length !==
                                permission.child_permission.length)
                          }
                          onChange={(e) => {
                            this.setState({ isUpdated: true });
                            let newArray = [...this.state.data];

                            let updateValue = "";
                            if (!e.target.checked) {
                              newArray[index] = {
                                ...newArray[index],
                                type: "disallow",
                              };
                              updateValue = "disallow";
                            } else {
                              newArray[index] = {
                                ...newArray[index],
                                type: "allow",
                              };
                              const arr = [];
                              newArray[index].child_permission.length &&
                                newArray[index].child_permission.map((child) =>
                                  arr.push({ ...child, type: "allow" })
                                );
                              updateValue = "allow";
                              newArray[index].child_permission = [...arr];
                            }
                            this.setState({
                              data: newArray,
                            });
                            // if (updatedindex !== -1) {
                            //   const updateArray = [...this.state.updated];
                            //   updateArray[updatedindex] = {
                            //     ...updateArray[updatedindex],
                            //     type: updateValue,
                            //   };
                            //   this.setState({
                            //     data: {
                            //       ...this.state.data,
                            //       permissions: newArray,
                            //     },
                            //     updated: updateArray,
                            //   });
                            // } else {
                            //   this.setState({
                            //     data: {
                            //       ...this.state.data,
                            //       permissions: newArray,
                            //     },
                            //     updated: [
                            //       ...this.state.updated,
                            //       { ...permission, type: updateValue },
                            //     ],
                            //   });
                            // }
                          }}
                        />
                        <div className="row mx-0 ml-2">
                          {permission.child_permission.length &&
                          permission.type === "allow"
                            ? permission.child_permission.map(
                                (child, childIndex) => (
                                  <Checkbox
                                    key={child.id}
                                    color="primary"
                                    icon={
                                      <Check className="vx-icon" size={16} />
                                    }
                                    label={child.title}
                                    checked={child.type === "allow"}
                                    className=" col-md-6 col-lg-6"
                                    onChange={(e) => {
                                      this.setState({ isUpdated: true });
                                      // const updatedindex = this.state.updated.findIndex(
                                      //   (update) => update.id === permission.id
                                      // );
                                      let updateValue = "";
                                      let array = [...this.state.data];
                                      let childArray = [
                                        ...array[index].child_permission,
                                      ];
                                      if (!e.target.checked) {
                                        childArray[childIndex] = {
                                          ...childArray[childIndex],
                                          type: "disallow",
                                        };
                                        updateValue = "disallow";
                                      } else {
                                        childArray[childIndex] = {
                                          ...childArray[childIndex],
                                          type: "allow",
                                        };
                                        updateValue = "allow";
                                      }

                                      array[
                                        index
                                      ].child_permission = childArray;

                                      this.setState({
                                        data: array,
                                      });

                                      // if (updatedindex !== -1) {
                                      //   const updateArray = [
                                      //     ...this.state.updated,
                                      //   ];
                                      //   updateArray[updatedindex] = {
                                      //     ...updateArray[updatedindex],
                                      //     type: updateValue,
                                      //   };

                                      //   this.setState({
                                      //     data: {
                                      //       ...this.state.data,
                                      //       permissions: array,
                                      //     },
                                      //     updated: updateArray,
                                      //   });
                                      // } else {
                                      //   this.setState({
                                      //     data: {
                                      //       ...this.state.data,
                                      //       permissions: array,
                                      //     },
                                      //     updated: [
                                      //       ...this.state.updated,
                                      //       {
                                      //         ...permission,
                                      //         type: updateValue,
                                      //       },
                                      //     ],
                                      //   });
                                      // }
                                    }}
                                  />
                                )
                              )
                            : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataList: state.dataList,
    values: state.auth.login,
  };
};

export default connect(mapStateToProps, {
  getData,
  deleteData,
  addFlashMessage,
  updateData,
  addData,
  getInitialData,
  filterData,
})(withRouter(AssignPermissions));
