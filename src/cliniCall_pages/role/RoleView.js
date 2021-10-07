import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { X, UserCheck, FileText, Trash } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { addFlashMessage } from "../../redux/actions/flashMessages";
import FlashMessage from "../../components/flashMessageList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { formatTime } from "../../utils";
import Spinner from "../../components/@vuexy/spinner/Fallback-spinner";
import "react-toggle/style.css";
import "../../assets/scss/plugins/forms/switch/react-toggle.scss";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import {
  CreatedBy,
  CreatedAt,
  UpdatedBy,
  UpdatedAt,
  DeletedAt,
  DeletedBy,
  RestoredBy,
  Description,
  Status,
} from "../../assets/icons";
import { Icon, DetailsRow } from "../../components";
class RoleForm extends Component {
  state = {
    isLoading: false,
  };
  render() {
    let { show, handleSidebar, data } = this.props;
    console.log(data);
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
            {data !== null ? (
              <React.Fragment>
                <div className="data-list-sidebar-header pt-1 px-2 d-flex justify-content-between primary-bg sidebar-hdr-clr">
                  <UserCheck size={20} />
                  <h4 className="sidebar-hdr-clr">{data.name}</h4>
                  <X size={20} onClick={() => handleSidebar(false, {})} />
                </div>
                <PerfectScrollbar
                  className="px-0 mt-3"
                  options={{ wheelPropagation: false }}
                >
                  {data.description ? (
                    <DetailsRow
                      icon={Description}
                      fieldData={data.description}
                      field="Description"
                    />
                  ) : null}
                  <DetailsRow
                    icon={Status}
                    fieldData={
                      <Chip
                        className="m-0"
                        color={data.is_active === 1 ? "success" : "danger"}
                        text={data.is_active === 1 ? "Active" : "Inactive"}
                      />
                    }
                    field="Status"
                  />
                  {data.created_by ? (
                    <DetailsRow
                      icon={CreatedBy}
                      fieldData={data.created_by.name}
                      field="Created By"
                    />
                  ) : null}
                  {data.created_at ? (
                    <DetailsRow
                      icon={CreatedAt}
                      fieldData={data.created_at}
                      field="Created At"
                    />
                  ) : null}
                  {data.updated_by ? (
                    <DetailsRow
                      icon={UpdatedBy}
                      fieldData={data.updated_by.name}
                      field="Updated By"
                    />
                  ) : null}
                  {data.updated_at ? (
                    <DetailsRow
                      icon={UpdatedAt}
                      fieldData={data.updated_at}
                      field="Updated At"
                    />
                  ) : null}

                  {data.deleted_by ? (
                    <DetailsRow
                      icon={DeletedBy}
                      fieldData={data.deleted_by.name}
                      field="Deleted By"
                    />
                  ) : null}
                  {data.deleted_at ? (
                    <DetailsRow
                      icon={DeletedAt}
                      fieldData={data.deleted_at}
                      field="Deleted At"
                    />
                  ) : null}
                </PerfectScrollbar>
              </React.Fragment>
            ) : null}
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
})(withRouter(RoleForm));
// export default RoleForm;
